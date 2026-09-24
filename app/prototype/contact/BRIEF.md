# Contact study

Mode: Persuade. Approved and promoted to homepage `/#contact`. The development-only, noindex route `/prototype/contact` renders the same shared component.

## Current implementation

Owner rejected the initial whole-composition fade swap and approved native Cal API integration that preserves in-site booking. The shared component keeps one invitation panel and action in the DOM. On activation, the right panel widens to become the scheduler while the introduction compresses into a contextual sidebar. The 15-minute heading and button persist; the button becomes Back. On mobile this opens vertically; secondary email utilities follow the primary call invitation. The invitation, shader and expansion design are unchanged by the API integration.

The native scheduler mounts only on first activation, persists through close/reopen to preserve its state, and is inert/hidden while closed. Native date and timezone controls request live Cal availability; existing Base UI Button controls select a time and submit attendee details. Name and email are required; notes and guests are optional. Confirmed and pending results are distinct. A slot conflict refreshes availability and preserves entered details; other failures offer recovery, with uncertain results advising an email check before retrying. The direct calendar link and contact email remain available. Theme changes use site tokens without remounting the scheduler. Reduced motion disables panel choreography and the brief booking-step entrance. No new dependency.

Verification: live Cal availability returned HTTP 200 with no Cal cookies or Chrome DevTools Protocol issues observed. Every booking POST used a mocked response; actual meeting creation and invitation email delivery remain unverified. The native form allows Escape to return to contact options and restores focus to the invitation action. Booking requests use `credentials: "omit"` and `referrerPolicy: "no-referrer"`; the form is marked private for analytics and discloses that details are sent to Cal.com, with privacy and terms links.

Both routes render `components/contact/contact-section.tsx`, which uses `components/contact/booking-calendar.tsx` and the existing Button. HomeBento renders ContactSection, retaining the contact anchor and active-section tracking. Resume/CV controls are no longer present in this contact surface. Existing site typography, tile radii, restrained borders, both themes and reduced-motion behavior remain the visual framework. DESIGN.md and .impeccable/design.json remain unchanged as the established system.

## Review and open decision

Refinement: retain the approved split-panel prototype. Invitation copy now reads “Bring the idea you keep coming back to. Let’s see where a conversation takes it.” with “An idea is enough.” under the call duration. Opening uses a coordinated 620ms layout transition with a slightly delayed calendar reveal; closing is 440ms. A local single-pass WebGL satin-light shader gives the fluorescent surface gentle movement, fading out for booking. It stops while booking, offscreen, or document-hidden; reduced motion renders a static frame. CSS lime is the unavailable-WebGL fallback. No new dependency or homepage change.

The starting homepage baseline gave booking, copying email, opening mail, and viewing the resume competing prominence and explicitly used a dark calendar. The current shared surface makes booking primary and email secondary; the native booking UI follows the current site theme. Email-copy failure recovery, the direct booking fallback and return focus remain available.

Owner confirmed: booking a short call is the primary action. Email stays secondary. Available slots come from Cal; no response-time or freelance claims are added. Verification creates no real appointment and sends no email.

## Native booking finish review

Independent reviewer verdict: pass / ship. The sole finding, insufficient input-border contrast, was resolved with a real 1px border mixing foreground at 45%. Rechecked contrast is 3.02–3.16:1 in light mode and 4.21–4.50:1 in dark mode. This is a local booking-field correction, not a new global token or visual system.

Eight review captures cover availability and attendee details in both themes at 1440px and 320px: `.impeccable/review/booking-{light,dark}-{1440,320}.png` and `.impeccable/review/booking-details-{light,dark}-{1440,320}.png`. These are verification screenshots, not shipping artwork. No images were generated and no new assets were introduced. The finish verdict does not certify real booking delivery.

## Concepts to explore

A. Closing statement: “What should we make next?” A large left-aligned closing line with one dominant contact action, secondary call option, and a quiet utility row for email copy and resume. Signature interaction is a direct, reversible transition from invitation to the chosen contact action.

B. Open invitation: “Start with a conversation.” An expansive centered editorial statement, one visible Book a short call action, and quiet email/resume links beneath. More personal and less sales-oriented than a generic project inquiry.

C. The meeting point: “Your next idea deserves a conversation.” A split composition with the invitation on the left and a tactile 15-minute call invitation on the right. A clear booking button leads; email and resume stay in a quiet utility row. No invented available times or slots. The call panel transitions into booking only after activation.

These were historical exploration directions, including the then-present resume utilities. The owner approved the refined prototype, homepage integration, and subsequently the native Cal API flow above. Earlier notes about leaving the homepage untouched describe the exploration phase, now superseded by this approval. Real booking completion is still not certified.
