# Portfolio recovery checkpoint

Status: final implementation, build, desktop/mobile visual review and 320px containment verification complete within the boundaries below. Recorded 2026-09-20. PR #9 is historically a draft; no release, merge, deployment, or further commits are authorized by this checkpoint.

The existing editorial design was recovered rather than restarted. The original design pack's page and section references remain the visual authority, subject to the owner's explicit later overrides: symbol navigation logo, illustrated portrait in the hero, smaller headings, correct official branding, calmer spacing and softer card corners. The newer Supervity reference informed spacing, hierarchy and contrast, not replacement content or branding. Large editorial covers and the Syne/Geist identity remain. The 17 project routes, 15 original Markdown articles, real links, themes, booking and resume behavior remain in scope.

The owner subsequently approved **Engineer by craft. Builder by instinct.** as the shared positioning line and requested more consistent section padding. **Creating digital experiences for humans** remains the main hero statement. Historical job titles and canonical article text were not rewritten. Shared content-section insets now use a 20–32px responsive range; illustrated featured tiles retain their own composition. These later decisions supersede conflicting copy/geometry recommendations in older local reviews. The original pack is a fidelity reference, not authority for incidental generated claims, metrics or product screenshots. Exact pixel-for-pixel reproduction is not claimed: native diagrams, factual corrections to illustrative concepts, responsive reflow and the owner's overrides are intentional differences.

The user owns the development server. No server operations, production changes, merge or deployment are part of this verification. Earlier permission produced the five bisectable commits and draft PR #9; the current follow-up fixes remain local, with no further commits authorized in this continuation.

[DESIGN.md](../DESIGN.md) records the current fidelity authority and implementation decisions; [PRODUCT.md](../PRODUCT.md) records current copy, scope and operating boundaries. The three older design/layout review reports are marked historical and superseded where they conflict. This closes the authority-document gap, not the visual evidence gates below.

## Validated commit boundaries

Each runtime commit was assembled and tested from its staged tree in an isolated checkout. The active development server and its build output were not touched. Dependencies were installed from the candidate lockfile; no local environment files were copied.

| Commit | Scope | Actual checks |
| --- | --- | --- |
| `1bc7736` | Shared controls, reduced-motion snapshots, cache headers, structured-data escaping | Frozen install, motion regression check, TypeScript, targeted Biome, production build |
| `3d03b2e` | Home, shared shell, local branding, contact and utility states | Motion/project checks, TypeScript, targeted Biome, production build |
| `48f62ac` | Project-specific compositions and required concept artwork | Motion/project checks, TypeScript, targeted Biome, production build; 36 generated HTML pages referenced 62 local images, all present |
| `bae09f9` | Writing archive, article diagrams, covers and Markdown heading parity | Frozen install, all six UI regression suites, TypeScript, targeted Biome, production build; 36 generated HTML pages referenced 79 local images, all present |

Each production build generated 40 static pages, including framework and metadata routes. Full lint also passed against the isolated runtime tree: 100 checked source files. These checks establish buildable code boundaries; they do not establish visual completion.

The writing pagination check previously required unused legacy covers. That redundant assertion was removed. The separate cover check validates the actual selected local assets, explicit overrides, fallback naming and Open Graph/Twitter parity.

## Browser evidence reported by the coordinator

- At a 390px viewport, OpenKVM preview and resume dialogs opened; Escape/close returned focus to their respective triggers.
- The resume PDF returned HTTP 200 with `application/pdf`.
- Booking loaded the actual calendar iframe, retained Open calendar and Email instead alternatives, and Back removed the iframe and restored Book a call focus. No booking was submitted.
- Copy-email feedback displayed immediately after activation.
- The database article TOC selected `#keep-the-slow-path-as-a-fallback`, positioned the target at 96px from the top and set the appropriate `aria-current` state.
- Archive pagination changed page 1/3 to 2/3 with the expected articles; the React Native filter reset to page 1/1 with Brik and Swiggy, and All restored the complete collection.
- A 320px DOM sweep of all 15 article and 17 project routes found correct h1 headings and no horizontal page overflow. This is responsive smoke evidence, not visual approval of every route.

## Completion scope and explicit limits

