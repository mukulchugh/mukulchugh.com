import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "../components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "../components/ui/reveal";
import { useReducedMotion } from "../lib/use-reduced-motion";

// bun scripts/check-motion.tsx: exercise the actual shared components on the server.
const button = renderToStaticMarkup(
  <Button
    className={({ disabled }) => (disabled ? "state-disabled" : "state-ready")}
    disabled
    style={({ disabled }) => ({ opacity: disabled ? 0.4 : 1 })}
  >
    Save
  </Button>
);
assert.match(button, /class="[^"]*state-disabled/);
assert.match(button, /opacity:0\.4/);
assert.match(
  button,
  /transition-property:background-color, color, border-color, box-shadow/
);
assert.match(button, /disabled=""/);

const composed = renderToStaticMarkup(
  <Button render={<button aria-label="Composed control" type="button" />}>
    Open
  </Button>
);
assert.equal((composed.match(/<button/g) ?? []).length, 1);
assert.match(composed, /aria-label="Composed control"/);
assert.match(composed, />Open<\/button>/);

function Preference() {
  return <span>{String(useReducedMotion())}</span>;
}
assert.equal(renderToStaticMarkup(<Preference />), "<span>true</span>");
for (const Component of [Reveal, RevealGroup, RevealItem]) {
  const markup = renderToStaticMarkup(
    <Component>Visible before hydration</Component>
  );
  assert.match(markup, /Visible before hydration/);
  assert.doesNotMatch(markup, /opacity:0(?:[;".]|$)/);
}
console.log("Shared button composition and motion server snapshots passed.");
