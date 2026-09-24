// biome-ignore-all lint/performance/noAwaitInLoops: Seek actual WAAPI frames deterministically.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch();
const failures = [];
try {
  for (const width of [1440, 320]) {
    const page = await browser.newPage({ viewport: { height: 900, width } });
    await page.goto("http://localhost:3000");
    await page
      .getByRole("navigation", { exact: true, name: "Primary" })
      .getByRole("link", { exact: true, name: "About" })
      .click();
    await page.locator('[data-ready="true"]').waitFor();
    const nav = page.getByRole("navigation", { name: "Window destinations" });
    await nav.getByRole("button", { exact: true, name: "Experience" }).click();
    const target = await nav
      .getByRole("button", { exact: true, name: "Experience" })
      .boundingBox();
    const dock = await nav.boundingBox();
    const rect = await page.locator('[data-ready="true"]').boundingBox();
    if (width > 600 && rect.width < width * 0.9)
      failures.push(
        `Window only occupies ${((rect.width / width) * 100).toFixed(1)}% of desktop width`
      );
    await page
      .getByRole("button", { exact: true, name: "Close window" })
      .evaluate((el) => {
        el.click();
        for (const slice of document.querySelectorAll('[class*="slice"]')) {
          for (const animation of slice.getAnimations()) animation.pause();
        }
      });
    for (const time of Array.from({ length: 88 }, (_, i) => 440 - i * 5)) {
      const bounds = await page.evaluate((time) => {
        const slices = [...document.querySelectorAll('[class*="slice"]')];
        for (const el of slices)
          for (const animation of el.getAnimations())
            animation.currentTime = time;
        return slices.map((el) => {
          const r = el.getBoundingClientRect();
          return { bottom: r.bottom, width: r.width, x: r.x, y: r.y };
        });
      }, time);
      const bottom = Math.max(...bounds.map((r) => r.bottom));
      if (bottom > dock.y + 1)
        failures.push(
          `${width}/${time}: shell extends ${(bottom - dock.y).toFixed(1)}px into/below dock`
        );
      if (time === 30) {
        const tail = bounds.at(-1);
        if (
          Math.abs(tail.x + tail.width / 2 - (target.x + target.width / 2)) > 2
        )
          failures.push(
            `${width}: closes to the original icon, not the selected destination`
          );
      }
      if ([400, 220, 30].includes(time)) {
        await page.screenshot({
          path: `.scratch/genie-path-${width}-${time}.png`,
        });
      }
    }
    await page.close();
  }
  assert.deepEqual(failures, []);
  console.log(
    "Genie path stays above the dock, lands on the selected icon, and uses the wider window."
  );
} finally {
  await browser.close();
}
