import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToReadableStream } from "react-dom/server";
import { ArticleBody } from "../components/blog/article-body";
import { articleProgress } from "../components/blog/reading-progress";
import { getAllPosts, getPostHeadings, getPostServer } from "../lib/blog";

async function render(markdown: string, slug?: string) {
  const headings = getPostHeadings(markdown);
  const stream = await renderToReadableStream(
    createElement(ArticleBody, { headings, markdown, slug })
  );
  await stream.allReady;
  const html = await new Response(stream).text();
  const ids = [...html.matchAll(/<h[23]\b[^>]*\bid="([^"]*)"/g)].map(
    (match) => match[1]
  );
  assert.deepEqual(
    ids,
    headings.map(({ id }) => id)
  );
  assert.equal(new Set(ids).size, ids.length);
  return { headings, html };
}

const fixture = [
  "## Repeat",
  "",
  "```ts",
  "const x = 1",
  "```",
  "",
  "## Repeat",
  "",
  "### Repeat-2",
  "",
  "## Repeat",
  "",
  "## **Bold** and `code` &amp; [link](https://example.com)",
  "",
  "Setext *heading*",
  "---",
  "",
  "> ## Quoted heading",
  "",
  "- ### Nested heading",
  "",
  "## !!!",
  "",
  "## ???",
  "",
  "## Café 日本語",
  "",
  "~~~md",
  "## Not a heading",
  "~~~",
  "",
  "## <em>Inline HTML</em>",
  "",
  "## [Reference][ref]",
  "",
  "[ref]: https://example.com",
].join("\n");

const expected = [
  ["repeat", "Repeat"],
  ["repeat-2", "Repeat"],
  ["repeat-2-2", "Repeat-2"],
  ["repeat-3", "Repeat"],
  ["bold-and-code-link", "Bold and code & link"],
  ["setext-heading", "Setext heading"],
  ["quoted-heading", "Quoted heading"],
  ["nested-heading", "Nested heading"],
  ["section", "!!!"],
  ["section-2", "???"],
  ["caf", "Café 日本語"],
  ["inline-html", "Inline HTML"],
  ["reference", "Reference"],
];
// Concurrent, complete renders exercise Streamdown's code-block Suspense path.
for (const { headings, html } of await Promise.all([
  render(fixture),
  render(fixture),
])) {
  assert.deepEqual(
    headings.map(({ id, text }) => [id, text]),
    expected
  );
  assert.match(html, /<strong>Bold<\/strong>/);
  assert.match(html, /<a\b[^>]*href="https:\/\/example.com\/"[^>]*>link<\/a>/);
  assert.match(html, /data-streamdown="code-block"/);
}

const diagramCounts: Record<string, number> = {
  "agent-stuck-detection-tool-loops": 1,
  "agent-suggested-actions-as-tools": 3,
  "agent-working-memory-injection-hygiene": 4,
  "brik-react-to-native-widgets": 1,
  "checkpointing-agent-edits-without-touching-git-index": 2,
  "ferry-apple-watch-mac-mic": 1,
  "human-in-the-loop-agent-plans": 1,
  "mcp-gateway-for-team-tools": 1,
  "mobile-lessons-from-swiggy-scale": 0,
  "openkvm-one-keyboard-two-macs": 1,
  "phased-agent-turns-gather-analyze-synthesize": 1,
  "progressive-tool-results-transcript-chunks": 1,
  "quivly-skills-agent-expertise": 1,
  "self-hosted-personal-agent-fleet": 1,
  "skip-your-own-api-when-you-own-the-database": 1,
};

await Promise.all(
  getAllPosts().map(async (post) => {
    const full = await getPostServer(post.slug);
    assert.ok(full?.content?.markdown, post.slug);
    const [{ html }, baseline] = await Promise.all([
      render(full.content.markdown, post.slug),
      render(full.content.markdown),
    ]);
    assert.equal(
      (html.match(/<figure\b/g) ?? []).length,
      diagramCounts[post.slug],
      post.slug
    );
    // Diagrams supplement the real article; every prose paragraph and code span remains intact.
    for (const match of baseline.html.matchAll(
      /<(p|code)\b[^>]*>([\s\S]*?)<\/\1>/g
    )) {
      assert.ok(html.includes(match[2]), `${post.slug}: canonical ${match[1]}`);
    }
    assert.equal(
      (html.match(/data-streamdown="code-block"/g) ?? []).length,
      (baseline.html.match(/data-streamdown="code-block"/g) ?? []).length,
      post.slug
    );
    assert.doesNotMatch(html, /<(?:ul|ol)\b[^>]*>\s*<div/);
    if (full.headings?.length && diagramCounts[post.slug]) {
      // A diagram is a sibling of the canonical first block, so later blocks
      // can continue beside it instead of waiting for a first-paragraph grid.
      assert.match(html, /data-article-diagram=""/);
      assert.match(html, /<\/figure><\/div><(?:p|ol|ul)\b/);
      assert.doesNotMatch(html, /my-6 grid min-w-0 items-start/);
      assert.match(html, /<h2\b[^>]*class="clear-both"/);
      if (html.includes('data-streamdown="code-block"')) {
        assert.match(
          html,
          /code-block&#x27;\]\]:w-auto|code-block'\]\]:w-auto/
        );
        assert.match(html, /data-streamdown="code-block-copy-button"/);
      }
    }
  })
);
for (const { html } of await Promise.all([
  render(
    "## Different section\n\nNo diagram here.",
    "agent-stuck-detection-tool-loops"
  ),
  render("## A cheap detector\n\nUnrelated article.", "other-article"),
  render(
    "## Different section\n\nNo diagram here.",
    "phased-agent-turns-gather-analyze-synthesize"
  ),
  render("Unrelated content.", "brik-react-to-native-widgets"),
]))
  assert.doesNotMatch(html, /<figure\b/);
const unsafe = await render(
  "[unsafe](javascript:alert%281%29)\n\n<script>alert(1)</script>"
);
assert.doesNotMatch(unsafe.html, /href="javascript:|<script>/);
// Long articles start at the viewport top and finish at the final visible line.
assert.equal(articleProgress(200, 1800, 800), 0);
assert.equal(articleProgress(0, 1800, 800), 0);
assert.equal(articleProgress(-500, 1800, 800), 0.5);
assert.equal(articleProgress(-1000, 1800, 800), 1);
assert.equal(articleProgress(-2000, 1800, 800), 1);
// Short/equal-height articles must not reverse progress or divide by zero.
assert.equal(articleProgress(501, 300, 800), 0);
assert.equal(articleProgress(500, 300, 800), 1);
assert.equal(articleProgress(-200, 300, 800), 1);
assert.equal(articleProgress(1, 800, 800), 0);
assert.equal(articleProgress(0, 800, 800), 1);
assert.deepEqual(
  getPostHeadings("<h2>Raw HTML is outside the Markdown TOC contract</h2>"),
  []
);
console.log(
  `Blog checks passed: ${getAllPosts().length} articles and concurrent Markdown edge-case renders.`
);
