// biome-ignore-all lint/performance/noAwaitInLoops: Test each motion preference in isolation.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.env.SITE_URL || "http://localhost:4182";
const browser = await chromium.launch();
try {
  for (const reducedMotion of ["no-preference", "reduce"]) {
    const page = await browser.newPage({ reducedMotion });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/privacy`);
    const toggle = page.getByRole("button", { name: /Switch to .* mode/ });
    await toggle.waitFor();
    await page.waitForFunction(
      () => !document.querySelector("header button")?.disabled
    );
    const scriptUrls = await page
      .locator("script[src]")
      .evaluateAll((scripts) => scripts.map((script) => script.src));
    const initialCode = (
      await Promise.all(
        scriptUrls
          .filter((url) => url.startsWith(base))
          .map(async (url) => (await page.request.get(url)).text())
      )
    ).join("\n");
    assert(
      !initialCode.includes("bookingFieldsResponses"),
      "closed booking code must not load on Privacy"
    );
    assert(
      !initialCode.includes("OpenKVM"),
      "project records must not load on Privacy"
    );
    assert.equal(await toggle.getAttribute("data-native-press"), "");
    const initialLabel = await toggle.getAttribute("aria-label");
    await toggle.focus();
    await page.keyboard.down("Space");
    await page.waitForTimeout(450);
    const scale = await toggle.evaluate(
      (button) => getComputedStyle(button).scale
    );
    assert.equal(scale, reducedMotion === "reduce" ? "none" : "0.97");
    await page.keyboard.up("Space");
    await page.waitForTimeout(500);
    assert.notEqual(await toggle.getAttribute("aria-label"), initialLabel);
    assert.equal(
      await toggle.evaluate((button) => document.activeElement === button),
      true
    );
    assert.equal(
      await toggle.evaluate((button) => getComputedStyle(button).scale),
      "none"
    );
    const home = page.getByRole("link", {
      exact: true,
      name: "Mukul Chugh, home",
    });
    await home.click();
    await page.waitForURL(`${base}/`);
    await page.waitForTimeout(250);
    assert.equal(
      await page
        .locator("body > div")
        .filter({ has: page.locator("main") })
        .first()
        .evaluate((el) => getComputedStyle(el).opacity),
      "1"
    );
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log(
    "Native page chrome: keyboard press, focus, theme switching, navigation, and reduced motion passed."
  );
} finally {
  await browser.close();
}
