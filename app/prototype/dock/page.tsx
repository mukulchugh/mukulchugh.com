import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AboutPage from "@/app/about/page";
import BlogLayout from "@/app/blog/layout";
import BlogPage from "@/app/blog/page";
import ExperiencePage from "@/app/experience/page";
import ProjectsPage from "@/app/projects/page";
import { ContactSection } from "@/components/contact/contact-section";
import { DockNavigation } from "@/components/navigation/dock-navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Navigation dock · isolated preview",
};

export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="bento-page min-h-[100svh] pb-36 pt-8 sm:pt-14">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          The dock, in isolation.
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            className="inline-flex min-h-11 items-center underline underline-offset-4"
            href="/"
          >
            Back to portfolio
          </Link>
        </div>
      </header>
      <DockNavigation
        pages={{
          About: <AboutPage />,
          Blog: (
            <BlogLayout>
              <BlogPage />
            </BlogLayout>
          ),
          Contact: <ContactSection defaultBooking />,
          Experience: <ExperiencePage />,
          Projects: <ProjectsPage />,
        }}
        study
      />
    </main>
  );
}
