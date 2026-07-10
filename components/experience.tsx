"use client";

import React, { useMemo } from "react";
import { SectionHeader } from "./section-header";
import ExpandableCard from "./ui/expandable-card";
import { CollapsibleList } from "./ui/collapsible-list";
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
      className="scroll-mt-28 p-5 sm:p-6 lg:p-8 w-full min-w-0"
    >
      <SectionHeader
        icon={IconBriefcase}
        label="Experience"
        index="05"
        title="Professional"
        highlight="journey"
        subtitle="From student ambassador to founding engineer."
        align="left"
      />
      <CollapsibleList
        items={cardItems}
        initial={4}
        noun="roles"
        renderList={(visible) => <ExpandableCard items={visible} />}
      />
    </section>
  );
}
