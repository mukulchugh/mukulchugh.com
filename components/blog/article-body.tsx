"use client";

import { createCodePlugin } from "@streamdown/code";
import {
  IconArrowDown,
  IconArrowRight,
  IconBolt,
  IconDatabase,
  IconRefresh,
  IconSearch,
} from "@tabler/icons-react";
import Image from "next/image";
import type { ReactNode } from "react";
import type { BundledTheme, Components } from "streamdown";
import { Streamdown } from "streamdown";
import type { PostHeading } from "@/lib/blog";
import { cn } from "@/lib/utils";
import {
  articleSectionDiagrams,
  SupportingDiagram,
  shortArticleDiagrams,
} from "./article-diagrams";

interface ArticleBodyProps {
  className?: string;
  headings: PostHeading[];
  markdown: string;
  slug?: string;
}

// Code surfaces stay dark in either site theme. Use opaque, readable tokens
// in both slots rather than the former palette's translucent strings.
const SHIKI_THEME: [BundledTheme, BundledTheme] = [
  "github-dark-default",
  "github-dark-default",
];

// Streamdown resolves the active Shiki theme from `plugins.code.getThemes()`
// when a code plugin is supplied, ignoring the top-level `shikiTheme` prop
// in that case — so the theme has to be baked into the plugin itself via
// `createCodePlugin`, not passed through `shikiTheme` alone.
const codePlugin = createCodePlugin({ themes: SHIKI_THEME });

