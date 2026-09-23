// biome-ignore-all lint/performance/noAwaitInLoops: Each route is checked in sequence in one browser context.
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { chromium } from "playwright";

const base = process.env.SITE_URL || "http://localhost:3000";
const details = ["projects", "blog"].flatMap((section) =>
  readdirSync(`.next/server/app/${section}`)
    .filter((file) => file.endsWith(".html"))
    .map((file) => `/${section}/${file.replace(/\.html$/, "")}`)
);
const routes = [
  "/",
  "/about",
  "/projects",
  "/blog",
  "/experience",
  "/contact",
  ...details,
  "/missing-design-check",
];
const browser = await chromium.launch();
try {
  for (const [width, theme] of [
    [1440, "light"],
    [320, "dark"],
  ]) {
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
    for (const route of routes) {
      const response = await page.goto(base + route, {
        waitUntil: "domcontentloaded",
      });
      assert.equal(
        response.status(),
        route.startsWith("/missing") ? 404 : 200,
        route
      );
      await page
        .getByRole("navigation", { exact: true, name: "Primary" })
        .waitFor();
      await page
        .getByRole("region", { name: "Start a conversation" })
        .waitFor({ state: "attached" });
      assert.equal(
        await page.locator(".bento-brand-bar:visible").count(),
        1,
        `${route}: header count`
      );
      assert.equal(
        await page
          .getByRole("region", { name: "Start a conversation" })
          .count(),
        1,
        `${route}: CTA count`
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1
        ),
        false,
        `${route}: overflow at ${width}`
      );
      const title = page.locator("h1").first();
      assert.ok(
        (
          await title.evaluate(
            (element) => getComputedStyle(element).fontFamily
          )
        )
          .toLowerCase()
          .includes("syne"),
        `${route}: heading font`
      );
      if (
        [
          "/about",
          "/projects",
          "/blog",
          "/experience",
          "/contact",
          "/projects/brik",
          "/blog/skip-your-own-api-when-you-own-the-database",
        ].includes(route)
      )
        await page.screenshot({
          fullPage: true,
          path: `.scratch/sitewide-${width}-${route.replaceAll("/", "-")}.png`,
        });
    }
    assert.deepEqual(errors, []);
    console.log(
      `${routes.length} routes passed at ${width}px / ${theme}: header, CTA, dock, heading font, overflow and runtime checks.`
    );
    await page.close();
  }
} finally {
  await browser.close();
}
