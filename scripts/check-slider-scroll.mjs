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
  await page.goto(process.env.SITE_URL || "http://localhost:3000", {
    waitUntil: "domcontentloaded",
  });
  for (const name of ["Next project", "Previous project"]) {
    const incoming = await page
      .locator(
        `[data-project][data-slot="${name === "Next project" ? 1 : -1}"]`
      )
      .getAttribute("data-project");
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
      await page
        .locator('[data-project][data-slot="0"]')
        .getAttribute("data-project"),
      incoming,
      "The existing queued card becomes featured"
    );
    assert.ok(
      await page
        .locator('[data-project][data-slot="0"] img')
        .evaluate((image) => image.complete && image.naturalWidth > 0),
      "Featured artwork remains loaded after the handoff"
    );
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
