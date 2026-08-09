"use client";

import {
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconCheck,
  IconMail,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/data";
import { microSpring } from "@/lib/motion";

/**
 * SocialsTile — a section of its own. The one place the monochrome ink system
 * lets brand color in: each platform shows its real brand hue, so the row reads
 * as a deliberate splash of color against the neutral grid.
 *
 * Touch UX: brand-tint wash is always partially visible (opacity-[0.06]) so
 * it's not hover-only on touch devices. Hover amplifies it further.
 * Cards have min-height 44px (touch target) and active:scale feedback.
 */
const socials = [
  {
    color: "#0A66C2",
    handle: "in/mukulchugh",
    href: siteConfig.social.linkedin,
    Icon: IconBrandLinkedin,
    isEmail: false,
    name: "LinkedIn",
  },
  {
    color: "#1f2328",
    handle: "@mukulchugh",
    href: siteConfig.social.github,
    Icon: IconBrandGithub,
    isEmail: false,
    name: "GitHub",
  },
  {
    color: "#101010",
    handle: "@themukulchugh",
    href: siteConfig.social.twitter,
    Icon: IconBrandX,
    isEmail: false,
    name: "X",
  },
  {
    color: "#e0672f",
    handle: siteConfig.email.display,
    href: `mailto:${siteConfig.email.display}`,
    Icon: IconMail,
    isEmail: true,
    name: "Email",
  },
] as const;

// ── Email card — copy-to-clipboard + mailto fallback ───────────────────────
function EmailSocialCard({
  name,
  handle,
  href,
  Icon,
  color,
}: {
  name: string;
  handle: string;
  href: string;
  Icon: typeof IconMail;
  color: string;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault(); // prevent mailto: navigation — button copies first
      try {
        await navigator.clipboard.writeText(handle);
        setCopied(true);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => setCopied(false), 1500);
      } catch {
        // clipboard unavailable — fall through to mailto
        window.location.href = href;
      }
    },
    [handle, href]
  );

  return (
    <div className="h-full">
      {/*
       * Outer wrapper: button for copy action.
       * Provide a fallback <a> as a sibling so keyboard/AT users can also
       * open their mail client. The visually-hidden link is focusable.
       */}
      <div className="relative h-full">
        <Button
          aria-label={copied ? "Email copied" : `Copy email — ${handle}`}
          className="social-card group relative flex min-h-[80px] sm:min-h-[88px] h-full w-full flex-col items-start justify-between
                     gap-2 sm:gap-3 overflow-hidden rounded-2xl bg-card
                     p-3 sm:p-3.5 text-left
                     transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]
                     active:scale-[0.975] active:duration-100 cursor-pointer"
          onClick={handleClick}
          type="button"
          variant="ghost"
        >
          {/* aria-live for screen readers */}
          <span aria-atomic="true" aria-live="polite" className="sr-only">
            {copied ? "Email address copied to clipboard" : ""}
          </span>

          {/* brand-tint wash — always partially visible */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-200"
            style={{ background: `${color}08` }}
          />
          {/* amplified tint on hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200
                       [@media(hover:hover)]:group-hover:opacity-100"
            style={{ background: `${color}0f` }}
          />

          <span className="relative flex w-full items-start justify-between">
            {/* Icon — swaps to check on copy */}
            <span
              className="grid h-9 w-9 place-items-center rounded-xl flex-shrink-0"
              style={{ background: `${color}14`, color }}
            >
              <motion.span
                animate={{ opacity: 1, scale: 1 }}
                aria-hidden="true"
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.65 }}
                key={copied ? "check" : "mail"}
                transition={microSpring}
              >
                {copied ? (
                  <IconCheck className="h-[18px] w-[18px]" />
                ) : (
                  <Icon className="h-[18px] w-[18px]" />
                )}
              </motion.span>
            </span>

            {/* Arrow — becomes a "copied" check indicator */}
            <motion.span
              animate={{ opacity: 1 }}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              key={copied ? "copied-indicator" : "arrow"}
              transition={{ duration: 0.15 }}
            >
              {copied ? (
                <span className="text-[10px] font-mono font-medium text-muted-foreground mt-0.5 block">
                  Copied
                </span>
              ) : (
                <IconArrowUpRight
                  className="h-4 w-4 text-muted-foreground/50 transition-all duration-200
                             [@media(hover:hover)]:group-hover:-translate-y-0.5
                             [@media(hover:hover)]:group-hover:translate-x-0.5
                             [@media(hover:hover)]:group-hover:text-muted-foreground"
                />
              )}
            </motion.span>
          </span>

          {/* Label — name only; handle shows in aria-label */}
          <span className="relative block truncate text-[14px] font-semibold text-foreground">
            {name}
          </span>
        </Button>

        {/* Visually-hidden mailto fallback — keyboard accessible, won't duplicate visual UI */}
        <a
          aria-label={`Open mail app to email ${handle}`}
          className="sr-only focus:not-sr-only focus:absolute focus:bottom-1 focus:right-1
                     focus:z-10 focus:rounded-lg focus:bg-card focus:px-2 focus:py-1
                     focus:text-[11px] focus:font-mono focus:text-muted-foreground focus:outline focus:outline-1
                     focus:outline-border"
          href={href}
        >
          Open mail app
        </a>
      </div>
    </div>
  );
}

export function SocialsTile() {
  return (
    <div className="flex h-full flex-col p-5 sm:p-6">
      {/* Mono section label — unified 10px label scale */}
      <div className="mb-4 flex items-center gap-2">
        <span className="ui-label text-muted-foreground">Connect</span>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-2.5 [grid-auto-rows:1fr]">
        {socials.map(({ name, handle, href, Icon, color, isEmail }) =>
          isEmail ? (
            <EmailSocialCard
              color={color}
              handle={handle}
              href={href}
              Icon={Icon}
              key={name}
              name={name}
            />
          ) : (
            <div className="h-full" key={name}>
              <a
                aria-label={`${name} — ${handle}`}
                className="social-card group relative flex min-h-[80px] sm:min-h-[88px] h-full flex-col items-start justify-between
                           gap-2 sm:gap-3 overflow-hidden rounded-2xl bg-card
                           p-3 sm:p-3.5
                           transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]
                           active:scale-[0.975] active:duration-100"
                href={href}
                rel="noopener noreferrer"
                target={href.startsWith("http") ? "_blank" : undefined}
                title={handle}
              >
                {/* brand-tint wash — always partially visible (not hover-only) */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 transition-opacity duration-200"
                  style={{ background: `${color}08` }}
                />
                {/* amplified tint on hover (pointer devices only) */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200
                             [@media(hover:hover)]:group-hover:opacity-100"
                  style={{ background: `${color}0f` }}
                />
                <span className="relative flex w-full items-start justify-between">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-xl"
                    style={{ background: `${color}14`, color }}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <IconArrowUpRight
                    className="h-4 w-4 text-muted-foreground/50 transition-all duration-200
                               [@media(hover:hover)]:group-hover:-translate-y-0.5
                               [@media(hover:hover)]:group-hover:translate-x-0.5
                               [@media(hover:hover)]:group-hover:text-muted-foreground"
                  />
                </span>
                {/* Platform name — tile/card title scale (14px semibold) */}
                <span className="relative block truncate text-[14px] font-semibold text-foreground">
                  {name}
                </span>
              </a>
            </div>
          )
        )}
      </div>
    </div>
  );
}
