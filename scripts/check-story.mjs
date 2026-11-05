// biome-ignore-all lint/performance/noAwaitInLoops: One browser page must be driven sequentially to verify reversible travel.
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import sharp from "sharp";
import {
  beatAt,
  beatPhase,
  beats,
  chapters,
  clampProgress,
  PLAYBACK_DURATION,
  playbackTimeForPosition,
  positionForPlaybackTime,
  positionForScroll,
  positionForYear,
  sceneAt,
  scrollForPosition,
  yearAt,
} from "../app/story/story-data.ts";

for (let year = 2004; year <= 2026; year++) {
  const p = positionForYear(year);
  assert.notEqual(p, null);
  assert.equal(yearAt(p), year, `Round trip for ${year}`);
}
for (const year of [Number.NaN, Number.POSITIVE_INFINITY, 2003, 2027, 2004.5])
  assert.equal(positionForYear(year), null);
assert.equal(clampProgress(Number.NaN), 0);
assert.equal(beatAt(-1), 0);
assert.equal(beatAt(2), beats.length - 1);
for (let i = 1; i <= 1000; i++)
  assert.ok(yearAt(i / 1000) >= yearAt((i - 1) / 1000));

for (let i = 0; i <= 1000; i++)
  assert.ok(
    Math.abs(positionForScroll(scrollForPosition(i / 1000)) - i / 1000) < 1e-9
  );
for (let i = 1; i < beats.length; i++)
  assert.ok(beats[i].position > beats[i - 1].position);

assert.ok(PLAYBACK_DURATION > 120_000 && PLAYBACK_DURATION < 240_000);
for (let i = 0; i <= 1000; i++) {
  const p = i / 1000;
  assert.ok(
    Math.abs(positionForPlaybackTime(playbackTimeForPosition(p)) - p) < 1e-8
  );
}
assert.equal(positionForPlaybackTime(-100), 0);
assert.equal(positionForPlaybackTime(Number.NaN), 0);
assert.equal(positionForPlaybackTime(PLAYBACK_DURATION + 1), 1);

// The schedule, including both sides of every boundary, is the contract for copy and worlds.
assert.equal(new Set(beats.map((beat) => beat.id)).size, beats.length);
for (let i = 0; i < beats.length; i++) {
  const start = beats[i].position,
    span = (beats[i + 1]?.position ?? 1) - start;
  for (const phase of [0.2, 0.5, 0.8]) {
    const sample = sceneAt(start + phase * span);
    assert.equal(sample.from, i);
    assert.equal(sample.to, i);
    assert.ok(Math.abs(beatPhase(start + phase * span) - phase) < 1e-7);
  }
  if (i > 0) {
    const before = sceneAt(start - 1e-6),
      after = sceneAt(start + 1e-6);
    assert.equal(before.from, i - 1);
    assert.equal(before.to, i);
    assert.equal(after.from, i - 1);
    assert.equal(after.to, i);
    assert.ok(Math.abs(before.blend - after.blend) < 0.003);
  }
}
assert.ok(1 - scrollForPosition(beats.at(-1).position) >= 0.06);

