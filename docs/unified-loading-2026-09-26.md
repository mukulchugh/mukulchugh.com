# Unified loading states

Implemented on `fix/unified-loading` against the fleet's unified-loading brief and a coordinator follow-up review that asked for a real page-shaped placeholder (not just a wrapped paragraph) and for `LoadingState` to be used only while genuinely loading.

## Changes

- Added `components/ui/loading-state.tsx`: a small shared `LoadingState` component with two variants — `page` (a restrained skeleton silhouette built from the existing `components/ui/skeleton.tsx`: a title bar, three text lines, one content block, all `aria-hidden`) and `compact` (a small inline row with a `motion-reduce`-safe pulsing dot). It renders only while something is actually loading; success, empty, and error states keep their own ordinary status text.
- `components/ui/dock.tsx`: all five dock destinations' `dynamic()` loading fallback now renders `<LoadingState className="p-6" label="Loading page…" />` instead of a bare paragraph, so a cold destination shows real content rhythm instead of a blank window.
- `components/navigation/dock-navigation.tsx`: a cold dock click now shows feedback while `loadWindow()` is in flight — `aria-busy` on the clicked link, a subtle `animate-pulse` (with a local `motion-reduce:animate-none` guard) on just its icon, and one sr-only `role="status"` announcement ("Opening About…"). Rapid clicks on different destinations are race-safe via an incrementing token: only the latest click's window opens, and a stale click's chunk-load failure can no longer force-navigate over a newer click. Real navigation away (Home, browser back/forward, or unmount) invalidates any in-flight pending click so a delayed `loadWindow()` resolution cannot reopen a destination the user already left.
- `components/navigation/dock-writing.tsx`: the loading state now renders `LoadingState`; the failure state is unchanged from before this branch (plain `role="alert"` text, Retry button, and the always-visible "Open writing page" link). `LoadingState` is never used for the error state.
- `components/bento/project-slider.tsx`: the archive dialog's loading fallback uses `LoadingState` (page variant) instead of a bare paragraph.
- `components/contact/contact-section.tsx`: only the `BookingCalendar` Suspense fallback's import and JSX changed, to `LoadingState` (compact variant, same `calendarLoading`/`calendar` dimension classes it already had). No other logic, headings, motion, or CSS in this file was touched, per the contact surface brief.
- `components/contact/booking-calendar.tsx`: the availability paragraph renders `LoadingState` only while a slots request is actually in flight; the settled states (error, empty, "choose a time") keep their original plain `role="status"` text. Submission locking (`lock.current`, `disabled={sending}`) and form-value preservation are untouched.

## Verification

- `bunx tsc --noEmit` and `bunx ultracite check` both pass on the full change set.
- `bun run build` passes: Turbopack production build, 67 generated pages, and the asset-reference check.
- New: `node scripts/check-loading-states.mjs`, run against a dedicated production server on port 4185, using real network interception (delay/abort on `_next/static/chunks/*.js`), not test-only render flags:
  - a delayed shell chunk shows the pending cue (`aria-busy` + sr-only announcement), then the page-shaped skeleton once the window opens (its own chunk still delayed), then real content
  - an aborted shell chunk falls back to a direct page load (`window.location.assign`)
  - rapid About → Writing clicks: only Writing's window opens; About's never does
  - clicking Home while a destination click is pending leaves no stale window once the delayed chunk resolves
  - a warmed-up open (hover-prefetched) resolves with no artificial wait, and closing it returns focus to the trigger
  - both themes under `reducedMotion: "reduce"` at 390px: pending cue, skeleton, open, and close all pass with no runtime errors
- Reused existing suites against the same 4185 server: `check-project-archive.mjs`, `check-native-booking.mjs` (every Cal.com POST intercepted and mocked; no real booking was created), `check-dock-windows.mjs`, `check-dock-regressions.mjs` — all pass unchanged.
- `check-dock-content.mjs` and `check-dock-adaptation.mjs` hardcode `http://localhost:3000` with no env override and were not run, per the instruction not to touch port 3000; neither script was modified.
- `check-dock-routes.mjs` fails on this branch, but the failure is unrelated to loading states and predates this work: it expects `export const links = [...]` literally inside `lib/data.ts`, while `links` is actually defined in `lib/site-config.ts` and re-exported from `lib/data.ts`. Left unfixed as out of scope for this task.

## Screenshots (`.scratch/`)

- `loading-dock-pending.png` — homepage, About click pending, before the window opens
- `loading-window-skeleton.png` — About window open, page-shaped skeleton while its own chunk is still delayed
- `loading-window-ready.png` — same window, real content loaded, for contrast with the skeleton above
- `loading-reduced-motion-light.png` / `loading-reduced-motion-dark.png` — 390px, pending state, both themes, reduced motion

All were inspected in one batched pass; the one issue found (the ready and skeleton screenshots initially came out identical because an unscoped text locator matched the homepage's own hero copy behind the dialog instead of the About window's body text) was fixed in the same pass and reconfirmed once.

## Limitations

- `genie-window.tsx` does not restore focus to the dock trigger after closing a window when `prefers-reduced-motion: reduce` is active. This reproduces with zero pending-state delay against the unmodified close path, so it is unrelated to this branch's changes. It was not fixed here, since the task's boundaries exclude touching that file's geometry/timelines/refraction; recorded for whoever owns that file next. The keyboard-focus assertion was moved to the non-reduced-motion scenario, where focus restoration already works.
- Browser coverage is Chromium only (Playwright's default), at 1440/390/320px in both themes; there was no Safari/Firefox pass and no screen-reader (VoiceOver/NVDA) pass.
- `check-loading-states.mjs` identifies the genie-window shell chunk by a content match (`"Window destinations"`) rather than a hardcoded filename, since Turbopack's content-hashed chunk names change every build; this re-derivation happens automatically at script start, so no manual step is needed after a rebuild.
- A passing build and passing scripts are not the same claim as verified end-to-end smoothness; the claims above are backed specifically by the scenarios and screenshots listed, not by build success alone.

Server used for all of the above: a dedicated `next start -p 4185` in this worktree, stopped after verification. Ports 3000, 4182, and 4184 were not touched.
