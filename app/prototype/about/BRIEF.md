# About prototype

Mode: Experience. Local extension of the existing portfolio identity, not a new visual world. Owner chose a balance of personal story and how they think/build. Finalized on the homepage on 21 September 2026; the isolated route now renders the same component.

## Finalization, 21 September 2026

Supersedes the provisional status below. The owner requested finalization after review of both reports in `mukulchugh/portfolio-research-dossier` at `99808ac5`. The approved headline and introduction remain. Three work examples link to Brik (explicitly beta), ZenDash (team contribution), and ctxr. The longer story now covers early design/freelance/HeroApp work, Zenduty/Swiggy/Quivly experience, and expanded scope with AI. Public-profile coffee wording supplies one personal detail. No disputed dates, metrics, sole-ownership assertions, or confidential anecdotes were added.

Canonical longer copy lives in `lib/data.ts`; `components/about.tsx` and `components/about.module.css` serve both routes. Existing shared Button/Dialog and Syne/Geist styling are reused. The card is its own inline-size container so text stacks appropriately beside Experience at intermediate widths. No new assets, dependencies, or shared design rules. Other site metadata and experience claims remain outside this pass.

Validation: `.scratch/check-about-home.mjs` passed light/dark at 1440/768/390/320, all selections and links, modal scrolling, Escape/focus return, horizontal overflow, and page errors. Desktop, intermediate, mobile, and modal screenshots inspected. The intermediate-width correction was visually confirmed. Initial isolated-route check hit a transient dev compilation timeout during the file move; `.scratch/check-about-study.mjs` passed on confirmation. TypeScript and scoped Biome checks passed. No server operations, commit, push, or deployment.

## Historical prototype notes

## Direction contract

THESIS: A personal introduction connected to concrete work, not a second experience timeline.

Owner-approved copy update: “The tools changed. I raised the stakes.” The introduction now connects the engineering foundation and mobile/product/design experience to broader ambition with AI. This replaces the code-first opening; no VPS memory has yet been read and no claims are attributed to it.

Expanded biography now follows three short chapters: engineering foundation, expanded scope with AI, and preference for small teams/end-to-end involvement. Work history and project examples come from existing portfolio content. Personal framing is review copy, not a quotation from the inaccessible VPS memory. Canonical biography and homepage remain unchanged.

OWN-WORLD: Existing Syne headings, Geist reading text, neutral satin bento surface, uniform thin border, restrained lime selected-state accent. No new imagery or dependency.

STORY: Meet Mukul, understand his mobile/full-stack foundation and product/design involvement, then explore a real example or read the established biography.

FIRST VIEWPORT: A compact editorial headline and two personal paragraphs above three selectable areas of work. One quiet evidence panel changes beneath them. The biography action anchors the bottom.

FORM: Local section refinement; no concept seed required. Native shared buttons control an explicitly labelled region. Existing Base UI dialog keeps the approved expanded biography behavior. Copy is a review draft derived from lib/data.ts, not a change to canonical claims.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Review and validation

Independent finish review: ship as an isolated review prototype; production/content approval remains pending. All six desktop/390px/320px light/dark captures reviewed. No blocking visual finding. How the owner thinks remains implied rather than specific, pending relevant personal-agent memories. Existing floating dock presence in full-page captures is not proof of inaccessible content.

Browser checks passed the three area selections, modal opening, Escape, focus return, both themes, horizontal overflow and page errors. TypeScript and scoped lint passed. Fieldset semantics replaced a generic group after screenshots. Existing DESIGN.md was reviewed; this local extension does not warrant changing shared design-system rules. No new raster assets, dependencies, or canonical biography edits. Homepage unchanged.
