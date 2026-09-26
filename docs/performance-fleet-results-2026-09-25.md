# Performance fleet results — 2026-09-25

App source: `863927d`. This audit branch: `f2814c0`. `origin/main` verified
unchanged at `56267f5` — no push/PR/deploy this pass. All scores below are
local Next.js production-build Lighthouse runs (Chromium only; Safari/Firefox
not tested), not deployed PageSpeed Insights or real-user data. Analytics
intentionally does not initialize on `localhost`, so production analytics
cost remains unverified. Report JSON lives under coordinator `.scratch/`,
which is gitignored and not automatically in GitHub. Nothing here is
released/deployed.

## Implemented locally

- Homepage showcase card generation moved server-side (`app/page.tsx`),
  passing only the 7 curated cards to `HomeBento`/`ProjectSlider` as plain
  props instead of computing them client-side.
- `projectsData`/`hiddenProjectTitles` (~30-project catalog) split out of
  the shared `lib/data.ts` into `lib/project-catalog.ts`, matching the
  existing `lib/site-config.ts` split, so components that only need small
  content (`aboutContent`, `zendutyChapter`) no longer couple to the full
  catalog. `lib/projects.ts` and two check scripts repointed.
- `scripts/check-home-showcase-server.mjs`: regression check against the
  real generated client-reference-manifest/chunks plus an import-reachability
  check, not source string-matching alone.
- Game dialog host: genuinely closed and empty while inline (no populated
  dialog content until expanded).
- Game fullscreen: the persistent game section now moves into an actual
  native fullscreen modal without remounting or changing physics; focus
  handling, `inert`, and Back-navigation cleanup verified.
- Project archive: the full project catalog now loads dynamically when the
  "Explore the work" dialog opens (`components/bento/project-slider.tsx`),
  with a retry action on failure and a `/projects` dedicated-page fallback link.
- A desktop-only `<link rel=preload>` for the first featured project image,
  built via `getImageProps` so `srcset`/`sizes` match the rendered `<Image>`
  exactly.
- Benchmark harness: all 5 categories (including `agentic-browsing`, now
  required by default) enforced strict-100, with repeat-run median/spread
  and explicit null/missing/below-100 failure handling; CI workflow with a
  static `pull_request` check plus a manual `workflow_dispatch` full
  48-route audit; `scripts/check-dead-source.mjs` fixed to recognize
  `new Worker(new URL(...), import.meta.url)` as a real dependency edge.

## Rejected experiments, with reasons

