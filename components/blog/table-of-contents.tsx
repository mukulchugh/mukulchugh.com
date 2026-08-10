"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { PostHeading } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  headings: PostHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  useTOCObserver(headings, setActiveId, observerRef);

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

// Shared hook: sets up IntersectionObserver for active heading tracking
function useTOCObserver(
  headings: PostHeading[],
  setActiveId: (id: string) => void,
  observerRef: React.MutableRefObject<IntersectionObserver | null>
) {
  useEffect(() => {
    if (typeof window === "undefined" || headings.length === 0) {
      return;
    }

    // Disconnect any previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const headingEls = headings
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingEls.length === 0) {
      return;
    }

    observerRef.current = new IntersectionObserver(
      () => {
        // Pick the heading closest to the top that is visible or just above
        const active = headingEls
          .filter((el) => {
            const top = el.getBoundingClientRect().top;
            return top <= 120; // 120px from top = "active zone"
          })
          .at(-1); // last one in document order that's <= 120px from top

        if (active) {
          setActiveId(active.id);
        } else {
          // If nothing is in the active zone, set the first heading
          setActiveId(headingEls[0]?.id ?? "");
        }
      },
      {
        rootMargin: "-96px 0px -60% 0px",
        threshold: [0, 1],
      }
    );

    headingEls.forEach((el) => observerRef.current!.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [headings, setActiveId, observerRef]);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToHeading(id: string) {
  const el = document.getElementById(id);
  if (!el) {
    return;
  }

  el.scrollIntoView({
    behavior: prefersReducedMotion() ? "instant" : "smooth",
    block: "start",
  });
}

interface TOCListProps {
  activeId: string;
  headings: PostHeading[];
  onClickItem: (id: string) => void;
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
              <Button
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "h-auto w-full justify-start whitespace-normal break-words rounded-none px-2.5 py-1.5 text-left font-mono text-[12px] leading-snug",
                  "transition-colors duration-200",
                  isActive
                    ? "bg-muted text-foreground font-medium shadow-[0_0_0_1px_hsl(var(--foreground)/0.1)]"
                    : "text-muted-foreground [@media(hover:hover)]:hover:bg-muted/60 [@media(hover:hover)]:hover:text-foreground"
                )}
                onClick={() => onClickItem(heading.id)}
                variant="ghost"
              >
                {heading.text}
              </Button>
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
      className="dock-shell hidden lg:block sticky top-24 self-start w-52 shrink-0 rounded-none p-3"
    >
      <p className="ui-label mb-3 px-2.5 text-muted-foreground">On this page</p>
      <TOCList
        activeId={activeId}
        headings={headings}
        onClickItem={scrollToHeading}
      />
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
    <div className="dock-shell lg:hidden mb-8 rounded-none overflow-hidden">
      <Button
        aria-controls="mobile-toc-content"
        aria-expanded={isOpen}
        className="h-auto min-h-[44px] w-full justify-between rounded-none px-4 py-3 text-left"
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
      >
        <span className="ui-label text-muted-foreground">On this page</span>
        <IconChevronDown
          aria-hidden="true"
          className={cn(
            "h-3 w-3 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          stroke={1.5}
        />
      </Button>

      {isOpen && (
        <div
          className="px-4 pb-4 border-t border-border/60 [scroll-margin-bottom:var(--dock-clearance)]"
          id="mobile-toc-content"
          ref={contentRef}
        >
          <div className="pt-3">
            <TOCList
              activeId={activeId}
              headings={headings}
              onClickItem={(id) => {
                scrollToHeading(id);
                setIsOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
