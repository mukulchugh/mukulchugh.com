// biome-ignore-all lint/performance/noAwaitInLoops: Each pass depends on the
// previous page's route interception state; run sequentially.
// Confirms the archive dialog's full catalog is truly deferred: no request
// until open, a blocked chunk shows the error/retry/fallback UI and
// recovers, and a closed/reopened dialog reuses the cached content.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { chromium } from "playwright";

const chunks = readdirSync(".next/static/chunks").filter(
  (file) =>
    file.endsWith(".js") &&
    readFileSync(`.next/static/chunks/${file}`, "utf8").includes(
      '"collection-"'
    )
);
assert(chunks.length, "No archive chunk found in the production build");

const siteUrl = process.env.SITE_URL || "http://localhost:4182";
const browser = await chromium.launch();
try {
  for (const failFirst of [false, true]) {
    const page = await browser.newPage({
      viewport: { height: 1000, width: 1440 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    let blockArchive = failFirst;
    let archiveRequests = 0;
    await page.route("**/_next/static/chunks/*.js", (route) => {
      if (chunks.some((file) => route.request().url().endsWith(`/${file}`))) {
        archiveRequests++;
        if (blockArchive) return route.abort();
      }
      return route.continue();
    });

    await page.goto(siteUrl);
    assert.equal(archiveRequests, 0, "Archive does not load on entry");

    await page.getByRole("button", { name: /Explore the work/ }).click();
    const dialog = page.getByRole("dialog", { name: "Selected projects" });
    await dialog.waitFor();

    if (failFirst) {
      await dialog.getByRole("alert").waitFor();
      assert.equal(
        await dialog
          .getByRole("link", { name: "View all projects" })
          .getAttribute("href"),
        "/projects"
      );
      blockArchive = false;
      await dialog.getByRole("button", { name: "Try again" }).click();
    }
    await dialog.getByRole("heading", { name: "More to explore" }).waitFor();
    assert(archiveRequests > 0, "Archive chunk was requested once opened");

    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    const requestsBefore = archiveRequests;
    await page.getByRole("button", { name: /Explore the work/ }).click();
    await dialog.getByRole("heading", { name: "More to explore" }).waitFor();
    assert.equal(
      archiveRequests,
      requestsBefore,
      "Reopen uses the cached archive"
    );

    await page.close();
    if (!failFirst)
      assert.deepEqual(errors, [], "No unexpected runtime errors");
    console.log(
      `Archive: first open, ${failFirst ? "network failure and retry, " : ""}Escape and cached reopen passed.`
    );
  }
} finally {
  await browser.close();
}