const base = process.env.STORY_URL || "http://127.0.0.1:4182";
const out = process.env.STORY_CAPTURE_DIR || ".impeccable/review/story";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  args: ["--enable-unsafe-swiftshader"],
  headless: true,
});
const failures = [];
const errors = [];
const results = [];
async function check(name, fn) {
  try {
    await fn();
    results.push(name);
  } catch (error) {
    failures.push({ error: String(error), name });
    console.error(name, String(error));
    throw error;
  }
}
async function ready(page) {
  await page.locator('[data-ready="true"]').waitFor({ timeout: 30_000 });
  await page.evaluate(() => document.fonts.ready);
}
async function seek(page, year) {
  await page.getByRole("button", { name: /Insert a year, currently/ }).click();
  await page.getByLabel("Year, 2004–2026", { exact: true }).fill(String(year));
  await page.getByRole("button", { exact: true, name: "Go" }).click();
  await page.waitForFunction(
    (year) =>
      document
        .querySelector('input[type="range"]')
        ?.getAttribute("aria-valuetext")
        ?.startsWith(String(year)),
    year
  );
  await page.waitForTimeout(480);
}
async function settledPose(page, position) {
  await page.waitForFunction(
    (p) =>
      Math.abs(Number(document.querySelector("canvas")?.dataset.progress) - p) <
      1e-8,
    position
  );
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      )
  );
}
if (process.env.STORY_CAPTURE_ONLY === "fleet") {
  try {
    const page = await browser.newPage();
    page.on("pageerror", (error) => errors.push(String(error)));
    await page.goto(`${base}/story`, { waitUntil: "networkidle" });
    await ready(page);
    await page.addStyleTag({
      content: "nextjs-portal { visibility: hidden; }",
    });
    const frames = [];
    const forward = new Map();
    for (const [device, width, height] of [
      ["desktop", 1440, 900],
      ["mobile", 390, 844],
    ]) {
      await page.setViewportSize({ height, width });
      for (let i = 0; i < beats.length; i++) {
        const beat = beats[i],
          span = (beats[i + 1]?.position ?? 1) - beat.position;
        for (const [label, p] of [
          ["hold", beat.position + span * 0.5],
          ["boundary", beat.position],
        ]) {
          await page.getByRole("slider").fill(String(Math.round(p * 1000)));
          await page.waitForFunction(
            (expected) =>
              Math.abs(
                Number(document.querySelector("canvas")?.dataset.progress) -
                  expected
              ) < 0.0001,
            Math.round(p * 1000) / 1000
          );
          await settledPose(page, Math.round(p * 1000) / 1000);
          const file = `${device}-${String(i + 1).padStart(2, "0")}-${beat.id}-${label}.png`;
          const screenshot = await page.screenshot({ path: `${out}/${file}` });
          const top =
            device === "mobile"
              ? await page
                  .locator("[data-story-copy]")
                  .evaluate((el) =>
                    Math.ceil(el.getBoundingClientRect().bottom + 12)
                  )
              : 115;
          const stage = {
            height: Math.max(
              1,
              (device === "mobile" ? height - 176 : height - 110) - top
            ),
            left: 0,
            top,
            width: device === "mobile" ? width : Math.floor(width * 0.53),
          };
          const { data, info } = await sharp(screenshot)
            .extract(stage)
            .resize(160)
            .removeAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });
          const colour = [data[0], data[1], data[2]];
          let filled = 0;
          for (let n = 0; n < data.length; n += info.channels)
            if (
              Math.max(...colour.map((v, c) => Math.abs(v - data[n + c]))) > 24
            )
              filled++;
          const occupancy = filled / (info.width * info.height);
          if (label === "hold") forward.set(`${device}-${i}`, { data, stage });
          const shot = await page.locator("canvas").getAttribute("data-shot");
          frames.push({ file, occupancy, shot });
          assert.ok(
            occupancy > 0.025,
            `Near-empty stage: ${file} (${occupancy})`
          );
          assert.equal(await page.locator("canvas").count(), 1);
          if (label === "hold") assert.equal(shot, `${beat.id}:${beat.id}`);
        }
      }
      // Reverse every beat as well; no direction-dependent stage should survive.
      for (let i = beats.length - 1; i >= 0; i--) {
        const p =
          beats[i].position +
          ((beats[i + 1]?.position ?? 1) - beats[i].position) * 0.5;
        await page.getByRole("slider").fill(String(Math.round(p * 1000)));
        await page.waitForFunction(
          (expected) =>
            Math.abs(
              Number(document.querySelector("canvas")?.dataset.progress) -
                expected
            ) < 0.0001,
          Math.round(p * 1000) / 1000
        );
        assert.equal(
          await page.locator("canvas").getAttribute("data-beat"),
          beats[i].id
        );
        await settledPose(page, Math.round(p * 1000) / 1000);
        const reference = forward.get(`${device}-${i}`);
        const pixels = await sharp(await page.screenshot())
          .extract(reference.stage)
          .resize(160)
          .removeAlpha()
          .raw()
          .toBuffer();
        assert.equal(pixels.length, reference.data.length);
        let changed = 0;
        for (let n = 0; n < pixels.length; n++)
          if (Math.abs(pixels[n] - reference.data[n]) > 4) changed++;
        assert.ok(
          changed / pixels.length < 0.0005,
          `Direction-dependent frame: ${device} ${beats[i].id} (${changed / pixels.length})`
        );
      }
    }
    await check(
      "Ending restart and disappearing project preserve focus",
      async () => {
        await page.getByRole("slider").fill("1000");
        await page
          .getByRole("button", { exact: true, name: "Back to 2004" })
          .click();
        assert.equal(
          await page
            .locator("[data-story-copy] h1")
            .evaluate((el) => el === document.activeElement),
          true
        );
        await page.getByRole("slider").fill("970");
        await page.locator("[data-story-project]").focus();
        await page.mouse.wheel(0, 3000);
        await page.waitForFunction(
          () =>
            document.activeElement ===
            document.querySelector("[data-story-copy] h1")
        );
      }
    );
    assert.deepEqual(errors, []);
    await writeFile(
      `${out}/fleet-checks.json`,
      JSON.stringify(
        {
          frames,
          passed: results,
          runtimeErrors: errors,
          testedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );
    console.log(
      JSON.stringify({
        captured: frames.length,
        reversed: beats.length * 2,
        runtimeErrors: errors,
      })
    );
  } finally {
    await browser.close();
  }
  process.exit(0);
}
if (process.env.STORY_CAPTURE_ONLY === "expansion") {
  try {
    const page = await browser.newPage();
    page.on("pageerror", (error) => errors.push(String(error)));
    await page.goto(`${base}/story`, { waitUntil: "networkidle" });
    await ready(page);
    for (const [device, width, height] of [
      ["desktop", 1672, 941],
      ["mobile", 390, 844],
      ["small-phone", 320, 568],
      ["landscape", 844, 390],
    ]) {
      await page.setViewportSize({ height, width });
      for (const [name, position] of [
        ["huntit", 529],
        ["spark", 607],
        ["qsolve", 586],
        ["earnings", 451],
        ["public-tools", 956],
      ]) {
        await page.getByRole("slider").fill(String(position));
        await page.waitForTimeout(550);
        await page.screenshot({ path: `${out}/${device}-${name}.png` });
        await check(
          `${device}: ${name} stays readable above controls`,
          async () => {
            const copy = await page.locator("[data-story-copy]").boundingBox();
            const controls = await page
              .getByRole("navigation", { name: "Story controls" })
              .boundingBox();
            assert.ok(copy.y + copy.height < controls.y - 12);
            assert.ok(copy.x >= 0 && copy.x + copy.width <= width);
            assert.equal(
              await page.locator("canvas[data-story-canvas]").count(),
              1
            );
          }
        );
      }
    }
    assert.deepEqual(errors, []);
    await writeFile(
      `${out}/expansion-checks.json`,
      JSON.stringify(
        {
          failures,
          passed: results,
          runtimeErrors: errors,
          testedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );
    console.log(
      JSON.stringify({
        failures,
        passed: results.length,
        runtimeErrors: errors,
      })
    );
  } finally {
    await browser.close();
  }
  process.exit(0);
}
if (process.env.STORY_CAPTURE_ONLY === "landscape") {
  try {
    const page = await browser.newPage({
      viewport: { height: 390, width: 844 },
    });
    await page.goto(`${base}/story`, { waitUntil: "networkidle" });
    await ready(page);
    await page.screenshot({ path: `${out}/landscape.png` });
    const background = await page
      .locator("[data-story-copy]")
      .evaluate((el) => getComputedStyle(el, "::before").backgroundColor);
    assert.notEqual(background, "rgba(0, 0, 0, 0)");
    await page.getByRole("slider").fill("1000");
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}/landscape-ending.png` });
    assert.equal(
      await page
        .getByText("It started with my dad.", { exact: true })
        .isVisible(),
      true
    );
  } finally {
    await browser.close();
  }
  console.log("Short-landscape opening and ending passed");
  process.exit(0);
}
try {
  const context = await browser.newContext({
    deviceScaleFactor: 1,
    viewport: { height: 941, width: 1672 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(30_000);
  page.on("pageerror", (error) => errors.push(String(error)));
  await page.goto(`${base}/story`, { waitUntil: "networkidle" });
  await ready(page);
  await seek(page, 2004);
  await page.screenshot({ path: `${out}/desktop.png` });
  await page.getByRole("slider").fill("45");
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/desktop-room.png` });
  await seek(page, 2004);
  await page.getByRole("slider").fill("0");
  await check("One canvas, isolated story chrome", async () => {
    assert.equal(await page.locator("canvas").count(), 1);
    assert.equal(
      await page
        .getByRole("navigation", { exact: true, name: "Primary" })
        .count(),
      0
    );
    assert.equal(await page.getByRole("contentinfo").count(), 0);
    assert.equal(
      await page
        .getByRole("button", { exact: true, name: "Previous chapter" })
        .isDisabled(),
      true
    );
  });
  await check(
    "Invalid year, keyboard confirmation and focus return",
    async () => {
      await page
        .getByRole("button", { name: /Insert a year, currently/ })
        .click();
      const input = page.getByLabel("Year, 2004–2026", { exact: true });
      await input.fill("2027");
      await input.press("Enter");
      assert.equal(await page.locator("#story-year-error").count(), 1);
      assert.equal(
        await page.locator("dialog").evaluate((el) => el.open),
        true
      );
      await input.fill("2008");
      await input.press("Enter");
      await page.waitForTimeout(450);
      assert.ok(
        (
          await page.getByRole("slider").getAttribute("aria-valuetext")
        ).startsWith("2008")
      );
      assert.ok(
        await page.evaluate(() =>
          document.activeElement
            ?.getAttribute("aria-label")
            ?.startsWith("Insert a year")
        )
      );
    }
  );
  await page.screenshot({ path: `${out}/desktop-repair.png` });
  await check("Text stays readable at a stopped transition", async () => {
    for (const position of [210, 978]) {
      await page.getByRole("slider").fill(String(position));
      await page.waitForTimeout(550);
      const opacity = await page
        .locator("[data-story-copy]")
        .evaluate((el) => Number(getComputedStyle(el).opacity));
      assert.ok(opacity >= 0.85);
    }
  });
  await seek(page, 2009);
  await page.screenshot({ path: `${out}/desktop-dismantling.png` });
  await seek(page, 2007);
  await page.screenshot({ path: `${out}/desktop-reassembled.png` });
  await check("Play is interrupted by manual input", async () => {
    await page
      .getByRole("button", { exact: true, name: "Play journey" })
      .click();
    await page.waitForTimeout(250);
    assert.equal(
      await page
        .getByRole("button", { exact: true, name: "Pause journey" })
        .count(),
      1
    );
    await page.mouse.wheel(0, 120);
    await page
      .getByRole("button", { exact: true, name: "Play journey" })
      .waitFor();
    assert.equal(
      await page
        .getByRole("button", { exact: true, name: "Play journey" })
        .count(),
      1
    );
  });
  await check(
    "Autoplay advances on elapsed time and Space pauses once",
    async () => {
      await seek(page, 2019);
      const before = Number(await page.getByRole("slider").inputValue());
      await page
        .getByRole("button", { exact: true, name: "Play journey" })
        .click();
      await page.waitForTimeout(1600);
      const after = Number(await page.getByRole("slider").inputValue());
      assert.ok(
        after - before >= 3,
        `Autoplay only advanced ${after - before}/1000`
      );
      await page
        .getByRole("button", { exact: true, name: "Pause journey" })
        .press("Space");
      await page
        .getByRole("button", { exact: true, name: "Play journey" })
        .waitFor();
      const paused = Number(await page.getByRole("slider").inputValue());
      await page.waitForTimeout(300);
      assert.ok(
        Math.abs(
          Number(await page.getByRole("slider").inputValue()) - paused
        ) <= 1
      );
    }
  );
  await check(
    "Changing copy preserves focus; reading panel receives focus",
    async () => {
      await page.getByRole("slider").fill("395");
      const source = page.getByRole("button", {
        exact: true,
        name: "Open the original page",
      });
      await source.focus();
      await page.evaluate((scroll) => {
        const section = document.querySelector(
          '[aria-label="Interactive memories"]'
        );
        window.scrollTo({
          behavior: "instant",
          top:
            section.offsetTop + scroll * (section.offsetHeight - innerHeight),
        });
      }, scrollForPosition(0.422));
      await page.waitForFunction(
        () =>
          Math.abs(
            Number(document.querySelector("canvas")?.dataset.progress) - 0.422
          ) < 0.0001
      );
      assert.equal(
        await source.evaluate((el) => el === document.activeElement),
        true
      );
      await page
        .getByRole("button", { exact: true, name: "Choose a chapter" })
        .click();
      await page
        .getByRole("button", { name: "Read without travelling" })
        .click();
      assert.equal(
        await page
          .locator("#story-panel-title")
          .evaluate((el) => el === document.activeElement),
        true
      );
      await page.keyboard.press("Escape");
    }
  );
  await check("Year slider keyboard and reverse travel", async () => {
    await seek(page, 2014);
    await page.getByRole("slider").focus();
    await page.keyboard.press("ArrowLeft");
    assert.ok(
      (
        await page.getByRole("slider").getAttribute("aria-valuetext")
      ).startsWith("2013")
    );
    await page.keyboard.press("Home");
    assert.ok(
      (
        await page.getByRole("slider").getAttribute("aria-valuetext")
      ).startsWith("2004")
    );
  });
  await seek(page, 2014);
  await page.screenshot({ path: `${out}/desktop-blogs.png` });
  await check(
    "Original artifact opens and returns without moving",
    async () => {
      const value = await page.getByRole("slider").inputValue();
      await page
        .getByRole("button", { exact: true, name: "Open the original page" })
        .click();
      assert.equal(
        await page
          .getByRole("dialog")
          .getByRole("heading", { exact: true, name: "Blogging Orb" })
          .count(),
        1
      );
      await page.keyboard.press("Escape");
      assert.equal(await page.getByRole("slider").inputValue(), value);
    }
  );
  await check("Chapter selection", async () => {
    await page.getByRole("button", { name: "Choose a chapter" }).click();
    await page
      .getByRole("button", { name: /People on the other side/ })
      .click();
    assert.ok(
      (await page.getByRole("heading", { level: 1 }).innerText()).includes(
        "People"
      )
    );
  });
  await check("Travel scenes and ending match their years", async () => {
    for (const [position, year, subject, title] of [
      [522, 2016, "huntit", "treasure hunt"],
      [580, 2018, "qsolve", "An idea became"],
      [600, 2018, "spark", "SPARK"],
      [619, 2018, "spark", "SPARK"],
      [620, 2019, "car", "Leaving"],
      [641, 2019, "college-entry", "Leaving"],
      [647, 2019, "college-ecell", "New place"],
      [749, 2021, "heroapp", "Designing it"],
      [750, 2022, "college-departure", "Another city"],
      [768, 2022, "takeoff", "Another city"],
      [782, 2022, "flight-cabin", "Another city"],
      [787, 2022, "zenduty-team", "with a team"],
      [950, 2026, "public-tools", "tools"],
      [963, 2026, "altr", "workspace"],
      [975, 2026, "tethr", "taking shape"],
      [985, 2026, "still-building", "building"],
    ]) {
      await page.getByRole("slider").fill(String(position));
      await page.waitForFunction(
        (subject) =>
          document.querySelector("canvas[data-story-canvas]")?.dataset
            .subject === subject,
        subject
      );
      assert.ok(
        (
          await page.getByRole("slider").getAttribute("aria-valuetext")
        ).startsWith(String(year))
      );
      assert.ok(
        (await page.getByRole("heading", { level: 1 }).innerText())
          .toLowerCase()
          .includes(title.toLowerCase()),
        `Copy did not match ${position}: expected ${title}`
      );
    }
  });
  for (const year of [2013, 2015, 2017, 2020, 2023, 2026]) {
    await seek(page, year);
    await page.screenshot({ path: `${out}/desktop-${year}.png` });
  }
  for (const [name, position] of [
    ["screen-push", 85],
    ["page-lift", 404],
    ["page-turn", 419],
    ["laptop-arrival", 548],
    ["huntit", 529],
    ["qsolve", 586],
    ["spark", 607],
    ["earnings", 451],
    ["public-tools", 956],
    ["tinkering", 156],
    ["car", 625],
    ["college-entry", 637],
    ["college-departure", 754],
    ["takeoff", 768],
    ["flight-cabin", 782],
    ["zenduty", 790],
    ["voices", 680],
    ["portfolio", 730],
    ["altr", 965],
    ["tethr", 978],
    ["closing-return", 992],
    ["travel", 347],
  ]) {
    await page.getByRole("slider").fill(String(position));
    await page.waitForTimeout(550);
    await page.screenshot({ path: `${out}/desktop-${name}.png` });
  }
  await check("All 23 years and twelve chapters", async () => {
    assert.equal(chapters.length, 12);
    for (let year = 2004; year <= 2026; year++) {
      await seek(page, year);
      assert.ok(
        (
          await page.getByRole("slider").getAttribute("aria-valuetext")
        ).startsWith(String(year))
      );
    }
    await page.getByRole("slider").focus();
    await page.keyboard.press("End");
    await page.waitForTimeout(500);
    assert.ok(
      (await page.getByRole("heading", { level: 1 }).innerText()).includes(
        "building."
      )
    );
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/desktop-ending.png` });
  await check("Sound starts off and can be toggled", async () => {
    assert.equal(
      await page
        .getByRole("button", { exact: true, name: "Enable sound" })
        .getAttribute("aria-pressed"),
      "false"
    );
    await page
      .getByRole("button", { exact: true, name: "Enable sound" })
      .click();
    await page
      .getByRole("button", { exact: true, name: "Mute sound" })
      .waitFor();
    await page.getByRole("button", { exact: true, name: "Mute sound" }).click();
  });
  for (const [name, width, height] of [
    ["mobile", 390, 844],
    ["small-phone", 320, 568],
    ["landscape", 844, 390],
  ]) {
    await page.setViewportSize({ height, width });
    await seek(page, 2004);
    await page.screenshot({ path: `${out}/${name}.png` });
    await check(`${name}: layout and touch controls`, async () => {
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        )
      );
      const boxes = await page
        .getByRole("navigation", { name: "Story controls" })
        .locator("button")
        .evaluateAll((buttons) =>
          buttons.map((button) => {
            const b = button.getBoundingClientRect();
            return {
              bottom: b.bottom,
              height: b.height,
              left: b.left,
              right: b.right,
              width: b.width,
            };
          })
        );
      for (const b of boxes) {
        assert.ok(b.width >= 44 && b.height >= 44);
        assert.ok(b.bottom <= height && b.left >= 0 && b.right <= width);
      }
    });
    if (name === "mobile") {
      await page.getByRole("slider").fill("45");
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${out}/mobile-room.png` });
      await seek(page, 2008);
      await page.screenshot({ path: `${out}/mobile-repair.png` });
      await seek(page, 2009);
      await page.screenshot({ path: `${out}/mobile-dismantling.png` });
      await seek(page, 2014);
      await page.screenshot({ path: `${out}/mobile-blogs.png` });
      await seek(page, 2026);
      await page.screenshot({ path: `${out}/mobile-today.png` });
      assert.equal(
        await page
          .locator("canvas[data-story-canvas]")
          .getAttribute("data-travel-axis"),
        "vertical"
      );
      for (const [state, position] of [
        ["screen-push", 85],
        ["making", 360],
        ["page-lift", 404],
        ["laptop-arrival", 548],
        ["huntit", 529],
        ["qsolve", 586],
        ["spark", 607],
        ["earnings", 451],
        ["public-tools", 956],
        ["car", 625],
        ["college-entry", 637],
        ["college-departure", 754],
        ["takeoff", 768],
        ["flight-cabin", 782],
        ["voices", 680],
        ["altr", 965],
        ["ending", 1000],
        ["travel", 347],
      ]) {
        await page.getByRole("slider").fill(String(position));
        await page.waitForTimeout(550);
        await page.screenshot({ path: `${out}/mobile-${state}.png` });
      }
    }
  }
  await check(
    "Route exit restores portfolio chrome and removes canvas",
    async () => {
      await page
        .getByRole("link", { exact: true, name: "Back to Mukul's portfolio" })
        .click();
      await page.waitForURL(`${base}/`);
      await page
        .locator("canvas[data-story-canvas]")
        .waitFor({ state: "detached" });
      await page
        .getByRole("navigation", { exact: true, name: "Primary" })
        .waitFor();
      assert.equal(await page.locator("canvas[data-story-canvas]").count(), 0);
      assert.equal(
        await page
          .getByRole("navigation", { exact: true, name: "Primary" })
          .count(),
        1
      );
    }
  );
  const touchContext = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { height: 844, width: 390 },
  });
  const touchPage = await touchContext.newPage();
  await touchPage.goto(`${base}/story`, { waitUntil: "networkidle" });
  await ready(touchPage);
  await check(
    "Touch Pause stays paused and viewport resize preserves destination",
    async () => {
      await touchPage.getByRole("slider").fill("620");
      await touchPage
        .getByRole("button", { exact: true, name: "Play journey" })
        .tap();
      await touchPage.waitForTimeout(500);
      await touchPage
        .getByRole("button", { exact: true, name: "Pause journey" })
        .tap();
      await touchPage
        .getByRole("button", { exact: true, name: "Play journey" })
        .waitFor();
      const paused = Number(await touchPage.getByRole("slider").inputValue());
      await touchPage.waitForTimeout(300);
      assert.ok(
        Math.abs(
          Number(await touchPage.getByRole("slider").inputValue()) - paused
        ) <= 1
      );
      await touchPage.getByRole("slider").fill("760");
      await touchPage.setViewportSize({ height: 760, width: 390 });
      await touchPage.waitForTimeout(350);
      assert.ok(
        Math.abs(
          Number(await touchPage.getByRole("slider").inputValue()) - 760
        ) <= 1
      );
    }
  );
  await touchContext.close();
  await context.close();
  for (const mode of ["reduce", "no-js", "no-webgl", "partial-failure"]) {
    const context = await browser.newContext({
      javaScriptEnabled: mode !== "no-js",
      reducedMotion: mode === "reduce" ? "reduce" : "no-preference",
      viewport: { height: 844, width: 390 },
    });
    if (mode === "no-webgl")
      await context.addInitScript(() => {
        const getContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, ...args) {
          return type.includes("webgl")
            ? null
            : getContext.call(this, type, ...args);
        };
      });
    if (mode === "partial-failure")
      await context.addInitScript(() => {
        const getContext = HTMLCanvasElement.prototype.getContext;
        let failed = false;
        HTMLCanvasElement.prototype.getContext = function (type, ...args) {
          if (
            type === "2d" &&
            !failed &&
            document.querySelector("canvas[data-story-canvas]")
          ) {
            failed = true;
            return null;
          }
          return getContext.call(this, type, ...args);
        };
      });
    const page = await context.newPage();
    page.setDefaultTimeout(15_000);
    await page.goto(`${base}/story`, { waitUntil: "networkidle" });
    await check(`${mode}: complete readable fallback`, async () => {
      await page.locator("article").waitFor();
      assert.equal(await page.locator("canvas").count(), 0);
      assert.equal(await page.getByRole("heading", { level: 1 }).count(), 1);
      assert.ok(
        (await page.getByRole("main").innerText()).includes("Blogging Orb")
      );
      assert.ok(
        (await page.getByRole("main").innerText()).includes("Backyard Science")
      );
    });
    if (mode === "partial-failure")
      await check(
        "Retry after partial scene creation leaves exactly one canvas",
        async () => {
          await page
            .getByRole("button", { name: "Try the 3D view again" })
            .click();
          await ready(page);
          assert.equal(
            await page.locator("canvas[data-story-canvas]").count(),
            1
          );
        }
      );
    if (mode === "reduce")
      await page.screenshot({ path: `${out}/reduced-motion.png` });
    await context.close();
  }
} catch (error) {
  if (!failures.length)
    failures.push({ error: String(error), name: "Browser capture or setup" });
} finally {
  await browser.close();
}
const report = {
  failures,
  passed: results,
  runtimeErrors: errors,
  testedAt: new Date().toISOString(),
};
await writeFile(`${out}/checks.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
assert.equal(failures.length, 0, "Story checks failed");
assert.equal(errors.length, 0, "Runtime errors");
