"use client";

import {
  type Icon,
  IconBolt,
  IconDeviceMobile,
  IconRobot,
  IconServer2,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { CanvasGrain } from "@/components/canvas-grain";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { accentColorForTags } from "@/lib/blog-topic";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

// Reuse the site's established topic-family accents (lib/blog-topic.ts) so
// these cards land on the same violet/blue/green hues as the blog + project
// cards, instead of inventing a new palette.
const AGENT_ACCENT = accentColorForTags(["AI Agents"]);
const MOBILE_ACCENT = accentColorForTags(["React Native"]);
const INFRA_ACCENT = accentColorForTags(["Infrastructure"]);

/** Four L-shaped corner brackets — the shadcn "features" block's signature
 * decoration, restyled to pull its color from the deterministic accent
 * system instead of a hardcoded border-primary. */
function CardDecorator({ accent }: { accent: string }) {
  const corner = "absolute block size-2 opacity-70";
  return (
    <>
      <span
        className={cn(corner, "-left-px -top-px border-l-2 border-t-2")}
        style={{ borderColor: accent }}
      />
      <span
        className={cn(corner, "-right-px -top-px border-r-2 border-t-2")}
        style={{ borderColor: accent }}
      />
      <span
        className={cn(corner, "-bottom-px -left-px border-b-2 border-l-2")}
        style={{ borderColor: accent }}
      />
      <span
        className={cn(corner, "-bottom-px -right-px border-b-2 border-r-2")}
        style={{ borderColor: accent }}
      />
    </>
  );
}

function CapabilityCard({
  children,
  className,
  accent,
}: {
  children: ReactNode;
  className?: string;
  accent: string;
}) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden glass-tile glass-tile-hover",
        className
      )}
    >
      <CardDecorator accent={accent} />
      {children}
    </Card>
  );
}

function CardHeading({
  icon: TablerIcon,
  title,
  description,
  accent,
}: {
  icon: Icon;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="w-fit rounded-none border border-border bg-muted p-2 text-muted-foreground"
        style={{ boxShadow: `0 0 24px -8px ${accent}` }}
      >
        <TablerIcon className="h-4 w-4" />
      </div>
      <h3 className="font-syne font-bold text-[17px] tracking-[-0.01em] text-foreground">
        {title}
      </h3>
      <p className="text-[13.5px] leading-[1.65] text-muted-foreground text-pretty">
        {description}
      </p>
    </div>
  );
}

/** Loose node graph — evokes agent/AI work without a literal illustration. */
function AgentGraphIllustration({ accent }: { accent: string }) {
  const nodes: [number, number, number][] = [
    [16, 44, 3],
    [50, 18, 3],
    [88, 38, 3.5],
    [38, 76, 3],
    [76, 80, 3],
    [110, 58, 4],
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 3],
    [1, 3],
    [3, 4],
    [2, 5],
    [4, 5],
    [1, 5],
  ];

  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      fill="none"
      viewBox="0 0 130 100"
    >
      {edges.map(([a, b]) => (
        <line
          key={`edge-${a}-${b}`}
          stroke={accent}
          strokeOpacity={0.32}
          strokeWidth={1}
          x1={nodes[a][0]}
          x2={nodes[b][0]}
          y1={nodes[a][1]}
          y2={nodes[b][1]}
        />
      ))}
      {nodes.map(([x, y, r]) => (
        <circle
          cx={x}
          cy={y}
          fill={accent}
          fillOpacity={0.7}
          key={`node-${x}-${y}`}
          r={r}
        />
      ))}
    </svg>
  );
}

/** Loose app-icon grid — evokes mobile/platform surface work. */
function MobileGridIllustration({ accent }: { accent: string }) {
  const cols = 6;
  const rows = 3;
  const cellW = 130 / cols;
  const cellH = 100 / rows;
  // Fixed skip-pattern so the grid reads as "loose", not a solid block.
  const skip = new Set([2, 5, 9, 11, 13, 16]);

  const cells: ReactNode[] = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = idx++;
      if (skip.has(i)) {
        continue;
      }
      const x = c * cellW + cellW * 0.18;
      const y = r * cellH + cellH * 0.18;
      const size = Math.min(cellW, cellH) * 0.64;
      cells.push(
        <rect
          fill={accent}
          fillOpacity={0.15 + (i % 3) * 0.12}
          height={size}
          key={`cell-${i}`}
          rx={4}
          width={size}
          x={x}
          y={y}
        />
      );
    }
  }

  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      fill="none"
      viewBox="0 0 130 100"
    >
      {cells}
    </svg>
  );
}

