import { syne } from "@/lib/fonts";
import clsx from "clsx";
import React from "react";

type SectionHeadingProps = {
  children: React.ReactNode;
};

export default function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2
      className={clsx(
        syne.className,
        "text-3xl font-medium capitalize mb-8 text-center"
      )}
    >
      {children}
    </h2>
  );
}
