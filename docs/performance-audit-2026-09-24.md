# Portfolio performance audit

Status: implementation, regression checks, and the 96-run all-page Lighthouse sweep are complete. The requested 100 in every category is not achieved.

## Measurement

- Next.js production builds, not the development server.
- Lighthouse 13.5.0, isolated Chromium, default mobile and desktop presets.
- Routes discovered from the generated sitemap: 48 public pages.
- Audits run serially to avoid competing Chromium workloads.
- Local scores are lab evidence, not a substitute for production PageSpeed or real-user Core Web Vitals. Local HTTP/1.1, first image-transform costs, machine load, and production analytics differ from Vercel production.
- The supplied production PageSpeed snapshot scored 71 mobile and 93 desktop Performance, with 100 Accessibility, 96 Best Practices, and 100 SEO. No field-data pass was claimed.

## Verified causes and changes

| Cause | Evidence | Change |
| --- | --- | --- |
| WebGL setup on the main thread | Baseline trace had a 516 ms React task, including 253 ms sampled shader setup | Shader compilation/rendering moved to a visible-only worker in the prior release, with reduced-motion and failure fallbacks |
| Static articles shipped Markdown parsing and syntax highlighting | Article baseline had 363.5 ms total blocking time and large unused client code | Markdown and Shiki now render on the server; copy is a small client control; diagrams, source offsets, safe links, code colors, and downloads remain |
| Large source images bypassed responsive optimization | Homepage article cover was approximately 1.58 MB; a 28px article author avatar downloaded a 1.765 MB original | Responsive optimized writing/project imagery and author avatar; raster experience logos optimized while ICO stays exempt |
| Unnecessary homepage prefetch | Other routes fetched unused homepage/GSAP chunks after rendering the visible home link | Header/footer home links no longer eagerly prefetch the whole homepage |
| Eager dock window implementation | Closed-window code loaded on every route | Load on deliberate hover/click; keep previously opened window state; fall back to the dedicated route if the module fails |
| Analytics competed with initial rendering | Google tag and PostHog were early resources | PostHog starts after load/idle; explicit events queue; Google script uses lazy-onload; Vercel early performance collection stays intact |
| Google service-worker scope mismatch | Browser requested a scope without the trailing slash permitted by the proxy header | Match the exact scope; verified with an actual service-worker registration using real proxy headers and an inert worker |
| Booking layout shifted as content arrived | Contact CLS was 0.1298 before fixes | Stable calendar viewport and status/help layout; final sampled CLS is 0 |
| Initial route opacity required hydration | Every direct visit started at 0.65 opacity | First render is opaque; client-side navigation retains its fade |
| Experience accessible names hid visible labels | Lighthouse flagged label-content-name mismatches | Card names derive from their visible copy, rather than overriding it with unrelated labels |

Blog prose also fills its complete right-hand grid column, as requested.

## Experiments not retained

- CSS inlining did not improve the controlled mobile samples (About 90 to 89; Home 82 unchanged). Reverted; shared styles retain independent caching.
- Removing the inline game's presentational role made it an extra non-modal dialog. Reverted after regression checks; fullscreen behavior was preserved. The separate experimental agent-readiness semantic warning is not claimed fixed.

## Regression evidence

- Production build and TypeScript pass.
- Lint and diff whitespace checks pass.
- All 15 articles pass content, heading-ID, diagram, concurrent-render, and unsafe-link checks.
- All 26 project records and navigation destinations pass the existing content checks.
- SEO checks cover all 48 public pages, metadata, Markdown parity, sitemap, private-route exclusions, and artwork.
- 48 public routes plus the 404 page passed at 1440px/light and 320px/dark: header, CTA, dock, typography, horizontal overflow, and runtime exceptions.
- Browser checks pass for fullscreen game continuity, native/fallback modes, reduced motion, restart cancellation, and focus restoration.
- Slider forward/reverse handoffs keep their artwork loaded and preserve mobile scroll position.
- Dock destination scrolling, geometry, closing, both themes, and reduced motion pass. Prototype-only frame-sampling is unavailable in production by design; production interactions were checked instead.
- Real Google/PostHog SDKs and the Vercel queue pass deduplicated pageview/event tests with all analytics writes intercepted.
- Shader light/dark rendering, reduced-motion pause, unsupported APIs, worker failure fallback, and full-width articles pass.

## Remaining limits

Cal.com's live default-open embed sets third-party cookies (`__cf_bm` and NextAuth cookies), producing a Best Practices score of 77 on Contact. The portfolio cannot remove cookies from the provider's cross-origin responses. Booking was not hidden, removed, or replaced to improve the score, and no real booking was submitted during tests. A different booking integration requires a product decision and its own end-to-end verification.

Mobile Performance remains below 100. Further work must address the remaining initial client-code and rendering cost without discarding the requested game, motion, fonts, or content. No universal 100 guarantee, production re-audit pass, or real-user CWV pass is implied by this report.

