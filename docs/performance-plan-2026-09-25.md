# Performance measurement plan — operator guide

Owns: `scripts/check-lighthouse.mjs`, `scripts/check-lighthouse-budgets.mjs`,
`.github/workflows/performance.yml`. Measurement/release-guard tooling only —
no route, component, or dependency changes. Baseline evidence lives in
`docs/performance-audit-2026-09-24.md`'s 96-run sweep and its Sept 25
native-booking follow-up.

## The target (default, no flags)

Every individual Lighthouse run — not a median, not a best-of — must score
**100 in all five required categories**: `performance`, `accessibility`,
`best-practices`, `seo`, and `agentic-browsing` (a real Lighthouse 13.5.0
category; not invented). A run that errors, or has a `null`/non-finite/
out-of-range score for any required category, is a target failure — never
coerced to a passing or failing number, never silently skipped.
`evaluateTargets(rows, categories)` implements this and gates the process
exit code.

`AUDIT_AGENTIC=0` opts a diagnostic run out of `agentic-browsing` (any other
value, including unset, keeps it required); the run prints how many of the 5
categories it actually checked and is never reported as a full-target pass.

## Opt-in regression budgets (`AUDIT_BUDGET_MODE=1`)

Separate from, and always reported separately from, the target above; a
budget pass never implies the all-100 target is met. When enabled:

- Per-route/mode medians (`aggregate.json`, generated on every run
  regardless of budget mode) are compared against `DEFAULT_BUDGETS`
  (overridable via `AUDIT_BUDGETS_JSON`) — a *drift* baseline from the worst
  results in the existing sweep, not a release criterion:

  | Mode | Perf | A11y | Best Practices | SEO | LCP | TBT | CLS |
  | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
  | Mobile | 75 | 100 | 90 | 100 | 5000ms | 400ms | 0.1 |
  | Desktop | 90 | 100 | 90 | 100 | 3000ms | 300ms | 0.1 |

- `validateBudgets()` fails fast if a selected mode lacks a budget, a score
  minimum isn't a finite `0–100` value, or a metric threshold isn't finite
  and nonnegative. A `null` aggregate value (see below) is its own budget
  failure — never a silent pass.

## Evidence output (every run)

- `summary.json` — every individual run (not overwritten across repeats).
- `aggregate.json` — one row per route/mode with median + min/max spread for
  each score, LCP, TBT, CLS. Always populated for any route/mode with at
  least one non-errored run, independent of budget mode. A `null`
  score/metric means at least one contributing run had no valid (null/NaN)
  evidence — never silently averaged as a real `0`.
- `metadata.json` — git commit, Node version, Lighthouse version, browser UA,
  selected categories, repeat count, budget-mode flag, start/finish times.

`AUDIT_REPEATS` (default `1`) must be a positive integer ≤ 20
(`parseRepeats()` rejects `Infinity`, fractions, `NaN`, `≤0`, and anything
over the bound).

## Regression check (no Chromium)

```sh
node scripts/check-lighthouse-budgets.mjs
```

Unit-tests every pure function with `node:assert`: bounded `AUDIT_REPEATS`
parsing; strict per-run target evaluation across all five categories
(below-100, missing/`null`/`NaN` scores, failed reports — `agentic-browsing`
checked exactly like the rest); budget validation (missing mode/category,
out-of-range/non-finite values); null/NaN-safe median aggregation; and that
aggregation always runs regardless of budget mode. Each case was verified red
by reintroducing the real bug and confirming a nonzero exit before restoring.

## CI plan

- **`fast-checks`** (every push/PR): install, lint, typecheck, build, then
  `check-home-showcase-server.mjs` / `check-motion-priority.mjs` (owned by
  other workers, wired in here after build), the budget/target regression
  check above, and the existing fast checks (`test:seo`, `test:ui`,
  `test:analytics`, `test:assets`, `test:css`, `test:dead`). **It does not
  run Lighthouse at all** — only `full-sweep` does.
- **`full-sweep`** (`workflow_dispatch` only; inputs `repeats`/`agentic`/
  `budgetMode`, `agentic` defaults `true`): installs Chromium, builds, serves
  on port 4181, runs `check-lighthouse.mjs` against all 48 routes in both
  modes, uploads the evidence files as an artifact even on failure. Never
  runs on push/PR and isn't a required status check, so it can't block a
  merge; a human reads the artifact.

## Reproduce

```sh
bun run build
bun run start -- -p 4182
SITE_URL=http://localhost:4182 AUDIT_REPEATS=2 node scripts/check-lighthouse.mjs
# Optional: also report (never replace) the regression budget check
SITE_URL=http://localhost:4182 AUDIT_BUDGET_MODE=1 AUDIT_REPEATS=2 node scripts/check-lighthouse.mjs
# Diagnostic-only: drop agentic-browsing from the target
AUDIT_AGENTIC=0 SITE_URL=http://localhost:4182 node scripts/check-lighthouse.mjs
node scripts/check-lighthouse-budgets.mjs
```

## Known limits

- No Lighthouse run has been executed against this worktree's build; the
  strict all-100 default is known, from the already-committed audit doc, to
  currently fail on mobile performance — that's accurate reporting, not a
  harness bug. Reaching 100 is separate engineering work outside this
  worker's scope.
- `full-sweep` has not run on an actual runner; only static YAML parsing was
  checked (Playwright/Chromium deps, action pinning unverified).
- Opt-in budget defaults are a regression baseline only, not re-measured
  against current `main` in this session.
- `test:dead` (`scripts/check-dead-source.mjs`) has a pre-existing false
  positive on a motion-worker import; that fix is assigned to the motion
  worker, and `fast-checks` still runs it unmodified rather than hiding the
  failure.
- `check-home-showcase-server.mjs` / `check-motion-priority.mjs` aren't in
  this worktree (they land on integration); no results are claimed for them.
- This plan does not restate the existing limits in
  `docs/performance-audit-2026-09-24.md`.
