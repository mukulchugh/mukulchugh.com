// biome-ignore-all lint/performance/noAwaitInLoops: Each scenario follows a real window lifecycle.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch();
try {
  for (const theme of ["light", "dark"]) {
    for (const reducedMotion of ["no-preference", "reduce"]) {
      const page = await browser.newPage({
        reducedMotion,
        viewport: { height: 1000, width: 1440 },
      });
      await page.addInitScript(
        (value) => localStorage.setItem("theme", value),
        theme
      );
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("http://localhost:3000");
      const dock = page.getByRole("navigation", {
        exact: true,
        name: "Primary",
      });
      await page.waitForFunction(() =>
        document
          .querySelector('nav[aria-label="Primary"] > div')
          ?.style.backdropFilter.includes("url(")
      );
      const optics = await dock.locator(":scope > div").evaluate((element) => ({
        clip: getComputedStyle(element).clipPath,
        extraLayer: getComputedStyle(element, "::after").content,
      }));
      assert.equal(optics.clip, "inset(0px round 999px)");
      assert.equal(optics.extraLayer, "none", "No nested blur layer");
      await page
        .locator('[data-project][data-slot="0"]')
        .evaluate((element) => {
          window.scrollTo({
            behavior: "instant",
            top:
              element.getBoundingClientRect().top +
              window.scrollY +
              element.clientHeight * 0.7 -
              window.innerHeight +
              70,
          });
        });
      await page.waitForTimeout(300);
      await page.screenshot({
        path: `.scratch/dock-optics-${theme}-${reducedMotion}.png`,
      });
      await dock.getByRole("link", { exact: true, name: "Writing" }).click();
      await page.locator('[data-ready="true"]').waitFor();
      const scroller = page
        .locator('[data-ready="true"] [class*="content"]')
        .first();
      await scroller.evaluate((element) => {
        element.scrollTop = 900;
      });
      assert.ok(await scroller.evaluate((element) => element.scrollTop > 0));
      const switcher = page.getByRole("navigation", {
        name: "Window destinations",
      });
      await switcher
        .getByRole("button", { exact: true, name: "Experience" })
        .click();
      assert.equal(
        await scroller.evaluate((element) => element.scrollTop),
        0,
        "Destination must start at top"
      );
      await page
        .getByRole("dialog")
        .getByRole("link", { name: "Back to overview" })
        .click();
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      await page.waitForURL("**/#experience");
      await dock.getByRole("link", { exact: true, name: "About" }).click();
      await page.locator('[data-ready="true"]').waitFor();
      await page.setViewportSize({ height: 640, width: 320 });
      await page.waitForTimeout(250);
      const rect = await switcher.boundingBox();
      assert.ok(
        rect.x >= 0 &&
          rect.y >= 0 &&
          rect.x + rect.width <= 320 &&
          rect.y + rect.height <= 640,
        "Open dock must stay in viewport after resize"
      );
      const panel = await page.locator('[data-ready="true"]').boundingBox();
      assert.ok(
        panel.x >= 0 &&
          panel.y >= 0 &&
          panel.x + panel.width <= 320 &&
          panel.y + panel.height <= rect.y,
        "Window must stay above dock"
      );
      await page.screenshot({
        path: `.scratch/dock-regression-${theme}-${reducedMotion}.png`,
      });
      await page
        .getByRole("button", { exact: true, name: "Close window" })
        .click();
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      const restored = await dock.boundingBox();
      for (const key of ["x", "y", "width", "height"])
        assert.ok(
          Math.abs(restored[key] - rect[key]) < 1,
          `Resize close changed dock ${key}`
        );
      assert.deepEqual(errors, []);
      await page.close();
    }
  }
  console.log(
    "Dock overview navigation, destination scroll, responsive geometry and close passed in both themes and motion modes."
  );
} finally {
  await browser.close();
}
