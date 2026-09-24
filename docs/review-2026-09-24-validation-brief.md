# Brief: validate the 2026-09-24 codebase review, then plan the fixes

You are working in `/Users/mukulchugh/portfolio-motion` (Next 16.3, React 19, Tailwind 3, bun).

A prior review produced the claims below. **Treat every one as unverified.** The
review was taken at a point in time and the tree has already moved since (`bun fix`
has run, at minimum). Your job has two phases, in order. Do not start Phase 2 until
Phase 1 is complete.

## Rules

- **Re-baseline first.** Before validating anything, record the current state:
  `git status --short | wc -l`, `npx tsc --noEmit`, `npx ultracite check`,
  `npx next build`, `bun run test:ui`. Any claim whose numbers disagree with what
  you measure is **STALE**, not necessarily WRONG — say which.
- **Evidence or nothing.** Every verdict cites the command you ran and its output.
  No verdict from reading source alone where a command could settle it. If a claim
  needs a running server, build and `next start` on a spare port and probe it.
- **Verdicts are one of:** `CONFIRMED` (reproduced), `REFUTED` (measured the
  opposite — say what the reviewer got wrong), `STALE` (was true, already fixed),
  `PARTIAL` (true in part — state which part), `UNVERIFIABLE` (say why).
- **Do not fix anything in Phase 1.** Not even one-liners. Validation and repair
  in the same pass is how a wrong claim becomes a wrong commit.
- Do not commit, push, or `git checkout`/`restore`/`stash` anything. There are ~130
  uncommitted files including an entire unpushed feature; treat the working tree as
  precious. If a validation step would dirty the tree, do it in
  `git worktree add` or a scratch copy and say so.
- Ponytail `full` applies (see `CLAUDE.md`): when you get to planning, the smallest
  correct change wins. No new dependencies, no abstraction for one caller.
- `AGENTS.md` is real: this is not the Next.js in your training data. Check
  `node_modules/next/dist/docs/` before asserting any Next API is wrong.

---

## Phase 1 — validate

Work through these. Group them however is efficient; report them in this order.

### A. Claimed blockers

| # | Claim | How to settle it |
|---|-------|------------------|
| A1 | The whole SEO/LLM surface is uncommitted: `app/og/`, `app/llms.txt/`, `app/llms-full.txt/`, `app/markdown/`, `lib/seo.ts`, `lib/public-content.ts`, `scripts/check-seo.ts` are untracked; staging is mixed (`public/MukulChughCV.pdf` deleted staged, `components/ui/cv-modal.tsx` deleted unstaged). | `git status --short`, `git ls-files` on each path. Count tracked vs untracked. |
| A2 | `public/llms.txt` shadows `app/llms.txt/route.ts`, so the generated index is never served. Static copy is stale (2 projects vs 36 documents; uses framing from a post that `next.config.js` now redirects away). | `next build && next start -p <port>`, then `curl -sI` and `curl -s` on `/llms.txt`. Compare byte length to `public/llms.txt`. Decide by **headers**: the route sets `X-Content-Type-Options: nosniff`; the static handler sets `Last-Modified`/`ETag`/`max-age=0`. |
| A3 | `sharp` is imported directly by `app/og/[...path]/route.tsx` but is not in `package.json` — it resolves only as Next's transitive `optionalDependency`. | `grep -n sharp package.json`, `node -e "console.log(require.resolve('sharp'))"`, and find `sharp` in `bun.lock` — is it a direct entry or only under `next`'s `optionalDependencies`? |
| A4 | `quality={90}` in `components/intro.tsx` is ignored because `images.qualities` is unset in `next.config.js`. | `grep -n qualities next.config.js`; run `bun run test:ui` and look for the `next-image-unconfigured-qualities` warning; confirm against `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/images.md` whether Next 16 ignores or errors. |

### B. Claimed architecture / performance findings

