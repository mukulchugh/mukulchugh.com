"use client";

import { useState, type ReactNode } from "react";
import { IconChevronDown } from "@tabler/icons-react";

interface CollapsibleListProps<T> {
  items: T[];
  /** How many to show when collapsed. */
  initial?: number;
  /** Fade color at the bottom of the collapsed list (match the tile bg). */
  fadeColor?: string;
  /** Noun for the toggle label, e.g. "projects", "roles". */
  noun?: string;
  renderList: (visible: T[]) => ReactNode;
}

export function CollapsibleList<T>({
  items,
  initial = 4,
  fadeColor = "rgba(252,251,249,0.94)",
  noun,
  renderList,
}: CollapsibleListProps<T>) {
  const [open, setOpen] = useState(false);
  const hasMore = items.length > initial;
  const visible = open || !hasMore ? items : items.slice(0, initial);
  const hiddenCount = items.length - initial;

  return (
    <div>
      <div className="relative">
        {renderList(visible)}

        {/* Bottom fade — only while collapsed */}
        {!open && hasMore && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
            style={{ background: `linear-gradient(to top, ${fadeColor} 15%, transparent)` }}
            aria-hidden="true"
          />
        )}
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="group inline-flex items-center gap-1.5 rounded-full
                       bg-white px-4 py-2 text-[13px] font-medium text-zinc-600
                       transition-all duration-[240ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]
                       [@media(hover:hover)]:hover:text-zinc-950 [@media(hover:hover)]:hover:-translate-y-[1px]
                       active:scale-[0.97]
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
            style={{
              border: "1px solid rgba(20,20,40,0.08)",
              boxShadow: "0 1px 2px rgba(28,25,23,0.04), 0 3px 8px -4px rgba(28,25,23,0.08)",
            }}
          >
            {open ? "Show less" : `Show ${hiddenCount} more${noun ? ` ${noun}` : ""}`}
            <IconChevronDown
              className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>
      )}
    </div>
  );
}
