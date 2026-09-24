import { absoluteUrl, socialImage } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export function PageJsonLd({
  path,
  title,
  description,
  type = "WebPage",
}: {
  path: string;
  title: string;
  description: string;
  type?:
    | "WebPage"
    | "ProfilePage"
    | "CollectionPage"
    | "ContactPage"
    | "CreativeWork";
}) {
  const url = absoluteUrl(path);
  const parent = path.startsWith("/projects/")
    ? { name: "Projects", path: "/projects" }
    : null;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@id": `${url}#page`,
        "@type": type,
        description,
        image: socialImage(path),
        inLanguage: "en",
        isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
        name: title,
        url,
        ...(type === "ProfilePage"
          ? { mainEntity: { "@id": `${siteConfig.siteUrl}/#person` } }
          : { author: { "@id": `${siteConfig.siteUrl}/#person` } }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: "Home", path: "/" },
          ...(parent ? [parent] : []),
          { name: title, path },
        ].map((item, index) => ({
          "@type": "ListItem",
          item: absoluteUrl(item.path),
          name: item.name,
          position: index + 1,
        })),
      },
    ],
  };
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
      type="application/ld+json"
    />
  );
}