| # | Claim | How to settle it |
|---|-------|------------------|
| B1 | `components/ui/dock.tsx` eagerly renders About + Blog + Experience + Projects + Contact in the root layout, so **every** route's HTML carries all five. Measured: `/contact` was 110 KB HTML, 87 KB (78%) RSC flight payload, containing all 15 blog titles and all 4 experience companies. | Against a running prod build, `curl -s /contact` and grep for strings that exist *only* on other pages (e.g. `KubeCon India`, `Grayscale AI Week` from `experiencesData`; `Notes from the work` from the blog index). Measure total bytes and the share inside `self.__next_f.push(...)`. Repeat on `/about` and one `/blog/<slug>`. |
| B2 | `components/blog/article-body.tsx` is `"use client"` while passing `mode="static"` to Streamdown, shipping ~372 KB of shiki to the browser across 2 chunks (13.3 MB / 347 client chunks total). | Grep `.next/static/chunks/*.js` for shiki markers (`github-dark-default`, `bundledLanguages`) and sum the sizes of matching chunks. Then confirm from the Streamdown docs whether `mode="static"` genuinely needs a client boundary. |
| B3 | `components/home-bento.tsx` is `"use client"` solely for `useSectionInView`, pulling About/Experience/BlogSection/ContactSection/ProjectSlider and the 830-line `Rebound` game into the client tree, and running `getShowcaseProjects()` at client module scope. | Read the file; confirm `useSectionInView` is the only client-only API used. Confirm `rebound` appears in the client chunks. |
| B4 | 57 of 84 non-prototype `.tsx` files are `"use client"`, including `components/ui/separator.tsx`, which has no hooks and no interactivity. | Count `"use client"` in the first 3 lines across `app` + `components` excluding `prototype`. Open `separator.tsx` and any others that look gratuitous. |
| B5 | `dock-navigation.tsx` `sample()` calls `document.elementsFromPoint` ×3 plus `getComputedStyle` in a loop on every rAF during scroll — three forced layouts per frame, on every route. | Read `components/navigation/dock-navigation.tsx` around the `sample`/`schedule` functions. If you can, profile it; otherwise state it as a read-verified cost, not a measured one. |
| B6 | `/llms-full.txt` is ~quadratic: `publicDocuments()` is re-invoked once per document (~37×) and each article calls `getPostServer` → `readAll(true)`, re-parsing all 15 posts to ASTs. `readAll` has no memoization, and a single blog post render triggers 3 full directory reads. | Instrument `lib/blog.ts` `readAll` with a counter (in a scratch copy) and render `/llms-full.txt` and one blog post. Report actual call counts, not estimates. |

### C. Claimed asset problems

| # | Claim | How to settle it |
|---|-------|------------------|
| C1 | `public/` is 190 MB / 160 files (119 PNGs); `.git` is 264 MB; `public/design/projects` 100 MB, `public/design/articles` 52 MB; all tracked. | `du -sh public .git`, `find public -type f \| wc -l`, breakdown by extension and subdirectory, `git ls-files public \| wc -l`. |
| C2 | 24 MB of orphaned article covers: 14 PNGs at 1.5–2.2 MB referenced only by `docs/visual-evidence-ledger.md`, superseded by the `-reference` variants. | For each `public/design/articles/*.png`, grep for the basename across `app components lib content scripts` (code) separately from `docs` (ledgers). List the ones with zero code references and sum their bytes. |
| C3 | ~9 MB of png/webp duplicates where the webp is in use and the png has zero code references: `chrome-ribbon`, `agent-loop-home-reference`, `database-layers-home-reference`, `location-map`, `quivly-skills-v2`, `cryptomedia-…-reference`. | Find every `.webp` with a same-stem `.png`; for each, grep the `.png` basename across code. Report sizes both ways. |

### D. Claimed quality-gate problems

