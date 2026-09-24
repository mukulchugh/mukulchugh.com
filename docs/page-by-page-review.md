# Page-by-page and section-by-section review

Historical content/design audit. Preserve its factual review questions, but use [DESIGN.md](../DESIGN.md) and [recovery checkpoint](recovery-checkpoint.md) for current owner decisions and runtime verification.

## Scope, evidence, and the owner's direction

This is an independent design and editorial review of the implementation workspace at `/Users/mukulchugh/portfolio-motion`. It covers the homepage, writing index, article template, all 15 published article sources, all 17 visible project records and their generated pages, global navigation, and error states. It is documentation, not an assertion that every recommendation has been implemented.

**Preserve the large editorial covers.** The owner explicitly chose them. Their scale, ink palette, typography, and deliberate breathing room are part of the identity. Earlier advice to shrink article covers is superseded. Improvements should target navigation, readable supporting content, accurate labels, and unnecessary repeated metadata around the covers.

Evidence labels used below:

- **Source observed:** read from the current implementation files during this pass. Concurrent implementation/QA may change these files after the review.
- **Earlier visual observation:** directly inspected the canonical live homepage, project preview, contact transition, and desktop screenshots; also inspected the local writing index, checkpoint article, and OpenKVM detail. These observations predate some current implementation changes and are not final visual certification.
- **Recommendation:** a proposed next step, not a completed change or verified product fact.
- **Owner verification:** a factual question that cannot be answered by the portfolio text alone.

All 15 articles and all project records were read. Other than the specifically named visual observations, individual detail-page reviews below are **source-based** evaluations of their content through the shared template. This review does not claim individual screenshots, mobile checks, external-demo availability, screen-reader testing, or successful booking/resume delivery for every route. The main workflow owns final rendered QA. No server was started or stopped for this document.

Exact draft replacements and owner questions live in [Content corrections for review](content-review.md). They remain **DRAFT NOT APPLIED**; publication dates and article bodies have not been changed by this review.

## Cross-page reading of the design

The portfolio feels authored through its projects, portrait, direct writing, and strong Syne display typography. Its neutral grid is a familiar structure, but the specificity of the work carries it. Keeping that identity is preferable to inventing a new layout language or adding generic product screenshots.

The recurring design problem is the difference between visual emphasis and evidential value. Large covers are intentional; a case-study promise with only a repeated paragraph is not. Clarify what each destination offers, preserve distinct public/private boundaries, and make the ordinary navigation paths dependable.

Current source already addresses several earlier findings: the hero is an h1; “Let's chat” links to Contact; the Projects anchor begins at featured work; shared footer/dock links are home-qualified; release/package destinations have specific labels; article-body links are visibly underlined; reading progress wraps article content; covers no longer repeat reading time/category metadata; and chronological article controls say Newer/Older. These are source observations, not a substitute for the main workflow's final checks.

## Homepage: `/`

Primary sources: `app/page.tsx`, `components/home-bento.tsx`, the `components/bento/` tiles, `components/about.tsx`, `components/projects.tsx`, `components/blog-section.tsx`, `components/experience.tsx`.

### 1. Page frame and overall ordering

**Source observed:** a bounded 1400px grid contains profile, location, social links, biography, four featured projects, the remaining projects, writing, experience, and contact. The four featured projects form one nested grid beside About. The source order becomes the mobile reading order.

The hierarchy introduces a person before proving their work. This is a valid personal-site choice, but visitors evaluating engineering ability need a clear shortcut to Projects. That shortcut now targets the featured group. Keep the overall ordering unless the owner explicitly prioritizes recruiter/client evaluation over personal introduction.

**Recommendation:** assess the phone journey as profile → location → social links → long biography → work. That is a substantial introduction before the first project. Improve shortcut visibility or paragraph economy before moving whole sections. Do not count the grid's decorative surface as evidence of capability.

### 2. Profile portrait, role, and name

**Source observed:** portrait, “Product Engineer,” a two-line name h1, Quivly role descriptor, and location/specialty chips. The clickable “Let's chat” invitation now has an actual destination. Entrance animation and modest parallax remain.

**Earlier visual observation:** the bold first name and lighter surname establish immediate hierarchy without a slogan. The portrait provides human identity. This is one of the strongest sections and should retain its proportions.

**Recommendation:** keep the role descriptor concrete; do not add more titles or availability claims to the green invitation. Preserve the h1 and verify that motion never makes the name unavailable during hydration or reduced-motion rendering. The existing location chip duplicates the nearby location tile, but is useful when the profile is read alone; deletion is optional, not a priority.

### 3. Location and working hours

**Source observed:** India as location and San Francisco working hours, with a periodically updated clock. This serves a practical collaboration question. The current timezone formatting was revised to avoid a permanently hardcoded standard-time label.

**Recommendation:** keep location and working-hour preference distinct. “SF hours” should not be taken as physical presence. The clock does not establish availability for a call; retain the separate booking workflow. Check daylight-saving output and loading text in final QA, without turning the tile into a scheduling dashboard.

### 4. Connect/social tile

**Source observed:** four labeled destinations: LinkedIn, GitHub, X, and Email. Brand tint is restrained. Email is a copy button with a mail-app fallback; other cards open destinations. The Email card uses the same outward arrow as external links until copied.

The four-item group is easy to scan and fits the page's geometry. The behavioral mismatch is smaller than before because success feedback exists, but an outward arrow still suggests navigation rather than copying.

**Recommendation:** label Email's immediate action “Copy email” or use a copy symbol while retaining the recognizable mail identity. A mouse user should not need the accessible name to predict the action. Preserve the visible contact email lower on the page for people who prefer selecting text. The hidden mail-app link and automatic fallback are implementation paths, not proof a configured mail client will open.

### 5. About

