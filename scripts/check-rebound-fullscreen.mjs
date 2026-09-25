// biome-ignore-all lint/performance/noAwaitInLoops: A match lifecycle is sequential.
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

mkdirSync(".scratch/rebound-fullscreen", { recursive: true });
const browser = await chromium.launch();
try {
  for (const [width, height, reducedMotion, fallback] of [
    [1440, 1000, "no-preference", false],
    [390, 844, "no-preference", true],
    [320, 568, "reduce", true],
    [740, 390, "no-preference", true],
  ]) {
    const page = await browser.newPage({
      hasTouch: width < 800,
      reducedMotion,
      viewport: { height, width },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    if (fallback)
      await page.addInitScript(() => {
        Element.prototype.requestFullscreen = () =>
          Promise.reject(new Error("Fullscreen unavailable"));
      });
    await page.goto(process.env.SITE_URL || "http://localhost:3000", {
      waitUntil: "domcontentloaded",
    });
    const game = page.getByRole("region", { name: "Rebound air hockey" });
    const dialogState = () =>
      page.evaluate(() => {
        const dialog = document.querySelector("dialog");
        return {
          childCount: dialog?.children.length ?? -1,
          open: dialog?.hasAttribute("open") ?? null,
        };
      });
    assert.deepEqual(
      await dialogState(),
      { childCount: 0, open: false },
      "Collapsed shell is a genuinely empty, closed native dialog (no inline pseudo-modal)"
    );
    assert.equal(
      await page.getByRole("region", { name: "Rebound air hockey" }).count(),
      1,
      "Exactly one accessible region for the inline game (no duplicate landmark)"
    );
    await game.getByRole("button", { exact: true, name: "Play" }).click();
    await page.waitForTimeout(200);
    assert.equal(await game.getAttribute("data-status"), "playing");
    await game.getByRole("button", { exact: true, name: "Pause" }).click();
    const puck = game.getByAltText("Puck").locator("..");
    await puck.evaluate((el) => {
      el.dataset.samePuck = "yes";
    });
    const position = () =>
      puck.evaluate((el) => {
        const matrix = new DOMMatrix(getComputedStyle(el).transform);
        const field = el.parentElement.getBoundingClientRect();
        return [matrix.m41 / field.width, matrix.m42 / field.height];
      });
    const before = await position();
    await game.getByRole("button", { name: "Enter fullscreen" }).click();
    await page.waitForTimeout(900);
    assert.equal(await game.getAttribute("data-expanded"), "true");
    assert.deepEqual(
      await dialogState(),
      { childCount: 1, open: true },
      "Expanded shell is a real, open modal dialog containing the game (one expanded modal)"
    );
    assert.equal(
      await page.getByRole("dialog", { name: "Fullscreen air hockey" }).count(),
      1,
      "Exactly one accessible dialog while expanded"
    );
    if (!fallback)
      assert.equal(
        await page.evaluate(() => Boolean(document.fullscreenElement)),
        true,
        "Native fullscreen engaged"
      );
    assert.equal(await game.getAttribute("data-status"), "paused");
    assert.equal(await puck.getAttribute("data-same-puck"), "yes");
    const after = await position();
    // Landscape phone deliberately rotates the original vertical tile.
    if (width !== 740)
      for (let i = 0; i < 2; i++)
        assert.ok(
          Math.abs(before[i] - after[i]) < 0.015,
          "Puck remains in place"
        );
    const field = await page.locator("[data-rebound-field]").boundingBox();
    const controls = game.getByRole("navigation", { name: "Game controls" });
    const dock = await controls.boundingBox();
    assert.ok(
      field.y >= 0 && field.y + field.height <= dock.y,
      "Dock stays below rink"
    );
    assert.ok(
      dock.y + dock.height <= height && dock.x >= 0,
      "Controls fit viewport"
    );
    assert.ok(
      width < height ? field.height > field.width : field.width > field.height
    );
    await page.screenshot({
      path: `.scratch/rebound-fullscreen/${width}-paused.png`,
    });
    await controls.getByRole("button", { exact: true, name: "Resume" }).click();
    assert.equal(await game.getAttribute("data-status"), "playing");
    await page.screenshot({
      path: `.scratch/rebound-fullscreen/${width}-playing.png`,
    });
    await controls
      .getByRole("button", { exact: true, name: "Restart match" })
      .click();
    await game.getByRole("button", { name: "Keep match" }).click();
    assert.equal(await game.getAttribute("data-status"), "paused");
    await controls.getByRole("button", { name: "Exit fullscreen" }).click();
    await page.waitForTimeout(800);
    assert.equal(await game.getAttribute("data-expanded"), "false");
    assert.deepEqual(
      await dialogState(),
      { childCount: 0, open: false },
      "Collapsing restores a genuinely empty, closed native dialog"
    );
    assert.equal(await puck.getAttribute("data-same-puck"), "yes");
    assert.equal(
      await game
        .getByRole("button", { name: "Enter fullscreen" })
        .evaluate((el) => el === document.activeElement),
      true
    );
    assert.equal(await page.evaluate(() => document.body.style.overflow), "");
    await game.getByRole("button", { name: "Enter fullscreen" }).click();
    await page.waitForTimeout(800);
    if (await page.evaluate(() => Boolean(document.fullscreenElement)))
      await page.evaluate(() => document.exitFullscreen());
    else await page.keyboard.press("Escape");
    await page.waitForTimeout(800);
    assert.equal(
      await game.getAttribute("data-expanded"),
      "false",
      "Browser/Escape exit restores tile"
    );
    await game.getByRole("button", { exact: true, name: "Resume" }).click();
    await game.getByRole("button", { name: "Enter fullscreen" }).click();
    await page.waitForTimeout(700);
    assert.ok(
      ["playing", "goal"].includes(await game.getAttribute("data-status")),
      `Live match continues after expansion at ${width}px`
    );
    const paddle = game.getByRole("button", { name: "Your lime paddle" });
    await paddle.focus();
    const paddleBefore = await paddle.getAttribute("style");
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(100);
    await page.keyboard.up("ArrowRight");
    assert.notEqual(
      await paddle.getAttribute("style"),
      paddleBefore,
      "Fullscreen keyboard control moves paddle"
    );
    await controls
      .getByRole("button", { exact: true, name: "Restart match" })
      .click();
    const confirm = game.locator("[data-restart-confirm]");
    assert.equal(
      await confirm.evaluate((el) => el === document.activeElement),
      true
    );
    await confirm.click();
    assert.equal(
      await game.getAttribute("data-status"),
      "goal",
      "Confirmed restart begins automatic serve"
    );
    await controls.getByRole("button", { name: "Exit fullscreen" }).click();
    await page.waitForTimeout(700);
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log(
    "Fullscreen: native/fallback, match continuity, resume, restart cancellation, exit/focus, portrait/landscape, reduced motion passed."
  );
} finally {
  await browser.close();
}
