# Project content research

Reviewed 20 September 2026. Public sources only; private repositories and company
documents were not inspected. Product-site descriptions establish positioning,
not independent proof of adoption, outcomes or shipped implementation.

## Altr and Tethr

- [Altr](https://altr.run): replaced the vague exploration description with its
  execution-workflow positioning. Preserved early-access status. Omitted pilot
  logos, testimonials, performance numbers and security-certification claims.
- [Tethr](https://tethr.cc): corrected the agent-written-plan framing to shared
  planning. Distinguished the private-alpha review/release loop from planned
  skills and hooks. The live page explicitly says Tethr runs no LLM internally.
- Added public-site links, labeled “Visit website”, not “View demo”.
- Kept existing illustrative artwork labeled as concept imagery.
- No claims about personal ownership scope, usage or business outcomes added.

## Public GitHub inventory

Queried all public repositories for `mukulchugh` through GitHub's API, excluded
forks, and checked README files plus repository trees for the strongest candidates.
These are editorial recommendations, not claims of production readiness. The
implementation follow-up below records the projects now added locally.

| Candidate | Evidence and proposed description | Recommendation |
| --- | --- | --- |
| [Agent workflow skills](https://github.com/mukulchugh/skills) | Portable plugins for Codex, Claude Code and Cursor: work setup, evidence-backed PR walkthroughs and product briefs. README, plugin manifests, Python scripts and validation workflow are present. | Strongest addition. Shows developer-tool and review-workflow design; distinct from Quivly Skills. |
| [Hermes Memory](https://github.com/mukulchugh/hermes-memory) | A Hermes dashboard plugin for exploring Honcho memory through a relationship graph, searchable facts, pipeline status and memory queries. README, backend router and frontend assets are present. | Strong addition. A concrete, public companion to the broader private Moshi work. Use synthetic data in screenshots. |
| [GitHub Profile Explorer](https://github.com/mukulchugh/github-profile-explorer) | Search profiles, compare users and save watchlists. README, screenshot, React components and data hooks are present. | Good supporting project. Name it GitHub Profile Explorer rather than GitBook to avoid confusion with the documentation product. Live demo not behavior-tested. |
| [EIL Conference website](https://github.com/mukulchugh/eil-website) | Repository describes an education/career-counsellor conference landing page; contains index.html. | Optional visual/client-work case study after confirming personal scope and capturing the actual page. |
| [Renewal Rush](https://github.com/mukulchugh/renewal-rush) | README identifies a work-in-progress Unreal marketing game and marks the license proprietary to Quivly. | Hold. Confirm permission and playable scope before showcasing, despite repository visibility. |
| [Hostville](https://github.com/mukulchugh/hostville) | Repository description suggests a vacation-rental marketplace; README contains only a title. | Hold for implementation and ownership review. Too little evidence for a strong case study. |
| [EventMiner](https://github.com/mukulchugh/EventMiner) | README describes event extraction, but the repository tree contains only README and LICENSE. | Do not present as a built product on this evidence. |

OpenKVM, Brik, CryptoMedia and ZepEats are already represented. Devcord and Kanboard
are intentionally hidden in the existing portfolio; do not re-add silently.
Internal-docs, profile README repositories, samples and generic starter exercises
are not recommended as new portfolio entries.

## Implemented follow-up

Added seven code-backed entries: Agent workflow skills, Hermes Memory, GitHub
Profile Explorer, Memo, Hostville (hostville-app), EIL Conference, and Gym Center.
Additional reads covered Memo's form hook/PDF component, Hostville's reservation
handler, Gym Center's router, EIL's HTML, and Hermes Memory's backend. Repository
trees were also checked for OpenKVM, Brik, CryptoMedia, and ZepEats context.

There are now 24 visible projects. Every detail page has workflow, implementation,
scope/status, and available public-reference content in lib/project-details.ts.
Private projects are limited to previously supplied scope; no internal repository
was opened. New projects have honest workflow summaries instead of fake screenshots.

The homepage hierarchy is explicit in lib/projects.ts:

- Independent products: ten entries, two already featured above the index.
- Quivly: five related workstreams, including the public Skills project.
- At Zenduty: two professional projects, kept separate from small experiments.
- Smaller work & experiments: seven compact entries, collapsed initially.

Collection membership is separate from featured placement. Detail pages link to
siblings and keep next/previous navigation within their collection. Source checks
assert that each visible project belongs to exactly one collection and has details.

Remaining exclusions: EventMiner and OpenBNPL have no implementation in the inspected
trees; Renewal Rush remains proprietary/WIP pending permission; internal-docs is not
appropriate portfolio evidence; profile repositories, starter themes, samples,
password-generator and Pokemon-App do not add enough editorial depth to this set.
Existing hidden projects stay hidden. The older hostville repository is not duplicated.

No new adoption, revenue, performance, sole-authorship, or production-readiness
claims were added. All descriptions distinguish code evidence from operational proof.
