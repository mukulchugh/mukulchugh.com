import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const sourceExtension = /\.(?:ts|tsx|mjs)$/;
const files = [
  ...["app", "components", "lib", "context", "scripts"].flatMap((directory) =>
    readdirSync(directory, { recursive: true })
      .filter((file) => sourceExtension.test(file))
      .map((file) => path.join(directory, file))
  ),
  "instrumentation-client.ts",
];
const importers = new Map(files.map((file) => [file, new Set()]));

function resolveImport(specifier, importer) {
  let base;
  if (specifier.startsWith("@/")) {
    base = specifier.slice(2);
  } else if (specifier.startsWith(".")) {
    base = path.join(path.dirname(importer), specifier);
  } else {
    return;
  }
  return ["", ".ts", ".tsx", ".mjs", "/index.ts", "/index.tsx"]
    .map((suffix) => path.normalize(base + suffix))
    .find((file) => importers.has(file));
}

for (const file of files) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest
  );
  function visit(node) {
    let specifier;
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      specifier = node.moduleSpecifier;
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword
    ) {
      specifier = node.arguments[0];
    }
    if (specifier && ts.isStringLiteral(specifier)) {
      const target = resolveImport(specifier.text, file);
      if (target && target !== file) {
        importers.get(target).add(file);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}

// Only components/lib need importers. App conventions, scripts and
// instrumentation-client.ts are entry points and still contribute imports.
const orphans = files
  .filter(
    (file) =>
      (file.startsWith("components/") || file.startsWith("lib/")) &&
      importers.get(file).size === 0
  )
  .sort((a, b) => a.localeCompare(b));
if (orphans.length) {
  console.error(
    `FAIL: source files with zero importers:\n${orphans.join("\n")}`
  );
  process.exitCode = 1;
} else {
  console.log("PASS: no components/ or lib/ source files with zero importers.");
}
