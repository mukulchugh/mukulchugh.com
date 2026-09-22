import AboutPage from "@/app/about/page";
import BlogPage from "@/app/blog/page";
import ExperiencePage from "@/app/experience/page";
import ProjectsPage from "@/app/projects/page";
import { ContactSection } from "@/components/contact/contact-section";
import { DockNavigation } from "@/components/navigation/dock-navigation";

export function Dock() {
  return (
    <DockNavigation
      pages={{
        About: <AboutPage />,
        Blog: <BlogPage />,
        Contact: <ContactSection id="dock-contact" />,
        Experience: <ExperiencePage />,
        Projects: <ProjectsPage />,
      }}
    />
  );
}
