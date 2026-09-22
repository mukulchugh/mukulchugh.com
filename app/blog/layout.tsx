import { PageShell } from "@/components/page-shell";
import { siteConfig } from "@/lib/data";

export const metadata = {
  description:
    "Notes on engineering, product, and the craft of building software that earns its keep.",
  title: `Writing | ${siteConfig.name}`,
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
