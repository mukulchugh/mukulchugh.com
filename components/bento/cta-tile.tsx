"use client";

import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconMail,
  IconVideo,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { microSpring, premiumSpring, softSpring } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const contentExit = { opacity: 0, transition: { duration: 0.15 } } as const;

const bookingContentInitial = { opacity: 0, y: 16 } as const;
const bookingContentAnimate = {
  opacity: 1,
  transition: softSpring,
  y: 0,
} as const;

const calEmbedInitial = { opacity: 0, y: 20 } as const;
const calEmbedAnimate = {
  opacity: 1,
  transition: { ...softSpring, delay: 0.06 },
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
  background: "#101112",
};

function CopyEmailButton({
  light = false,
  homepage = false,
}: {
  light?: boolean;
  homepage?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email.display);
      setCopyFailed(false);
      setCopied(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopyFailed(true);
    }
  }, []);

  return (
    <Button
      aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
      className={cn(
        `inline-flex w-full items-center gap-2 px-4 py-2 min-h-[44px] rounded-[10px]
                 bg-white/[0.06] border border-white/[0.1]
                 text-sm font-sans text-white/90
                 [@media(hover:hover)]:hover:bg-white/[0.12] [@media(hover:hover)]:hover:border-white/[0.2]
                 [@media(hover:hover)]:hover:text-white
                 transition-colors duration-200 cursor-pointer select-none`,
        homepage && "min-h-12 justify-start px-5 [&_svg]:size-4",
        light &&
          "border-black/15 bg-black/[0.03] text-black/75 [@media(hover:hover)]:hover:border-black/25 [@media(hover:hover)]:hover:bg-black/[0.06] [@media(hover:hover)]:hover:text-black"
      )}
      onClick={handleCopy}
      type="button"
      variant="ghost"
    >
      <span aria-atomic="true" aria-live="polite" className="sr-only">
        {copyFailed
          ? "Could not copy. Use the open mail app link."
          : copied
            ? "Email copied to clipboard"
            : ""}
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
          <IconCheck
            className={light ? "text-black/70" : "text-white/70"}
            size={11}
          />
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
        <span
          className={cn("block text-left text-[11px]", homepage && "text-sm")}
        >
          {copyFailed ? "Use the email link" : copied ? "Copied" : "Copy email"}
        </span>
        <span className={cn("block text-[9px]", homepage && "text-xs")}>
          {siteConfig.email.display}
        </span>
      </motion.span>
    </Button>
  );
}

function CalEmbed() {
  const [configured, setConfigured] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "slow" | "error">(
    "loading"
  );
  useEffect(() => {
    let disposed = false;
    let unsubscribe: (() => void) | undefined;
    const timeout = setTimeout(() => setStatus("slow"), 15_000);
    const ready = () => {
      clearTimeout(timeout);
      if (!disposed) setStatus("ready");
    };
    const failed = () => {
      clearTimeout(timeout);
      if (!disposed) setStatus("error");
    };
    void import("@calcom/embed-react")
      .then(async ({ getCalApi }) => {
        const cal = await getCalApi({ namespace: "15min" });
        if (disposed) return;
        cal("on", { action: "linkReady", callback: ready });
        cal("on", { action: "linkFailed", callback: failed });
        unsubscribe = () => {
          cal("off", { action: "linkReady", callback: ready });
          cal("off", { action: "linkFailed", callback: failed });
        };
        cal("ui", {
          hideEventTypeDetails: false,
          layout: "month_view",
          styles: { branding: { brandColor: "#fafafa" } },
          theme: "dark",
        });
        setConfigured(true);
      })
      .catch(failed);
    return () => {
      disposed = true;
      clearTimeout(timeout);
      unsubscribe?.();
    };
  }, []);

  return (
    <>
      <div className="space-y-2 px-4 py-4 text-base text-white/75">
        <p aria-live="polite" role="status">
          {status === "loading" && "Loading available times…"}
          {status === "slow" &&
            "The calendar is taking longer than expected. You can open it directly or email me."}
          {status === "error" &&
            "The calendar could not load. Open it directly or email me to arrange a time."}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a
            className="underline underline-offset-4"
            href="https://cal.com/mukulchugh/15min"
            rel="noopener noreferrer"
            target="_blank"
          >
            Open calendar
          </a>
          <a
            className="underline underline-offset-4"
            href={`mailto:${siteConfig.email.display}`}
          >
            Email instead
          </a>
        </div>
      </div>
      {configured && status !== "error" && (
        <Cal
          calLink="mukulchugh/15min"
          config={{ layout: "month_view", theme: "dark" }}
          namespace="15min"
          style={{ height: 560, width: "100%" }}
        />
      )}
    </>
  );
}

