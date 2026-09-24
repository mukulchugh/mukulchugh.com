import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import About from "../components/about";
import { CTATile } from "../components/bento/cta-tile";
import { HeroArtwork } from "../components/bento/profile-tile";
import { ContactSection } from "../components/contact/contact-section";
import Experience from "../components/experience";
import Intro from "../components/intro";
import Projects from "../components/projects";
import { Button } from "../components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "../components/ui/reveal";
import ActiveSectionContextProvider from "../context/active-section-context";
import { dockProximity } from "../lib/motion";
import { useReducedMotion } from "../lib/use-reduced-motion";

assert.equal(dockProximity(200, 200), 1);
assert.equal(dockProximity(140, 200), 0.5);
assert.equal(dockProximity(260, 200), 0.5);
assert.equal(dockProximity(400, 200), 0);
assert.equal(dockProximity(Number.POSITIVE_INFINITY, 200), 0);

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

for (const appearance of ["dark", "light"] as const) {
  for (const compact of [false, true]) {
    const contact = renderToStaticMarkup(
      <ActiveSectionContextProvider>
        <CTATile appearance={appearance} compact={compact} />
      </ActiveSectionContextProvider>
    );
    assert.match(contact, /aria-label="Book a call"/);
    assert.match(contact, /hover:bg-\[#bce92a\] hover:text-zinc-950/);
    assert.match(contact, /aria-label="Copy email address"/);
    assert.doesNotMatch(contact, /resume|résumé|MukulChughCV/i);
    assert.match(contact, /href="mailto:contact@mukulchugh.com"/);
    assert.equal(
      contact.includes("contact-orbit-v2.png"),
      appearance === "dark"
    );
    assert.equal(
      contact.includes("background:#f4f4f2"),
      appearance === "light"
    );
    assert.equal(contact.includes("min-h-[320px]"), compact);
    assert.doesNotMatch(contact, /opacity:0(?:[;".]|$)/);
  }
}
console.log("Contact appearance and compact-mode server contracts passed.");

for (const Component of [ContactSection, Intro]) {
  const markup = renderToStaticMarkup(
    <ActiveSectionContextProvider>
      <Component />
    </ActiveSectionContextProvider>
  );
  assert.doesNotMatch(markup, /resume|résumé|MukulChughCV/i);
}
assert.equal(existsSync("public/MukulChughCV.pdf"), false);
for (const defaultBooking of [false, true]) {
  const markup = renderToStaticMarkup(
    <ActiveSectionContextProvider>
      <ContactSection defaultBooking={defaultBooking} />
    </ActiveSectionContextProvider>
  );
  assert.ok(markup.includes(`data-booking="${defaultBooking}"`));
  assert.ok(
    markup.includes(
      defaultBooking ? "Back to contact options" : "Book a short call"
    )
  );
  assert.equal(markup.includes("Checking available times"), defaultBooking);
}

const homepage = renderToStaticMarkup(
  <ActiveSectionContextProvider>
    <About />
    <Experience />
    <Projects />
    <CTATile homepage />
  </ActiveSectionContextProvider>
);
assert.match(homepage, /More about me/);
assert.match(homepage, /aria-label="View full experience"/);
assert.match(homepage, /aria-label="Experience roles"/);
assert.doesNotMatch(homepage, /Earlier roles|Same curiosity|<details/);
for (const collection of ["quivly", "zenduty", "archive"]) {
  assert.match(
    homepage,
    new RegExp(`aria-controls="collection-${collection}"`)
  );
  assert.match(homepage, new RegExp(`id="collection-${collection}"`));
}
assert.match(homepage, /inert=""/);
assert.match(homepage, /aria-expanded="false"/);
assert.match(homepage, /min-h-\[460px\]/);
assert.match(homepage, /id="collection-independent"/);
assert.doesNotMatch(homepage, /Smaller work|Independent products|workstreams/);
assert.match(homepage, /More to explore/);
const hero = renderToStaticMarkup(<HeroArtwork />);
assert.match(hero, /chrome-ribbon\.webp/);
assert.match(hero, /Interactive motion study/);
assert.match(hero, /type="range"/);
assert.match(hero, /aria-valuetext="Centered"/);
assert.match(hero, /Reset motion study/);
assert.doesNotMatch(hero, /Ideas|useful/);
assert.doesNotMatch(
  hero.match(/<img[^>]*>/)?.[0] ?? "",
  /opacity:0|clip-path|transform:/
);
console.log("Hero artwork is visible before motion enhancement.");
console.log(
  "Homepage disclosures, scrollable experience and contact contracts passed."
);
