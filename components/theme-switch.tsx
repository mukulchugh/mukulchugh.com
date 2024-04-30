"use client";

import { useTheme } from "@/context/theme-context";
import clsx from "clsx";
import React from "react";
import { BsMoon, BsSun } from "react-icons/bs";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={clsx(
        "mr-3 w-[2.5rem] h-[2.5rem] border-opacity-40  flex items-center justify-center hover:scale-[1.3] active:scale-[1.5] transition-all "
      )}
      onClick={toggleTheme}
    >
      {theme === "light" ? <BsSun /> : <BsMoon />}
    </button>
  );
}
