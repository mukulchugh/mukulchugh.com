"use client";

/**
 * CalBookingModal — premium spring-animated modal wrapping the Cal.com embed.
 *
 * Features:
 *  - Framer Motion AnimatePresence with spring morph (scale + y + opacity)
 *  - Reduced-motion: simple opacity-only fade
 *  - Lazy-loads Cal embed only when modal opens (dynamic import)
 *  - Backdrop click + Esc to close
 *  - Body scroll lock while open
 *  - Cal config: theme:"light", layout:"month_view", namespace:"15min"
 *  - Monochrome ink palette — strictly warm neutrals and zinc grays
 */

import React, { useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { IconX } from "@tabler/icons-react";
import { syne } from "@/lib/fonts";
import { cn } from "@/lib/utils";

/* ── Lazy Cal.com embed (only loaded when modal opens) ─────────────────── */
const Cal = dynamic(
  () => import("@calcom/embed-react").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center" style={{ minHeight: 520 }}>
        <div
          className="rounded-full border-2 border-zinc-200 border-t-zinc-800"
          style={{
            width: 32,
            height: 32,
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    ),
  }
);

/* ── Animation variants ────────────────────────────────────────────────── */
const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit:    { opacity: 0, transition: { duration: 0.18 } },
};

const dialogVariants = {
  hidden:  { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 26 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: { duration: 0.16, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  },
};

/* Reduced-motion: fade only, no scale/y */
const dialogVariantsReduced = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

/* ── CalInitializer — fires Cal API config once when mounted ───────────── */
function CalInitializer() {
  useEffect(() => {
    (async () => {
      const { getCalApi } = await import("@calcom/embed-react");
      const cal = await getCalApi({ namespace: "15min" });
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);
  return null;
}

/* ── Main modal ────────────────────────────────────────────────────────── */
interface CalBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalBookingModal({ isOpen, onClose }: CalBookingModalProps) {
  const shouldReduce = useReducedMotion();
  const closeRef    = useRef<HTMLButtonElement>(null);

  /* ── Body scroll lock ── */
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  /* ── Esc to close ── */
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [isOpen, handleKey]);

  /* ── Focus the close button when modal opens ── */
  useEffect(() => {
    if (isOpen) {
      // Small delay so AnimatePresence has rendered the element
      const t = setTimeout(() => closeRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const dVars = shouldReduce ? dialogVariantsReduced : dialogVariants;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="cal-backdrop"
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Dialog ── */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-label="Book a call"
          >
            <motion.div
              key="cal-dialog"
              className={cn(
                "pointer-events-auto relative flex flex-col",
                "w-full max-w-[720px]",
                "bg-white rounded-3xl",
                "shadow-[0_32px_80px_-12px_rgba(0,0,0,0.22),0_8px_24px_-4px_rgba(0,0,0,0.10)]",
                /* Mobile: full height sheet */
                "max-h-[calc(100dvh-2rem)] sm:max-h-[90vh]",
                "overflow-hidden"
              )}
              variants={dVars}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* ── Header ── */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 flex-shrink-0">
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400",
                  )}
                >
                  Book a Call
                </span>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  aria-label="Close booking modal"
                  className={cn(
                    "flex items-center justify-center",
                    "w-8 h-8 rounded-full",
                    "text-zinc-400 hover:text-zinc-800",
                    "bg-zinc-50 hover:bg-zinc-100",
                    "transition-colors duration-150",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-800"
                  )}
                >
                  <IconX size={16} />
                </button>
              </div>

              {/* ── Cal embed ── */}
              <div className="overflow-y-auto flex-1 min-h-0">
                <CalInitializer />
                <Cal
                  namespace="15min"
                  calLink="mukulchugh/15min"
                  config={{ theme: "light" }}
                  style={{ width: "100%", height: "100%", minHeight: 520 }}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
