"use client";

import { IconX } from "@tabler/icons-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { accentColorFor } from "@/lib/blog-topic";
import { premiumSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface ExperienceCardItem {
  company: string;
  date: string;
  description?: readonly string[];
  icon: string;
  id: string;
  location: string;
  title: string;
}

export interface ExpandableCardProps {
  className?: string;
  items: ExperienceCardItem[];
}

// Converged onto the shared premiumSpring token — this local spring was doing
// the same "tile morphs into a floating panel via layoutId" job as
// cta-tile.tsx's own layoutId morph (which already uses premiumSpring), just
// tuned to different (much snappier) numbers. Using the same token here
// makes the two card-to-modal morphs in the app feel like one system.
const springTransition = premiumSpring;

export default function ExpandableCard({
  items,
  className,
}: ExpandableCardProps) {
  const [current, setCurrent] = useState<ExperienceCardItem | null>(null);

  useEffect(() => {
    if (!current) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCurrent(null);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [current]);

  return (
    <LayoutGroup id="experience-cards">
      <div className="relative">
        <AnimatePresence initial={false}>
          {current && (
            <>
              <motion.div
                animate={{ opacity: 1 }}
                aria-hidden="true"
                className="fixed inset-3 z-50 rounded-none bg-black/55 backdrop-blur-sm sm:inset-4"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="experience-backdrop"
                onClick={() => setCurrent(null)}
                transition={{ duration: 0.2 }}
              />

              <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4 sm:p-6">
                <motion.article
                  className="modal-shadow pointer-events-auto relative my-4 max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-none border border-border bg-card"
                  id={`experience-${current.id}`}
                  key={current.id}
                  layoutId={`experience-card-${current.id}`}
                  transition={springTransition}
                >
                  <Button
                    aria-label="Collapse experience"
                    className="absolute right-3 top-3 rounded-none bg-foreground/[0.07] hover:bg-foreground/[0.10]"
                    onClick={() => setCurrent(null)}
                    render={
                      <motion.button
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                      />
                    }
                    size="icon"
                    variant="ghost"
                  >
                    <IconX className="text-foreground/60" />
                  </Button>

                  <div className="p-6 sm:p-8">
                    <div className="mb-6 flex items-start gap-4">
                      <motion.div
                        className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-none border-2 border-border bg-card sm:size-16"
                        layoutId={`experience-icon-${current.id}`}
                        style={{
                          boxShadow: `0 4px 16px -4px rgba(0,0,0,0.18), 0 0 20px -6px ${accentColorFor(current.company)}`,
                        }}
                        transition={springTransition}
                      >
                        <Image
                          alt={current.company}
                          className="rounded-none object-contain"
                          height={40}
                          src={current.icon}
                          width={40}
                        />
                      </motion.div>

                      <div className="min-w-0 flex-1">
                        <motion.span
                          className="ui-label mb-1 block text-muted-foreground"
                          layoutId={`experience-date-${current.id}`}
                          transition={springTransition}
                        >
                          {current.date}
                        </motion.span>
                        <motion.h3
                          className={cn(
                            "font-syne",
                            "text-xl font-semibold text-foreground sm:text-2xl"
                          )}
                          layoutId={`experience-title-${current.id}`}
                          transition={springTransition}
                        >
                          {current.title}
                        </motion.h3>
                        <motion.p
                          className="mt-1 text-sm text-muted-foreground"
                          layoutId={`experience-company-${current.id}`}
                          transition={springTransition}
                        >
                          {current.company} • {current.location}
                        </motion.p>
                      </div>
                    </div>

                    {current.description?.length ? (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        initial={{ opacity: 0, y: 12 }}
                        transition={{ delay: 0.1, duration: 0.25 }}
                      >
                        <h4 className="ui-label mb-3 text-foreground/70">
                          Key responsibilities & achievements
                        </h4>
                        <ul className="flex flex-col gap-3">
                          {current.description.map((description) => (
                            <li
                              className="flex items-start text-sm text-muted-foreground"
                              key={description}
                            >
                              <span className="mr-3 mt-1.5 size-1.5 shrink-0 rounded-none bg-muted-foreground" />
                              <span>{description}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : null}
                  </div>
                </motion.article>
              </div>
            </>
          )}
        </AnimatePresence>

        <div className={cn("relative flex w-full flex-col gap-3", className)}>
          {items.map((item) => (
            <Button
              aria-controls={`experience-${item.id}`}
              aria-expanded={current?.id === item.id}
              className="experience-card group h-auto w-full cursor-pointer justify-start gap-4 rounded-none border border-border bg-card/70 p-4 text-left shadow-[0_1px_2px_rgba(24,24,24,0.03),0_4px_12px_-6px_rgba(24,24,24,0.07)] backdrop-blur-sm transition-[transform,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-border hover:bg-card sm:p-5"
              key={item.id}
              onClick={() => setCurrent(item)}
              render={
                <motion.button
                  layoutId={`experience-card-${item.id}`}
                  transition={springTransition}
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.98 }}
                />
              }
              variant="ghost"
            >
              <motion.div
                className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-none border-2 border-border bg-card shadow-md shadow-foreground/[0.08] sm:size-14"
                layoutId={`experience-icon-${item.id}`}
                transition={springTransition}
              >
                <Image
                  alt={item.company}
                  className="rounded-none object-contain"
                  height={32}
                  src={item.icon}
                  width={32}
                />
              </motion.div>

              <div className="min-w-0 flex-1">
                <motion.span
                  className="ui-label mb-0.5 block text-muted-foreground"
                  layoutId={`experience-date-${item.id}`}
                  transition={springTransition}
                >
                  {item.date}
                </motion.span>
                <motion.h3
                  className={cn(
                    "font-syne",
                    "truncate text-base font-semibold text-foreground sm:text-[1.0625rem]"
                  )}
                  layoutId={`experience-title-${item.id}`}
                  transition={springTransition}
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  className="truncate text-sm text-muted-foreground"
                  layoutId={`experience-company-${item.id}`}
                  transition={springTransition}
                >
                  {item.company} • {item.location}
                </motion.p>
              </div>

              <span className="ui-label shrink-0 text-muted-foreground opacity-40 transition-opacity group-hover:opacity-70">
                Expand
              </span>
            </Button>
          ))}
        </div>
      </div>
    </LayoutGroup>
  );
}
