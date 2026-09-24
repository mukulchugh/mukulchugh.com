# Catapult and copy: ten-agent concept review

Status: ideation only. No prototype or homepage implementation changed in this pass.

## Brief

The visitor pulls a lime ball, releases it in the opposite direction, and sees
bounded rebounds. The interaction must play with the copy, not sit beside it.
The adjacent approved headline stays: Creating digital experiences for humans.
The tile supports that introduction rather than attempting to tell the entire
career story. Palette and type remain black, off-white, lime, and Geist.

The rejected predecessor rotated a raster with a slider. Its failure was not
technical: the delivered experience did not justify the concept or the control.
This review treats causal meaning and visual judgment as separate from tests.

## Ten independent perspectives

| Agent | Lens | Most useful contribution |
| --- | --- | --- |
| ideate_01_meaning | Personal meaning | A working prototype is something people can react to; the toy cannot prove a whole professional philosophy. |
| ideate_02_copy | Editorial writing | Proposed pushback, sketch, and small-change narratives; rejected treating edge cases as debris. |
| titles_navigation | Play choreography | Physical word resistance gives replay value without destroying readability. |
| ideate_04_physics | Simulation | One ball plus bounded text responses is sufficient; full letter rigid-body physics is unnecessary. |
| ideate_05_composition | Art direction | Preserve a legible, composed still state and a generous mobile play area. |
| ideate_06_accessibility | Inclusive interaction | Aim/fire keyboard mode, localized touch capture, and an equivalent nonanimated outcome. |
| ideate_07_antigimmick | Adversarial critique | If the explanation is stronger than the observed event, the idea has failed. |
| ideate_08_portfolio | Visitor interpretation | The work should remain more memorable than the toy; pushback has an interpersonal interpretation risk. |
| ideate_09_alternatives | Independent alternatives | Connect product/design/engineering questions, or examine one real interaction from those three perspectives. |
| ideate_10_validation | Prototype selection | Prove the exact copy transformation before spending on materials or elaborate physics. |

These are perspectives, not votes or user-test results. Recommendations differed.

## Findings that change the direction

1. Do not launch through “features,” “assumptions,” and “edge cases” to reveal
   “the person using it.” It treats necessary work as disposable and repeats the
   adjacent human-centered headline. The earlier reveal proposal is withdrawn.
2. A ball that only hits the frame leaves copy as a caption. One art-direction
   review preferred that readability safeguard; the synthesis rejects it because
   the user specifically wants the words and gesture to interact.
3. Destroying or scattering individual letters is not required. Whole words can
   yield and recover while their reading order remains stable.
4. No game score, win condition, forced completion, sound, autoplay, or perpetual
   invitation. The visitor may ignore the tile without missing essential content.
5. Physics cannot turn a vague line into a meaningful idea. Choose the sentence
   and the precise consequence first.

## Direction A: I like a little pushback.

**Recommended first experiment, not a validated final design.**

At rest: two lines, “I like a little” / “pushback.” A lime ball sits below and
to the right. A small cue says “Pull. Let go.” The arrangement is intentional
before anyone interacts. The main homepage headline never moves.

Pull: the ball stays under the pointer, a tether stretches toward its launch
socket, and the bounded pull visibly stores force. No new paragraph appears.

Release: the ball travels opposite the pull. On contact, the word “pushback”
slides a little against an invisible spring, then pushes the ball away. The
word itself visibly yields and recovers. Other words remain stable. A glancing
contact produces a smaller response than a direct hit; no random effects.

After: the original sentence remains readable. The ball loses energy after a
small number of rebounds and comes to rest. Replay is available by catching the
ball where it rests; a quiet reset restores the launch composition. No teleport
or automatic new round.

Why it fits: it is literal wordplay and a modest personal statement, not a
claim that the toy demonstrates business impact. The word actually pushes back.

Risk: the line can sound defensive or combative. Two reviewers preferred other
directions on this basis, and the adversarial reviewer rated it weakest. Soft,
responsive motion cannot completely remove a language risk. The user should judge
the tone directly before implementation becomes permanent.

## Direction B: It looked simpler in the sketch.

At rest: the phrase is readable, with “simpler” positioned in the ball's path.
On contact, that word lifts slightly, revealing the small annotation “In practice.”
It returns when motion settles. The ball and type have a real, comprehensible
collision rather than a staged failure of an inaccurate trajectory preview.

