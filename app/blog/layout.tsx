import { siteConfig } from "@/lib/data";

export const metadata = {
  description:
    "Articles and thoughts on software engineering, web development, and technology.",
  title: `Blog | ${siteConfig.name}`,
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
