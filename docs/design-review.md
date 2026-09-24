# Portfolio design review and implementation handoff

Historical report. Its sharp-corner direction and implementation snapshot predate the owner-approved recovery. Current authority: [DESIGN.md](../DESIGN.md) and [recovery checkpoint](recovery-checkpoint.md).

## Direction

Preserve the existing Syne typography, sharp geometry, restrained palette, bento composition, and large editorial covers. The owner explicitly chose to retain large covers. Distill repeated information and interaction code, not the site's identity. Impeccable guided critique, component consolidation, distillation, and bounded visual verification.

Implementation checkout: `/Users/mukulchugh/portfolio-motion`, branch `fix/motion-polish`. The separate dirty `mc-redesign` checkout was not modified. No publication or deployment is included.

## Independent assessment

Method: dual-agent, A `/root/design_assessment` and B `/root/technical_assessment`, followed by implementation and browser verification by the main agent. Both reviewed independently; detector output was withheld until A completed. The static detector returned zero findings in `app` and `components`; real interaction and editorial defects still existed. No visual detector overlay was injected. No review server was started for this pass.

Pre-fix heuristic scores, not a post-fix certification:

| Heuristic | Score | Main observation |
| --- | --- | --- |
| Status visibility | 2/4 | Reading progress included page chrome |
| Real-world match | 3/4 | Packages/releases were called demos |
| Control and freedom | 3/4 | Modal and cross-page exits needed consistency |
| Consistency | 2/4 | Repeated controls and separate navigation definitions |
| Error prevention | 3/4 | Some technical copy overclaimed behavior |
| Recognition | 3/4 | TOC used actions instead of shareable section links |
| Flexibility | n/a | Portfolio, not a productivity application |
| Minimalist design | 2/4 | Repeated metadata, decorative numbering |
| Recovery | 3/4 | Useful error page; copy failure feedback needed work |
| Help/documentation | n/a | Portfolio/editorial surface |
| Total | 21/32 | Acceptable before fixes |

Specificity is strong: concrete first-person engineering work, restrained covers, and public/private work boundaries distinguish this portfolio. Moderate cognitive load came from repetition, not an overly complicated information architecture. The best improvement is clearer paths through the existing content, not another visual redesign.

## End-to-end surface comments

| Surface | Assessment and action |
| --- | --- |
| Homepage / identity | Keep the name-led hero and existing positioning. Added a real h1 and actionable contact link; simplified heading choreography and redundant section markers. No career claims rewritten. |
| About | Preserve the first-person voice. Removed duplicate label/divider presentation in the shared section heading. Biography chronology remains owner-reviewed content. |
| Location / socials | Pacific time now derives its zone abbreviation from the clock, including daylight saving. Native external links and email fallback remain available. |
| Featured work | Preserve editorial cover identity; prevent unnecessarily truncated project names. Shared Button and Badge own controls/tags. Project preview uses the shared accessible dialog. |
| More projects | Keep public/private distinctions and current visibility rules. Pagination uses shared controls and an announced page state; transitions no longer duplicate nested entrances. |
| Project overview pages | Accurate release/package/design labels replace generic demo labels. 'Technologies & context' no longer implies every descriptor is a technology. These remain overviews, not invented detailed case studies. |
| Writing on homepage | Shared article card remains the single card implementation. Simplified heading and 'All articles' link; physical pagination remains interruptible. |
| Blog index | Preserve large typographic covers. Remove repeated author avatars/names and redundant cover metadata. Titles remain visible outside covers for reliable scanning; decorative cover text is hidden from assistive technology. |
| Every article | All 15 Markdown files reviewed. Large covers retained. Body links remain visibly underlined on touch devices. Mobile TOC uses Base UI Collapsible and real hash links; focus follows the selected heading. Reading progress measures the article extent, not recommendations/footer. |
| Article ending | Chronological links explicitly say Newer/Older. Related articles and all-posts escape retained; no new filters or content-management layer added. |
| Experience | Shared Base UI Dialog provides focus management, dismissal, and scroll locking. Base UI Collapsible owns additional roles; removed the fade obscuring actual role content. |
| Contact / booking | Existing calendar library retained. Entry and return preserve focus. Email-copy failure exposes an alternative. No booking submitted. |
| Resume | Existing shared Dialog retained. Mobile actions no longer repeat in a cramped header; preview fallback uses theme tokens and the hidden iframe cannot take mobile focus. |
| Global navigation | Dock, footer, and brand bar share canonical home-qualified fragment URLs. Mobile popup lifecycle belongs to Base UI Popover, not document-level click/keyboard listeners. Plain navigation remains semantic links, not buttons. |
| Theme / error states | Shared button, badge, logo and dialog fixes propagate across routes. Missing article returns 404. Error boundary remains available; no simulated production incident or external action performed. |

