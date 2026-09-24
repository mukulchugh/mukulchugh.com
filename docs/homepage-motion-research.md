# Homepage motion research

Research date: 20 September 2026. Research only, not an implementation or performance sign-off.

Implementation handoff update: while this research finished, the root agent assigned a 650–800ms GSAP hero-only timeline, added a 650ms image-only OpenKVM lens at scale 1.025 for fine pointers with normal motion, and added 180ms navigation/project-arrow feedback. Booking remains owned by Motion. Those are parent-reported implementation decisions, not independently reviewed results here. The faster lens durations below remain research recommendations; assess the actual 650ms response before changing it. No further decorative feature is required after this first batch. The next priority is live motion, accessibility, cleanup, and performance verification against the acceptance criteria below; only fix defects found there.

## Direction

**Make one material feel authored. Preserve the identity of objects as their state changes.** The chrome ribbon already gives this homepage a recognizable material; animate its light and framing, not the entire page. Keep the Syne headline, canonical content, generous imagery, stable link targets, and ordinary document scrolling.

This applies the requested Impeccable `animate` and craft-floor guidance: one focal sequence, meaningful continuity, fast feedback, visible default content, and deliberately quieter reduced-motion behavior. The ambition is not a larger number of effects. It is a rehearsed visual event with a beginning, a change, and a settled composition.

## Evidence and limits

