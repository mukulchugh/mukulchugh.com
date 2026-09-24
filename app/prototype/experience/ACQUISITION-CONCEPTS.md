# Acquisition motion concepts

Status: A selected and implemented in the isolated Experience prototype. The click contract below supersedes the original scroll-trigger proposals.

## Approved click contract

Current banner treatment: “Zenduty roots. A new chapter with Xurrent.” appears in a slim, full-width footer after the handoff. The identity line stays “IMR by Xurrent / Founding team”. Initial acquisition copy is removed; factual acquisition provenance remains in the accessible summary and modal.

Latest copy: initial identity is “Zenduty / Founding team”, without an acquisition row. Final identity is “IMR by Xurrent · Acquired by Xurrent / Founding team”. Historical provenance remains in the accessible summary and modal.

Latest refinement: the tile's role label is “Founding team” at the owner's request. Xurrent starts at 62% badge scale and hangs from a shared pendant pivot. The thread and entire badge oscillate together by ±3 degrees while visible; matched thread stretch and badge displacement provide subtle elastic follow-through. The logo image has no independent animation. Offscreen and reduced-motion states disable idle motion. The settled replacement badge returns to full size.

- Xurrent starts directly below Zenduty, connected by a fine thread. First activation plays a 1.2s tension/orbit/displacement sequence: Xurrent passes diagonally behind Zenduty, pushes it down, and settles into its position while the text transitions. All visible action-cue text is removed. The slash is part of each complete identity line, eliminating the reserved-width gap.
- Further activations during the transition are ignored. The next activation after completion opens the IMR by Xurrent modal with its Zenduty provenance.
- Scroll does not trigger or reverse this identity transition. Settled identity persists for the mounted prototype, including after closing the modal.
- Reduced motion settles immediately on the first activation; the second still opens the modal. Keyboard follows the same contract.
- Native CSS keyframes animate only transform and opacity. Percentage-based logo geometry adapts to mobile without measurement or a JavaScript frame loop. One animation-end event completes the existing two-click flow. No new dependency or homepage changes.
- `.scratch/check-zenduty-handoff.mjs` checks this contract in both themes at 1440/320, stable row geometry, keyboard/reduced motion, and dialog identity.

## Shared constraints

- Confine changes to the existing Zenduty experience row and its modal identity. No other tile, page, typography, or general layout changes.
- Contribution and Jun 2022–May 2025 stay anchored. The tile uses the owner-requested “Exited” status and settled provenance “Formerly Zenduty · Acquired by Xurrent” below the company name. Intern → Software Engineer remains in the modal. Do not imply a second job or a new employment period.
- Owner-requested display: IMR by Xurrent. Official public naming is Xurrent IMR (formerly Zenduty): https://www.xurrent.com/incident-management-response.
- Acquisition and later product branding are separate events. Do not date the new brand name to January or imply it was already used during the entire employment period. January internal discussions remain out of the compact public tile.
- Real original assets must be used in implementation; generated storyboard logos are illustrative. Promotional captions outside the storyboard panels are not proposed portfolio copy.
- Reserve stable geometry for both names on mobile. Maintain one accessible name containing both identities; do not announce every animation frame.
- Reduced motion shows both identities and the provenance without spatial animation. Both themes retain their existing local tokens.

## A: The handoff

Xurrent’s small acquisition mark travels into the main logo position. Zenduty fades, then its name rolls upward within a clipped line as IMR by Xurrent enters. Formerly Zenduty settles below.

Sequence: 0–180ms marker departure; 140–500ms identity exchange; 420–640ms provenance. Downward visibility trigger after 120ms dwell with at least 70% of row visible; a separated upward return threshold reverses from current progress. Avoid a literal vector-path mutation of unrelated logos.

Storyboard: /Users/mukulchugh/.codex/generated_images/01a0b9cc-927c-7a82-9592-47846625abc1/exec-09cfb84b-bfb6-49db-8650-338fa4547bcf.png

## B: The next chapter

Logos remain in their badge. A short acquisition caption precedes a masked editorial name change. Plays once after 650ms of readable visibility, then remains settled. Optional separate keyboard-accessible replay button; ordinary row click opens its own modal.

Sequence: context 0–180ms; old identity exit 180–420ms; new identity 360–720ms; provenance 720–940ms. Do not replay on every viewport entry or during the More Work morph.

Storyboard: /Users/mukulchugh/.codex/generated_images/01a0b9cc-927c-7a82-9592-47846625abc1/exec-779cfc55-c0af-4ca8-a3ed-995a346a3d7b.png

## C: The acquisition seam

A small reveal crosses only the logo and name lane, driven by actual list scrolling. Down reverses to up on the same continuous timeline. No wheel interception, pinning, extra height, or dependency on More Work pressure.

Map progress as clamp((0.62H - rowTop) / (0.36H), 0, 1). Logo changes over 12–40%; name over 38–82%; provenance over 78–94%; seam disappears over 90–100%. Measure offsets on layout changes rather than per animation frame. Keep the entire historical identity available to assistive technology while visual layers clip.

Storyboard: /Users/mukulchugh/.codex/generated_images/01a0b9cc-927c-7a82-9592-47846625abc1/exec-184be6b7-eccd-4588-a626-c1f7d626e8c2.png

## Implementation workflow after selection

1. Confirm selected choreography and exact brand display text. Keep the public present-day brand distinct from historical employment.
2. Build one bounded timeline with existing Motion, original assets, fixed row geometry, and stable accessible text.
3. Tie progress to the internal list, not page scroll or More Work overscroll pressure. Preserve progress through modal opening and list expansion.
4. Modal always explains the complete historical continuity, regardless of which visual identity was visible when opened.
5. Capture before/mid/after/reverse on desktop and 320px in both themes. Test fast direction reversals, touch, keyboard, reduced motion, theme switching, modal focus return, and More Work interaction.
6. Profile the chosen effect and document measured limits. Do not claim 60fps based on screenshots or transform usage alone.

Recommendation: A has the clearest spatial story. C has the strongest scroll continuity. A’s short logo journey can use C’s real-scroll progress if selected, without adding a second gesture system.
