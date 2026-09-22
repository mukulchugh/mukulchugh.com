"use client";

import { ExperienceTile } from "@/components/experience/experience-tile";
import { useSectionInView } from "@/lib/hooks";

export default function Experience() {
  const { ref } = useSectionInView("Experience");
  return (
    <div className="min-w-0 scroll-mt-20" id="experience" ref={ref}>
      <ExperienceTile />
    </div>
  );
}
