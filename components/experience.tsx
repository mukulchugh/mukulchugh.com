"use client";

import React, { useMemo } from "react";
import { SectionHeader } from "./section-header";
import ExpandableCard from "./ui/expandable-card";
import { experiencesData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { IconBriefcase } from "@tabler/icons-react";

export default function Experience() {
  const { ref } = useSectionInView("Experience");

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
      className="scroll-mt-28 px-2 py-8 w-full"
    >
      <SectionHeader
        icon={IconBriefcase}
        label="Experience"
        title="My professional"
        highlight="journey"
        subtitle="A timeline of my career, from where I started to where I am today."
      />
      <ExpandableCard items={cardItems} />
    </section>
  );
}
