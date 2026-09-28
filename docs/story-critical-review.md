# Story correctness review and next-pass proposal

28 September 2026. Baseline: `97bd492`, `feat/interactive-story`, live preview at `http://127.0.0.1:4182/story`.

## Scope and evidence

Read `app/story/BRIEF.md`, `DESIGN.md`, all three parts of `docs/story-research.md`, the earlier 39-scene fleet summary, and the second design audit at `~/.gstack/projects/mukulchugh-mukulchugh.com/designs/design-audit-20260928-story/review.md`.

The old scores describe an earlier build. They are not current scores. Before changing code, captured all 39 beats at both their midpoint and entry boundary on desktop 1440×900 and phone 390×844: 156 frames, plus 78 reverse positions. The fresh baseline is `.impeccable/review/story-critical-before/`. Final captures are under `.impeccable/review/story-critical-after/`; focused browser evidence is under `.impeccable/review/story-critical/`. These local evidence directories are ignored by Git.

The baseline already has per-beat weights, a 20/60/20 arrival/hold/departure schedule, people in the middle chapters, separate adult settings and a mentoring pair. Do not reapply the old global-progress rewrite or assume those improvements are missing. The current issue is that many of those distinct settings still look and behave alike.

## A. Confirmed correctness fixes

| Requirement | Fresh finding and change |
| --- | --- |
| Pause and resume | Ordinary playback was pausable. In the last beat, pressing Pause could call `seek(0)` before stopping. Restart now occurs only when playback has actually completed and the user chooses Play. No scene animation runs on an independent idle clock. Native pixel rounding was also being fed back as a new pose after seek/pause; programmatic scroll echoes are now ignored, while actual user movement is sampled. |
| Rotation | Reproduced exactly: 320×568 ending at progress 1 became approximately 0.733950 after 844×390 rotation. `sample()` now retains raw input position separately from smoothed camera progress. Resize restores that value and never reads a newly clamped `scrollY`. A sample that observes changed viewport dimensions reconciles geometry first. Seek and playback also update that authoritative input position. |
| Year/chapter landing | 2015 landed on `adsense:themes`, 2021 on `avalon-voices:product-experiments`, and 2025 on `kubecon:swiggy`. Jumps now address a composed hold. Year navigation finds a hold within the selected calendar year, preserving all 23 years without inventing annual milestones. Targets leave room for scroll-pixel rounding. Native scrolling still visits all transitions. |
| Reading-column framing | A navigation fix alone does not protect intermediate frames. Desktop framing now fits visible geometry from both adjacent places into the region left of the text, including the copy's departure offset. Fog distance follows camera pullback so safe framing cannot fade both places away. Geometry remains full-bleed rather than being sliced by a scissor at the column edge. Portrait viewport boundaries also include the copy's arrival/departure translation, preventing scenes from entering its moving text area. This is a correctness constraint, not the final cinematography. |
| Focus at ends | Reproduced Previous dropping to `body`. Previous/Next use guarded `aria-disabled` states so they remain focusable at the limits. Chapter stepping uses semantic chapter indices. |
| Focus on disappearing actions | Restart and project links were already guarded. The ending guard missed the reverse threshold just before 0.985 while the semantic beat was unchanged. It now uses actual ending visibility. Changing between motion and reading mode also transfers focus from an unmounted control to the surviving presentation's h1. |
| Sticky overlays | Short landscape exposed a source button under the dock. The copy column now scrolls within the space above it. An invisible full-width part of the memories row also intercepted source controls: the row no longer receives pointer events, while its button remains interactive. Dialog scroll padding reserves space for the sticky Close button. |
| Reading alternative | Reduced-motion/no-WebGL/no-JavaScript articles lacked work/contact exits and used h3 after h1. Standalone sections now use h2; the dialog keeps h3 under its h2. Both reading surfaces finish with Explore my work, Let's talk, then the Dad callback. |
| Rendering defects | HeroApp's logo is now in its own set, without the unrelated portfolio page. The cable is a child of the dongle. Altr's links have a 24px horizontal gap. The phone ending hint is hidden, clearing the memories chip. These fixes predate this pass and were confirmed in fresh frames. Desktop fit additionally protects the ending monitor and figures at the left edge. |
| Reversibility | The render path assigns scene state from progress; it has no elapsed-time/random animation. The fleet check now compares settled scene pixels after forward and reverse traversal, instead of merely checking matching beat IDs. |
| Contract | The build remains 39 beats, 12 chapters, 23 calendar years and 237,100ms of playback, including an 18,000ms ending. No script, beat count or playback weights changed in this pass. Both contract documents record these values; the critical checker checks them. |

