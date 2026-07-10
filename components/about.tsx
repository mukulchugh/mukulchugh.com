"use client";

import React from "react";
import { SectionHeader } from "./section-header";
import { motion, useReducedMotion } from "motion/react";
import { useSectionInView } from "@/lib/hooks";
import { aboutContent } from "@/lib/data";
import { IconUser } from "@tabler/icons-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
};

const paraVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 110, damping: 20 },
  },
};

export default function About() {
  const { ref } = useSectionInView("About");
  const shouldReduce = useReducedMotion();

  return (
    <section
      ref={ref}
      className="scroll-mt-28 p-5 sm:p-6 lg:p-8 w-full min-w-0"
      id="about"
    >
      <SectionHeader
        icon={IconUser}
        label="About"
        index="03"
        title="Engineer turned"
        highlight="generalist"
        subtitle={undefined}
        align="left"
      />
      <motion.div
        className="space-y-4"
        variants={shouldReduce ? undefined : containerVariants}
        initial={shouldReduce ? false : "hidden"}
        whileInView={shouldReduce ? undefined : "visible"}
        viewport={{ once: true, amount: 0.15 }}
      >
        {aboutContent.paragraphs.map((paragraph, index) => (
          <motion.p
            key={index}
            variants={shouldReduce ? undefined : paraVariants}
            className="text-[14px] sm:text-[15px] text-zinc-600 leading-[1.75] max-w-[64ch] text-pretty"
          >
            {paragraph}
          </motion.p>
        ))}
      </motion.div>
    </section>
  );
}
