"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";

export default function About() {
  const { ref } = useSectionInView("About");

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[48rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>About me</SectionHeading>
      <p className="mb-3">
        <p>Hey there, I'm Mukul Chugh, a software engineer based in India.</p>
        <p className="mt-2">
          I'm all about creating digital experiences that put humans first.
          Whether it's a slick UI or a cutting-edge app, I'm always on the
          lookout for ways to make technology more accessible and intuitive.
        </p>
        <p className="mt-2">
          My goal is always to create digital experiences that feel intuitive,
          human-centric, and just plain awesome. I've been working
          professionally for a few years now, and I've had the chance to work on
          a wide range of projects. Some of my favorite work has been in the
          realm of Frontend Development - there's something incredibly
          satisfying about creating a seamless, user-friendly interface that
          just clicks.
        </p>
        <p className="mt-2">
          Would you like to work together or just chat? Feel free to reach out
          to me.
        </p>
      </p>
    </motion.section>
  );
}
