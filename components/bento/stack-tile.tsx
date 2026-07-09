import { skillsData } from "@/lib/data";
import { IconSparkles } from "@tabler/icons-react";

// Show a tidy subset — first 14 to keep it clean
const DISPLAY_COUNT = 14;

export function StackTile() {
  const skills = skillsData.slice(0, DISPLAY_COUNT);

  return (
    <div className="h-full p-5 flex flex-col gap-4 relative overflow-hidden">
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
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-zinc-100 border border-zinc-200">
          <IconSparkles className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
        </div>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.14em]">
          Tools I Use
        </span>
      </div>

      {/* Skill chips */}
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 text-[11px] font-medium rounded-full
                       border border-black/[0.07] bg-black/[0.03] text-muted-foreground
                       hover:border-zinc-400/60 hover:text-zinc-700 hover:bg-zinc-50
                       transition-all duration-200 ease-premium
                       cursor-default select-none"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Bottom accent line */}
      <div
        className="mt-auto pt-2 border-t border-black/[0.06] flex items-center justify-between"
      >
        <span className="text-[10px] text-muted-foreground/50 tracking-wide">
          {skillsData.length} technologies
        </span>
        <div className="h-1 w-8 rounded-full bg-gradient-to-r from-zinc-400/50 to-zinc-300/30" />
      </div>
    </div>
  );
}