Commands: `bun scripts/check-story-critical.mjs`, `bun scripts/check-story.mjs`, and `STORY_CAPTURE_DIR=.impeccable/review/story-critical-after STORY_CAPTURE_ONLY=fleet bun scripts/check-story.mjs`.

Verification: the 8 critical browser groups and 22 existing browser regressions passed, with no application runtime errors. This includes all 23 year jumps, 12 chapter jumps, 195 beat/viewport focus checks, both rotation directions and URL-bar-sized height changes from beginning/middle/end, ending pause, live reduced motion, no JavaScript and no WebGL. The final geometry pass also passed: 156 hold/boundary captures and 78 forward/reverse hold comparisons, with no runtime errors. Reverse comparison permits fewer than 0.05% of channel values to differ by more than 4/255 after exact progress settlement. Final fleet evidence: `.impeccable/review/story-critical-after/fleet-checks.json`. TypeScript, lint (207 files), CSS usage (269 classes), dead-source checks and the production build passed. The build generated 68 routes and validated 1,146 asset references across 61 pages. Browser emulation does not certify physical iPhone/Safari toolbar behavior, screen-reader output, sustained GPU performance or final art quality.

## Re-reading the 39 scenes

Each row refers to both current desktop and phone hold captures, with adjacent boundary captures used for continuity. “Proposal” means no story or art change was applied here.

