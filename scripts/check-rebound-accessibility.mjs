// Runs real axe-core (aria-allowed-role and related rules) against the
// rebound game host, plus structural checks proving the collapsed shell is
// an ordinary inline host (no pseudo-modal) and the expanded shell is a
// single real modal with focus containment, background inertness, and
// state continuity across the reparenting expand()/collapse() performs.
// Runs once with native Fullscreen available and once with it rejected
// (fallback path), since fullscreen can change accessibility exposure.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
function resolveAxeSource() {
  const candidates = [];
  if (process.env.AXE_CORE_PATH) candidates.push(process.env.AXE_CORE_PATH);
  try {
    candidates.push(require.resolve("axe-core/axe.min.js"));
  } catch {
    // axe-core is not a project dependency; AXE_CORE_PATH must supply it.
  }
  for (const candidate of candidates) {
    try {
      return readFileSync(candidate, "utf8");
    } catch {
      // Try the next candidate.
    }
  }
  throw new Error(
    "axe-core not found. Set AXE_CORE_PATH to a local axe.min.js " +
      "(axe-core is intentionally not a project dependency)."
  );
}
const axeSource = resolveAxeSource();

const RELEVANT_RULES = [
  "aria-allowed-role",
  "aria-valid-attr-value",
  "aria-dialog-name",
  "landmark-unique",
  "duplicate-id-aria",
];

async function runAxe(page) {
  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(
    (rules) => window.axe.run(document, { runOnly: rules }),
    RELEVANT_RULES
  );
  return results.violations;
}

const dialogState = (page) =>
  page.evaluate(() => {
    const dialog = document.querySelector("dialog");
    return {
      childCount: dialog?.children.length ?? -1,
      hasRole: dialog?.hasAttribute("role") ?? null,
      open: dialog?.hasAttribute("open") ?? null,
    };
  });

