# Writing study

## Homepage promotion

The owner approved homepage integration. The approved implementation now lives in `components/blog/writing-section.tsx` and `writing-section.module.css`, shared by the isolated route and `components/blog-section.tsx`. The homepage wrapper preserves `#blog` and active Writing navigation tracking, with section spacing rather than another outer card. All three featured tiles, infinite article batches, keyboard feedback and reduced-motion behavior are retained. Previous isolation-only notes below describe the earlier stages. Run `WRITING_URL=http://localhost:3000/#blog node .scratch/check-writing-infinite.mjs` to verify the homepage integration.

Mode: Experience. Development-only, noindex route `/prototype/writing`.

Initial isolation renders the existing homepage Writing section with the same local posts, featured artwork, typography context, and links. No redesign or homepage changes in this step. The current section is the baseline, not a newly approved direction. Before exploratory edits, keep the study implementation local to this route so unapproved changes do not reach the homepage. Preserve the owner's preference for large editorial covers.

## Approved direction and implementation

The owner chose Concept C, then specified three vertically stacked existing-style tiles on the left and a wider paginated text list on the right. Their supplied screenshot pins integrated title-left/artwork-right tiles, metadata bottom-left and arrow top-right. Do not replace these with image-above-title cards.

THESIS: Three illustrated entry points beside a readable archive, not a carousel or a second card grid.
OWN-WORLD: Existing Syne/Geist, thin real borders, 14px corners, neutral satin surfaces; dark loop/Mac tiles and pale database tile retain their own palettes in either theme.
STORY: Meet the author's range through featured stories, browse the remaining essays four at a time, then follow normal article links.
FIRST VIEWPORT: Shared heading and All articles link; 46/54 columns, three integrated editorial tiles, four title/summary rows with pagination below. Below 900px, stack columns without truncating content.
FORM: User-selected C with explicit composition and existing-tile overrides. Reference: `/Users/mukulchugh/.codex/generated_images/01a0b9cc-927c-7a82-9592-47846625abc1/exec-6f781413-37fe-4003-93bc-c8b8e72c4cc3.png`. Generated dates/summaries are superseded by canonical post metadata; Mac artwork reuses the existing local article asset, not the generated preview's different photograph.

Scope: `writing-study.tsx` and its CSS module remain local to this development-only route. Homepage unchanged. Shared Button handles pagination. No added dependencies, no automatic advancement. Pagination has current/disabled states, keyboard activation, a polite page announcement, and reduced-motion behavior. Canonical briefs are shown in full rather than truncated to match illustrative copy.

## Verification

Motion pass: featured artwork gently enlarges within its existing clipped tile on hover or keyboard focus; arrows acknowledge focus and press. Archive rows receive a quiet hover/focus wash. Only appended batches animate, with a capped 105ms sibling stagger, preserving already-read rows and scroll position. Reduced motion removes spatial movement while retaining visible focus and color feedback. The archive ends with plain text rather than a disabled control. No new dependencies or homepage changes. Updated infinite-scroll check covers keyboard feedback and reduced motion alongside pagination, uniqueness, panel stability and both themes at 1440/320px. Scoped Biome and TypeScript pass; this is not a measured 60fps or Safari certification.

Latest owner override: replace numbered pagination with a bounded scroll panel that appends the next four articles within 120px of the bottom. Existing rows are retained, without resetting scroll or remounting the list. Three featured tiles continue to determine the desktop panel height; mobile gets a 75dvh panel capped at 748px. Native keyboard/touch/wheel scrolling is preserved. A Load more button is retained as an accessible fallback, becoming a disabled end-state message once all local articles are shown. This is incremental rendering of local post data, not network pagination. `.scratch/check-writing-infinite.mjs` supersedes the earlier numbered-pagination interaction checks.

Scoped Biome and TypeScript passed. `.scratch/check-writing-study.mjs` covers 3 featured tiles, 12 unique other articles over 3 pages, pagination boundary states, keyboard activation, loaded feature assets, no horizontal overflow/page errors, and reduced motion. Captures: `.scratch/writing-{light|dark}-{1440|768|320}.png`. The page retains the existing global dock/footer; those are not part of the Writing redesign. Homepage `components/blog-section.tsx` was not edited in this implementation (its pre-existing worktree changes are preserved). No dev-server changes, commit or deployment. These checks do not certify Safari, real-device interaction or sustained frame rate.