/** Grain + soft radial blobs — decoration shared by both tile states. */
function TileChrome() {
  return (
    <Image
      alt=""
      className="pointer-events-none z-0 object-cover md:object-fill"
      fill
      loading="eager"
      sizes="100vw"
      src="/design/contact-orbit-v2.png"
    />
  );
}

export function CTATile({
  appearance = "dark",
  compact = false,
  homepage = false,
}: {
  appearance?: "dark" | "light";
  compact?: boolean;
  homepage?: boolean;
}) {
  const { ref } = useSectionInView("Contact");
  const sectionRef = useRef<HTMLElement | null>(null);
  const triggerWrapperRef = useRef<HTMLDivElement | null>(null);
  const backButtonRef = useRef<HTMLButtonElement | null>(null);
  const shouldRestoreFocusRef = useRef(false);
  const shouldReduce = useReducedMotion();
  const [mode, setMode] = useState<"intro" | "booking">("intro");
  const isBooking = mode === "booking";
  const lightIntro = appearance === "light" && !isBooking;

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
    if (homepage) return;
    shouldRestoreFocusRef.current = false;
    triggerWrapperRef.current?.querySelector<HTMLElement>("button")?.focus();
  }, [isBooking, homepage]);

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
      <motion.section
        className={cn(
          "tile-glass scroll-mt-28 relative h-full overflow-hidden rounded-[14px]",
          homepage &&
            "transition-[min-height] duration-500 ease-out motion-reduce:transition-none",
          isBooking
            ? "min-h-[620px] sm:min-h-[680px] lg:min-h-[760px]"
            : homepage
              ? "min-h-[460px] md:min-h-[480px]"
              : compact
                ? "min-h-[320px]"
                : "min-h-[340px] md:min-h-[22cqw]",
          lightIntro && "border border-border"
        )}
        id="contact"
        layout={homepage ? false : "size"}
        onMouseEnter={shouldReduce ? undefined : handleMouseEnter}
        onMouseLeave={shouldReduce ? undefined : handleMouseLeave}
        onMouseMove={shouldReduce ? undefined : handleMouseMove}
        ref={setRefs}
        style={lightIntro ? { background: "#f4f4f2" } : tileSurfaceStyle}
        transition={shouldReduce ? { duration: 0 } : premiumSpring}
      >
        {!lightIntro && <TileChrome />}

        {!(isBooking || lightIntro) &&
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
        <AnimatePresence initial={false} mode={homepage ? "wait" : "popLayout"}>
          {isBooking ? (
            <motion.div
              animate={shouldReduce ? { opacity: 1 } : bookingContentAnimate}
              className={cn(
                "relative z-10 flex h-full flex-col gap-5 p-5 sm:p-6 lg:p-8",
                appearance === "light" && "bg-[#101112]"
              )}
              exit={shouldReduce ? { opacity: 0 } : contentExit}
              initial={shouldReduce ? { opacity: 0 } : bookingContentInitial}
              key="booking-content"
              onAnimationComplete={() =>
                backButtonRef.current?.focus({ preventScroll: true })
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <h2
                    className={cn(
                      "font-sans",
                      "text-2xl sm:text-3xl font-semibold leading-[1.15] tracking-[-0.025em] text-white"
                    )}
                  >
                    Pick a time
                  </h2>
                  <p className="text-base text-white/70 max-w-[42ch]">
                    Fifteen minutes. No pitch deck required.
                  </p>
                </div>

                <Button
                  aria-label="Back to contact options"
                  className="shrink-0 rounded-[10px] border border-white/[0.2] bg-white/[0.06]
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
                className="overflow-hidden rounded-none border border-white/[0.08]
                           bg-[#0a0a0c]"
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
              animate={
                shouldReduce || homepage ? { opacity: 1, y: 0 } : "visible"
              }
              className={cn(
                "relative z-10 h-full flex flex-col justify-between gap-6 p-5 md:px-[2cqw] md:py-[1.6cqw]",
                !compact && "md:flex-row md:items-center",
                homepage && "min-h-[460px] gap-10 p-7 md:min-h-[480px] md:p-12",
                appearance === "light" && "bg-[#f4f4f2]"
              )}
              exit={shouldReduce ? { opacity: 0 } : contentExit}
              initial={
                shouldReduce
                  ? false
                  : homepage
                    ? { opacity: 0, y: 12 }
                    : "hidden"
              }
              key="intro-content"
              style={shouldReduce ? { opacity: 1 } : undefined}
              variants={
                shouldReduce || homepage ? undefined : containerVariants
              }
            >
              <div
                className={cn(
                  "flex min-w-0 flex-col gap-3 md:gap-[1cqw]",
                  !compact && "md:w-[55%]"
                )}
              >
                {!homepage && (
                  <span
                    className={cn(
                      "bento-label",
                      lightIntro ? "!text-black/70" : "!text-white/80"
                    )}
                  >
                    11 / Contact
                  </span>
                )}
                <motion.h2
                  className={cn(
                    "font-sans",
                    "font-semibold tracking-[-0.025em] leading-[1.1]",
                    lightIntro ? "text-[#111]" : "text-white"
                  )}
                  style={{
                    fontSize: compact
                      ? "clamp(28px, 3cqw, 42px)"
                      : "clamp(28px, 4cqw, 56px)",
                  }}
                  variants={shouldReduce || homepage ? undefined : itemVariants}
                >
                  <span className="block">
                    Let&apos;s build
                    <br />
                    {/* Keep the display size; de-emphasize with color and a supported weight. */}
                    <span>something</span>
                    <br />
                    <span>together.</span>
                  </span>
                </motion.h2>

                <motion.p
                  className={
                    homepage
                      ? "mt-3 max-w-[34ch] text-sm leading-relaxed text-white/75"
                      : "sr-only"
                  }
                  variants={shouldReduce || homepage ? undefined : itemVariants}
                >
                  Have a problem worth solving? I want to hear about it.
                </motion.p>
              </div>

              <motion.div
                className={cn(
                  "relative flex w-full max-w-[240px] shrink-0 flex-col items-stretch gap-2",
                  !compact && "md:mr-[3cqw] md:pt-[1cqw]",
                  homepage && "max-w-[300px] gap-3 md:mr-0"
                )}
                variants={shouldReduce || homepage ? undefined : itemVariants}
              >
                <div
                  className="contents"
                  ref={(node) => {
                    triggerWrapperRef.current = node;
                    if (homepage && node && shouldRestoreFocusRef.current) {
                      shouldRestoreFocusRef.current = false;
                      node
                        .querySelector<HTMLElement>("button")
                        ?.focus({ preventScroll: true });
                    }
                  }}
                >
                  <MagneticButton
                    aria-label="Book a call"
                    as="button"
                    className={cn(
                      `inline-flex w-full items-center justify-between gap-2 px-4 py-2 min-h-[44px] rounded-[10px]
                               bg-[#caff32] text-zinc-950 hover:bg-[#bce92a] hover:text-zinc-950
                               text-sm font-medium transition-colors duration-150`,
                      homepage && "min-h-12 px-5"
                    )}
                    fullWidth={homepage}
                    onClick={openBooking}
                    strength={shouldReduce || homepage ? 0 : 5}
                  >
                    <IconVideo size={15} />
                    Book a call
                    <IconArrowRight size={15} />
                  </MagneticButton>
                </div>

                <CopyEmailButton homepage={homepage} light={lightIntro} />
                <div className="flex flex-wrap items-center justify-between gap-x-3">
                  <a
                    className={cn(
                      "inline-flex min-h-11 items-center whitespace-nowrap text-[11px] underline underline-offset-4",
                      lightIntro ? "text-black/80" : "text-white/80"
                    )}
                    href={`mailto:${siteConfig.email.display}`}
                  >
                    {homepage ? "Send an email" : "Open mail app"}
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </>
  );
}
