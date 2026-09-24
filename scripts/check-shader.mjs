// biome-ignore-all lint/performance/noAwaitInLoops: Sequential browser checks avoid competing animations.
import assert from "node:assert/strict";
import { chromium } from "playwright";
import sharp from "sharp";

const base = process.env.SITE_URL || "http://localhost:4182";
const browser = await chromium.launch();
try {
  for (const theme of ["light", "dark"]) {
    const page = await browser.newPage({
      viewport: { height: 1000, width: 1440 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(
      (value) => localStorage.setItem("theme", value),
      theme
    );
    await page.goto(base);
    const canvas = page.locator("#home canvas");
    await canvas.waitFor();
    await page.waitForFunction(
      () => document.querySelector("#home canvas")?.width > 300
    );
    // Wait for a rendered worker frame, not just the transferred blank canvas.
    await page.waitForTimeout(1000);
    const stats = await sharp(await canvas.screenshot()).stats();
    assert.ok(
      stats.channels[1].mean > 180,
      `${theme}: shader must remain lime`
    );
    assert.ok(
      stats.channels[0].stdev > 1,
      `${theme}: shader must render its folds`
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(200);
    const paused = await canvas.screenshot();
    await page.waitForTimeout(250);
    assert.deepEqual(
      await canvas.screenshot(),
      paused,
      "Reduced motion must pause the shader"
    );

    await page.goto(`${base}/blog/skip-your-own-api-when-you-own-the-database`);
    const article = page.locator("#article-content");
    await article.waitFor();
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ height: 1000, width });
      const dimensions = await article.evaluate((element) => ({
        article: element.getBoundingClientRect().width,
        column: element.parentElement.getBoundingClientRect().width,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
      }));
      assert.ok(
        Math.abs(dimensions.article - dimensions.column) < 1,
        "Article must fill its column"
      );
      assert.equal(dimensions.overflow, false, `${width}px: article overflow`);
    }
    assert.deepEqual(errors, []);
    await page.close();
  }

  for (const mode of ["reduced", "unsupported", "failed"]) {
    const page = await browser.newPage({
      reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
    });
    if (mode === "unsupported") {
      await page.addInitScript(() => {
        // biome-ignore lint/performance/noDelete: Simulate an absent browser API, not a present undefined property.
        delete HTMLCanvasElement.prototype.transferControlToOffscreen;
      });
    }
    if (mode === "failed") {
      await page.addInitScript(() => {
        const NativeWorker = window.Worker;
        window.Worker = class extends NativeWorker {
          constructor() {
            super(
              URL.createObjectURL(
                new Blob(["throw new Error('Simulated shader failure')"], {
                  type: "text/javascript",
                })
              )
            );
          }
        };
      });
    }
    await page.goto(base);
    await page.locator("#home h1").waitFor();
    await page.waitForTimeout(1500);
    assert.equal(
      await page.locator("#home canvas").count(),
      0,
      `${mode}: use the CSS fallback`
    );
    await page.close();
  }
  console.log(
    "Shader rendering, reduced motion, failure fallbacks, and full-width articles passed."
  );
} finally {
  await browser.close();
}
