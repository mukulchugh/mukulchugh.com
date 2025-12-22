"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import { aboutContent } from "@/lib/data";

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
      <SectionHeading>{aboutContent.heading}</SectionHeading>
      <div className="mb-3">
        {aboutContent.paragraphs.map((paragraph, index) => (
          <p key={index} className={index > 0 ? "mt-2" : ""}>
            {paragraph}
          </p>
        ))}
      </div>
    </motion.section>
  );
}
