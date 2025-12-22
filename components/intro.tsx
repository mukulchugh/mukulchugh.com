"use client";

import Image from "next/image";
import React, { Suspense, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsArrowRight, BsGithub, BsTwitterX } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";
import { FaLinkedinIn } from "react-icons/fa";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";
import { siteConfig, introContent } from "@/lib/data";

import clsx from "clsx";
import { syne } from "@/lib/fonts";

const Component = React.memo(() => {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();

  const handleClick = useCallback(() => {
    setActiveSection("Contact");
    setTimeOfLastClick(Date.now());
  }, [setActiveSection, setTimeOfLastClick]);
  return (
    <section
      ref={ref}
      id="home"
      className="mb-28 max-w-[52rem] text-center sm:mb-0 scroll-mt-[100rem]"
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
              width="200"
              height="200"
              quality="80"
              priority={true}
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

      <motion.h1
        className={clsx(
          "mb-10 mt-4 px-4 font-medium !leading-[1.5] text-xl md:text-3xl",
          syne.className
        )}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="font-bold">{introContent.greeting}</span>, a{" "}
        <span className="font-bold">{introContent.role}</span> from {siteConfig.location}. I
        specialize in{" "}
        <span className="font-bold">{introContent.specialty}</span>, and I&apos;m
        passionate about{" "}
        <span className="italic">
          {introContent.passion}
        </span>
      </motion.h1>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-2 px-4 text-lg font-medium"
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
            "group bg-gray-900 text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition"
          )}
          onClick={handleClick}
        >
          {introContent.ctaText}{" "}
          <BsArrowRight className="opacity-70 group-hover:translate-x-1 transition" />
        </Link>

        <a
          className={clsx(
            syne.className,
            "group bg-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10"
          )}
          href={siteConfig.files.cv}
          download
        >
          {introContent.downloadCvText}{" "}
          <HiDownload className="opacity-60 group-hover:translate-y-1 transition" />
        </a>

        <div className="flex gap-2">
          <a
            className="bg-white
          md:w-14 md:h-14

          p-2 md:p-4 text-gray-700 hover:text-gray-950 flex items-center gap-2 rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
            href={siteConfig.social.linkedin}
            target="_blank"
          >
            <FaLinkedinIn />
          </a>

          <a
            className="bg-white
          md:w-14 md:h-14

          p-2 md:p-4 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
            href={siteConfig.social.github}
            target="_blank"
          >
            <BsGithub />
          </a>

          <a
            className="bg-white
          md:w-14 md:h-14

          p-2 md:p-4 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
            href={siteConfig.social.twitter}
            target="_blank"
          >
            <BsTwitterX />
          </a>
        </div>
      </motion.div>
    </section>
  );
});
const Intro = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
};

export default Intro;
