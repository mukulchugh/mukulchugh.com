import assert from "node:assert/strict";
import {
  AGENTIC_CATEGORY,
  aggregateRuns,
  buildRouteAggregate,
  DEFAULT_BUDGETS,
  evaluateBudget,
  evaluateTargets,
  median,
  parseRepeats,
  selectCategories,
  spread,
  validateBudgets,
} from "./check-lighthouse.mjs";

// median / spread
assert.equal(median([3, 1, 2]), 2);
assert.equal(median([1, 2, 3, 4]), 2.5);
assert.equal(spread([1, 5, 3]), 4);

// parseRepeats: bounded positive integer only
assert.equal(parseRepeats(undefined), 1);
assert.equal(parseRepeats("3"), 3);
for (const bad of [
  "Infinity",
  "-Infinity",
  "1.5",
  "NaN",
  "-1",
  "0",
  "",
  "abc",
  "21",
]) {
  assert.throws(
    () => parseRepeats(bad),
    undefined,
    `parseRepeats("${bad}") should throw`
  );
}
assert.equal(parseRepeats("20"), 20);

// aggregateRuns + evaluateBudget: an in-budget aggregate reports no breaches
const clean = [
  {
    cls: 0,
    lcp: 4000,
    scores: {
      accessibility: 100,
      "best-practices": 100,
      performance: 70,
      seo: 100,
    },
    tbt: 100,
  },
  {
    cls: 0.02,
    lcp: 4800,
    scores: {
      accessibility: 100,
      "best-practices": 100,
      performance: 80,
      seo: 100,
    },
    tbt: 150,
  },
];
const aggregate = aggregateRuns("/", "mobile", clean);
assert.equal(aggregate.runs, 2);
assert.equal(aggregate.lcp, 4400);
assert.equal(aggregate.lcpSpread, 800);
assert.equal(aggregate.scores.performance, 75);
assert.deepEqual(evaluateBudget(aggregate, DEFAULT_BUDGETS.mobile), []);
assert.deepEqual(evaluateBudget(aggregate, undefined), []);

// evaluateBudget: an out-of-budget aggregate reports every breach, by metric
const overBudget = evaluateBudget(
  aggregateRuns("/heavy", "mobile", [
    {
      cls: 0.2,
      lcp: 6000,
      scores: {
        accessibility: 90,
        "best-practices": 100,
        performance: 40,
        seo: 100,
      },
      tbt: 500,
    },
  ]),
  DEFAULT_BUDGETS.mobile
);
assert.equal(overBudget.length, 5);
assert.ok(overBudget.some((line) => line.includes("performance median 40")));
assert.ok(overBudget.some((line) => line.includes("LCP median 6000ms")));
assert.ok(overBudget.some((line) => line.includes("TBT median 500ms")));
assert.ok(overBudget.some((line) => line.includes("CLS median 0.2")));

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

// evaluateTargets: below-100 scores and failed reports both fail, and
// a full-100 run with no error contributes nothing -- proving the strict
// all-100 gate without ever launching a browser.
const rows = [
  {
    mode: "mobile",
    route: "/",
    run: 1,
    scores: {
      accessibility: 100,
      "best-practices": 100,
      performance: 99,
      seo: 100,
    },
  },
  {
    mode: "mobile",
    route: "/about",
    run: 1,
    scores: {
      accessibility: 100,
      "best-practices": 100,
      performance: 100,
      seo: 100,
    },
  },
  {
    error: "Runtime error: page crashed",
    mode: "mobile",
    route: "/blog",
    run: 2,
  },
];
const targetFailures = evaluateTargets(rows, CATEGORIES);
assert.equal(targetFailures.length, 2);
assert.ok(
  targetFailures.some(
    (line) => line.includes("/") && line.includes("performance 99 < 100")
  )
);
assert.ok(
  targetFailures.some(
    (line) => line.includes("/blog") && line.includes("failed to report")
  )
);
assert.deepEqual(
  evaluateTargets([rows[1]], CATEGORIES),
  [],
  "an all-100, error-free run must not be reported as a target failure"
);

// Direct false-green regressions the coordinator caught: an empty/partial
// scores object, and a NaN score, must not silently pass just because the
// row lacks (or corrupts) the category rather than scoring it below 100.
assert.equal(
  evaluateTargets(
    [{ mode: "mobile", route: "/", run: 1, scores: {} }],
    CATEGORIES
  ).length,
  CATEGORIES.length,
  "an empty scores object must report one failure per required category"
);
assert.ok(
  evaluateTargets(
    [
      {
        mode: "mobile",
        route: "/",
        run: 1,
        scores: { performance: Number.NaN },
      },
    ],
    CATEGORIES
  ).some(
    (line) => line.includes("performance") && line.includes("invalid score")
  ),
  "a NaN score must be reported as invalid, not silently pass"
);
assert.ok(
  evaluateTargets(
    [{ mode: "mobile", route: "/", run: 1, scores: { performance: null } }],
    CATEGORIES
  ).some(
    (line) => line.includes("performance") && line.includes("missing/unscored")
  ),
  "a null score (Lighthouse's own unscored marker) must be reported as missing evidence, not silently pass"
);

