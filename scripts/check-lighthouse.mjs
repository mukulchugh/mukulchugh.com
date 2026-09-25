// biome-ignore-all lint/performance/noAwaitInLoops: Serial audits avoid CPU contention between measurements.
import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";
import { chromium } from "playwright";

const run = promisify(execFile);
const VALID_MODES = ["mobile", "desktop"];
const MAX_REPEATS = 20;
const CORE_CATEGORIES = [
  "performance",
  "accessibility",
  "best-practices",
  "seo",
];
export const AGENTIC_CATEGORY = "agentic-browsing";

// Agentic Browsing is a required target category by default, exactly like
// the other four -- the owner requires all five. Only an explicit
// AUDIT_AGENTIC="0" opts a diagnostic run out of it; any other value
// (including unset) keeps it in. Never silent: runAudit reports whenever a
// run excludes it, so a four-category pass can never be read as "all five."
export const selectCategories = (auditAgenticEnv) =>
  auditAgenticEnv === "0"
    ? [...CORE_CATEGORIES]
    : [...CORE_CATEGORIES, AGENTIC_CATEGORY];
// Budgets only ever cover the four fixed non-agentic Lighthouse categories
// (CORE_CATEGORIES above). Agentic Browsing is a required target category by
// default (see selectCategories above) but has no regression-budget
// baseline of its own.
const BUDGET_CATEGORIES = CORE_CATEGORIES;

// Regression-only baselines, evaluated exclusively when AUDIT_BUDGET_MODE=1.
// These exist to flag drift between repeats, not to replace the all-100
// target: a route can pass every budget here while still failing the target
// gate below, and the two are always reported separately.
export const DEFAULT_BUDGETS = {
  desktop: {
    cls: 0.1,
    lcp: 3000,
    scores: {
      accessibility: 100,
      "best-practices": 90,
      performance: 90,
      seo: 100,
    },
    tbt: 300,
  },
  mobile: {
    cls: 0.1,
    lcp: 5000,
    scores: {
      accessibility: 100,
      "best-practices": 90,
      performance: 75,
      seo: 100,
    },
    tbt: 400,
  },
};

// Bounded positive integer only: rejects Infinity, fractions, NaN, <= 0, and
// anything past MAX_REPEATS rather than looping indefinitely or silently
// coercing a bad value to a default.
export const parseRepeats = (value) => {
  if (value === undefined) return 1;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`AUDIT_REPEATS must be a positive integer, got "${value}"`);
  }
  if (parsed > MAX_REPEATS) {
    throw new Error(
      `AUDIT_REPEATS must be <= ${MAX_REPEATS} to bound serial audit time, got ${parsed}`
    );
  }
  return parsed;
};

// Fails fast and loudly on any gap: a missing mode, a missing category, or a
// non-finite threshold is an error, never a silently skipped check.
export const validateBudgets = (budgets, modes) => {
  for (const mode of modes) {
    const budget = budgets[mode];
    if (!budget) {
      throw new Error(`AUDIT_BUDGET_MODE requires a budget for mode "${mode}"`);
    }
    for (const category of BUDGET_CATEGORIES) {
      const minimum = budget.scores?.[category];
      if (!Number.isFinite(minimum) || minimum < 0 || minimum > 100) {
        throw new Error(
          `Budget for mode "${mode}" needs a finite 0-100 score minimum for "${category}", got ${minimum}`
        );
      }
    }
    for (const metric of ["lcp", "tbt", "cls"]) {
      const threshold = budget[metric];
      if (!Number.isFinite(threshold) || threshold < 0) {
        throw new Error(
          `Budget for mode "${mode}" needs a finite, nonnegative "${metric}" threshold, got ${threshold}`
        );
      }
    }
  }
  return budgets;
};

export const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
};

export const spread = (values) => Math.max(...values) - Math.min(...values);

// A single null (Lighthouse's own "could not assess" marker) or corrupted
// non-finite value must never be silently treated as a real 0 inside a
// median/spread -- the aggregate itself reports null so missing/invalid
// evidence stays visible instead of hiding behind an average.
const aggregateStat = (values) =>
  values.every(Number.isFinite)
    ? { median: median(values), spread: spread(values) }
    : { median: null, spread: null };

export const aggregateRuns = (route, mode, clean) => {
  const cls = aggregateStat(clean.map((row) => row.cls));
  const lcp = aggregateStat(clean.map((row) => row.lcp));
  const tbt = aggregateStat(clean.map((row) => row.tbt));
  return {
    cls: cls.median,
    clsSpread: cls.spread,
    lcp: lcp.median,
    lcpSpread: lcp.spread,
    mode,
    route,
    runs: clean.length,
    scores: Object.fromEntries(
      Object.keys(clean[0].scores).map((category) => [
        category,
        aggregateStat(clean.map((row) => row.scores[category])).median,
      ])
    ),
    tbt: tbt.median,
    tbtSpread: tbt.spread,
  };
};

