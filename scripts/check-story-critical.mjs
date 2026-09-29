// biome-ignore-all lint/performance/noAwaitInLoops: Drive one real browser through reversible navigation in order.
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import {
  beats,
  chapters,
  PLAYBACK_DURATION,
  positionForYear,
  readingPosition,
  sceneAt,
  yearAt,
} from "../app/story/story-data.ts";

const out =
  process.env.STORY_CAPTURE_DIR || ".impeccable/review/story-critical";
await mkdir(out, { recursive: true });
for (let year = 2004; year <= 2026; year++) {
  const p = positionForYear(year);
  const shot = sceneAt(p);
  assert.equal(yearAt(p), year);
  assert.equal(shot.from, shot.to, `Year ${year} must address a hold`);
}
for (const chapter of chapters) {
  const shot = sceneAt(readingPosition(chapter.position));
  assert.equal(shot.from, shot.to);
}
for (const path of ["app/story/BRIEF.md", "DESIGN.md"]) {
  const doc = await readFile(path, "utf8");
  assert.ok(doc.includes(`${beats.length} `), `${path}: beat count`);
  assert.ok(
    doc.includes(`${chapters.length} chapters`) ||
      doc.includes(`${chapters.length} navigation chapters`)
  );
  assert.ok(
    doc.includes(PLAYBACK_DURATION.toLocaleString("en-US")),
    `${path}: duration`
  );
}
const browser = await chromium.launch({
  args: ["--enable-unsafe-swiftshader"],
});
const errors = [],
  passed = [];
