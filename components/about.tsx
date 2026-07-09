"use client";

import React from "react";
import { SectionHeader } from "./section-header";
import { motion } from "motion/react";
import { useSectionInView } from "@/lib/hooks";
import { aboutContent } from "@/lib/data";
import { IconUser } from "@tabler/icons-react";

export default function About() {
  const { ref } = useSectionInView("About");

  return (
    <motion.section
      ref={ref}
      className="scroll-mt-28 px-2 py-8 w-full"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      id="about"
    >
      <SectionHeader
        icon={IconUser}
        label="About"
        title="A bit about"
        highlight="me"
        subtitle="Get to know who I am and what drives me as a developer."
      />
      <div className="text-center space-y-4">
        {aboutContent.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="mx-auto text-[15px] text-muted-foreground leading-[1.8] max-w-[56ch]"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </motion.section>
  );
}