**Source observed:** five paragraphs cover generalist identity, mobile/full-stack practice, current/prior roles, startup/freelance preferences, and an invitation. The section title already communicates the central premise.

The biography is personal and unusually specific, but its first two paragraphs both explain blurred job boundaries. The third contains useful career context that also appears in Experience.

**Recommendation:** retain the personal preference paragraph; it tells a collaborator what fit looks like. If distilling later, combine the first two paragraphs rather than cutting the concrete career history. Do not replace the author's voice with generic “passionate engineer” language. Dates and role claims should remain consistent with Experience and the review-gated article chronology.

### 6. Featured work, four tiles

**Source observed:** OpenKVM, Brik, Ferry, and Quivly Skills; large dark type covers; full semantic title below; compact descriptions; all tags; separate public links; preview dialog. The current `#projects` target is on this group.

**Earlier visual observation:** at desktop width the sidebar composition compressed decorative titles and descriptions. Full titles below the covers kept identities available, so this was a density problem rather than missing project names.

**Recommendation:** preserve the covers and ensure each title treatment remains intentional at narrow widths. Prioritize a readable one-sentence outcome below each cover before showing every technical tag. The fixed two-column inner grid is the specific phone/zoom stress point; verify long category badges, two external icons, and “Quivly Skills” together. A generic image replacement would discard the chosen identity without solving information hierarchy.

### 7. Featured-project preview

**Source observed:** a named dialog repeats cover identity, expands the description, shows tags, and offers “Project overview,” GitHub, and destination-specific release/package actions. Close is explicit.

The renamed overview action now matches the amount of material on the next page. This preview is useful only if it lets visitors decide without navigating away; its full paragraph and direct public links provide that utility.

**Recommendation:** retain focus containment/return, Escape, and a visible close button. At small heights the body should scroll while the exit remains discoverable. Do not add a second narrative solely to justify the dialog. The direct public links should remain available without forcing the overview step.

### 8. More projects

**Source observed:** featured work is excluded, hidden records are filtered, remaining work paginates six at a time, and the current page count is announced. Much of the first page is private Quivly/personal work; later pages contain earlier public work.

The section conveys breadth, but repeated confidentiality statements can make the first page read as six variations of “details unavailable.” That is not a reason to expose private material.

**Recommendation:** keep privacy labels; make the publicly supported role or problem distinct in each short description. If sorting changes, choose an explicit editorial order rather than adding filters for a small list. Pagination should keep focus and scroll stable and should not hide new cards behind an entrance animation. A returning visitor losing pagination state is a minor inconvenience, not justification for a custom state system.

### 9. Writing preview

**Source observed:** six cards per page, title “Writing & notes,” “All articles” index link, page count with live announcement. Cards navigate as complete surfaces. Covers retain typographic titles while repeated cover metadata was removed.

Six short technical pieces establish active thinking, though several adjacent agent articles use a similar assertive failure/fix tone. The personal project notes help balance that voice but sit later chronologically.

**Recommendation:** keep the chronological list unless the owner chooses an editorial featured set. The index is the natural overflow route; do not add search/tag controls merely because there are 15 posts. Make each brief add information beyond its title rather than repeating its warning in different words.

### 10. Experience list and role dialogs

**Source observed:** four recent roles initially, four older roles behind a disclosure. Each row shows dates, title, company/location, and Expand; its dialog displays role bullets. Current primitives provide a common dialog implementation.

This is good progressive disclosure for a portfolio. The row needs to communicate credibility without requiring every dialog to be opened; title, employer, and dates meet that need. Repeated “Software Development Engineer” titles are distinguished by employers.

**Recommendation:** keep the chronology readable and preserve real role descriptions. Long dates and employer/location strings are the mobile pressure points. The role dialog should not obscure company identity behind a generic title. Do not add quantitative impact figures without source evidence. Article dates that appear inconsistent with these roles remain owner questions in `content-review.md`.

### 11. Contact introduction

**Source observed:** large “Let's build something together” treatment, supporting invitation, copy-email button, mail-app link, “Book a 15-minute call,” and resume action. Email contrast has been increased; the booking label is now explicit.

**Earlier visual observation:** the dark tile formed a strong ending, but its email alternative was excessively faint. Current source addresses the most useful text. Supporting copy and “something” remain deliberately softer.

**Recommendation:** preserve the large closing composition. Confirm the email fallback remains readable in the final render, especially for low vision. The copy failure message currently reaches assistive technology; ensure sighted visitors also get a clear failure state rather than an unchanged button. Avoid treating “Let's build” as a claim that the author is accepting any particular type of paid work.

### 12. Booking state

**Source observed:** booking grows within Contact, displays Pick a time, a fifteen-minute explanation, Back, and an external calendar embed. Focus moves to Back and is intended to return to the trigger. Escape returns to contact options.

**Earlier visual observation:** opening booking and using Back restored the original contact choices. No appointment was made and successful calendar availability was not established by that observation.

**Recommendation:** an unavailable third-party embed should leave Back and an email route obvious. Do not show a success promise before the provider confirms an appointment. The reassuring “No pitch deck required” line is appropriate; retain it only if it reflects the author's preferred interactions.

### 13. Resume modal

**Source observed:** desktop PDF iframe plus Open/Download actions; mobile explains the preview limitation and offers View PDF/Download. There is an explicit close control.

The fallback acknowledges a real platform constraint instead of forcing a broken inline viewer. However, a large minimum-height placeholder for two mobile actions spends space without providing resume content.

**Recommendation:** preserve reliable direct access; make the mobile fallback compact if a real-device check shows unnecessary scrolling. Check a short landscape viewport and the actual PDF URL. This review did not inspect the resume's contents or verify that download behavior is identical across browsers.

### 14. Homepage footer

**Source observed:** logo/home, six textual destinations, four social links, copyright. It shares the link records with the dock; records now use `/#...` destinations.

