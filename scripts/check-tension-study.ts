import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";
import { stepBall } from "../app/prototype/tension-study/physics";

const ball = { vx: 0, vy: -100, x: 90, y: 115 };
assert.ok(
  stepBall(
    ball,
    400,
    260,
    { bottom: 105, left: 20, right: 200, top: 60 },
    1 / 240
  )
);
assert.ok(ball.vy > 0, "Word must deflect an incoming ball");
mkdirSync(".scratch/tension-study", { recursive: true });
const browser = await chromium.launch();
try {
  for (const width of [1440, 390]) {
    // biome-ignore lint/performance/noAwaitInLoops: Sequential checks on the user-owned dev server.
    const page = await browser.newPage({ viewport: { height: 1000, width } });
    await page.goto("http://localhost:3000/prototype/tension-study", {
      waitUntil: "networkidle",
    });
    const study = page.getByRole("region", {
      name: "Make the connection prototype",
    });
    const handle = study.getByRole("button", { name: "Catapult" });
    await handle.scrollIntoViewIfNeeded();
    await page.screenshot({
      fullPage: true,
      path: `.scratch/tension-study/rest-${width}.png`,
    });
    const box = await handle.boundingBox();
    assert.ok(box);
    const target = await study.getByText("03", { exact: true }).boundingBox();
    assert.ok(target);
    const dx = box.x + box.width / 2 - target.x - target.width / 2;
    const dy = box.y + box.height / 2 - target.y - target.height / 2;
    const length = Math.hypot(dx, dy);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      box.x + box.width / 2 + (dx / length) * 55,
      box.y + box.height / 2 + (dy / length) * 55,
      { steps: 8 }
    );
    assert.equal(await study.getAttribute("data-phase"), "aiming");
    await page.screenshot({
      fullPage: true,
      path: `.scratch/tension-study/pulled-${width}.png`,
    });
    await page.mouse.up();
    await page.waitForFunction(
      () =>
        Number(
          document.querySelector("[data-hits]")?.getAttribute("data-hits")
        ) > 0
    );
    await study.getByRole("button", { name: "Reset" }).click();
    await handle.focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    assert.equal(await study.getAttribute("data-phase"), "flight");
    await page.keyboard.press("Escape");
    assert.equal(await study.getAttribute("data-phase"), "idle");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(100);
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    assert.equal(await study.getAttribute("data-phase"), "idle");
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    );
    await page.close();
  }
  console.log(
    "Catapult: word collision, pointer launch, keyboard launch/reset, reduced motion and overflow passed at 1440/390px."
  );
} finally {
  await browser.close();
}
