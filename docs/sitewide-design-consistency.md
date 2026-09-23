# Site-wide design consistency

The homepage is the shared visual reference. Dedicated routes retain their editorial content and project-specific artwork, while navigation and conversion components share implementations.

- `PageShell` supplies the same BrandBar and ContactSection to About, Projects, Experience, the writing layout, project detail pages and the 404 page. Contact opts out of the extra CTA because its main content already is that component.
- Header copy, desktop/mobile navigation, active-route indication and underline motion are shared. The legacy Build/Learn/Ship decoration is removed everywhere.
- Homepage control sizing and header styling apply globally. Syne headings, Geist body text, uppercase labels, thin surface borders and theme tokens remain shared.
- The global refractive dock and its page windows remain in the root layout, not duplicated by page shells.
- Calendar containers and Cal namespaces are instance-specific, allowing page and dock-window CTAs to coexist. The homepage retains its `#contact` anchor.
- The 404 and error controls use shared button radii and sizes. Recovery actions are preserved.

Validation: production build, TypeScript, UI suites, dock window/adaptation checks, and `node scripts/check-sitewide-design.mjs` after a production build. The route sweep checks 48 routes at 1440px/light and 320px/dark for header/CTA/dock coverage, Syne headings, horizontal containment and runtime exceptions. Representative full-page captures are local under `.scratch/sitewide-*`.

This pass does not replace factual copy or project illustrations. Browser verification is Chromium; it is not a cross-browser certification or an exhaustive interaction test of every article and project.