// validateBudgets: missing mode, missing category, non-finite metrics, and
// out-of-range values all fail fast rather than silently skipping the gap.
assert.throws(
  () =>
    validateBudgets({ mobile: DEFAULT_BUDGETS.mobile }, ["mobile", "desktop"]),
  /requires a budget for mode "desktop"/
);
assert.throws(
  () =>
    validateBudgets(
      {
        mobile: {
          cls: 0.1,
          lcp: 5000,
          scores: { ...DEFAULT_BUDGETS.mobile.scores, performance: -1 },
          tbt: 400,
        },
      },
      ["mobile"]
    ),
  /needs a finite 0-100 score minimum for "performance"/,
  "a negative score budget must be rejected, not silently accepted"
);
assert.throws(
  () =>
    validateBudgets(
      {
        mobile: {
          cls: 0.1,
          lcp: 5000,
          scores: { ...DEFAULT_BUDGETS.mobile.scores, seo: 150 },
          tbt: 400,
        },
      },
      ["mobile"]
    ),
  /needs a finite 0-100 score minimum for "seo"/,
  "a score budget above 100 must be rejected"
);
assert.throws(
  () =>
    validateBudgets(
      {
        mobile: {
          cls: 0.1,
          lcp: -1,
          scores: DEFAULT_BUDGETS.mobile.scores,
          tbt: 400,
        },
      },
      ["mobile"]
    ),
  /needs a finite, nonnegative "lcp" threshold/,
  "a negative metric threshold must be rejected"
);
assert.throws(
  () =>
    validateBudgets(
      {
        mobile: {
          cls: 0.1,
          lcp: 5000,
          scores: { accessibility: 100, "best-practices": 90, seo: 100 },
          tbt: 400,
        },
      },
      ["mobile"]
    ),
  /needs a finite 0-100 score minimum for "performance"/
);
assert.throws(
  () =>
    validateBudgets(
      {
        mobile: {
          cls: 0.1,
          lcp: Number.POSITIVE_INFINITY,
          scores: DEFAULT_BUDGETS.mobile.scores,
          tbt: 400,
        },
      },
      ["mobile"]
    ),
  /needs a finite, nonnegative "lcp" threshold/
);
assert.deepEqual(
  validateBudgets(DEFAULT_BUDGETS, ["mobile", "desktop"]),
  DEFAULT_BUDGETS
);

// aggregateRuns must never treat a null (Lighthouse's own "could not
// assess" marker) or NaN value as a real 0 inside a median: the coordinator's
// fourth report. The aggregate itself must stay null so the gap in evidence
// is visible, not hidden behind an averaged-looking number.
const withNullCategory = aggregateRuns("/", "mobile", [
  {
    cls: 0,
    lcp: 4000,
    scores: {
      accessibility: 100,
      "best-practices": 100,
      performance: 80,
      seo: 100,
    },
    tbt: 100,
  },
  {
    cls: 0,
    lcp: 4200,
    scores: {
      accessibility: 100,
      "best-practices": 100,
      performance: null,
      seo: 100,
    },
    tbt: 120,
  },
]);
assert.equal(
  withNullCategory.scores.performance,
  null,
  "a null category score in any run must make the aggregate null, not a masked average"
);
assert.equal(withNullCategory.scores.accessibility, 100);

const withNaNMetric = aggregateRuns("/", "mobile", [
  {
    cls: 0,
    lcp: 4000,
    scores: {
      accessibility: 100,
      "best-practices": 100,
      performance: 80,
      seo: 100,
    },
    tbt: 100,
  },
  {
    cls: 0,
    lcp: Number.NaN,
    scores: {
      accessibility: 100,
      "best-practices": 100,
      performance: 90,
      seo: 100,
    },
    tbt: 100,
  },
]);
assert.equal(withNaNMetric.lcp, null);
assert.equal(withNaNMetric.lcpSpread, null);

// evaluateBudget must report a null aggregate value as its own failure --
// `null > budget.lcp` silently coerces to `false` (a passing comparison) in
// JavaScript, so this cannot be left to the default `>` check.
assert.ok(
  evaluateBudget(withNullCategory, DEFAULT_BUDGETS.mobile).some(
    (line) =>
      line.includes("performance") && line.includes("no valid aggregate score")
  )
);
assert.ok(
  evaluateBudget(withNaNMetric, DEFAULT_BUDGETS.mobile).some((line) =>
    line.includes("no valid aggregate LCP")
  )
);

