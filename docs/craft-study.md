# Hero artwork craft study

The owner approved replacing the artwork tile's slogan with a small interaction. `HeroArtwork` in `components/bento/profile-tile.tsx` preserves the existing chrome ribbon and lime sphere, dark surface, rounded tile, and shared satin-glass finish. This is a surface refinement within the existing visual world, not a new identity or a change to the main headline.

## Interaction

The existing `/design/chrome-ribbon.webp` raster rotates in two dimensions. The native **Turn** range input runs from −8° to +8° in 1° steps, starting centered. Motion applies `rotate: angle` and `x: angle / 2`, using the shared `premiumSpring` from `lib/motion.ts` (stiffness 260, damping 32, mass 1). This is not true 3D geometry, object rotation, or optical refraction. There is no autonomous animation.

The control strip reserves 56px below the artwork. Its slider has a 44px input height, a lime thumb, and a white keyboard focus outline. The tile has a 180px minimum height; the mobile override uses a 2:1 aspect ratio. The artwork remains contained and clipped within its own region.

The slider retains native keyboard behavior, including arrow steps and Home/End bounds. Its associated label and `aria-valuetext` describe the centered state or degrees left/right. The labeled reset button returns to zero and is disabled when centered. Reduced motion keeps the control functional while applying angle changes with zero transition duration; the preference hook responds to preference changes.

## Verification

The following checks passed for this implementation:

- `bun scripts/check-craft-study.ts`
- `bunx tsc --noEmit`
- `bun run test:ui`
- Targeted Biome checks.

The craft-study script uses **headless Chromium** against the existing user-owned `http://localhost:3000` server. It does not start or restart a server. At 1440×1000 and 390×1000 it checks the initial value, disabled reset, ArrowRight, End, reset, Home under reduced motion, accessible value text, and horizontal page overflow. It is a standalone check, not part of `test:ui`.

Captures are local artifacts under `.scratch/craft-study/`:

| Viewport | Full page | Artwork tile |
| --- | --- | --- |
| Desktop, 1440px | `page-1440.png` | `tile-1440.png` |
| Mobile width, 390px | `page-390.png` | `tile-390.png` |

The centered desktop/mobile captures were reviewed as acceptable for this bounded tile change. They are taken after the reduced-motion/reset checks. The assertions verify control state, not the rendered transform or spring timing. Static screenshots cannot establish subjective motion quality. A narrow Chromium viewport is not physical-device touch testing; touch dragging, other browser engines, and motion feel remain unverified.

## Documentation boundary

`PRODUCT.md` still describes a Syne/Geist identity, while the latest typography override in `DESIGN.md` specifies Geist only and supersedes older Syne guidance in that same file. This pre-existing drift is reported without repair. Neither the global design document nor its sidecar is regenerated for this surface note.
