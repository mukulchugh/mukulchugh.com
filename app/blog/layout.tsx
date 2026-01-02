import { QueryProvider } from "@/lib/query-provider";
import { siteConfig } from "@/lib/data";
import { GoogleAdSense } from "@/components/google-adsense";

export const metadata = {
  title: `Blog | ${siteConfig.name}`,
  description: "Articles and thoughts on software engineering, web development, and technology.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GoogleAdSense />
      <QueryProvider>{children}</QueryProvider>
    </>
  );
}