- The final route-by-route ledger is reconciled in [visual-evidence-ledger.md](visual-evidence-ledger.md): all 17 projects at 390/1440px and all 15 articles at 390/1024px passed independent review of loaded final fidelity captures. Earlier blank-art diagnostics are superseded. [Reference-fidelity-review.md](reference-fidelity-review.md) preserves intentional differences and remaining visual simplifications.
- All 17 project compositions now have reviewed 768/1440px captures. Article tablet/wide checks remain representative, not an exhaustive 15-article matrix. The 320px all-route DOM sweep proves containment, not every composition's visual fidelity.
- Preserve the scope of interaction evidence: keyboard menus/dialog trapping, TOC navigation, code/table horizontal scrolling, code-copy success, retry/404, resume and booking return are verified as listed below. Clipboard contents were not separately read back; browser success and the installed library's awaited clipboard-write path establish API success, not an independent byte-for-byte paste check.
- Reduced-motion runtime evidence covers scroll behavior and reduced CSS transitions, with shared motion SSR regression checks. The latest dark suggested-actions screenshot is readable, but this is not complete dark-theme/contrast or whole-app live motion certification. Full screen-reader testing, 200% browser text zoom and cross-browser certification are not claimed.
- The final 320px containment sweep, isolated build and Pulse lime-notice rendered confirmation passed as recorded below. No active repair/verification blocker remains. Keep draft PR status separate from local completion and the broader certification limits above.
- Keep factual content corrections in [content-review.md](content-review.md) as owner-review drafts. They are not applied replacement facts.

## Earlier post-PR repair verification

- Replaced first-paragraph-only article grids with contained desktop floats. Independent screenshot review passed progressive-results, fleet and checkpoint desktop flow, plus checkpoint mobile diagram/body readability. Canonical prose, lists, code and heading IDs remain covered by regression checks.
- Fixed dark fenced-code loading text and replaced the dim/translucent Vitesse syntax palette with the already-installed GitHub dark theme. Actual highlighted tokens and screenshot readability were checked; code remains internally scrollable without page overflow at320px.
- Fixed the checkpoint headline's mid-word wrapping at320px through the shared mobile title scale and padding. Desktop typography is unchanged.
- Triggered a controlled client render exception through a temporary local test route, observed the actual app error boundary, and activated Try again to restore the healthy route. The test route was removed. Missing-article Back home also returned to the canonical homepage.
- Final six-file source snapshot passed isolated TypeScript, blog regression checks and production build (40 static pages). Coordinator verified all six SHA-256 hashes against the working source, then reran all six UI suites and full lint successfully after the final mobile adjustment. The user-owned server and active build output were untouched.
- These follow-up fixes remain local and uncommitted. PR #9 remains a draft; no merge or deployment occurred.
- Independent final screenshot review passed loaded RCA/Zendash lower artwork and the corrected Quivly Design Language, Skills project and Skills article logo plates, with no additional material defects in those captures.
- Keyboard checks at320px: header and dock menus opened with keyboard, Escape dismissed them and settled focus returned to each trigger. OpenKVM modal trapped Tab from Close back to Project overview and Shift+Tab in reverse; Escape dismissed it.
- Reduced-motion runtime testing found root `!scroll-smooth` overriding the preference. Replaced it with `motion-safe:scroll-smooth`; computed root scrolling now reads auto under reduce and smooth under no-preference. CSS button transitions reduce to0.01ms. All UI suites, lint and TypeScript passed after this one-line fix; the prior isolated production build predates this class adjustment.

## Earlier verified snapshot

The isolated validation agent tested the current snapshot of 20 runtime files and five delivery WebPs. The coordinator matched every reported file hash against the working tree. Aggregate SHA-256: `0f0706e11a8e4fae5aa26abaa7570c625007d82e677d2295e6bad3fc248be6db`.

- Production build passed with 40 static outputs; all six UI regression suites, TypeScript and isolated lint (101 checked files) passed. Coordinator checks also passed in the broader working tree (107 lint files). These are separately reported validation scopes.
- These results supersede earlier six-file and 13-file build snapshots. They establish buildability for these exact bytes, not a blanket approval of future edits or every visual state. HTTP route smoke evidence remains separately described above; `test:ui` without an explicit HTTP base does not itself run the live-route sweep.
- All 15 article mobile captures at 390px received independent review with no material typography, diagram, code-containment or spacing defects. All 17 project routes received mobile review across batches; Moshi Health's scrim and Moshi Fleet's failed image delivery were repaired and their replacement captures reviewed. Desktop review and recapture batches covered project-specific compositions, article flows, Quivly branding and RCA/Zendash detailed artwork. Earlier blank-image captures remain diagnostic only.
- Independent review passed loaded homepage/archive mobile captures, homepage 768/1440px composition and owner-approved copy/padding, archive 768/1440px, and suggested-actions 1440px. The coordinator reviewed suggested-actions at 768px. The homepage review caught a tablet fixed-dock/footer collision; the shared footer now reserves dock clearance. At the 768×1000 viewport, social-link bottoms measured 887px and dock top 936px, approximately 48px clear. `footer-768-clearance-fixed.png` records that repair; preceding home captures predate it.
- Actual keyboard ArrowRight on the suggested-actions scrollable code block moved `scrollLeft` from 0 to 40 without page overflow. This closes code horizontal-scroll interaction, not the separate table or copy-control checks.
- The subsequent native table check on the phased-turns article at 320px moved `scrollLeft` from 0 to 40 with ArrowRight. Its container was 272px wide, content 376px, and document 316px: horizontal scrolling stayed inside the table.
- Clicking suggested-actions “Copy Code” changed the icon to the success checkmark. Inspection of the installed Streamdown implementation confirms that state is set only after `await navigator.clipboard.writeText(code)` resolves. No custom copy control or clipboard permission override was added. Clipboard contents were not separately read back.
- The coordinator inspected `actions-dark-final.png` and found the dark suggested-actions article readable, then restored light theme. Previous runtime theme toggling worked in both directions. This remains representative theme evidence.

