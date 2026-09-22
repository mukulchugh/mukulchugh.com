"use client";

import { IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { type Project, ProjectSlider } from "@/components/bento/project-slider";
import styles from "@/components/bento/project-slider.module.css";
import { Button } from "@/components/ui/button";

type Mode = "handoff" | "relay";

export function SliderLab({ projects }: { projects: Project[] }) {
  const [mode, setMode] = useState<Mode>("handoff");
  return (
    <main className={styles.lab}>
      <header className={styles.header}>
        <div>
          <p className="ui-label">Isolated prototypes</p>
          <h1>Projects, in motion.</h1>
        </div>
        <Link href="/">
          Back to portfolio <IconArrowUpRight size={16} />
        </Link>
      </header>
      <fieldset aria-label="Transition style" className={styles.switcher}>
        <Button
          aria-pressed={mode === "handoff"}
          onClick={() => setMode("handoff")}
          variant={mode === "handoff" ? "default" : "outline"}
        >
          A · Card handoff
        </Button>
        <Button
          aria-pressed={mode === "relay"}
          onClick={() => setMode("relay")}
          variant={mode === "relay" ? "default" : "outline"}
        >
          B · Editorial relay
        </Button>
      </fieldset>
      <p className={styles.explanation}>
        {mode === "handoff"
          ? "The next card crosses into the spotlight. The queue follows."
          : "The frame stays still. Artwork and copy pass the spotlight."}
      </p>
      <ProjectSlider debugFrames key={mode} mode={mode} projects={projects} />
      <p className={styles.note}>
        Three queued projects · Eight-second autoplay · Pauses while you explore
        · Existing artwork is illustrative
      </p>
    </main>
  );
}
