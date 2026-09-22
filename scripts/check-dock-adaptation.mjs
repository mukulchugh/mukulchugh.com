import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { height: 1000, width: 1440 },
  });
  await page.goto("http://localhost:3000");
  await page.waitForTimeout(1200);
  const dock = page.getByRole("navigation", { exact: true, name: "Primary" });
  await page.evaluate(() => {
    const surface = document.createElement("div");
    surface.id = "dock-test-surface";
    surface.style.cssText =
      "position:fixed;inset:auto 0 0;height:240px;background:rgb(20,20,20);z-index:30";
    const button = document.createElement("button");
    button.textContent =
      "Bright button text should not change the dark surface";
    button.style.cssText =
      "position:absolute;bottom:20px;width:100%;height:60px;background:white;color:black";
    surface.append(button);
    document.body.append(surface);
    window.dispatchEvent(new Event("scroll"));
  });
  await page.waitForTimeout(220);
  assert.equal(await dock.getAttribute("data-tone"), "dark");
  assert.ok(
    await dock
      .locator('[aria-hidden="true"]')
      .first()
      .evaluate((element) =>
        getComputedStyle(element).backdropFilter.includes("url(")
      )
  );
  await page.evaluate(() => {
    document.getElementById("dock-test-surface").style.background = "white";
    window.dispatchEvent(new Event("scroll"));
  });
  await page.waitForTimeout(60);
  assert.equal(
    await dock.getAttribute("data-tone"),
    "dark",
    "Changed before settling"
  );
  await page.waitForTimeout(180);
  assert.equal(
    await dock.getAttribute("data-tone"),
    "light",
    "Did not adapt to actual surface"
  );
  console.log(
    "Foreground button ignored; dark refraction enabled; real surface changes settle before adapting."
  );
} finally {
  await browser.close();
}