The textual navigation is a useful counterweight to the icon dock. The footer's extra vertical space is acceptable as a deliberate ending, but the persistent dock needs bottom clearance so it does not compete with these links.

**Recommendation:** preserve text labels and verify that all footer routes work from detail pages, not just from `/`. The “Read my blog” social-style link duplicates the footer's Blog destination; optional removal is low priority.

## Global navigation and global states

Source: `components/ui/dock.tsx`, `components/footer.tsx`, `lib/data.ts`, `app/layout.tsx`, theme components and shared UI primitives.

### Desktop dock

Current source uses real links rather than imperative scroll-only buttons, shares the canonical destination list with the footer, and derives Blog/Projects active state from pathname. That improves open-in-new-tab behavior and cross-page consistency. The logo and Home icon are redundant but familiar; removing one is optional.

Icon-only destinations still require recognition or tooltips. Preserve the dock's look, but ensure hover and keyboard focus both reveal labels and that current location remains visible in both themes. Do not claim icon-only navigation is inaccessible solely because labels are visually hidden; assess its actual names, focus, and discoverability separately.

### Mobile navigation

Source uses a popover with named links, theme control, close state, and breakpoint cleanup. This is a much clearer touch pattern than squeezing all icons into the phone width. Verify focus return, Escape, outside interaction, route changes, and rotation with the final implementation. The browser inspection for this document was desktop-only.

### Motion, theme, and loading

Entrances, card feedback, theme switching, and dialog transitions should reinforce continuity without delaying access to text. The main workflow is changing shared reduced-motion/hydration behavior concurrently; this document deliberately does not certify those changes. Test a fresh load, reduced motion, theme hydration, back/forward navigation, and a long page with overlays open. Retain covers and meaningful state feedback; remove only redundant nested movement.

## Writing index: `/blog`

Sources: `app/blog/page.tsx`, `components/blog/posts-grid.tsx`, `components/blog/blog-post-card.tsx`, `components/blog/post-cover.tsx`.

### Entry/back navigation

Back to Home is unambiguous and complements the persistent dock. The heading “Latest articles” matches descending date order, but includes short project notes as well as technical essays. “Writing & notes” would be a legitimate alternative if the owner wants one consistent vocabulary; changing it is optional.

### Introductory copy

The one-sentence description establishes engineering/product scope without making grand claims. It is more useful than another self-introduction here. Keep the author identity in the site system rather than expanding this into a second homepage hero.

### Editorial rows and covers

**Earlier visual observation:** cover/title duplication was obvious in the first row, and category/read-time repeated on each side. Current source retains the cover title as intentional visual identity and removes redundant cover metadata. The decorative generated cover is now hidden from assistive technology.

Keep the large covers. Their companion text should provide one date/read-time row, a clear semantic title, and an excerpt that helps choose a piece. It is acceptable for the same title to appear visually on a designed cover and next to it, provided it is not needlessly announced twice.

### Full list, ordering, and empty state

All 15 posts appear in the index. A long list is acceptable at this scale because each row is easy to recognize and the page has no competing filter/sort workflow. The newest technical posts dominate; project notes are farther down. If the owner wants those notes more discoverable, use a small editorial selection rather than building a new taxonomy UI.

“No posts yet. Check back soon.” is adequate for a genuinely empty list. It should not mask content-loading errors; there is no evidence this source currently distinguishes an editorial empty collection from a read failure in this UI.

### Footer and onward movement

Textual global links now inherit home-qualified routes. The archive itself needs no separate conversion banner; the site's global Contact action is sufficient. Readers should be able to return to the same list position through normal browser Back.

## Article template: `/blog/[slug]`

Sources: `app/blog/[slug]/page.tsx`, `components/blog/article-body.tsx`, `components/blog/table-of-contents.tsx`, `components/blog/reading-progress.tsx`, `components/blog/post-nav.tsx`, `components/blog/related-posts.tsx`, `lib/blog.ts`.

### Back link and heading

Back to Blog gives a clear exit. The h1 is strong and appropriately breaks long text. At the previously inspected checkpoint route, its long title needed several lines and the opening paragraph appeared below the large cover. **Keep that cover by owner direction.** Tune surrounding spacing and avoid extra redundant labels instead of shrinking the editorial image area.

### Tags, author, date, and reading time

Tags provide topic context; the author and publication date matter more on an article than on every archive row. Reading time is computed from words, so it is an estimate, especially for code and tables. Date claims remain historical facts requiring owner verification. Current metadata uses publication date for modification date as well; if substantive corrections are eventually published, introduce truthful revision metadata only when there is an actual revision date.

### Large editorial cover

The generated hero intentionally omits the duplicate title and serves as atmosphere/color identity. It now omits repeated category/read-time labels too. Preserve its 16:7 treatment. It is not a screenshot or evidence of the article's technical claims and should not be described as one. Adding invented diagrams or code screenshots to justify its size is unnecessary.

### Table of contents

The TOC appears only for two or more headings. This correctly avoids navigation scaffolding for brief project notes. Current TOC items are fragment links; desktop is sticky, mobile uses a disclosure and tries to focus the selected heading on closure. Test direct fragments, browser Back, code-highlight loading, and mobile panel closure. Long chapter labels need wrapping, not ellipsis. A highlighted first heading before it reaches the viewport is an orientation choice, not evidence the reader has reached it.

### Body typography and links

16px text, generous line height, bounded measure, and distinct headings support reading. Current source adds visible underlines to article links, improving discovery beyond hover. Inline-code pills should remain secondary to sentences; technical posts contain many commands and can become visually chopped up if every identifier receives too much weight.

### Code blocks and tables