| # | Claim | How to settle it |
|---|-------|------------------|
| D1 | `bun run check` fails. **Known stale:** at review time it was 96 errors incl. 4 substantive; `bun fix` has since run and it is ~10 auto-fixable cosmetics. | Re-run and report the current number and rule breakdown. Confirm the previously-flagged substantive ones are gone: unused `siteConfig` import in `app/experience/page.tsx`, missing `default:` in the `lib/public-content.ts` switch. |
| D2 | 26 of 33 scripts in `scripts/` are orphaned — not referenced by any `package.json` script. The orphans include `scripts/check-seo.ts`, the most thorough check in the repo (47 pages, canonicals, markdown parity, 1200×630 OG assertions), and it passes. | Diff `ls scripts` against the scripts referenced in `package.json`. Run each orphan with `bun` and record pass/fail/needs-server. Note that `check-seo.ts` needs `bun`, not `tsx` (top-level await). |
| D3 | HEAD's `scripts/check-writing-covers.ts` asserts the pre-OG-route expectation (`openGraph.images === [getPostCoverSrc(post)]`), so the committed tree's suite is stale and nothing gated the OG migration. | `git show HEAD:scripts/check-writing-covers.ts` and compare to the working-tree version. If you can do it without disturbing the tree, run the suite against a HEAD worktree. |
| D4 | `check-seo.ts` asserts only that `/llms.txt` returns 200, which is why it cannot catch A2. | Read the relevant loop. If A2 is CONFIRMED, this one follows. |

### E. Claimed domain-modeling problems

| # | Claim | How to settle it |
|---|-------|------------------|
| E1 | "Project" is spread across 7+ slug-keyed registries in 5 files (`projectsData`, `hiddenProjectTitles`, `showcaseProjectSlugs`, `projectCollections`, an inline `summaries` map in `getShowcaseProjects`, `projectDetails`, `overviewTitles`/`overviewBodies`/`focusPanels`, `projectArtwork`, `projectReferenceAssets`, `technologyIcons`) with no type-level link. | Enumerate every slug-keyed structure and its file. Then answer concretely: **to add one project, which files must be edited, and which omissions would fail silently rather than at compile time?** Prove it — try adding a throwaway project in a scratch copy. |
| E2 | `app/projects/[slug]/page.tsx` contains 24 `slug === "…"` branches with hardcoded copy ("Your health over time.", "Memory. Research. Reflection.") and hardcoded image paths. | `grep -c 'slug === "'`. List the distinct slugs and what each branch changes. |
| E3 | `refinedArticleSlugs` in `components/blog/post-cover.tsx` contains exactly the 15 slugs in `content/blog`, so the `-reference` branch is universally taken and the Set decides nothing — and post 16 will silently get a non-existent cover path. | Diff the Set's contents against `ls content/blog`. Then prove the consequence: add a 16th markdown post in a scratch copy and see what `getPostCoverSrc` returns and whether that file exists. |
| E4 | Per-post presentation lives in components rather than frontmatter — `lightHero` (4 slugs) and an inline `<figure>` for `mobile-lessons-from-swiggy-scale` in the blog route; `diagramKind` (2 slugs) and a figure for `agent-working-memory-injection-hygiene` in `article-body.tsx`; `articleSectionDiagrams`/`shortArticleDiagrams` in `article-diagrams.tsx`. Five slug-keyed registries across three files. | Locate each. Confirm the count of files and registries. |

### F. Claimed smaller items — batch these, one line of evidence each

1. `.env.example` documents `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_ADSENSE_ID`, `CONTACT_EMAIL`, `NEXT_PUBLIC_SITE_URL` and **none are read**; GA ID, email and site URL are hardcoded in `lib/data.ts`. (`grep -rn "process\.env" app components lib` — expect only `NODE_ENV`.)
2. Dead `siteConfig` keys: `images.ogImage`, `social.blog`, `firstName`, `lastName`, `locationFull`. The `keywords` comment claims "used in JSON-LD" but `components/json-ld.tsx` doesn't use it.
3. Six zero-reference exported types in `lib/types/index.ts`: `SkillCategory`, `SkillSet`, `CardItem`, `ChildrenProps`, `ClassNameProps`, `BaseComponentProps`. `ActiveSectionContextType` is declared there *and* in `context/active-section-context.tsx`; only the local one is used. `lib/types.ts` is a compat shim with one importer (`lib/hooks.ts`).
4. `app/blog/layout.tsx` exports `metadata` that the page's `staticMetadata` always overrides — dead, and a second source of truth for the same title string.
5. `revalidate = 3600` on both blog routes over filesystem content that only changes on deploy.
6. `priority` (deprecated in Next 16 per its own docs) used 14× vs the new `preload` 6× — half-migrated. Confirm the deprecation in `node_modules/next/dist/docs/.../image.md` before acting.
7. `components/analytics-wrapper.tsx` gates GA behind a 2.5 s `setTimeout`, losing pageviews for sessions shorter than that.
8. `generateStaticParams` in the blog route caps at 20 posts (`getPostsServer(20)`).
9. `app/globals.css` opens `:root` three times (~13, ~564, ~879), `.dark` twice, and `@layer base`/`components` five times across ~1013 lines.
10. `lib/hooks.ts` `useSectionInView` takes a `_threshold` parameter it never uses.

