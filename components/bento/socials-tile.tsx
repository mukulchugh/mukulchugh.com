import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconMail,
  IconArrowUpRight,
} from "@tabler/icons-react";
import { siteConfig } from "@/lib/data";

/**
 * SocialsTile — a section of its own. The one place the monochrome ink system
 * lets brand color in: each platform shows its real brand hue, so the row reads
 * as a deliberate splash of color against the neutral grid.
 */
const socials = [
  {
    name: "LinkedIn",
    handle: "in/mukulchugh",
    href: siteConfig.social.linkedin,
    Icon: IconBrandLinkedin,
    color: "#0A66C2",
  },
  {
    name: "GitHub",
    handle: "@mukulchugh",
    href: siteConfig.social.github,
    Icon: IconBrandGithub,
    color: "#1f2328",
  },
  {
    name: "X",
    handle: "@themukulchugh",
    href: siteConfig.social.twitter,
    Icon: IconBrandX,
    color: "#101010",
  },
  {
    name: "Email",
    handle: siteConfig.email.display,
    href: `mailto:${siteConfig.email.display}`,
    Icon: IconMail,
    color: "#e0672f",
  },
] as const;

export function SocialsTile() {
  return (
    <div className="flex h-full flex-col p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
          Connect
        </span>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-2.5 [grid-auto-rows:1fr]">
        {socials.map(({ name, handle, href, Icon, color }) => (
          <a
            key={name}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            aria-label={name}
            title={handle}
            className="group relative flex min-h-[80px] sm:min-h-[92px] flex-col items-start justify-between gap-2 sm:gap-3 overflow-hidden rounded-2xl border border-black/[0.08] bg-white p-3 sm:p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-14px_rgba(24,24,27,0.18)]"
          >
            {/* brand-tint wash that reveals on hover */}
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ background: `${color}0f` }}
              aria-hidden="true"
            />
            <span className="relative flex w-full items-start justify-between">
              <span
                className="grid h-9 w-9 place-items-center rounded-xl"
                style={{ background: `${color}14`, color }}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <IconArrowUpRight className="h-4 w-4 text-zinc-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-600" />
            </span>
            <span className="relative block truncate text-sm font-semibold text-zinc-900">
              {name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
