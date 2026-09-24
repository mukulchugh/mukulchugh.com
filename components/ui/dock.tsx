"use client";

import dynamic from "next/dynamic";
import { DockNavigation } from "@/components/navigation/dock-navigation";

const loading = () => (
  <p className="p-6 text-muted-foreground" role="status">
    Loading page…
  </p>
);
const AboutPage = dynamic(() => import("@/components/about-page"), { loading });
const ExperiencePage = dynamic(() => import("@/components/experience-page"), {
  loading,
});
const ProjectsPage = dynamic(() => import("@/components/projects-page"), {
  loading,
});
const Writing = dynamic(() => import("@/components/navigation/dock-writing"), {
  loading,
});
const ContactSection = dynamic(
  () =>
    import("@/components/contact/contact-section").then(
      (module) => module.ContactSection
    ),
  { loading }
);

export function Dock() {
  return (
    <DockNavigation
      pages={{
        About: <AboutPage />,
        Blog: <Writing />,
        Contact: <ContactSection defaultBooking id="dock-contact" />,
        Experience: <ExperiencePage />,
        Projects: <ProjectsPage />,
      }}
    />
  );
}