Valid recovery capture names include `mobile-article-*.png`, `mobile-moshi-health-fixed.png`, `mobile-moshi-personal-agent-fleet-fixed.png`, `home-full-390-delivery-fixed.png`, `archive-full-390.png`, `home-768-final.png`, `home-1440-final.png`, `archive-768-final.png`, `archive-1440-final.png`, `actions-768-final.png`, `actions-1440-final.png`, and `footer-768-clearance-fixed.png`, under the local `.scratch/bento-build/recovery/` directory. These operational images are not included in the PR; the per-route evidence ledger must distinguish final captures from superseded diagnostics and note subsequent shared-footer changes.

## Artwork delivery and known limitations

### Latest project tablet/wide review

- Independently reviewed all 17 project captures at 768px. Moshi Health needed its stronger vertical text scrim through tablet sizes; its desktop-gradient breakpoint moved from `md` to `lg`. The coordinator reviewed `project-768-moshi-health-fixed.png` after the repair. Other tablet captures are `project-768-{slug}.png`.
- All 17 wide captures are now loaded and reviewed at 1440px: four initially passed, 12 passed independent re-review after loaded-artwork recapture, and the coordinator reviewed Cryptomedia after its hero finished loading. Valid files are `project-1440-{slug}.png`; they replace earlier blank-artwork diagnostics at those paths. No additional delivery derivative was needed for Cryptomedia.
- Lint, all six UI regression suites and TypeScript passed after the Health breakpoint change. A subsequent isolated production build also passed, generating 40/40 pages. All 101 files across `app`, `components`, `lib` and `content` byte-matched the working tree. The synchronized Health page SHA-256 is `e79b4e45182dad2bedf9da07c70c1effad28176feca7176932326ba59da1edc6`; this supersedes the earlier build's breakpoint limitation.
- The approved positioning is confirmed in shared site data and the About section: “Engineer by craft. Builder by instinct.” The canonical main headline is unchanged.
- All 15 articles were freshly captured at 1024px with a visible-image load gate and independently reviewed. Every `article-final-1024-{slug}.png` passed artwork, clipping, heading/prose flow, code containment and footer review. These are the authoritative desktop article captures in place of ambiguous older filename mappings.
- The design-pack validator and `git diff --check` passed after these checks. No server, commit or deployment changes were made.

Six precompressed delivery WebPs avoid observed image-optimization stalls for selected artwork, without disabling site-wide optimization. The pack retains delivery copies alongside the originals; exact encoding and source relationships are recorded in provenance. Targeted direct delivery is a known performance tradeoff, not evidence of a general performance audit.

[Artwork provenance](artwork-provenance.md) and [the inventory](artwork-inventory.json) record 89 retained website assets, actual hashes and source relationships. The external pack contains 182 image files: 170 gallery entries, six implementation references and six delivery derivatives. Product interfaces remain labeled illustrative concepts, not authenticated shipped screenshots or current data; missing historical prompt/source records remain explicitly absent. Raster dashboard micro-labels are small on mobile, with explanatory live HTML outside the artwork.

## Reference-comparison repair batch

The independent all-route comparison in [reference-fidelity-review.md](reference-fidelity-review.md) found real composition differences that the earlier layout reviews did not certify. Shared lower-project-panel alignment and diagram node opacity, project technology layouts, six article supporting diagrams, and the missing working-memory supporting illustration have now been repaired in source. The new illustration and exact prompt are retained in the design pack. All six UI suites, lint and TypeScript passed during integration. Earlier screenshots and builds must not be treated as approval of this newer batch.

Chrome was closed during the source repair. That historical blocker is now resolved: the browser reconnected, and the final fidelity captures described below cover the repaired project/article compositions and home/utility surfaces. The user-owned server was not restarted.

