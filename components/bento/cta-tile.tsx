"use client";

import {
  IconArrowLeft,
  IconCalendar,
  IconCheck,
  IconFileText,
  IconMail,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import dynamic from "next/dynamic";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CanvasGrain } from "@/components/canvas-grain";
import { Button } from "@/components/ui/button";
import { CVModal } from "@/components/ui/cv-modal";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { microSpring, premiumSpring, softSpring } from "@/lib/motion";
import { TILE_TITLE } from "@/lib/typography";
import { cn } from "@/lib/utils";

const contentExit = { opacity: 0, transition: { duration: 0.15 } } as const;

const bookingContentInitial = { opacity: 0, y: 16 } as const;
const bookingContentAnimate = {
  opacity: 1,
  transition: { ...softSpring, delay: 0.18 },
  y: 0,
} as const;

const calEmbedInitial = { opacity: 0, y: 20 } as const;
const calEmbedAnimate = {
  opacity: 1,
  transition: { ...softSpring, delay: 0.32 },
  y: 0,
} as const;

const Cal = dynamic(
  () => import("@calcom/embed-react").then((module) => module.default),
  {
    loading: () => (
      <div className="flex min-h-[560px] flex-col gap-4 px-2 py-4 sm:px-4">
        <Skeleton className="h-8 w-40 bg-white/10" />
        <Skeleton className="h-[480px] w-full bg-white/[0.06]" />
      </div>
    ),
    ssr: false,
  }
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.05, staggerChildren: 0.09 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    // Converged onto the shared premiumSpring token — this was a near-duplicate
    // ad-hoc entrance spring doing the same job as the rest of the app's
    // section/tile reveals.
    transition: premiumSpring,
    y: 0,
  },
};

const tileSurfaceStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, #0e0e11 0%, #18181c 100%)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.30)",
};

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email.display);
      setCopied(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — graceful no-op; mailto link still works
    }
  }, []);

  return (
    <Button
      aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-none
                 bg-white/[0.06] border border-white/[0.1]
                 text-[12px] font-mono text-white/40
                 [@media(hover:hover)]:hover:bg-white/[0.12] [@media(hover:hover)]:hover:border-white/[0.2]
                 [@media(hover:hover)]:hover:text-white/70
                 transition-all duration-200 active:scale-[0.97] cursor-pointer select-none"
      onClick={handleCopy}
      type="button"
      variant="ghost"
    >
      <span aria-atomic="true" aria-live="polite" className="sr-only">
        {copied ? "Email copied to clipboard" : ""}
      </span>

      <motion.span
        animate={{ opacity: 1, scale: 1 }}
        aria-hidden="true"
        className="flex items-center"
        initial={{ opacity: 0, scale: 0.7 }}
        key={copied ? "check" : "mail"}
        transition={microSpring}
      >
        {copied ? (
          <IconCheck className="text-white/70" size={11} />
        ) : (
          <IconMail size={11} />
        )}
      </motion.span>

      <motion.span
        animate={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -4 }}
        key={copied ? "copied-label" : "email-label"}
        transition={microSpring}
      >
        {copied ? "Copied" : siteConfig.email.display}
      </motion.span>
    </Button>
  );
}

function CalEmbed() {
  useEffect(() => {
    void import("@calcom/embed-react").then(async ({ getCalApi }) => {
      const cal = await getCalApi({ namespace: "15min" });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
        styles: {
          branding: { brandColor: "#fafafa" },
        },
        theme: "dark",
      });
    });
  }, []);

  return (
    <Cal
      calLink="mukulchugh/15min"
      config={{ layout: "month_view", theme: "dark" }}
      namespace="15min"
      style={{ height: "100%", minHeight: 560, width: "100%" }}
    />
  );
}

