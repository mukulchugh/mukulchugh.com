# /story: high-fidelity production plan

Updated 29 September 2026 for the owner's vertical-flow correction. Planning baseline: `8685268`, following the critical fixes and the complete script draft. The owner requested an end-to-end high-fidelity plan and approved including paid assets **for review**, not purchase. Original builds may replace paid candidates after the owner reviews the options.

**Target:** a continuous, inhabited 3D memoir with mature characters, convincing materials and deliberate cinematography. Every passage needs a finished action, setting, transition and phone composition. The production standard applies to the middle of the story as much as the opening and ending.

This is a production plan and asset audit. It does not claim that models have been purchased, characters have been rigged, or high-fidelity scenes have been built. No application code or runtime assets change in this pass. [PR #18](https://github.com/mukulchugh/mukulchugh.com/pull/18) is open and ready for review; the proposed script and final-art work still have their own approval boundaries.

## 1. Scope and visual authority

Use the [34-passage script and storyboard](story-script-storyboard.md) as the proposed production breakdown. The live build still has 39 beats. The mapping below accounts for all of them, so this plan remains useful if the five proposed merges are revised. Do not implement the merges merely because they appear in this document.

Preserve the owner's decisions: Dad in 2004; substantial childhood exploration; Mandal uncle at Uttaranchal Computer; teenage work at the white CRT; real pages; physical HuntIT and SPARK; car travel to college; flight to Bangalore; mentoring; the Quivly role; Altr → Tethr → adult working. Dad's later personal moments remain outside this story. Story travel is vertical on desktop, tablet and phone, with inward and outward camera movement for depth. This supersedes the earlier desktop sideways direction. Own M, Syne/Geist and restrained terracotta/copper identity remain. One visible laptop at a time. Phones stay handheld scale.

The accepted v4 stills are composition references. Their warmer human attention and material detail are useful; their incidental typography, green controls, anatomy and invented historical UI are not new authority. The later aerial opening, smaller headings and current palette override those details. The current procedural figures are blocking assets. Neither they nor a more polished flat image are substitutes for authored moving characters.

**High fidelity here means:** believable proportions, eyes following an action, hands meeting surfaces, feet bearing weight, distinct body language, scale-correct wear and texture, light motivated by a room, and camera choices that explain what is happening. It does not require photoreal facial pores, a huge polygon count or a full game engine. The PS5 references establish ambition for staging and continuity; they are not a measured browser-quality guarantee.

## 2. What actually exists

Audit scope: `public/`, `app/story/`, the portfolio pack's brand folder and the story handoff's concept/model paths. Read `story-scene.ts`, `provenance.json`, `docs/artwork-provenance.md`, current script and design contracts. Compared the accepted opening still with the latest local desktop opening and phone ending captures. The captures are from the completed critical pass; this planning pass did not rerun a live 39-scene audit.

| Material | Verified current state | Production consequence |
| --- | --- | --- |
| Story code | Three.js procedural geometry, shared primitive helpers, generated canvas surfaces, `MeshStandardMaterial`, `RoomEnvironment`, texture loading and progress-driven staging. | Reuse the renderer, navigation, progress model and regressions. Replace selected art and shot authoring; do not rebuild the website framework. |
| Authored model files | No `.glb`, `.gltf`, `.fbx`, `.obj`, `.blend`, `.ktx2`, `.hdr` or `.exr` found in the checked runtime/story asset and selected handoff/brand folders. | Final characters, rigs, environments, material masters and animation clips are **not on hand**. This is real production work. |
| Seven page captures | All present, all 2880×1800, with provenance in `app/story/provenance.json`. Combined encoded size: **944,464 bytes**. | Good evidence source files. Produce smaller scene-display derivatives and retain originals for inspection when appropriate. |
| Personal M | `logo-black.webp` and `logo-white.webp`, both 955×888. | Reuse the supplied mark. Seek an original vector only if needed; do not generate a replacement logo. |
| Mukul portrait | `mukul-original.webp`, 2430×2430. | Reference for the adult's approved stylisation. It is not a child/Dad/cousin likeness or a reusable 3D head. |
| Experience logos | HeroApp, Zenduty, Swiggy, Digital Moshai and several others are 128×128 WebPs. Quivly has an ICO. | Fine for small existing placements; insufficient to assume sharp large booth signs or closeups. Source official higher-resolution/vector masters where needed. |
| Logo provenance | `docs/artwork-provenance.md` points to `public/design/brand/SOURCES.md`, but that file is absent in this checkout. The same doc already records missing per-file sources for several brand images. | Restore source records as each mark enters the final asset ledger. Do not claim blanket source clearance from an absent file. No unrelated provenance repair performed here. |
| Project artwork | Existing generated project illustrations are documented as illustrations. | Never relabel them as product UI, delivered client work or historical screenshots. |
| Concept renders | Opening, making and mobile stills exist in the private handoff. | Direction references only. They contain no reusable mesh, rig or animation. |
| Authoring tool | `blender` is not on PATH and `/Applications/Blender.app` was not found. | Set up a verified authoring toolchain during production or use an artist's toolchain. Do not promise local Blender exports already work. No software was installed. |

Texture memory needs separate attention from download size. Seven 2880×1800 RGBA8 textures would occupy approximately **138 MiB without mipmaps**, about **185 MiB with a full mip chain**, if all were resident. This is a dimensional estimate, not measured GPU allocation. The current encoded files being under 1 MiB together does not make their runtime footprint small.

### Existing evidence assets

| Evidence ID | Existing path under `public/story/` | Use in proposed passage | Boundary |
| --- | --- | --- | --- |
| R01 | `tech-knowledge-providers.webp` | 07 | Early blog capture, not a new screen design. |
| R02 | `blogging-orb.webp` | 07 | March 2014, before the later hosting disruption. |
| R03 | `duke-2015.webp` | 10 | Duke announcement; not a customer's finished site. |
| R04 | `digital-moshai.webp` | 20 | Public studio page and period wording. |
| R05 | `portfolio-2021.webp` | 22 / optional inspection | Personal portfolio, not HeroApp UI. |
| R06 | `altr-2026.webp` | 32 | Public project page containing illustrative artwork. |
| R07 | `tethr-2026.webp` | 33 | Public project page; private-alpha stage remains explicit. |

## 3. Production asset packages

These packages group work and reuse; they are not a proposed runtime framework. Except for the evidence/identity files identified above, **every package currently needs authored work**. A pack's meshes may be reused, but each scene still gets its own composition, pose, material variation and light. Reuse cannot mean another identical desk with different text.

| Pack | Deliverables to create or source | Build/source decision | Completion requirement |
| --- | --- | --- | --- |
| A01 · Mukul | Child, early teen, late teen/college and adult proportions; hair, clothing, hands, eyes; exportable rigs. | Custom characters, optionally starting from a licensed base mesh. The supplied portrait informs the adult only. | Consistent identity across ages; no head-scale shortcut for aging; approved seated, standing, reaching and close-hand poses. |
| A02 · Dad | Adult figure, clothing, articulated hand and upper body, attentive gaze. | Custom illustrative figure. | Shared lesson believable from front, three-quarter and portrait views. No invented likeness or dialogue. |
| A03 · Mandal | Natural stocky adult, working clothes, articulated hands, working/seated poses. | Custom illustrative figure. | Skilled, attentive technician; no caricature, costume or accent based on ethnicity. |
| A04 · Other people | Distinct cousin, adult intern, clients, collaborators, organiser and participant variants. | Shared rig family with genuinely different proportions, hair, clothing and pose combinations. | No adjacent clones. Foreground people have useful facial/hand detail; background cast can use simpler exports. |
| A05 · Home architecture | Cutaway room, doorway, window, plaster, floor, chair, small storage, generic TV and era variations. | Custom modular room with licensed material inputs if useful. | Camera openings authored; no wall removed only after collision. Home feels inhabited without invented personal photographs or keepsakes. |
| A06 · Town and sky | Low-rise roofs, road/threshold sections, distant vegetation, clouds and aerial-to-room approach. | Custom layout, generic architectural modules; original layered cloud treatment. | Rudrapur-inspired rather than exact geography. Depth remains real; no giant flat concept image. |
| A07 · Repair shop | Bench, shelves, parts trays, boxed deliveries, spare monitors/cases, diagnostic surface and showroom depth. | Custom arrangement; common hard-surface props may be adapted from licensed sources. | Supports two people and clear work area. Used and new stock read differently; no junkyard treatment. |
| A08 · White computer | CRT with separate display/glass, TVS-inspired keyboard, mouse, tower, removable panel, motherboard, RAM, fan, connectors and grounded leads. | Original hero assembly. Purchased CRT can supply a mesh base after inspection. | Plausible early-2000s machine; interactive parts named, pivoted and separable; case and connectors stay coherent during explosion. |
| A09 · Publishing surfaces | Page planes, editor illustration, layout blocks, articles, papers, notebooks and clipboard geometry. | Original neutral graphic surfaces plus R01–R03. | Public text comes from selected evidence or current story copy; no simulated recovered admin UI. |
| A10 · Small-business/editorial place | Counter, doorway, shelves, review surface, contributor pages and supporting chairs. | Custom scene dressing from shared architecture. | Business exchange and collaborative editing have distinct staging; no invented client trade or branding. |
| A11 · HuntIT | One mall and two township-inspired sections, registration, four trails, clue sheets, organiser/participant staging. | Original event environment and prop pack. | Physical participants and understandable routes. No invented riddles, sponsors, treasure or attendance total. |
| A12 · SPARK | Campus sections, registration, activity zones, generic sponsor-board structures, laser-tag props and event signage. | Original environment; shares structural modules, not the HuntIT layout. | Whole-campus scope reads while Mukul's organising action stays visible. Only supplied event words become lettering. |
| A13 · Laptop/video | Generic first laptop with lid hinge, bag/support surface as illustrative staging, camera/tripod geometry. | Original small prop set; commodity model only if it saves work after adaptation. | Carry → place → open → record works with one laptop and contact-correct hands. Recording gear is illustrative, not a historical model assertion. |
| A14 · Handhelds/recharge | Era-appropriate phone silhouettes, modern phone, dongle, attached flexible lead and supported resting positions. | Original economical meshes; phone history informs era cues. | Handheld scale; no detailed product model/year claim beyond confirmed memories. Cable endpoint follows the device. |
| A15 · Car journey | Generic vehicle, passenger seat/window, doors, interior contact surfaces, road segment and campus arrival anchors. | Custom or licensed sedan base with separate doors and editable interior. | Curiosity through a visible passenger; correct scale and door pivot; feet exit without intersecting the sill. |
| A16 · College | Campus threshold, walkway and E-Cell pin-up/review area. | Original illustrative environment. | A new place with people and circulation, not a corporate-office reskin. No degree completion implied. |
| A17 · College practice | Client-review surface, hosting corner, microphone, concept wall and HeroApp testing area. | Shared room modules arranged into distinct activities. | Four visibly different uses: delivery, listening/hosting, comparing ideas, collaborative phone testing. |
| A18 · Flight | Generic airliner exterior, runway/sky segment, coherent window/seat/cabin section and boarding/departure transition. | Custom or adaptable licensed aircraft. Near cabin likely needs custom detail regardless of exterior source. | Takeoff and seated Mukul both read. Exterior/interior window match; no fuselage clipping, luxury-jet fiction or airline branding. |
| A19 · Zenduty/mentoring | Team room, work surfaces, chairs, modern monitors, supported devices and whiteboard. | Custom composition using shared office modules. | Learning/review and mentor two-shot are authored actions. One laptop maximum; modern mentoring display. |
| A20 · Talk | Stage/presentation area, lectern or supported laptop, microphone, projection and audience layout. | Custom set, optional licensed commodity microphone/chair. | Speaker's face and gesture stay clear. Audience listens; no fabricated applause or attendance claim. |
| A21 · KubeCon booth | Counter, display, brand sign, conversation area and visitors. | Custom illustrative booth; upgrade Zenduty mark for close view. | Inhabited product conversation rather than a logo wall. Brand texture sits on its own correctly offset surface. |
| A22 · Swiggy review | Workflow-review room, paper/process surface, testing station and colleague. | Original public-safe staging. | Different layout and body language from Zenduty; no private product screenshots. |
| A23 · Quivly planning | Product-question wall, architecture surface, implementation station and shared review area. | Original staging around the confirmed generalist opportunity. | Mukul visibly moves between decision and implementation. No SF relocation shot or prestige-logo climax. |
| A24 · Public tools | Input handoff between Macs and a video-to-document demonstration surface. | Original explanatory geometry; inspect public screenshots before using them. | Two distinct tool actions with one visible laptop. Keep display endpoints and computers conceptually accurate. |
| A25 · Final workspace | Altr work area, Tethr planning surface and final working room; ultrawide/display variants, chair, lighting anchors. | Original authored spaces using R06/R07. | Altr, Tethr and ending have separate actions/shots. Human face/hands lead the last shot, equipment stays secondary. |
| A26 · Materials/light | Ivory plastic, plaster, wood, brushed metal, fabric, skin/hair/eye materials, glass, paper, sky/environment maps and static light bakes. | Original material direction; CC0 texture inputs where useful. | Materials match across sourced/custom meshes and retain believable scale under the final renderer. |
| A27 · Scene effects | CRT portal, original game-like motifs, abstract conversations/voices, modest screen emission and boundary masking. | Original geometry/shaders only where required. | Effects explain an action, obey progress/Pause and work without sound. No copied game content or long particle interludes. |
| A28 · Evidence/identity | Seven captures, optional new public crops, M/brand source upgrades, source metadata, dates and project-stage labels. | Reuse known files; procure only missing originals/cleared evidence. | Every runtime image has a source and a correct description. No generated logo or invented screenshot. |
| A29 · Alternatives/delivery | Stable scene posters if selected, readable article, audio treatment, credits and release imagery. | Derive from approved final scenes; reuse current reading/control components. | No essential story in sound alone. Reading contains the same facts and exits. Audio and images have explicit provenance. |

### Required animation library

Author small purpose-built clips and reuse them with pose adjustment. Clip reuse must preserve age, posture, contact and gaze. Required families: point/follow/act; type/read/revise; inspect/hand over; carry/place/open laptop; register/give clue/follow trail; coordinate/listen; passenger-look/door-open/step-out/walk; takeoff/cabin-gaze; review/test/explain; host/listen/invite; present/address audience; mentor/withdraw hand; test/consider/adjust at the ending.

Every clip needs an initial pose, contact pose, held pose and release. Hands must meet mouse, keyboard, component, paper and door at their actual transforms. Bake authoring constraints into exportable tracks. Cloth/hair secondary motion must be baked or progress-derived, not nondeterministic runtime simulation. Export deformation skeletons without animator-only control rigs. Background people get fewer bones and modest variations, not dozens of independent full-detail performances.

## 4. Every scene's high-fidelity completion card

Numbers reference the proposed draft. The bracketed numbers are existing runtime beat numbers; all 39 are represented. Every scene inherits vertical chapter-to-chapter travel on all viewports; desktop and portrait notes specify framing, not different journey axes. **Every row below is planned, not final-art complete.** A scene passes only after its listed visual test and the shared acceptance gate in section 9 pass.

| Scene / current beats | Asset packs and evidence | Authored action, camera and light | Scene-specific acceptance test |
| --- | --- | --- | --- |
| 01 · Dad [1,2] | A01 A02 A05 A06 A08 A26 A27 A28. Own M; illustrated search surface. | Cloud descent becomes a child-height two-shot; Dad points, child looks and reaches. Warm room daylight. Portrait descends vertically and holds both faces below copy. | Intimate lesson arrives early enough to read. Fingers touch plausible surfaces; CRT and heads clear the copy; no empty sky tail. |
| 02 · Exploring [3,4] | A01 A05 A08 A26 A27. Original game-like motifs, no gameplay capture. | Approach CRT; small terrain/aircraft emerges into depth while child remains. Return to Windows exploration through screen-anchored layers. | The child never disappears behind the effect. No game edition/year invented; phone framing retains face, hand and bezel. |
| 03 · Cousin [5] | A01 A04 A05 A07 A26. Generic TV prop added to A05; no programme footage. | Shared attention over a small component; TV stays secondary. Warm domestic side light. Portrait uses a compact hand/face triangle. | Cousin visibly distinct; no backyard scene, invented experiment or show card behind a head. |
| 04 · Repair store [6] | A01 A03 A07 A08 A26. Illustrative shop sign. | Pass shelves/new deliveries into close workbench pair. Warm work light and cooler room fill. Portrait shows one shelf and the active bench. | Feels like a repair/sales room, not a floating teardown. Mandal explains; child observes. No fabricated owner/apprentice relationship. |
| 05 · Dismantling [7] | A01 A03 A07 A08 A26. Named case/board/RAM/fan pivots. | Parts separate in useful order beside the pointing hand, then return. Portrait explosion uses vertical space above the bench. | Parts avoid the spare monitor, each other and faces. Assembly is pixel-consistent after forward/reverse travel and distant seek. |
| 06 · Communities [8] | A01 A05 A08 A09 A26 A27. No real DMs. | Read → type → note. Small screen-anchored conversational depth; person in profile. Late-day screen/window mix. | A human exchange is legible without fake messages or participant names. The face remains large enough on phone. |
| 07 · Blogs/rebuild [9,10] | A01 A05 A08 A09 A26 A28; R01 R02. | Teen at white CRT writes, sees a disruption, rebuilds. One short inward move; shift attention with the hands, not a giant flying page. | March capture never presented as post-failure rebuild. Page layers and desk never intersect. Both publishing and recovery remain in the merged passage. |
| 08 · Interviews [11] | A01 A09 A10 A26 A28. Public interview crop candidates. | Preparing a question becomes answering one; exchange staged through surfaces rather than an invented in-person meeting. | Question/answer turn reads through action. No conflicting age headline, fictional quote or fake webcam conversation. |
| 09 · Earnings [12] | A01 A05 A08 A09 A26. Amount in HTML only. | Quiet pause of recognition, then back to the keyboard. Close face/hands; no banking graphic. | About US$100 remains approximate/undated; no first-income, theme-income or recurring-income implication. |
| 10 · Themes [13] | A01 A04 A09 A10 A26 A28; R03. | Adjust layout, hand off a starting point to someone else. Paper and screen at separate depths. | Duke evidence sharp at intended scale; theme construction differs from the blog pose. No invented customer screenshot or sale count. |
| 11 · Nearby businesses [14] | A01 A04 A09 A10 A26. Generic counter and sketches. | Listen across counter, revise, show the result. Doorway gives place; daylight from one side. | Local-business exchange is clear on phone with two people and one sketch. No unexplained generic office or invented brand. |
| 12 · Recharges [15] | A01 A05 A09 A14 A26 A27. No receipt or recovered design. | Send design, attend to dongle, continue work. Close hand/device composition. | Dongle and cable move as one connected assembly; no detached lead or fake transaction. |
| 13 · Beximo [16] | A01 A04 A09 A10 A26 A28. Public byline/poem candidates. | Edit another contributor's work and return it. Shared surface, asymmetrical poses. | Team effort differs from solo writing. Remote collaboration is not falsely documented as a specific shared room. |
| 14 · HuntIT [17] | A01 A04 A06 A11 A26. Original clue-sheet shapes and four paths. | Clue handoff → accompany one team → reveal wider routes → return to organisers. Bright outdoor light. Phone tracks one route vertically. | Four trails distinguishable, organisers distinct from teams; participants are physical. No illegible crowd diorama or invented riddle text. |
| 15 · Laptop/video [18,19] | A01 A05 A13 A26. Channel name in copy; actual footage unavailable. | Carry/place/open; turn toward recording. Seated posture follows actual laptop height. | Lid opens correctly, hands contact, camera rig arrives only with video action. One laptop; channel identity not conflated with Explorar. |
| 16 · QSolve [20] | A01 A13 A14 A17 A26. No verified public app capture yet. | Move from sketch to handheld test. Medium-close view, screen as supporting evidence. | App building is legible without a floating giant phone or fabricated Appstore page. No invented adoption or development method. |
| 17 · SPARK [21] | A01 A04 A12 A26 A28. Text-only SPARK identity unless a real mark is inspected. | Coordinate registration and activities; laser tag and clue handoff happen at separate depths. Campus daylight. | Every hold shows an inhabited festival, not empty travel. Clear callback to demand after HuntIT; no borrowed 70-team figure as SPARK attendance. |
| 18 · Car to college [22] | A01 A04 A06 A15 A16 A26. Generic driver; no family inference. | Passenger at departure → road → campus entry → door → step out → walk. Portrait travel approaches in depth then rises. | Departure is visible before arrival. Passenger remains emotionally legible; door/feet/seat contacts work at slow and reversed scroll. |
| 19 · College [23] | A01 A04 A09 A16 A26. Generic E-Cell design surface. | Join a student review and contribute a revision. Open campus circulation and pin-up composition. | Reads as college, with useful foreground action; no graduation scene or fabricated private invitation. |
| 20 · Digital Moshai [24] | A01 A04 A09 A17 A26 A28; R04. | Brief → design → implementation → review with client. Light travels across one grounded work surface. | Each stage changes what Mukul does. Historic source remains readable, not a new tagline finale. Online-fest evidence stays separate from SPARK. |
| 21 · Avalon [25] | A01 A17 A20 A26 A27. Abstract voice presence, no app reconstruction. | Speak → listen → invite. Intimate lighting and a few spatially separated voice cues. Portrait keeps host large. | Gaze/listening gesture carries the scene with sound muted. No floating bead ring, fictional topic or 200-person session claim. |
| 22 · Experiments [26] | A01 A09 A17 A26 A28; R05 optional. | Compare alternatives, revise one, connect a sketch to implementation. Standing work-wall composition. | Different from another seated laptop. Names are not unverified launch outcomes; portfolio capture correctly described. |
| 23 · HeroApp [27] | A01 A04 A14 A17 A26 A28. Existing logo, higher-resolution source needed for closeup. | Two people test and revise a phone interaction. Compact triangular portrait composition. | Mark has its own plane; no z-fighting with portfolio. Phone, hands and faces do not overlap. No unrelated artifact link. |
| 24 · Flight [28] | A01 A16 A18 A26. Generic runway, exterior and cabin. | Campus departure → accelerating takeoff → window approach → seated Mukul. Cool flight light. Phone rises into depth. | No camera through opaque fuselage; cabin scale matches exterior window. A person anchors the passage; no tiny full-runway tableau. |
| 25 · Zenduty [29,30] | A01 A04 A19 A26 A28. Public mark; neutral work diagrams. | Receive explanation → bring own change for review. Three/four people form a real work pattern. | Intern-to-engineer change shown through activity; no cloned idle lineup. Phone chooses the active pair instead of shrinking the entire room. |
| 26 · Talk [31] | A01 A04 A20 A26 A28. Inspect real slide/title evidence. | Address audience, refer to projection, return to people. Stage light motivated by actual geometry. | Speaker face/hands clear, laptop supported below torso, audience visible. No invented speech, applause or audience count. |
| 27 · Mentoring [32] | A01 A04 A19 A26. Modern display; matched lesson camera. | Point → intern looks → intern acts → Mukul withdraws hand. Warm accent within cool office. | Mirrors 01 through framing and gesture, not a flashback. Two adults, actual hand contact, enough hold for learner's action. |
| 28 · KubeCon [33] | A01 A04 A21 A26 A28. Zenduty sign upgrade. | Visitor approaches, Mukul listens and demonstrates. Warm booth foreground against cooler venue depth. | Booth and visitors clearly present on phone; no empty sign/books substitute. No private customer identity or sales outcome. |
| 29 · Swiggy [34] | A01 A04 A14 A22 A26 A28. Official mark; abstract seller workflow. | Trace onboarding, test a step, review rollout. Distinct room layout and medium collaboration shot. | Role/work legible without employer-scale statistics or private UI. Scene remains populated through outgoing travel. |
| 30 · Quivly [35] | A01 A04 A23 A26 A28. Public company identity; YC announcement as source detail. | Product decision → architecture → implementation. Inward arc links the responsibilities he chose. | Generalist/founding-engineer opportunity reads through action; no three-book tableau, SF relocation or YC trophy reveal. |
| 31 · OpenKVM/ctxr [36] | A01 A14 A24 A26 A28. Public capture candidates only. | Input crosses Mac endpoints; a separate video becomes structured context. Medium-to-close practical demonstration. | Each tool understandable; devices physically supported. Only one laptop even at boundaries. No invented UI or performance chart. |
| 32 · Altr [37] | A01 A25 A26 A28; R06. | Arrange work, test and adjust; closer side view with human hands. | Distinct from tools scene. Source-page and project links remain separated and keyboard-safe; early-access status accurate. |
| 33 · Tethr [38] | A01 A04 A25 A26 A28; R07 plus abstract plan geometry. | Review a proposed change, approve a revision. Shared surface and different shot from Altr. | Human approval is visible; private-alpha status clear. Explanatory document is not represented as real UI. No premature closing slogan. |
| 34 · Still building [39] | A01 A25 A26 A28 A29. One laptop; equipment secondary. | Slow inward approach to adult considering and changing his work. Warm light echoes the opening. Phone uses a medium-close working figure. | Face/hands lead; monitors never enter copy/exit region. Final 18-second hold stops completely on Pause. Work/contact/restart, then Dad's line. |

## 5. Procurement shortlist

**All entries are candidates, not purchased or imported.** Metadata/prices below were checked on primary creator/marketplace pages on 28 September 2026. No candidate's downloaded mesh, animation export or final browser appearance has been inspected. Prices may change and exclude checkout-specific tax/currency costs. A vendor's “game-ready” claim is not our acceptance test.

| Candidate | What the primary source currently says | Fit and remaining work | Decision |
| --- | --- | --- | --- |
| [Blender Human Base Meshes v1.4.1](https://www.blender.org/download/demo-files/#assets) | Blender's demo listing identifies this specific 49 MB bundle as CC0. | Useful anatomy/topology starting point for A01–A04. Still requires original age/proportion choices, faces, clothes, hair, retopology as needed, rigging and performances. Other bundles on the page have different licences. | Preferred free starting-point evaluation; not a finished character solution. |
| [Auto-Rig Pro, Artell](https://superhivemarket.com/products/auto-rig-pro) | Full edition displayed at **US$50**, Lite **US$25**. Full includes retargeting and FBX/glTF export; listing describes multiple licensing components. | Optional authoring aid after a chosen mesh passes the first pose test. It cannot repair poor anatomy, automatic weights or hand contact. Free/custom rigging remains possible. | Paid tool option for review. Prefer Full only if its export/retarget workflow actually saves measured work. No purchase now. |
| [Vintage PC Monitor, Francesco Milanese](https://www.fab.com/listings/806ad990-1834-47be-82fb-10e2eaa728b0) | BLEND/FBX/OBJ/GLB; 30,486 triangles; 2K textures; separate material areas for case, labels, display and glass. Price not exposed in the fetched listing. | Stronger editable CRT candidate for A08. Needs browser reduction, white-plastic treatment, independent screen handling and removal of unsupported historic identity. Tower/keyboard/internals are separate custom work. | Shortlist for price/licence selection and close-shot visual inspection before purchase. |
| [Old PC, dusan.lamos](https://www.fab.com/listings/16889817-baba-4ac6-ae60-aa3bf60c0cb9) | 486-era, high-poly asset; clean/yellowed material variants; separate screen material and editable cables. Price not confirmed. | Can save peripheral/cable construction, but its specific old hardware must not be asserted as Mukul's exact machine. Retopology and re-authoring may outweigh savings. | Alternative, not an additional required purchase. Compare with original A08 modelling. |
| [Sedan V2, LagzDesign](https://www.fab.com/listings/2e944cf8-a301-48ae-b282-3ebe8031d17d) | BLEND/FBX/GLB, opening doors, simple interior and removable fictional badges. Price not exposed. Listing marks AI usage as disallowed. | Useful A15 mechanical starting point. Passenger closeup may need new seat/window details; road orientation and camera must suit the story. Remove invented brand/plate. | Conditional candidate. Confirm relevant use restrictions and web-delivery rights first; no generative-tool upload. |
| [Airliner with cockpit/cabin, alitoons](https://www.cgtrader.com/3d-models/aircraft/commercial-aircraft/airliner-rigged-with-cockpit-and-cabin-interior) | Displayed sale **US$24.50**, regular **US$49**; 28,212 triangles, exterior/interior split, baked animation exports. Flat-shaded appearance; “Royalty Free License (no AI)”. | Could save A18 exterior/door/gear work. Its finish does not meet our target without material and near-cabin rework. Strip unseen cockpit/seating, keep generic identity. | Conditional mechanical candidate, not a visual approval. Resolve restrictions and inspect export before selecting it. |
| [Poly Haven assets](https://polyhaven.com/license) | Downloadable assets are offered under CC0. | Select a small number of specific wood, plaster, fabric and lighting inputs only after A26 look tests. Asset IDs and actual downloads must be recorded individually. | Preferred material/environment source pool; no blanket pack download. |
| [ambientCG assets](https://docs.ambientcg.com/license/) | Downloadable assets and material previews are covered by CC0. | Alternative material source for A26; useful where a surface matches scale and roughness better. | Preferred source pool. A catalogue licence alone does not mean an asset is selected or acquired. |

**Do not buy:** distressed horror CRTs to depict a new white home computer; random prebuilt office packs to solve story staging; 600k-polygon novelty computers; a mature-looking still with no mesh; an Unreal Blueprint whose behaviour cannot be exported; a stock “Indian family” used as claimed likenesses. Cheap assets can cost more to adapt than original work.

For each proposed purchase, present a small concrete approval packet: exact item and seller, selected licence tier, live checkout total, intended scene IDs, preview/wireframe evidence, exported formats, expected adaptation, and a no-purchase alternative. Budget authority does not come from “include paid options.” Never buy, hire an artist or start a subscription without the specific spending approval.

Fab's [standard-licence summary](https://www.fab.com/eula) permits incorporation into projects and compatible tools, while prohibiting standalone redistribution. Confirm the actual selected item's terms before putting deliverables into this public repository or browser build. Keep purchased master files private; publish only permitted project derivatives. A file being technically downloadable in a browser is not a substitute for checking distribution rights. No AI-restricted asset enters a generative service unless its actual terms permit that use.

### Original-build alternatives, after review

The owner explicitly permits building original alternatives after reviewing the options. Paid assets are optional time-saving candidates. An original build means independently authored geometry, materials and animation for this story, not reproducing a seller's mesh from preview images. Review the proposed silhouette, finish, moving parts and in-scene camera distance before committing to either route.

| Asset decision | Original alternative | Relative work and main risk | Recommended review choice |
| --- | --- | --- | --- |
| Vintage monitor / Old PC | Model the white CRT, tower, keyboard, mouse and separable internals as one coherent hero assembly. Develop independent plastic, glass and metal materials. | Medium to high: closeup topology, bevels, connectors and teardown contact need care. Unlike adapting unrelated stock, every part can serve the required animation. | Prefer an original A08 proof because this computer carries several childhood scenes. Compare its moving closeup with the paid candidates before selecting. |
| Sedan | Build a generic passenger car with only the exterior and cabin detail the authored cameras see, separate doors, supported seats and correct passenger contact points. | Medium to high: a convincing body silhouette and door/seat ergonomics are harder than a box vehicle. Camera tests determine which hidden details can be omitted. | Review an original-versus-stock comparison at departure, through the window and during exit; choose by adaptation cost and visible quality. |
| Airliner | Author a generic exterior and matching near-window cabin section, with takeoff control surfaces and a planned transition between them. | High: aircraft proportions, window correspondence, cabin detail and character scale must agree. A convincing exterior alone does not complete the flight. | Compare the full exterior-to-passenger shot, not isolated model renders. Original work remains viable if the stock cabin requires extensive rebuilding. |
| Characters / paid rigging tool | Develop original age variants and performances, optionally using the CC0 anatomy base, with native Blender armatures and baked clips. | Highest art risk: anatomy, skin weights, gaze and hand contact. Coding a rig does not establish mature character quality. Auto-Rig Pro is an optional tool, not a character asset that must be cloned. | Prove child/Dad and adult/intern acting first. Use a paid rigging aid only if it measurably improves the approved authoring workflow. |
| Rooms, furniture and material packs | Author shared architectural modules and story-specific dressing; create original PBR surfaces or adapt individually selected CC0 inputs. | Medium overall, spread across scenes. Reuse saves work only if the places still have distinct layouts, activities and lighting. | Prefer original compositions. Buy a commodity prop only when it saves more work than material/style correction adds. |

I can author geometry, scene integration and animation tooling, then inspect and refine the results in the actual page. Local Blender setup/export is still unverified, and final character performance remains a proof requirement. If a selected asset exceeds the achievable art quality or available tooling, identify that specific gap before recommending a specialist or purchase. Do not replace the approved target with primitive placeholders and call the asset finished.

For an original asset, the review packet replaces checkout details with the modelling approach, editable master/export deliverables, dependencies, effort estimate and concrete visual test. Asset creation starts after the owner reviews that choice. No paid purchase is implied by approving an original build.

## 6. Evidence and graphic-artifact sourcing

Keep real evidence separate from illustration through the whole pipeline. An illustration can explain an event even when no historical image survives; it cannot be made to look like a recovered screenshot or receipt.

| Need | First source | Production action | If no suitable source exists |
| --- | --- | --- | --- |
| Original M | Existing supplied files/private brand pack | Inspect for vector master; otherwise retain the original raster at sensible size. | Use existing mark, never a generated imitation. |
| Employer/project marks | Existing originals, then the organisation's own published assets | Record exact URL, retrieval date, intended placement and permitted derivative. Replace 128px close-shot marks with real larger sources. | Smaller mark or plain factual text, not AI upscaling presented as an original. |
| Blogs/themes | Seven captures and existing archive research | Preserve capture date separately from event date; create screen crops/derivatives without inventing content. | Source inspector can hold the full capture while the scene stays abstract. |
| Interviews/Beximo | Existing public archive captures in the dossier | Select a byline/title crop, inspect names/contact details, avoid disputed ages and unapproved quote length. | Use the supplied factual copy and original generic paper geometry. |
| Hosting failure/rebuild | Existing archive evidence, if a genuine view survives | Check pre/post-disruption chronology. A March capture is not recovery evidence. | Original nonliteral interruption/rebuild action; no fake error screenshot. |
| AdSense/dongle payment | Owner memory | Keep amount/date precision in HTML copy. | No payment/dashboard asset needed. Do not request private statements or search Drive. |
| HuntIT/SPARK | Owner memory and previously retained public records | Only use a real event logo/photo after inspection. Original event architecture and clue-shaped props are sufficient. | Text-only event identity; do not invent riddles, sponsor logos or attendance photographs. |
| TheTechSire | Owner's confirmed channel name; any already-public evidence separately verified | A genuine thumbnail could become optional evidence after attribution/identity checking. | Original recording action; no fabricated video/topic/subscriber count. |
| QSolve | Existing evidence of Appstore review | Inspect any actual public store/UI source before use. | Handheld testing and factual copy, no fabricated app screenshot. |
| Avalon Scenes | Owner memory | Original voice-host staging; abstract audio presence. | No borrowed live interface, participant list, transcript or recording. |
| Talk/KubeCon | Existing public recap/conference records | Verify date and select a cleared slide/title or booth reference. Model the illustrative space independently. | Public title/logo and original event geometry; no invented footage. |
| HeroApp/Swiggy/Quivly | Public portfolio/project/employer material already authorised | Only public-safe marks and broad explanatory diagrams. Quivly YC update uses the linked public announcement. | No private code, customer data, dashboards or unpublished roadmap. |
| OpenKVM/ctxr/Altr/Tethr | Public releases and portfolio pages | Prefer inspected real capture where available; retain early-access/private-alpha descriptions. | Label explanatory geometry as illustration in the inspector, not product UI. |

A final asset record needs: ID, creator/source URL, acquisition date, licence and receipt reference where applicable, source hash, master location, derivative path/hash, scene usage, dimensions or triangle/material/texture counts, alterations, factual status and approval evidence. Store private receipts/master archives outside the public repo. Extend the existing provenance records rather than building a separate asset-management application.

## 7. How authored assets enter the existing experience

### Authoring and export

Use metres and an explicit coordinate/origin convention for all models. Apply transforms before export. Put pivot points at real hinges, joint centres and component insertion points. Name contact targets and important objects consistently, for example the mouse contact, workbench surface, passenger door hinge and display plane. Names are data the scene can address, not reasons to create a generic scene-description framework.

Keep editable masters with modelling, rigging and material inputs. Export tested glTF/GLB runtime derivatives with only needed geometry, textures, skinning and baked clips. Evaluate compression only after a correct export is inspected. Do not assume Blender-only constraints, procedural materials, geometry nodes, hair systems or renderer-specific effects survive glTF. Bake or convert their visible result deliberately.

Import the appropriate addons from the installed Three.js package. `GLTFLoader`, animation facilities and compressed-texture loaders can be added within the existing route; no React Three Fiber migration, second renderer, new scroll engine or editor platform is required. Select one mesh compression method only if measured payload savings justify decoder cost. Use KTX2/Basis for large material maps when the proof demonstrates the benefit; keep archive text legible rather than compressing every image identically.

### Deterministic motion

The existing authoritative story progress continues to drive scene identity, copy, camera and objects. Authored animation is sampled at a time derived from passage progress, not advanced with an independent wall clock. Three.js exposes absolute animation sampling through [`AnimationMixer.setTime`](https://threejs.org/docs/pages/AnimationMixer.html); test the chosen action/weight/loop setup for exact forward/reverse states.

One owner per transform: route travel moves the scene root; an authored clip animates bones/props inside it. Do not animate the same camera root or hand with multiple engines. Define complete poses at every seekable state, including a distant year jump into the middle. Reset absent clip weights/properties explicitly. Baking complex interactions is preferable to runtime physics for this controlled memoir.

Preserve the current 20/60/20 model until the script/timing change is approved. The proposed 5m41s schedule then derives its arrival/hold/departure windows from the same timing data used for scroll and autoplay. No manually placed global-progress visibility thresholds should reappear.

### Camera and composition

Author desktop and portrait camera/target paths together for each scene. The safe reading region remains a hard constraint, but a global bounding-box pullback must not be the primary cinematographer. Define the subject, contact action and near/far environment extent for each shot, including incoming and outgoing frames. A frame should show one leading action, even if both worlds exist during a boundary.

Use three-quarter faces and profile changes to reveal attention. Curves need smooth position and orientation, sensible near planes and bounded acceleration. Avoid sudden roll or lens jumps. The journey follows a vertical route on every viewport. Downward native scroll advances chronologically; reverse scroll retraces it. Depth pushes, pullbacks and local arcs serve the action while the chapter sequence remains vertical. Author desktop and phone framing independently along that shared direction, retaining the right reading region on desktop and the scene below copy on portrait. Short landscape and portrait tablet get reviewed compositions, not a blanket scale-down.

### Materials and light

Start with a small consistent PBR library. Colour images use the appropriate colour encoding; roughness/metallic/normal/AO data remain data, not colour-adjusted images. Let glTF's material configuration inform the loader rather than manually reassigning every texture. Test normals, tangent seams, metalness, roughness and exposure in the actual runtime.

Ivory plastic should have restrained edge wear and subtle roughness, never uniform glossy ceramic or heavy horror grime. Hands and faces need believable shape/gaze more than costly subsurface simulation. Hair can be shaped geometry with controlled highlights. Fabric folds and contact creases matter at the actual camera distance. Ground objects with local contact shadows and motivated light.

Bake stable room lighting where it helps. Keep a limited moving key/contact shadow for people and moving props; do not make every small screw cast a shadow. Background cloud depth can use layered geometry/lighting rather than a heavy volumetric raymarch. Screen emission is restrained. Depth of field, SSAO and bloom are optional after the base image works; they must never blur source evidence, copy or interaction boundaries.

### Loading, failure and memory

Keep the opening's actors and room ready as one coherent package before its 3D reveal. Progressive loading must not expose a missing father, T-pose, grey material, absent wall or empty year. Keep readable story content available while assets load.

Load current/nearby scene packages ahead of travel and prioritise the destination on a distant year jump. Cache shared assets by URL, dispose unreferenced geometry/materials/textures with clear ownership, and budget GPU residency rather than preloading every high-resolution era. A late load must not move the user to a different beat or create a second renderer after retry. Do not remove the outgoing world until the incoming view can render coherently.

Use an approved stable poster or the existing reading alternative if a required package cannot load. Do not silently replace a hero scene with placeholder boxes and report success. Context loss, route exit, rapid navigation, resize and interrupted downloads must release resources and preserve recoverable UI.

### Initial performance budgets to test

These are proposed engineering budgets, not current measurements or promises. Adjust using the actual art proof and named devices; do not lower the visual contract by removing the human action.

| Budget | Starting target | What to change first if exceeded |
| --- | --- | --- |
| Initial 3D payload | At most about 5 MB compressed on phone, 8 MB desktop, excluding existing app code and lazy source inspector | Material atlases, hidden geometry removal, opening-only load scope, compression. Measure decoder cost too. |
| Active triangles | About 150k phone / 350k desktop; brief boundary peaks separately measured | Background detail/LOD, instancing repeated architecture; keep hero face/hands and contact silhouettes. |
| Draw calls | Around 100 phone / 180 desktop during held scenes | Merge static material-compatible parts, instance repeated props, reduce tiny material islands. |
| Texture residency | Aim below 96 MiB for story textures on phone / 192 MiB desktop | Scene-resolution derivatives, KTX2 material maps, release far-away high-resolution textures. Track actual peak. |
| Frame time | Target a 60 Hz experience on supported devices, with p95 frame interval around 20ms or lower during steady travel | Resolution/shadow cost first, then material and draw-call cost; measure thermal stability. Headless FPS is insufficient. |
| Shadows | One principal real-time shadow source; begin at 1024 phone, 2048 desktop | Bake static contact/light; reduce casting to relevant actors/furniture. |
| Pause/reduced motion | No progress-independent ambient motion; reduced motion retains the reading mode with no WebGL canvas | Never trade this contract for final-art ambience. |

If a lower-end device cannot meet the agreed target, offer the stable reading presentation and a deliberate reduced-quality profile that preserves composition. Decide supported-device coverage from evidence before calling the route production-ready. Physical iPhone Safari and an Android handset must be tested; a 390px Chromium window is not a substitute.

## 8. Production order and review deliveries

The phases cover the entire story, with no stopping after 2014 and no blanket “polish later” phase for weak middle scenes. Dependencies matter more than an invented date promise. The names below are work roles, not a claim that external artists have been hired.

| Phase | Work | Concrete delivery | Exit condition |
| --- | --- | --- | --- |
| 0 · Content and staging lock | Review the script, five merges, source precision and timing hypothesis. Confirm all 39 existing memories remain. | Approved numbered scene list, copy and nonliteral staging boundaries. | Owner accepts the content/structure before those changes enter runtime. |
| 1 · Asset proof | Character/rig artist work on A01–A03; environment/material work on A05/A07/A08/A19/A26; motion engineering samples them in the page. | Real moving 01 + 04–05 + 27 at their proper addresses, plus desktop/phone captures and asset manifests. | Owner approves character quality, hand contact, material treatment and continuity; technical checks pass separately. |
| 2 · Shared production masters | Finish age variants, cousin/supporting cast, shared props, materials and export/loading conventions. Evaluate exact paid candidates only where they save work. | Reusable approved model/rig/material masters and runtime derivatives, with source records. | No missing needed rig/prop or dependency hidden in a vendor scene; export and disposal verified. |
| 3 · Childhood/publishing | Finish 01–13, retaining varied spaces/actions and inspected page artifacts. | A continuous reviewed section including all boundaries, desktop and phone. | Every corresponding scene card passes; no placeholder characters outside proof shots. |
| 4 · Events and college | Finish 14–23: both physical events, laptop/video, QSolve, passenger journey, campus, practice, voices and HeroApp. | Event routes and car contact sequence in motion; whole section travel review. | People remain readable at crowd/travel scale; no lost chapter or generic repeated desk. |
| 5 · Work, teaching, continuing | Finish 24–34: flight, team progression, talk, mentoring, booth, distinct roles, tools, Altr, Tethr and ending. | Full 2004–2026 experience at intended quality; separate ending review. | Adult sections meet the same art standard as childhood and have their own actions and environments. |
| 6 · Full-route integration | Final pacing, colour arc, source inspectors, loading/residency, fallback equivalence, copy and focus. | One full guided run plus manually navigated/reversed route at target viewports and devices. | No unfinished row in the scene acceptance ledger; no hidden failure behind a successful build. |
| 7 · Release candidate | Bounded visual/technical review, one consolidated correction batch, confirmation, metadata and launch decision. | Exact commit, reports, before/after captures, real-device profile, attribution and shipping asset inventory. | Owner visual acceptance and explicit release authority. No automatic merge/deployment. |

**Effort:** the first moving art proof was provisionally scoped at 5–10 focused artist/engineering days in the prior proposal. That remains an estimate, not a commitment or evidence that work is staffed. Quote the remaining character/environment/animation production after the proof exposes the chosen quality level and adaptation cost. Paid stock models may save hard-surface construction; they do not eliminate character performance, camera authoring, scene integration or review. This is substantially more work than a CSS polish pass.

For each phase, deliver the actual scene and relevant source assets, not only screenshots. A lighting/render pass cannot mark an unrigged character complete. A static beauty render cannot validate the scroll choreography. A successful model export cannot validate taste.

## 9. Acceptance for every scene and every boundary

Track each of the 34 proposed rows through: **planned → sources identified → assets acquired/authored → exported → composed desktop/phone → animated → technically checked → visually accepted**. “Sources identified” is never recorded as “acquired.” Keep evidence paths and unresolved notes with each row. Current status for all rows is **planned**, with reusable source material as recorded in section 2.

Each finished scene package must provide:

1. Correct visible/reading copy, date precision and source links. No authoring label or private evidence in the experience.
2. A meaningful human action with convincing gaze, posture, hand contact and scale. A scene cannot pass solely because its required objects exist.
3. A coherent room/place with grounded props and enough context at the held shot. The phone still communicates the same action.
4. Final model/material/light quality at actual browser camera distance. No visible blocking mesh, missing map, faceted hero face, material mismatch or upscaled 128px sign.
5. Vertical chapter-to-chapter travel on desktop, tablet and phone, with authored arrival, composed hold and departure on both sides of every boundary. No blank travel, next-era leak, hard swap, opaque camera penetration or clipping into copy.
6. Matching forward/reverse/seek poses, complete Pause, correct resumption, year/chapter composed holds and position-preserving rotation/URL-bar resize.
7. Visible keyboard focus, stable control focus through unmounts, readable HTML, usable source links, dock clearance and equivalent work/contact exits in reading mode.
8. Loading, error, retry, context-loss and route-exit behaviour with no missing hero assets, repeated canvas, leaked resource or fabricated fallback evidence.
9. Recorded payload, draw calls, triangles, texture residency and frame times at the reviewed quality level. Report device and browser; never call an emulated FPS number physical-device verification.

Review at 1440×900 and 390×844 as the main pair, plus 320×568, 844×390 and portrait tablet. Inspect every held action and boundary forward and backward. Use the existing story capture/check scripts adapted only where approved scene data changes. Include the especially fragile longest heading, opening descent, PC explosion, HuntIT/SPARK crowds, passenger exit, exterior-to-cabin move, mentorship pairing and final exits.

Run a bounded cycle: build the complete selected phase, inspect desktop/phone together, consolidate defects, fix them as one batch and confirm. If important work remains, mark the specific rows unfinished and plan the next bounded task. Do not average a weak scene away with a high opening score.

## 10. Immediate next production package

The next implementation proposal is deliberately concrete:

- **Actors:** child Mukul, Dad, Mandal, adult Mukul and one adult intern, with reusable exportable rigs and hands.
- **Places:** the 2004 room, inhabited repair shop and modern mentoring area.
- **Props:** white computer, openable tower/PC internals, bench stock, keyboard/mouse and a modern display.
- **Actions:** point/follow/act, explain/inspect, reversible disassembly and the matching adult lesson.
- **Views:** vertical story flow on every viewport, with separately composed desktop and portrait camera paths inside the page's current copy/dock constraints.
- **Look:** one final material/light standard demonstrated in both warm childhood and cooler office conditions.
- **Evidence:** no new historical screenshot is required to make this proof truthful. Existing brand/capture sources stay separate.
- **Review:** approve the moving human/material standard before duplicating it across the remaining scenes.

The plan now covers all scenes, every required asset class, procurement choices, custom development, runtime integration and scene-level completion. Production assets remain to be made or acquired. Script/art approvals, precise paid-cart approvals and eventual release approval remain distinct.

## Planning verification

Checked before commit: the scene table contains 01–34 exactly once; its existing-beat mapping covers 1–39 exactly once; all referenced identifiers resolve to the 29 asset packages and seven evidence records; all seven evidence files exist and total 944,464 bytes; relative document links resolve. No renderer/browser regression is claimed for this documentation-only pass. The runtime remains the previously tested prototype.
