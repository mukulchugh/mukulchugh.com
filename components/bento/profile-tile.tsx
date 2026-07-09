"use client";

import Image from "next/image";
import React from "react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconMail,
  IconMapPin,
} from "@tabler/icons-react";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";
import { siteConfig, introSocialLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";

const iconMap: Record<string, React.ElementType> = {
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandX,
};

export function ProfileTile() {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();

  const handleContactClick = React.useCallback(() => {
    setActiveSection("Contact");
    setTimeOfLastClick(Date.now());
  }, [setActiveSection, setTimeOfLastClick]);

  return (
    <section
      ref={ref}
      id="home"
      className="h-full min-h-[360px] p-6 sm:p-8 flex flex-col gap-5 sm:gap-6 scroll-mt-28"
    >
      {/* Top row: Avatar + Available pill */}
      <div className="flex items-start justify-between gap-4">
        {/* Avatar with gradient fallback bg */}
        <div
          className="relative w-[72px] h-[72px] rounded-2xl overflow-hidden flex-shrink-0
                     bg-gradient-to-br from-zinc-100 to-zinc-200
                     ring-1 ring-black/[0.08] shadow-lg shadow-black/[0.06]"
        >
          <Image
            src={siteConfig.images.profileImage}
            alt={siteConfig.name}
            width={72}
            height={72}
            priority
            className="w-full h-full object-cover"
          />
        </div>

        {/* Available pill */}
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                     bg-emerald-50 border border-emerald-200
                     text-[11px] font-semibold text-emerald-600 uppercase tracking-[0.1em]
                     whitespace-nowrap"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
          </span>
          Available for work
        </span>
      </div>

      {/* Name + role */}
      <div className="space-y-1.5">
        <h1
          className={cn(
            syne.className,
            "text-2xl sm:text-[1.75rem] md:text-3xl font-bold tracking-tight text-foreground leading-tight"
          )}
        >
          {siteConfig.name}
        </h1>
        <p className="text-[13.5px] text-muted-foreground leading-snug">
          Founding Engineer @{" "}
          <span className="text-foreground/80 font-medium">Quivly</span>
          {" · "}
          <span className="text-foreground/70">Engineer turned generalist</span>
        </p>
      </div>

      {/* Chips: location + role tags */}
      <div className="flex flex-wrap gap-2">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                     bg-black/[0.04] border border-black/[0.07]
                     text-[12px] text-muted-foreground"
        >
          <IconMapPin size={11} className="text-zinc-400 flex-shrink-0" />
          {siteConfig.location}
        </span>
        {(["Product Engineer", "Full-Stack", "Mobile"] as const).map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.07]
                       text-[12px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Social buttons — outlined pill row */}
      <div className="flex flex-wrap items-center gap-2 mt-auto pt-1">
        {introSocialLinks.map((link) => {
          const Icon = iconMap[link.icon];
          return (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.name} profile`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                         bg-black/[0.04] border border-black/[0.07]
                         text-[12px] font-medium text-muted-foreground
                         hover:text-foreground hover:bg-black/[0.07] hover:border-black/[0.12]
                         transition-all duration-200"
            >
              {Icon ? <Icon size={13} /> : null}
              {link.name}
            </a>
          );
        })}
        <a
          href={`mailto:${siteConfig.email.display}`}
          onClick={handleContactClick}
          aria-label="Send email"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                     bg-black/[0.04] border border-black/[0.07]
                     text-[12px] font-medium text-muted-foreground
                     hover:text-foreground hover:bg-black/[0.07] hover:border-black/[0.12]
                     transition-all duration-200"
        >
          <IconMail size={13} />
          Email
        </a>
      </div>
    </section>
  );
}
