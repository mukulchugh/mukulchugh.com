# Portfolio analytics

## Account and reporting

- PostHog organization: **Mukul Chugh**, not Tethr or Pravi.
- Project: **mukulchugh.com**, ID **625612**, US region.
- Website: `https://mukulchugh.com`; timezone: `Asia/Kolkata`; IP anonymization enabled.
- [Portfolio dashboard](https://us.posthog.com/project/625612/dashboard/2129654): audience, pages, work/writing engagement, calendar health, navigation/play, site reliability, and the ordered visit → calendar ready → booked-call funnel.
- Google Analytics account, property, and web stream are configured for this site; the public measurement ID is `G-VTWNXFFM1L`.
- Vercel personal Hobby team **mukulchughs-projects**, project **mukulchugh**, with `mukulchugh.com` attached.
- Search Console domain property `sc-domain:mukulchugh.com` is verified and linked to the GA property.

## One tracking entry point

`lib/analytics.ts` owns provider initialization, pageviews, event dispatch, and privacy filtering. UI components call `trackPortfolioEvent`; they do not initialize analytics SDKs. `components/analytics-wrapper.tsx` observes committed Next.js paths and links. Consecutive duplicate pageviews are suppressed. Dock-window navigation is an interaction event, not a fabricated document navigation.

| Provider | Browser transport | Responsibility |
| --- | --- | --- |
| PostHog | `/api/analytics/posthog/*` | Bounded proxy for approved US ingestion and SDK asset endpoints |
| Google Analytics | `/api/analytics/google/*` | Bounded proxy for the tag, explicit collection events, and tag worker assets |
| Vercel Analytics / Speed Insights | Native same-origin Vercel endpoints | Official installed SDKs, retaining deployment-injected observability configuration |

The Google route is a transport proxy, not a provisioned server-side Google Tag Manager container. It rejects unknown paths, cross-origin browser submissions, oversized bodies, other measurement IDs, and automatic events lacking the shared-layer marker. The PostHog route similarly limits methods, paths, query and body size. Neither proxy forwards cookies, authorization headers, or client-IP headers.

Public ingestion IDs and the PostHog `phc_` project token are intentionally browser-visible. They are not administrative credentials. Optional environment overrides are documented in `.env.example`; never place a personal PostHog API key in client configuration.

## Events and features

Explicit shared events:

`dock_window_open`, `booking_open`, `booking_ready`, `booking_failed`, `booking_complete`, `email_copy`, `email_click`, `project_open`, `article_open`, `outbound_link_click`, `game_start`, `game_fullscreen`, `page_error`.

Event properties are limited to route/destination, surface, and external hostname. Calendar completion discards the booking payload. Form data, email addresses, and free-form component payloads are not accepted by the shared event API.

PostHog is configured for manual pageviews, page leaves, masked link/button clicks, dead clicks, heatmaps, web vitals, and explicit interaction events. Page-boundary failures report a generic exception, not raw user/error payloads. This is not comprehensive automatic exception capture. Feature-flag delivery remains available through the SDK; no experiments or artificial flag usage were added.

Session replay, console recording, network timing capture, surveys/popups, person profiles, and Google advertising features are disabled. Paid self-driving automation was not activated. No LLM/revenue tracking was invented for a portfolio without those flows.

`booking_complete` is configured as a GA key event, counted once per event with no default monetary value. The existing web stream has enhanced measurement enabled, but the new same-origin collection proxy accepts only events marked by the shared portfolio layer, preventing automatic duplicate pageviews after release.

Per the owner's preference, there is no opt-in popup. Tracking respects DNT/GPC and runs only on the production canonical host, not localhost, preview hosts, or prototype routes. URL queries/fragments are stripped; nested PostHog performance properties are scrubbed too. This configuration is not a legal-compliance determination. IP anonymization and proxying also mean precise visitor geography must not be assumed.

## Startup cost

PostHog already starts after `load`/`requestIdleCallback` (unchanged from the prior release); no further reduction was found that is both supported and safe.

`posthog.init`'s `@experimental` `__preview_deferred_init_extensions` option (publicly typed in `node_modules/@posthog/types/dist/posthog-config.d.ts`, `posthog-js` 1.434.12) was tried and reverted. It is meant to time-slice autocapture/heatmaps/dead-clicks/exception-tracking setup across `setTimeout(0)` ticks instead of one synchronous block, but its implementation is broken in this version: `PostHog.prototype._processInitTaskQueue` (`node_modules/posthog-js/lib/src/posthog-core.js`) reschedules with `setTimeout(0)` while comparing elapsed time against the *original* `initStartTime` on every call. Once elapsed first crosses the 30ms budget, it never falls back under budget, so every remaining queued extension task is rescheduled forever and never actually runs. In practice this can permanently drop autocapture, heatmaps, dead clicks, and exception capture, and can leave `posthog.captureException` (used by `reportPageError`) undefined when called shortly after init. `bun run test:analytics` reproduces this deterministically against the real vendored `posthog-core.js`, with no network or DOM: see the trip-wire at the end of `scripts/check-analytics.mjs`. The flag stays unset until posthog-js ships a fix; that trip-wire will fail (task runs) once it does, which is the signal to re-evaluate.

`posthog-js`'s slim entry points (`dist/module.slim.js`, `lib/src/entrypoints/module.slim.es.js`) were also evaluated and rejected: unlike the default import, slim skips `require("./default-extensions")`, so it never registers the classes backing autocapture, heatmaps, dead clicks, or Web Vitals capture. Restoring them would require assigning `PostHog.__defaultExtensionClasses` directly, an internal, undocumented static field, not a supported import or setting. The `no-external` entry was also rejected: it drops `external-scripts-loader`, which every one of those extensions depends on to fetch its lazy-loaded chunk. The default `posthog-js` import remains the smallest supported bundle with full parity for the enabled feature set.

## Verification and limits

Run:

```sh
bun run test:analytics
bun run test:analytics:browser
npx tsc --noEmit
npm run build
```

The unit check verifies dispatch/deduplication, privacy controls, nested URL sanitization, and bounded proxy behavior. The disposable browser check runs the actual Google and PostHog SDKs, verifies same-origin requests and duplicate prevention, and inspects Vercel's native command queue. It intercepts all analytics writes and does not prove provider-side receipt. The fixture disables PostHog's automation filter only inside that intercepted test; production keeps it enabled.

Latest local results: analytics unit and browser checks, TypeScript, lint, diff whitespace checks, and the full production build pass.

A single labeled `analytics_verification` event was sent through the local Next.js PostHog proxy and read back from project 625612 at **2026-09-24 09:08:08 +05:30**. This proves local proxy-to-project delivery, not a production release. The seven reporting queries executed successfully; their business-event results were empty at setup, not manufactured sample visitors.

Production account verification on 2026-09-24 confirmed:

1. Vercel Web Analytics is active. Speed Insights reports a desktop Real Experience Score of **91** from **153 events** in the selected seven-day window. No paid upgrade was enabled.
2. GA reports data flowing for the matching web stream, including **61 active users** and **1.2K events** in the selected seven-day window. The stream received traffic within the past 48 hours.
3. Search Console reports **19 indexed** and **14 not indexed** pages, **15 search clicks**, **6 valid breadcrumbs**, **9 valid profile pages**, and no invalid items in those enhancements.
4. `https://mukulchugh.com/sitemap.xml` is submitted successfully. It was last read on 2026-02-03 and currently reports 14 discovered pages, so it should be resubmitted only after the expanded sitemap is deployed.
5. GA and Search Console were already linked correctly; no new persistent account access was created.

Outstanding release gate: deploy the current code with explicit authorization, then verify the first-party Google/PostHog proxy responses and provider-side receipt on the production domain. Resubmit the canonical sitemap only after the expanded production sitemap is live. Vercel custom-event availability remains plan-dependent.

The account checks above were completed through the user's connected Chrome session. The user-owned dev server was left untouched.
