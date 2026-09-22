import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";
import { H, initial, step } from "../components/rebound/physics";

const g = initial();
g.puck = { vx: 800, vy: 0, x: 960, y: H / 2 };
assert.equal(step(g, 1 / 120), "player");
g.puck = { vx: -800, vy: 0, x: 40, y: H / 2 };
assert.equal(step(g, 1 / 120), "opponent");
g.puck = { vx: 100, vy: -100, x: 500, y: 45 };
assert.equal(step(g, 1 / 240), null);
assert.ok(g.puck.vy > 0);
g.puck = { vx: -300, vy: 0, x: 284, y: H / 2 };
step(g, 1 / 240);
assert.ok(g.puck.vx > 0);
mkdirSync(".scratch/rebound", { recursive: true });
const browser = await chromium.launch();
try {
  for (const width of [1440, 768, 390, 320]) {
    // biome-ignore lint/performance/noAwaitInLoops: Keep load sequential on user server.
    const page = await browser.newPage({
      hasTouch: width < 768,
      viewport: { height: width === 320 ? 568 : 1000, width },
    });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://localhost:3000", {
      waitUntil: "networkidle",
    });
    assert.equal(await page.getByRole("heading", { level: 1 }).count(), 1);
    const field = await page.locator("[data-rebound-field]").boundingBox();
    assert.ok(field);
    assert.ok(
      width < 768 ? field.height > field.width : field.width > field.height
    );
    const initialPaddle = await page
      .getByRole("button", { name: "Your lime paddle" })
      .boundingBox();
    assert.ok(initialPaddle);
    if (width < 768)
      assert.ok(
        initialPaddle.y > field.y + field.height / 2,
        "Player starts at bottom on mobile"
      );
    await page.getByRole("button", { exact: true, name: "Play" }).click();
    const paddle = page.getByRole("button", { name: "Your lime paddle" });
    const beforeKeyboard = await paddle.boundingBox();
    const before = await paddle.getAttribute("style");
    await page.keyboard.down("ArrowDown");
    await page.waitForTimeout(100);
    await page.keyboard.up("ArrowDown");
    assert.notEqual(await paddle.getAttribute("style"), before);
    const moved = await paddle.boundingBox();
    assert.ok(
      moved && beforeKeyboard && moved.y > beforeKeyboard.y,
      "Down arrow moves down in either orientation"
    );
    await page.keyboard.press("Escape");
    assert.equal(
      await page
        .getByRole("region", { name: "Rebound air hockey" })
        .getAttribute("data-status"),
      "paused"
    );
    await page.getByRole("button", { exact: true, name: "Resume" }).click();
    const box = await paddle.boundingBox();
    assert.ok(box);
    const hoverBefore = await paddle.getAttribute("style");
    await page.mouse.move(
      box.x + box.width / 2 + 30,
      box.y + box.height / 2 - 15,
      { steps: 5 }
    );
    await page.waitForTimeout(100);
    assert.notEqual(
      await paddle.getAttribute("style"),
      hoverBefore,
      "Paddle must follow mouse without pressing"
    );
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + 25, box.y - 10, { steps: 5 });
    await page.mouse.up();
    if (width < 768) {
      await paddle.scrollIntoViewIfNeeded();
      const touchBox = await paddle.boundingBox();
      assert.ok(touchBox);
      const cdp = await page.context().newCDPSession(page);
      const touch = {
        x: touchBox.x + touchBox.width / 2,
        y: touchBox.y + touchBox.height / 2,
      };
      await cdp.send("Input.dispatchTouchEvent", {
        touchPoints: [touch],
        type: "touchStart",
      });
      await cdp.send("Input.dispatchTouchEvent", {
        touchPoints: [{ x: touch.x + 24, y: touch.y - 24 }],
        type: "touchMove",
      });
      await page.waitForTimeout(120);
      const afterTouch = await paddle.boundingBox();
      assert.ok(
        afterTouch &&
          afterTouch.x > touchBox.x + 10 &&
          afterTouch.y < touchBox.y - 10,
        `Touch drag must follow the finger right and up on the vertical board: ${JSON.stringify({ afterTouch, status: await page.getByRole("region", { name: "Rebound air hockey" }).getAttribute("data-status"), touchBox, width })}`
      );
      await cdp.send("Input.dispatchTouchEvent", {
        touchPoints: [],
        type: "touchEnd",
      });
      await cdp.detach();
    }
    await page.getByRole("button", { exact: true, name: "Pause" }).click();
    const panel = await page
      .getByRole("button", { exact: true, name: "Resume" })
      .locator("../..")
      .boundingBox();
    const rink = await page.locator('img[src*="rink-tall"]').boundingBox();
    assert.ok(panel && rink);
    assert.ok(
      panel.y >= rink.y && panel.y + panel.height <= rink.y + rink.height,
      `Pause panel must remain inside rink at ${width}px`
    );
    await page.getByRole("button", { name: "Restart" }).click();
    const countdownPanel = await page
      .getByRole("region", { name: "Rebound air hockey" })
      .getByRole("status")
      .locator("..")
      .boundingBox();
    assert.ok(
      countdownPanel &&
        countdownPanel.x >= rink.x &&
        countdownPanel.y >= rink.y &&
        countdownPanel.x + countdownPanel.width <= rink.x + rink.width + 1 &&
        countdownPanel.y + countdownPanel.height <= rink.y + rink.height + 1,
      `Countdown overlay must fit the board at ${width}px`
    );
    assert.equal(
      await page
        .getByRole("region", { name: "Rebound air hockey" })
        .getAttribute("data-status"),
      "goal"
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    );
    await page.screenshot({
      fullPage: true,
      path: `.scratch/rebound/home-${width}.png`,
    });
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log(
    "Rebound: scoring, collisions, keyboard, pointer, pause/reset and responsive checks passed."
  );
} finally {
  await browser.close();
}
