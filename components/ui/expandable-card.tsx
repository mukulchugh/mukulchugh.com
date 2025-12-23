"use client";

import type React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import { X } from "lucide-react";

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

export default function ExpandableCard({
  items,
  className,
}: ExpandableCardProps) {
  const [current, setCurrent] = useState<ExperienceCardItem | null>(null);
  const ref = useOutsideClick(() => setCurrent(null));

  const isCurrentRole = (date: string) => {
    return date.toLowerCase().includes("present");
  };

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
      {/* Backdrop overlay - z-[1000] to be above dock which is z-[999] */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-md"
            onClick={() => setCurrent(null)}
          />
        )}
      </AnimatePresence>

      {/* Expanded card modal - z-[1001] to be above backdrop */}
      <AnimatePresence>
        {current && (
          <div className="fixed inset-0 z-[1001] grid place-items-center p-4 overflow-y-auto">
            <motion.div
              ref={ref}
              layoutId={`card-${current.id}`}
              className={cn(
                "relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-neutral-900 shadow-2xl my-8",
                isCurrentRole(current.date) && "ring-1 ring-green-500/30"
              )}
            >
              {/* Current role stripe */}
              {isCurrentRole(current.date) && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              )}

              {/* Close button */}
              <button
                onClick={() => setCurrent(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>

              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    layoutId={`icon-${current.id}`}
                    className={cn(
                      "w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 overflow-hidden flex items-center justify-center bg-white flex-shrink-0",
                      isCurrentRole(current.date)
                        ? "border-green-500 shadow-lg shadow-green-500/20"
                        : "border-indigo-500 shadow-lg shadow-indigo-500/20"
                    )}
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
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <motion.span
                        layoutId={`date-${current.id}`}
                        className="text-sm text-gray-400"
                      >
                        {current.date}
                      </motion.span>
                      {isCurrentRole(current.date) && (
                        <span className="text-xs font-semibold text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <motion.h3
                      layoutId={`title-${current.id}`}
                      className={cn(
                        syne.className,
                        "font-semibold text-xl sm:text-2xl text-white"
                      )}
                    >
                      {current.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`company-${current.id}`}
                      className="text-sm text-gray-400 mt-1"
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
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <h4 className="text-sm font-medium text-gray-300 mb-3">
                      Key Responsibilities & Achievements
                    </h4>
                    <ul className="space-y-3">
                      {current.description.map((desc, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start text-sm text-gray-300"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.05 }}
                        >
                          <span
                            className={cn(
                              "mr-3 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0",
                              isCurrentRole(current.date)
                                ? "bg-green-500"
                                : "bg-indigo-500"
                            )}
                          />
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
      <div className={cn("relative flex flex-col gap-4", className)}>
        {items.map((item) => {
          const isCurrent = isCurrentRole(item.date);

          return (
            <motion.div
              key={item.id}
              layoutId={`card-${item.id}`}
              onClick={() => setCurrent(item)}
              className={cn(
                "group relative flex cursor-pointer items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20",
                isCurrent && "ring-1 ring-green-500/20"
              )}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Current role stripe */}
              {isCurrent && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-xl" />
              )}

              {/* Icon */}
              <motion.div
                layoutId={`icon-${item.id}`}
                className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 overflow-hidden flex items-center justify-center bg-white flex-shrink-0",
                  isCurrent
                    ? "border-green-500 shadow-md shadow-green-500/20"
                    : "border-indigo-500 shadow-md shadow-indigo-500/20"
                )}
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
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <motion.span
                    layoutId={`date-${item.id}`}
                    className="text-xs text-gray-400"
                  >
                    {item.date}
                  </motion.span>
                  {isCurrent && (
                    <span className="text-[10px] font-semibold text-green-400 bg-green-900/30 px-1.5 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <motion.h3
                  layoutId={`title-${item.id}`}
                  className={cn(
                    syne.className,
                    "font-semibold text-base sm:text-lg text-white truncate"
                  )}
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  layoutId={`company-${item.id}`}
                  className="text-sm text-gray-400 truncate"
                >
                  {item.company} • {item.location}
                </motion.p>
              </div>

              {/* Click indicator */}
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-gray-400">Click to expand</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
