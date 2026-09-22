# Retained artwork provenance

The PR retains 82 raster assets (approximately 110.1 MiB) selected from actual runtime references, including dynamically selected project and article images. Experimental alternatives remain local. Original reference pages and the external design-pack gallery were preserved.

`artwork-inventory.json` records each retained file's SHA-256, byte count, corresponding external pack asset, and verified relationship. All copies match the pack byte-for-byte except four originals whose PNG image-data chunks match while metadata differs. The hero `chrome-ribbon.png` matches the pack's `chrome-ribbon-v2.png`; the runtime `projects/quivly-skills-v2.png` matches `quivly-skills-art-v2.png`.

Project/product interfaces and sculptures are illustrative concepts generated with the built-in image-generation tool, not authenticated product screenshots. Their incidental text, metrics and generated symbols must not be treated as facts or approved brand exports. Native dimensions were preserved; no asset was enlarged for delivery.

Official Quivly downloads are documented in [public/design/brand/SOURCES.md](../public/design/brand/SOURCES.md). Other experience logos were retained from the existing public portfolio originals. The supplied portrait and personal symbol logos remain originals rather than generated replacements.

Prompt records supplied beside pack assets are copied into the inventory when present, with local generator file paths omitted. Earlier project/article generation records remain in the owner's local recovery archive. Missing exact prompts or source URLs are represented as absent fields, not reconstructed provenance. In particular, no per-file source record was found for the seven experience-brand WebPs or `contact-orbit-v2.png` during this pass.

The external design pack is not part of this Git repository. Its separate gallery contains 169 images at this checkpoint, including unused experiments; that larger count is not a count of shipping assets.
