import AboutPage from "@/app/about/page";
import BlogLayout from "@/app/blog/layout";
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
        Blog: (
          <BlogLayout>
            <BlogPage />
          </BlogLayout>
        ),
        Contact: <ContactSection id="dock-contact" />,
        Experience: <ExperiencePage />,
        Projects: <ProjectsPage />,
      }}
    />
  );
}
