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
            className="group inline-flex items-center gap-1.5 rounded-full border border-black/[0.08]
                       bg-white px-4 py-2 text-[13px] font-medium text-zinc-600 shadow-sm
                       transition-all duration-200
                       [@media(hover:hover)]:hover:border-zinc-300 [@media(hover:hover)]:hover:text-zinc-900
                       active:scale-[0.98]
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
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
