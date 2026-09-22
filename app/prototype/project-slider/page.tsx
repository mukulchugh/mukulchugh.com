import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShowcaseProjects } from "@/lib/projects";
import { SliderLab } from "./slider-lab";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Project slider · prototypes",
};

export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return <SliderLab projects={getShowcaseProjects()} />;
}
