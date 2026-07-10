"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { PostHeading } from "@/lib/blog";

interface TableOfContentsProps {
  headings: PostHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Only show if there are at least 2 headings
  if (headings.length < 2) return null;

  return (
    <>
      {/* Desktop: sticky sidebar — hidden below lg */}
      <DesktopTOC headings={headings} activeId={activeId} setActiveId={setActiveId} observerRef={observerRef} />
      {/* Mobile/tablet: collapsible disclosure — hidden at lg+ */}
      <MobileTOC headings={headings} activeId={activeId} setActiveId={setActiveId} observerRef={observerRef} isOpen={isOpen} setIsOpen={setIsOpen} />
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
    if (typeof window === "undefined" || headings.length === 0) return;

    // Disconnect any previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const headingEls = headings
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingEls.length === 0) return;

    // Track which headings are "above" the viewport center
    const visibleHeadings: Record<string, number> = {};

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleHeadings[entry.target.id] = entry.boundingClientRect.top;
        });

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
  if (!el) return;

  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({
    behavior: prefersReduced ? "instant" : "smooth",
    block: "start",
  });
}

interface TOCListProps {
  headings: PostHeading[];
  activeId: string;
  onClickItem: (id: string) => void;
}

function TOCList({ headings, activeId, onClickItem }: TOCListProps) {
  return (
    <nav aria-label="Table of contents">
      <ul className="space-y-0.5">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li key={heading.id} className={cn(heading.level === 3 && "pl-3")}>
              <button
                onClick={() => onClickItem(heading.id)}
                className={cn(
                  "w-full text-left text-[12px] font-mono leading-snug py-1 pl-3 rounded-sm",
                  "transition-colors duration-150",
                  "border-l-2",
                  isActive
                    ? "border-zinc-900 text-zinc-900 font-medium"
                    : "border-transparent text-zinc-400 [@media(hover:hover)]:hover:text-zinc-700"
                )}
                aria-current={isActive ? "location" : undefined}
              >
                {heading.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface DesktopTOCProps {
  headings: PostHeading[];
  activeId: string;
  setActiveId: (id: string) => void;
  observerRef: React.MutableRefObject<IntersectionObserver | null>;
}

function DesktopTOC({ headings, activeId, setActiveId, observerRef }: DesktopTOCProps) {
  useTOCObserver(headings, setActiveId, observerRef);

  return (
    <aside
      className="hidden lg:block sticky top-24 self-start w-52 shrink-0"
      aria-label="Article navigation"
    >
      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-3">
        On this page
      </p>
      <TOCList
        headings={headings}
        activeId={activeId}
        onClickItem={scrollToHeading}
      />
    </aside>
  );
}

interface MobileTOCProps {
  headings: PostHeading[];
  activeId: string;
  setActiveId: (id: string) => void;
  observerRef: React.MutableRefObject<IntersectionObserver | null>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function MobileTOC({ headings, activeId, setActiveId, observerRef, isOpen, setIsOpen }: MobileTOCProps) {
  useTOCObserver(headings, setActiveId, observerRef);

  return (
    <div className="lg:hidden mb-8 border border-zinc-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        aria-expanded={isOpen}
        aria-controls="mobile-toc-content"
      >
        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
          On this page
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className={cn(
            "text-zinc-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        >
          <path
            d="M2 4l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          id="mobile-toc-content"
          className="px-4 pb-4 border-t border-zinc-100"
        >
          <div className="pt-3">
            <TOCList
              headings={headings}
              activeId={activeId}
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