## Complete route sweep

All 48 public routes were audited in both modes (96 runs). These are the original sweep results, not best-of reruns. Accessibility and SEO were 100 in every run. Best Practices was 100 except Contact (77 in both modes).

| Route | Mobile performance | Desktop performance | Mobile LCP (s) | Mobile TBT (ms) |
| --- | ---: | ---: | ---: | ---: |
| `/` | 82 | 99 | 4.79 | 87 |
| `/about` | 90 | 100 | 3.69 | 50 |
| `/blog` | 87 | 100 | 4.02 | 22 |
| `/blog/agent-stuck-detection-tool-loops` | 88 | 99 | 3.92 | 20 |
| `/blog/agent-suggested-actions-as-tools` | 88 | 99 | 3.94 | 31 |
| `/blog/agent-working-memory-injection-hygiene` | 87 | 100 | 3.99 | 52 |
| `/blog/brik-react-to-native-widgets` | 87 | 100 | 3.99 | 21 |
| `/blog/checkpointing-agent-edits-without-touching-git-index` | 80 | 99 | 4.30 | 256 |
| `/blog/ferry-apple-watch-mac-mic` | 87 | 99 | 4.00 | 26 |
| `/blog/human-in-the-loop-agent-plans` | 87 | 100 | 4.01 | 21 |
| `/blog/mcp-gateway-for-team-tools` | 87 | 100 | 4.00 | 28 |
| `/blog/mobile-lessons-from-swiggy-scale` | 88 | 100 | 3.91 | 20 |
| `/blog/openkvm-one-keyboard-two-macs` | 86 | 99 | 4.18 | 19 |
| `/blog/phased-agent-turns-gather-analyze-synthesize` | 88 | 100 | 3.92 | 38 |
| `/blog/progressive-tool-results-transcript-chunks` | 89 | 100 | 3.79 | 26 |
| `/blog/quivly-skills-agent-expertise` | 87 | 100 | 4.01 | 25 |
| `/blog/self-hosted-personal-agent-fleet` | 88 | 100 | 3.92 | 24 |
| `/blog/skip-your-own-api-when-you-own-the-database` | 88 | 99 | 3.85 | 21 |
| `/contact` | 90 | 100 | 3.56 | 33 |
| `/experience` | 89 | 100 | 3.76 | 59 |
| `/privacy` | 91 | 100 | 3.55 | 48 |
| `/projects` | 89 | 100 | 3.71 | 36 |
| `/projects/agent-workflow-skills` | 88 | 100 | 3.88 | 25 |
| `/projects/altr` | 84 | 100 | 3.83 | 252 |
| `/projects/brik` | 88 | 100 | 3.91 | 26 |
| `/projects/cryptomedia-cryptocurrency-tracker` | 84 | 100 | 3.75 | 239 |
| `/projects/ctxr` | 90 | 100 | 3.56 | 21 |
| `/projects/eil-conference` | 89 | 100 | 3.82 | 22 |
| `/projects/ferry` | 88 | 100 | 3.84 | 19 |
| `/projects/github-profile-explorer` | 88 | 100 | 3.83 | 19 |
| `/projects/gym-center` | 88 | 100 | 3.83 | 18 |
| `/projects/hermes-memory` | 89 | 100 | 3.76 | 19 |
| `/projects/heroapp` | 87 | 100 | 3.57 | 195 |
| `/projects/hostville` | 88 | 100 | 3.87 | 23 |
| `/projects/memo` | 88 | 100 | 3.87 | 25 |
| `/projects/moshi-health` | 80 | 100 | 4.13 | 314 |
| `/projects/moshi-personal-agent-fleet` | 83 | 100 | 3.77 | 300 |
| `/projects/openkvm` | 88 | 100 | 3.84 | 17 |
| `/projects/pulse` | 88 | 100 | 3.86 | 33 |
| `/projects/quivly-agents` | 79 | 100 | 4.30 | 280 |
| `/projects/quivly-design-language` | 89 | 93 | 3.76 | 43 |
| `/projects/quivly-platform` | 88 | 100 | 3.84 | 19 |
| `/projects/quivly-skills` | 89 | 100 | 3.78 | 27 |
| `/projects/rca-tool-grafana-plugin` | 84 | 100 | 4.07 | 210 |
| `/projects/setu` | 90 | 100 | 3.62 | 48 |
| `/projects/tethr` | 77 | 100 | 4.20 | 378 |
| `/projects/zendash-global-admin-dashboard` | 88 | 100 | 3.56 | 163 |
| `/projects/zepeats` | 85 | 100 | 3.79 | 203 |

Original raw reports: `/private/tmp/portfolio-lighthouse/final` and `/private/tmp/portfolio-lighthouse/final-details`. These local artifacts are not committed; the table preserves the route-level results.