Streamdown/Shiki provides a coherent dark code surface. Visually credible syntax highlighting increases the importance of accurate executable examples: the loop post's code is currently a pseudocode-like fragment labeled Python. See its draft correction. The phase-allocation table needs horizontal overflow containment on narrow screens and an explicit illustrative caption in the prose, not invented experimental authority. Code copy and table overflow require final rendered checks.

### Reading progress

Current source wraps the article body as the tracked target rather than measuring related cards and footer. This is a meaningful correction. For a short note entirely visible at once, progress may reach completion immediately; that is acceptable if it reflects the article, but a progress bar is not necessary to imply an extended reading task. Check semantic value and visual bar together after the final motion changes.

### Chronological navigation

“Newer article” and “Older article” now communicate the ordering better than Previous/Next. Empty boundary slots are not errors. The full adjacent title must remain usable even when the visual card clamps it. Chronological adjacency is not the same as subject relevance; the next block serves that different need.

### Related reads

Related posts are selected by tag overlap with recency fallback. Broad `AI Agents` tags can dominate, while articles with few matching tags may receive unrelated recent fallbacks. Use “More reading” if the section routinely contains fallback results; do not imply a semantic recommendation system. Avoid displaying an adjacent article twice if it also appears among related cards, unless the repetition is an explicit editorial choice.

### Article footer and global footer

View all posts is a good final escape to the collection. Repeated tags beneath related reading have limited additional value. The next destination should be clear without making the end of a one-minute note longer than the note itself. Keep the large covers; distill duplicated surrounding text and route choices before removing meaningful content.

## Every article page

Each entry is source-based unless marked otherwise. These observations concern the actual article sections, not just its shared template. Exact replacement passages remain in the linked draft section.

### A01. `/blog/checkpointing-agent-edits-without-touching-git-index`

Source: `content/blog/checkpointing-agent-edits-without-touching-git-index.md`. **Earlier local visual inspection** of this route confirmed its long h1, large cover, TOC, numbered procedure, and inline Git commands.

