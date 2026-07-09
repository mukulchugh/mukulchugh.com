"use client";

import Image from "next/image";
import React, { Suspense, useCallback, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  IconBrandGithub,
  IconBrandX,
  IconBrandLinkedin,
  IconFileText,
  IconMessage,
  type Icon,
} from "@tabler/icons-react";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";
import { siteConfig, introContent, introSocialLinks } from "@/lib/data";
import { CVModal } from "./ui/cv-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import clsx from "clsx";
import { syne } from "@/lib/fonts";

const stagger = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const Component = React.memo(() => {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);

  const handleClick = useCallback(() => {
    setActiveSection("Contact");
    setTimeOfLastClick(Date.now());
  }, [setActiveSection, setTimeOfLastClick]);

  const handleOpenCV = useCallback(() => setIsCVModalOpen(true), []);
  const handleCloseCV = useCallback(() => setIsCVModalOpen(false), []);

  return (
    <section
      ref={ref}
      id="home"
      className="max-w-2xl mx-auto text-center flex flex-col justify-center scroll-mt-28 px-6 py-12"
    >
      {/* Avatar */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.4 }}
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-b from-zinc-200/40 to-zinc-100/20 blur-md" />
              <Image
                src={siteConfig.images.profileImage}
                alt={siteConfig.name}
                width={144}
                height={144}
                quality={90}
                priority={true}
                fetchPriority="high"
                sizes="144px"
                className="relative h-36 w-36 rounded-full object-cover border-2 border-black/[0.08] shadow-2xl"
              />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Tagline pill */}
      <motion.div
        className="mb-5"
        {...stagger}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <span
          className={clsx(
            "inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase rounded-full",
            "text-zinc-600 bg-zinc-50 border border-zinc-200",
            syne.className
          )}
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-400 opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-zinc-500" />
          </span>
          {siteConfig.tagline}
        </span>
      </motion.div>

      {/* Hero heading */}
      <motion.h1
        className={clsx(
          "mb-8 px-2 font-bold tracking-tight",
          "text-[1.6rem] leading-[1.25] sm:text-[2.25rem] md:text-[2.75rem]",
          syne.className
        )}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <span className="text-foreground">{introContent.greeting}</span>
        <span className="text-muted-foreground font-medium">, a </span>
        <span className="text-foreground">{introContent.role}</span>
        <span className="text-muted-foreground font-medium"> specializing in </span>
        <span className="text-foreground font-semibold">
          {introContent.specialty}
        </span>
        <span className="text-muted-foreground font-medium">. Focused on </span>
        <span className="italic text-foreground/80 font-medium">
          {introContent.passion}
        </span>
      </motion.h1>

      {/* CTA row */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18 }}
      >
        <Button
          asChild
          className={clsx(
            syne.className,
            "rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold shadow-[0_4px_20px_-4px_rgba(24,24,27,0.15)] transition-all duration-200"
          )}
        >
          <Link href="#contact" onClick={handleClick}>
            {introContent.ctaText}
            <IconMessage className="w-4 h-4 ml-1 opacity-80" />
          </Link>
        </Button>

        <Button
          variant="secondary"
          onClick={handleOpenCV}
          className={clsx(
            syne.className,
            "rounded-xl border border-black/[0.10] hover:border-black/[0.18] font-semibold"
          )}
        >
          {introContent.resumeButtonText}
          <IconFileText className="w-4 h-4 ml-1 opacity-70" />
        </Button>

        {/* Social links */}
        <TooltipProvider delayDuration={200}>
          <div className="flex gap-2">
            {introSocialLinks.map((link) => {
              const iconMap: Record<string, typeof IconBrandLinkedin> = {
                IconBrandLinkedin,
                IconBrandGithub,
                IconBrandX,
              };
              const IconComponent = iconMap[link.icon];

              return (
                <Tooltip key={link.name}>
                  <TooltipTrigger asChild>
                    <a
                      className={clsx(
                        "group grid place-items-center w-11 h-11 rounded-xl cursor-pointer",
                        "bg-black/[0.04] border border-black/[0.08]",
                        "text-muted-foreground",
                        "hover:-translate-y-0.5 hover:text-foreground hover:bg-black/[0.07] hover:border-black/[0.13]",
                        "transition-all duration-200"
                      )}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${link.name} Profile`}
                    >
                      <IconComponent size={18} />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top">{link.name}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </motion.div>

      <CVModal
        isOpen={isCVModalOpen}
        onClose={handleCloseCV}
        cvUrl={siteConfig.files.cv}
        name={siteConfig.firstName}
      />
    </section>
  );
});

Component.displayName = "IntroComponent";

const Intro = () => (
  <Suspense fallback={<div className="min-h-screen" />}>
    <Component />
  </Suspense>
);

export default Intro;