### Interpreting the remaining work

- Every route shares the Next/React runtime and interactive shell. On About, Lighthouse estimated 99 KiB of unused initial JavaScript and 450 ms of render-blocking stylesheet savings. These are diagnostic estimates, not additive guaranteed gains. CSS inlining was tested and rejected because measured scores did not improve.
- Home additionally loads the visible game board and hydrates the interactive bento. Its remaining mobile LCP was 4.79 s despite TBT improving to 87 ms. Retaining the approved game, fonts, motion, and imagery is a release constraint.
- Articles now render their content and highlighting on the server. The database article improved from 364 ms baseline TBT to 21 ms in the final sweep. Their remaining initial render cost is largely shared shell/styles/fonts plus editorial cover delivery.
- Project pages share the same initial script resources, with different editorial imagery and content. Late-sweep mobile results coincided with a CPU benchmark drop from 2805.5 (OpenKVM) to 763 (Tethr). This makes the late TBT comparisons noisy; it is not sufficient evidence to blame an individual project's content. Original results remain above and controlled repeats are reported separately.
- Contact had no measured layout shift in the local sweep after reserving the booking viewport. Production verification below exposes additional behavior with the live analytics scripts enabled.

### Controlled outlier repeats

No code changed between the sweep and these repeats. CPU benchmark indices returned to 2507–2847. These measurements are supplementary, not replacements for the original table.

| Route | Mobile performance | Desktop performance | Mobile TBT (ms) |
| --- | ---: | ---: | ---: |
| `/projects/tethr` | 88 | 100 | 36 |
| `/projects/quivly-agents` | 88 | 100 | 27 |
| `/projects/quivly-design-language` | 88 | 100 | 25 |
| `/blog/checkpointing-agent-edits-without-touching-git-index` | 90 | 99 | 46 |

Repeat reports: `/private/tmp/portfolio-lighthouse/outlier-repeat`. The audit harness now records CPU calibration and measurement time alongside scores so future comparisons expose this variation.

## Release scope

- `b8ec29b`: server-rendered articles, responsive assets, deferred dock windows, and stable booking layout, with regression checks.
- `220cce0`: delayed analytics loading with queued explicit events and corrected Google worker scope, with unit and real-browser checks.
- This report records the completed optimization pass, not completion of the all-100 objective. A further initial-client-graph reduction remains engineering work; changing the live calendar integration requires a product decision. Production scores must be remeasured after deployment.

## Post-deployment verification

Vercel reported deployment success for `9043cd5fb86f519fb56df2cf606df20f1e406325`. Eight further Lighthouse runs checked the live production domain with real analytics enabled. These are locally executed audits of production, not new PageSpeed Insights service reports.

| Route | Mobile performance | Desktop performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/` | 80 | 99 | 100 | 100 | 100 |
| `/about` | 93 | 100 | 100 | 100 | 100 |
| `/blog/skip-your-own-api-when-you-own-the-database` | 88 | 99 | 100 | 100 | 100 |
| `/contact` | 92 | 98 | 100 | 58 | 100 |

Production homepage mobile LCP was 3.97 s and TBT 239 ms. Analytics contributes real production work that is intentionally absent on localhost, so local TBT is not a production guarantee. The supplied earlier PSI snapshot was 71 mobile / 93 desktop; different machines, timing, and test environments prevent treating the difference as a controlled benchmark.

Contact's production Best Practices score additionally includes an Attribution Reporting API deprecation from Google's proxied service-worker iframe, alongside Cal.com's third-party cookies. The live embed also produced desktop CLS 0.086 (mobile 0.000018); the local zero-CLS result is not a claim that production is shift-free. The Lighthouse node attribution includes invalid-looking metadata nodes, so the exact production shift requires a dedicated trace rather than a guessed CSS patch. No portfolio runtime exception was reported by the browser checks.

Production reports: `/private/tmp/portfolio-lighthouse/production-release`. The all-100 objective remains open. Removing or rewriting vendor scripts solely to suppress these diagnostics was not part of this release.

## Reproduce

```sh
bun run build
bun run start -- -p 4182
SITE_URL=http://localhost:4182 AUDIT_DIR=.scratch/lighthouse node scripts/check-lighthouse.mjs
SITE_URL=http://localhost:4182 node scripts/check-sitewide-design.mjs
bun run test:ui
bun run test:seo
bun run test:analytics
bun run test:analytics:browser
bun scripts/check-service-worker.mjs
```

The audit exits nonzero whenever any requested category is below 100. Detailed reports retain every failing diagnostic, even when a category rounds to 100.

References: [Next.js image optimization](https://nextjs.org/docs/app/api-reference/components/image), [server-side Markdown rendering](https://github.com/remarkjs/react-markdown), [service-worker scope restrictions](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Service-Worker-Allowed).
