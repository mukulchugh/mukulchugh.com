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
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { premiumSpring, softSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";

const premiumEase = [0.16, 1, 0.3, 1] as const;
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
    transition: { damping: 20, stiffness: 100, type: "spring" as const },
    y: 0,
  },
};

const introExit = {
  opacity: 0,
  scale: 0.985,
  transition: { duration: 0.42, ease: premiumEase },
  y: -28,
};

const bookingEnter = {
  opacity: 1,
  scale: 1,
  transition: { ...softSpring, delay: 0.08 },
  y: 0,
};

const bookingInitial = {
  opacity: 0,
  scale: 0.98,
  y: 36,
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
        transition={{ damping: 24, stiffness: 320, type: "spring" }}
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
        transition={{ damping: 22, stiffness: 280, type: "spring" }}
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

export function CTATile() {
  const { ref } = useSectionInView("Contact");
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduce = useReducedMotion();
  const [mode, setMode] = useState<"intro" | "booking">("intro");

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
    setMode("booking");
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({
        behavior: shouldReduce ? "auto" : "smooth",
        block: "start",
      });
    });
  }, [shouldReduce]);

  const closeBooking = useCallback(() => {
    setMode("intro");
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (mode === "booking") {
        return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      rawX.set(((e.clientX - rect.left) / rect.width) * 100);
      rawY.set(((e.clientY - rect.top) / rect.height) * 100);
    },
    [mode, rawX, rawY]
  );

  const handleMouseEnter = useCallback(() => {
    if (mode === "booking") {
      return;
    }
    opacity.set(1);
  }, [mode, opacity]);

  const handleMouseLeave = useCallback(() => {
    opacity.set(0);
  }, [opacity]);

  return (
    <motion.section
      animate={{ minHeight: mode === "booking" ? 720 : 240 }}
      className={cn(
        "scroll-mt-28 relative overflow-hidden rounded-[1.75rem]",
        mode === "booking" ? "" : "h-full"
      )}
      id="contact"
      onMouseEnter={shouldReduce ? undefined : handleMouseEnter}
      onMouseLeave={shouldReduce ? undefined : handleMouseLeave}
      onMouseMove={shouldReduce ? undefined : handleMouseMove}
      ref={setRefs}
      style={{
        background: "linear-gradient(180deg, #0e0e11 0%, #18181c 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.30)",
      }}
      transition={shouldReduce ? { duration: 0 } : premiumSpring}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none grain-overlay opacity-[0.055]"
        style={{ mixBlendMode: "soft-light" }}
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

      {mode === "intro" &&
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

      <div className="relative z-10 h-full">
        <AnimatePresence initial={false} mode="wait">
          {mode === "intro" ? (
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="h-full flex flex-col lg:flex-row lg:items-center justify-between
                         gap-6 sm:gap-8 p-6 sm:p-8 lg:p-10"
              exit={shouldReduce ? { opacity: 0 } : introExit}
              initial={false}
              key="intro"
              transition={shouldReduce ? { duration: 0.2 } : undefined}
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
                  style={{ fontSize: "clamp(1.6rem, 4.2vw, 2.6rem)" }}
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
          ) : (
            <motion.div
              animate={shouldReduce ? { opacity: 1 } : bookingEnter}
              className="flex h-full flex-col gap-5 p-5 sm:p-6 lg:p-8"
              exit={
                shouldReduce
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      scale: 0.985,
                      transition: { duration: 0.32, ease: premiumEase },
                      y: 20,
                    }
              }
              initial={shouldReduce ? { opacity: 0 } : bookingInitial}
              key="booking"
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
                  type="button"
                  variant="ghost"
                >
                  <IconArrowLeft size={14} />
                  Back
                </Button>
              </div>

              <motion.div
                animate={shouldReduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/[0.08]
                           bg-[#0a0a0c]/80"
                initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                transition={
                  shouldReduce
                    ? { duration: 0.2 }
                    : { ...softSpring, delay: 0.18 }
                }
              >
                <CalEmbed />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