// Regression-budget check only (opt-in). Never describes the all-100 target
// as met; it only reports drift against a looser baseline. A null aggregate
// value (from aggregateStat above) is itself reported as a failure -- it
// must never silently pass a `null > budget` comparison.
export const evaluateBudget = (aggregate, budget) => {
  if (!budget) return [];
  const failures = [];
  for (const [category, minimum] of Object.entries(budget.scores)) {
    const actual = aggregate.scores[category];
    if (actual === null || actual === undefined) {
      failures.push(
        `${aggregate.route} (${aggregate.mode}) ${category} has no valid aggregate score (unscored/invalid run evidence)`
      );
    } else if (actual < minimum) {
      failures.push(
        `${aggregate.route} (${aggregate.mode}) ${category} median ${actual} < budget ${minimum}`
      );
    }
  }
  if (aggregate.lcp === null) {
    failures.push(
      `${aggregate.route} (${aggregate.mode}) has no valid aggregate LCP (unscored/invalid run evidence)`
    );
  } else if (aggregate.lcp > budget.lcp) {
    failures.push(
      `${aggregate.route} (${aggregate.mode}) LCP median ${Math.round(aggregate.lcp)}ms > budget ${budget.lcp}ms`
    );
  }
  if (aggregate.tbt === null) {
    failures.push(
      `${aggregate.route} (${aggregate.mode}) has no valid aggregate TBT (unscored/invalid run evidence)`
    );
  } else if (aggregate.tbt > budget.tbt) {
    failures.push(
      `${aggregate.route} (${aggregate.mode}) TBT median ${Math.round(aggregate.tbt)}ms > budget ${budget.tbt}ms`
    );
  }
  if (aggregate.cls === null) {
    failures.push(
      `${aggregate.route} (${aggregate.mode}) has no valid aggregate CLS (unscored/invalid run evidence)`
    );
  } else if (aggregate.cls > budget.cls) {
    failures.push(
      `${aggregate.route} (${aggregate.mode}) CLS median ${aggregate.cls} > budget ${budget.cls}`
    );
  }
  return failures;
};

// Always aggregates clean (non-errored) runs for one route/mode -- the
// promised medians/spread must survive a plain AUDIT_REPEATS run with no
// flags. Budget comparison itself is the only part gated on budgetMode.
export const buildRouteAggregate = (route, mode, runs, options = {}) => {
  const { budgetMode = false, budgets = null } = options;
  const clean = runs.filter((row) => !row.error);
  if (!clean.length) return { aggregate: null, budgetFailures: [] };
  const aggregate = aggregateRuns(route, mode, clean);
  const budgetFailures = budgetMode
    ? evaluateBudget(aggregate, budgets?.[mode])
    : [];
  return { aggregate, budgetFailures };
};

// The actual owner-requested target: every selected category -- by default
// all five, including Agentic Browsing (see selectCategories) -- must score
// 100 on every run. Iterates the selected `categories` themselves, not just
// whatever happens to be present on the row, so an empty/partial `scores`
// object cannot silently pass. A run that errored, or that has no valid
// score for a selected category (Lighthouse reports `null` when a category
// could not be scored), is itself a target failure -- never coerced to 0 or
// skipped. Operates per individual run, not a median, so one bad run cannot
// hide behind an averaged pass.
export const evaluateTargets = (rows, categories) => {
  const failures = [];
  for (const row of rows) {
    if (row.error) {
      failures.push(
        `${row.route} (${row.mode}) run ${row.run ?? 1} failed to report: ${row.error}`
      );
      continue;
    }
    for (const category of categories) {
      const score = row.scores?.[category];
      if (score === null || score === undefined) {
        failures.push(
          `${row.route} (${row.mode}) run ${row.run ?? 1} ${category} has no valid score (missing/unscored evidence)`
        );
      } else if (!Number.isFinite(score) || score < 0 || score > 100) {
        failures.push(
          `${row.route} (${row.mode}) run ${row.run ?? 1} ${category} reported an invalid score (${score})`
        );
      } else if (score < 100) {
        failures.push(
          `${row.route} (${row.mode}) run ${row.run ?? 1} ${category} ${score} < 100`
        );
      }
    }
  }
  return failures;
};

const isMain =
  process.argv[1] && import.meta.url === new URL(process.argv[1], "file:").href;

if (isMain) {
  await runAudit();
}

