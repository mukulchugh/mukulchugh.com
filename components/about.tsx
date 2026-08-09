"use client";

import { IconUser } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import { aboutContent } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { SectionHeader } from "./section-header";

export default function About() {
  const { ref } = useSectionInView("About");
  const shouldReduce = useReducedMotion();

  return (
    <section
      className="scroll-mt-28 p-5 sm:p-6 lg:p-8 w-full min-w-0"
      id="about"
      ref={ref}
    >
      <SectionHeader
        align="left"
        highlight="generalist"
        icon={IconUser}
        index="03"
        label="About"
        subtitle={undefined}
        title="Engineer turned"
      />
      <motion.div
        className="space-y-4"
        initial={shouldReduce ? false : "hidden"}
        variants={shouldReduce ? undefined : staggerContainer}
        viewport={viewportOnce}
        whileInView={shouldReduce ? undefined : "visible"}
      >
        {aboutContent.paragraphs.map((paragraph) => (
          <motion.p
            className="text-[14px] sm:text-[15px] text-muted-foreground leading-[1.75] max-w-[64ch] text-pretty"
            key={paragraph.slice(0, 24)}
            variants={shouldReduce ? undefined : staggerItem}
          >
            {paragraph}
          </motion.p>
        ))}
      </motion.div>
    </section>
  );
}
