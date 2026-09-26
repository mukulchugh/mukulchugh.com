// biome-ignore-all lint/performance/noAwaitInLoops: Isolate each booking outcome and viewport.
// All booking POSTs are intercepted. This check never creates an appointment.
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.SITE_URL || "http://localhost:4182";
const browser = await chromium.launch();
await mkdir(".impeccable/review", { recursive: true });
try {
  for (const outcome of [
    "accepted",
    "pending",
    "conflict",
    "network",
    "server-error",
    "invalid",
    "unavailable",
  ]) {
    const context = await browser.newContext({
      viewport: { height: 1000, width: 1440 },
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.bookingLayoutShift = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          if (!entry.hadRecentInput) window.bookingLayoutShift += entry.value;
      }).observe({ buffered: true, type: "layout-shift" });
    });
    await page.clock.setFixedTime(new Date("2026-09-25T00:00:00Z"));
    const errors = [];
    const submissions = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await context.route("**/api.cal.com/**", async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (request.method() === "POST") {
        assert.equal(url.pathname, "/v2/bookings");
        const data = request.postDataJSON();
        submissions.push(data);
        assert.equal(data.username, "mukulchugh");
        assert.equal(data.eventTypeSlug, "15min");
        assert.equal(data.attendee.email, "fixture@example.com");
        assert.deepEqual(data.guests, ["guest@example.com"]);
        assert.equal(data.allowConflicts, undefined);
        assert.equal(request.headers()["cal-api-version"], "2026-02-25");
        if (outcome === "network") return route.abort();
        if (outcome === "server-error")
          return route.fulfill({ json: { status: "error" }, status: 500 });
        if (outcome === "conflict")
          return route.fulfill({ json: { status: "error" }, status: 409 });
        if (outcome === "invalid")
          return route.fulfill({ json: { status: "error" }, status: 400 });
        return route.fulfill({
          json: {
            data: { status: outcome, uid: "test-only" },
            status: "success",
          },
          status: 201,
        });
      }
      assert.equal(url.pathname, "/v2/slots");
      if (outcome === "unavailable")
        return route.fulfill({ json: { status: "error" }, status: 503 });
      const date = url.searchParams.get("start");
      return route.fulfill({
        json: {
          data: {
            [date]: [
              { start: `${date}T18:00:00Z` },
              { start: `${date}T18:30:00Z` },
            ],
          },
          status: "success",
        },
      });
    });
    await page.goto(`${base}/contact`);
    // The wrapping label also contains option text once timezones populate.
    await page
      .getByRole("combobox", { exact: true, name: "Timezone" })
      .waitFor();
    await page.waitForTimeout(350);
    assert.ok(
      (await page.evaluate(() => window.bookingLayoutShift)) < 0.01,
      "Booking styles must be present before hydration without a layout jump"
    );
    await page.getByLabel("Date", { exact: true }).fill("2026-12-10");
    if (outcome === "unavailable") {
      await page
        .getByRole("button", { exact: true, name: "Try again" })
        .waitFor();
      assert.equal(await page.locator('iframe[src*="cal.com"]').count(), 0);
      await context.close();
      continue;
    }
    const slots = page
      .locator('[class*="booking-calendar"] button')
      .filter({ hasText: /\d/ });
    await slots.first().click();
    await page.getByLabel("Your name", { exact: true }).fill("Fixture Visitor");
    await page
      .getByLabel("Email address", { exact: true })
      .fill("fixture@example.com");
    await page.getByText("Add guests", { exact: true }).click();
    await page.getByLabel(/Guest emails/).fill("guest@example.com");
    await page
      .getByRole("button", { exact: true, name: "Confirm booking" })
      .click();
    if (outcome === "accepted")
      await page.getByRole("heading", { name: "See you soon." }).waitFor();
    if (outcome === "pending")
      await page
        .getByRole("heading", { name: "Your request is in." })
        .waitFor();
    if (outcome === "network" || outcome === "server-error")
      await page
        .getByRole("alert")
        .filter({ hasText: "Check your email before trying again" })
        .waitFor();
    if (outcome === "invalid")
      await page
        .getByRole("alert")
        .filter({ hasText: "Cal couldn’t complete" })
        .waitFor();
    if (outcome === "conflict") {
      await page
        .getByRole("alert")
        .filter({ hasText: "no longer available" })
        .waitFor();
      await slots.first().click();
      assert.equal(
        await page.getByLabel("Your name", { exact: true }).inputValue(),
        "Fixture Visitor"
      );
    }
    assert.equal(submissions.length, 1);
    assert.deepEqual(errors, []);
    await context.close();
  }
  for (const theme of ["light", "dark"]) {
    for (const width of [1440, 320]) {
      const context = await browser.newContext({
        reducedMotion: "reduce",
        viewport: { height: 1000, width },
      });
      await context.addInitScript(
        (value) => localStorage.setItem("theme", value),
        theme
      );
      await context.route("**/api.cal.com/**", (route) => {
        if (route.request().method() !== "GET") return route.abort();
        const date = new URL(route.request().url()).searchParams.get("start");
        return route.fulfill({
          json: {
            data: {
              [date]: Array.from({ length: 8 }, (_, i) => ({
                start: `${date}T${String(12 + i).padStart(2, "0")}:00:00Z`,
              })),
            },
            status: "success",
          },
        });
      });
      const page = await context.newPage();
      await page.goto(`${base}/contact`);
      await page.getByLabel("Date", { exact: true }).fill("2026-12-10");
      await page
        .getByText("Choose your start time.", { exact: true })
        .waitFor();
      await page.evaluate(() => document.fonts.ready);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        )
      );
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        fullPage: true,
        path: `.impeccable/review/booking-${theme}-${width}.png`,
      });
      await page
        .locator('[class*="booking-calendar"] button')
        .filter({ hasText: /\d/ })
        .first()
        .click();
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        )
      );
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        fullPage: true,
        path: `.impeccable/review/booking-details-${theme}-${width}.png`,
      });
      await context.close();
    }
  }
  console.log(
    "PASS: native booking outcomes, preserved details, narrow layouts and both themes. All booking submissions mocked."
  );
} finally {
  await browser.close();
}
