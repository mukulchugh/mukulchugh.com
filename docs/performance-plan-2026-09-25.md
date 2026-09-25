# Performance measurement plan (2026-09-25)

Scope: `scripts/check-lighthouse.mjs`, `.github/workflows/performance.yml`, this
document. No route, component, or dependency changes; this is measurement and
release-guard tooling only, built on `docs/performance-audit-2026-09-24.md`'s
96-run sweep and the September 25 native-booking follow-up.

**Correction (this revision):** an earlier draft of this harness replaced the
all-100 exit gate with looser regression budgets (mobile performance 75,
desktop 90, etc.) by default. That was a mistake — the owner has explicitly
requested 100 in every category, and a passing regression check must never be
described or behave as if that target were met. That revision restored the
strict all-100 gate as the unconditional default and demoted budgets to an
explicit opt-in, reported separately and never merged into the same signal.

**Second correction (this revision):** the coordinator's final review found
concrete false-green cases in the restored pure helpers:
`evaluateTargets([{route:'/',mode:'mobile',scores:{}}])` returned `[]` (an
empty/partial `scores` object silently passed because the old code only
iterated whatever keys happened to be present, never the categories that were
actually selected); `evaluateTargets([{...,scores:{performance:NaN}}])` also
returned `[]` (`NaN < 100` is `false` in JavaScript, so a corrupted score
silently passed); and `validateBudgets` accepted a budget with
`performance: -1`. All three are fixed below, along with the underlying real-
parsing gap that made them possible: Lighthouse reports `score: null` for a
category it could not assess, and `null * 100 === 0` was silently coercing
"no evidence" into a real-looking assessed score of 0.

**Third correction (this revision):** `runAudit()` only ever called
`aggregateRuns()` and pushed to `aggregate.json` inside `if (budgetMode)`.
That meant the default invocation — including the harness's own headline
`AUDIT_REPEATS=3`-style example — silently produced an *empty*
`aggregate.json`, losing the medians/spread feature this harness exists to
provide, unless a user also happened to opt into `AUDIT_BUDGET_MODE=1`.
Fixed by extracting `buildRouteAggregate()`, which always aggregates a
route/mode's clean (non-errored) runs and only gates the *budget
comparison* — not the aggregation itself — on `budgetMode`. Separately, the
median/spread computation itself was auditing null/NaN values as if they
were `0`: fixed with `aggregateStat()`, which reports `null` for a
score/metric the moment any contributing run's value isn't a real finite
number, instead of quietly averaging a masked zero into the result.
`evaluateBudget()` was updated to treat a `null` aggregate value as its own
failure, since `null > budget.lcp` would otherwise silently coerce to a
passing comparison.

## What the harness enforces by default (no flags)

Every individual Lighthouse run — not a median, not a best-of — must score
100 in every selected category, and a run that errors (crashed page, timeout,
`report.runtimeError`) is itself a target failure. This applies to whichever
categories are actually selected: the default four
(`performance`, `accessibility`, `best-practices`, `seo`) and, if
`AUDIT_AGENTIC=1` opts a run into the real, upstream `agentic-browsing`
category (see `core/config/default-config.js` in the installed `lighthouse`
package — it is genuinely part of Lighthouse 13.5.0, not invented), that
category owes the same 100 target once selected. There is no built-in
exemption for it.

`evaluateTargets(rows, categories)` now takes the selected `categories`
explicitly and iterates *them* — not `Object.keys(row.scores)` — so a
missing, empty, or partial `scores` object can never silently pass just
because nothing was there to fail. For each required category on a
non-errored run:

