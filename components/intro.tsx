"use client";

import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconMessage,
} from "@tabler/icons-react";
import clsx from "clsx";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useCallback } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActiveSectionContext } from "@/context/active-section-context";
import { introContent, introSocialLinks, siteConfig } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";

const stagger = {
  animate: { opacity: 1, y: 0 },
  initial: { opacity: 0, y: 16 },
};

const Component = React.memo(() => {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();

  const handleClick = useCallback(() => {
    setActiveSection("Contact");
    setTimeOfLastClick(Date.now());
  }, [setActiveSection, setTimeOfLastClick]);

  return (
    <section
      className="max-w-2xl mx-auto text-center flex flex-col justify-center scroll-mt-28 px-6 py-12"
      id="home"
      ref={ref}
    >
      {/* Avatar */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{
              damping: 20,
              duration: 0.4,
              stiffness: 200,
              type: "spring",
            }}
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-none bg-gradient-to-b from-foreground/15 to-foreground/5 blur-md" />
              <Image
                alt={siteConfig.name}
                className="relative h-36 w-36 rounded-none object-cover border-2 border-border shadow-2xl"
                fetchPriority="high"
                height={144}
                priority={true}
                quality={90}
                sizes="144px"
                src={siteConfig.images.profileImage}
                width={144}
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
        transition={{ delay: 0.05, duration: 0.4 }}
      >
        <span
          className={clsx(
            "ui-label inline-flex items-center gap-1.5 rounded-none px-3.5 py-1.5",
            "text-muted-foreground bg-muted border border-border",
            "font-sans"
          )}
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-none bg-muted-foreground opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-none bg-muted0" />
          </span>
          {siteConfig.tagline}
        </span>
      </motion.div>

      {/* Hero heading */}
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className={clsx(
          "mb-8 px-2 font-bold tracking-tight",
          "text-[1.6rem] leading-[1.25] sm:text-[2.25rem] md:text-[2.75rem]",
          "font-sans"
        )}
        initial={{ opacity: 0, y: 12 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <span className="text-foreground">{introContent.greeting}</span>
        <span className="text-muted-foreground font-medium">, a </span>
        <span className="text-foreground">{introContent.role}</span>
        <span className="text-muted-foreground font-medium">
          {" "}
          specializing in{" "}
        </span>
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
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4"
        initial={{ opacity: 0, y: 16 }}
        transition={{ delay: 0.18, duration: 0.4 }}
      >
        <Link
          className={clsx(
            buttonVariants(),
            "font-sans",
            "rounded-none bg-foreground hover:bg-foreground/90 text-white font-semibold shadow-[0_4px_20px_-4px_rgba(24,24,27,0.15)] transition-[background-color,transform] duration-200"
          )}
          href="#contact"
          onClick={handleClick}
        >
          {introContent.ctaText}
          <IconMessage className="opacity-80" data-icon="inline-end" />
        </Link>

        {/* Social links */}
        <TooltipProvider delay={200}>
          <div className="flex gap-2">
            {introSocialLinks.map((link) => {
              const iconMap: Record<string, typeof IconBrandLinkedin> = {
                IconBrandGithub,
                IconBrandLinkedin,
                IconBrandX,
              };
              const IconComponent = iconMap[link.icon];

              return (
                <Tooltip key={link.name}>
                  <TooltipTrigger
                    render={
                      <a
                        aria-label={`${link.name} Profile`}
                        className={clsx(
                          "group grid place-items-center w-11 h-11 rounded-none cursor-pointer",
                          "bg-foreground/[0.05] border border-border",
                          "text-muted-foreground",
                          "hover:-translate-y-0.5 hover:text-foreground hover:bg-foreground/[0.08] hover:border-border",
                          "transition-[color,background-color,border-color,transform] duration-200"
                        )}
                        href={link.href}
                        rel="noopener noreferrer"
                        target="_blank"
                      />
                    }
                  >
                    <IconComponent size={18} />
                  </TooltipTrigger>
                  <TooltipContent side="top">{link.name}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </motion.div>
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
