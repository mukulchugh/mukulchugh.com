import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import ts from "typescript";

const files = ["app", "components", "lib", "content"].flatMap((directory) =>
  readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name))
);
const sources = files
  .filter((file) => /\.(?:[cm]?[jt]sx?|mdx?|json)$/.test(file))
  .map((file) => ({ file, text: readFileSync(file, "utf8") }));
const sourceTokens = new Set(
  sources.flatMap(({ text }) => text.match(/[\w-]+/g) ?? [])
);
const moduleUses = new Map();
for (const { file, text } of sources.filter(({ file }) =>
  file.endsWith(".tsx")
)) {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const imports = new Map();
  for (const statement of source.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      statement.importClause?.name &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      statement.moduleSpecifier.text.endsWith(".module.css")
    ) {
      const path = statement.moduleSpecifier.text;
      imports.set(
        statement.importClause.name.text,
        resolve(
          path.startsWith("@/") ? "." : dirname(file),
          path.replace(/^@\//, "")
        )
      );
    }
  }
  const bare = new Set();
  function collectStrings(node) {
    if (ts.isStringLiteralLike(node) || ts.isTemplateLiteralToken(node)) {
      for (const token of node.text.split(/\s+/)) bare.add(token);
    }
    ts.forEachChild(node, collectStrings);
  }
  function visit(node) {
    if (
      (ts.isJsxAttribute(node) && node.name.getText(source) === "className") ||
      (ts.isCallExpression(node) && node.expression.getText(source) === "cn")
    )
      collectStrings(node);
    if (
      ts.isPropertyAccessExpression(node) ||
      ts.isElementAccessExpression(node)
    ) {
      const module = imports.get(node.expression.getText(source));
      const name = ts.isPropertyAccessExpression(node)
        ? node.name.text
        : node.argumentExpression &&
            ts.isStringLiteralLike(node.argumentExpression)
          ? node.argumentExpression.text
          : undefined;
      if (module && name) {
        if (!moduleUses.has(module)) moduleUses.set(module, new Set());
        moduleUses.get(module).add(name);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  for (const module of imports.values()) {
    if (!moduleUses.has(module)) moduleUses.set(module, new Set());
    for (const token of bare) moduleUses.get(module).add(token);
  }
}

const htmlTokens = new Set();
if (process.argv[2]) {
  const base = new URL(process.argv[2]);
  const read = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    return response.text();
  };
  const sitemap = await read(new URL("sitemap.xml", base));
  const urls = [...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)];
  if (!urls.length) throw new Error("Sitemap contains no URLs");
  await Promise.all(
    urls.map(async ([, location]) => {
      const url = new URL(location.trim().replaceAll("&amp;", "&"));
      const html = await read(new URL(url.pathname + url.search, base));
      for (const [, classes] of html.matchAll(
        /\bclass\s*=\s*["']([^"']*)["']/g
      )) {
        for (const name of classes.split(/\s+/)) htmlTokens.add(name);
      }
    })
  );
}

const failures = [];
let checked = 0;
for (const file of files.filter(
  (file) =>
    file === "app/globals.css" ||
    (/^(?:app|components)\//.test(file) && file.endsWith(".module.css"))
)) {
  const classes = new Map();
  postcss
    .parse(readFileSync(file, "utf8"), { from: file })
    .walkRules((rule) => {
      selectorParser((selectors) => {
        selectors.walkClasses((node) => {
          for (let parent = node.parent; parent; parent = parent.parent) {
            if (parent.type === "pseudo" && parent.value === ":global") return;
          }
          if (!classes.has(node.value))
            classes.set(node.value, rule.source.start.line);
        });
      }).processSync(rule.selector);
    });
  const used = file.endsWith(".module.css")
    ? (moduleUses.get(resolve(file)) ?? new Set())
    : sourceTokens;
  for (const [name, line] of classes) {
    checked++;
    if (!(used.has(name) || htmlTokens.has(name)))
      failures.push(`${file}:${line}: .${name}`);
  }
}
if (failures.length) {
  console.error(
    `Unused CSS classes (${failures.length}):\n${failures.join("\n")}`
  );
  process.exitCode = 1;
} else {
  console.log(`CSS class usage passed: ${checked} classes checked.`);
}
