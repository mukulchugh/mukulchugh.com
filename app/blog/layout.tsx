import { QueryProvider } from "@/lib/query-provider";
import { siteConfig } from "@/lib/data";

export const metadata = {
  title: `Blog | ${siteConfig.name}`,
  description: "Articles and thoughts on software engineering, web development, and technology.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryProvider>{children}</QueryProvider>;
}
