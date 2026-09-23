"use client";

import { IconArrowUpRight, IconChevronDown } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getProjectBySlug, projectCollections } from "@/lib/projects";

export default function Projects() {
  const [open, setOpen] = useState<Record<string, boolean>>({
    independent: true,
  });
  const reducedMotion = useReducedMotion();
  return (
    <div className="min-w-0">
      <div className="divide-y divide-border">
        {projectCollections.map((collection) => {
          const expanded = Boolean(open[collection.id]);
          const slugs = collection.slugs;
          const archive = collection.id === "archive";
          return (
            <section
              className="py-5 first:pt-0"
              id={`work-${collection.id}`}
              key={collection.id}
            >
              {collection.id === "independent" ? (
                <h3 className="sr-only">{collection.title}</h3>
              ) : (
                <h3>
                  <Button
                    aria-controls={`collection-${collection.id}`}
                    aria-expanded={expanded}
                    className="h-auto min-h-12 w-full justify-between whitespace-normal px-0 py-2 text-left hover:bg-transparent"
                    onClick={() =>
                      setOpen((current) => ({
                        ...current,
                        [collection.id]: !current[collection.id],
                      }))
                    }
                    variant="ghost"
                  >
                    <span className="font-heading text-base font-medium tracking-[-.02em]">
                      {collection.title}
                    </span>
                    <span className="ml-4 flex shrink-0 items-center gap-4">
                      <span className="ui-label text-muted-foreground">
                        <span aria-hidden="true">
                          {String(slugs.length).padStart(2, "0")}
                        </span>
                        <span className="sr-only">{slugs.length} projects</span>
                      </span>
                      <IconChevronDown
                        aria-hidden="true"
                        className={`size-5 transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
                      />
                    </span>
                  </Button>
                </h3>
              )}
              <motion.div
                animate={{
                  height: expanded ? "auto" : 0,
                  opacity: expanded ? 1 : 0,
                }}
                aria-hidden={!expanded}
                className="overflow-hidden"
                id={`collection-${collection.id}`}
                inert={!expanded}
                initial={false}
                transition={{
                  duration: reducedMotion ? 0 : 0.24,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ul
                  className={
                    archive
                      ? "mt-5 grid gap-x-8 sm:grid-cols-2"
                      : collection.id === "independent"
                        ? "divide-y divide-border"
                        : "mt-3 divide-y divide-border"
                  }
                >
                  {slugs.map((slug) => {
                    const project = getProjectBySlug(slug);
                    if (!project) return null;
                    return (
                      <li key={slug}>
                        <Link
                          className={`group grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-x-5 gap-y-2 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${archive ? "border-t border-border" : "md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto]"}`}
                          href={`/projects/${slug}`}
                        >
                          <h4 className="text-base font-medium leading-snug tracking-[-.02em] underline-offset-4 group-hover:underline sm:text-lg">
                            {project.title}
                          </h4>
                          <p
                            className={`col-start-1 row-start-2 max-w-[64ch] text-sm leading-relaxed text-muted-foreground ${archive ? "" : "md:col-start-2 md:row-start-1"}`}
                          >
                            {project.summary}
                          </p>
                          <IconArrowUpRight
                            aria-hidden="true"
                            className={`col-start-2 row-start-1 size-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none ${archive ? "" : "md:col-start-3"}`}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
