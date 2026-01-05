"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import { IconX, IconDownload, IconFileText, IconExternalLink } from "@tabler/icons-react";
import { forwardRef } from "react";
import { Button } from "@/components/ui/button";

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvUrl: string;
  name: string;
}

// CV action buttons configuration
const cvActions = [
  {
    type: "open" as const,
    label: "Open",
    mobileLabel: "View PDF",
    Icon: IconExternalLink,
    isDownload: false,
    desktopOnly: true,
  },
  {
    type: "download" as const,
    label: "Download",
    mobileLabel: "Download",
    Icon: IconDownload,
    isDownload: true,
    desktopOnly: false,
  },
] as const;

const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 1,
};

// Animated overlay component for Radix
const AnimatedOverlay = forwardRef<HTMLDivElement>((props, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md"
    {...props}
  />
));
AnimatedOverlay.displayName = "AnimatedOverlay";

// Animated content component for Radix
const AnimatedContent = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  ({ children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={springTransition}
      className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-neutral-900 shadow-2xl my-8"
      {...props}
    >
      {children}
    </motion.div>
  )
);
AnimatedContent.displayName = "AnimatedContent";

export function CVModal({ isOpen, onClose, cvUrl, name }: CVModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <AnimatedOverlay />
            </Dialog.Overlay>

            {/* Modal container */}
            <Dialog.Content
              asChild
              aria-describedby={undefined}
              className="fixed inset-0 z-[1001] grid place-items-center p-4 overflow-y-auto"
            >
              <div className="fixed inset-0 z-[1001] grid place-items-center p-4 overflow-y-auto">
                <AnimatedContent>
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-b from-neutral-800/60 to-neutral-900/70 ring-1 ring-white/10">
                        <IconFileText className="w-5 h-5 text-white/70" />
                      </div>
                      <div>
                        <Dialog.Title
                          className={cn(
                            syne.className,
                            "font-semibold text-lg sm:text-xl text-white"
                          )}
                        >
                          {name}&apos;s Resume
                        </Dialog.Title>
                        <VisuallyHidden.Root>
                          <Dialog.Description>
                            View or download {name}&apos;s resume in PDF format
                          </Dialog.Description>
                        </VisuallyHidden.Root>
                        <p className="text-sm text-gray-400">
                          View or download my resume
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {cvActions.map((action) => (
                        <a
                          key={action.type}
                          href={cvUrl}
                          target={action.isDownload ? undefined : "_blank"}
                          rel={action.isDownload ? undefined : "noopener noreferrer"}
                          download={action.isDownload || undefined}
                          className={cn(
                            "items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                            action.desktopOnly ? "hidden sm:flex" : "flex",
                            action.isDownload
                              ? "bg-white/95 backdrop-blur-xl ring-1 ring-white/20 text-neutral-900 hover:bg-white"
                              : "bg-gradient-to-b from-neutral-800/60 to-neutral-900/70 backdrop-blur-xl ring-1 ring-white/10 text-white/70 hover:text-white/90 hover:ring-white/20"
                          )}
                        >
                          <action.Icon className="w-4 h-4" />
                          {action.label}
                        </a>
                      ))}

                      {/* Close button */}
                      <Dialog.Close asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-xl bg-white/10 hover:bg-white/20"
                          aria-label="Close modal"
                        >
                          <IconX className="w-4 h-4 text-white/70" />
                        </Button>
                      </Dialog.Close>
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
                      <IconFileText className="w-16 h-16 text-white/30" />
                      <p className="text-white/60 text-center px-4">
                        PDF preview is best viewed on desktop
                      </p>
                      <div className="flex gap-3">
                        {cvActions.map((action) => (
                          <a
                            key={action.type}
                            href={cvUrl}
                            target={action.isDownload ? undefined : "_blank"}
                            rel={action.isDownload ? undefined : "noopener noreferrer"}
                            download={action.isDownload || undefined}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium",
                              action.isDownload
                                ? "bg-white/95 text-neutral-900"
                                : "bg-gradient-to-b from-neutral-800/60 to-neutral-900/70 ring-1 ring-white/10 text-white/90"
                            )}
                          >
                            <action.Icon className="w-4 h-4" />
                            {action.mobileLabel}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </AnimatedContent>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