- **Opening:** the undo problem is immediately useful. “Full snapshot” promises more than Git-managed content, so the first paragraph needs scope precision.
- **Borrow git's index:** the five-step sequence gives the article substance. Separate creating an index path from creating an invalid empty index file, and distinguish ref management from working-tree restoration.
- **Why this beats the alternatives:** the tradeoff framing is clear, but the custom-ref invisibility claim conflicts with the mentioned `git log --all` behavior. Narrow it to keeping checkpoints out of the branch list.
- **General shape/end:** the reuse-of-primitives lesson is strong. A verified public implementation link would make the piece inspectable; none should be invented.
- **Action:** review [draft 1](content-review.md#1-checkpointing-agent-edits-without-touching-gits-index), including ignored files, restore semantics, and source attribution. Preserve the cover and reading hierarchy.

### A02. `/blog/skip-your-own-api-when-you-own-the-database`

Source: `content/blog/skip-your-own-api-when-you-own-the-database.md`.

- **Opening/brief:** the 123k-row and 120s/90ms comparison is a compelling reason to read; it is also an evidence-bearing claim, not decoration.
- **The fix:** the short `GROUP BY` query is the right scale for the explanation. The reader can see how server-side aggregation replaces pagination.
- **Own both ends:** ownership, permission, stable schema, and semantic equivalence are distinct. The current paragraph compresses them into “self-hosted,” which is too broad.
- **Fallback/end:** keeping the original path is reassuring, but falling back to a two-minute request is still a degraded experience. Explain bounded behavior without inventing implementation details.
- **Action:** [draft 2](content-review.md#2-skip-your-own-api-when-you-own-the-database) gives measured and nonnumeric alternatives. Verify benchmark conditions before changing or retaining exact claims.

### A03. `/blog/agent-stuck-detection-tool-loops`

Source: `content/blog/agent-stuck-detection-tool-loops.md`.

- **Opening:** the busy-but-stuck distinction is concrete. The brief's “rarely crash” is an unsupported frequency claim unless the author has data.
- **Failure shapes:** exact repeats, no-ops, and oscillation form a useful three-part list. A dynamic resource can change under identical arguments, so repetition cannot prove no new information is available.
- **Detector:** the code-like block deserves more precision than the prose because visitors may copy it. `hash` is called with two arguments and helper functions are unspecified; explicit pseudocode is the honest format.
- **Recovery:** escalating interventions are easy to scan. Disabling a tool can also block legitimate completion; present the intervention as a workflow policy, not a universal cure.
- **Action:** [draft 3](content-review.md#3-agents-dont-fail-quietly-they-loop) corrects the example and moves polling/retry exceptions into the interpretation of the signal.

### A04. `/blog/phased-agent-turns-gather-analyze-synthesize`

Source: `content/blog/phased-agent-turns-gather-analyze-synthesize.md`.

- **Opening:** budget exhaustion is clear and relevant; “never finishes” unnecessarily universalizes a failure mode.
- **Three phases:** good conceptual grouping. Gather/Analyze/Synthesize labels are understandable without inventing branded terminology.
- **Sizing table:** the numbers are memorable but visually resemble benchmark-backed guidance. State that they are illustrative unless evaluated.
- **Forced last mile:** “tools off, no exceptions” makes sense for a bounded research answer but can be wrong for implementation, verification, or externally waiting workflows.
- **Action:** [draft 4](content-review.md#4-give-multi-step-agents-a-finish-line). Preserve the table, qualify its authority, and distinguish a caveated report from completed execution.

### A05. `/blog/agent-working-memory-injection-hygiene`

Source: `content/blog/agent-working-memory-injection-hygiene.md`.

- **Opening/threat example:** the support-ticket command example makes the trust problem understandable. Keep that specificity.
- **Four rules:** provenance and permission boundaries are valuable; “neutralize imperative phrasing” should not be presented as a reliable security boundary. Size limits constrain resources, not attacker intent.
- **Durable memory:** the difference between one-turn and persistent consequences is a useful ending. Both require explicit trust handling; slower writes are not automatically safe.
- **Title/voice:** the current title is memorable, but “trust boundary” is a more accurate promise than sanitation if the body is corrected.
- **Action:** highest-priority editorial review, [draft 5](content-review.md#5-agent-scratchpads-need-sanitation-not-vibes). Avoid claiming deployed or tested defenses without evidence.

### A06. `/blog/agent-suggested-actions-as-tools`

Source: `content/blog/agent-suggested-actions-as-tools.md`.

- **Opening/failure explanation:** UI symptoms such as a missing button or exposed JSON connect implementation to a user problem.
- **Typed-channel example:** the two suggested actions demonstrate structure economically. A fetched record is evidence of existence, not authorization to act.
- **Validation section:** separating schema shape from target truth is strong; add execution-time permission/current-state checks.
- **Ending:** structured channels still need handling for partial streams and rejected calls. Replace the absolute durability claim without weakening the main argument.
- **Action:** [draft 6](content-review.md#6-dont-parse-follow-ups-out-of-the-reply). Keep the small example; do not expand it into an unrequested framework tutorial.

### A07. `/blog/progressive-tool-results-transcript-chunks`

Source: `content/blog/progressive-tool-results-transcript-chunks.md`.

- **Opening:** the long-document problem is recognizable. “The model skims” is explanatory language, not a measured mechanism; keep it modest.
- **Search/summarize/read:** the three-step sequence is a clean mental model. It should leave a direct route to source passages when exactness matters.
- **Budget section:** eviction policy should preserve load-bearing constraints and source pointers, not simply discard the oldest information.
- **Ending:** the progressive-disclosure analogy is useful and fits this site's product/engineering voice.
- **Action:** [draft 7](content-review.md#7-dont-dump-the-whole-document-into-the-context-window). Remove unsupported “most turns” frequency unless measured.

### A08. `/blog/openkvm-one-keyboard-two-macs`

Source: `content/blog/openkvm-one-keyboard-two-macs.md`.

- **Opening:** two physical Macs, different Apple IDs, and unreliable handoff give this note a concrete personal setting.
- **Build paragraph:** the public repository link is exactly where a curious reader needs it. The article has no subheadings, so no TOC is appropriate.
- **Technical paragraph:** TCP for keystrokes, UDP for pointer movement, Bonjour discovery, and an escape hotkey reveal actual design judgment in little space.
- **Ending:** “one desk” resolves the motivating problem. Keep the brevity and large cover; the note does not need artificial sections to look like a longer essay.
- **Action:** [draft 8](content-review.md#8-one-keyboard-two-macs) recommends mostly keeping it. An internal project-overview link is optional; the public repository already offers a useful destination.

### A09. `/blog/brik-react-to-native-widgets`

Source: `content/blog/brik-react-to-native-widgets.md`.

- **Opening:** SwiftUI extension friction is the right trigger, but “every team” overstates its reach.
- **Product introduction:** JSX-to-native compilation is the core idea. iOS/Android claims should describe supported cases, not imply parity for every OS feature.
- **Runtime explanation:** distinguishing generated native code from running a JS renderer in the widget is useful educational content.
- **Ending:** the native escape hatch makes the tradeoff credible; retain it.
- **Action:** [draft 9](content-review.md#9-native-widgets-from-react-without-leaving-jsx). Keep the note short and link verified package/repo documentation for implementation detail.

### A10. `/blog/ferry-apple-watch-mac-mic`

Source: `content/blog/ferry-apple-watch-mac-mic.md`.

- **Opening:** the already-worn Watch is a distinct personal reason for the experiment; it avoids a generic product pitch.
- **System description:** watch capture → transport → Mac input is understandable in one sentence. “Zoom and Voice Memos just work” should not become an unsupported compatibility guarantee.
- **Constraints:** battery, latency, and sample-rate mismatch are the most valuable part of the piece. Keep them; they demonstrate judgment without fabricated benchmark numbers.
- **Ending:** the studio-mic comparison is appropriately modest. No TOC is needed for this short note.
- **Action:** [draft 10](content-review.md#10-ferry-apple-watch-as-a-mac-mic), especially experiment wording and tested-environment questions.

### A11. `/blog/quivly-skills-agent-expertise`

Source: `content/blog/quivly-skills-agent-expertise.md`.

- **Opening:** QBR and CS are familiar to one audience but not every engineering reader. Expand once rather than removing domain specificity.
- **Artifact link:** the public skills collection gives the article a concrete anchor.
- **Prompt/skill contrast:** a saved prompt can also be versioned; distinguish packaged workflow material and portability rather than falsely claiming only skills persist.
- **Ending:** inviting contributions is appropriate if the author has the stated relationship to the project.
- **Action:** [draft 11](content-review.md#11-agent-skills-arent-just-prompts). Publication date precedes the portfolio's Quivly role start; request the author's chronology, not an automatic correction.

### A12. `/blog/mcp-gateway-for-team-tools`

Source: `content/blog/mcp-gateway-for-team-tools.md`.

- **Title:** “twelve” reads as a count, while the body supplies no count. Use it only if intentional and supportable, or choose nonnumeric wording.
- **Problem:** fragmented tool access is clear. The opening overstates that screenshots are the only route into every team's tools.
- **Architecture:** central policy and audit are useful goals; per-tool authorization remains necessary. Read-only reduces mutation risk but does not remove sensitive-data access risk.
- **Ending:** the refusal to expose internal wiring is a good boundary, not missing content to fill with private details.
- **Action:** [draft 12](content-review.md#12-one-mcp-gateway-beats-twelve-tool-logins). Clearly distinguish an architecture preference from a claim that a particular governed service is deployed.

### A13. `/blog/human-in-the-loop-agent-plans`

Source: `content/blog/human-in-the-loop-agent-plans.md`.

- **Opening:** “most demos” can be replaced with a personal question about ownership; the author's viewpoint is the value here.
- **Core statement:** propose/release is compact and understandable. The bold emphasis is sufficient; no extra UI decoration is needed.
- **Reviewable proposal paragraph:** change, evidence, and effect are the useful details. Keep all three.
- **Ending:** express this as an operating preference; do not imply a named product already enforces the policy.
- **Action:** [draft 13](content-review.md#13-agents-draft-humans-release). A complete opinion note does not need padded subheadings or a TOC.

### A14. `/blog/mobile-lessons-from-swiggy-scale`

Source: `content/blog/mobile-lessons-from-swiggy-scale.md`.

- **Opening/metadata:** the retrospective wording clashes with the displayed June 2025 date and the May–November 2025 Swiggy role. A later revision could explain it; metadata must be owner-confirmed.
- **Three lessons:** degraded states, platform differences, and persistent mobile releases form a coherent set, but read more generically than the author's project notes.
- **Sentence polish:** “Abstractions layers” is a straightforward typo. “Every unnecessary layer” is stronger than the evidence supplied.
- **Ending:** bringing production discipline to smaller teams is useful. A real non-confidential example could deepen this note; inventing one would damage it.
- **Action:** [draft 14](content-review.md#14-what-swiggy-scale-mobile-actually-taught-me). Preserve current date until chronology is resolved.

### A15. `/blog/self-hosted-personal-agent-fleet`

Source: `content/blog/self-hosted-personal-agent-fleet.md`.

- **Opening:** personal-OS framing makes a broad system legible, but “private by default” needs a defined boundary when external providers may be involved.
- **Pieces section:** gateway, partitioned memory, coordination, and specialists give the article an actual architecture. Distinguish deployed elements from design goals.
- **Proactive section:** consolidation, calibration, invalidation, and coordination are specific operational claims, not general filler. Their schedules and effectiveness need evidence if stated as running behavior.
- **Operations/end:** verified backups and failure paging are strong assertions. Do not infer them from configured jobs. The no-hostnames/no-schemas boundary is appropriate.
- **Action:** [draft 15](content-review.md#15-a-personal-agent-fleet-is-just-a-small-os) supplies a proposal-framed alternative and asks which behavior existed at publication versus today.

## Project template: `/projects/[slug]`

Sources: `app/projects/[slug]/page.tsx`, `lib/projects.ts`, `lib/data.ts`.

### Return link, category, position, and title

Back to Projects targets `/#projects`, now the featured group. A category eyebrow and position among 17 projects give context, but the position is editorial order, not a rank or accomplishment measure. The complete h1 carries identity even where the decorative cover uses only the first word.

### Source/public-link status

The template derives “Open source” from a nonempty GitHub URL and “Closed source” otherwise. A repository link alone does not establish a license; no link does not establish closed-source licensing. Treat these as presentation inferences pending owner review. “Public repository” / “Private overview” are more directly grounded if license status has not been verified. Absence of a public demo is a useful boundary but need not be the loudest fact about private work.

### Large typographic project cover

Preserve it. The first-word treatment works for OpenKVM, Ferry, Pulse, Tethr, and Altr. It is less discriminating across the four Quivly pages and two Moshi pages; their full h1 must stay prominent. Optional future refinement: use a verified short project name rather than the first token, without shrinking the cover or inventing logos.

### Overview text

The first sentence is pulled out visually and remaining sentences follow. This is the author's own description, not a testimonial; a blockquote can misleadingly resemble quoted endorsement. A styled lead paragraph would convey the same hierarchy without implied attribution. No change to wording is authorized by this review document.

### Technologies and context

The tags combine actual technology with privacy, workflow, and product categories. The section heading should accommodate that mixture. Numbered tags are decorative order, not proficiency ratings. Avoid presenting every tagged domain as a shipped integration.

### Actions and adjacent projects

Current labels distinguish releases/packages/design destinations. Public links should match what opens; a stored URL does not establish current uptime. Private pages correctly omit empty external actions. Previous/Next routes follow visible editorial order and exclude the three hidden records. A next-project link provides onward movement without forcing private pages to invent a demo.

## Every visible project page

All pages below use the shared template. Only OpenKVM had earlier local visual/DOM inspection; other entries are source-based. These are 17 distinct content reviews, not claims of 17 separately exercised browser journeys.

### P01. OpenKVM: `/projects/openkvm`

Record: `lib/data.ts`, OpenKVM. Public repository and GitHub release destination.

- **Heading/cover:** a single distinctive word makes the oversized cover appropriate. Earlier local UI labeled it Mobile & Platform; macOS utility is a more precise editorial category.
- **Overview:** sharing keyboard/mouse between Macs is clear; TCP/UDP, Bonjour, and different Apple IDs provide useful differentiation.
- **Context:** Swift/macOS/IOKit/Bonjour/Networking supports the description without implying unrelated integrations.
- **Actions/end:** current release label is more honest than Demo. A link to `/blog/openkvm-one-keyboard-two-macs` could add design rationale that the overview itself lacks. Verify releases separately before promising an installation experience.

### P02. Brik: `/projects/brik`

Record: Brik. Public repository and npm package destination.

- **Heading/cover:** short name is well suited to the large type system; category should communicate framework/SDK rather than a consumer app.
- **Overview:** JSX-to-native widgets is the strongest proposition. Live Activities/Dynamic Island are platform-specific and should not imply identical Android support.
- **Context:** SwiftUI/Compose/Expo tags are meaningful but do not prove every feature combination works.
- **Actions/end:** View package is appropriate. `/blog/brik-react-to-native-widgets` provides the compilation tradeoff; link it if more depth is desired. Scope “no Swift or Kotlin required” to supported cases after verification.

### P03. Ferry: `/projects/ferry`

Record: Ferry. Public repository, no demo URL.

- **Heading/cover:** the short name and macOS/watchOS context are legible; the visual treatment should remain an experiment identity, not an enterprise product launch.
- **Overview:** Watch audio becoming a Mac system input is a concrete outcome. “Experiment” is an important maturity qualifier.
- **Context:** Audio/Core Audio tags support technical interest without serving as performance evidence.
- **Actions/end:** source-only access is honest. `/blog/ferry-apple-watch-mac-mic` gives meaningful battery/latency caveats and is a better addition than inventing a demo button.

### P04. Quivly Skills: `/projects/quivly-skills`

Record: Quivly Skills. Public Quivly repository, no demo URL.

- **Heading/cover:** the full title differentiates it from other Quivly work; the first-word cover alone does not. Keep the full title close and readable.
- **Overview:** customer-engineering/post-sales workflows identify a real audience. “Production-ready” requires a support/validation basis not present in the record.
- **Context:** Agent Skills, Customer Success, Open Source are context categories rather than a stack; use an inclusive heading.
- **Actions/end:** repository access is enough for a collection. Link the matching article only after reviewing its date/contribution wording; do not claim personal authorship of the whole collection from the organization URL.

### P05. Quivly platform: `/projects/quivly-platform`

Record: Quivly platform. No public source/demo.

- **Heading/cover:** “platform” clarifies breadth but the shared Quivly cover can look identical to neighboring company work.
- **Overview:** founding-team work across product and supporting systems is truthful but broad. The privacy boundary is explicit and should remain.
- **Context:** TypeScript/AI Agents/Full Stack offers orientation, not an architecture diagram.
- **Actions/end:** a concise private overview is sufficient. If the owner can supply one approved responsibility or problem, it would add substance; do not manufacture metrics, screenshots, or integrations to fill the page.

### P06. Pulse: `/projects/pulse`

Record: Pulse. Private Quivly MCP gateway; no public actions.

- **Heading/cover:** Pulse is distinctive, but the title alone gives no domain; the description must immediately identify the gateway.
- **Overview:** consolidating tools/systems is understandable; confidential architecture/security/data are intentionally excluded.
- **Context:** “MCP” may need a brief expansion for nontechnical evaluators, without adding internal wiring.
- **Actions/end:** the general gateway article can be further reading, but must not be presented as a verified implementation report for Pulse. Preserve the difference between a public principle and private product facts.

### P07. Quivly design language: `/projects/quivly-design-language`

Record: Quivly design language. Private shared UI foundation.

- **Heading/cover:** long title wraps while the hero says only Quivly; make the full heading the primary identifier.
- **Overview:** components, interaction patterns, and consistency are distinct enough to establish the work, though no approved example appears.
- **Context:** Design Systems/React/TypeScript supports the topic. The surrounding portfolio's own design should not be mistaken for a screenshot of this private system.
- **Actions/end:** no demo is appropriate. An approved principle or before/after example could help only if supplied; do not reuse confidential tokens or assets to make the page richer.

### P08. Quivly agents: `/projects/quivly-agents`

Record: Quivly agents. Private workflow infrastructure.

- **Heading/cover:** another Quivly-first-word cover means the descriptor carries the distinction from platform/design language/skills.
- **Overview:** “turns context into operational work” explains direction but not a measurable outcome. Do not inflate it into autonomous execution claims.
- **Context:** AI Agents/Backend/TypeScript is useful orientation; there is no evidence of specific model/provider integrations in this record.
- **Actions/end:** keep the private boundary. General agent articles may demonstrate thinking, but are not evidence that their proposed control patterns are deployed in this product.

### P09. Tethr: `/projects/tethr`

Record: Tethr. Private personal project, no public links in the record.

- **Heading/cover:** distinctive name suits the large cover; the lead needs to carry product meaning because the name alone does not.
- **Overview:** attributable agent-written plans and human release decisions communicate a clear product principle.
- **Context:** collaboration and human-in-the-loop are capabilities/categories, not technologies. Do not equate them with specific available integrations.
- **Actions/end:** preserve the portfolio's current privacy classification. The human-release article is conceptually related, but its older date should not be interpreted as the project's launch date.

### P10. Moshi personal agent fleet: `/projects/moshi-personal-agent-fleet`

Record: Moshi personal agent fleet. Private personal infrastructure.

- **Heading/cover:** the long title is descriptive; Moshi alone on the cover overlaps with Moshi Health. Full heading and lead must explain the broader scope.
- **Overview:** the list of memory/research/messaging/tools shows breadth but can read as a capability inventory. Keep it bounded to actual record facts.
- **Context:** VPS/Multi-Agent Systems/Long-term Memory are relevant, but do not prove health, reliability, or privacy guarantees.
- **Actions/end:** no public demo is justified. The fleet article has operational claims under review; linking it should not make those claims verified by association.

### P11. Moshi Health: `/projects/moshi-health`

Record: Moshi Health. Private retrospective wellness surface.

- **Heading/cover:** full Health descriptor matters because the cover's first word overlaps with the fleet page.
- **Overview:** retrospective review and explicit non-diagnostic purpose are useful boundaries. Preserve them without turning the page into medical advice.
- **Context:** HealthKit/Apple Watch/SwiftUI explains the platform. “Glucose data” does not identify or authorize any particular device integration or public demonstration.
- **Actions/end:** do not add personal screenshots, readings, patient outcomes, or performance claims. An intentionally limited overview is the correct amount of public evidence here.

### P12. Altr: `/projects/altr`

Record: Altr. Private product/design exploration.

- **Heading/cover:** short name is visually strong but semantically opaque.
- **Overview:** this record deliberately discloses almost nothing beyond evolving product/design work. The reader cannot assess a concrete problem or contribution from it.
- **Context:** Product Design/Web remains broad. Avoid dressing these tags as a mature shipped stack.
- **Actions/end:** recommend deciding whether the named placeholder earns a full public detail page. Keeping it private/brief is acceptable; do not invent a product story simply to make the route feel complete.

### P13. HeroApp: `/projects/heroapp`

Record: HeroApp. Private co-founded mobile venture.

- **Heading/cover:** distinct name and mobile-venture lead provide enough identity.
- **Overview:** product design through technical direction to a working React Native app shows ownership breadth. It does not establish commercial traction or public launch.
- **Context:** React Native/Product Design/Mobile matches the stated work. “Private venture” is status, not technology.
- **Actions/end:** the Experience role can provide chronology. Do not add user counts, revenue, marketplace availability, or shutdown reasons absent owner evidence.

### P14. RCA Tool - Grafana Plugin: `/projects/rca-tool-grafana-plugin`

Record: RCA Tool - Grafana Plugin. No public source/demo.

- **Heading/cover:** acronym-heavy title and a first-word “RCA” cover need the lead to expand root cause analysis immediately.
- **Overview:** anomaly/service-disruption detection plus relevant telemetry communicates the workflow. “Resolve incidents faster” is an intended benefit, not a measured result here.
- **Context:** React/Grafana/TypeScript/Golang gives credible technical orientation without proving the detection approach.
- **Actions/end:** avoid implying public Grafana marketplace availability. If the owner supplies a shareable responsibility or constraint, add it; no invented dashboard screenshot or accuracy figure.

### P15. Zendash - Global Admin Dashboard: `/projects/zendash-global-admin-dashboard`

Record: Zendash - Global Admin Dashboard. Internal Zenduty work, no public links.

- **Heading/cover:** Zendash is a useful distinctive cover word; the long h1 gives the system's purpose.
- **Overview:** named Engineering/Customer Success/Marketing users and platform-health/activity/issue-resolution scope are more concrete than many private entries.
- **Context:** React/NextJS/TailwindCSS/GraphQL/Apollo supports the described interface work. “Global” does not establish worldwide usage or scale.
- **Actions/end:** keep internal data and screenshots private. A future approved account of one cross-team design decision would be more useful than generic scale claims.

### P16. ZepEats: `/projects/zepeats`

Record: ZepEats. Public repository and Expo URL.

- **Heading/cover:** short name works; the lead makes clear it is a food-delivery app rather than infrastructure.
- **Overview:** ordering, updates, and payment flow give a recognizable end-to-end scope. They do not prove a live commercial service or production payments.
- **Context:** Firebase/Google Cloud/Stripe signals implementation choices, not permission to demonstrate real financial transactions.
- **Actions/end:** the Expo destination may require a compatible client or no longer be live; verify it before promising a demo. If archived, accurately label the project as earlier work rather than hiding the limitation.

### P17. Cryptomedia - Cryptocurrency Tracker: `/projects/cryptomedia-cryptocurrency-tracker`

Record: Cryptomedia - Cryptocurrency Tracker. Public repository and hosted destination.

- **Heading/cover:** Cryptomedia is a distinctive cover word; the h1 and lead explain its tracker role.
- **Overview:** CoinGecko data plus a personal Firebase-backed watchlist supplies a concrete feature set. “Live data” needs current endpoint availability, not merely a stored URL.
- **Context:** React/ChartJS/MUI/Firebase/CoinGecko conveys a conventional earlier web project. Do not infer investment guidance or financial performance from a tracker.
- **Actions/end:** verify current demo operation, authentication, and stale-data handling separately. A broken upstream feed should not be presented as fresh market information.

### Intentionally hidden records

Devcord, Mereko App Concept Design, and Kanboard are present in data but excluded by `hiddenProjectTitles` and visible-route helpers. They are not three missing review pages and should not be reintroduced to satisfy a page count. Preserve that editorial choice.

## Not-found and error states

### Unknown route: `app/not-found.tsx`

**Source observed:** prominent 404, Page Not Found, a short human explanation, Go Home, and Browse Blog. This gives two useful exits without technical detail. “I forgot to update the link” adds personality but assumes a cause that may be unknown; optional replacement: “That page doesn't exist, or its address has changed.”

Keep the visual treatment consistent with the portfolio. Ensure the fixed global dock does not obscure the lower buttons on a short viewport. A missing article/project should reach this state, not an empty generic detail page. The error route itself was not individually rendered in this review.

### Runtime error: `app/error.tsx`

**Source observed:** Oops, Something went wrong, advice to retry or email, optional error ID, Try Again, and Go Home. Retry and a safe exit are good. The copy suggests email without a direct email action in this component, so a visitor must find Contact elsewhere.

**Recommendation:** if an email invitation stays, make the path obvious using the existing contact destination. Keep diagnostic IDs secondary and do not expose stack traces. A generic boundary cannot promise to preserve unsaved third-party booking state. Triggering real failures was outside this read-only editorial pass.

## Review priorities after the current shared fixes

1. Complete the main workflow's navigation, focus, hydration, reduced-motion, and responsive verification. Source-level changes are not final visual evidence.
2. Preserve the large covers and current identity. Address readable titles/descriptions, contradictory labels, and repeated metadata around them.
3. Review the 15 article correction drafts, starting with security/technical accuracy and chronology. No dates or factual claims should be silently rewritten.
4. Keep private project pages honest about their limited public evidence. Do not invent case studies or surface hidden records.
5. Verify old external demos and document actual availability before labeling them live. This review supplies questions, not fabricated uptime checks.

The result should remain recognizably the same portfolio: easier to navigate, clearer about what each page offers, and more precise about what the author has built, observed, proposed, or chosen to keep private.
