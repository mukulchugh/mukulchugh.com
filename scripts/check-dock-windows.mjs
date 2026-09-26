// biome-ignore-all lint/performance/noAwaitInLoops: Sequential UI actions verify one window lifecycle.
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const browser = await chromium.launch();
const route = process.argv[2] || "/";
const base = process.env.SITE_URL || "http://localhost:3000";
await mkdir(".scratch", { recursive: true });
try {
  const noScript = await browser.newPage({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
    viewport: { height: 900, width: 320 },
  });
  for (const path of ["/", "/about", "/contact", "/privacy"]) {
    await noScript.goto(new URL(path, base).href);
    assert(await noScript.locator("main h1").first().isVisible(), path);
    assert((await noScript.locator("main").innerText()).length >= 500, path);
    if (path === "/") {
      const asset = await noScript.request.get(
        new URL("/design/world-map.svg", base).href
      );
      assert.equal(asset.status(), 200);
      const svg = await asset.text();
      const map = noScript.locator(
        'svg:has(use[href="/design/world-map.svg#dots"])'
      );
      for (const theme of ["light", "dark"]) {
        await noScript.evaluate((value) => {
          document.documentElement.className = value;
        }, theme);
        const external = await map.screenshot({
          animations: "disabled",
          path: `.scratch/map-external-${theme}.png`,
        });
        await map.evaluate((element, source) => {
          const use = element.querySelector("use");
          const path = new DOMParser()
            .parseFromString(source, "image/svg+xml")
            .querySelector("path");
          path.setAttribute("class", use.getAttribute("class"));
          use.after(document.importNode(path, true));
          use.style.display = "none";
        }, svg);
        // Compare the cached geometry with the identical inline path.
        // The hidden use keeps the same locator while the pixels are compared.
        assert(
          (
            await map.screenshot({
              animations: "disabled",
              path: `.scratch/map-inline-${theme}.png`,
            })
          ).equals(external),
          `World map parity: ${theme}`
        );
        await map.evaluate((element) => {
          element.querySelector("#dots").remove();
          element.querySelector("use").style.display = "";
        });
      }
    }
  }
  await noScript.close();
  for (const theme of ["light", "dark"]) {
    for (const width of [1440, 320]) {
      const page = await browser.newPage({ viewport: { height: 1000, width } });
      await page.addInitScript(
        (value) => localStorage.setItem("theme", value),
        theme
      );
      const errors = [];
      let writingRequests = 0;
      await page.route("**/dock/posts.json", async (request) => {
        writingRequests += 1;
        if (writingRequests === 1)
          await request.fulfill({ body: "Unavailable", status: 503 });
        else await request.continue();
      });
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(new URL(route, base).href);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1200);
      assert.equal(writingRequests, 0, "Writing must not load before a click");
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
      const panel = page.locator('[data-ready="true"][data-contact]');
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
        if (name === "Writing") {
          await panel.getByRole("alert").waitFor();
          await panel
            .getByRole("link", { name: "Open writing page" })
            .waitFor();
          await panel
            .getByRole("button", { exact: true, name: "Retry" })
            .click();
          await page
            .getByRole("button", { exact: true, name: "All" })
            .waitFor();
          assert.equal(
            writingRequests,
            2,
            "Retry must reload the writing feed"
          );
        }
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
        "Contact must fill the window content area"
      );
      assert.equal(await contact.getAttribute("data-booking"), "true");
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
      const aboutTrigger = dock.getByRole("link", {
        exact: true,
        name: "About",
      });
      await aboutTrigger.click();
      await page.getByRole("dialog", { exact: true, name: "About" }).waitFor();
      await page.waitForTimeout(200);
      await page
        .getByRole("button", { exact: true, name: "Close window" })
        .click();
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      await page.waitForTimeout(250);
      assert.equal(
        await aboutTrigger.evaluate(
          (element) => element === document.activeElement
        ),
        true,
        "Reduced-motion click-close must return focus to the About trigger"
      );

      // Escape must restore focus the same way a click-close does.
      await aboutTrigger.click();
      await page.getByRole("dialog", { exact: true, name: "About" }).waitFor();
      await page.waitForTimeout(200);
      await page.keyboard.press("Escape");
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      await page.waitForTimeout(250);
      assert.equal(
        await aboutTrigger.evaluate(
          (element) => element === document.activeElement
        ),
        true,
        "Reduced-motion Escape-close must return focus to the About trigger"
      );

      // Switching destinations inside the window before closing must return
      // focus to the switched-to destination's own dock trigger, not the
      // original one that launched the window.
      const projectsTrigger = dock.getByRole("link", {
        exact: true,
        name: "Projects",
      });
      await aboutTrigger.click();
      await page.getByRole("dialog", { exact: true, name: "About" }).waitFor();
      await page.waitForTimeout(200);
      await page
        .getByRole("navigation", { name: "Window destinations" })
        .getByRole("button", { exact: true, name: "Projects" })
        .click();
      await page
        .getByRole("dialog", { exact: true, name: "Projects" })
        .waitFor();
      await page.waitForTimeout(200);
      await page
        .getByRole("button", { exact: true, name: "Close window" })
        .click();
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      await page.waitForTimeout(250);
      assert.equal(
        await projectsTrigger.evaluate(
          (element) => element === document.activeElement
        ),
        true,
        "Closing after a destination switch must focus the switched-to trigger"
      );

      // Reopening right after a close must not have its initial focus stolen
      // back by the previous window's return-focus restoration.
      const contactTrigger = dock.getByRole("link", {
        exact: true,
        name: "Contact",
      });
      await contactTrigger.click();
      await page
        .getByRole("dialog", { exact: true, name: "Contact" })
        .waitFor();
      assert.equal(
        await page
          .getByRole("button", { exact: true, name: "Close window" })
          .evaluate((element) => element === document.activeElement),
        true,
        "Reopening immediately after a close must keep the new window's initial focus"
      );
      await page
        .getByRole("button", { exact: true, name: "Close window" })
        .click();
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      assert.deepEqual(errors, []);
      await page.close();
    }
  }
  console.log(
    "Lazy writing, failure recovery, window content, dock continuity, focus and reverse close passed in both themes at 320px and 1440px."
  );
} finally {
  await browser.close();
}
