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

const Component = React.memo(() => {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);

  const handleClick = useCallback(() => {
    setActiveSection("Contact");
    setTimeOfLastClick(Date.now());
  }, [setActiveSection, setTimeOfLastClick]);

  const handleOpenCV = useCallback(() => {
    setIsCVModalOpen(true);
  }, []);

  const handleCloseCV = useCallback(() => {
    setIsCVModalOpen(false);
  }, []);
  return (
    <section
      ref={ref}
      id="home"
      className="min-h-[calc(100vh-10rem)] sm:min-h-[calc(100vh-12rem)] max-w-4xl mx-auto text-center flex flex-col justify-center scroll-mt-[100rem] px-4 -mt-8"
    >
      <div className="flex items-center justify-center">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "tween",
              duration: 0.2,
            }}
          >
            <Image
              src={siteConfig.images.profileImage}
              alt={siteConfig.name}
              width={160}
              height={160}
              quality={90}
              priority={true}
              fetchPriority="high"
              sizes="(max-width: 768px) 160px, 160px"
              className="h-40 w-40 rounded-full object-cover border-[0.35rem] border-white shadow-xl"
            />
          </motion.div>

          <motion.span
            className="absolute bottom-0 right-0 text-4xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 125,
              delay: 0.1,
              duration: 0.7,
            }}
          >
            {introContent.emoji}
          </motion.span>
        </div>
      </div>

      <motion.div
        className="mt-6 mb-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span
          className={clsx(
            "inline-block px-4 py-2 text-sm font-medium tracking-wide lowercase rounded-full text-white/90",
            "bg-white/5 backdrop-blur-md border border-white/10",
            "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.1)]",
            syne.className
          )}
        >
          {siteConfig.tagline}
        </span>
      </motion.div>

      <motion.h1
        className={clsx(
          "mb-10 mt-4 px-4 font-medium !leading-[1.5] text-xl md:text-3xl",
          syne.className
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="font-bold">{introContent.greeting}</span>, a{" "}
        <span className="font-bold">{introContent.role}</span> specializing in{" "}
        <span className="font-bold">{introContent.specialty}</span>. I&apos;m
        passionate about{" "}
        <span className="italic">
          {introContent.passion}
        </span>
      </motion.h1>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 text-lg font-medium"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
        }}
      >
        <Button
          asChild
          className={clsx(
            syne.className,
            "rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500"
          )}
        >
          <Link href="#contact" onClick={handleClick}>
            {introContent.ctaText}
            <IconMessage className="w-4 h-4 opacity-80" />
          </Link>
        </Button>

        <Button
          variant="secondary"
          onClick={handleOpenCV}
          className={clsx(syne.className, "rounded-2xl")}
        >
          {introContent.resumeButtonText}
          <IconFileText className="w-4 h-4 opacity-70" />
        </Button>

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
                        "group relative grid place-items-center w-12 h-12 rounded-xl cursor-pointer",
                        "bg-gradient-to-b from-neutral-800/60 to-neutral-900/70 backdrop-blur-xl",
                        "ring-1 ring-white/10 shadow-lg",
                        "text-white/70 text-lg",
                        "hover:-translate-y-1 hover:scale-110 hover:text-white/90 hover:ring-white/20",
                        "active:scale-100 transition-all duration-200"
                      )}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${link.name} Profile`}
                    >
                      <IconComponent size={20} />
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

const Intro = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
};

export default Intro;
