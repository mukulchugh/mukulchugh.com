"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import { Collapsible } from "@/components/ui/collapsible";
import type { PostHeading } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  headings: PostHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  useTOCObserver(headings, setActiveId);

  // Only show if there are at least 2 headings
  if (headings.length < 2) {
    return null;
  }

  return (
    <>
      {/* Desktop: sticky sidebar — hidden below lg */}
      <DesktopTOC activeId={activeId} headings={headings} />
      {/* Mobile/tablet: collapsible disclosure — hidden at lg+ */}
      <MobileTOC
        activeId={activeId}
        headings={headings}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
}

// Read current nodes on each scheduled update: streamed hydration and route
// transitions can replace headings after the TOC's effect first runs.
function useTOCObserver(
  headings: PostHeading[],
  setActiveId: (id: string) => void
) {
  useEffect(() => {
    if (headings.length < 2) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const elements = headings
        .map(({ id }) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null);
      const active = elements
        .filter((element) => element.getBoundingClientRect().top <= 120)
        .at(-1);
      setActiveId(active?.id ?? elements[0]?.id ?? "");
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(
      document.getElementById("article-content") ?? document.body,
      { childList: true, subtree: true }
    );
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [headings, setActiveId]);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface TOCListProps {
  activeId: string;
  headings: PostHeading[];
  onClickItem?: (id: string) => void;
}

function TOCList({ headings, activeId, onClickItem }: TOCListProps) {
  return (
    <nav aria-label="Table of contents">
      <ul className="space-y-0.5">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li className={cn(heading.level === 3 && "pl-3")} key={heading.id}>
              {/* Active state mirrors the dock's own chip treatment (bg-muted
                  + a hairline foreground ring) instead of a left border, so
                  the TOC reads as part of the same nav vocabulary. */}
              <a
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "flex min-h-11 w-full items-center whitespace-normal break-words rounded-lg px-2.5 py-2 text-left text-[13px] leading-snug",
                  "transition-colors duration-200",
                  isActive
                    ? "bg-muted text-foreground font-medium shadow-[0_0_0_1px_hsl(var(--foreground)/0.1)]"
                    : "text-muted-foreground [@media(hover:hover)]:hover:bg-muted/60 [@media(hover:hover)]:hover:text-foreground"
                )}
                href={`#${heading.id}`}
                onClick={(event) => {
                  if (
                    !(
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    ) &&
                    onClickItem
                  ) {
                    event.preventDefault();
                    onClickItem(heading.id);
                  }
                }}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface DesktopTOCProps {
  activeId: string;
  headings: PostHeading[];
}

function DesktopTOC({ headings, activeId }: DesktopTOCProps) {
  return (
    // dock-shell gives this the same glass-panel surface (layered border +
    // shadow ring) as the floating nav dock, so the two read as one system.
    <aside
      aria-label="Article navigation"
      className="hidden lg:block sticky top-6 self-start max-h-[calc(100dvh-6rem-var(--dock-clearance))] w-52 shrink-0 overflow-y-auto rounded-[14px] border border-border p-3"
    >
      <p className="ui-label mb-3 px-2.5 text-muted-foreground">Contents</p>
      <TOCList activeId={activeId} headings={headings} />
    </aside>
  );
}

interface MobileTOCProps {
  activeId: string;
  headings: PostHeading[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function MobileTOC({ headings, activeId, isOpen, setIsOpen }: MobileTOCProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  // When the disclosure opens, the revealed list can land right behind the
  // fixed bottom dock (it isn't part of the page's trailing content, so
  // dock-safe-bottom's padding doesn't reach it). Nudge it into view,
  // respecting the dock's own clearance via scroll-margin-bottom below.
  useEffect(() => {
    if (isOpen) {
      contentRef.current?.scrollIntoView({
        behavior: prefersReducedMotion() ? "instant" : "smooth",
        block: "nearest",
      });
    }
  }, [isOpen]);

  return (
    // dock-shell (same glass surface as the floating nav dock) replaces the
    // old flat bordered box, so mobile/desktop TOC and the dock share one
    // visual language.
    <Collapsible.Root
      className="dock-shell lg:hidden mb-8 rounded-[14px] overflow-hidden"
      onOpenChange={setIsOpen}
      open={isOpen}
    >
      <Collapsible.Trigger
        className="h-auto min-h-[44px] w-full justify-between rounded-none px-4 py-3 text-left"
        render={<Button variant="ghost" />}
      >
        <span className="ui-label text-muted-foreground">Contents</span>
        <IconChevronDown
          aria-hidden="true"
          className={cn(
            "h-3 w-3 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          stroke={1.5}
        />
      </Collapsible.Trigger>

      <Collapsible.Panel
        className="px-4 pb-4 border-t border-border/60 [scroll-margin-bottom:var(--dock-clearance)]"
        id="mobile-toc-content"
        ref={contentRef}
      >
        <div className="pt-3">
          <TOCList
            activeId={activeId}
            headings={headings}
            onClickItem={(id) => {
              // Collapse before measuring the destination. Native fragment
              // scrolling first targets its old position below the open list.
              flushSync(() => setIsOpen(false));
              const heading = document.getElementById(id);
              if (!heading) return;
              window.history.pushState(
                window.history.state,
                "",
                `#${encodeURIComponent(id)}`
              );
              heading.setAttribute("tabindex", "-1");
              heading.focus({ preventScroll: true });
              heading.scrollIntoView({
                behavior: prefersReducedMotion() ? "instant" : "smooth",
                block: "start",
              });
            }}
          />
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
