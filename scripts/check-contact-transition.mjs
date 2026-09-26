// biome-ignore-all lint/performance/noAwaitInLoops: Each scenario follows a real open/close lifecycle.
// Regression coverage for the element-scoped View Transition candidate in
// ContactSection. No Cal POSTs happen here; this only exercises the
// open/close toggle, not the booking form.
import assert from "node:assert/strict";
import { chromium } from "playwright";

// Only count Contact's own native-transition animations -- unrelated
// shader/game activity elsewhere on the page also runs on the timeline and
// would make a raw global getAnimations() count flaky.
const countContactVtAnimations = () =>
  document
    .getAnimations({ subtree: true })
    .filter(
      (a) =>
        a.animationName?.includes("view-transition") ||
        a.animationName?.includes("contact-vt-leaf")
    ).length;

const base = process.env.SITE_URL || "http://localhost:4182";
const browser = await chromium.launch();
try {
  // Prove the native transition actually starts in supported mode (real
  // ::view-transition-* animations exist, pausable at a known phase), and
  // that leaf snapshots render at intrinsic size -- both the default
  // (positive) and a deliberately reintroduced cover/stretch override
  // (negative), so this check would actually catch the regression that was
  // rejected. Also assert the real height-snapshot bug: the "new" panel
  // snapshot must be captured at the true final (closed) height, not the
  // old tall one.
  //
  // getComputedStyle for ::view-transition-* pseudos must be scoped to the
  // transition-root element itself (`section`), not document.documentElement
  // -- verified the latter silently returns UA defaults instead of author
  // styles here. Element.prototype.startViewTransition is wrapped so the
  // real ViewTransition object (not a guess about timing) is available.
  {
    const page = await browser.newPage({
      viewport: { height: 1000, width: 1440 },
    });
    await page.addInitScript(() => {
      const original = Element.prototype.startViewTransition;
      Element.prototype.startViewTransition = function wrapped(options) {
        const transition = original.call(this, options);
        window.__vt = transition;
        window.__vtRoot = this;
        return transition;
      };
    });
    await page.goto(`${base}/contact`);
    await page.locator("[aria-controls]").waitFor();
    const name = await page.evaluate(
      () => document.querySelector("[aria-controls]").style.viewTransitionName
    );
    const callName = await page.evaluate(
      () => document.querySelector('[class*="call"]').style.viewTransitionName
    );
    const objectFitAt = async (phaseMs) => {
      await page.evaluate(() =>
        document
          .querySelector(
            '[aria-label="Back to contact options"], [aria-label="Book a short call"]'
          )
          ?.click()
      );
      const result = await page.evaluate(async (ms) => {
        await window.__vt.ready;
        const animations = window.__vtRoot.getAnimations({ subtree: true });
        for (const a of animations) {
          a.pause();
          a.currentTime = ms;
        }
        return {
          animationCount: animations.filter((a) => a.effect?.pseudoElement)
            .length,
        };
      }, phaseMs);
      assert.ok(
        result.animationCount > 6,
        "Native view transition must actually start (many pseudo-element animations), not silently no-op"
      );
      const fit = await page.evaluate(
        (n) =>
          getComputedStyle(window.__vtRoot, `::view-transition-old(${n})`)
            .objectFit,
        name
      );
      const capturedCallHeight = await page.evaluate((n) => {
        // The animation's own last keyframe is the definitive captured
        // "new" value -- unlike a computed-style read, it doesn't depend
        // on which currentTime the animation happens to be paused at.
        const anim = window.__vtRoot
          .getAnimations({ subtree: true })
          .find(
            (a) => a.effect?.pseudoElement === `::view-transition-group(${n})`
          );
        const frames = anim?.effect.getKeyframes();
        return frames?.at(-1)?.height;
      }, callName);
      await page.evaluate(() => {
        for (const a of window.__vtRoot.getAnimations({ subtree: true }))
          a.play();
      });
      await page.waitForTimeout(800);
      return { capturedCallHeight, fit };
    };
    const positive = await objectFitAt(60);
    // Measured after objectFitAt settles (plays the transition through and
    // waits), so this is the true closed layout to compare the capture against.
    const naturalClosedHeight = await page.evaluate(() =>
      document.querySelector('[class*="call"]').getBoundingClientRect()
    );
    assert.equal(
      positive.fit,
      "none",
      "Leaf snapshot must render at intrinsic size by default (positive case)"
    );
    // The "new" snapshot's captured height (final keyframe of the panel
    // group) must reflect the true closed layout, not the old open one --
    // this is the actual bug: creating the height WAAPI animation inside
    // update() applied its first keyframe before capture and pinned the
    // "new" snapshot back to the old (tall) height.
    assert.ok(
      Math.abs(
        Number.parseFloat(positive.capturedCallHeight) -
          naturalClosedHeight.height
      ) < 2,
      `Captured new-state call panel height (${positive.capturedCallHeight}) must match the natural closed layout (${naturalClosedHeight.height}px)`
    );
    await page.addStyleTag({
      content: `::view-transition-old(${name}) { object-fit: cover !important; }`,
    });
    assert.equal(
      (await objectFitAt(60)).fit,
      "cover",
      "Sanity: the deliberately reintroduced cover/stretch override must actually apply, proving this check would catch the rejected regression"
    );
    await page.close();
  }

  // Escape pressed immediately after opening (before the deferred update()
  // has committed React state) must cancel that open intent locally, not
  // bubble past the section and close an enclosing dock window.
  {
    const page = await browser.newPage({
      viewport: { height: 1000, width: 1440 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/`);
    const section = page.locator('[aria-label="Start a conversation"]');
    await section.scrollIntoViewIfNeeded();
    await section.getByRole("button", { name: "Book a short call" }).click();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(700);
    assert.equal(
      await section.getAttribute("data-booking"),
      "false",
      "Escape must cancel a still-pending open, not leave it open"
    );
    assert.deepEqual(errors, []);
    await page.close();
  }

  // Interruption: rapid re-clicks must not throw and must land on the last
  // requested state, with focus returning to the trigger on close.
  {
    const page = await browser.newPage({
      viewport: { height: 1000, width: 1440 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/contact`);
    const trigger = '[aria-controls$="-calendar"]';
    await page.locator(trigger).waitFor();
    for (let i = 0; i < 5; i++) {
      await page.evaluate(
        (sel) => document.querySelector(sel)?.click(),
        trigger
      );
      await page.evaluate(() => new Promise(requestAnimationFrame));
    }
    await page.waitForTimeout(700);
    const expanded = await page
      .locator('[aria-controls$="-calendar"]')
      .first()
      .getAttribute("aria-expanded");
    assert.equal(
      expanded,
      "false",
      "Starting open, 5 alternating toggles must end closed"
    );
    assert.deepEqual(errors, [], "No page errors during rapid interruption");
    await page.close();
  }

  // Escape closes and restores focus; geometry round-trips exactly after a
  // full open/close cycle (the real regression: no leftover reflow offset).
  {
    const page = await browser.newPage({
      viewport: { height: 1000, width: 1440 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/`);
    const section = page.locator('[aria-label="Start a conversation"]');
    await section.scrollIntoViewIfNeeded();
    const lede = () => section.locator("p").first().boundingBox();
    const before = await lede();
    await section.getByRole("button", { name: "Book a short call" }).click();
    await page.waitForTimeout(700);
    assert.equal(
      await section.getAttribute("data-booking"),
      "true",
      "Opens on click"
    );
    await page.keyboard.press("Escape");
    await page.waitForTimeout(700);
    assert.equal(
      await section.getAttribute("data-booking"),
      "false",
      "Escape closes"
    );
    assert.equal(
      await page.evaluate(() =>
        document.activeElement?.getAttribute("aria-label")
      ),
      "Book a short call",
      "Focus returns to the trigger after Escape"
    );
    const after = await lede();
    for (const key of ["x", "y", "width", "height"])
      assert.ok(
        Math.abs(before[key] - after[key]) < 0.5,
        `Lede paragraph ${key} must round-trip exactly, was ${before[key]} now ${after[key]}`
      );
    assert.deepEqual(errors, [], "No page errors across the round trip");
    await page.close();
  }

  // Reduced motion bypasses the View Transition entirely: instant, correct,
  // and no ::view-transition pseudo-animations are created.
  {
    const page = await browser.newPage({
      reducedMotion: "reduce",
      viewport: { height: 1000, width: 1440 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/contact`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    const baseline = await page.evaluate(countContactVtAnimations);
    await page.evaluate(() =>
      document.querySelector('[aria-label="Back to contact options"]')?.click()
    );
    await page.waitForTimeout(50);
    assert.equal(
      await page.evaluate(countContactVtAnimations),
      baseline,
      "Reduced motion must not spawn view-transition animations"
    );
    assert.equal(
      await page
        .locator('[aria-label="Start a conversation"]')
        .getAttribute("data-booking"),
      "false"
    );
    assert.deepEqual(errors, []);
    await page.close();
  }

  // Honest fallback: browsers without Element#startViewTransition still
  // toggle correctly, with no console errors.
  {
    const page = await browser.newPage({
      viewport: { height: 1000, width: 1440 },
    });
    await page.addInitScript(() => {
      // @ts-expect-error test-only removal
      Element.prototype.startViewTransition = undefined;
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/contact`);
    await page.evaluate(() =>
      document.querySelector('[aria-label="Back to contact options"]')?.click()
    );
    await page.waitForTimeout(500);
    assert.equal(
      await page
        .locator('[aria-label="Start a conversation"]')
        .getAttribute("data-booking"),
      "false",
      "Fallback still reaches the closed state"
    );
    assert.deepEqual(errors, [], "No errors when the API is unsupported");
    await page.close();
  }

  // Dock default-open instance: same toggle must work inside the window,
  // scoped only to that instance (no cross-instance name collisions).
  {
    const page = await browser.newPage({
      viewport: { height: 900, width: 1440 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/`);
    await page
      .getByRole("navigation", { exact: true, name: "Primary" })
      .getByRole("link", { exact: true, name: "Contact" })
      .click();
    const dialog = page.getByRole("dialog", { name: "Contact" });
    await dialog.waitFor();
    const back = dialog.getByRole("button", {
      name: "Back to contact options",
    });
    await back.waitFor();
    await back.click();
    await page.waitForTimeout(700);
    assert.equal(
      await dialog
        .locator('[aria-label="Start a conversation"]')
        .getAttribute("data-booking"),
      "false"
    );
    assert.deepEqual(errors, []);
    await page.close();
  }

  // Dock fill: Contact must actually fill the dock window's content area in
  // both booking states, at narrow/medium/wide viewports -- not just its
  // outer .frame wrapper. (Regression: min-height:100% on the section
  // couldn't resolve against the frame's own indeterminate height, so the
  // background filled but the actual content visibly didn't when closed.)
  for (const [width, height] of [
    [320, 900],
    [390, 900],
    [1440, 900],
  ]) {
    const page = await browser.newPage({ viewport: { height, width } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/`);
    await page
      .getByRole("navigation", { exact: true, name: "Primary" })
      .getByRole("link", { exact: true, name: "Contact" })
      .click();
    const dialog = page.getByRole("dialog", { name: "Contact" });
    const tile = dialog.locator("[data-booking]");
    await tile.waitFor();
    await page.waitForTimeout(700);
    for (const state of ["true", "false"]) {
      if (state === "false") {
        await dialog
          .getByRole("button", { name: "Back to contact options" })
          .click();
        await page.waitForTimeout(700);
      }
      const data = await tile.evaluate((section) => {
        const frame = section.parentElement;
        const content = frame.closest('[class*="content"]');
        const rect = (el) => el.getBoundingClientRect();
        return {
          contentHeight: rect(content).height,
          frameHeight: rect(frame).height,
          sectionHeight: rect(section).height,
        };
      });
      assert.ok(
        data.sectionHeight >= data.contentHeight - 2,
        `${width}x${height} booking=${state}: section (${data.sectionHeight}) must fill the dock content area (${data.contentHeight}), not just the frame`
      );
      assert.ok(
        data.frameHeight >= data.sectionHeight - 2,
        `${width}x${height} booking=${state}: frame (${data.frameHeight}) must not clip the section (${data.sectionHeight})`
      );
    }
    assert.deepEqual(errors, []);
    await page.close();
  }

  console.log(
    "PASS: contact booking transition interruption, Escape/focus, geometry round-trip, reduced motion, unsupported fallback, and dock instance all behave correctly."
  );
} finally {
  await browser.close();
}
