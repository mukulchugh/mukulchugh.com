// biome-ignore-all lint/performance/noAwaitInLoops: Each viewport uses one isolated browser page.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch();
try {
  for (const width of [390, 1440]) {
    for (const theme of ["light", "dark"]) {
      const page = await browser.newPage({
        reducedMotion: "reduce",
        viewport: { height: 900, width },
      });
      await page.addInitScript(
        (value) => localStorage.setItem("theme", value),
        theme
      );
      await page.goto(
        `${process.env.SITE_URL || "http://localhost:3000"}/experience`
      );
      const roles = page.getByRole("list", { name: "Work history" });
      assert.equal(await roles.locator("article").count(), 8);
      assert.equal(await roles.locator("details[open]").count(), 0);
      const zenduty = roles.locator("article").filter({
        has: page.getByRole("heading", { exact: true, name: "Zenduty" }),
      });
      assert.match(
        await zenduty.innerText(),
        /Founding team · Intern → Software Engineer/
      );
      const summary = zenduty.locator("summary");
      await summary.focus();
      await page.keyboard.press("Enter");
      assert.equal(await zenduty.locator("details").getAttribute("open"), "");
      assert.equal(await zenduty.locator("details li").count(), 6);
      assert.match(
        await zenduty.innerText(),
        /Internal acquisition discussions began in January/
      );
      assert.match(
        await zenduty.innerText(),
        /IMR by Xurrent, formerly Zenduty/
      );
      await page.keyboard.press("Enter");
      assert.equal(await zenduty.locator("details").getAttribute("open"), null);
      assert.equal(
        await summary.evaluate((node) => node === document.activeElement),
        true
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        ),
        true
      );
      await page.close();
    }
  }
  console.log(
    "Experience disclosures, preserved role details, keyboard focus, and responsive layouts passed in both themes."
  );
} finally {
  await browser.close();
}