async function runFlow(browser, { fallback }) {
  const label = fallback ? "fallback" : "native";
  const context = await browser.newContext();
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  if (fallback)
    await page.addInitScript(() => {
      Element.prototype.requestFullscreen = () =>
        Promise.reject(new Error("Fullscreen unavailable"));
    });

  await page.goto(process.env.SITE_URL || "http://localhost:3000", {
    waitUntil: "domcontentloaded",
  });
  const game = page.getByRole("region", { name: "Rebound air hockey" });

  // Collapsed: ordinary inline host, one named region, dialog genuinely
  // empty and closed (not an inline pseudo-modal), zero relevant axe
  // violations anywhere on the page.
  let violations = await runAxe(page);
  assert.deepEqual(
    violations,
    [],
    `[${label}] axe violations while collapsed: ${JSON.stringify(violations, null, 2)}`
  );
  assert.deepEqual(
    await dialogState(page),
    { childCount: 0, hasRole: false, open: false },
    `[${label}] Collapsed shell is a plain, closed, empty native dialog carrying no role override`
  );
  assert.equal(
    await page.getByRole("region", { name: "Rebound air hockey" }).count(),
    1,
    `[${label}] Exactly one accessible region for the inline game`
  );
  assert.equal(
    await page.getByRole("dialog").count(),
    0,
    `[${label}] No dialog landmark is exposed while collapsed`
  );

  // Capture match state before expanding, to prove continuity across the
  // reparenting move (imperative appendChild in expand()/collapse()).
  await game.getByRole("button", { exact: true, name: "Play" }).click();
  await page.waitForTimeout(200);
  await game.getByRole("button", { exact: true, name: "Pause" }).click();
  const puck = game.getByAltText("Puck").locator("..");
  await puck.evaluate((el) => {
    el.dataset.samePuck = "yes";
  });
  const scoreBefore = await game.evaluate(
    (el) => el.querySelector('[class*="scoreboard"] strong')?.textContent
  );

  await game.getByRole("button", { name: "Enter fullscreen" }).click();
  await page.waitForTimeout(900);

  // Expanded: exactly one real modal, containing the same persistent game
  // section, and the relevant rules must still be violation-free. Fullscreen
  // engagement itself can change accessibility exposure (e.g. top-layer
  // stacking), so this is checked once per mode.
  violations = await runAxe(page);
  assert.deepEqual(
    violations,
    [],
    `[${label}] axe violations while expanded: ${JSON.stringify(violations, null, 2)}`
  );
  const expandedDialog = await page.evaluate(() => {
    const dialog = document.querySelector("dialog");
    const section = document.querySelector(
      'section[aria-label="Rebound air hockey"]'
    );
    return {
      containsSection: Boolean(section && dialog?.contains(section)),
      hasRole: dialog?.hasAttribute("role") ?? null,
      open: dialog?.hasAttribute("open") ?? null,
    };
  });
  assert.deepEqual(
    expandedDialog,
    { containsSection: true, hasRole: false, open: true },
    `[${label}] Expanded shell is a single real, open modal dialog containing the persistent game section`
  );
  assert.equal(
    await page.getByRole("dialog", { name: "Fullscreen air hockey" }).count(),
    1,
    `[${label}] Exactly one accessible modal while expanded`
  );
  assert.equal(
    await page.getByRole("region", { name: "Rebound air hockey" }).count(),
    1,
    `[${label}] The same single named region persists nested inside the modal`
  );
  if (!fallback)
    assert.equal(
      await page.evaluate(() => Boolean(document.fullscreenElement)),
      true,
      `[${label}] Native fullscreen is engaged`
    );

  // Focus containment: focus starts inside the dialog.
  const focusInsideDialog = await page.evaluate(() =>
    Boolean(document.querySelector("dialog")?.contains(document.activeElement))
  );
  assert.ok(
    focusInsideDialog,
    `[${label}] Focus is contained inside the expanded dialog`
  );

  // Background inertness: an element outside the dialog cannot take focus
  // while the native modal is open (browser-enforced inert background).
  const outsideFocusBlocked = await page.evaluate(() => {
    const outside = document.querySelector(
      'nav[aria-label="Primary"] a, footer a'
    );
    if (!outside) return true;
    outside.focus();
    return document.activeElement !== outside;
  });
  assert.ok(
    outsideFocusBlocked,
    `[${label}] Background content stays inert while the modal is open`
  );

  // Continuity: same puck DOM node, same score, after the reparenting move.
  assert.equal(
    await puck.getAttribute("data-same-puck"),
    "yes",
    `[${label}] Puck DOM node survives the expand reparenting (not remounted)`
  );
  const scoreAfterExpand = await game.evaluate(
    (el) => el.querySelector('[class*="scoreboard"] strong')?.textContent
  );
  assert.equal(
    scoreAfterExpand,
    scoreBefore,
    `[${label}] Score is preserved across expand`
  );

  const controls = game.getByRole("navigation", { name: "Game controls" });
  await controls
    .getByRole("button", { exact: true, name: "Exit fullscreen" })
    .click();
  await page.waitForTimeout(800);

  // Collapsing must return to the exact same empty/closed state, with no
  // duplicate landmarks left behind.
  violations = await runAxe(page);
  assert.deepEqual(
    violations,
    [],
    `[${label}] axe violations after collapsing: ${JSON.stringify(violations, null, 2)}`
  );
  assert.deepEqual(
    await dialogState(page),
    { childCount: 0, hasRole: false, open: false },
    `[${label}] Collapsing returns the dialog to a genuinely empty, closed state`
  );
  assert.equal(
    await puck.getAttribute("data-same-puck"),
    "yes",
    `[${label}] Puck DOM node survives the collapse reparenting (not remounted)`
  );

  // Cleanup on unmount/navigation: use a real, deliberate in-app history
  // transition instead of clicking an (inert-while-expanded) background
  // link, which cannot reliably cause navigation and must not be mistaken
  // for a cleanup defect. Start at /about, click the footer's home link to
  // create a same-document SPA history entry for "/", expand the game
  // there, then use the browser's Back button to force a real popstate
  // transition back to /about. Each wait below throws (fails the script)
  // if the expected transition never actually happens.
  await page.goto(`${process.env.SITE_URL || "http://localhost:3000"}/about`, {
    waitUntil: "domcontentloaded",
  });
  await page.locator('footer a[href="/"]').click();
  await page.waitForURL((url) => url.pathname === "/");
  const homeGame = page.getByRole("region", { name: "Rebound air hockey" });
  await homeGame.getByRole("button", { name: "Enter fullscreen" }).click();
  await page.waitForTimeout(900);
  assert.equal(
    await homeGame.getAttribute("data-expanded"),
    "true",
    `[${label}] Game is expanded before testing back-navigation cleanup`
  );
  await page.goBack();
  await page.waitForURL((url) => url.pathname === "/about");
  await page
    .locator('section[aria-label="Rebound air hockey"]')
    .waitFor({ state: "detached" });
  assert.deepEqual(
    pageErrors,
    [],
    `[${label}] No console errors across the full flow`
  );
  assert.equal(
    await page.evaluate(() => Boolean(document.fullscreenElement)),
    false,
    `[${label}] Navigating back leaves no dangling fullscreen state`
  );
  assert.equal(
    await page.evaluate(() => document.body.style.overflow),
    "",
    `[${label}] Navigating back restores background scroll`
  );
  assert.equal(
    await page.getByRole("dialog").count(),
    0,
    `[${label}] No accessible modal remains after the game unmounts`
  );

  await context.close();
}

const browser = await chromium.launch();
try {
  await runFlow(browser, { fallback: false });
  await runFlow(browser, { fallback: true });
  console.log(
    "Accessibility: axe-core aria-allowed-role/related rules clean, no inline pseudo-modal, one expanded modal, focus containment, background inertness, match/score/puck continuity, and cleanup on a real back-navigation passed for both native and fallback fullscreen."
  );
} finally {
  await browser.close();
}
