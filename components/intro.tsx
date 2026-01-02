"use client";

import Image from "next/image";
import React, { Suspense, useCallback, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { BsArrowRight, BsGithub, BsTwitterX } from "react-icons/bs";
import { FaLinkedinIn } from "react-icons/fa";
import { FileText } from "lucide-react";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";
import { siteConfig, introContent } from "@/lib/data";
import { CVModal } from "./ui/cv-modal";

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
        <Link
          href="#contact"
          className={clsx(
            syne.className,
            "group px-7 py-3 flex items-center gap-2 rounded-2xl outline-none",
            "bg-white/95 backdrop-blur-xl",
            "ring-1 ring-white/20 shadow-lg",
            "text-neutral-900 font-medium",
            "hover:-translate-y-1 hover:scale-105 hover:bg-white",
            "active:scale-100 transition-all duration-200"
          )}
          onClick={handleClick}
        >
          {introContent.ctaText}{" "}
          <BsArrowRight className="opacity-70 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>

        <button
          onClick={handleOpenCV}
          className={clsx(
            syne.className,
            "group px-7 py-3 flex items-center gap-2 rounded-2xl outline-none cursor-pointer",
            "bg-gradient-to-b from-neutral-800/60 to-neutral-900/70 backdrop-blur-xl",
            "ring-1 ring-white/10 shadow-lg",
            "text-white/90 font-medium",
            "hover:-translate-y-1 hover:scale-105 hover:ring-white/20",
            "active:scale-100 transition-all duration-200"
          )}
        >
          {introContent.resumeButtonText}{" "}
          <FileText className="w-4 h-4 opacity-70 group-hover:scale-110 transition-transform duration-200" />
        </button>

        <div className="flex gap-2">
          <a
            className={clsx(
              "group relative grid place-items-center w-12 h-12 rounded-xl cursor-pointer",
              "bg-gradient-to-b from-neutral-800/60 to-neutral-900/70 backdrop-blur-xl",
              "ring-1 ring-white/10 shadow-lg",
              "text-white/70 text-lg",
              "hover:-translate-y-1 hover:scale-110 hover:text-white/90 hover:ring-white/20",
              "active:scale-100 transition-all duration-200"
            )}
            href={siteConfig.social.linkedin}
            target="_blank"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedinIn />
            <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-neutral-800/90 backdrop-blur-md ring-1 ring-white/10 text-xs text-white/90 whitespace-nowrap opacity-0 scale-90 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200">
              LinkedIn
            </span>
          </a>

          <a
            className={clsx(
              "group relative grid place-items-center w-12 h-12 rounded-xl cursor-pointer",
              "bg-gradient-to-b from-neutral-800/60 to-neutral-900/70 backdrop-blur-xl",
              "ring-1 ring-white/10 shadow-lg",
              "text-white/70 text-lg",
              "hover:-translate-y-1 hover:scale-110 hover:text-white/90 hover:ring-white/20",
              "active:scale-100 transition-all duration-200"
            )}
            href={siteConfig.social.github}
            target="_blank"
            aria-label="GitHub Profile"
          >
            <BsGithub />
            <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-neutral-800/90 backdrop-blur-md ring-1 ring-white/10 text-xs text-white/90 whitespace-nowrap opacity-0 scale-90 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200">
              GitHub
            </span>
          </a>

          <a
            className={clsx(
              "group relative grid place-items-center w-12 h-12 rounded-xl cursor-pointer",
              "bg-gradient-to-b from-neutral-800/60 to-neutral-900/70 backdrop-blur-xl",
              "ring-1 ring-white/10 shadow-lg",
              "text-white/70 text-lg",
              "hover:-translate-y-1 hover:scale-110 hover:text-white/90 hover:ring-white/20",
              "active:scale-100 transition-all duration-200"
            )}
            href={siteConfig.social.twitter}
            target="_blank"
            aria-label="Twitter Profile"
          >
            <BsTwitterX />
            <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-neutral-800/90 backdrop-blur-md ring-1 ring-white/10 text-xs text-white/90 whitespace-nowrap opacity-0 scale-90 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200">
              Twitter
            </span>
          </a>
        </div>
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