// buildRouteAggregate: the coordinator's core report. A default,
// non-budget-mode run with AUDIT_REPEATS > 1 must still produce a populated
// aggregate -- this was silently empty because aggregation was nested
// inside `if (budgetMode)`. Budget comparison alone stays conditional.
const repeatedRuns = [
  {
    cls: 0,
    lcp: 4000,
    mode: "mobile",
    route: "/",
    run: 1,
    scores: {
      accessibility: 100,
      "best-practices": 100,
      performance: 60,
      seo: 100,
    },
    tbt: 100,
  },
  {
    cls: 0,
    lcp: 4100,
    mode: "mobile",
    route: "/",
    run: 2,
    scores: {
      accessibility: 100,
      "best-practices": 100,
      performance: 58,
      seo: 100,
    },
    tbt: 110,
  },
  {
    cls: 0,
    lcp: 3900,
    mode: "mobile",
    route: "/",
    run: 3,
    scores: {
      accessibility: 100,
      "best-practices": 100,
      performance: 62,
      seo: 100,
    },
    tbt: 90,
  },
];
const defaultRun = buildRouteAggregate("/", "mobile", repeatedRuns, {
  budgetMode: false,
});
assert.ok(
  defaultRun.aggregate,
  "AUDIT_REPEATS>1 without budget mode must still produce a populated aggregate (regression for the empty aggregate.json bug)"
);
assert.equal(defaultRun.aggregate.runs, 3);
assert.equal(defaultRun.aggregate.scores.performance, 60);
assert.deepEqual(
  defaultRun.budgetFailures,
  [],
  "budget comparison itself stays off unless budgetMode is set"
);

const budgetRun = buildRouteAggregate("/", "mobile", repeatedRuns, {
  budgetMode: true,
  budgets: DEFAULT_BUDGETS,
});
assert.ok(
  budgetRun.budgetFailures.some((line) =>
    line.includes("performance median 60")
  ),
  "the same repeats, with budget mode on, must report the real budget breach"
);

assert.deepEqual(
  buildRouteAggregate(
    "/",
    "mobile",
    [{ error: "crashed", mode: "mobile", route: "/", run: 1 }],
    { budgetMode: true, budgets: DEFAULT_BUDGETS }
  ),
  { aggregate: null, budgetFailures: [] },
  "an all-errored route/mode has no evidence to aggregate"
);

// selectCategories: Agentic Browsing is required by default (the owner now
// requires all five categories), and only an explicit "0" opts a diagnostic
// run out -- never silently, and never leaving only four categories checked
// while still being reported as the full target.
const ALL_FIVE = [...CATEGORIES, AGENTIC_CATEGORY];
assert.deepEqual(
  selectCategories(undefined),
  ALL_FIVE,
  "agentic-browsing must be included by default with no env var set"
);
assert.deepEqual(
  selectCategories("1"),
  ALL_FIVE,
  "an explicit AUDIT_AGENTIC=1 must match the default (redundant, not additive)"
);
assert.deepEqual(
  selectCategories("nonsense"),
  ALL_FIVE,
  'only an exact "0" opts out; any other value keeps the required default'
);
assert.deepEqual(
  selectCategories("0"),
  CATEGORIES,
  "an explicit AUDIT_AGENTIC=0 must opt a diagnostic run out of agentic-browsing"
);

// evaluateTargets across all five selected categories: agentic-browsing is
// enforced exactly like every other required category -- a genuine 100 run
// passes, but a missing, null, or below-100 agentic-browsing score fails,
// and none of that is reported as success.
const fiveCategoryRow = {
  mode: "mobile",
  route: "/",
  run: 1,
  scores: {
    accessibility: 100,
    "agentic-browsing": 100,
    "best-practices": 100,
    performance: 100,
    seo: 100,
  },
};
assert.deepEqual(
  evaluateTargets([fiveCategoryRow], ALL_FIVE),
  [],
  "a genuine all-five, all-100 run must not be flagged"
);

const missingAgenticScores = { ...fiveCategoryRow.scores };
missingAgenticScores["agentic-browsing"] = undefined;
assert.ok(
  evaluateTargets(
    [{ ...fiveCategoryRow, scores: missingAgenticScores }],
    ALL_FIVE
  ).some(
    (line) =>
      line.includes("agentic-browsing") && line.includes("missing/unscored")
  ),
  "a report missing the agentic-browsing category entirely must fail, not be treated as a pass"
);

assert.ok(
  evaluateTargets(
    [
      {
        ...fiveCategoryRow,
        scores: { ...fiveCategoryRow.scores, "agentic-browsing": null },
      },
    ],
    ALL_FIVE
  ).some(
    (line) =>
      line.includes("agentic-browsing") && line.includes("missing/unscored")
  ),
  "a null (unscored) agentic-browsing category must never be reported as success"
);

assert.ok(
  evaluateTargets(
    [
      {
        ...fiveCategoryRow,
        scores: { ...fiveCategoryRow.scores, "agentic-browsing": 80 },
      },
    ],
    ALL_FIVE
  ).some((line) => line.includes("agentic-browsing 80 < 100")),
  "agentic-browsing below 100 must fail exactly like any other required category"
);

console.log(
  "check-lighthouse-budgets: parseRepeats/validateBudgets/evaluateTargets/evaluateBudget/median/spread/aggregateRuns all pass."
);
