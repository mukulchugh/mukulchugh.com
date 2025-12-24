"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { SectionHeader } from "./section-header";
import ExpandableCard from "./ui/expandable-card";
import { experiencesData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { Briefcase } from "lucide-react";

export default function Experience() {
  const { ref } = useSectionInView("Experience");

  // Transform experiencesData to match the ExpandableCard interface
  const cardItems = useMemo(
    () =>
      experiencesData.map((exp, index) => ({
        id: `exp-${index}`,
        title: exp.title,
        company: exp.company,
        location: exp.location,
        date: exp.date,
        icon: exp.icon,
        description: exp.description,
      })),
    []
  );

  return (
    <section
      id="experience"
      ref={ref}
      className="scroll-mt-28 mb-28 sm:mb-40 px-4 max-w-4xl mx-auto w-full"
    >
      <SectionHeader
        icon={Briefcase}
        label="Experience"
        title="My professional"
        highlight="journey"
        subtitle="A timeline of my career, from where I started to where I am today."
        iconColor="#5a922c"
        highlightGradient="from-[#5a922c] via-[#4c7894] to-[#dd7bbb]"
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <ExpandableCard items={cardItems} />
      </motion.div>
    </section>
  );
}
