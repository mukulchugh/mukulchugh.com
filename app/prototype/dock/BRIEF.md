# Navigation dock isolation

Mode: Operate. Development-only, noindex route `/prototype/dock`.

Route-local optical study with a six-link capsule dock. RootLayout's production
dock is suppressed only on this exact route. Homepage behavior is unchanged.
Light, dark, lime, and moving photographic surfaces can be scrolled behind the
dock. Hit-testing reads explicit surface metadata, not framebuffer luminance.
Mixed/busy surfaces use a protective dark tint. Labels appear on hover/focus.

A capsule-shaped displacement map is generated only on dock resize. It uses
a bounded convex-rim approximation, not Apple's unpublished optical formula.
Chromium candidates can toggle experimental SVG backdrop refraction. Other
browsers receive the frosted baseline; syntax support does not prove rendering.
Icons remain outside the filtered layer. Reduced motion stops background motion;
reduced transparency and forced colors remove the optical filtering.

Dock clicks now open local Genie windows for About, Projects, Writing,
Experience, and Contact. Home remains a normal home link; inside a window it
closes back to the preview. Modifier-clicks and the window's open-page control
retain real dedicated page URLs. This is a local interaction study, not yet
production route interception or URL/history synchronization.

Base UI Dialog owns focus trapping, nested dialogs and scroll locking. The
foreground icon dock is inside the dialog; the background dock is hidden.
Twenty-four decorative strips animate transforms/opacity for 440ms, with a
faster reverse on close. Readable content is never deformed. Reduced motion
uses a brief fade. Contact reuses the approved CTA and inline calendar; visited
content stays mounted across switching and reopening during the preview visit.
The shell is a bounded strip approximation, not a refractive mesh simulation.
Regression: `node .scratch/check-genie.mjs` checks desktop/mobile, both themes,
all destinations, contact booking/back, focus return and reduced motion.
Regression: `node .scratch/check-dock-study.mjs`. Chromium available locally;
Playwright WebKit and Firefox binaries unavailable, so cross-browser rendering
is not certified. No performance/frame-rate guarantee is claimed.
