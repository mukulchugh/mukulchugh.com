// biome-ignore-all lint/performance/noAwaitInLoops: Capture the actual transition at fixed times.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { height: 700, width: 1440 },
  });
  await page.goto("http://localhost:3000/prototype/header", {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
  const link = page.getByRole("link", { name: "Mukul Chugh, home" });
  await link.hover();
  await page.waitForTimeout(550);
  await page.mouse.move(0, 500);
  await page.waitForTimeout(550);
  const client = await page.context().newCDPSession(page);
  const events = [];
  client.on("Tracing.dataCollected", ({ value }) => events.push(...value));
  await client.send("Tracing.start", {
    categories: "devtools.timeline,blink.user_timing",
    transferMode: "ReportEvents",
  });
  await page.evaluate(() => performance.mark("identity-start"));
  await link.hover();
  await page.waitForTimeout(550);
  const finished = new Promise((resolve) =>
    client.once("Tracing.tracingComplete", resolve)
  );
  await client.send("Tracing.end");
  await finished;
  const start = events.find((event) => event.name === "identity-start");
  assert.ok(start);
  const recurringWork = events.filter(
    (event) =>
      ["Layout", "Paint"].includes(event.name) &&
      event.ts > start.ts + 100_000 &&
      event.ts < start.ts + 420_000
  );
  assert.deepEqual(
    recurringWork.filter((event) => event.name === "Layout"),
    [],
    "No layout during the animation"
  );
  const paints = recurringWork.filter((event) => event.name === "Paint");
  // The delayed text reveal may rasterize its layer once. Repainting on
  // successive frames, unlike that initial raster, is a regression.
  assert.ok(
    paints.length === 0 || paints.at(-1).ts - paints[0].ts < 16_700,
    "Paint must not recur across animation frames"
  );
  await page.mouse.move(0, 500);
  await page.waitForTimeout(550);
  await link.hover();
  for (const time of [0, 140, 280, 460]) {
    await page.locator("header").evaluate((element, time) => {
      for (const animation of element.getAnimations({ subtree: true })) {
        animation.pause();
        animation.currentTime = time;
      }
    }, time);
    await page.screenshot({ path: `.scratch/header-motion-${time}.png` });
  }
  console.log(
    `Header motion: frozen frames captured; no Layout events, ${paints.length} Paint events in at most one frame in the measured 100–420ms interval.`
  );
} finally {
  await browser.close();
}
