import { IconSparkles } from "@tabler/icons-react";
import { skillsData } from "@/lib/data";

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
  if (more.length > 0) {
    groups.push({ label: "More", skills: more });
  }
  return groups;
}

export function StackTile() {
  const groups = groupSkills(skillsData);

  return (
    <div className="h-full p-5 flex flex-col gap-3.5 relative overflow-hidden">
      {/* Subtle neutral diffusion in the bottom-right corner */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 100% 100%, hsl(var(--foreground) / 0.05) 0%, transparent 65%)",
        }}
      />

      {/* Header */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="p-1.5 rounded-none bg-muted border border-border">
          <IconSparkles
            aria-hidden="true"
            className="h-3.5 w-3.5 text-muted-foreground"
          />
        </div>
        <span className="ui-label text-muted-foreground">Tools I Use</span>
      </div>

      {/* Hairline separator */}
      <div
        aria-hidden="true"
        className="h-px bg-foreground/[0.07] flex-shrink-0"
      />

      {/* Skill groups — fills the remaining height with even rhythm */}
      <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-hidden">
        {groups.map(({ label, skills }) => (
          <div className="flex flex-col gap-1.5" key={label}>
            {/* Category label */}
            <span className="ui-label select-none text-muted-foreground/80">
              {label}
            </span>
            {/* Chips */}
            <div className="flex flex-wrap gap-1">
              {skills.map((skill) => (
                <span
                  className="ui-label rounded-none px-2 py-0.5
                             border border-border bg-card text-muted-foreground shadow-sm
                             hover:border-border hover:text-foreground hover:-translate-y-px
                             transition-[color,border-color,transform] duration-200 ease-premium
                             cursor-default select-none"
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer — integrated, not floating */}
      <div className="pt-2.5 border-t border-border flex items-center justify-between flex-shrink-0">
        <span className="ui-label text-muted-foreground/50">
          {skillsData.length} technologies
        </span>
        <div className="h-px w-8 bg-foreground/15" />
      </div>
    </div>
  );
}
