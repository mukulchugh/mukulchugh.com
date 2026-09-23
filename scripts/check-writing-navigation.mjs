// biome-ignore-all lint/performance/noAwaitInLoops: Each browser flow must finish before the next.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch();
try {
  for (const reducedMotion of ["no-preference", "reduce"]) {
    const page = await browser.newPage({
      reducedMotion,
      viewport: { height: 844, width: 390 },
    });
    await page.goto("http://localhost:3000/blog");
    await page.getByRole("button", { exact: true, name: "AI Agents" }).click();
    await page.getByRole("link").filter({ hasText: "Read article" }).click();
    await page.waitForURL(/\/blog\/.+/);
    await page.goBack();
    await page
      .getByRole("button", { exact: true, name: "AI Agents" })
      .waitFor();
    assert.equal(
      await page
        .getByRole("button", { exact: true, name: "AI Agents" })
        .getAttribute("aria-pressed"),
      "true"
    );
    await page.getByRole("button", { exact: true, name: "All" }).click();
    await page
      .getByRole("navigation", { name: "Writing pages" })
      .getByRole("button", { exact: true, name: "2" })
      .click();
    await page.waitForTimeout(1000);
    const results = page.getByRole("region", { name: /Articles, page 2 of/ });
    const bounds = await results.boundingBox();
    assert.ok(bounds.y >= 0 && bounds.y < 80, `Page 2 starts at ${bounds.y}`);
    assert.equal(
      await results.evaluate((el) => el === document.activeElement),
      true
    );
    await results.getByRole("link").first().click();
    await page.waitForURL(/\/blog\/.+/);
    await page.goBack();
    await results.waitFor();
    assert.equal(
      await page
        .getByRole("navigation", { name: "Writing pages" })
        .getByRole("button", { exact: true, name: "2" })
        .getAttribute("aria-current"),
      "page"
    );

    await page.goto(
      "http://localhost:3000/blog/agent-stuck-detection-tool-loops"
    );
    await page.getByRole("button", { exact: true, name: "Contents" }).click();
    await page.waitForTimeout(650);
    const tocLink = page.locator("#mobile-toc-content a").nth(1);
    const href = await tocLink.getAttribute("href");
    await tocLink.click();
    await page.waitForTimeout(1000);
    assert.equal(new URL(page.url()).hash, href);
    const heading = page.locator(href);
    const headingBounds = await heading.boundingBox();
    assert.ok(
      headingBounds.y >= 0 && headingBounds.y < 140,
      `TOC ${reducedMotion}: heading at ${headingBounds.y}`
    );
    assert.equal(
      await heading.evaluate((el) => el === document.activeElement),
      true
    );

    await page.goto("http://localhost:3000/");
    await page
      .getByRole("navigation", { exact: true, name: "Primary" })
      .getByRole("link", { exact: true, name: "Writing" })
      .click();
    const writingWindow = page.getByRole("dialog", {
      exact: true,
      name: "Writing",
    });
    await writingWindow
      .getByRole("button", { exact: true, name: "AI Agents" })
      .click();
    assert.equal(
      new URL(page.url()).pathname,
      "/",
      "Dock filter must not navigate the background page"
    );
    assert.equal(
      await writingWindow.isVisible(),
      true,
      "Dock filter must not dismiss the window"
    );
    await page
      .getByRole("navigation", { name: "Window destinations" })
      .getByRole("button", { exact: true, name: "Experience" })
      .click();
    await page
      .getByRole("navigation", { name: "Window destinations" })
      .getByRole("button", { exact: true, name: "Writing" })
      .click();
    assert.equal(
      await writingWindow
        .getByRole("button", { exact: true, name: "AI Agents" })
        .getAttribute("aria-pressed"),
      "true"
    );
    await page.close();
  }
  console.log(
    "Writing Back-state, pagination focus/scroll, and mobile TOC checks passed."
  );
} finally {
  await browser.close();
}
