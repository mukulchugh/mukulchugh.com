# Dock window close focus (reduced motion)

Fixes a reduced-motion-only regression on `fix/dock-close-focus`: closing a dock window (click Close, Escape, or Home) left keyboard focus on `<body>` instead of returning it to the dock trigger. Full-motion closes were unaffected.

## Root cause

`components/navigation/genie-window.tsx`'s `close()` calls `onDismiss()` immediately when `prefers-reduced-motion: reduce` is set (unlike the full-motion path, which waits ~440ms for its reverse WAAPI animation to finish first). That timing difference exposes a CSS bug rather than a JS one.

`components/navigation/dock-navigation.tsx` toggles the primary `<nav>`'s `visibility` via inline style while a window is open (`style={launch ? { visibility: "hidden" } : undefined}`). This same `.dock` class is shared by the study preview nav and the genie window's own destination-switcher nav (`components/navigation/dock.module.css`). The app's global reduced-motion rule in `app/globals.css` (`* { transition-duration: 0.01ms !important }`) means every element implicitly transitions every property it changes, including this `visibility` toggle — *unless* something more specific overrides it back to `transition: none`. `dock.module.css` already had exactly that override for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .study *,
  .study *::before,
  .dock * {
    transition: none !important;
    animation: none !important;
  }
}
```

`.dock *` covers the dock's *children* but not the `.dock` nav element itself, which is exactly the element whose own `visibility` is being toggled. Confirmed with Playwright + a monkey-patched `HTMLElement.prototype.focus`: at the moment BaseUI calls `.focus()` on the restored trigger, the nav's inline style is already correctly cleared, but `getComputedStyle(nav).visibility` still reports `"hidden"` because an interrupted, near-zero-duration transition (started when the window opened, reversed on close) is stuck in `playState: "running"` and never resolves on its own. BaseUI's native `FloatingFocusManager` return-focus check sees that stale value and silently no-ops its `.focus()` call, so focus falls through to `<body>`. The full-motion path never hits this because it only calls `onDismiss()` long after any such transition has settled.

Independently confirmed against the accepted baseline (port 4182, unmodified) by injecting only `nav[aria-label="Primary"] { transition: none !important; }` under the reduced-motion query: focus was on `<body>` at 0/50/250ms without it, and returned correctly by 50ms and stayed there with it. No JS change was needed.

## Fix

One line added to the existing reduced-motion rule in `components/navigation/dock.module.css`, extending it to the `.dock` element itself, not just its descendants:

```diff
 @media (prefers-reduced-motion: reduce) {
   .study *,
   .study *::before,
+  .dock,
   .dock * {
     transition: none !important;
     animation: none !important;
   }
 }
```

Because `.dock` is shared across the primary nav, the study preview nav, and the genie window's own switcher nav, this one selector addition covers all three call sites. `components/navigation/genie-window.tsx` is unchanged from its pre-investigation state — no `flushSync`, no manual `.finish()`/`.focus()` calls, no timers. An earlier JS-based workaround (forcing the dismiss through `flushSync` and finishing in-flight animations on the trigger's nav) was tried, worked for the direct repro, but was unnecessary once the CSS gap was found; it has been reverted in favor of this smaller, shared, zero-JS fix.

## Verification

- Reduced-motion click-close, Escape-close, and Home-close all restore focus to the originating dock trigger, checked at 0ms/50ms/200-250ms after the dialog reports hidden (matching the original bug's reproduction steps).
- Destination-switch-then-close returns focus to the *switched-to* destination's dock trigger, not the one that originally launched the window.
- Rapid reopen immediately after a close keeps the new window's own `initialFocus` (Close button); the previous window's return-focus does not steal it back.
- No scroll jump on close (`window.scrollY` unchanged).
- `scripts/check-dock-windows.mjs` extended with reduced-motion coverage for all of the above, at both 320px/1440px and both themes; run four times in a row against the fix with no flakes, and confirmed to fail against the pre-fix source.
- Existing full-motion dock focus/reverse-close assertions still pass unchanged; normal (non-reduced-motion) genie window behavior, geometry, and dock styling/refraction are untouched.
- `bun run lint`, `bunx tsc --noEmit`, and `bun run build` all pass.
- Verified against a local production build on port 4187 only; ports 3000/4182/4185/4186 were not touched, and the 4187 server was stopped after verification.

## Limits

- Chromium-only verification (Playwright default browser); Safari/Firefox reduced-motion transition timing was not independently checked.
- This closes the specific gap in `dock.module.css`'s existing reduced-motion override. It does not audit the rest of the app for other elements that toggle a transitionable property on themselves (not just descendants) under reduced motion; if a similar symptom appears elsewhere, the same "selector covers children but not the element itself" pattern is worth checking first.
- Did not modify `components/navigation/dock-navigation.tsx` or any contact/loader source; the fix is entirely within the shared `dock.module.css` selector.