const base = process.env.STORY_URL || "http://127.0.0.1:4182";
const page = await browser.newPage({ viewport: { height: 900, width: 1440 } });
page.on("pageerror", (e) => errors.push(String(e)));
async function check(name, fn) {
  if (
    process.env.STORY_CRITICAL_FILTER &&
    !name.includes(process.env.STORY_CRITICAL_FILTER)
  )
    return;
  await fn();
  passed.push(name);
  console.log(`PASS ${name}`);
}
async function settle() {
  await page.waitForTimeout(240);
}
async function position() {
  return Number(await page.locator("canvas").getAttribute("data-progress"));
}
async function go(p) {
  await page.getByRole("slider").fill(String(Math.round(p * 1000)));
  await settle();
}
async function unobscured(locator) {
  await locator.focus();
  assert.ok(
    await locator.evaluate((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.bottom > innerHeight || document.activeElement !== el)
        return false;
      for (const x of [0.25, 0.5, 0.75])
        for (const y of [0.25, 0.5, 0.75]) {
          const hit = document.elementFromPoint(
            r.x + r.width * x,
            r.y + r.height * y
          );
          if (hit !== el && !el.contains(hit)) return false;
        }
      return true;
    }),
    `Focused control obscured: ${(await locator.textContent()) || (await locator.getAttribute("aria-label"))}`
  );
}
try {
  await page.goto(`${base}/story`, { waitUntil: "networkidle" });
  await page.locator('[data-ready="true"]').waitFor();
  await page.addStyleTag({ content: "nextjs-portal { visibility: hidden; }" });
  await check(
    "Rotation and URL-bar height changes preserve beginning, middle and ending",
    async () => {
      for (const p of [0, 0.65, 1]) {
        await page.setViewportSize({ height: 568, width: 320 });
        await go(p);
        for (const [width, height] of [
          [844, 390],
          [320, 568],
          [390, 844],
          [390, 720],
          [390, 844],
          [844, 390],
        ]) {
          await page.setViewportSize({ height, width });
          await settle();
          assert.ok(
            Math.abs((await position()) - p) < 0.0001,
            `Resize ${width}×${height} lost ${p}: ${await position()}`
          );
        }
      }
    }
  );
  await page.setViewportSize({ height: 900, width: 1440 });
  await check(
    "All 23 year and 12 chapter jumps land on composed holds",
    async () => {
      for (let year = 2004; year <= 2026; year++) {
        await page.getByRole("button", { name: /Insert a year/ }).click();
        await page
          .getByLabel("Year, 2004–2026", { exact: true })
          .fill(String(year));
        await page.getByRole("button", { exact: true, name: "Go" }).click();
        await settle();
        assert.equal(yearAt(await position()), year);
        assert.equal(
          await page.locator("canvas").getAttribute("data-hold"),
          "true"
        );
        if ([2015, 2021, 2025].includes(year))
          await page.screenshot({ path: `${out}/jump-${year}.png` });
      }
      for (let i = 0; i < chapters.length; i++) {
        await page
          .getByRole("button", { exact: true, name: "Choose a chapter" })
          .click();
        await page.locator("dialog ol button").nth(i).click();
        await settle();
        assert.equal(
          await page.locator("canvas").getAttribute("data-hold"),
          "true"
        );
      }
    }
  );
  await check(
    "Previous/Next retain focus at limits; disappearing actions transfer it",
    async () => {
      await go(0.1);
      const prev = page.getByRole("button", {
        exact: true,
        name: "Previous chapter",
      });
      await prev.focus();
      await prev.press("Enter");
      await prev.press("Enter");
      assert.equal(await prev.getAttribute("aria-disabled"), "true");
      assert.ok(await prev.evaluate((el) => document.activeElement === el));
      await go(0.97);
      const next = page.getByRole("button", {
        exact: true,
        name: "Next chapter",
      });
      await next.focus();
      await next.press("Enter");
      assert.equal(await next.getAttribute("aria-disabled"), "true");
      assert.ok(await next.evaluate((el) => document.activeElement === el));
      await page
        .getByRole("button", { exact: true, name: "Back to 2004" })
        .click();
      assert.ok(
        await page
          .locator("[data-story-copy] h1")
          .evaluate((el) => document.activeElement === el)
      );
      for (const [from, to, selector] of [
        [0.97, 0.98, "[data-story-project]"],
        [1, 0.984, "[data-story-ending] a"],
      ]) {
        await go(from);
        await page.locator(selector).first().focus();
        // Dispatch input without focusing the slider, so the disappearing action owns focus.
        await page.getByRole("slider").evaluate(
          (el, value) => {
            Object.getOwnPropertyDescriptor(
              HTMLInputElement.prototype,
              "value"
            ).set.call(el, value);
            el.dispatchEvent(new Event("input", { bubbles: true }));
            el.dispatchEvent(new Event("change", { bubbles: true }));
          },
          String(to * 1000)
        );
        await settle();
        assert.ok(
          await page
            .locator("[data-story-copy] h1")
            .evaluate((el) => document.activeElement === el)
        );
      }
    }
  );
  await check(
    "Pause freezes the pose, including the ending; resume advances from it",
    async () => {
      for (const p of [0.4, 0.992]) {
        await go(p);
        await page
          .getByRole("button", { exact: true, name: "Play journey" })
          .click();
        await page.waitForTimeout(300);
        await page
          .getByRole("button", { exact: true, name: "Pause journey" })
          .press("Space");
        await page.evaluate(
          () =>
            new Promise((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(resolve))
            )
        );
        const paused = await position();
        assert.ok(paused >= p && paused < 1);
        await page.waitForTimeout(400);
        assert.ok(Math.abs((await position()) - paused) < 1e-8);
        await page
          .getByRole("button", { exact: true, name: "Play journey" })
          .click();
        await page.waitForTimeout(250);
        await page
          .getByRole("button", { exact: true, name: "Pause journey" })
          .click();
        assert.ok((await position()) > paused);
      }
    }
  );
  await check(
    "Sticky layers leave focused controls visible across 39 beats and five sizes",
    async () => {
      for (const [width, height] of [
        [1440, 900],
        [390, 844],
        [320, 568],
        [844, 390],
        [768, 1024],
      ]) {
        await page.setViewportSize({ height, width });
        for (const beat of beats) {
          await go(readingPosition(beat.position));
          const controls = page.locator(
            '[data-story-copy] a,[data-story-copy] button,nav[aria-label="Story controls"] button,input[type="range"]'
          );
          for (let j = 0; j < (await controls.count()); j++)
            await unobscured(controls.nth(j));
        }
      }
      for (const name of ["Choose a chapter", "Read the memories"]) {
        await page.getByRole("button", { exact: true, name }).click();
        const controls = page.locator("dialog a,dialog button");
        for (let j = 0; j < (await controls.count()); j++)
          await unobscured(controls.nth(j));
        await page.keyboard.press("Escape");
      }
    }
  );
  await check(
    "Live reduced motion removes the canvas and preserves reading exits and hierarchy",
    async () => {
      await page
        .getByRole("button", { exact: true, name: "Play journey" })
        .click();
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.locator('[data-mode="reading"]').waitFor();
      assert.ok(
        await page
          .locator("article h1")
          .evaluate((el) => document.activeElement === el)
      );
      assert.equal(await page.locator("canvas").count(), 0);
      assert.equal(await page.locator("article h1").count(), 1);
      assert.equal(await page.locator("article h2").count(), 40);
      assert.equal(await page.locator("article h3").count(), 0);
      for (const href of ["/projects", "/contact"])
        await unobscured(page.locator(`article a[href="${href}"]`));
    }
  );
  for (const mode of ["no-js", "no-webgl"]) {
    await check(
      `${mode} retains both reading exits and h2 sections`,
      async () => {
        const context = await browser.newContext({
          javaScriptEnabled: mode !== "no-js",
        });
        if (mode === "no-webgl")
          await context.addInitScript(() => {
            HTMLCanvasElement.prototype.getContext = () => null;
          });
        const fallback = await context.newPage();
        await fallback.goto(`${base}/story`, { waitUntil: "networkidle" });
        await fallback.locator("article h1").waitFor();
        assert.equal(await fallback.locator("article h2").count(), 40);
        assert.equal(
          await fallback
            .locator('article a[href="/projects"],article a[href="/contact"]')
            .count(),
          2
        );
        await context.close();
      }
    );
  }
  assert.deepEqual(errors, []);
} catch (error) {
  await page.screenshot({ path: `${out}/failure.png` });
  console.error(
    await page.evaluate(() => ({
      beat: document.querySelector("canvas")?.dataset.beat,
      focused: document.activeElement?.outerHTML,
      rect: document.activeElement?.getBoundingClientRect().toJSON(),
      viewport: [innerWidth, innerHeight],
    }))
  );
  throw error;
} finally {
  await writeFile(
    `${out}/critical-checks.json`,
    JSON.stringify(
      { errors, passed, testedAt: new Date().toISOString() },
      null,
      2
    )
  );
  await browser.close();
}
