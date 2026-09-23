// biome-ignore-all lint/performance/noAwaitInLoops: Replay touch navigation sequentially.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    hasTouch: true,
    isMobile: true,
    viewport: { height: 844, width: 390 },
  });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  for (const name of ["Next project", "Previous project"]) {
    const button = page.getByRole("button", { exact: true, name });
    await button.evaluate((el) =>
      el.scrollIntoView({ behavior: "instant", block: "center" })
    );
    await page.waitForTimeout(500);
    const before = await page.evaluate(() => window.scrollY);
    const box = await button.boundingBox();
    assert.ok(box);
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(1100);
    assert.equal(
      await page.evaluate(() => window.scrollY),
      before,
      `${name} must not scroll the page`
    );
  }
  console.log(
    "Mobile slider: both touch controls preserve page scroll position."
  );
} finally {
  await browser.close();
}
