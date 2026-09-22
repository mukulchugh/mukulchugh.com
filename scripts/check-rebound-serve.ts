import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto("http://localhost:3000/prototype/rebound", {
    waitUntil: "networkidle",
  });
  await page.clock.install();
  const game = page.getByRole("region", { name: "Rebound air hockey" });
  await page.getByRole("button", { exact: true, name: "Play" }).click();
  for (let i = 0; i < 120; i++) {
    // biome-ignore lint/performance/noAwaitInLoops: Advance simulation in bounded increments to catch the goal state.
    await page.clock.runFor(500);
    if ((await game.getAttribute("data-status")) === "goal") break;
  }
  assert.equal(await game.getAttribute("data-status"), "goal");
  assert.equal(
    await game.getByText("Next serve automatically", { exact: true }).count(),
    1
  );
  await page.getByRole("button", { exact: true, name: "Pause" }).click();
  assert.equal(await game.getAttribute("data-status"), "paused");
  const frozen = await game.getByRole("status").innerText();
  await page.clock.runFor(5000);
  assert.equal(await game.getByRole("status").innerText(), frozen);
  await page.getByRole("button", { name: "Resume" }).click();
  await page.clock.runFor(3100);
  assert.equal(await game.getAttribute("data-status"), "playing");
  console.log("Goal overlay, automatic serve and paused countdown passed.");
} finally {
  await browser.close();
}
