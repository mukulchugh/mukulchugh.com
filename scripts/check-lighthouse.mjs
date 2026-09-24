// biome-ignore-all lint/performance/noAwaitInLoops: Serial audits avoid CPU contention between measurements.
import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";
import { chromium } from "playwright";

const run = promisify(execFile);
const base = process.env.SITE_URL || "http://localhost:4181";
const output = resolve(process.env.AUDIT_DIR || ".scratch/lighthouse");
const response = await fetch(`${base}/sitemap.xml`);
if (!response.ok) throw new Error(`Sitemap returned ${response.status}`);
const sitemap = await response.text();
const routes =
  process.env.AUDIT_ROUTES?.split(",") ||
  [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname
  );
const modes = (process.env.AUDIT_MODES || "mobile,desktop").split(",");
if (
  !routes.length ||
  modes.some((mode) => !["mobile", "desktop"].includes(mode))
) {
  throw new Error(
    "The audit requires public routes and valid mobile/desktop modes"
  );
}
const results = [];
await mkdir(output, { recursive: true });

for (const route of routes) {
  for (const mode of modes) {
    const file = resolve(
      output,
      `${route.replaceAll("/", "_") || "home"}-${mode}.json`
    );
    const args = [
      "exec",
      "--yes",
      "--package=lighthouse@13.5.0",
      "--",
      "lighthouse",
      new URL(route, base).href,
      "--output=json",
      `--output-path=${file}`,
      "--quiet",
      "--only-categories=performance,accessibility,best-practices,seo",
      "--chrome-flags=--headless=new --disable-dev-shm-usage",
      ...(mode === "desktop" ? ["--preset=desktop"] : []),
      ...(process.env.AUDIT_TRACE === "1"
        ? [
            "--save-assets",
            "--additional-trace-categories=disabled-by-default-v8.cpu_profiler",
          ]
        : []),
    ];
    try {
      await run("npm", args, {
        env: { ...process.env, CHROME_PATH: chromium.executablePath() },
        maxBuffer: 5 * 1024 * 1024,
        timeout: 180_000,
      });
      const report = JSON.parse(await readFile(file, "utf8"));
      if (report.runtimeError) throw new Error(report.runtimeError.message);
      const scores = Object.fromEntries(
        Object.entries(report.categories).map(([key, value]) => [
          key,
          Math.round(value.score * 100),
        ])
      );
      const row = {
        benchmarkIndex: report.environment.benchmarkIndex,
        cls: report.audits["cumulative-layout-shift"].numericValue,
        failures: Object.values(report.audits)
          .filter((audit) => audit.score !== null && audit.score < 1)
          .map(({ id, title, displayValue }) => ({ displayValue, id, title })),
        fetchTime: report.fetchTime,
        lcp: report.audits["largest-contentful-paint"].numericValue,
        mode,
        route,
        scores,
        tbt: report.audits["total-blocking-time"].numericValue,
      };
      results.push(row);
      console.log(JSON.stringify({ ...row, failures: row.failures.length }));
    } catch (error) {
      const row = { error: error.message, mode, route };
      results.push(row);
      console.error(JSON.stringify(row));
    }
    await writeFile(
      resolve(output, "summary.json"),
      JSON.stringify(results, null, 2)
    );
  }
}

const failures = results.filter(
  (row) => row.error || Object.values(row.scores).some((score) => score < 100)
);
console.log(
  `${results.length} audits complete; ${failures.length} below the requested 100 target. Reports: ${output}`
);
process.exitCode = failures.length ? 1 : 0;
