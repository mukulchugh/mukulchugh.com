import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useActiveSectionContext } from "@/context/active-section-context";
import type { SectionName } from "./types";

export function useSectionInView(sectionName: SectionName, _threshold = 0) {
  const { ref, inView } = useInView({
    rootMargin: "-15% 0px -65% 0px",
    threshold: 0,
  });
  const { setActiveSection, timeOfLastClick } = useActiveSectionContext();

  useEffect(() => {
    if (!inView) return;
    const remaining = Math.max(0, 700 - (Date.now() - timeOfLastClick));
    const timer = setTimeout(() => setActiveSection(sectionName), remaining);
    return () => clearTimeout(timer);
  }, [inView, setActiveSection, timeOfLastClick, sectionName]);

  return {
    ref,
  };
}
