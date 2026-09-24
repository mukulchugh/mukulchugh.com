# Typography, layout and full-page visual review

Historical report. Reading-rail related-card placement and earlier screenshot claims below describe an older implementation. Current decisions and evidence live in [DESIGN.md](../DESIGN.md) and [recovery checkpoint](recovery-checkpoint.md).

Implemented locally in `portfolio-motion`. The original visual identity and large editorial covers remain. This is refinement, not a replacement design.

## Direction

Syne remains the display voice; Geist remains the reading/UI face. Display roles retain their established fluid size scale. Supplied Syne weights are 400–800, so active display headings now use real 800/400 weights rather than requesting 900/300. Ordinary narrative copy uses a rem-based 16px floor; compact metadata and card summaries retain smaller secondary roles. Shared uppercase labels are 11px at the default root size, with tighter tracking.

The reading path remains person → working context → biography and featured work → broader work → writing → experience → contact. Desktop bento relationships become a linear mobile flow. Article text has a 68ch maximum independent of the large header and cover. Related articles use at most two columns within the reading rail. Short landscape TOCs scroll locally without colliding with the bottom dock.

## Full-page screenshot evidence

These are complete page captures, not just first-screen previews. Fixed navigation appears at its viewport position within a full-page image; that is not a second in-flow navigation bar. Homepage captures use reduced motion to make the static layout reproducible. A failed moving-page capture and a partially rasterized oversized-viewport capture were discarded, not counted as evidence.

| Surface | Desktop | Mobile | Visual reading |
| --- | --- | --- | --- |
| Homepage, all sections | [1440px](../.scratch/portfolio-polish/screenshots/home-desktop.png) | [390px](../.scratch/portfolio-polish/screenshots/home-mobile.png) | Name leads; secondary context stays subordinate; sections retain a consistent inset rhythm. Featured wordmarks and excerpts required the image-driven fixes below. The biography panel retains its desktop row alignment. |
| Archive, all 15 entries | [1440px](../.scratch/portfolio-polish/screenshots/archive-desktop.png) | [390px](../.scratch/portfolio-polish/screenshots/archive-mobile.png) | Cover/summary alignment repeats consistently. Mobile linearizes cover, metadata, title and excerpt. The long page is intentional under the large-cover requirement. |
| Article with headings | [1440px](../.scratch/portfolio-polish/screenshots/article-desktop.png) | [390px](../.scratch/portfolio-polish/screenshots/article-mobile.png) | Long title wraps; prose, inline code, lists, section headings, adjacent navigation, related reads and footer remain distinct. TOC becomes a disclosure on mobile. |
| Short article without TOC | [1440px](../.scratch/portfolio-polish/screenshots/short-article-desktop.png) | [390px](../.scratch/portfolio-polish/screenshots/short-article-mobile.png) | No empty sidebar. Large cover is preserved; narrative has its own reading measure. Related content follows the complete note rather than interrupting it. |
| Private project overview | [1440px](../.scratch/portfolio-polish/screenshots/project-desktop.png) | [390px](../.scratch/portfolio-polish/screenshots/project-mobile.png) | Long title, cover, lead, technologies and adjacent navigation reflow without inventing case-study content or public links. |

The project page was also inspected in [dark theme](../.scratch/portfolio-polish/screenshots/project-dark.png). Other route records were reviewed at source and all 34 page routes passed HTTP checks; this is not a claim that every article/project received its own two-viewport screenshot.

## Image-driven fixes

- The desktop OpenKVM cover originally wrapped `OpenKV / M`. Its type is now sized against the actual card container rather than the viewport; the final image keeps the word intact.
- Featured excerpts combined line clamping with flex growth, allowing an extra line below an ellipsis. Removing flex growth leaves exactly three lines; measured final heights are about 76.8px at 25.6px line height.
- Narrow experience rows give text more space through a smaller mobile logo and gap. Decorative expansion text no longer competes with the role title on phones.
- Repeated reading/navigation roles now use consistent sizes and minimum 44px standalone targets. Article ending spacing is less repetitive, while cover sizes are unchanged.

## Verified behavior and boundaries

Production build, TypeScript, full lint, targeted regressions, and diff checks pass. The final type/layout detector scans returned no findings; the visual assessment found issues those scans did not.

Browser checks include mobile TOC hash and heading focus, resume/preview close focus, calendar blocked-network fallback and Back focus, reduced-motion cold rendering, mobile/desktop layouts and the 768px featured grid. Full screen-reader certification, actual 200% browser text zoom, every browser engine, external downloads and booking submission are not claimed. A narrow 320px layout inspection is not a substitute for those checks.

Factual copy and metadata proposals remain review-only in [content-review.md](content-review.md). No commit, push, publication or deployment was performed; the user's development server was left running and untouched.
