# Project artwork refresh

Scope: seven curated covers plus seven previously missing project covers. Existing artwork for the other twelve projects remains unchanged. These are illustrative concepts, not screenshots or evidence of shipped interfaces. Setu uses only approved high-level public positioning.

Files: `public/design/project-art-v3/`; originals and prompts: `.scratch/project-art-v3/`; generation manifest: `docs/project-art-v3-manifest.json`.

The same palettes work in both themes. Card text follows artwork tone, not page theme. The slider queue uses contained, right-aligned artwork and a separate left copy region rather than the featured card's cover crop. A soft edge blends the image background with the card. No additional rendering library was added.

Validation: all seven curated slides at 1440px, 390px and 320px in light and dark mode; all fourteen image URLs return 200; no horizontal overflow or browser page errors. TypeScript and project model checks pass. Screenshots and runnable checks are in `.scratch/project-art-v3/`. This is not an automated WCAG contrast audit or a production build verification.

The card-handoff slider remains an isolated prototype at `/prototype/project-slider`. No deployment or dev-server changes were made.
