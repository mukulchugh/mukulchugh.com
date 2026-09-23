// biome-ignore-all lint/performance/noAwaitInLoops: Sequential captures bound load on the owner's preview.
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const output = ".scratch/audit-fixes";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch();
try {
  for (const theme of ["light", "dark"]) {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({
        reducedMotion: "reduce",
        viewport: { height: 1000, width },
      });
      await page.addInitScript(
        (value) => localStorage.setItem("theme", value),
        theme
      );
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      for (const route of [
        "/blog",
        "/experience",
        "/projects",
        "/blog/agent-stuck-detection-tool-loops",
      ]) {
        await page.goto(`http://localhost:3000${route}`);
        await page.evaluate(() => document.fonts.ready);
        await page.locator("h1").waitFor();
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1
          ),
          `${route}: overflow`
        );
        await page.screenshot({
          fullPage: true,
          path: `${output}/${theme}-${width}-${route.replaceAll("/", "-")}.png`,
        });
      }
      assert.deepEqual(errors, []);
      await page.close();
    }
  }
  console.log(
    "Audit surfaces: 16 full-page captures; no overflow or page exceptions."
  );
} finally {
  await browser.close();
}
