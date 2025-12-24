"use client";

import React from "react";
import { SectionHeader } from "./section-header";
import { motion } from "motion/react";
import { useSectionInView } from "@/lib/hooks";
import { aboutContent } from "@/lib/data";
import { User } from "lucide-react";

export default function About() {
  const { ref } = useSectionInView("About");

  return (
    <section
      ref={ref}
      className="mb-28 max-w-4xl mx-auto leading-8 sm:mb-40 scroll-mt-28 px-4 pt-20 sm:pt-28"
      id="about"
    >
      <SectionHeader
        icon={User}
        label="About"
        title="A bit about"
        highlight="me"
        subtitle="Get to know who I am and what drives me as a developer."
        iconColor="#4c7894"
        highlightGradient="from-[#4c7894] via-[#5a922c] to-[#d79f1e]"
      />
      <div className="text-center">
        {aboutContent.paragraphs.map((paragraph, index) => (
          <motion.p
            key={index}
            className={index > 0 ? "mt-4" : ""}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
