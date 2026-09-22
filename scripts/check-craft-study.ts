import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

// Run against the existing user-owned dev server; never starts another server.
const browser = await chromium.launch({ headless: true });
mkdirSync(".scratch/craft-study", { recursive: true });
try {
  for (const width of [1440, 390]) {
    // biome-ignore lint/performance/noAwaitInLoops: Keep viewport checks sequential on the user-owned dev server.
    const page = await browser.newPage({ viewport: { height: 1000, width } });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    const study = page.getByRole("region", {
      name: "Interactive motion study",
    });
    const slider = study.getByRole("slider", { name: "Turn" });
    const reset = study.getByRole("button", { name: "Reset motion study" });
    await study
      .locator("img")
      .evaluate((image: HTMLImageElement) => image.decode());
    assert.equal(await slider.inputValue(), "0");
    assert.equal(await reset.isDisabled(), true);
    await slider.focus();
    await slider.press("ArrowRight");
    assert.equal(await slider.inputValue(), "1");
    assert.equal(await slider.getAttribute("aria-valuetext"), "1 degree right");
    await slider.press("End");
    assert.equal(await slider.inputValue(), "8");
    await reset.click();
    assert.equal(await slider.inputValue(), "0");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await slider.press("Home");
    assert.equal(await slider.inputValue(), "-8");
    await reset.click();
    assert.equal(await reset.isDisabled(), true);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      ),
      `Overflow at ${width}px`
    );
    await page.screenshot({
      fullPage: true,
      path: `.scratch/craft-study/page-${width}.png`,
    });
    await study.screenshot({ path: `.scratch/craft-study/tile-${width}.png` });
    await page.close();
  }
  console.log(
    "Craft study: keyboard, bounds, reset, reduced-motion controls and desktop/mobile overflow passed."
  );
} finally {
  await browser.close();
}
