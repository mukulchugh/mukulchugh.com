> Asset files live in `public/design/rebound-v1/`. Moved out of `public/` so provenance notes are not served publicly.

# Rebound asset pack

Approved direction: `approved-reference.png`. Generated with the built-in image tool using that exact image as the edit reference. These are regenerated separate layers, not pixel-exact extractions.

## Layers

- `rink.png`: empty rink, rails, perforated surface, markings and recessed goals. Preserve aspect ratio; no cover cropping.
- `rink-tall.png`: 1774 × 887 PNG used by the prototype. Generated from `rink.png` to add vertical traversal space at a 2:1 aspect ratio, retaining circular center markings and approximately the same goal size relative to board width. Gameplay openings remain exactly 121 simulation units; raster artwork is not a precision collision mask.
- `mallet-lime.png`: player sprite with transparent surround and contact shadow.
- `mallet-ivory.png`: opponent sprite with transparent surround and contact shadow.
- `puck.png`: puck sprite with transparent surround and contact shadow.

Keep titles, scores, instructions, controls, focus rings and feedback as live UI. Use the approved reference for their layout. Card background and border can be CSS. No extra raster states are needed for gameplay; move these sprites with transforms. Account for transparent sprite padding when setting collision radii. Calibrate collisions to the visible rink, not the image canvas. Optimize copies for delivery during implementation; retain these original PNGs.

## Fidelity notes

The layers follow the reference but are not identical pixels. Sprite proportions and gloss vary slightly, and faint edge fringes are visible at large magnification. Review at actual game size before integration. Do not imply that image generation produces exact original cutouts.

## Generation prompts

### rink

Extract and reconstruct ONLY the empty air hockey rink from the approved reference. Keep the identical wide horizontal rounded rectangular silhouette, near-orthographic overhead view, charcoal perforated playing surface, silver double rim, white vertical halfway line and center circle, both recessed perforated goals at left and right and curved white goal crease markings. Remove BOTH mallets and puck and reconstruct the underlying dots and markings naturally. No heading, scores, instructions, outer portfolio card or page background. Crop tightly around the rink with a small transparent safety margin. Rink aspect ratio approximately 2.6:1. Output wide high-resolution PNG, genuinely transparent outside the rink. Keep all surface textures inside the rink opaque. Preserve reference materials and geometry, no new design.

### mallet-lime

Isolate ONLY the lime green mallet at left of the reference, recreating its exact design: circular shallow bowl base with rolled luminous lime rim and a short cylindrical rounded central grip. Match its overhead camera, light from upper left, highlights and lime hue. Single centered object, square high-resolution PNG with genuine alpha transparency surrounding it. Base diameter occupies approximately 75 percent of canvas width, include a small soft translucent contact shadow below-right but no charcoal background pixels, no rink, no text, no other objects. Do not redesign or add facets. Preserve its slightly elliptical original perspective.

### mallet-ivory

Isolate ONLY the ivory white mallet at right of the reference, recreating its exact design: circular shallow bowl base with rolled cream rim and a short cylindrical rounded central grip. Match its overhead camera, light from upper left and warm ivory color. Single centered object, square high-resolution PNG with genuine alpha transparency surrounding it. Base diameter occupies approximately 75 percent of canvas width, include a small soft translucent contact shadow below-right but no charcoal background pixels, no rink, no text, no other objects. Do not redesign or add facets. Preserve its slightly elliptical original perspective. Same scale framing as the lime mallet.

### puck

Isolate ONLY the small black puck below-right of center in the reference. Exact same flat charcoal-black circular low cylinder with thin shiny beveled rim and subtle inset circular face. Match overhead perspective and lighting from upper left. Single centered object, square high-resolution PNG with genuine alpha transparency surrounding it. Puck diameter occupies approximately 75 percent of canvas width; preserve small soft translucent shadow below-right. No mallets, no rink, no text, no floor, no background pixels. Do not add logo or details.
