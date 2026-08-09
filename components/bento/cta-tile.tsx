"use client";

import {
  IconArrowLeft,
  IconArrowUpRight,
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
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { microSpring, premiumSpring, softSpring } from "@/lib/motion";
import { TILE_TITLE } from "@/lib/typography";
import { cn } from "@/lib/utils";

const premiumEase = [0.16, 1, 0.3, 1] as const;

/**
 * Backdrop fade — opacity only, ~0.2s. Kept local (not in lib/motion.ts) so
 * this file doesn't touch a shared token another agent may be editing.
 */
const backdropTransition = { duration: 0.2, ease: premiumEase } as const;

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
      className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-full
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
        className="absolute -top-32 -left-32 w-[560px] h-[560px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.055) 0%, transparent 62%)",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-[320px] h-[320px] rounded-full pointer-events-none"
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
    // Scroll the still-in-place grid tile into view first, then let it morph
    // into the fixed overlay — the overlay no longer depends on scroll
    // position, but this preserves the original "bring contact into view"
    // behavior for the moment right before it lifts out.
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

  // Escape-to-close + background scroll lock + focus containment while the
  // panel floats above the page as a real fixed-position dialog.
  useEffect(() => {
    if (!isBooking) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeBooking();
      }
    };

    // Belt-and-suspenders focus trap: Tab/Shift+Tab cycling within a
    // cross-origin iframe (the Cal.com embed) happens inside that iframe's
    // own document — this page's JS can't intercept those keydowns. What we
    // *can* observe is focus landing back on the host page once it walks
    // off either end of the iframe's internal tab order. `focusin` catches
    // that (and any other way focus might otherwise escape the panel) and
    // pulls it back to the panel's first focusable element.
    const handleFocusIn = (event: FocusEvent) => {
      const panel = sectionRef.current;
      if (!panel || panel.contains(event.target as Node)) {
        return;
      }
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
      );
      (focusable[0] ?? panel).focus();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
      document.body.style.overflow = previousOverflow;
    };
  }, [isBooking, closeBooking]);

  // Move focus into the panel the moment it opens (the "Back" affordance is
  // the natural first stop), and return it to the "Get in touch" trigger
  // when the panel closes — the trigger re-mounts fresh on close (it's
  // inside the AnimatePresence-swapped intro content), so we look it up via
  // the wrapper ref rather than holding a stale element reference.
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

  const layoutId = shouldReduce ? undefined : "cta-tile";
  const morphTransition = shouldReduce ? { duration: 0 } : premiumSpring;

  return (
    <>
      {/* Backdrop is the only thing that truly mounts/unmounts here, so its
          exit animation can never get tangled with the tile's own layoutId
          FLIP (a two-node shared-layoutId crossfade was tried first and
          reliably got stuck mid-exit, leaving Escape/click-outside inert —
          see git history). The tile itself stays mounted the whole time and
          just morphs its own box via layoutId + premiumSpring. */}
      <AnimatePresence>
        {isBooking && (
          <motion.div
            animate={{ opacity: 1 }}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="cta-backdrop"
            onClick={closeBooking}
            transition={shouldReduce ? { duration: 0 } : backdropTransition}
          />
        )}
      </AnimatePresence>

      <motion.section
        aria-label={isBooking ? "Book a call" : undefined}
        aria-modal={isBooking ? true : undefined}
        className={cn(
          "scroll-mt-28 overflow-hidden rounded-[1.25rem]",
          isBooking
            ? "fixed z-50 inset-4 sm:inset-8 md:inset-16 lg:inset-24 xl:inset-32"
            : "relative h-full min-h-[420px] sm:min-h-[480px] lg:min-h-[560px]"
        )}
        id="contact"
        layoutId={layoutId}
        onMouseEnter={shouldReduce ? undefined : handleMouseEnter}
        onMouseLeave={shouldReduce ? undefined : handleMouseLeave}
        onMouseMove={shouldReduce ? undefined : handleMouseMove}
        ref={setRefs}
        role={isBooking ? "dialog" : undefined}
        style={tileSurfaceStyle}
        tabIndex={isBooking ? -1 : undefined}
        transition={morphTransition}
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
                  <p className="ui-label text-white/30">06 — Contact</p>
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
                  className="shrink-0 rounded-full border border-white/[0.12] bg-white/[0.06]
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
                className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/[0.08]
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
                  06 — Contact
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
                  <span className="text-white/40 font-light">something</span>
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
                    className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-full
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
                  as="a"
                  className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-full
                             bg-white/[0.07] border border-white/[0.14]
                             text-[13px] font-semibold text-white/80
                             [@media(hover:hover)]:hover:bg-white/[0.12]
                             [@media(hover:hover)]:hover:border-white/[0.24]
                             [@media(hover:hover)]:hover:text-white
                             transition-all duration-200
                             active:scale-[0.97]"
                  href={siteConfig.files.cv}
                  rel="noopener noreferrer"
                  strength={shouldReduce ? 0 : 10}
                  target="_blank"
                >
                  <IconFileText size={15} />
                  View Resume
                  <IconArrowUpRight className="opacity-60" size={13} />
                </MagneticButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </>
  );
}
