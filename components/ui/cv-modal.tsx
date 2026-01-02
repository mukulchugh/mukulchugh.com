"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import { X, Download, FileText, ExternalLink } from "lucide-react";

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvUrl: string;
  name: string;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 1,
};

export function CVModal({ isOpen, onClose, cvUrl, name }: CVModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle outside click
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md"
          />

          {/* Modal container */}
          <div className="fixed inset-0 z-[1001] grid place-items-center p-4 overflow-y-auto">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={springTransition}
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-neutral-900 shadow-2xl my-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-b from-neutral-800/60 to-neutral-900/70 ring-1 ring-white/10">
                    <FileText className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <h3
                      className={cn(
                        syne.className,
                        "font-semibold text-lg sm:text-xl text-white"
                      )}
                    >
                      {name}&apos;s Resume
                    </h3>
                    <p className="text-sm text-gray-400">
                      View or download my resume
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Open in new tab */}
                  <a
                    href={cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl",
                      "bg-gradient-to-b from-neutral-800/60 to-neutral-900/70 backdrop-blur-xl",
                      "ring-1 ring-white/10",
                      "text-white/70 text-sm font-medium",
                      "hover:text-white/90 hover:ring-white/20",
                      "transition-all duration-200"
                    )}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </a>

                  {/* Download button */}
                  <a
                    href={cvUrl}
                    download
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl",
                      "bg-white/95 backdrop-blur-xl",
                      "ring-1 ring-white/20",
                      "text-neutral-900 text-sm font-medium",
                      "hover:bg-white",
                      "transition-all duration-200"
                    )}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>

                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-4 h-4 text-white/70" />
                  </button>
                </div>
              </div>

              {/* PDF Viewer */}
              <div className="relative w-full h-[60vh] sm:h-[70vh] bg-neutral-950">
                <iframe
                  src={`${cvUrl}#toolbar=0&navpanes=0`}
                  className="w-full h-full"
                  title="Resume PDF"
                />

                {/* Fallback for mobile/browsers that don't support PDF embed */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-neutral-950 sm:hidden">
                  <FileText className="w-16 h-16 text-white/30" />
                  <p className="text-white/60 text-center px-4">
                    PDF preview is best viewed on desktop
                  </p>
                  <div className="flex gap-3">
                    <a
                      href={cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl",
                        "bg-gradient-to-b from-neutral-800/60 to-neutral-900/70",
                        "ring-1 ring-white/10",
                        "text-white/90 text-sm font-medium"
                      )}
                    >
                      <ExternalLink className="w-4 h-4" />
                      View PDF
                    </a>
                    <a
                      href={cvUrl}
                      download
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl",
                        "bg-white/95",
                        "text-neutral-900 text-sm font-medium"
                      )}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
