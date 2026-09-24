# Contact study

Mode: Persuade. Approved and promoted to homepage `/#contact`. The development-only, noindex route `/prototype/contact` renders the same shared component.

## Current implementation

Owner rejected the initial whole-composition fade swap and requested a more integrated Cal experience. The prototype now keeps one invitation panel and action in the DOM. On activation, the right panel widens to become the scheduler while the introduction compresses into a contextual sidebar. The 15-minute heading and button persist; the button becomes Back. Calendar detail duplication is removed with Cal's supported hideEventTypeDetails option. On mobile this opens vertically; secondary utilities follow the primary call invitation.

Calendar mounts only on first activation, persists through close/reopen to preserve its state, and is inert/hidden while closed. Changing the site theme remounts the calendar to apply the new theme. Readiness reveals the live embed; no fabricated dates or local booking UI. A slow/error message and direct calendar link are above the embed, with actual email always available. Reduced motion disables the panel choreography and loading animation. CSS grid dimensions and type size animate only during user-triggered opening/closing; no 60fps claim. No new dependency.

Verification: `.scratch/check-contact-study.mjs` checks desktop1440/mobile320, both themes, repeated open/back, focus continuity, fallback URL, reduced-motion Escape, overflow and runtime errors. Real Cal iframe URL and linkReady were observed, but availability/booking completion is not certified and no meeting was submitted. Escape cannot cross the third-party iframe; the visible Back button remains available. Shared homepage CTA remains untouched by this study.

Both routes render `components/contact/contact-section.tsx`, reusing existing Button and CVModal components. HomeBento now renders ContactSection instead of CTATile, retaining the contact anchor and active-section tracking. The legacy CTATile source is preserved. Existing site typography, tile radii, restrained borders, both themes and reduced-motion behavior remain the visual framework. DESIGN.md and .impeccable/design.json remain the established system.

## Review and open decision

Refinement: retain the approved split-panel prototype. Invitation copy now reads “Bring the idea you keep coming back to. Let’s see where a conversation takes it.” with “An idea is enough.” under the call duration. Opening uses a coordinated 620ms layout transition with a slightly delayed calendar reveal; closing is 440ms. A local single-pass WebGL satin-light shader gives the fluorescent surface gentle movement, fading out for booking. It stops while booking, offscreen, or document-hidden; reduced motion renders a static frame. CSS lime is the unavailable-WebGL fallback. No new dependency or homepage change.

The starting homepage baseline gave booking, copying email, opening mail, and viewing the resume competing prominence and explicitly used a dark calendar. The local study makes booking primary, places email and resume in secondary utilities, and passes the current theme to Cal. Email-copy failure recovery, the direct booking fallback, return focus and resume access remain available.

Owner confirmed: booking a short call is the primary action. Email and resume stay secondary. No availability, response-time, or freelance claims without confirmation. No booking submission or email sending during verification.

## Concepts to explore

A. Closing statement: “What should we make next?” A large left-aligned closing line with one dominant contact action, secondary call option, and a quiet utility row for email copy and resume. Signature interaction is a direct, reversible transition from invitation to the chosen contact action.

B. Open invitation: “Start with a conversation.” An expansive centered editorial statement, one visible Book a short call action, and quiet email/resume links beneath. More personal and less sales-oriented than a generic project inquiry.

C. The meeting point: “Your next idea deserves a conversation.” A split composition with the invitation on the left and a tactile 15-minute call invitation on the right. A clear booking button leads; email and resume stay in a quiet utility row. No invented available times or slots. The call panel transitions into booking only after activation.

These were exploration directions. The owner approved the refined current prototype and requested homepage integration. Earlier notes about leaving the homepage untouched describe the exploration phase, now superseded by this approval. Real booking completion is still not certified. Run the same regression check against the homepage using `CONTACT_URL=http://localhost:3000/#contact node .scratch/check-contact-study.mjs`.
