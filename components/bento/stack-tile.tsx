import { skillsData } from "@/lib/data";
import { IconSparkles } from "@tabler/icons-react";

// Derive groups in the component — do not edit data.ts
// Any skill not matched falls into "More" so nothing is dropped.
const GROUPS: { label: string; skills: string[] }[] = [
  {
    label: "Languages",
    skills: ["JavaScript", "TypeScript", "Python"],
  },
  {
    label: "Frameworks",
    skills: ["React", "Next.js", "Node.js", "Django", "Redux"],
  },
  {
    label: "Mobile",
    skills: ["React Native", "Fastlane"],
  },
  {
    label: "Infra",
    skills: ["Docker", "AWS", "Kubernetes", "Redis", "Git"],
  },
  {
    label: "Data",
    skills: ["GraphQL", "MongoDB", "MySQL", "Firebase"],
  },
  {
    label: "Design",
    skills: ["Figma", "TailwindCSS", "Human-Centric Design"],
  },
];

function groupSkills(skills: readonly string[]) {
  const matched = new Set<string>();
  const groups = GROUPS.map(({ label, skills: want }) => {
    const present = want.filter((s) => skills.includes(s));
    present.forEach((s) => matched.add(s));
    return { label, skills: present };
  }).filter((g) => g.skills.length > 0);

  const more = [...skills].filter((s) => !matched.has(s));
  if (more.length > 0) groups.push({ label: "More", skills: more });
  return groups;
}

export function StackTile() {
  const groups = groupSkills(skillsData);

  return (
    <div className="h-full p-5 flex flex-col gap-3.5 relative overflow-hidden">
      {/* Subtle neutral diffusion in the bottom-right corner */}
      <div
        className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 100% 100%, rgba(24,24,27,0.04) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="p-1.5 rounded-md bg-zinc-100 border border-zinc-200">
          <IconSparkles className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
        </div>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.14em]">
          Tools I Use
        </span>
      </div>

      {/* Hairline separator */}
      <div className="h-px bg-black/[0.06] flex-shrink-0" aria-hidden="true" />

      {/* Skill groups — fills the remaining height with even rhythm */}
      <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-hidden">
        {groups.map(({ label, skills }) => (
          <div key={label} className="flex flex-col gap-1.5">
            {/* Category label */}
            <span className="text-[9px] font-mono font-semibold uppercase tracking-[0.18em] text-zinc-400/80 select-none">
              {label}
            </span>
            {/* Chips */}
            <div className="flex flex-wrap gap-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 text-[10.5px] font-medium rounded-full
                             border border-black/[0.09] bg-white text-zinc-600 shadow-sm
                             hover:border-zinc-400/70 hover:text-zinc-900 hover:-translate-y-px
                             transition-all duration-200 ease-premium
                             cursor-default select-none"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer — integrated, not floating */}
      <div className="pt-2.5 border-t border-black/[0.06] flex items-center justify-between flex-shrink-0">
        <span className="text-[10px] font-mono text-muted-foreground/50 tracking-wide">
          {skillsData.length} technologies
        </span>
        <div className="h-px w-8 bg-zinc-300/40" />
      </div>
    </div>
  );
}
