// biome-ignore-all lint/performance/noAwaitInLoops: Sequential UI actions verify one window lifecycle.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch();
const route = process.argv[2] || "/";
try {
  for (const theme of ["light", "dark"]) {
    for (const width of [1440, 320]) {
      const page = await browser.newPage({ viewport: { height: 1000, width } });
      await page.addInitScript(
        (value) => localStorage.setItem("theme", value),
        theme
      );
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`http://localhost:3000${route}`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1200);
      const dock = page.getByRole("navigation", {
        exact: true,
        name: route === "/prototype/dock" ? "Dock preview" : "Primary",
      });
      const before = await dock.boundingBox();
      const tone = await dock.getAttribute("data-tone");
      assert.ok(
        await dock
          .locator('[aria-hidden="true"]')
          .first()
          .evaluate((element) =>
            getComputedStyle(element).backdropFilter.includes("url(")
          ),
        "Refraction is not enabled by default"
      );
      await dock.getByRole("link", { exact: true, name: "Contact" }).click();
      await page.waitForTimeout(600);
      const nav = page.getByRole("navigation", { name: "Window destinations" });
      assert.equal(await nav.getAttribute("data-tone"), tone);
      const after = await nav.boundingBox();
      for (const key of ["x", "y", "width", "height"])
        assert.ok(
          Math.abs(before[key] - after[key]) < 1,
          `Dock ${key} changed`
        );
      const panel = page.locator('[data-ready="true"]');
      const initial = await panel.boundingBox();
      for (const name of [
        "About",
        "Projects",
        "Experience",
        "Writing",
        "Contact",
      ]) {
        await nav.getByRole("button", { exact: true, name }).click();
        const rect = await panel.boundingBox();
        assert.deepEqual(rect, initial, `${name} changed window dimensions`);
        if (name === "Experience")
          await page.getByRole("list", { name: "Work history" }).waitFor();
        if (name === "Writing")
          await page
            .getByRole("heading", { name: "Notes from the work." })
            .waitFor();
        assert.equal(
          await panel.evaluate(
            (element) => element.scrollWidth > element.clientWidth + 1
          ),
          false,
          `${name} overflows`
        );
      }
      await page.waitForTimeout(250);
      await page.screenshot({
        path: `.scratch/dock-app-${theme}-${width}.png`,
      });
      const dialog = page.getByRole("dialog", { exact: true, name: "Contact" });
      const contact = dialog.getByRole("region", {
        name: "Start a conversation",
      });
      assert.ok(
        await contact.evaluate((element) => {
          const viewport = element.parentElement.parentElement;
          const rect = element.getBoundingClientRect();
          return (
            rect.height >= viewport.clientHeight - 1 &&
            Math.abs(rect.width - viewport.clientWidth) < 2
          );
        }),
        "Contact must fill the window content area before booking"
      );
      await dialog.getByRole("button", { name: "Book a short call" }).click();
      await dialog
        .getByRole("button", { name: "Back to contact options" })
        .focus();
      await page.keyboard.press("Escape");
      assert.equal(await dialog.isVisible(), true);
      await dialog.getByRole("button", { name: "Book a short call" }).waitFor();
      await page
        .getByRole("button", { exact: true, name: "Close window" })
        .click();
      await page.waitForTimeout(550);
      assert.equal(await page.getByRole("dialog").count(), 0);
      assert.equal(await dock.getAttribute("data-tone"), tone);
      assert.equal(
        await dock
          .getByRole("link", { exact: true, name: "Contact" })
          .evaluate((element) => element === document.activeElement),
        true
      );
      await page.emulateMedia({ reducedMotion: "reduce" });
      await dock.getByRole("link", { exact: true, name: "About" }).click();
      await page.waitForTimeout(200);
      await page
        .getByRole("button", { exact: true, name: "Close window" })
        .click();
      await page.waitForTimeout(150);
      assert.equal(await page.getByRole("dialog").count(), 0);
      assert.deepEqual(errors, []);
      await page.close();
    }
  }
  console.log(
    "Standard window size, actual page content, dock continuity and reverse close passed."
  );
} finally {
  await browser.close();
}
