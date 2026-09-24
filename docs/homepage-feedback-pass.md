# Homepage feedback pass

2026-09-20. Applies to the homepage; the prior full-site recovery checkpoint predates this pass.

Implemented the owner's narrated review: circular portrait and cleaner hero layout, removed decorative copy and section numbering, single-line desktop positioning, consistent Syne titles and Geist body/UI, smaller descriptions, official Quivly image on a neutral backing, premade animated world map, About and Experience dialogs, scrollable full experience list, two artwork-led writing features plus four recent articles, expandable project index, taller contact tile and revised controls/transition.

The narrow typographic filler tile was removed rather than replaced with invented code. Canonical biography, role descriptions, project facts and article content were preserved. Header/About use the requested “Builder by design” wording; shared footer and other routes retain the previously approved wording pending their review.

## Evidence

- Desktop 1440px, tablet 768px and mobile 390px captures: `.scratch/homepage-revision/home-{width}.png`. Visible images loaded at capture. Reduced motion enabled for static capture; normal motion restored afterward.
- Independent visual review: ship; no material spacing, clipping, font or artwork-overlap defect identified at these sizes. The reviewer caught a scrolled Experience tile in the initial captures; final handoff captures restore the current role at the top.
- 320px document width 316px, no page overflow, including booking state.
- About and Experience dialogs open and close, with focus restored to their triggers. Experience accepts keyboard scrolling. Project disclosure exposes all fourteen additional projects, alongside three featured projects.
- Booking opens an iframe, focuses Back, and returns focus to Book a call while removing the iframe. Tested at desktop and 320px. No appointment submitted.
- Isolated lint checked 104 files; all six UI suites, TypeScript and production build passed (40 outputs). Added runnable homepage assertions to `scripts/check-motion.tsx`.
- No server operations, commits or deployments.

## Map provenance

Adapted from [Aceternity World Map](https://ui.aceternity.com/components/world-map) under its [license](https://ui.aceternity.com/licence), with precomputed geographic data from MIT-licensed dotted-map 3.1.0. Attribution lives in the component. The geographic library is development-only; visitors receive the precomputed SVG geometry and the existing Motion runtime.

## Typography references

Reviewed the owner's [Untitled UI guide](https://www.untitledui.com/blog/best-free-fonts), [Creative Boom selection](https://www.creativeboom.com/tools/top-50-fonts-in-2026/), [Jukebox selection](https://www.jukeboxprint.com/blog/12-of-the-most-popular-fonts-in-graphic-design) and [Awwwards web-font gallery](https://www.awwwards.com/websites/web-fonts/). Figma's resource library was blocked by robots for the research tool. These are reference material, not licensing authority for additional font assets. No new font was installed; the owner's latest Syne direction superseded the provisional Manrope pairing.

## Awwwards motion follow-up

The source-linked research is in `docs/homepage-motion-research.md`, based on eight inspected animation recordings. Following Impeccable's motion guidance, the first bounded implementation preserves readable text and stable controls: a 740ms GSAP chrome-art gesture, CSS image-only hover feedback, navigation underlines, and project-link arrow feedback. Existing Motion continues to own booking transitions. No scroll hijacking or competing animation engines on the same element were added.

The hero starts fully visible and returns to its original state, clearing temporary transform, clipping and will-change styles. Desktop DOM sampling confirmed stable artwork geometry and visible headline throughout. Four-value inset endpoints keep interpolation symmetric. Mobile and reduced-motion paths skip the timeline; context cleanup handles preference changes and unmounts. Chrome disconnected during the last runtime fallback check, so final live cancellation/mobile rechecks are not claimed as passed. Earlier homepage responsive and modal checks above remain valid; no throttled performance trace or device-frame-rate certification was performed.

Final isolated validation after GSAP: frozen dependency install, lint (104 files), six UI suites including hero SSR, TypeScript, and production build (40/40 outputs) passed. All 118 source/config files matched the working source. Raw aggregate emitted JavaScript increased by 72,513 bytes (70.8 KiB); this is not a route-specific or gzip measurement. The GSAP-containing chunk is linked from homepage HTML, not archive or the 32 project/article HTML outputs; this is not an exhaustive runtime network audit.

The design checker matched an SSR image-tag assertion regex as a broken image. A narrowly file-scoped exception records that verified false positive in `.impeccable/config.json`. Your active server and its `.next` output were untouched.