| Beat | Current evidence compared with the old findings | Remaining design/editorial input |
| --- | --- | --- |
| 1 Dad opens the world | Descent, room, father and child present. Stable right-hand desktop copy. | The midpoint is still a broad town view. A finished opening needs a deliberately timed intimate arrival; merge the duplicated written setup. |
| 2 Google | Father and child fit the reading hold. | Strong composition to preserve for the mentor echo. Gesture and face detail need authored art. |
| 3 Search | Child and computer stay present. | Search card feels like a label rather than a consequence of the child's action. |
| 4 Games | Child remains at CRT; jet emerges above it. | The small plane alone does not evoke years of exploring games and Windows. Use a few recognizable, public-safe activity details. |
| 5 Cousin/TV | Two figures and TV are present; no abrupt world replacement. | Bodies/clothing remain similar and gestures stiff. Distinguish the cousin without inventing a likeness. |
| 6 Repair shop | Mandal, child, shelves and store identity remain. | Make watching and explaining readable through hand/eye poses; preserve “nerves of a computer.” |
| 7 Dismantling | Parts separate on the bench; diagnostic screen is distinct. | Give the components clearer visual hierarchy in finished art, without replacing this owner-requested mechanic. |
| 8 Communities | Seated figure is visible; no left-edge loss in the hold. | An almost empty desk cannot communicate lively groups and conversations. |
| 9 Teenage making | Teen and genuine early-blog capture remain at the CRT. | Preserve this specific scene; a rebuilding action can supply its turn. |
| 10 Rebuild | Writer stays visible beside the page. | Same set as 9; hosting failure/rebuild is stronger than another generic “make/learn” heading. |
| 11 Interviews | Guest and writer are visible. | Long heading and small phone composition; show the exchange, not another title card. |
| 12 Earnings | Seated writer remains with approximate AdSense amount. | Do not call it the first earning or conflate it with Octane sales. |
| 13 Themes | Person and page fit. New year jump is settled. | Actual capture is the Duke announcement, not proof of a customer's site. Preserve provenance. |
| 14 Nearby businesses | Client and counter now exist. | Needs a more recognizable small-business exchange, not a new generic office. |
| 15 Recharges | Writer, dongle and attached cable remain together. | The dongle is visually minor; one purposeful handoff could carry the idea. |
| 16 Beximo | Collaborator is present, correctly framed. | Different responsibility still looks like the same desk. |
| 17 HuntIT | Physical town, teams, clues and trails present. | A worthwhile set piece. Clearer organiser/team distinction and a closer phone shot would help. |
| 18 Laptop | A laptop replaces the CRT; YouTube rig is withheld. | Laptop and next beat remain very similar shots; candidate for a combined passage. |
| 19 TheTechSire | Camera rig appears in its own beat. | A visibly active recording process would be stronger than a tripod behind the same seated pose. |
| 20 QSolve | Separate place, figure and restrained phone scale. | Placard carries most of the meaning; explain the app without inventing a use case. |
| 21 SPARK | Populated campus, registration and activities remain through hold. | Keep the participant-demand-to-bigger-event causal link; no invented attendance or year suffix. |
| 22 Car/college | Arrival and departure geometry present, with a reversible journey. | Safety fitting makes the wide departure more distant. It needs an authored tracking shot around the person, not a still parked-car impression. Dad at departure remains unconfirmed. |
| 23 College | E-Cell sign, colleague and table are present. | A generic office weakens the sense of a new campus. |
| 24 Digital Moshai | Genuine capture, maker and stable hold. | The body explains the work well; avoid another screen-substitution scene. |
| 25 Avalon | Host, microphone and surrounding nodes present. | Nodes still resemble beads. Hosting should read as an action with an audience. |
| 26 Experiments | Figure and project sheets are present; HeroApp is separate. | A list of names supplies little consequence; some leftover prop shapes read ambiguously. Prioritize a true outcome if known. |
| 27 HeroApp | Logo readable, colleague/phone present, no false source link. | Co-founding needs a purposeful shared activity and a concrete public-safe outcome. |
| 28 Flight | Departure, takeoff and cabin poses exist; vertical phone route intact. | A long runway dominates the wide shot. Author a closer takeoff-to-window sequence that keeps Mukul's presence legible. |
| 29 Zenduty team | Several distinct people and work surface. | Their poses still look arranged rather than collaborative. |
| 30 Engineer | Supported laptop and distinct work screen. | Candidate to join the team/growth passage; caption still anticipates speaker/writer material. |
| 31 Talk | Speaker, smaller laptop, audience and projection are visible. | Better than the old floating microphone; gesture and audience attention need refinement. |
| 32 Mentoring | Adult/intern pair and modern display echo the opening. | This is the emotional payoff to develop, not a missing scene to invent again. |
| 33 KubeCon | Host, visitors and booth present. | Conversation/activity can replace the posed group. |
| 34 Swiggy | Dedicated room/collaborator; no early Quivly reveal. | Show the actual kind of product work, not just the Pyng label. |
| 35 Quivly | Dedicated room and correct first-engineer copy. | The career turn lacks the owner's reason/risk; do not fabricate it. |
| 36 Public tools | Screens and inputs have support; person fits. | The cursor crossing devices is the useful action. Make that causal change visible without a prop inventory. |
| 37 Altr | Own room, inspected capture, visible project/source gap. | Public portfolio artwork is not the app UI. Candidate to combine with the tool-making passage. |
| 38 Tethr | Planning sheets, figure and distinct place; copy says what it does. | A planning action would differentiate it more clearly from Altr. Preserve private-alpha status. |
| 39 Still building | Person, work/contact/restart actions and last Dad line remain. Monitor/copy separation protected. | Focus on the adult's face and hands; fewer equipment details, stronger echo. Keep its long hold. |