The [requested Awwwards collection](https://www.awwwards.com/awwwards/collections/css-js-animations/) and the eight linked element pages below were retrieved. Their actual hosted recordings were downloaded and inspected as chronological contact sheets sampled at one frame per second, covering up to the first twelve seconds. These are observations of moving-site recordings, not deductions from award descriptions. Empty cells at the end of a contact sheet are beyond the recording, not blank site states.

The web text reader timed out on the collection; direct HTTP retrieval succeeded. This research did **not** operate these eight live sites in an interactive browser, audit their current mobile implementations, or measure their frame times. Recordings establish visible composition and sequences, not the responsible library, exact easing curve, click latency, keyboard support, or reduced-motion compliance. Timing values below are portfolio recommendations, not measured reference timings. Hover/scroll causality is attributed to the named example when the recording alone cannot prove its event handler. No reference is claimed to use GSAP without source evidence.

## Eight specific learnings from actual examples

### 1. Be the Buzz: selected content earns space

[Element](https://www.awwwards.com/inspiration/fluid-box-reposition-be-the-buzz) · [recording](https://assets.awwwards.com/awards/element/2024/04/66194e8030058634460605.mp4)

Observed: three outlined service regions repeatedly exchange large and small positions. The selected service expands to contain explanatory copy and a button; the others remain identifiable compact regions. The purple field appears during repositioning rather than every region simply dissolving.

Learning: animate a relationship, not three unrelated entrances. Applicable to contact-to-booking continuity because the same tile has two real states. Do not turn the project index into an expanding accordion: its six initial rows already support quick comparison. On mobile, changes must follow an explicit action, not pointer entry. Reduced motion can preserve state change without relocating neighboring controls. Layout work is justified only in this bounded interaction, not continuously during scroll.

### 2. Alec Tear: keep dense information still while an image provides delight

[Element](https://www.awwwards.com/inspiration/footer-alec-tear) · [recording](https://assets.awwwards.com/awards/element/2024/10/6705b0f970d98891792339.mp4)

Observed: a compact typographic project index stays legible while small project images appear over individual rows. A two-part design/lettering control becomes visually prominent in the open footer area; its scale/position changes relative to the scrolling index.

Learning: dense rows need not dance to feel interactive. Borrow a quiet row highlight and directional icon acknowledgment for the project index. Do not make the portfolio's real project art available only through cursor previews. Touch has no persistent hover; keyboard focus deserves the same textual clarity without a floating preview covering other rows. The recording does not establish whether these effects follow the cursor or merely selected rows.

### 3. Antoine Wodniack: an ordinary action can own an expressive aperture

[Element](https://www.awwwards.com/inspiration/contact-hover-animation-antoine-wodniack-portfolio) · [recording](https://assets.awwwards.com/awards/element/2024/11/673b0262eda0b034911195.mp4)

Observed: a tiny dark circular target on a red grid becomes a large dark disk containing sliced, shifting display lettering, then returns to the small target. The grid remains recognizable around it. This is a high-amplitude contact-hover demonstration, not a necessary content reveal.

Learning: isolate expressive motion inside a known boundary. The portfolio can give chrome art a brief light aperture without making its booking button grow across the interface. Reject cursor replacement, giant hover expansion, and sliced animated CTA text here: they compete with a useful calendar and work poorly without hover. Keep native cursor and stable focus geometry.

### 4. Qudrix: movement explains a product change

[Element](https://www.awwwards.com/inspiration/wizard-qudrix) · [recording](https://assets.awwwards.com/awards/element/2025/01/677e8d3b26b75342588502.mp4)

Observed: a configuration sidebar remains in place while a rendered cube changes viewpoint and roof state. The roof visibly opens/reconfigures; the object then presents a different face. The visual response belongs to the selected object rather than moving the whole interface.

Learning: useful motion answers “what changed?” For the portfolio, copy-email confirmation, project-list expansion, and booking state are stronger candidates than decorative scrolling type. Do not imply that the existing flat chrome raster is a rotatable 3D object. A genuine model/configurator would require new assets and an entirely different budget, which this task does not justify. Reduced motion should show the resulting configuration immediately.

### 5. Sofi: one visual anchor allows surrounding motion

[Element](https://www.awwwards.com/inspiration/sofi-pod-showcase-sofi) · [recording](https://assets.awwwards.com/awards/element/2024/12/6761a89fa66e8645430254.mp4)

Observed: the dark diagonal pod remains the central anchor while oversized white product lettering crosses behind it. Later, small feature labels occupy opposite sides while the object remains prominent. Contrast, occlusion, and scale create hierarchy; not every layer moves together.

Learning: keep the homepage headline stable and let the separate chrome-art region carry the visual event. Layering requires honest asset boundaries: the supplied flattened raster cannot provide arbitrary new foreground/background occlusion. Use a rectangular clipped art region, not a fake silhouette mask. Mobile should show the settled art composition, not a pinned product tour. One raster plus a small overlay is preferable here to a persistent WebGL scene.

### 6. Jeton: continuity is more convincing than a cut

[Element](https://www.awwwards.com/inspiration/desktop-to-mobile-morphing-jeton) · [recording](https://assets.awwwards.com/awards/element/2025/01/677bf6568fe45003502746.mp4)

Observed: a wide desktop payment interface gives way to a narrow mobile-like presentation and card/wallet imagery inside the same red world, followed by the next white section. Product identity persists through changes in framing and proportions. The recording shows a scroll progression, but it does not reveal the exact pinning or scrub implementation.

Learning: the booking card should feel like the contact card becoming useful, not a replacement page. Preserve its background, border radius, heading alignment, and back affordance. Avoid FLIP-scaling the text or iframe. The existing wait-mode crossfade plus container-height transition is a reasonable foundation. No scroll hijacking or multi-screen pinned sequence is needed to express this relationship.

### 7. Malvah: choreography can create identity, but a preloader charges admission

[Element](https://www.awwwards.com/inspiration/preloader-malvah-studio) · [recording](https://assets.awwwards.com/awards/element/2024/03/65ef139141352525856861.mp4)

Observed: the recording starts mostly black with tiny separated marks; numerous repeated white text fragments subsequently form a dimensional arrangement and change orientation. The first twelve sampled seconds do not establish the eventual complete landing-page state.

Learning: take the disciplined single visual idea, not the wait. This portfolio needs immediately readable identity, work, and navigation. No full-screen loading percentage, mandatory entrance, or blank initial hero. A chrome sequence may enhance already-visible art for less than a second and must not delay image display, links, or hydration-independent content. Never conceal content to stage a reveal.

### 8. Tux Karma Foundation: animate the frame, keep the control predictable

[Element](https://www.awwwards.com/inspiration/morphing-svg-mask-slider-tux-karma-foundation) · [recording](https://assets.awwwards.com/awards/element/2023/10/651ad976b1ba2442874678.mp4)

Observed: portraits change inside a moving aperture, alternating curved rectangular and more irregular rounded silhouettes. Small previous/next controls retain their position underneath. The visual frame is expressive while interaction geography stays calm.

Learning: the hero or featured image can change crop subtly while link bounds remain fixed. Do not copy these organic shapes into the current 14px card language or approximate a person's silhouette with geometry. An inset crop or translated image inside the existing rectangle is enough. Keyboard and touch navigation must work without the decorative effect. A bounded clip requires paint profiling rather than an assumption that it is free.

## Current implementation map

Read directly in the working repository during this research:

- `components/bento/profile-tile.tsx`: semantic static headline; `HeroArtwork` currently uses only hover scale `0.992`. Strongest opportunity for an authored focal moment. Its image is a flattened `/design/chrome-ribbon.webp`, not a separable 3D model.
- `components/bento/featured-project-tile.tsx`: existing art composition should remain the source of each project's distinctiveness. Do not add a common dramatic reveal to all cards.
- `components/bento/cta-tile.tsx`: homepage already uses a 500ms CSS min-height transition and wait-mode content crossfade. Preserve real calendar loading, copy feedback, back action, and focus return. A scale-based shared-layout animation is not necessary.
- `components/ui/button-control.tsx` and `components/ui/dock.tsx`: shared feedback and active-state motion already exist. Reuse rather than add a second button animation layer.
- `components/ui/route-transition.tsx`: short opacity transition, no retained outgoing router tree or transformed page ancestor. Keep this simple; an elaborate exit transition risks navigation correctness and sticky/fixed positioning.
- `lib/use-reduced-motion.ts`: server snapshot is reduced-motion-safe and the preference updates live. New choreography must handle hydration and preference changes without hidden or half-transformed content.
- `lib/motion.ts`: existing exponential-out fade and tuned springs are useful. Its blanket comments banning blur, filters, and layout animation are too broad. Replace with a scoped cost policy if implementation changes them; no blanket exemption from profiling.
- `package.json`: Motion is already present. GSAP would be a new dependency, permitted by the owner but still requiring a concrete reason.

## Prioritized implementation: three moments maximum

### P0: “Light finds form” in the chrome hero

One authored moment, once per home entry, within the existing art rectangle. Do not animate the headline or card position.

Suggested score, not reference timing: at 0ms the normal image is already visible; from 0–650ms a subtle image crop settles from approximately 1.025 scale to 1; from 80–620ms a narrow, low-opacity light band crosses the image; by 750ms the overlay is gone and the original composition is restored. Use confident exponential deceleration, no elastic tail. Use a clip on the art container, not a fabricated cutout around the ribbon. The band must not bleach the image or wash out the overlaid caption. If the raster looks like it is merely being wiped by a generic gradient, omit the band and retain only the genuinely convincing material treatment.

On narrow touch layouts, halve spatial travel or show the settled frame. Reduced motion: no sweep, crop translation, or scale; optionally a short opacity change on a decorative overlay, never on essential content. Trigger after the image is ready without hiding it while waiting. Interrupting or leaving the page must clean up the effect.

### P1: a restrained project-image lens

Fixed card and link bounds. On fine-pointer hover and keyboard focus, allow the image to settle into a slightly closer crop over 180–240ms while the existing arrow acknowledges direction over 120–160ms. Restore in roughly 150ms. No pointer-tracking tilt, image following the cursor, custom cursor, new captions, or repeated scroll entrance. If imagery already fills the crop tightly, use only the arrow/color response.

Mobile keeps the same static composition and ordinary first-tap navigation. Reduced motion retains color/focus feedback, no crop change. Writing covers and compact index rows should stay editorial; this image treatment is not a global card utility.

### P1: contact becomes booking

Retain the current real state flow. Tune existing exit to approximately 120–150ms, new content to 180–250ms, container reflow to 350–500ms if visual verification confirms the wait is useful. Mount/request the calendar immediately after intent, not after decoration. Keep heading and back controls anchored. Do not scale live text or the embedded calendar. A repeated click during transition must not produce two iframes or strand focus.

Reduced motion switches state directly with minimal opacity feedback. Return restores focus to the booking trigger. This is continuity polish, not a mandate to replace the already-working interaction.

### Supporting feedback, not extra signature moments

- Preserve copy success and error as real status outcomes, readable with motion disabled.
- Project Show all/Show fewer may use a short bounded list appearance, at most 120ms total stagger, with all routes remaining reachable. Do not animate every row during ordinary scrolling.
- Keep button targets stationary; homepage magnet strength zero is appropriate.
- Keep the existing finite map path and avoid adding ambient loops elsewhere to compete with the hero.
- Keep navigation instant and native anchors functional. Do not add a route curtain simply because the reference collection includes one.

## CSS, Motion, or GSAP?

| Effect | Preferred tool | Reason and boundary |
| --- | --- | --- |
| Hero with overlapping crop, light, and cleanup phases | GSAP core timeline if the full authored score is implemented; otherwise Motion sequence | A labeled common clock makes overlaps and interruption explicit. GSAP is justified by choreography, not prestige. No ScrollTrigger needed for a one-time entrance. Remove Motion ownership from the same animated nodes. |
| Simple single crop or hover response | CSS or existing Motion | Existing tools express this cleanly. CSS for declarative hover/focus; Motion where existing state or interruption benefits. |
| Booking state/exit/return | Existing Motion plus bounded CSS sizing | React state and AnimatePresence already own this behavior. Do not introduce a GSAP timeline that competes with those state transitions. |
| Hypothetical future pinned product narrative | GSAP ScrollTrigger only after a real narrative requires it | Strong timeline/scroll coordination, but no present homepage requirement justifies pinning or a smooth-scroll engine. |
| Focus, colors, reduced-motion fallback | CSS and existing preference hook | Browser-native, cheap, and usable if enhancement fails. |

GSAP timelines support sequencing and overlapping tweens; `matchMedia` scopes responsive conditions and collects animations for reversion. That is a concrete advantage for a coordinated multi-layer scene, not evidence that CSS or Motion cannot make attractive motion. [GSAP timeline](https://gsap.com/docs/v3/GSAP/gsap.timeline()/), [matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/).

Motion supports both viewport-triggered effects and scroll-linked values, so a simple once-in-view effect is not itself a reason to add ScrollTrigger. Its reduced-motion configuration disables transform/layout animation while retaining other feedback; custom effects still need explicit handling. Check installed-version behavior rather than assuming every feature in today's online documentation exists locally. [Motion scroll](https://motion.dev/docs/react-scroll-animations), [Motion accessibility](https://motion.dev/docs/react-accessibility).

Current GSAP standard terms allow commercial projects without a charge, including formerly paid plugins, and restrict certain competing no-code visual animation-building uses. This portfolio fits the stated ordinary website use case; do not call GSAP MIT or unrestricted open source. Recheck terms when installing. [Official GSAP license](https://gsap.com/community/standard-license/).

Transforms and opacity are usually efficient starting points, but rendering work must be measured. Clip, blur, and shadow can trigger paint; layout-driving animation can require repeated layout. Limit expensive effects to the art rectangle and active interval, avoid permanent `will-change`, and profile rather than treating a library as a performance guarantee. [Browser animation guidance](https://web.dev/articles/animations-guide).

## Acceptance criteria for the implementation pass

1. Capture the complete hero sequence, not only its final screenshot. Verify no blank pre-animation frame, caption contrast loss, image flash, awkward reset, or endless repetition.
2. Test 320, 390, 768, 1024, and 1440px. No overflow, new document layout shift from the hero, clipped controls, or moving hit targets. Narrow layouts are an intentional static/low-travel composition.
3. Exercise mouse, keyboard, and touch. Every project opens on its first activation; no hover-only content. Focus rings remain visible and stationary.
4. Toggle reduced motion while the page is open and load with it already enabled. All content remains visible, the hero settles immediately, state feedback remains clear, and scroll-linked/spatial movement stops.
5. Rapidly open/back/reopen booking, expand/collapse the project index, navigate away during hero playback, and return. No duplicate timelines/listeners/iframes, stale transforms, delayed navigation, or focus loss.
6. Test JavaScript disabled or enhancement failure: essential headline, artwork, content, and links remain available. Animation cannot be a visibility prerequisite.
7. Record a performance trace on a representative lower-powered mobile device or explicitly labeled throttled simulation. Inspect long tasks, paint area, frame consistency, layout work, and transfer cost against the unanimated baseline. No performance pass can be inferred from these reference recordings.
8. If GSAP is added, document the concrete timeline it owns and the production bundle delta. No parallel Motion/CSS transition controls the same property on that node. Clean up on unmount and preference/breakpoint changes.
9. Run existing UI checks, typecheck, lint, production build, and independent live motion review. Static reduced-motion screenshots alone do not validate the authored sequence.

## Anti-patterns to reject

No mandatory preloader; no scroll hijacking; no long pinned hero; no every-section fade-and-rise; no magnetic moving booking target; no bounce on all cards; no looping chrome rotation; no fake 3D from a flat raster; no blur over readable text; no split-letter heading choreography that damages wrapping or accessible names; no custom cursor needed to understand navigation; no transition holding the old App Router tree merely for spectacle.

The strongest upgrade is a recognizably authored chrome moment and better continuity in real interactions. Preserve the calm editorial page around it.