const CAPSTONE_ROW = [
  { accent: AGENT_ACCENT, icon: IconRobot, label: "Agents" },
  { accent: MOBILE_ACCENT, icon: IconDeviceMobile, label: "Mobile" },
  { accent: INFRA_ACCENT, icon: IconServer2, label: "Infra" },
] as const;

export default function Capabilities() {
  const shouldReduce = useReducedMotion();

  return (
    <section
      className="scroll-mt-28 p-5 sm:p-6 lg:p-8 w-full min-w-0"
      id="capabilities"
    >
      <SectionHeader
        align="left"
        highlight="work"
        icon={IconBolt}
        label="Capabilities"
        subtitle="Three things that show up in nearly everything I ship."
        title="How I"
      />

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        initial={shouldReduce ? false : "hidden"}
        variants={shouldReduce ? undefined : staggerContainer}
        viewport={viewportOnce}
        whileInView={shouldReduce ? undefined : "visible"}
      >
        <motion.div variants={shouldReduce ? undefined : staggerItem}>
          <CapabilityCard accent={AGENT_ACCENT} className="h-full">
            <CardHeader className="relative z-10 pb-0">
              <CardHeading
                accent={AGENT_ACCENT}
                description="Founding engineer at Quivly.ai, building AI-powered products end to end. Shipped an AI-based QC and moderation engine at Swiggy, plus a public Agent Skills library and the MCP tooling that connects Quivly's systems."
                icon={IconRobot}
                title="Built-in AI, not bolted on"
              />
            </CardHeader>
            <CardContent className="relative h-28 pt-4">
              <AgentGraphIllustration accent={AGENT_ACCENT} />
              <CanvasGrain opacity={0.06} />
            </CardContent>
          </CapabilityCard>
        </motion.div>

        <motion.div variants={shouldReduce ? undefined : staggerItem}>
          <CapabilityCard accent={MOBILE_ACCENT} className="h-full">
            <CardHeader className="relative z-10 pb-0">
              <CardHeading
                accent={MOBILE_ACCENT}
                description="Re-architected Zenduty's React Native app from the ground up with an in-house UI library, and shipped an OTA pipeline at Swiggy for staged rollouts and instant rollback. Brik, open-sourced, compiles React straight to native SwiftUI and Jetpack Compose widgets."
                icon={IconDeviceMobile}
                title="Mobile, at production scale"
              />
            </CardHeader>
            <CardContent className="relative h-28 pt-4">
              <MobileGridIllustration accent={MOBILE_ACCENT} />
              <CanvasGrain opacity={0.06} />
            </CardContent>
          </CapabilityCard>
        </motion.div>

        <motion.div
          className="sm:col-span-2"
          variants={shouldReduce ? undefined : staggerItem}
        >
          <CapabilityCard accent={INFRA_ACCENT} className="p-6">
            <CanvasGrain opacity={0.05} />
            <p className="relative z-10 mx-auto my-2 max-w-md text-balance text-center text-[19px] sm:text-[21px] font-syne font-bold tracking-[-0.01em] text-foreground">
              One person, the whole stack: agents, apps, and the infrastructure
              between them.
            </p>
            <div className="relative z-10 mt-6 flex items-center justify-center gap-8 overflow-hidden sm:gap-14">
              {CAPSTONE_ROW.map(({ icon: TablerIcon, label, accent }, i) => (
                <div
                  className="relative flex flex-col items-center gap-2"
                  key={label}
                >
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute right-full top-6 hidden h-px w-8 sm:w-14 sm:block"
                      style={{
                        background: `linear-gradient(to right, transparent, ${accent} 50%, transparent)`,
                        opacity: 0.4,
                      }}
                    />
                  )}
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-none border border-border bg-muted text-muted-foreground"
                    style={{ boxShadow: `0 0 24px -8px ${accent}` }}
                  >
                    <TablerIcon className="h-5 w-5" />
                  </div>
                  <span className="ui-label text-muted-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </CapabilityCard>
        </motion.div>
      </motion.div>
    </section>
  );
}