The repair batch subsequently passed isolated production build (40/40 pages), TypeScript and all six UI suites. All runtime/content files matched the working tree. The six synchronized repair files are the project page/visuals, article body/diagrams, blog regression script and new memory illustration. `scripts/check-bento.ts` remains absent from the isolated copy and is not in `test:ui`; no broader script parity is claimed. This build supersedes the pre-fidelity build, but does not replace pending rendered verification.

## Project endings and related-reading follow-up

The next source batch restores reference-specific navigation banner families, eight light/nine dark contact treatments, compact Pulse/Fleet endings, and two related-reading layout families across all 15 articles. Shared contact behavior stays in `CTATile`; defaults preserve homepage/archive behavior. Its light-theme hover contrast and exit-surface sequencing were independently reviewed and corrected. Four appearance/compact server contracts preserve booking, copy-email, mail and resume controls. Navigation destinations were checked across all 17 projects; lint, TypeScript and UI suites passed.

See the reference review for exact route mappings and remaining illustrative-art differences. The reconnected browser supplied fresh screenshots and targeted light/compact booking confirmation; those results are recorded below rather than extending the older approvals implicitly.

This follow-up passed isolated production build (40/40 pages), TypeScript and all six UI suites, with all 101 runtime/content files matching the working tree. A stale isolated Turbopack cache caused the first attempt to fail; its `.next` was preserved as `.next-before-final-source-validation`, and the fresh isolated build passed. The active server's build output was untouched. The later added `check-writing.tsx` regression exercises related-card destinations, metadata, unclamped titles and both layout families across all 15 articles; it passed in the working tree and does not change runtime bytes.

## Current rendered and interaction evidence

- Independent reviewers inspected all 64 final route captures: `fidelity-project-{390|1440}-{slug}.png` for all 17 projects and `fidelity-article-{390|1024}-{slug}.png` for all 15 articles. Visible-image loading was gated; no material clipping, overlap, missing artwork, related-card overflow or footer collision remained. Article desktop captures were refreshed after the title-led related-image sizing repair.
- Moshi Fleet's corrected 768px composition passed follow-up review. The final `fidelity-home-{390|1440}.png`, `fidelity-404-{390|1440}.png` and `fidelity-error-{390|1440}.png` captures also passed. This closes the previously missing final homepage-mobile and utility rendered evidence.
- Live Pulse verification at 768px in dark global theme exercised its light compact contact panel, loaded the calendar, and confirmed Back restored the Book a call trigger's focus. `fidelity-pulse-booking-768-dark.png` records the booking state. No booking was submitted.
- Copy email displayed success feedback; clipboard contents were not independently read back. Resume opened at 390px and Escape restored trigger focus. Existing keyboard, TOC, code/table scroll and representative dark-article evidence remains as scoped above.
- Static captures used reduced motion. They do not certify full live animation, all-route dark-theme contrast, screen-reader behavior, 200% text zoom or cross-browser behavior.
- Final live 320px DOM sweep passed all 33 routes:17 projects,15 articles and home. Every route had an h1 and document scrollWidth 316px at innerWidth 320px, with no horizontal page overflow. Pulse's post-notice recheck also passed and retained the canonical notice. This is containment evidence, not a separate33-route visual matrix.
- Pulse's lime private notice was restored; refreshed 390/1440 captures independently passed readable wrapping, containment, row alignment and compact-ending checks. Browser viewport/media were restored and preview returned to home/light theme.

## Final isolated validation

Final isolated lint passed 102 files; all six UI suites and TypeScript passed; production build generated 40/40 pages. Parity checks covered240 source/content/script/asset files with zero differences, and configuration/lockfile matched. Initial missing isolated dependencies were repaired with a frozen force install in the isolated checkout only; the user-owned server and active build output were untouched. Final Pulse page SHA-256: `c79ff6bbdcdf566f68fb04596b8101faf06632fdf7a608e86eb97802d06a5859`.

This final result supersedes prior smaller snapshot/build identities and closes the active validation queue. Earlier statements about five delivery files or no Cryptomedia derivative describe their historical snapshots; current provenance records six delivery WebPs,89 website assets and182 pack images. Known visual differences remain in the reference review; completion does not imply literal pixel identity or certification outside the explicit scope.

Only retained production artwork and attribution records were included in the existing PR. Follow-up runtime changes and six delivery files are local until separately authorized for Git handoff. Unused artwork, operational scratch files, old screenshots and historical design scores remain local. Booking submission, email sending, external-demo operation, third-party uptime and production deployment are outside this verification. No merge or deployment is authorized by this checkpoint.