## Component ownership

| Responsibility | Owner |
| --- | --- |
| Action buttons and press feedback | `components/ui/button.tsx` and `button-control.tsx`, Base UI + Motion |
| Dialog semantics, focus, dismiss, backdrop | `components/ui/dialog.tsx`, Base UI |
| Mobile navigation positioning / focus / dismissal | `components/ui/popover.tsx`, Base UI |
| TOC and role disclosure | `components/ui/collapsible.tsx`, Base UI |
| Tooltip / avatar / separator / badge | Existing shared UI components |
| Scroll-linked progress semantics | Base UI Progress; measured article geometry drives Motion values |
| Calendar and code-block behavior | Existing Cal.com and Streamdown libraries |
| Page composition and editorial covers | Domain components; not additional interaction primitives |

Native anchors and headings deliberately stay native. A component library should own interaction contracts, not replace semantic HTML or force every composition into a generic card. The Markdown engine now declares the already-installed unified/remark parser packages directly so server headings match Streamdown's grammar. No new UI library was added.

Motion uses shared physical spring presets with reduced-motion support. The dialog's curve is precomputed to avoid running a spring generator during module initialization. CSS and Motion no longer both own the shared Button's scale. Broad HTML/client-bundle cache headers were removed so Next manages route caching and development freshness.

## Content review gate

See [content-review.md](./content-review.md) for exact proposed corrections and comments on all 15 articles. Drafts are not applied. In particular, publication chronology, benchmark provenance, operational claims, checkpoint restoration, loop-detection pseudocode, and prompt-injection defenses require owner review. No dates, measurements, or private implementation details were invented.

Persona checks: a first-time reader gets clearer project destinations; a mobile visitor gets real section links and consistent disclosure; keyboard users get library-owned focus restoration and a visible close control over dark covers. Full screen-reader and contrast certification are not claimed.

## Verification and remaining boundaries

- `bun run lint`, `bunx tsc --noEmit`, and `git diff --check` passed during the final check.
- A reduced-motion test exposed server/client initial-attribute differences. All motion consumers now use one hydration-safe `useSyncExternalStore` preference hook. A subsequent cold navigation with reduced motion confirmed active produced no hydration errors; SSR regression checks cover the shared controls. Live preference changes no longer remount Reveal children.
- Final production build completed successfully after typography, layout, compatibility and focus changes, generating all 40 static outputs.
- `bun run test:ui http://localhost:3001` passed: 34 page routes, all 15 article bodies, 17 visible project routes, six navigation destinations, and a missing-article 404.
- Browser-tested project preview dismissal/focus return, mobile TOC/hash/focus, cross-page mobile Contact navigation, resume open/close, experience expansion/dialog, booking load/return, theme switching, and tablet project destinations.
- Inspected desktop and 390px mobile layouts, plus 768px tablet route geometry. Absence of horizontal root scrolling alone is not a complete layout audit.
- The article renderer now matches source offsets instead of heading text. Runnable tests render all 15 articles and concurrent synthetic documents with repeated/formatted headings, suffix collisions, nested headings, entity/Unicode cases and unsafe links/scripts. Progress checks cover long, short and viewport-height articles.
- Tablet featured projects now span the full intended grid width. Mobile resume has a compact fallback. Blocked calendar loading was browser-tested: a status message and direct calendar/email links remain available, and Back returns focus to Book a call.
- Independent integration review caught `URL.parse` incompatibility in older supported browsers; the helper now uses `new URL` with a malformed-input fallback. Existing project checks include hostname spoofing and query-string false positives.
- Booking submission, email sending, downloads, external-project functionality, and production deployment are outside this verification. Third-party uptime is not guaranteed by a loaded preview.
- Review tabs and viewport/media emulation should be reset after verification. User's dev server remains user-owned; do not start or stop it.

No fabricated after-score: remaining editorial decisions prevent declaring the entire portfolio release-ready merely because UI checks pass.

The subsequent dedicated typography/layout pass and 11 full-page captures are documented in [typography-layout-review.md](typography-layout-review.md). It supersedes older visual recommendations where they conflict. Resume and project-preview close focus were explicitly verified against their opening buttons; the mobile TOC hash and destination focus also passed after deferring disclosure closure until native navigation completes.
