"use client";

import Image from "next/image";
import { experiencesData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";

function Role({
  experience,
}: {
  experience: (typeof experiencesData)[number];
}) {
  return (
    <details className="border-b border-border last:border-0">
      <summary className="flex cursor-pointer list-none items-center gap-4 py-4 md:gap-[3cqw] md:py-[1.3cqw]">
        <Image
          alt=""
          className="size-10 rounded-[4px] object-contain md:size-[4cqw]"
          height={48}
          src={experience.icon}
          unoptimized
          width={48}
        />
        <span>
          <span className="block text-[clamp(14px,1.5cqw,21px)] font-bold leading-tight">
            {experience.company}
          </span>
          <span className="mt-1 block text-[clamp(10px,1cqw,14px)] leading-tight text-muted-foreground">
            {experience.title}
          </span>
        </span>
      </summary>
      <div className="pb-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          {experience.date} · {experience.location}
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          {experience.description.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </details>
  );
}

export default function Experience() {
  const { ref } = useSectionInView("Experience");
  return (
    <section
      className="bento-surface min-w-0 scroll-mt-20 p-5 md:p-[1.7cqw]"
      id="experience"
      ref={ref}
    >
      <h2 className="bento-label">08 / Experience</h2>
      <div className="mt-1">
        {experiencesData.slice(0, 3).map((experience) => (
          <Role experience={experience} key={experience.company} />
        ))}
      </div>
      <details className="text-[clamp(11px,1cqw,14px)]">
        <summary className="w-fit cursor-pointer underline underline-offset-4">
          Earlier roles
        </summary>
        {experiencesData.slice(3).map((experience) => (
          <Role experience={experience} key={experience.company} />
        ))}
      </details>
    </section>
  );
}
