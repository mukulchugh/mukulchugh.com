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

function scrollToHeading(id: string) {
  const el = document.getElementById(id);
  if (!el) {
    return;
  }

  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  el.scrollIntoView({
    behavior: prefersReduced ? "instant" : "smooth",
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
              <Button
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "h-auto w-full justify-start rounded-sm py-1 pl-3 text-left font-mono text-[12px] leading-snug",
                  "transition-colors duration-150",
                  "border-l-2",
                  isActive
                    ? "border-foreground text-foreground font-medium"
                    : "border-transparent text-muted-foreground [@media(hover:hover)]:hover:text-foreground/80"
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
    <aside
      aria-label="Article navigation"
      className="hidden lg:block sticky top-24 self-start w-52 shrink-0"
    >
      <p className="ui-label mb-3 text-muted-foreground">On this page</p>
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
  return (
    <div className="lg:hidden mb-8 border border-border rounded-lg overflow-hidden">
      <Button
        aria-controls="mobile-toc-content"
        aria-expanded={isOpen}
        className="h-auto w-full justify-between rounded-none px-4 py-3 text-left"
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
          className="px-4 pb-4 border-t border-border"
          id="mobile-toc-content"
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
