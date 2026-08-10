"use client";

import { IconBriefcase } from "@tabler/icons-react";
import { useMemo } from "react";
import { experiencesData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { SectionHeader } from "./section-header";
import { CollapsibleList } from "./ui/collapsible-list";
import ExpandableCard from "./ui/expandable-card";

export default function Experience() {
  const { ref } = useSectionInView("Experience");

  const cardItems = useMemo(
    () =>
      experiencesData.map((exp, index) => ({
        company: exp.company,
        date: exp.date,
        description: exp.description,
        icon: exp.icon,
        id: `exp-${index}`,
        location: exp.location,
        title: exp.title,
      })),
    []
  );

  return (
    <section
      className="scroll-mt-28 p-5 sm:p-6 lg:p-8 w-full min-w-0"
      id="experience"
      ref={ref}
    >
      <SectionHeader
        align="left"
        highlight="worked"
        icon={IconBriefcase}
        index="05"
        label="Experience"
        subtitle="From student ambassador to founding engineer, the short version."
        title="Where I've"
      />
      <CollapsibleList
        initial={4}
        items={cardItems}
        noun="roles"
        renderList={(visible) => <ExpandableCard items={visible} />}
      />
    </section>
  );
}
