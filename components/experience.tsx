"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { Timeline } from "./ui/timeline";
import { TimelineItem } from "./ui/timeline-item";
import { experiencesData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";

export default function Experience() {
  const { ref } = useSectionInView("Experience");

  return (
    <section id="experience" ref={ref} className="scroll-mt-28 mb-28 sm:mb-40">
      <SectionHeading>My experience</SectionHeading>
      <Timeline className="max-w-4xl mx-auto">
        {experiencesData.map((item, index) => (
          <TimelineItem
            key={index}
            index={index}
            title={item.title}
            company={item.company}
            location={item.location}
            date={item.date}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </Timeline>
    </section>
  );
}
