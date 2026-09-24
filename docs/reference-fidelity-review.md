# Reference fidelity review

This is a visual comparison record, not a pixel-identity certificate. Layout correctness and image loading are tracked separately in the visual evidence ledger.

## Final verification status

All 17 project and15 article routes have independent final desktop/mobile visual passes after the repairs described below: projects390/1440px and articles390/1024px, with visible-image load gates. Corrected Fleet 768 and final home/404/error390/1440 also passed. Pulse's lime private notice is restored and independently passed 390/1440 review. The final 320px DOM sweep passed33 routes (all projects/articles plus home), including a post-notice Pulse recheck; this is containment rather than an extra visual matrix.

Chrome reconnected. Pulse 768 dark-global-theme/light-compact booking loaded the calendar and Back restored focus; resume 390 Escape restored focus. Copy-email success UI was verified, not clipboard readback. Viewport/media were restored and preview returned to home/light theme. Final isolated lint (102 files), six UI suites, TypeScript and production build (40/40 pages) passed;240 source/content/script/asset files had zero parity differences and configuration/lockfile matched.

These results supersede every historical “pending”, “repair in progress” and “Chrome closed” statement in the chronological findings below. No material visual defect remains from this repair queue. The intentional and known differences remain valid: smaller owner-approved typography, native diagrams, companion-art crops, simplified human-review depth, neutral related-card surfaces, Health orbital banner and simplified RCA/Zendash/Cryptomedia transitions. Neither layout passes nor this reconciliation assert pixel identity.

See [the current ledger](visual-evidence-ledger.md) and [checkpoint](recovery-checkpoint.md). No further commits, merge or deployment are authorized.

## Historical comparison and repair record

The following preserves the actual pre-repair findings and source-pass history. Its pending statuses are historical, not current gates.

## Homepage desktop

Compared the actual images `portfolio-design-pack/pages/home-desktop.png` and `.scratch/bento-build/recovery/home-1440-final.png` on 2026-09-20.

The implementation retains the reference's asymmetric opening grid, chrome ribbon and map, dominant OpenKVM panel beside stacked Brik/Skills cards, About/Experience row with narrow typographic panel, paired editorial writing cards, three-project strip and dark contact panel. The white/charcoal/chartreuse palette and expressive display face are retained.

Later owner instructions explain the major intentional differences: symbol branding instead of the generated avatar mark, illustrated portrait inside the hero, smaller display headings, softened corners, roomier section insets, official company marks and the approved “Engineer by craft. Builder by instinct.” positioning. Canonical descriptions, technologies and actual project destinations replace incidental generated copy. Existing disclosures, project pagination, resume and email links remain functional rather than being removed to match a static picture.

The standalone OpenKVM and writing illustrations are companion assets, not identical crops of the composite. Their internal shapes and framing differ. Heading wrapping, vertical density and contact controls also differ. These facts prevent a literal pixel-for-pixel claim. The referenced homepage capture predates the later shared footer clearance repair; its footer overlap is superseded by `footer-768-clearance-fixed.png` and the measured clearance documented in the checkpoint.

## Homepage mobile

Compared `pages/home-mobile.png` with `home-full-390-delivery-fixed.png`. The implementation retains the reference's single-column order, ribbon/map interlude, three featured projects, writing pair, project strip and dark contact close. It deliberately keeps real About text, metadata, complete contact actions and usable tap targets rather than squeezing them into the concept's abbreviated bands. The portrait and official marks follow later owner instructions. Companion artwork and crop positions differ from the composite.

This comparison is structural evidence only: the 390px capture predates approved positioning/padding refinements. The newer `home-spacing-copy-320.png` verifies the changed copy locally, but a fresh full-length mobile capture is still needed to represent the final combined state. Do not treat the older “Engineer turned generalist” text in that screenshot as current.

## Writing archive

Compared `pages/writing-index.png` with `archive-1440-final.png`. The major composition is faithful: oversized two-line editorial heading, topic chips, wide featured checkpoint illustration, three-column/two-row article grid, pagination and the shared contact panel. Current topic labels and chronological ordering come from actual article metadata; they intentionally differ from the generated preview. The featured title is smaller under the owner's typography instruction. Navigation, resume and email fallbacks are retained.

