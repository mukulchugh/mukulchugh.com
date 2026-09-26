"use client";

import { useGSAP } from "@gsap/react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
  IconPlayerPause,
  IconPlayerPlay,
} from "@tabler/icons-react";
import gsap from "gsap";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingState } from "@/components/ui/loading-state";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import styles from "./project-slider.module.css";

gsap.registerPlugin(useGSAP);

// The full project catalog (~700 lines of data) only backs the archive
// dialog; load it on open instead of shipping it with the seven curated cards.
const loadArchive = () =>
  import("@/components/projects").then((mod) => mod.default);

export type Project = {
  background: string;
  tone: "light" | "dark";
  title: string;
  description: string;
  tags: string[];
  slug: string;
  art: string | null;
};
type Mode = "handoff" | "relay";
const wrap = (index: number, length: number) =>
  ((index % length) + length) % length;

export function ProjectSlider({
  mode = "handoff",
  projects,
  debugFrames = false,
}: {
  mode?: Mode;
  projects: Project[];
  debugFrames?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const nextControl = useRef<HTMLButtonElement>(null);
  const previous = useRef(new Map<string, DOMRect>());
  const busyRef = useRef(false);
  const hasAdvanced = useRef(false);
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archiveStatus, setArchiveStatus] = useState<
    "error" | "idle" | "loading" | "ready"
  >("idle");
  const [ArchiveContent, setArchiveContent] = useState<Awaited<
    ReturnType<typeof loadArchive>
  > | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const reduced = useReducedMotion();
  const requestArchive = useCallback(() => {
    if (archiveStatus === "loading" || archiveStatus === "ready") return;
    setArchiveStatus("loading");
    loadArchive()
      .then((Component) => {
        setArchiveContent(() => Component);
        setArchiveStatus("ready");
      })
      .catch(() => setArchiveStatus("error"));
  }, [archiveStatus]);
  const advance = useCallback(
    (amount: number) => {
      if (busyRef.current) return;
      hasAdvanced.current = true;
      if (root.current?.contains(document.activeElement))
        nextControl.current?.focus();
      previous.current = new Map(
        Array.from(
          root.current?.querySelectorAll<HTMLElement>("[data-project]") ?? []
        ).map((el) => [el.dataset.project ?? "", el.getBoundingClientRect()])
      );
      busyRef.current = true;
      setBusy(true);
      setIndex((current) => wrap(current + amount, projects.length));
    },
    [projects.length]
  );

  useGSAP(
    () => {
      if (!previous.current.size) return;
      const cards = Array.from(
        root.current?.querySelectorAll<HTMLElement>("[data-project]") ?? []
      );
      const positions = cards.map((card) => ({
        card,
        old: previous.current.get(card.dataset.project ?? ""),
        rect: card.getBoundingClientRect(),
      }));
      const finish = () => {
        for (const card of cards) {
          for (const element of [
            card,
            ...card.querySelectorAll<HTMLElement>("img, [data-copy] > *"),
          ]) {
            element.style.removeProperty("transform");
            element.style.removeProperty("opacity");
            element.style.removeProperty("transform-origin");
            element.style.removeProperty("border-radius");
          }
        }
        busyRef.current = false;
        setBusy(false);
      };
      if (reduced) {
        finish();
        return;
      }
      const timeline = gsap.timeline({
        defaults: { force3D: true },
        onComplete: finish,
      });
      for (const { card, rect, old } of positions) {
        const slot = Number(card.dataset.slot);
        const isFeature = slot === 0;
        const duration = mode === "handoff" ? 0.9 : 0.65;
        if (isFeature && mode === "relay") {
          timeline.fromTo(
            card,
            { opacity: 0 },
            {
              duration,
              ease: "power3.out",
              opacity: 1,
            },
            0.08
          );
          const art = card.querySelector("img");
          if (art)
            timeline.fromTo(
              art,
              { x: 52 },
              { duration, ease: "power3.out", x: 0 },
              0.08
            );
        } else if (old) {
          const copy = Array.from(
            card.querySelectorAll<HTMLElement>("[data-copy] > *")
          );
          const resized =
            Math.abs(old.width / rect.width - old.height / rect.height) > 0.01;
          const preserveText = () => {
            // Cancel non-uniform card scaling without detaching or fading its copy.
            const scaleX = Number(gsap.getProperty(card, "scaleX"));
            const scaleY = Number(gsap.getProperty(card, "scaleY"));
            for (const element of copy) {
              element.style.transformOrigin = "top left";
              element.style.transform = `scaleY(${scaleX / scaleY})`;
            }
          };
          timeline.fromTo(
            card,
            {
              opacity: 1,
              scaleX: old.width / rect.width,
              scaleY: old.height / rect.height,
              transformOrigin: "top left",
              x: old.left - rect.left,
              y: old.top - rect.top,
            },
            {
              duration,
              ease: "power3.inOut",
              onUpdate: resized ? preserveText : undefined,
              opacity: 1,
              scaleX: 1,
              scaleY: 1,
              x: 0,
              y: 0,
            },
            0
          );
          if (resized) preserveText();
        } else if (slot > 0) {
          timeline.fromTo(
            card,
            { opacity: 0, y: 24 },
            {
              duration: 0.55,
              ease: "power3.out",
              opacity: 1,
              y: 0,
            },
            0
          );
        }
      }
      const settle = () => {
        timeline.progress(1);
      };
      // Development-only prototype: deterministic start/mid/end visual checks.
      const frameTime = new URLSearchParams(window.location.search).get("t");
      if (
        debugFrames &&
        frameTime !== null &&
        Number.isFinite(Number(frameTime))
      ) {
        timeline.pause(Math.max(0, Number(frameTime)), false);
      }
      window.addEventListener("resize", settle);
      document.addEventListener("visibilitychange", settle);
      return () => {
        window.removeEventListener("resize", settle);
        document.removeEventListener("visibilitychange", settle);
      };
    },
    {
      dependencies: [index, mode, reduced, debugFrames],
      revertOnUpdate: true,
      scope: root,
    }
  );

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(el);
    const update = () => setTabVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  const running =
    !(paused || hovered || focused || archiveOpen) &&
    visible &&
    tabVisible &&
    !reduced &&
    !busy;
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => advance(1), 8000);
    return () => window.clearTimeout(timer);
  }, [running, advance, index]);

  return (
    <section
      aria-label={`${mode === "handoff" ? "Card handoff" : "Editorial relay"} project carousel`}
      aria-roledescription="carousel"
      className={styles.carousel}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      onFocusCapture={() => setFocused(true)}
    >
      <div
        className={styles.stage}
        data-busy={busy}
        data-index={index}
        data-mode={mode}
        onPointerLeave={() => setHovered(false)}
        onPointerMove={(event) => {
          if (event.pointerType === "mouse")
            setHovered(
              event.target instanceof Element &&
                Boolean(event.target.closest("a, button"))
            );
        }}
        ref={root}
      >
        {[-1, 0, 1, 2, 3, 4].map((slot) => {
          const project = projects[wrap(index + slot, projects.length)];
          const hidden = slot < 0 || slot > 3;
          const preloadFeature =
            slot === 0 && !hasAdvanced.current && project.art
              ? getImageProps({
                  alt: "",
                  fill: true,
                  sizes: "(max-width: 767px) 95vw, 65vw",
                  src: project.art,
                }).props
              : null;
          return (
            <article
              aria-hidden={hidden || undefined}
              className={styles.card}
              data-project={project.slug}
              data-slot={slot}
              data-theme={project.tone}
              inert={hidden || busy}
              key={project.slug}
              style={{ backgroundColor: project.background }}
            >
              {preloadFeature && (
                <link
                  as="image"
                  fetchPriority="high"
                  href={preloadFeature.src}
                  imageSizes={preloadFeature.sizes}
                  imageSrcSet={preloadFeature.srcSet}
                  // Desktop-only: production Lighthouse shows the desktop LCP is
                  // this card's art, while mobile LCP is the game board, whose
                  // own priority must stay uncontested.
                  media="(min-width: 768px)"
                  rel="preload"
                />
              )}
              {project.art && (
                <Image
                  alt=""
                  className={styles.art}
                  fill
                  loading="lazy"
                  sizes="(max-width: 767px) 95vw, 65vw"
                  src={project.art}
                />
              )}
              <div className={styles.copy} data-copy>
                <span className={styles.label}>
                  {slot === 0 ? "Featured project" : project.tags[0]}
                </span>
                <h2>{project.title}</h2>
                <p>{project.description}</p>
                {slot === 0 ? (
                  <Link
                    className={styles.projectLink}
                    href={`/projects/${project.slug}`}
                  >
                    View project <IconArrowRight size={18} />
                  </Link>
                ) : (
                  <Button
                    aria-label={`Feature ${project.title}`}
                    className={styles.promote}
                    onClick={() => advance(slot)}
                    size="icon"
                    variant="unstyled"
                  >
                    <IconArrowUpRight size={20} />
                  </Button>
                )}
                <span className={styles.tags}>
                  {project.tags.slice(0, 3).join(" · ")}
                </span>
              </div>
            </article>
          );
        })}
      </div>
      <div className={styles.toolbar}>
        <Dialog
          onOpenChange={(open) => {
            setArchiveOpen(open);
            if (open) requestArchive();
          }}
          open={archiveOpen}
        >
          <DialogTrigger
            render={<Button className={styles.explore} variant="unstyled" />}
          >
            Explore the work <IconArrowUpRight aria-hidden="true" size={18} />
          </DialogTrigger>
          <DialogContent className="flex h-[85dvh] flex-col gap-0 overflow-clip p-0 sm:max-w-4xl">
            <header className="shrink-0 border-b border-border px-5 py-5 pr-16 sm:px-8 sm:pr-16">
              <DialogTitle className="font-heading text-2xl tracking-tight">
                Selected projects
              </DialogTitle>
              <DialogDescription className="sr-only">
                Browse projects and collections, then open a project to explore
                the work.
              </DialogDescription>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
              {archiveStatus === "ready" && ArchiveContent ? (
                <ArchiveContent />
              ) : archiveStatus === "error" ? (
                <div className="flex flex-col items-start gap-3" role="alert">
                  <p>Couldn't load the project archive.</p>
                  <div className="flex items-center gap-4">
                    <Button onClick={requestArchive} variant="unstyled">
                      Try again
                    </Button>
                    <Link href="/projects">View all projects</Link>
                  </div>
                </div>
              ) : (
                <LoadingState label="Loading projects…" />
              )}
            </div>
          </DialogContent>
        </Dialog>
        <fieldset aria-label="Project navigation" className={styles.controls}>
          <Button
            aria-disabled={busy}
            aria-label="Next project"
            onClick={() => advance(1)}
            ref={nextControl}
            size="icon"
            variant="unstyled"
          >
            <IconArrowLeft className={styles.directionArrow} />
          </Button>
          <Button
            aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
            disabled={reduced}
            onClick={() => {
              if (paused) setFocused(false);
              setPaused((value) => !value);
            }}
            size="icon"
            variant="unstyled"
          >
            {paused || reduced ? <IconPlayerPlay /> : <IconPlayerPause />}
          </Button>
          <Button
            aria-disabled={busy}
            aria-label="Previous project"
            onClick={() => advance(-1)}
            size="icon"
            variant="unstyled"
          >
            <IconArrowRight className={styles.directionArrow} />
          </Button>
          <span
            aria-live={paused || focused || reduced ? "polite" : "off"}
            className="sr-only"
          >
            {projects[index].title}
          </span>
        </fieldset>
      </div>
    </section>
  );
}