Why it fits: dry humor about the difference between an idea and its working
implementation. It adds personality beside a declarative headline.

Risk: it can sound like an excuse for poor planning. A fake prediction that
deliberately proves wrong would undermine trust, so do not implement that proposed
variant. Avoid sketch textures that introduce an unrelated visual language.

Assessment: strongest tonal alternative, weaker literal relationship between
the phrase and a bouncing object than A.

## Direction C: A small change.

At rest: the headline sits above three connected words, “Layout. Logic. Language.”
A ball contact shifts one word, subtly redistributing the other two without
changing reading order. The whole arrangement finds a new, equally readable
balance. A short response, “More than one thing,” can appear after contact.

Why it fits: it points toward end-to-end contribution and interdependent decisions.
It does not frame design, engineering, or product as isolated boxes.

Risk: the relationships can be arbitrary, and the explanation can become more
interesting than the effect. Do not deliberately make the initial arrangement
bad merely to manufacture an improvement. Of the three, this costs the most
layout/collision work and has the highest risk of becoming a miniature lecture.

Assessment: promising for a deeper project page; less economical in a hero tile.

## Alternatives not advanced

- “An idea you can get your hands on”: pleasant and credible, but the ball's
  relationship to the words remains weak.
- “Small decisions change how it feels”: input strength supports the statement,
  but it still reads like a caption for a physics demonstration.
- Three product/design/engineering questions turning into answers: informative,
  but too much text and little need for a catapult.
- A Save button annotated from product/design/engineering perspectives: more
  concrete, but competes with actual controls and belongs in a case study.

## Mechanics contract for the next experiment

Use one simulated ball with circle collision against the tile and fixed word
collision bounds. A word's visual spring offset must not feed back into unstable
layout measurements. Do not simulate a pile of letters.

The pull-to-launch relationship must be predictable, with a maximum pull radius,
minimum intentional-drag threshold, and speed cap. Preserve the initial grab
offset. The ball launches from its release position, not from a teleported socket.
Use time-based damping and bounded integration steps. Wall impacts reflect only
incoming velocity and lose energy. Pause on hidden tabs and clear accumulated time
on return. Never let the ball escape or bounce forever.

Initial parameter ranges from the physics review are exploration values, not
validated physics: wall restitution 0.65–0.8, pull radius about 45–80 CSS pixels,
with launch speed and radius scaled to the actual available field. Tune mobile
separately; copying desktop speed into a narrow tile produces frantic motion.

## Access and responsive behavior

- The ball is a real focusable control with a stable accessible name and at least
  a 44px target. The visible lime object can remain smaller.
- Enter/Space starts aiming; arrows adjust a bounded pull; Enter/Space fires;
  Escape cancels. Tab always leaves. Do not intercept arrows outside aim mode.
- Touch scrolling works everywhere except the active ball target. Pointer cancel,
  lost capture, or deactivation cancels without an accidental launch.
- Readable copy and navigation never require play. Decorative word transforms do
  not change accessible reading order. No frame-by-frame live announcements.
- Reduced motion preserves the interaction's editorial result through immediate
  contact emphasis and static displacement, without flight or rebounds.
- Mobile uses deliberate line breaks and small word displacement, not scattered
  lettering. Keep the ball away from the reading area when idle.

## How to decide, without repeating the mistake

Prototype A first at neutral fidelity, on the isolated preview route. Show the
actual sentence, launch, contact, word response, settle, and reset together. No
new assets or polish pass until that sequence is legible.

Ask the user after an uncoached attempt:

1. What did your action change?
2. Does the copy feel natural, or like a joke written to justify the toy?
3. Would you keep this beside the real headline if it were completely static?

Reject the concept if the ball and copy feel independent, aiming is frustrating,
text becomes unreadable, or it needs a narrated explanation. A second attempt
should show consistent cause and effect, not simply replay a canned sequence.

Any numeric comprehension threshold suggested by an agent is a proposed study
criterion, not evidence collected here. No user testing occurred in this pass.

The next step is one editorial choice, then one causal prototype. Do not build
all three or call any of them successful based only on lint, physics checks, or
agent approval.