function ArticleDiagram({ kind }: { kind: "loop" | "database" }) {
  return (
    <figure className="not-prose m-0 rounded-[14px] border border-border bg-muted/30 p-4 text-foreground">
      {kind === "loop" ? (
        <>
          <figcaption className="mb-5 text-sm font-medium">
            Repeat, detect, recover
          </figcaption>
          <ol className="grid grid-cols-3 gap-3">
            {[
              {
                Icon: IconRefresh,
                label: "Repeat",
                note: "Same tool. Same inputs. Same results.",
              },
              {
                Icon: IconSearch,
                label: "Detect",
                note: "Track repeated calls and unchanged results.",
              },
              {
                Icon: IconBolt,
                label: "Recover",
                note: "Nudge, disable the tool, or end the turn.",
              },
            ].map(({ Icon, label, note }, index) => (
              <li className="relative min-w-0" key={label}>
                <div
                  className={cn(
                    "mb-3 flex h-12 w-12 items-center justify-center rounded-xl",
                    index === 1
                      ? "bg-[#d2ff00] text-black"
                      : index === 2
                        ? "bg-[#101112] text-white"
                        : "bg-muted text-foreground"
                  )}
                >
                  <Icon aria-hidden="true" size={26} stroke={1.8} />
                </div>
                {index < 2 && (
                  <IconArrowRight
                    aria-hidden="true"
                    className="absolute right-0 top-4"
                    size={15}
                  />
                )}
                <p className="mb-2 text-sm font-semibold">{label}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {note}
                </p>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <>
          <figcaption className="mb-5 text-sm font-medium">
            Two paths to the same database
          </figcaption>
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] grid-rows-2 items-center gap-x-2 gap-y-8 text-center text-xs">
            <div className="row-span-2 rounded-lg border border-border bg-background px-2 py-5">
              Dashboard
            </div>
            <div className="text-muted-foreground">
              REST API
              <IconArrowRight
                aria-hidden="true"
                className="mx-auto mt-2"
                size={24}
              />
            </div>
            <div className="relative rounded-lg border border-border bg-background px-2 py-3">
              Memory service
              <IconArrowDown
                aria-hidden="true"
                className="absolute left-1/2 top-full mt-2 -translate-x-1/2 text-muted-foreground"
                size={20}
              />
            </div>
            <div className="rounded-lg bg-[#d2ff00] px-1 py-2 font-medium text-black">
              Direct query
              <IconArrowRight
                aria-hidden="true"
                className="mx-auto mt-2"
                size={24}
              />
            </div>
            <div>
              <IconDatabase
                aria-hidden="true"
                className="mx-auto mb-2"
                size={36}
                stroke={1.4}
              />
              Database
            </div>
          </div>
        </>
      )}
    </figure>
  );
}

// Static mode parses the entire document. Source offsets distinguish repeated
// headings and stay stable when a code block suspends and React retries.
export function ArticleBody({
  className,
  headings,
  markdown,
  slug,
}: ArticleBodyProps) {
  const idByOffset = new Map(headings.map((h) => [h.offset, h.id]));
  const diagramKind =
    slug === "agent-stuck-detection-tool-loops"
      ? "loop"
      : slug === "skip-your-own-api-when-you-own-the-database"
        ? "database"
        : undefined;
  function withDiagram(content: ReactNode, offset: number | undefined) {
    if (offset === undefined) return content;
    if (
      slug === "agent-working-memory-injection-hygiene" &&
      offset < (headings[0]?.offset ?? 0)
    ) {
      return (
        <>
          <figure className="not-prose mb-6 overflow-hidden rounded-[14px] md:float-right md:ml-6 md:w-[48%]">
            <Image
              alt="Layered scratchpad cards separated from instructions by a bright trust boundary. Sanitize, separate, and be explicit."
              className="h-auto w-full"
              height={1086}
              sizes="(min-width: 768px) 40vw, 95vw"
              src="/design/articles/agent-working-memory-trust-boundary-support.png"
              width={1448}
            />
          </figure>
          {content}
        </>
      );
    }
    const heading = headings.find(
      (item) =>
        item.level === 2 &&
        item.offset < offset &&
        markdown.slice(item.offset, offset).trim() === `## ${item.text}`
    );
    if (!heading) return content;
    const existingKind =
      diagramKind === "loop" && heading.text === "A cheap detector"
        ? "loop"
        : diagramKind === "database" &&
            heading.text === "The fix wasn't a bigger cache"
          ? "database"
          : undefined;
    const supportingKind = articleSectionDiagrams[slug ?? ""]?.[heading.text];
    if (!(existingKind || supportingKind)) return content;
    return (
      <>
        <div
          className="mb-6 min-w-0 md:float-right md:ml-6 md:w-[48%]"
          data-article-diagram=""
        >
          {existingKind ? (
            <ArticleDiagram kind={existingKind} />
          ) : (
            <SupportingDiagram kind={supportingKind} />
          )}
        </div>
        {content}
      </>
    );
  }

  const components: Components = {
    a: ({ children, node: _node, ...props }) => <a {...props}>{children}</a>,
    h2: ({ children, node, ...props }) => (
      <h2
        {...props}
        className={cn(props.className, "clear-both")}
        id={idByOffset.get(node?.position?.start.offset ?? -1)}
      >
        {children}
      </h2>
    ),
    h3: ({ children, node, ...props }) => (
      <h3
        {...props}
        className={cn(props.className, "clear-both")}
        id={idByOffset.get(node?.position?.start.offset ?? -1)}
      >
        {children}
      </h3>
    ),
    ol: ({ children, node, ...props }) =>
      withDiagram(<ol {...props}>{children}</ol>, node?.position?.start.offset),
    p: ({ children, node, ...props }) =>
      withDiagram(<p {...props}>{children}</p>, node?.position?.start.offset),
    strong: ({ children, node: _node, ...props }) => (
      <strong {...props}>{children}</strong>
    ),
    ul: ({ children, node, ...props }) =>
      withDiagram(<ul {...props}>{children}</ul>, node?.position?.start.offset),
  };

  const body = (
    <Streamdown
      // Prose can wrap around a diagram; code needs the full reading measure.
      className={cn(
        "flow-root [&>ol]:flow-root [&>ul]:flow-root [&>[data-streamdown='code-block']]:clear-both [&>[data-streamdown='code-block']]:w-auto",
        className
      )}
      components={components}
      mode="static"
      plugins={{ code: codePlugin }}
      shikiTheme={SHIKI_THEME}
    >
      {markdown}
    </Streamdown>
  );
  const shortDiagram = shortArticleDiagrams[slug ?? ""];
  return shortDiagram &&
    headings.length === 0 &&
    markdown.includes(shortDiagram.anchor) ? (
    <div className="grid items-start gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div className="min-w-0 [&>div>p:first-child]:mt-0">{body}</div>
      <SupportingDiagram kind={shortDiagram.kind} />
    </div>
  ) : (
    body
  );
}
