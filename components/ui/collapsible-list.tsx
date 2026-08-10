"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { premiumSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface CollapsibleListProps<T> {
  /** Fade color at the bottom of the collapsed list. Defaults to the theme background, so it's correct in both light and dark. */
  fadeColor?: string;
  /** How many to show when collapsed. */
  initial?: number;
  items: T[];
  /** Noun for the toggle label, e.g. "projects", "roles". */
  noun?: string;
  renderList: (visible: T[]) => ReactNode;
}

export function CollapsibleList<T>({
  items,
  initial = 4,
  fadeColor = "hsl(var(--background) / 94%)",
  noun,
  renderList,
}: CollapsibleListProps<T>) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const hasMore = items.length > initial;
  const visible = open || !hasMore ? items : items.slice(0, initial);
  const hiddenCount = items.length - initial;

  return (
    <div>
      {/* layout on the list container so it grows/shrinks with spring physics */}
      <motion.div
        className="relative"
        layout={!shouldReduceMotion}
        transition={shouldReduceMotion ? undefined : premiumSpring}
      >
        {renderList(visible)}

        {/* Bottom fade — only while collapsed */}
        <AnimatePresence>
          {!open && hasMore && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              initial={{ opacity: 1 }}
              key="fade"
              style={{
                background: `linear-gradient(to top, ${fadeColor} 15%, transparent)`,
              }}
              transition={{ duration: 0.25 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <Button
            aria-expanded={open}
            className="group inline-flex items-center gap-1.5 rounded-none
                       bg-card px-4 py-2 text-[13px] font-medium text-muted-foreground
                       transition-[color,transform] duration-200 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]
                       [@media(hover:hover)]:hover:text-foreground [@media(hover:hover)]:hover:-translate-y-[1px]
                       active:scale-[0.97]
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-muted-foreground"
            onClick={() => setOpen((o) => !o)}
            size="sm"
            style={{
              border: "1px solid rgba(20,20,40,0.08)",
              boxShadow:
                "0 1px 2px rgba(24,24,24,0.04), 0 3px 8px -4px rgba(24,24,24,0.08)",
            }}
            type="button"
            variant="secondary"
          >
            {open
              ? "Show less"
              : `Show ${hiddenCount} more${noun ? ` ${noun}` : ""}`}
            <IconChevronDown
              aria-hidden="true"
              className={cn(
                "text-muted-foreground transition-transform duration-200",
                open && "rotate-180"
              )}
              data-icon="inline-end"
            />
          </Button>
        </div>
      )}
    </div>
  );
}
