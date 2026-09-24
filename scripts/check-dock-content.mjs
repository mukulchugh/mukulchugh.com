// biome-ignore-all lint/performance/noAwaitInLoops: Check each visible destination in sequence.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch();
const failures = [];
try {
  for (const theme of ["light", "dark"]) {
    for (const width of [1440, 320]) {
      const page = await browser.newPage({ viewport: { height: 900, width } });
      await page.addInitScript(
        (value) => localStorage.setItem("theme", value),
        theme
      );
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("http://localhost:3000");
      await page
        .getByRole("navigation", { exact: true, name: "Primary" })
        .getByRole("link", { exact: true, name: "About" })
        .click();
      await page.locator('[data-ready="true"]').waitFor();
      for (const name of [
        "About",
        "Projects",
        "Writing",
        "Experience",
        "Contact",
      ]) {
        await page
          .getByRole("navigation", { name: "Window destinations" })
          .getByRole("button", { exact: true, name })
          .click();
        const dialog = page.getByRole("dialog", { exact: true, name });
        await dialog.waitFor();
        await page.waitForTimeout(200);
        await page.screenshot({
          path: `.scratch/window-content-${theme}-${width}-${name}.png`,
        });
        const check = async (locator, expected, label) => {
          const count = await locator.count();
          if (count !== expected)
            failures.push(
              `${theme}/${width}/${name}: ${label} ${count}, expected ${expected}`
            );
        };
        await check(
          dialog.locator(".bento-brand-bar:visible"),
          0,
          "site headers"
        );
        await check(dialog.locator("h1:visible"), 0, "duplicate page titles");
        await check(
          dialog.getByRole("region", { name: "Start a conversation" }),
          name === "Contact" ? 1 : 0,
          "contact CTAs"
        );
        await check(
          dialog.getByRole("link", { name: "Back to overview" }),
          0,
          "overview links"
        );
        if (name === "Experience")
          await check(
            dialog.getByRole("list", { name: "Work history" }),
            1,
            "work history"
          );
        if (name === "Writing")
          await check(
            dialog.getByRole("button", { exact: true, name: "All" }),
            1,
            "topic filter"
          );
        assert.equal(
          await dialog.evaluate((el) => el.scrollWidth > el.clientWidth + 1),
          false
        );
      }
      assert.deepEqual(errors, []);
      await page.close();
    }
  }
  assert.deepEqual(failures, []);
  console.log(
    "All five dock windows: content-only layouts, retained controls, both themes and desktop/mobile passed."
  );
} finally {
  await browser.close();
}