The grid uses approved standalone article art rather than reproducing every composite illustration. For example, the phased-turns card uses stairs and a flag rather than the preview's flag on rock, and the actions card depicts typed next steps rather than speech bubbles. Those are visible asset differences, not pixel identity. The archive also omits the preview's small decorative right-hand heading slogan and featured-card tag row. Neither blocks navigation or reading, but these omissions remain visual differences rather than claimed matches.

## Utility states

The 404 and error preview images and current source were inspected. Both retain their split text/art composition, correct recovery actions and matching chrome-art subjects. Source inspection is not a current rendered-image comparison. Prior runtime tests established 404 recovery and the actual error boundary's retry behavior, but no current utility screenshots were found in the recovery screenshot directory. Current 404/error visual evidence remains pending.

## Remaining scope

Independent comparisons are complete for all 17 projects and 15 articles. The resulting repair batch needs rendered confirmation, and final-state homepage-mobile and utility screenshots remain pending. All-route layout-review passes alone do not close this fidelity requirement. Preserve canonical content and later explicit owner choices when classifying differences; do not silently reinterpret every difference as approved.

## Independent all-route comparison results

Two separate reviewers inspected all 64 images: 17 project preview/current pairs and 15 article preview/current pairs. This direct comparison supersedes the earlier assumption that clean layout reviews also established fidelity.

### Projects

All 17 main artwork sequences correspond to their reference subjects and order. No main image replacement was requested by the comparison. Canonical content, private-link handling, official marks and later owner typography/portrait/corner choices remain valid differences.

| Routes | Material differences or repair |
| --- | --- |
| Quivly Platform, Tethr, Moshi Fleet | Mixed native/raster lower panels had unequal bottom edges. Shared grid changed from start to stretch alignment; live confirmation pending. |
| Quivly Agents, Moshi Fleet | Connector/orbit lines showed through translucent node cards. Shared glass cards now have an opaque charcoal backing beneath their gradient; live confirmation pending. |
| OpenKVM, Brik, Ferry, HeroApp, RCA Tool, Zendash, ZepEats | Technology cards/strips were flattened into generic rows. Reference-specific geometry restoration is in progress, preserving actual tags. |
| Quivly Design Language, Quivly Skills, Cryptomedia | Core route-specific composition retained. Smaller headings, native diagrams and canonical next-project imagery are supported differences. |
| Altr, Pulse, Moshi Health | Main artwork retained, but distinctive next-project/ending composition was replaced by the shared template. Pulse's private note also lost its lime emphasis. Still open. |

Across routes, varied light/dark contact endings and next-project banners became a single repeated template. This is not explained by the owner's smaller-heading or branding instructions. Reconcile it explicitly rather than calling it an exact match.

### Articles

| Route | Direct comparison result |
| --- | --- |
| Agent stuck detection | Ribbon hero and Repeat/Detect/Recover figure retained. |
| Suggested actions | All three supporting compositions retained with canonical grounding logic. |
| Working-memory hygiene | Separate introductory scratchpad/trust-boundary art was missing. Reconstructed as a standalone asset and wired before the first section; live confirmation pending. |
| Brik | Device hero and three-stage compilation flow retained. |
| Checkpointing | Separate-index tree and comparison retained. Canonical temporary-index wording correctly overrides the preview. |
| Ferry | Compact horizontal Watch/waveform/Mac figure became a tall two-image stack. Repair in progress. |
| Human review | Draft/Review/Release hierarchy retained; dimensional material treatment simplified. Lower-priority difference. |
| MCP gateway | Many-source convergence weakened into generic stacked boxes. Repair in progress with generic, factual source nodes. |
| Swiggy/mobile lessons | Pedestal hero and four-phone states illustration retained. |
| OpenKVM | Parallel endpoint/channel geometry became a feature list. Repair in progress using existing TCP/UDP/Bonjour facts. |
| Phased turns | Dimensional silver/black/lime slabs became flat cards. Repair in progress. |
| Progressive results | Document hero and Search/Summarize/Read composition retained. |
| Quivly Skills | Light layered knowledge/tools/context/actions composition was replaced by dark project art. Repair in progress. |
| Personal agent fleet | Separate lime quote panel lost its hierarchy. Repair in progress with the existing canonical excerpt. |
| Direct database access | Layered hero and two-path comparison retained with canonical SQL placement. |

