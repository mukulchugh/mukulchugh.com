// biome-ignore-all lint/performance/noAwaitInLoops: Replay each responsive theme sequentially.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch();
try {
  for (const width of [320, 768, 1440]) {
    for (const theme of ["light", "dark"]) {
      const page = await browser.newPage({ viewport: { height: 900, width } });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.addInitScript(
        (value) => localStorage.setItem("theme", value),
        theme
      );
      await page.goto("http://localhost:3000/prototype/footer");
      await page
        .getByRole("button", {
          name:
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        })
        .and(page.locator(":enabled"))
        .waitFor();
      await page.evaluate(() => document.fonts.ready);
      const footer = page.locator("[data-footer-preview] footer");
      await footer.getByRole("link", { name: "Back to top" }).waitFor();
      assert.equal(await page.locator("footer:visible").count(), 1);
      assert.equal(await footer.getByRole("link").count(), 6);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth
        ),
        false
      );
      const links = footer.getByRole("navigation").getByRole("link");
      for (const link of await links.all()) {
        assert.ok((await link.boundingBox()).height >= 44, "Touch target");
      }
      const github = footer.getByRole("link", { name: /GitHub/ });
      assert.equal(
        await github.getAttribute("href"),
        "https://github.com/mukulchugh"
      );
      assert.equal(await github.getAttribute("target"), "_blank");
      const bounds = await footer.boundingBox();
      await github.hover();
      await page.waitForTimeout(300);
      assert.deepEqual(
        await footer.boundingBox(),
        bounds,
        "Hover cannot shift layout"
      );
      await page.screenshot({
        path: `.scratch/footer-index-${theme}-${width}.png`,
      });
      await github.focus();
      await page.keyboard.press("Tab");
      const writing = footer.getByRole("link", {
        exact: true,
        name: "Writing",
      });
      assert.equal(
        await writing.evaluate((el) => el === document.activeElement),
        true
      );
      assert.equal(await writing.getAttribute("href"), "/blog");
      assert.equal(await writing.getAttribute("target"), null);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await github.focus();
      assert.equal(
        await github
          .locator("svg")
          .evaluate((el) => getComputedStyle(el).transform),
        "none"
      );
      await page.setViewportSize({ height: 220, width });
      await footer.getByRole("link", { name: "Back to top" }).click();
      await page.waitForFunction(() => scrollY === 0);
      assert.deepEqual(errors, []);
      await page.close();
    }
  }
  for (const [width, theme] of [
    [320, "dark"],
    [1440, "light"],
  ]) {
    const page = await browser.newPage({
      reducedMotion: "reduce",
      viewport: { height: 900, width },
    });
    await page.addInitScript(
      (value) => localStorage.setItem("theme", value),
      theme
    );
    for (const route of [
      "/",
      "/about",
      "/projects",
      "/projects/brik",
      "/blog",
      "/blog/skip-your-own-api-when-you-own-the-database",
      "/experience",
      "/contact",
    ]) {
      await page.goto(`http://localhost:3000${route}`);
      const footer = page.locator("body > footer");
      const top = footer.getByRole("link", { name: "Back to top" });
      await top.waitFor();
      assert.equal(await footer.getByRole("link").count(), 6, route);
      await page.evaluate(() =>
        scrollTo(0, document.documentElement.scrollHeight)
      );
      await page.waitForTimeout(150);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1
        ),
        false,
        route
      );
      const nav = page.getByRole("navigation", {
        exact: true,
        name: "Primary",
      });
      const box = await footer.boundingBox();
      const dock = await nav.boundingBox();
      assert.ok(
        box.y + box.height <= dock.y,
        `${route}: dock must not cover the footer`
      );
      if (route === "/")
        await page.screenshot({ path: `.scratch/footer-home-${width}.png` });
      await top.click();
      await page.waitForFunction(() => scrollY === 0);
      assert.equal(new URL(page.url()).pathname, route);
    }
    await page.close();
  }
  console.log(
    "Footer prototype: responsive themes, link destinations, focus, stable hover, reduced motion and back-to-top passed."
  );
} finally {
  await browser.close();
}
