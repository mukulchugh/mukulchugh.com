# Subtle tile material pass

Owner brief: each tile should feel subtly glassy and embossed, with actual even thin borders, not shadows impersonating edges. Preserve the corrected controls and sleek dock.

## Implementation

Shared bento/Card surfaces and explicitly marked artwork tiles receive a faint static diagonal glaze. Neutral fills retain 96% opacity. Root borders remain real 1px solid borders, with no box shadows. Existing artwork colors, images, typography, layout, buttons and dock remain intact. No GPU filters, animation loops, dependencies, or per-tile backdrop blur were added. This is a satin-glass visual finish, not physical refraction.

Coverage includes homepage text tiles, hero artwork, featured projects, map, contact tile, writing features, blog listing cards, article heroes, related articles and project visual panels. Reading prose, diagram internals, filters and badges are not treated as tiles.

## Ten independent, bounded reviews

1. `glass_home_text`: shared homepage text tile coverage and containment.
2. `glass_home_art`: hero/featured/map/contact art and stacking constraints.
3. `glass_projects`: project route panel and explicit-color preservation.
4. `glass_writing`: writing/listing/related-card coverage.
5. `glass_accessibility`: focus, reduced transparency and forced colors.
6. `glass_cascade`: duplicate rules, specificity and pseudo-element conflicts.
7. `glass_performance`: no-loop, no-per-tile-blur implementation boundary.
8. `glass_contract_tests`: source contracts and future browser assertions.
9. `glass_theme_review`: light/dark and fallback conflicts.
10. `glass_final_scope`: independent implementation coverage and control isolation.

Reviews caught missing hero/contact/article-hero and project-panel hooks, plus obsolete glass fallback rules that overrode opaque accessibility settings. Those were addressed in one implementation/correction pass. Agents were read-only; edits were coordinated centrally.

## Verification boundary

TypeScript, targeted lint and seven UI check scripts pass, including `scripts/check-tile-surfaces.ts`. Tests check real-border CSS, no tile shadows, inert/static glaze, coverage, and exclusion of dock/buttons. These are source/SSR checks, not computed browser-style or performance measurements.

No browser was connected. The older 1440px screenshot was inspected only as composition context; it predates font/label changes and is not evidence of this finish. Live desktop/mobile, dark/light, focus, and contrast verification remain pending. No dev-server operations, production build, commits or deployment were performed in this pass.
