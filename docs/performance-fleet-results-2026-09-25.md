# Performance fleet results — 2026-09-25

App source: `863927d`. This audit branch: `f2814c0`. `origin/main` verified
unchanged at `56267f5` — no push/PR/deploy this pass. All scores below are
local Next.js production-build Lighthouse runs (Chromium only; Safari/Firefox
not tested), not deployed PageSpeed Insights or real-user data. Analytics
intentionally does not initialize on `localhost`, so production analytics
cost remains unverified. Report JSON lives under coordinator `.scratch/`,
which is gitignored and not automatically in GitHub.

## Shipped, local (this branch's worktree)

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

## Rejected experiments, with reasons

| Experiment | Reason rejected |
| --- | --- |
| `React.lazy`+`Suspense` dock page loader (replacing `next/dynamic` for About/Experience/Projects/Writing) | Byte-identical CSS on `/privacy` before/after (165,127B across the same 3 chunk hashes) — zero measurable benefit. `dock.tsx` left unchanged. |
| `experimental.cssChunking: "graph"` (Turbopack, default tuning) | Measured **worse**, not better: home mobile 84/84/84 vs default 66/88/85 (repeat median 85, full-sweep 85); `/privacy` mobile 93/93/93 vs default full-sweep 94. Desktop unchanged (home 99, privacy 100). Home CSS requests 3→9, raw 165,075→165,209B, gzip ~30,097→33,876B; privacy CSS requests 3→5, raw 165,075→125,850B, gzip ~30,097→25,438B. Smaller CSS bytes on `/privacy` did not yield a better score — `graph` trades bytes for more requests, net negative. Rolled back byte-for-byte to HEAD in this worktree; not committed. |
| PostHog experimental init-queue change | Coordinator-reported bug in the init queue; reverted by the owning worker. |
| Initial game dialog-role draft (removing the inline presentational role) | Made the inline game an extra non-modal dialog — regression; corrected before landing. |
| Dock resize padding/tone change | Rejected by the owning worker; not retained. |

An earlier draft of my own analysis mis-attributed a shared React-DOM chunk
as the game's physics chunk (string false-positive: `'rink'` matched inside
`flexShrink`). That attribution was wrong and is not reproduced here; no
physics/game/CPU causal claim is made in this report.

## Score table (coordinator full sweep: 48 public routes × mobile+desktop, 1 run each)

| | mobile performance | desktop performance | A11y / Best Practices / SEO / Agentic |
| --- | --- | --- | --- |
| Range | 81–95 | 99–100 | 100 on all 96 route×mode results |
| Median | 92 | 100 (47/48 pages; home 99) | — |
| Home (`/`) | 85 (full sweep) | 99 | 100/100/100/100 |
| `/about`,`/contact`,`/privacy` | 93–94 | 99–100 | 100/100/100/100 |

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

## Unresolved

- Mobile performance is not at the 100 target (81–95 range); no source
  change in this pass closed the gap — the two experiments tried this round
  (React.lazy dock loader, cssChunking graph) were both measured and both
  rejected on evidence.
- Production verification (real analytics cost, deployed PSI/field data,
  Vercel edge/CDN behavior) remains unverified — local builds only.
- CI runner execution (whether this suite runs unattended in CI, on what
  cadence, with what hardware) is not established by this pass.

## Next: trace-led investigation

Startup performance traces are being captured now
(`.scratch/lighthouse-startup-traces/`, in progress at time of writing) for
a profile-based look at main-thread cost, instead of chunk-name attribution.
Not yet analyzed — no conclusions are drawn from them here.