| Experiment | Reason rejected |
| --- | --- |
| `React.lazy`+`Suspense` dock page loader (replacing `next/dynamic` for About/Experience/Projects/Writing) | Byte-identical CSS on `/privacy` before/after (165,127B across the same 3 chunk hashes) — zero measurable benefit. `dock.tsx` left unchanged. |
| `experimental.cssChunking: "graph"` (Turbopack, default tuning) | Measured **worse**, not better: home mobile 84/84/84 vs default 66/88/85 (repeat median 85, full-sweep 85); `/privacy` mobile 93/93/93 vs default full-sweep 94. Desktop unchanged (home 99, privacy 100). Home CSS requests 3→9, raw 165,075→165,209B, gzip ~30,097→33,876B; privacy CSS requests 3→5, raw 165,075→125,850B, gzip ~30,097→25,438B. Smaller CSS bytes did not yield a better score — `graph` trades bytes for more requests, net negative. Rolled back byte-for-byte to HEAD; not committed. |
| PostHog experimental init-queue change | Coordinator-reported bug in the init queue; reverted by the owning worker. |
| Initial game dialog-role draft | `role="region"` applied to the native `<dialog>` was invalid ARIA. The accepted fix removes the role override entirely and only populates dialog content/semantics once expanded. |
| Dock resize padding/tone change | Rejected on coordinator review: the `ResizeObserver`'s `contentRect` excludes padding, mis-sizing the refraction lens — not a generic owning-worker judgment call. |
| `experimental.inlineCss: true` (Next.js native) | Home initial HTML raw 117,304→620,210B (Δ502,906B, ~3x the 165,330B inlined `<style>` block — the full, un-split CSS bundle is duplicated into every page's SSR `<style>` and again in the RSC payload), gzip 18,203→107,126B — well over 2x the baseline's combined HTML+CSS gzip (18,203+29,907≈48,110B). Rejected on these bytes alone; no browser/Lighthouse run was performed, so no score claim is made. Native `next build` itself succeeded; a post-build asset-checker false positive (its regex matches `href=` inside React's `data-href`, which packs multiple URLs into one attribute) was confirmed separately with a corrected one-off check — 1,092/1,092 real asset references across all 60 generated HTML pages were valid — so this was not the reason for rejection, and no permanent checker change was made. Reverted byte-for-byte; not committed. |
| Motion `optimizePackageImports: ["motion/react"]` | Output byte-identical to HEAD across the measured routes — zero measurable change. Reverted, not committed. |
| Motion `LazyMotion` (two candidates: a whole-package dynamic import, then a corrected variant using a separate static `domMax` module) | Both rejected: the corrected variant still grew `/privacy` initial JS. Coordinator-measured (`node:zlib` `gzipSync`): home 19 chunks 1,184,545B raw/377,129B gzip → 21 chunks 1,103,825B raw/355,855B gzip (smaller); privacy 13 chunks 786,799B raw/247,310B gzip → 15 chunks 828,341B raw/261,471B gzip (larger). The client module graph was restructured in a way that increased shared delivered bytes on a route that doesn't even use the animation — no browser/Lighthouse run was performed on either candidate, and no per-module cost is claimed as the cause. Both reverted, not committed. |

Main also separately rejected proposed follow-ups that would have removed
the global `opacity` default or reduced-motion protection to save a few
remaining bytes; no such change was implemented.

An earlier draft of my own analysis mis-attributed a shared React-DOM chunk
as the game's physics chunk (string false-positive: `'rink'` matched inside
`flexShrink`). That attribution was wrong and is not reproduced here; no
physics/game/CPU causal claim is made in this report.

## Score table (coordinator full sweep: 48 public routes × mobile+desktop, 1 run each)

| | mobile performance | desktop performance | A11y / Best Practices / SEO / Agentic |
| --- | --- | --- | --- |
| Range | 81–95 | 99–100 | 100 on all 96 route×mode results |
| Median | 92 | 100 | — |
| Home (`/`) | 85 (full sweep) | 99 | 100/100/100/100 |
| `/about`,`/contact`,`/privacy` | 94 | 100 | 100/100/100/100 |

Desktop: 47 of 48 routes score 100; home is the one exception at 99.

Coordinator-validated (not re-run by me): production build — 67 routes,
1,072 asset references, 60 HTML pages; lint/typecheck; `test:ui`, `test:seo`,
`test:analytics`, `test:assets`, `test:css`, `test:dead`;
`check-home-showcase-server` and motion-priority generated-build checks;
game fullscreen at 1440/390/320/reduced-motion/740-landscape, native and
fallback paths; real axe-allowed-role checks and actual back-navigation
cleanup; all 49 routes at 1440-light/320-dark design checks; mobile slider
scroll preservation; native booking (7 mocked outcomes, both narrow modes);
dock windows (4 combinations); project archive first-click, sustained
chunk-failure retry, Escape, reopen; analytics real-SDK browser fixture with
all writes intercepted.

## Sep 26 continuation

Agentic Browsing scoring 100 above means all 3 applicable scored checks
passed (normalized 100), including `agent-accessibility-tree`, which now
passes on all 96 previously-recorded local route×mode audits. This confirms
the specific checks measured here, not a general guarantee of compatibility
with arbitrary AI-browsing agents.

Fresh coordinator baseline (`.scratch/lighthouse-resume-baseline`, local
production build, analytics disabled as before, no newly deployed PSI run):
2 repeats each, mobile + desktop, on home and `/privacy` (8 runs total).

| Route | Mode | Performance (2 runs) | LCP (ms) | TBT (ms) |
| --- | --- | --- | --- | --- |
| Home (`/`) | Mobile | 84, 86 | 4489.5, 4230.7 | 43, 27 |
| Home (`/`) | Desktop | 99, 99 | — | 0, 0 |
| `/privacy` | Mobile | 95, 95 | 2956.6, 2954.9 | 42, 42 |
| `/privacy` | Desktop | 100, 100 | — | 0, 0 |

The other 4 categories scored 100 on every one of the 8 runs; CLS was 0 on
every run. The strict-100 harness correctly flagged 6 of these 8 runs red
(home mobile ×2, home desktop ×2, `/privacy` mobile ×2); only `/privacy`
desktop (×2) met the target.

## Unresolved

- Mobile performance is not at the 100 target (81–95 range across the two
  sweeps recorded here; the Sep 26 repeat runs above add home 84/86 and
  `/privacy` 95/95 mobile). Five experiments across both rounds (React.lazy
  dock loader, `cssChunking: "graph"`, `experimental.inlineCss`, Motion
  `optimizePackageImports`, two Motion `LazyMotion` variants) were measured
  and rejected on evidence; none is kept. Desktop is also not uniformly at
  100: home scored 99/99 in the Sep 26 repeats.
- Reducing the evidenced initial shared client cost (the module-graph bytes
  the Motion experiments touched) without losing a feature or
  browser-compatibility protection is the concrete next step; no candidate
  achieving that has been found yet.
- Production verification (real analytics cost, deployed PSI/field data,
  Vercel edge/CDN behavior) remains unverified — local builds only.
  A deployed preview with real analytics enabled must be measured before
  any production performance claim is made.
- CI runner execution (whether this workflow runs unattended on what
  cadence/hardware) is not established by this pass.
- Page-closing animation work is out of scope here and is being handled
  separately on `fix/closing-motion` (session `portfolio-closing-motion`),
  not on this performance track.
- This performance branch (`perf/fleet-inline-css`) is still not pushed,
  opened as a PR, or deployed. The all-100 target remains unmet.

## Trace-led investigation

Startup performance traces are now complete at coordinator
`.scratch/lighthouse-startup-traces/` (home and `/privacy`, mobile), and
include ProfileChunk CPU samples. Only preliminary inspection has happened
so far; there is no approved causal fix yet. Analysis remains open, not an
in-progress capture.