## B. Prioritized improvements for approval

These are proposals, not requirements extracted from the research. None is implemented by this correctness pass. Effort ranges below are planning estimates in focused working days, not delivery commitments. Authored asset work assumes a 3D artist and an engineer; its cost is different from procedural blocking.

### 1. Shape the story around a change in responsibility

**Proposed spine:** someone showed me how to explore; I learned by trying and breaking things; eventually other people depended on what I could make and explain. This is an editorial interpretation of the existing memories, not new autobiography.

Three movements: **a door opens** (Dad, games, repairs), **I make things for others** (publishing, clients, physical events), **the responsibility grows** (teams, teaching, first engineer, personal tools). Keep the school events: HuntIT leading to participant-requested SPARK is one of the clearest real cause-and-effect sequences. Give hosting failure/rebuilding visible weight. Ask what actually changed when joining Quivly before writing a dramatic founder turn.

Test five potential merges: 1+2; 9+10; 18+19; 29+30; 36+37. That would produce a 34-passage draft, not an arbitrary cap. Preserve the distinct memories and sources in reading mode and keep every year addressable. Keep interviews, the physical events, the voice community and mentoring distinct because they change the relationship to other people.

**Reasoning:** the middle currently records activity more often than change. Fewer scene resets give consequential moments more time without deleting history. **Research:** Part C, [McKee's scene-turn principle](https://mckeestory.com/do-your-scenes-turn/), and the memoir examples' concrete decisions and outcomes. McKee's dramatic standard is useful as an editing question, not a license to invent conflict. **Impact:** highest narrative gain; less repetition and clearer career stakes. **Effort:** 1–2 days for script and beat map, plus owner facts and approval.

### 2. Approve one finished visual sequence before a full asset pass

Make a short representative sequence containing the 2004 room/lesson, repair work, and the adult mentoring echo. Approve child/adult proportions, recognizable expressions, hand contact, worn plastics, cloth, wood and light on both desktop and phone. Use restrained stylization with credible materials and poses, rather than adding detail to the current rounded blocking figures. Keep the portfolio's type, logo and warm accent identity.

**Reasoning:** this proof covers people, two kinds of room, an object interaction and the central emotional motif. It lets Mukul judge the actual moving result before funding all rooms. **Research:** Part A, [Lusion's authored asset approach](https://lusion.co/projects/my_little_story_book/); the Bruno Simon/Jesse Zhou case studies' deliberate material and baked-light choices. **Impact:** largest visual-quality gain and a clear approval benchmark. **Effort:** approximately 5–10 artist/engineering days for the proof; estimate the remaining production assets only after approval. No PS5-quality claim from placeholder meshes.

### 3. Give each chapter a verb and evidence-bearing objects

Plan activity before furniture: **repair** a machine; **exchange** questions online; **publish** and rebuild; **hand over** client work; **organise** four trails and a festival; **host** voices; **debug** with colleagues; **explain** beside an intern; **plan** a product. Keep real website captures as artifacts visitors can inspect, rather than using them as the only change between desks. Objects should imply use and time. Do not add unremembered keepsakes to force continuity.

**Reasoning:** nearly identical walls, chairs and rear-facing figures make different kinds of work feel interchangeable. The current separate sets solve identity, but not behavior. **Research:** Part C, [Worch and Smith on environmental storytelling](https://www.worch.com/2010/03/11/gdc-2010/), plus the documented *Unpacking* object-continuity examples. **Impact:** high; memories become recognizable without reading every label. **Effort:** 2–3 days to storyboard representative actions, then roughly 1–2 weeks of staged/rigged asset work after the art proof. Overlaps with item 2, not additive by default.

### 4. Author travel around the person and the place change

Use three camera scales: intimate lesson/workshop; medium collaboration; wide departures/events. Reserve large outward arcs for changes of place. Track the car's passenger before the campus reveal; follow takeoff toward a window-seat composition; use the same hand/screen relationship for Dad and mentoring. Keep the existing progress-based, reversible path and native input. Do not introduce forced snapping or a new scroll engine.

For desktop, replace safety-driven wide pullbacks with authored composition that naturally fits the protected reading region. For portrait phones, stage the action below the copy rather than simply shrinking the desktop diorama. Treat portrait tablet as its own composition decision; the 768px right-hand column is technically usable but cramped.

**Reasoning:** the new safe framing prevents collisions, but its car/flight wide shots show why automatic fit cannot replace cinematography. **Research:** Part A, [Santamaria's recurring character and connected camera journey](https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/); Part B, [The Pudding's meaningful mobile transitions](https://pudding.cool/process/responsive-scrollytelling/). Borrow composition and continuity, not Santamaria's input interception. **Impact:** high spatial continuity and better phone readability. **Effort:** 2–4 days for a desktop/phone animatic using the approved staging.

### 5. Set a reading rhythm after editing the script

Retain one schedule for scroll and playback. Test ordinary passages around 240–260ms per visible word, then explicitly budget recognition time for the workshop, HuntIT/SPARK, departures and mentoring. Measure the resulting total after merges; do not promise a two-minute film while keeping four minutes of content. Preserve the 18-second ending until a live read justifies changing it. Make titles carry the emotional turn, body text carry the event, and reading text add a new detail.

Use a deliberate light progression tied to place and mood: daylight at home, warm workshop, paper/screen light during publishing, open campus daylight, flight blue, cooler shared work, warm ending. Current background tints exist already; the next gain is lighting/material treatment, not adding more colors.

**Reasoning:** the current 200ms/word formula allows little looking time, and many broad headings repeat “making/learning.” **Research:** Part B's reading-rate evidence and The Boat's content-sensitive pacing; [Bostock's native, reversible scrolling guidance](https://bost.ocks.org/mike/scroll/). **Impact:** medium-to-high comprehension and less fatigue. **Effort:** 1–2 days after script approval, including live reading and phone review.

### 6. Make the ending complete the lesson

Keep the requested adult working at the desk, “Still building.”, useful exits, and “It started with my dad.” last. Reframe around the adult's face/hands and one purposeful interaction. Echo the opening's light and gesture through the earlier mentoring beat; the final room should feel like a life continuing, not an equipment reveal. Do not add Dad to 2019 or claim he bought the laptop without confirmation.

**Reasoning:** the payoff is already in the story; repeating it through action is stronger than adding another sentimental paragraph. **Research:** Part C's environmental storytelling and retained-object/gesture continuity, plus Part A's recurring-character precedents. **Impact:** high emotional payoff with little additional copy. **Effort:** 1–2 days of shot/pose refinement once the adult character is approved.

### 7. Add one quiet orientation cue; prepare launch metadata later

Propose a compact chapter label and “about 4 min” beside the opt-in Play control, adjusted to the eventual duration. No second navigation panel. Reading mode could open at the current memory with a clear route back to the beginning. Before an approved public launch, provide story-specific canonical/social metadata and artwork, then decide indexing/navigation deliberately.

**Reasoning:** year alone does not explain the difference between 12 chapters and 39 beats. The current noindex isolation is intentional. **Research:** Part B's navigation research and the second design audit's observed navigation/share issues. The research does not justify a large progress dashboard. **Impact:** medium orientation/discoverability; launch metadata matters when sharing publicly. **Effort:** about half a day for the cue and reading anchor, plus half a day for metadata after artwork approval.

## Recommended approval order

Approve the script/beat-map proposal first, then a concrete moving art proof. Use those to price and approve the full character/environment pass and authored camera work. Do not expand the current procedural prop collection while these decisions are open.

Facts that would sharpen the script: Dad's actual involvement in repair visits, the first laptop or leaving for college; the reason/risk behind the Quivly decision; public-safe outcomes from early product experiments. Unknowns stay unknown until confirmed.
