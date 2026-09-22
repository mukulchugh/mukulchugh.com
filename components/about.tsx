"use client";

import { IconArrowUpRight, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { aboutContent } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import styles from "./about.module.css";

const perspectives = [
  {
    href: "/projects/brik",
    label: "Mobile",
    project: "Explore Brik",
    text: "Mobile is one of my foundations. With Brik, I’m exploring how React-style authoring can reach native widgets and live surfaces. It’s beta work, shaped by the constraints of the device.",
    title: "Close to the device. Close to the detail.",
  },
  {
    href: "/projects/zendash-global-admin-dashboard",
    label: "Full-stack",
    project: "Explore the work",
    text: "At Zenduty, I contributed across mobile, web, and internal products. ZenDash brought customer information into reach of the teams using it, connecting product decisions with the systems underneath.",
    title: "The interface is part of a bigger picture.",
  },
  {
    href: "/projects/ctxr",
    label: "AI & tools",
    project: "Explore ctxr",
    text: "A transcript tells an agent what was said, but can miss what happened onscreen. I built ctxr to bring the words and frames together, making video easier to inspect and use.",
    title: "Useful tools start with a real problem.",
  },
];

const longerStory = [
  {
    text: aboutContent.paragraphs[0],
    title: "Design was always part of it.",
  },
  {
    text: aboutContent.paragraphs[1],
    title: "More of the product in view.",
  },
  {
    text: aboutContent.paragraphs[2],
    title: "A bigger canvas.",
  },
];

export default function About() {
  const { ref } = useSectionInView("About");
  const [selected, setSelected] = useState(0);
  const perspective = perspectives[selected];
  return (
    <section
      aria-labelledby="about-title"
      className={`bento-surface ${styles.card}`}
      id="about"
      ref={ref}
    >
      <h2 className={styles.title} id="about-title">
        The tools changed.
        <br />I raised the stakes.
      </h2>
      <div className={styles.story}>
        <p>
          My foundation is engineering. My interests have never stayed inside
          it. I’ve built across mobile, product, and design.
        </p>
        <p>
          Now, with AI in the mix, I’m taking on more of the whole idea, from
          the first question to something people can actually use.
        </p>
      </div>
      <fieldset aria-label="Explore my work" className={styles.choices}>
        {perspectives.map((item, index) => (
          <Button
            aria-controls="about-perspective"
            aria-pressed={selected === index}
            className={styles.choice}
            key={item.label}
            onClick={() => setSelected(index)}
            variant="unstyled"
          >
            {item.label}
          </Button>
        ))}
      </fieldset>
      <div
        aria-atomic="true"
        aria-live="polite"
        className={styles.perspective}
        id="about-perspective"
      >
        <div className={styles.reveal} key={perspective.label}>
          <h3>{perspective.title}</h3>
          <p>{perspective.text}</p>
          <Link className={styles.projectLink} href={perspective.href}>
            {perspective.project}
            <IconArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>
      <footer className={styles.footer}>
        <span className="ui-label">The longer story</span>
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>
            More about me <IconPlus aria-hidden="true" size={18} />
          </DialogTrigger>
          <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-[14px] p-6 sm:max-w-3xl sm:p-8">
            <DialogHeader className="pr-8">
              <DialogTitle className="text-2xl font-semibold sm:text-3xl">
                {aboutContent.heading}
              </DialogTitle>
              <DialogDescription>
                I’m Mukul. I build across mobile, web, and AI, with a hand in
                how products work and how they feel.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-7 pt-2">
              {longerStory.map((chapter) => (
                <section key={chapter.title}>
                  <h3 className="mb-3 text-lg font-semibold leading-snug tracking-tight text-foreground">
                    {chapter.title}
                  </h3>
                  <p className="max-w-[65ch] text-[15px] leading-[1.75] text-muted-foreground">
                    {chapter.text}
                  </p>
                </section>
              ))}
              <p className="border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
                And yes, an unreasonable amount of coffee.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </footer>
    </section>
  );
}
