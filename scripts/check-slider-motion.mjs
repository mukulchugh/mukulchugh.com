// biome-ignore-all lint/performance/noAwaitInLoops: Check deterministic animation frames sequentially.
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

mkdirSync(".scratch/slider-motion", { recursive: true });
const browser = await chromium.launch();
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { height: 1100, width } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const direction of [1, -1]) {
      for (const time of [0, 0.45, 1.3]) {
        await page.goto(
          `http://localhost:3000/prototype/project-slider?t=${time}`,
          {
            waitUntil: "networkidle",
          }
        );
        const carousel = page.getByRole("region", {
          name: "Card handoff project carousel",
        });
        const next = carousel.getByRole("button", {
          exact: true,
          name: direction === 1 ? "Next project" : "Previous project",
        });
        const controls = carousel.getByRole("group", {
          name: "Project navigation",
        });
        assert.equal(
          await controls.getByRole("button").first().getAttribute("aria-label"),
          "Next project"
        );
        assert.equal(
          await controls.getByRole("button").last().getAttribute("aria-label"),
          "Previous project"
        );
        assert.equal(
          await next
            .locator("svg")
            .evaluate((el) => getComputedStyle(el).rotate),
          "90deg"
        );
        const slug = await carousel
          .locator(`[data-slot="${direction}"]`)
          .getAttribute("data-project");
        await next.click();
        const feature = carousel.locator('[data-slot="0"]');
        assert.equal(await feature.getAttribute("data-project"), slug);
        const copy = await feature
          .locator("[data-copy] > *")
          .evaluateAll((elements) =>
            elements.map((el) => {
              const parent = new DOMMatrix(
                getComputedStyle(el.closest("[data-project]")).transform
              );
              const child = new DOMMatrix(getComputedStyle(el).transform);
              return {
                opacity: getComputedStyle(el).opacity,
                scaleDifference: Math.abs(
                  parent.m11 * child.m11 - parent.m22 * child.m22
                ),
              };
            })
          );
        for (const element of copy) {
          assert.equal(
            element.opacity,
            "1",
            `Copy visible at ${time}s / ${width}px`
          );
          assert.ok(
            element.scaleDifference < 0.01,
            `Copy stays proportional at ${time}s / ${width}px / ${direction}: ${element.scaleDifference}`
          );
        }
        if (time === 0.45) {
          const displacement = await feature.evaluate((el) => {
            const matrix = new DOMMatrix(getComputedStyle(el).transform);
            return { x: matrix.m41, y: matrix.m42 };
          });
          const offset = width < 768 ? displacement.y : displacement.x;
          assert.ok(
            direction * offset > 1,
            "Next enters from the queue; Previous enters from the opposite edge"
          );
          const outgoing = carousel.locator(`[data-slot="${-direction}"]`);
          const outgoingOffset = await outgoing.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            const stage = el.parentElement.getBoundingClientRect();
            return { x: rect.left - stage.left, y: rect.top - stage.top };
          });
          assert.ok(
            direction * (width < 768 ? outgoingOffset.y : outgoingOffset.x) <
              -1,
            "Featured card exits forward or returns to the top of the queue in reverse"
          );
          await carousel.screenshot({
            path: `.scratch/slider-motion/${width}-${direction}-midpoint.png`,
          });
        }
      }
    }
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log(
    "Slider: forward/reverse handoffs, attached copy at start/mid/end, and responsive arrows pass."
  );
} finally {
  await browser.close();
}
