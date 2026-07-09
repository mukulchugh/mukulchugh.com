"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { IconArrowUpRight } from "@tabler/icons-react";
import type React from "react";
import clsx from "clsx";
import { siteConfig } from "@/lib/data";
import { syne } from "@/lib/fonts";
import { useSectionInView } from "@/lib/hooks";

// Dynamically import Cal.com to defer loading polyfills until user clicks
const Cal = dynamic(
  () => import("@calcom/embed-react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[700px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900" />
      </div>
    ),
  }
);

export function LetsWorkTogether() {
  const { ref } = useSectionInView("Contact");
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize Cal.com API when calendar is shown
  useEffect(() => {
    if (showSuccess) {
      (async function () {
        const { getCalApi } = await import("@calcom/embed-react");
        const cal = await getCalApi({ namespace: "15min" });
        cal("ui", {
          theme: "dark",
          styles: {
            branding: { brandColor: "#6366f1" },
          },
        });
      })();
    }
  }, [showSuccess]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsClicked(true);

    setTimeout(() => {
      setShowSuccess(true);
    }, 500);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="flex min-h-[60vh] items-center justify-center px-4 sm:px-6 py-12 scroll-mt-28 w-full"
    >
      <div className="relative flex flex-col items-center gap-12 w-full max-w-[1400px]">
        {/* Success state - Perfect, Let's talk with Cal.com embed */}
        {showSuccess && (
          <div
            className="w-full flex flex-col items-center justify-start gap-8 transition-all duration-700"
            style={{
              transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
              opacity: showSuccess ? 1 : 0,
              transform: showSuccess
                ? "translateY(0) scale(1)"
                : "translateY(20px) scale(0.95)",
            }}
          >
            {/* Heading */}
            <div className="flex flex-col items-center gap-2">
              <span
                className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground transition-all duration-500"
                style={{
                  transform: showSuccess ? "translateY(0)" : "translateY(10px)",
                  opacity: showSuccess ? 1 : 0,
                  transitionDelay: "100ms",
                }}
              >
                Perfect
              </span>
              <h3
                className={clsx(
                  syne.className,
                  "text-3xl font-light tracking-tight text-foreground transition-all duration-500 sm:text-4xl"
                )}
                style={{
                  transform: showSuccess ? "translateY(0)" : "translateY(10px)",
                  opacity: showSuccess ? 1 : 0,
                  transitionDelay: "200ms",
                }}
              >
                Let&apos;s talk
              </h3>
            </div>

            {/* Cal.com Embed */}

            <Cal
              namespace="15min"
              calLink="mukulchugh/15min"
              style={{
                width: "100%",
                height: "100%",
                minHeight: "700px",
              }}
              config={{
                theme: "dark",
              }}
            />
          </div>
        )}

        {/* Initial state - Let's work together */}
        {!showSuccess && (
          <>
            <div
              className="flex items-center gap-3 transition-all duration-500"
              style={{
                opacity: isClicked ? 0 : 1,
                transform: isClicked ? "translateY(-20px)" : "translateY(0)",
                pointerEvents: isClicked ? "none" : "auto",
              }}
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
                Available for projects
              </span>
            </div>

            {/* Main interactive element */}
            <div
              className="group relative cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleClick}
              style={{
                pointerEvents: isClicked ? "none" : "auto",
              }}
            >
              <div className="flex flex-col items-center gap-6">
                <h2
                  className={clsx(
                    syne.className,
                    "relative text-center text-5xl font-light tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl transition-all duration-700 ease-out"
                  )}
                  style={{
                    opacity: isClicked ? 0 : 1,
                    transform: isClicked
                      ? "translateY(-40px) scale(0.95)"
                      : "translateY(0) scale(1)",
                  }}
                >
                  <span className="block overflow-hidden">
                    <span
                      className="block transition-transform duration-700 ease-out"
                      style={{
                        transform:
                          isHovered && !isClicked
                            ? "translateY(-8%)"
                            : "translateY(0)",
                      }}
                    >
                      Let&apos;s work
                    </span>
                  </span>
                  <span className="block overflow-hidden">
                    <span
                      className="block transition-transform duration-700 ease-out delay-75"
                      style={{
                        transform:
                          isHovered && !isClicked
                            ? "translateY(-8%)"
                            : "translateY(0)",
                      }}
                    >
                      <span className="text-foreground/35">together</span>
                    </span>
                  </span>
                </h2>

                {/* Circle button with arrow */}
                <div className="relative mt-4 flex size-16 items-center justify-center sm:size-20">
                  <div
                    className={`pointer-events-none absolute inset-0 rounded-full border transition-all ease-out ${
                      isHovered && !isClicked
                        ? "border-foreground bg-foreground"
                        : "border-foreground/30 bg-transparent"
                    }`}
                    style={{
                      transform: isClicked
                        ? "scale(3)"
                        : isHovered
                        ? "scale(1.1)"
                        : "scale(1)",
                      opacity: isClicked ? 0 : 1,
                      transitionDuration: isClicked ? "700ms" : "500ms",
                    }}
                  />
                  <IconArrowUpRight
                    className={`size-6 transition-all ease-out sm:size-7 ${
                      isHovered && !isClicked ? "text-background" : "text-foreground"
                    }`}
                    style={{
                      transform: isClicked
                        ? "translate(100px, -100px) scale(0.5)"
                        : isHovered
                        ? "translate(2px, -2px)"
                        : "translate(0, 0)",
                      opacity: isClicked ? 0 : 1,
                      transitionDuration: isClicked ? "600ms" : "500ms",
                    }}
                  />
                </div>
              </div>

              {/* Side lines */}
              {(["left", "right"] as const).map((side) => (
                <div
                  key={side}
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    side === "left" ? "-left-8 sm:-left-16" : "-right-8 sm:-right-16"
                  }`}
                >
                  <div
                    className="h-px w-8 bg-foreground/30 transition-all duration-500 sm:w-12"
                    style={{
                      transform: isClicked
                        ? `scaleX(0) translateX(${side === "left" ? "-20px" : "20px"})`
                        : isHovered
                        ? "scaleX(1.5)"
                        : "scaleX(1)",
                      opacity: isClicked ? 0 : isHovered ? 1 : 0.5,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Description text */}
            <div
              className="mt-8 flex flex-col items-center gap-4 text-center transition-all duration-500 delay-100"
              style={{
                opacity: isClicked ? 0 : 1,
                transform: isClicked ? "translateY(20px)" : "translateY(0)",
                pointerEvents: isClicked ? "none" : "auto",
              }}
            >
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Have a project in mind? I&apos;d love to hear about it.
                Let&apos;s create something exceptional together.
              </p>
              <span className="text-xs tracking-widest uppercase text-muted-foreground/70">
                {siteConfig.email.display}
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