/** Grain + soft radial blobs — decoration shared by both tile states. */
function TileChrome() {
  return (
    <>
      <CanvasGrain
        className="mix-blend-multiply dark:mix-blend-soft-light"
        opacity={0.055}
      />

      <div
        aria-hidden="true"
        className="absolute -top-32 -left-32 w-[560px] h-[560px] rounded-none pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.055) 0%, transparent 62%)",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-[320px] h-[320px] rounded-none pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 70% 80%, rgba(255,255,255,0.018) 0%, transparent 60%)",
        }}
      />
    </>
  );
}

export function CTATile() {
  const { ref } = useSectionInView("Contact");
  const sectionRef = useRef<HTMLElement | null>(null);
  const triggerWrapperRef = useRef<HTMLDivElement | null>(null);
  const backButtonRef = useRef<HTMLButtonElement | null>(null);
  const shouldRestoreFocusRef = useRef(false);
  const shouldReduce = useReducedMotion();
  const [mode, setMode] = useState<"intro" | "booking">("intro");
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const isBooking = mode === "booking";

  const rawX = useMotionValue(50);
  const rawY = useMotionValue(50);
  const springX = useSpring(rawX, { damping: 22, stiffness: 80 });
  const springY = useSpring(rawY, { damping: 22, stiffness: 80 });
  const opacity = useMotionValue(0);
  const springOpacity = useSpring(opacity, { damping: 30, stiffness: 140 });

  const background = useTransform(
    [springX, springY],
    ([x, y]: number[]) =>
      `radial-gradient(520px circle at ${x}% ${y}%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.028) 32%, transparent 65%)`
  );

  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      sectionRef.current = node;
      ref(node);
    },
    [ref]
  );

  const openBooking = useCallback(() => {
    // Scroll the tile into view first — it stays exactly where it is in the
    // grid and grows in place, so bringing it fully on-screen before the
    // content swap keeps the new (taller) booking state from opening partly
    // off-viewport.
    sectionRef.current?.scrollIntoView({
      behavior: shouldReduce ? "auto" : "smooth",
      block: "start",
    });
    setMode("booking");
  }, [shouldReduce]);

  const closeBooking = useCallback(() => {
    shouldRestoreFocusRef.current = true;
    setMode("intro");
  }, []);

  // Escape-to-go-back is a nice-to-have carried over from before — it's not
  // guarding a modal anymore (no focus trap, no scroll lock, no
  // click-outside-to-close: this is a normal in-page section, not a lifted
  // overlay), just a keyboard shortcut back to the intro state.
  useEffect(() => {
    if (!isBooking) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeBooking();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isBooking, closeBooking]);

  // Move focus to the "Back" button when booking content mounts (the
  // natural first stop for keyboard users), and return it to the "Get in
  // touch" trigger when we're back on the intro state — the trigger
  // re-mounts fresh on return (it's inside the AnimatePresence-swapped
  // intro content), so we look it up via the wrapper ref rather than
  // holding a stale element reference.
  useEffect(() => {
    if (isBooking) {
      backButtonRef.current?.focus();
      return;
    }

    if (!shouldRestoreFocusRef.current) {
      return;
    }
    shouldRestoreFocusRef.current = false;
    triggerWrapperRef.current?.querySelector<HTMLElement>("button")?.focus();
  }, [isBooking]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (isBooking) {
        return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      rawX.set(((e.clientX - rect.left) / rect.width) * 100);
      rawY.set(((e.clientY - rect.top) / rect.height) * 100);
    },
    [isBooking, rawX, rawY]
  );

  const handleMouseEnter = useCallback(() => {
    if (isBooking) {
      return;
    }
    opacity.set(1);
  }, [isBooking, opacity]);

  const handleMouseLeave = useCallback(() => {
    opacity.set(0);
  }, [opacity]);

  return (
    <>
      {/* In-place, grid-resident tile — no fixed/portal overlay, no backdrop.
          Booking mode grows the tile's own min-height (plain CSS transition,
          same spirit as main's pre-redesign contact section) instead of
          lifting it out of the bento grid's document flow. The rest of the
          page — other tiles, scroll position — stays exactly where it is. */}
      <section
        className={cn(
          "scroll-mt-28 relative h-full overflow-hidden rounded-none",
          "transition-[min-height] duration-500 ease-out",
          isBooking
            ? "min-h-[620px] sm:min-h-[680px] lg:min-h-[760px]"
            : "min-h-[420px] sm:min-h-[480px] lg:min-h-[560px]"
        )}
        id="contact"
        onMouseEnter={shouldReduce ? undefined : handleMouseEnter}
        onMouseLeave={shouldReduce ? undefined : handleMouseLeave}
        onMouseMove={shouldReduce ? undefined : handleMouseMove}
        ref={setRefs}
        style={tileSurfaceStyle}
      >
        <TileChrome />

        {!isBooking &&
          (shouldReduce ? (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(520px circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 65%)",
              }}
            />
          ) : (
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background,
                mixBlendMode: "screen",
                opacity: springOpacity,
              }}
            />
          ))}

        {/* popLayout so the exiting content is pulled out of flow immediately
            (intro's row layout and booking's column layout are structurally
            different — without this the two would momentarily stack).
            Sync/popLayout only, never "wait": mode="wait" here would recreate
            the exact bug this rework fixes (see below). */}
        <AnimatePresence initial={false} mode="popLayout">
          {isBooking ? (
            <motion.div
              animate={shouldReduce ? { opacity: 1 } : bookingContentAnimate}
              className="relative z-10 flex h-full flex-col gap-5 p-5 sm:p-6 lg:p-8"
              exit={shouldReduce ? { opacity: 0 } : contentExit}
              initial={shouldReduce ? { opacity: 0 } : bookingContentInitial}
              key="booking-content"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <p className="ui-label text-white/30">06 · Contact</p>
                  <h2
                    className={cn(
                      "font-syne",
                      "text-[1.35rem] sm:text-[1.6rem] font-black tracking-[-0.04em] text-white"
                    )}
                  >
                    Pick a time
                  </h2>
                  <p className="text-[13px] text-white/40 max-w-[42ch]">
                    Fifteen minutes. No pitch deck required.
                  </p>
                </div>

                <Button
                  aria-label="Back to contact options"
                  className="shrink-0 rounded-none border border-white/[0.12] bg-white/[0.06]
                             px-3.5 text-[12px] font-medium text-white/70
                             hover:bg-white/[0.1] hover:text-white"
                  onClick={closeBooking}
                  ref={backButtonRef}
                  type="button"
                  variant="ghost"
                >
                  <IconArrowLeft size={14} />
                  Back
                </Button>
              </div>

              <motion.div
                animate={shouldReduce ? { opacity: 1 } : calEmbedAnimate}
                className="min-h-0 flex-1 overflow-y-auto rounded-none border border-white/[0.08]
                           bg-[#0a0a0c]/80"
                initial={shouldReduce ? { opacity: 0 } : calEmbedInitial}
              >
                <CalEmbed />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              // IMPORTANT: `animate`/`initial` here MUST be variant label
              // strings ("visible"/"hidden"), not raw objects — Motion only
              // propagates variant state to `motion.*` children (itemVariants
              // below) when the parent's animate/initial resolves to a
              // label. This is what caused the earlier "intro content stuck
              // invisible after Back" bug: the old parent used
              // animate={{opacity:1, ...}} as an object literal, so children
              // matched against itemVariants.hidden and never received a
              // "visible" signal to animate away from it.
              animate={shouldReduce ? undefined : "visible"}
              className="relative z-10 h-full flex flex-col lg:flex-row lg:items-center justify-between
                         gap-6 sm:gap-8 p-6 sm:p-8 lg:p-10"
              exit={shouldReduce ? { opacity: 0 } : contentExit}
              initial={shouldReduce ? undefined : "hidden"}
              key="intro-content"
              style={shouldReduce ? { opacity: 1 } : undefined}
              variants={shouldReduce ? undefined : containerVariants}
            >
              <div className="flex flex-col gap-3 max-w-xl">
                <motion.p
                  className="ui-label text-white/30"
                  variants={shouldReduce ? undefined : itemVariants}
                >
                  06 · Contact
                </motion.p>

                <motion.h2
                  className={cn(
                    "font-syne",
                    "font-black tracking-[-0.05em] leading-[0.93] text-white text-balance"
                  )}
                  style={{ fontSize: TILE_TITLE }}
                  variants={shouldReduce ? undefined : itemVariants}
                >
                  Let&apos;s build
                  <br />
                  {/* Same font-size as the black-weight lines above/below
                      (TILE_TITLE applies uniformly) — the de-emphasis comes
                      from color + weight, not a smaller size. font-light
                      (300) next to font-black (900) at identical size read
                      as visibly smaller than its siblings (thin strokes vs.
                      heavy ones), so this uses font-normal instead: still
                      clearly lighter than the surrounding black weight, but
                      without the "shrunk" illusion. */}
                  <span className="text-white/40 font-normal">something</span>
                  <br />
                  <span className="text-white">together.</span>
                </motion.h2>

                <motion.p
                  className="text-[14px] text-white/40 leading-relaxed max-w-[44ch]"
                  variants={shouldReduce ? undefined : itemVariants}
                >
                  Have a problem worth solving? I want to hear about it.
                </motion.p>

                <motion.div
                  className="flex items-center gap-2 flex-wrap"
                  variants={shouldReduce ? undefined : itemVariants}
                >
                  <CopyEmailButton />
                  <a
                    aria-label={`Send email to ${siteConfig.email.display}`}
                    className="font-mono text-[11px] text-white/20 [@media(hover:hover)]:hover:text-white/40
                               transition-colors duration-150 underline underline-offset-2
                               decoration-white/15 [@media(hover:hover)]:hover:decoration-white/30"
                    href={`mailto:${siteConfig.email.display}`}
                  >
                    or open mail app
                  </a>
                </motion.div>
              </div>

              <motion.div
                className="flex flex-wrap items-start gap-3 flex-shrink-0"
                variants={shouldReduce ? undefined : itemVariants}
              >
                <div className="contents" ref={triggerWrapperRef}>
                  <MagneticButton
                    aria-label="Book a call"
                    as="button"
                    className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-none
                               bg-white text-zinc-950
                               text-[13px] font-bold tracking-tight
                               shadow-[0_4px_28px_-4px_rgba(255,255,255,0.18)]
                               [@media(hover:hover)]:hover:shadow-[0_4px_36px_-4px_rgba(255,255,255,0.28)]
                               transition-shadow duration-200
                               active:scale-[0.97]"
                    onClick={openBooking}
                    strength={shouldReduce ? 0 : 12}
                  >
                    <IconCalendar size={15} />
                    Get in touch
                  </MagneticButton>
                </div>

                <MagneticButton
                  aria-label="View resume"
                  as="button"
                  className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-none
                             bg-white/[0.07] border border-white/[0.14]
                             text-[13px] font-semibold text-white/80
                             [@media(hover:hover)]:hover:bg-white/[0.12]
                             [@media(hover:hover)]:hover:border-white/[0.24]
                             [@media(hover:hover)]:hover:text-white
                             transition-all duration-200
                             active:scale-[0.97]"
                  onClick={() => setIsCVModalOpen(true)}
                  strength={shouldReduce ? 0 : 10}
                >
                  <IconFileText size={15} />
                  View Resume
                </MagneticButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <CVModal
        cvUrl={siteConfig.files.cv}
        isOpen={isCVModalOpen}
        name={siteConfig.firstName}
        onClose={() => setIsCVModalOpen(false)}
      />
    </>
  );
}