### Phase 1 output

A single table: `#`, claim in ≤10 words, verdict, the command that decided it, and the
measured value. Then three short lists: **REFUTED** (with what the reviewer got wrong),
**STALE** (already fixed, by what), and **worse than claimed** (anything you found while
validating that the review missed).

Also state explicitly what the review did *not* cover and you did not check:
`rebound.tsx`, `experience-tile.tsx`, `cta-tile.tsx`, `contact-section.tsx`,
`capabilities.tsx`, `intro.tsx`, most of `components/ui/`, all of `globals.css`,
and the internals of the 26 orphan scripts. Say whether any of those deserve a pass.

---

## Phase 2 — plan, don't build

Using only CONFIRMED and PARTIAL findings, write a long-term plan.

Shape it as **tracer-bullet tickets** under `.scratch/portfolio-review/issues/`, one
markdown file per ticket, per `docs/agents/issue-tracker.md`. Each ticket:

- **Problem** — the confirmed finding with its measured evidence.
- **Change** — the smallest correct fix. Ponytail applies: no new dependency, no
  abstraction with one caller, deletion over addition.
- **Blocking edges** — which tickets must land first, and why.
- **The check it leaves behind** — the runnable assertion that fails if this
  regresses. Prefer extending an existing `scripts/check-*.ts` over adding a file.
  Several findings exist *because* no check covered them (A2, D3, E3) — for those the
  check is the deliverable, not an afterthought.
- **Risk** — what could break, and how you'd know.

Sequence them, and say why in that order. Expect roughly this shape, but let your
own verdicts drive it:

1. **Protect the work first.** A1 blocks everything — a repo with an entire
   uncommitted feature cannot safely absorb refactors. Propose how to get it
   committed in reviewable pieces (not one 133-file commit), and resolve the mixed
   staging. Ask before running any git command that writes.
2. **Then the cheap correctness wins** — A2, A3, A4, and the `bun fix` residue. Each
   is small, independently verifiable, and A2 is currently serving stale content to
   the exact audience it was built for.
3. **Then the check-coverage gap** — D2, D3, D4. Wiring `check-seo.ts` in makes every
   later change safer, so it comes before the refactors, not after.
4. **Then the measured performance work** — B1 first (largest, and it needs a real
   design decision about how the dock gets its page content: lazy RSC fetch, a
   client-side route prefetch, or dropping the preview and navigating). B2 and B3 are
   mechanical once B1's boundary question is answered.
5. **Then assets** — C1–C3. Mostly deletion; note that removing tracked blobs shrinks
   the deploy but not `.git` without history rewriting, and say plainly whether you
   think a rewrite is worth it for a solo repo.
6. **Last, the modeling work** — E1–E4. Highest churn, lowest urgency. Propose one
   consolidated project record and one frontmatter contract for post presentation,
   and be explicit about what you would *not* generalize.

For B1 specifically: do not pick an approach unilaterally. Lay out the two or three
real options with their costs and name your recommendation, then stop and ask.

### Phase 2 output

The ticket files, plus a one-page summary: the sequence, what each stage buys, the
open questions that need Mukul's decision before work starts, and a rough size per
stage. Do not begin implementing any ticket until he picks the starting point.
