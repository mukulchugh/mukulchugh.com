# Issue tracker: Local Markdown

- Specs: `.scratch/<feature>/spec.md`.
- Tickets: `.scratch/<feature>/issues/<NN>-<slug>.md`, numbered from 01.
- Record triage state near the top with `Status:`.
- Append discussion under `## Comments`.
- “Publish” means create local files, not remote issues.
- Fetch tickets by reading their referenced files.

## Wayfinding

- Map: `.scratch/<effort>/map.md`.
- Child tickets use the same numbered issue convention.
- Record `Type: research|prototype|grilling|task`.
- Record dependencies as `Blocked by: NN, NN`.
- Select the first open, unblocked, unclaimed ticket by number.
- Set `Status: claimed` before work.
- On completion, append `## Answer`, set `Status: resolved`, and add a summary and link to the map.
