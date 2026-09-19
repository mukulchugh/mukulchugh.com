# Portfolio recovery checkpoint

Status: draft review, not release-ready. Recorded 2026-09-20.

The existing editorial design was recovered rather than restarted. The approved page references remain the visual authority, with the owner's overrides: symbol navigation logo, illustrated portrait in the hero, smaller headings, correct official branding, calmer spacing and softer card corners. The 17 project routes, 15 original Markdown articles, real links, themes, booking and resume behavior remain in scope.

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

## Known remaining work

- Finish loaded-image screenshot review of every route at the required desktop/mobile sizes. Some initial captures contained lazy images that had not loaded; nine article captures still needed replacement at this checkpoint.
- Improve official Quivly icon contrast in the agents workflow, agent glass card and Design Language specimen. Dark artwork currently sits on dark surfaces. Review the conspicuous white logo plate in the Skills supporting artwork as well.
- Repair article grids that place only the first paragraph beside a tall diagram, leaving an empty text column while the explanation continues below. Known cases: progressive tool results, personal agent fleet, checkpointing and suggested-action side channels.
- Complete the remaining interaction, keyboard, reduced-motion, theme and actual error/retry checks. Do not infer those results from a successful build.
- Keep factual content corrections in [content-review.md](content-review.md) as owner-review drafts. They are not applied replacement facts.

Only retained production artwork and attribution records are included in the PR. Unused artwork, operational scratch files, old screenshots and historical design scores remain local. No merge or deployment is authorized by this checkpoint.
