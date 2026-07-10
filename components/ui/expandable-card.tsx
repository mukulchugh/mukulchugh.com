"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import { IconX } from "@tabler/icons-react";

export interface ExperienceCardItem {
  id: string;
  title: string;
  company: string;
  location: string;
  date: string;
  icon: string;
  description?: readonly string[];
}

export interface ExpandableCardProps {
  items: ExperienceCardItem[];
  className?: string;
}

const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [callback]);

  return ref;
};

// Smooth spring transition for layout animations
const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 1,
};

export default function ExpandableCard({
  items,
  className,
}: ExpandableCardProps) {
  const [current, setCurrent] = useState<ExperienceCardItem | null>(null);
  const ref = useOutsideClick(() => setCurrent(null));

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCurrent(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when expanded
  useEffect(() => {
    if (current) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [current]);

  return (
    <div className="relative">
      {/* Backdrop overlay */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-md"
            onClick={() => setCurrent(null)}
          />
        )}
      </AnimatePresence>

      {/* Expanded card modal */}
      <AnimatePresence mode="wait">
        {current && (
          <div className="fixed inset-0 z-[1001] grid place-items-center p-4 overflow-y-auto">
            <motion.div
              ref={ref}
              layoutId={`card-${current.id}`}
              transition={springTransition}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_8px_48px_rgba(20,20,40,0.14)] my-8"
            >
              {/* Close button — touch target 44×44 */}
              <motion.button
                onClick={() => setCurrent(null)}
                aria-label="Close"
                className="absolute top-3 right-3 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-black/[0.06]
                           [@media(hover:hover)]:hover:bg-black/[0.10] transition-colors active:bg-black/[0.14]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <IconX className="w-4 h-4 text-foreground/60" />
              </motion.button>

              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    layoutId={`icon-${current.id}`}
                    transition={springTransition}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-zinc-200 overflow-hidden flex items-center justify-center bg-white flex-shrink-0 shadow-lg shadow-zinc-900/[0.08]"
                  >
                    <Image
                      src={current.icon}
                      alt={current.company}
                      width={40}
                      height={40}
                      className="object-contain rounded-full"
                    />
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    {/* Meta — 12px */}
                    <motion.span
                      layoutId={`date-${current.id}`}
                      transition={springTransition}
                      className="text-[12px] text-zinc-400 block mb-1"
                    >
                      {current.date}
                    </motion.span>
                    {/* Tile/card title scale */}
                    <motion.h3
                      layoutId={`title-${current.id}`}
                      transition={springTransition}
                      className={cn(
                        syne.className,
                        "font-semibold text-xl sm:text-2xl text-foreground"
                      )}
                    >
                      {current.title}
                    </motion.h3>
                    {/* Body scale */}
                    <motion.p
                      layoutId={`company-${current.id}`}
                      transition={springTransition}
                      className="text-[14px] text-zinc-500 mt-1"
                    >
                      {current.company} • {current.location}
                    </motion.p>
                  </div>
                </div>

                {/* Description - only visible when expanded */}
                {current.description && current.description.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
                  >
                    <h4 className="text-[13px] font-medium text-foreground/80 mb-3">
                      Key Responsibilities & Achievements
                    </h4>
                    <ul className="space-y-3">
                      {current.description.map((desc, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start text-[14px] text-zinc-500"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.2 + i * 0.05,
                            duration: 0.3,
                            ease: "easeOut"
                          }}
                        >
                          <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 flex-shrink-0" />
                          <span>{desc}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Card list */}
      <div className={cn("relative flex flex-col gap-3 w-full", className)}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layoutId={`card-${item.id}`}
            onClick={() => setCurrent(item)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setCurrent(item); }}
            role="button"
            tabIndex={0}
            aria-label={`${item.title} at ${item.company} — click to expand`}
            transition={springTransition}
            className="experience-card group relative flex cursor-pointer items-center gap-4 rounded-xl
                       border border-black/[0.07] bg-white/70 p-4 sm:p-5
                       backdrop-blur-sm w-full
                       transition-all duration-[260ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]
                       active:scale-[0.985] active:duration-[100ms]
                       [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:border-black/[0.11]
                       [@media(hover:hover)]:hover:-translate-y-[2px]
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            style={{
              boxShadow: "0 1px 2px rgba(28,25,23,0.03), 0 4px 12px -6px rgba(28,25,23,0.07)",
            }}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Icon */}
            <motion.div
              layoutId={`icon-${item.id}`}
              transition={springTransition}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-zinc-200 overflow-hidden flex items-center justify-center bg-white flex-shrink-0 shadow-md shadow-zinc-900/[0.08]"
            >
              <Image
                src={item.icon}
                alt={item.company}
                width={32}
                height={32}
                className="object-contain rounded-full"
              />
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Meta — 12px */}
              <motion.span
                layoutId={`date-${item.id}`}
                transition={springTransition}
                className="text-[12px] text-zinc-400 block mb-0.5"
              >
                {item.date}
              </motion.span>
              {/* Tile/card title — 1rem semibold */}
              <motion.h3
                layoutId={`title-${item.id}`}
                transition={springTransition}
                className={cn(
                  syne.className,
                  "font-semibold text-[1rem] sm:text-[1.0625rem] text-foreground truncate"
                )}
              >
                {item.title}
              </motion.h3>
              {/* Body — 14px muted */}
              <motion.p
                layoutId={`company-${item.id}`}
                transition={springTransition}
                className="text-[14px] text-zinc-500 truncate"
              >
                {item.company} • {item.location}
              </motion.p>
            </div>

            {/* Click indicator — always visible at low opacity, amplifies on hover */}
            <div className="flex-shrink-0 opacity-30 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-60">
              <span className="text-[11px] text-zinc-500 tracking-wide">Expand</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