- a `null` or `undefined` score (Lighthouse's own marker for "could not be
  assessed", or a category absent from the report) is a failure reporting
  missing/unscored evidence — never coerced into a passing or failing
  number;
- a non-finite or out-of-0–100-range score (`NaN`, a negative value, > 100)
  is a failure reporting an invalid score — `NaN < 100` is `false` in
  JavaScript, so this can no longer silently pass;
- only a genuine finite `0–100` score is compared against the `< 100` target.

Real parsing was fixed to match: `report.categories[key].score` is passed
through as `null` when Lighthouse itself could not score the category,
instead of relying on `null * 100 === 0` to quietly turn "no evidence" into
an assessed-looking `0`.

This is the pure function regression-tested without a browser (see below).
The process exit code is nonzero whenever `evaluateTargets()` returns any
failure.

## Opt-in regression budgets (`AUDIT_BUDGET_MODE=1`)

Separate from, and always reported separately from, the target gate above.
When explicitly enabled:

- Aggregates (median across `AUDIT_REPEATS` runs, always computed — see the
  third correction above) are compared against a budget per mode via
  `evaluateBudget()`.
- Defaults (`DEFAULT_BUDGETS`) come from the worst observed results in the
  existing 96-run sweep, purely as a *regression* baseline for drift between
  repeats on a noisy machine — not as a substitute release criterion:

  | Mode | Perf | A11y | Best Practices | SEO | LCP | TBT | CLS |
  | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
  | Mobile | 75 | 100 | 90 | 100 | 5000ms | 400ms | 0.1 |
  | Desktop | 90 | 100 | 90 | 100 | 3000ms | 300ms | 0.1 |

- `validateBudgets()` fails fast, before any audit runs, if a selected mode
  has no budget entry, or if any required category/metric is missing,
  non-finite (`Infinity`, `NaN`, a string), or out of range: category score
  minimums must be finite and within `0–100` (a `-1` or `150` budget is now
  rejected, not silently accepted), and LCP/TBT/CLS thresholds must be
  finite and nonnegative. Nothing is silently skipped.
- The console output, when budget mode is on, explicitly states: *"This is a
  separate, looser baseline check for drift between repeats — passing it
  does not mean the all-100 target above is met."* The exit code is nonzero
  if either the target gate or (when budget mode is on) the budget gate
  fails; a budget pass never suppresses a target failure.
- `AUDIT_BUDGETS_JSON` can replace `DEFAULT_BUDGETS` wholesale for a
  different environment; it is only read, and only validated, when
  `AUDIT_BUDGET_MODE=1`.

## Other harness changes (unchanged from the previous revision)

- **`AUDIT_REPEATS`**: `parseRepeats()` requires a bounded positive integer —
  it rejects `Infinity`, fractions, `NaN`, zero, and negative values (all
  reject via `Number.isInteger`/`< 1`), and rejects anything above
  `MAX_REPEATS = 20` rather than looping indefinitely. Each run's raw
  Lighthouse JSON is preserved (`-run{n}` suffix when repeats > 1); nothing is
  overwritten, and `summary.json` contains every individual run.
- **Medians/spread**: `aggregate.json` holds one row per route/mode with the
  median and min-max spread of each score, LCP, TBT, and CLS, generated on
  every run regardless of `AUDIT_BUDGET_MODE` — informational by default,
  and the basis for the opt-in budget comparison when enabled. A `null`
  category/metric means at least one contributing run had no valid
  (null/NaN) evidence for it; it is never silently averaged as if it were a
  real `0`.
- **Metadata**: `metadata.json` records the git commit, Node version, browser
  UA (from Lighthouse's `report.environment.hostUserAgent`), Lighthouse
  version, repeat count, whether budget mode was on, and start/finish
  timestamps.

## Regression check (no Chromium required)

`scripts/check-lighthouse-budgets.mjs` unit-tests every pure function with
`node:assert` and fixed inputs:

```sh
node scripts/check-lighthouse-budgets.mjs
```

Covers, each proven to fail when the underlying logic is broken (verified by
deliberately breaking `check-lighthouse.mjs` in a scratch copy, confirming a
nonzero exit and an `AssertionError`, then restoring the intended source):

- **Below-100**: a run scoring 99 in any category is a target failure; a
  clean all-100 run is not.
- **Failed report**: an errored run (`{ error: "..." }`) is itself a target
  failure, independent of any score.
- **Empty/partial scores object** (the coordinator's first false-green): a
  run with `scores: {}` reports one failure per required category, not `[]`.
- **`NaN`/`null` score** (the coordinator's second false-green): a corrupted
  (`NaN`) or unscored (`null`) category score is reported as invalid or
  missing evidence, not silently passed.
- **Missing/invalid budget config** (the coordinator's third false-green):
  `validateBudgets()` throws when a selected mode has no budget entry, when
  a required category score minimum is absent, negative, or above 100, or
  when a metric threshold is non-finite or negative — it never silently
  skips the gap.
- **`parseRepeats` bounds**: `Infinity`, `-Infinity`, `1.5`, `NaN`, `-1`,
  `0`, `""`, non-numeric strings, and `21` (over `MAX_REPEATS`) all throw;
  `undefined` defaults to `1`, and `"20"` is accepted at the boundary.
- **Null/NaN-safe aggregation**: `aggregateRuns()` returns `null` (not a
  masked average) for a category/metric when any contributing run's value is
  null or non-finite; `evaluateBudget()` reports that `null` as its own
  failure rather than letting `null > budget.x` silently pass.
- **Always-on aggregation** (the coordinator's fourth false-green):
  `buildRouteAggregate()` with `budgetMode: false` still returns a populated
  aggregate for a multi-repeat route/mode — the exact `AUDIT_REPEATS=3`,
  non-budget-mode scenario that previously produced an empty
  `aggregate.json`. The same repeats with `budgetMode: true` additionally
  report the real budget breach, showing the two are independent.
- `median`/`spread`/`aggregateRuns`/`evaluateBudget` arithmetic, unchanged
  from the previous revision.

Each of the four coordinator-reported false-green cases was reproduced
directly against the fixed source
(`evaluateTargets([{route:'/',mode:'mobile',scores:{}}], categories)`,
the `NaN`-score case, `validateBudgets(..., {performance: -1})`, and the
empty-`aggregate.json`/null-as-zero-median cases) and confirmed to now
report failures/throw/populate correctly instead of `[]`/silently
accepting/silently empty. Each was also verified red by reintroducing the
exact bug in the real (unfixed) source, confirming a nonzero exit, then
restoring a byte-identical file.

## CI plan

`.github/workflows/performance.yml` splits fast PR feedback from the
expensive full sweep, per the shared constraint that machine contention must
not corrupt serial performance measurements:

- **`fast-checks`** (every push/PR): install, lint (`ultracite`), typecheck,
  production build, the budget/target regression check, and the existing
  fast static/unit checks (`test:seo`, `test:ui`, `test:analytics`,
  `test:assets`, `test:css`, `test:dead`). No Lighthouse, no browser launch
  beyond what those existing checks already do.
- **`full-sweep`** (`workflow_dispatch` only, with `repeats`/`agentic`/
  `budgetMode` inputs — the previously added weekly schedule trigger was
  removed as unrequested): installs Playwright's Chromium, builds, starts
  the production server on port 4181 (never 3000), waits for `/sitemap.xml`,
  then runs `check-lighthouse.mjs` against all 48 routes in both modes and
  uploads `summary.json`/`aggregate.json`/`metadata.json` as a build
  artifact (`if: always()`, so a target-gate failure still uploads
  evidence). It enforces the exact same strict all-100 target as
  `fast-checks` — it is not "informational," it just runs the expensive
  full-route audit instead of skipping it. It never runs on push/PR and is
  not wired as a required status check, so it cannot block a merge or
  contend with other CI by itself; a human (the coordinator) reads the
  artifact. `budgetMode: true` adds the separate regression report on top,
  never in place of, the target gate.

This is the harness only. Actually invoking `full-sweep`, reading its
artifact, and deciding whether a given run's numbers justify action remains
the coordinator's job.

## Reproduce

```sh
bun run build
bun run start -- -p 4182
SITE_URL=http://localhost:4182 AUDIT_DIR=.scratch/lighthouse AUDIT_REPEATS=2 node scripts/check-lighthouse.mjs
# Optional: also report (not replace) the regression budget check
SITE_URL=http://localhost:4182 AUDIT_BUDGET_MODE=1 AUDIT_REPEATS=2 node scripts/check-lighthouse.mjs
node scripts/check-lighthouse-budgets.mjs
```

## Verification performed in this worktree

- `bun run check` (ultracite/biome): pass on the full repo.
- `bunx tsc --noEmit`: pass, no errors.
- `bun run build`: pass, 1073 generated asset references across 60 pages
  validated.
- `node scripts/check-lighthouse-budgets.mjs`: pass. Confirmed each of the
  three required failure modes (below-100, missing-budget/mode, failed
  report) turns red by deliberately breaking the corresponding source logic
  in `check-lighthouse.mjs`, observing a nonzero exit, then restoring the
  file and re-confirming a byte-identical, clean-passing result.
- `python3 -c "import yaml; yaml.safe_load(...)"`: the workflow file parses
  as valid YAML both before and after adding the `budgetMode` input.
  `actionlint` was not available in this environment, so the workflow has
  not been validated against GitHub's schema or run on an actual runner.

## Remaining risks and what still needs a real run

- **No Lighthouse run was executed in this worktree.** Browsers and servers
  were not started here per the work order. The strict all-100 default is
  known, from the already-committed audit doc, to currently fail on mobile
  performance and (historically) on Contact's Best Practices — that is
  accurate, not a bug in the harness; reaching 100 remains separate
  engineering work outside this worker's scope.
- **`full-sweep` has not executed on an actual GitHub Actions runner.** Only
  static YAML parsing was checked; runner-specific issues (Playwright/Chromium
  system dependencies on `ubuntu-latest`, action version pinning) are
  unverified.
- The opt-in budget defaults are a regression baseline only; they have not
  been re-measured against current `main` in this session, and the doc above
  is explicit that passing them is not equivalent to the all-100 target.
- This plan does not change or re-verify any of the existing remaining limits
  already recorded in `docs/performance-audit-2026-09-24.md`.
- **`test:dead` (`scripts/check-dead-source.mjs`) has a pre-existing false
  positive on a motion worker import**, identified in the coordinator's final
  review. Fixing that detection is out of this worker's scope and has been
  assigned to the motion worker; `fast-checks` still runs `test:dead`
  unmodified rather than removing or weakening it to hide the failure.