async function runAudit() {
  const base = process.env.SITE_URL || "http://localhost:4181";
  const output = resolve(process.env.AUDIT_DIR || ".scratch/lighthouse");
  const repeats = parseRepeats(process.env.AUDIT_REPEATS);
  const budgetMode = process.env.AUDIT_BUDGET_MODE === "1";
  const response = await fetch(`${base}/sitemap.xml`);
  if (!response.ok) throw new Error(`Sitemap returned ${response.status}`);
  const sitemap = await response.text();
  const routes =
    process.env.AUDIT_ROUTES?.split(",") ||
    [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
      (match) => new URL(match[1]).pathname
    );
  const modes = (process.env.AUDIT_MODES || "mobile,desktop").split(",");
  if (!routes.length || modes.some((mode) => !VALID_MODES.includes(mode))) {
    throw new Error(
      "The audit requires public routes and valid mobile/desktop modes"
    );
  }

  // Agentic Browsing is a required target category by default, alongside
  // the other four; only an explicit AUDIT_AGENTIC="0" opts a diagnostic run
  // out of it, and that exclusion is always reported below, never silent.
  const categories = selectCategories(process.env.AUDIT_AGENTIC);
  if (!categories.includes(AGENTIC_CATEGORY)) {
    console.log(
      `Diagnostic mode: ${AGENTIC_CATEGORY} excluded via AUDIT_AGENTIC=0. This run only enforces the all-100 target on ${categories.length} of 5 required categories (${categories.join(", ")}) -- it is not a pass of the full target.`
    );
  }

  const budgets = budgetMode
    ? validateBudgets(
        process.env.AUDIT_BUDGETS_JSON
          ? JSON.parse(process.env.AUDIT_BUDGETS_JSON)
          : DEFAULT_BUDGETS,
        modes
      )
    : null;

  const lighthousePackage = "lighthouse@13.5.0";
  const { stdout: commit } = await run("git", ["rev-parse", "HEAD"]).catch(
    () => ({ stdout: "unknown" })
  );
  const metadata = {
    browser: null,
    budgetMode,
    categories,
    commit: commit.trim(),
    lighthouse: lighthousePackage,
    modes,
    node: process.version,
    repeats,
    routes: routes.length,
    startedAt: new Date().toISOString(),
  };

  const results = [];
  const aggregates = [];
  const budgetFailures = [];
  await mkdir(output, { recursive: true });

  for (const route of routes) {
    for (const mode of modes) {
      const runs = [];
      for (let attempt = 1; attempt <= repeats; attempt++) {
        const suffix = repeats > 1 ? `-run${attempt}` : "";
        const file = resolve(
          output,
          `${route.replaceAll("/", "_") || "home"}-${mode}${suffix}.json`
        );
        const args = [
          "exec",
          "--yes",
          `--package=${lighthousePackage}`,
          "--",
          "lighthouse",
          new URL(route, base).href,
          "--output=json",
          `--output-path=${file}`,
          "--quiet",
          `--only-categories=${categories.join(",")}`,
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
          metadata.browser ||= report.environment.hostUserAgent;
          const scores = Object.fromEntries(
            Object.entries(report.categories).map(([key, value]) => [
              key,
              // Lighthouse reports `score: null` when a category could not
              // be scored; preserve that explicitly rather than letting
              // `null * 100 === 0` silently look like a real, assessed 0.
              value.score === null ? null : Math.round(value.score * 100),
            ])
          );
          const row = {
            benchmarkIndex: report.environment.benchmarkIndex,
            cls: report.audits["cumulative-layout-shift"].numericValue,
            failures: Object.values(report.audits)
              .filter((audit) => audit.score !== null && audit.score < 1)
              .map(({ id, title, displayValue }) => ({
                displayValue,
                id,
                title,
              })),
            fetchTime: report.fetchTime,
            lcp: report.audits["largest-contentful-paint"].numericValue,
            mode,
            route,
            run: attempt,
            scores,
            tbt: report.audits["total-blocking-time"].numericValue,
          };
          runs.push(row);
          results.push(row);
          console.log(
            JSON.stringify({ ...row, failures: row.failures.length })
          );
        } catch (error) {
          const row = { error: error.message, mode, route, run: attempt };
          runs.push(row);
          results.push(row);
          console.error(JSON.stringify(row));
        }
        await writeFile(
          resolve(output, "summary.json"),
          JSON.stringify(results, null, 2)
        );
      }

      const { aggregate, budgetFailures: routeBudgetFailures } =
        buildRouteAggregate(route, mode, runs, { budgetMode, budgets });
      if (aggregate) aggregates.push(aggregate);
      budgetFailures.push(...routeBudgetFailures);
    }
  }

  metadata.finishedAt = new Date().toISOString();
  await writeFile(
    resolve(output, "aggregate.json"),
    JSON.stringify(aggregates, null, 2)
  );
  await writeFile(
    resolve(output, "metadata.json"),
    JSON.stringify(metadata, null, 2)
  );

  const targetFailures = evaluateTargets(results, categories);
  console.log(
    `${results.length} audits complete across ${repeats} repeat(s) on ${categories.length} categor${categories.length === 1 ? "y" : "ies"} (${categories.join(", ")}); ${targetFailures.length} target failure(s), each must be 100. Reports: ${output}`
  );
  for (const failure of targetFailures) {
    console.error(`Target failure: ${failure}`);
  }
  if (budgetMode) {
    console.log(
      `Budget mode ON: ${budgetFailures.length} regression-budget failure(s). This is a separate, looser baseline check for drift between repeats -- passing it does not mean the all-100 target above is met.`
    );
    for (const failure of budgetFailures) {
      console.error(`Budget failure: ${failure}`);
    }
  }
  process.exitCode =
    targetFailures.length || (budgetMode && budgetFailures.length) ? 1 : 0;
}
