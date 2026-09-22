import { BrandBar } from "@/components/bento/brand-bar";
import { CTATile } from "@/components/bento/cta-tile";
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
  return (
    <div className="bento-page">
      <BrandBar />
      {children}
      <div className="mb-6">
        <CTATile />
      </div>
    </div>
  );
}