Related-reading layouts remain more uniform than the varied compact/typographic reference cards. This is a secondary fidelity difference, not a canonical-content requirement.

### Current verification boundary

Chrome was confirmed not running during this repair pass. Permission to reopen it has been requested; no browser or server was launched. Existing screenshots establish pre-repair findings, not visual approval of the newest source changes. The prior isolated build also predates this fidelity repair batch.

### Implemented repair batch

- Project technology panels now preserve the reference families: OpenKVM/Zendash icon strips, Brik 3+2 cards, Ferry 2+3 cards, six two-column card routes and seven stacked routes. Actual tags and installed icons are unchanged. Section SSR verified tag counts for all 17 routes.
- Shared lower panels stretch to a common row height. Opaque charcoal node backing prevents diagram strokes showing through text regions.
- Ferry, Skills, fleet, MCP, OpenKVM and phased-turns supporting diagrams were revised to restore the identified hierarchy/topology/material differences. No canonical Markdown changed.
- Memory's new supporting illustration is `assets/articles/agent-working-memory-trust-boundary-support.png` in the pack and the matching `public/design/articles/` file in the site. Native output is 1448×1086. It is a built-in image-generation reconstruction, not an exact extracted crop. The pack manifest stores the exact prompt and provenance. The article regression now expects four figures on that route.
- Full lint, TypeScript and article/content checks passed for the completed source batch; all six UI suites passed during integration. Fresh browser screenshots are still required before visual approval.

### Project ending restoration

The follow-up source pass restores light contact panels on Brik, Quivly Agents/Platform/Design Language, Tethr, Moshi Fleet, Pulse and RCA; the other nine retain dark contact panels. One shared `CTATile` owns both appearances and the compact Pulse/Fleet layout. Booking keeps its established dark treatment, while light introductory copy, email-copy feedback and mail/resume links use dark text. Four appearance/compact combinations have runnable server-render checks for visible content and retained controls. Existing interactive focus/booking tests predate these appearance props, so they still need a targeted runtime confirmation.

Next-project navigation now restores Ferry's lime banner, Health's dark orbital banner, Altr's full-width title strip, Quivly full-width preview families, links-first ordering on OpenKVM/Brik, and compact next/contact endings on Pulse/Fleet. Actual destinations, descriptions and private/public boundaries are preserved. All 17 destination checks passed in the section render test, along with UI suites, TypeScript and lint.

Remaining visual differences: Health's banner uses existing orbital art rather than the exact satellite composition; RCA/Zendash decorative transitions and Cryptomedia's composite next scene remain simplified. Those are explicit differences, not pixel-identical matches. Chrome remains closed, so this source pass is not yet visually approved.

An independent code review caught two light-contact edge cases. The booking trigger now explicitly retains a lime background and dark label on hover, regardless of global theme. Intro and booking content keep their own matching background during exit fades, preventing dark text on the newly dark parent or white text on the newly light parent. Server contracts cover hover classes and all four intro variants; animation/focus still needs runtime confirmation.

### Related-reading restoration

All 15 references were compared again for this specific region. Seven articles now use compact thumbnail-left rows; Ferry, MCP, Swiggy, OpenKVM, phased turns, Skills, fleet and database articles use title-led horizontal cards. The current article determines presentation only. All three real recommendations, full unclamped titles, destinations, dates and reading times remain intact, and main editorial covers are unchanged. Focus outlines and directional cues remain visible.

This deliberately preserves three canonical recommendations where a generated preview has two or invented entries. Neutral native surfaces and real artwork do not reproduce every composite's black/white/lime treatment. Full lint, TypeScript and all six UI checks passed; fresh 390/768/1024 visual confirmation is pending.
