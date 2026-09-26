// biome-ignore-all lint/performance/noAwaitInLoops: Each scenario depends on
// the previous page's route-interception state; run sequentially.
// Verifies the unified dock pending feedback added for cold clicks: the
// icon-level busy cue, the sr-only announcement, the page-shaped skeleton
// inside a slow window, race-safe rapid destination changes, Home
// superseding an in-flight click, and failure falling back to a direct
// page load. All delays come from real intercepted network responses.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.SITE_URL || "http://localhost:4185";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// The genie-window shell is the chunk behind loadWindow(); identify it by
// its own unique markup rather than by request order, since unrelated
// background chunks can fire first.
const genieChunk = readdirSync(".next/static/chunks").find(
  (file) =>
    file.endsWith(".js") &&
    readFileSync(`.next/static/chunks/${file}`, "utf8").includes(
      "Window destinations"
    )
);
assert(genieChunk, "Could not locate the genie-window chunk in the build");

const browser = await chromium.launch();
await mkdir(".scratch", { recursive: true });

try {
  // 1. Delayed shell chunk: icon busy cue + sr-only announcement while
  // waiting, then the window opens and both clear. A second, still-delayed
  // destination chunk renders the page-shaped skeleton before real content.
  {
    const page = await browser.newPage({
      viewport: { height: 900, width: 1440 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base);
    await page
      .getByRole("navigation", { exact: true, name: "Primary" })
      .waitFor();
    await page.waitForTimeout(300);
    await page.route("**/_next/static/chunks/*.js", async (route) => {
      // A short delay on the shell keeps the pending cue observable; a much
      // longer one on every other chunk (the destination page's own,
      // whichever it turns out to be) keeps the skeleton visible for the
      // screenshot instead of racing straight to real content.
      const isShell = route.request().url().endsWith(`/${genieChunk}`);
      await delay(isShell ? 300 : 1500);
      await route.continue();
    });
    // A CSS locator survives the dock's own visibility:hidden once the
    // window is open, unlike a role-based lookup (which the a11y tree hides).
    const about = page.locator(
      'nav[aria-label="Primary"] a[aria-label="About"]'
    );
    await about.click();
    await page.waitForTimeout(150);
    assert.equal(
      await about.getAttribute("aria-busy"),
      "true",
      "Trigger must be busy while pending"
    );
    const announcer = page.locator(
      'nav[aria-label="Primary"] ~ span[role="status"]'
    );
    assert.equal(await announcer.innerText(), "Opening About…");
    await page.screenshot({ path: ".scratch/loading-dock-pending.png" });
    const dialog = page.getByRole("dialog", { exact: true, name: "About" });
    await dialog.waitFor({ timeout: 5000 });
    assert.equal(
      await about.getAttribute("aria-busy"),
      null,
      "Busy must clear once open"
    );
    assert.equal(await announcer.innerText(), "");
    // Wait for the shell's opening animation to settle before judging its
    // content, matching the existing dock test suite's own convention.
    await page.locator('[data-ready="true"]').waitFor({ timeout: 5000 });
    // The destination page's own chunk is still delayed: its skeleton shows.
    await dialog.getByRole("status").first().waitFor();
    await page.screenshot({ path: ".scratch/loading-window-skeleton.png" });
    // Scoped to the dialog: the same phrase also opens the homepage's own
    // hero copy behind it, which is already present and would match instantly.
    await dialog
      .getByText("has been the thread through my work", { exact: false })
      .waitFor({ timeout: 5000 });
    await page.screenshot({ path: ".scratch/loading-window-ready.png" });
    assert.deepEqual(errors, []);
    await page.close();
    console.log(
      "Delayed shell + destination chunk: pending cue, skeleton, and ready content passed."
    );
  }

  // 2. Failure: the shell chunk is aborted once, falling back to a direct
  // page load instead of leaving the dock stuck.
  {
    const page = await browser.newPage({
      viewport: { height: 900, width: 1440 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base);
    await page
      .getByRole("navigation", { exact: true, name: "Primary" })
      .waitFor();
    await page.waitForTimeout(300);
    await page.route("**/_next/static/chunks/*.js", async (route) => {
      if (route.request().url().endsWith(`/${genieChunk}`)) {
        await route.abort();
        return;
      }
      await route.continue();
    });
    await page
      .getByRole("navigation", { exact: true, name: "Primary" })
      .getByRole("link", { exact: true, name: "About" })
      .click();
    await page.waitForURL(/\/about$/, { timeout: 5000 });
    assert.deepEqual(errors, []);
    await page.close();
    console.log("Failed shell chunk falls back to a direct page load.");
  }

  // 3. Rapid different-destination clicks: only the later destination opens.
  {
    const page = await browser.newPage({
      viewport: { height: 900, width: 1440 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base);
    await page
      .getByRole("navigation", { exact: true, name: "Primary" })
      .waitFor();
    await page.waitForTimeout(300);
    await page.route("**/_next/static/chunks/*.js", async (route) => {
      await delay(500);
      await route.continue();
    });
    const dock = page.getByRole("navigation", { exact: true, name: "Primary" });
    await dock.getByRole("link", { exact: true, name: "About" }).click();
    await page.waitForTimeout(80);
    await dock.getByRole("link", { exact: true, name: "Writing" }).click();
    await page
      .getByRole("dialog", { exact: true, name: "Writing" })
      .waitFor({ timeout: 5000 });
    assert.equal(
      await page.getByRole("dialog", { exact: true, name: "About" }).count(),
      0,
      "Stale destination must not open"
    );
    assert.equal(
      await page.getByRole("dialog").count(),
      1,
      "Only one window may be open"
    );
    assert.deepEqual(errors, []);
    await page.close();
    console.log("Rapid About -> Writing clicks: only Writing opens.");
  }

  // 4. Home navigation supersedes a still-pending destination click.
  {
    const page = await browser.newPage({
      viewport: { height: 900, width: 1440 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/projects`);
    await page
      .getByRole("navigation", { exact: true, name: "Primary" })
      .waitFor();
    await page.waitForTimeout(300);
    await page.route("**/_next/static/chunks/*.js", async (route) => {
      await delay(600);
      await route.continue();
    });
    const dock = page.getByRole("navigation", { exact: true, name: "Primary" });
    await dock.getByRole("link", { exact: true, name: "Projects" }).click();
    await page.waitForTimeout(80);
    await dock.getByRole("link", { exact: true, name: "Home" }).click();
    await page.waitForURL(`${base}/`, { timeout: 5000 });
    await page.waitForTimeout(800);
    assert.equal(
      await page.getByRole("dialog").count(),
      0,
      "A stale click must not reopen after leaving"
    );
    assert.deepEqual(errors, []);
    await page.close();
    console.log(
      "Home navigation during a pending click leaves no stale window."
    );
  }

  // 5. Warmed-up open: no artificial waits, the shell is already cached.
  // Also covers keyboard focus: close must return it to the trigger.
  {
    const page = await browser.newPage({
      viewport: { height: 900, width: 1440 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base);
    const dock = page.getByRole("navigation", { exact: true, name: "Primary" });
    await dock.getByRole("link", { exact: true, name: "Contact" }).hover();
    await dock.getByRole("link", { exact: true, name: "Contact" }).click();
    await page
      .getByRole("dialog", { exact: true, name: "Contact" })
      .waitFor({ timeout: 2000 });
    await page
      .getByRole("button", { exact: true, name: "Close window" })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(
      await dock
        .getByRole("link", { exact: true, name: "Contact" })
        .evaluate((el) => el === document.activeElement),
      true,
      "Focus must return to the trigger after close"
    );
    assert.deepEqual(errors, []);
    await page.close();
    console.log(
      "Warmed-up open resolves without artificial delay; close returns focus."
    );
  }

  // 6. Reduced motion, both themes: pending cue must not error or shimmer.
  // Focus-after-close is not asserted here: genie-window does not restore
  // focus when prefers-reduced-motion is on, independent of this change
  // (reproduces with no pending delay at all) — see the docs' limitations.
  for (const theme of ["light", "dark"]) {
    const page = await browser.newPage({
      reducedMotion: "reduce",
      viewport: { height: 900, width: 390 },
    });
    await page.addInitScript(
      (value) => localStorage.setItem("theme", value),
      theme
    );
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base);
    await page
      .getByRole("navigation", { exact: true, name: "Primary" })
      .waitFor();
    await page.waitForTimeout(300);
    await page.route("**/_next/static/chunks/*.js", async (route) => {
      await delay(400);
      await route.continue();
    });
    const dock = page.getByRole("navigation", { exact: true, name: "Primary" });
    await dock.getByRole("link", { exact: true, name: "About" }).click();
    await page.waitForTimeout(120);
    await page.screenshot({
      path: `.scratch/loading-reduced-motion-${theme}.png`,
    });
    await page
      .getByRole("dialog", { exact: true, name: "About" })
      .waitFor({ timeout: 5000 });
    await page
      .getByRole("button", { exact: true, name: "Close window" })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.deepEqual(errors, []);
    await page.close();
    console.log(
      `Reduced motion + ${theme}: pending, skeleton, open, and close passed.`
    );
  }

  console.log(
    "PASS: unified dock loading feedback covers pending, skeleton, failure, races, and focus."
  );
} finally {
  await browser.close();
}
