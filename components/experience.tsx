"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { HorizontalTimeline } from "./ui/horizontal-timeline";
import { experiencesData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";

export default function Experience() {
  const { ref } = useSectionInView("Experience");

  return (
    <section id="experience" ref={ref} className="scroll-mt-28">
      <div className="text-center mb-8">
        <SectionHeading>My experience</SectionHeading>
      </div>
      <HorizontalTimeline data={experiencesData} />
    </section>
  );
}
