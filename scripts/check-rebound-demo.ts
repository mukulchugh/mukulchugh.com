import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto("http://localhost:3000", {
    waitUntil: "networkidle",
  });
  const game = page.getByRole("region", { name: "Rebound air hockey" });
  const puck = game.getByAltText("Puck").locator("..");
  const player = game.getByRole("button", { name: "Your lime paddle" });
  const ai = game.getByAltText("Opponent paddle").locator("..");
  const positions = async () =>
    Promise.all([puck, player, ai].map((node) => node.getAttribute("style")));
  assert.equal(await game.getByRole("status").count(), 0, "No initial overlay");
  const before = await positions();
  await page.waitForTimeout(1200);
  const after = await positions();
  for (let i = 0; i < 3; i++)
    assert.notEqual(after[i], before[i], "Demo moves both paddles and puck");
  await game.getByRole("button", { exact: true, name: "Pause demo" }).click();
  const paused = await positions();
  await page.waitForTimeout(300);
  assert.deepEqual(
    await positions(),
    paused,
    "Demo pause stops motion without overlay"
  );
  assert.equal(await game.getByRole("status").count(), 0);
  await game.getByRole("button", { exact: true, name: "Resume demo" }).click();
  await page.waitForTimeout(200);
  assert.notDeepEqual(await positions(), paused);
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  const hidden = await positions();
  await page.waitForTimeout(300);
  assert.deepEqual(await positions(), hidden, "Unfocused demo is suspended");
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await game.getByRole("button", { exact: true, name: "Play" }).click();
  assert.equal(await game.getAttribute("data-status"), "playing");
  assert.equal(
    await game.getByRole("button", { exact: true, name: "Pause demo" }).count(),
    0
  );
  await game.getByRole("button", { exact: true, name: "Pause" }).click();
  assert.equal(await game.getByRole("status").textContent(), "Paused");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  const still = await positions();
  await page.waitForTimeout(400);
  assert.deepEqual(
    await positions(),
    still,
    "Reduced motion disables autoplay"
  );
  assert.equal(await game.getByRole("status").count(), 0);
  await game.getByRole("button", { exact: true, name: "Play" }).click();
  await page.waitForTimeout(200);
  assert.notDeepEqual(
    await positions(),
    still,
    "Reduced-motion visitors can still choose to play"
  );
  console.log(
    "Autoplay, two-paddle rally, demo pause/resume, focus suspension, takeover and reduced motion passed."
  );
} finally {
  await browser.close();
}
