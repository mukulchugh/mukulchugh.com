import type { Metadata } from "next";
import StoryExperience from "./story-experience";

export const metadata: Metadata = {
  description:
    "A journey that began with my dad, a white computer, and a question. An interactive story from 2004 to 2026.",
  robots: { follow: false, index: false },
  title: "The screen stayed on · Mukul Chugh",
};

export default function StoryPage() {
  return <StoryExperience />;
}
