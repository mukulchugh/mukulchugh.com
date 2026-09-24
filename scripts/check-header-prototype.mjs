// biome-ignore-all lint/performance/noAwaitInLoops: Replay focus and hover in each responsive state.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch();
try {
  for (const width of [320, 768, 1440]) {
    for (const theme of ["light", "dark"]) {
      const page = await browser.newPage({ viewport: { height: 700, width } });
      await page.addInitScript(
        (value) => localStorage.setItem("theme", value),
        theme
      );
      await page.goto("http://localhost:3000/prototype/header");
      const header = page.locator("header");
      const identity = header.getByRole("link", { name: "Mukul Chugh, home" });
      const name = identity.locator('span[aria-hidden="true"]');
      const opacity = () => name.evaluate((el) => getComputedStyle(el).opacity);
      assert.equal(await opacity(), "0");
      const initial = await header.boundingBox();
      await identity.hover();
      await page.waitForTimeout(500);
      assert.equal(await opacity(), "1");
      assert.deepEqual(
        await header.boundingBox(),
        initial,
        "Reveal must not resize the tile"
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth
        ),
        false
      );
      // The revealed name is part of the same hover target, not a dead zone.
      await name.hover();
      await page.waitForTimeout(100);
      assert.equal(await opacity(), "1");
      // Reversing before completion must settle cleanly without a reset.
      await page.mouse.move(0, 500);
      await page.waitForTimeout(70);
      await identity.hover();
      await page.waitForTimeout(500);
      assert.equal(await opacity(), "1");
      await page.mouse.move(0, 500);
      await page.waitForTimeout(500);
      assert.equal(await opacity(), "0");
      await page.keyboard.press("Tab");
      assert.equal(
        await identity.evaluate((el) => el === document.activeElement),
        true
      );
      await page.waitForTimeout(500);
      assert.equal(await opacity(), "1");
      await page.screenshot({
        path: `.scratch/header-tile-${theme}-${width}-focus.png`,
      });
      await page.keyboard.press("Tab");
      await page.waitForTimeout(500);
      assert.equal(await opacity(), "0");
      const toggle = header.getByRole("button", { name: /Switch to/ });
      await toggle.click();
      await page.waitForFunction(
        (previous) =>
          document.documentElement.classList.contains(
            previous === "dark" ? "light" : "dark"
          ),
        theme
      );
      await page.emulateMedia({ reducedMotion: "reduce" });
      await identity.focus();
      assert.ok(
        await name.evaluate((el) =>
          getComputedStyle(el)
            .transitionDuration.split(",")
            .every((duration) => Number.parseFloat(duration) <= 0.001)
        ),
        "Reduced motion must resolve immediately"
      );
      assert.equal(await header.locator("nav").count(), 0);
      await page.close();
    }
  }
  for (const width of [320, 768, 1440]) {
    for (const theme of ["light", "dark"]) {
      const page = await browser.newPage({
        reducedMotion: "reduce",
        viewport: { height: 900, width },
      });
      await page.addInitScript(
        (value) => localStorage.setItem("theme", value),
        theme
      );
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      for (const route of [
        "/",
        "/about",
        "/projects",
        "/projects/brik",
        "/blog",
        "/blog/skip-your-own-api-when-you-own-the-database",
        "/experience",
        "/contact",
      ]) {
        const response = await page.goto(`http://localhost:3000${route}`);
        assert.equal(response.status(), 200, route);
        const header = page.locator(".bento-brand-bar:visible");
        assert.equal(await header.count(), 1, route);
        await header
          .getByRole("button", {
            name:
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
          })
          .and(page.locator(":enabled"))
          .waitFor();
        await header.locator("img").evaluate(async (img) => {
          await img.decode();
          await document.fonts.ready;
        });
        assert.ok(
          (await header.locator("img").getAttribute("src")).includes(
            theme === "dark" ? "logo-white" : "logo-black"
          ),
          `${route}: theme-aware logo`
        );
        const identity = header.getByRole("link", {
          name: "Mukul Chugh, home",
        });
        await identity.focus();
        const geometry = await header.evaluate((el) => {
          const style = getComputedStyle(el);
          const label = el.querySelector('span[aria-hidden="true"]');
          const toggle = el.querySelector("button");
          return {
            border: style.borderTopWidth,
            opacity: getComputedStyle(label).opacity,
            overflow: document.documentElement.scrollWidth > innerWidth + 1,
            overlap:
              label.getBoundingClientRect().right >
              toggle.getBoundingClientRect().left,
            radius: style.borderRadius,
          };
        });
        assert.deepEqual(
          geometry,
          {
            border: "1px",
            opacity: "1",
            overflow: false,
            overlap: false,
            radius: "14px",
          },
          `${route}, ${width}, ${theme}`
        );
        if (["/", "/about"].includes(route)) {
          await page.screenshot({
            path: `.scratch/header-live-${theme}-${width}-${route === "/" ? "home" : "about"}.png`,
          });
        }
      }
      assert.deepEqual(errors, []);
      await page.close();
    }
  }
  console.log(
    "Identity tile: hover, keyboard reveal, stable bounds, theme switching, reduced motion and responsive widths passed."
  );
} finally {
  await browser.close();
}
