# Search, agents, and social previews

Implemented locally on 24 September 2026. No deployment, Search Console submission, or external account changes.

## Scope

47 public HTML pages: 6 main pages, 15 articles, 26 projects. Prototypes, unknown slugs, drafts, and hidden projects are excluded from discovery and Markdown export.

### Corrected

- All pages now declare their own canonical URL, description, Open Graph and Twitter metadata. Articles no longer repeat the author name in the document title.
- Removed the keyword-stuffed root metadata and unsupported Person schema claims, including invented seniority/certifications, US work-location claims, and hidden project names.
- Person and WebSite identities use stable IDs. About, collections, contact, experience, and project case studies receive grounded page/breadcrumb markup. BlogPosting author URLs and image URLs are absolute.
- All 26 projects are now in the sitemap. Dates come from article sources, not the build clock. Optional article `updatedAt` is supported without inventing modification dates.
- Rendering assets remain crawlable. Robots excludes private/API/prototype routes without mistakenly blocking Next.js assets. No new training opt-out was introduced: the existing broadly permissive policy remains.
- A visible, keyboard-accessible “Browse all articles” disclosure exposes every article as a normal link, independent of client-side pagination.
- The stale static `public/llms.txt` was replaced by the generated route at the same URL. Its incorrect San Francisco biography is no longer served. Git history retains the old file.

## Markdown and agent discovery

| HTML | Markdown |
| --- | --- |
| `/` | `/index.md` (also `/.md`) |
| `/about` | `/about.md` |
| `/projects/openkvm` | `/projects/openkvm.md` |
| `/blog/<slug>` | `/blog/<slug>.md` |
| Other public pages | Append `.md` |

HTML advertises the alternative through `rel=alternate type=text/markdown`. Markdown responses identify the HTML canonical through the HTTP Link header, use `text/markdown`, and include structured frontmatter with author, description, canonical, image, and real publication/modification dates where known.

Article bodies come directly from the published Markdown source. Other pages use existing public biography, work history, project descriptions, implementation details, boundaries, and source links. Project editorial copy is shared with HTML, including the current ALTR and Tethr descriptions. This is a readable content representation, not a serialization of decorative interface chrome.

The route resolves only known public paths. It does not accept filesystem paths or fetch arbitrary URLs. Unknown paths return 404/no-store. Markdown alternatives are not duplicated in the canonical XML sitemap.

- `/llms.txt`: generated directory of every public Markdown page, plus RSS/sitemap links.
- `/llms-full.txt`: complete public-text collection.
- `/blog/rss.xml`: self-identifying RSS feed with branded preview thumbnails.

## Creative preview system

Every public page has a 1200 × 630 PNG at `/og/<page>.png`; home uses `/og/home.png`.

- Homepage: lime statement, Syne typography, illustrated portrait.
- Articles: warm light editorial treatment and existing cover artwork.
- Projects: dark project notes and existing project artwork.
- Other pages: consistent identity, their own headline and description.

Text and artwork occupy separate panels. Artwork is contained rather than cropped over the copy. Background color is sampled from the artwork edge. Existing artwork is illustrative, not evidence of a shipped screen.

The generator uses Next.js ImageResponse, locally bundled OFL-licensed Syne/Geist fonts, and the already-installed Sharp library, now declared as a direct dependency. No remote image/font fetch happens during a preview request. Runtime tracing includes the assets needed by deployment bundles.

## Verification

- `bun run test:seo`: public registry, sitemap completeness, hidden/unknown exclusions, Markdown article parity, image-file presence, canonical metadata.
- `bun scripts/check-seo.ts http://localhost:3000`: all 47 HTML responses, all 47 Markdown responses, all 47 correctly sized PNGs, valid JSON-LD, alternate links, discovery endpoints, and representative 404s.
- `bun run test:ui`: existing UI, writing, project, motion, cover, and surface contracts.
- `npx tsc --noEmit` and `npm run build`.
- Visual inspection of homepage, article, and project social previews.

The dev server was not started, stopped, or restarted. Local production compilation is not a production deployment.

## Limits and next release checks

No ranking, rich-result, citation, or indexing gain is claimed. Search Console, Bing Webmaster Tools, analytics, and production bot access were not accessed. After deployment, verify public response headers, CDN behavior, Google URL Inspection/Rich Results Test, social-card fetches, and submit the updated sitemap. Monitor real search and referral data before changing the editorial content further.

No invented FAQs, testimonials, ratings, credentials, metrics, or “fresh” dates were added. No content was hidden specifically for crawlers. Markdown access is explicit by URL, not Accept-header negotiation.

## Focused skill references and current guidance

Only `seo-audit`, `ai-seo`, and the installed Next.js implementation guidance were selected. The two SEO skills were inspected as references, not installed globally.

- [SEO audit skill](https://skills.sh/coreyhaines31/marketingskills/seo-audit)
- [AI SEO skill](https://skills.sh/coreyhaines31/marketingskills/ai-seo)
- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): normal SEO foundations apply; special AI markup/files are not required.
- [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots): search crawling and training crawlers have different purposes. GPTBot access is not a search-ranking requirement.
- [llms.txt proposal](https://llmstxt.org/): used as an optional discovery convenience, not an established ranking signal.
- [Next.js metadata documentation](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
