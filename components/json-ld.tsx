import { siteConfig } from "@/lib/data";

export function JsonLd() {
  const base = siteConfig.siteUrl;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@id": `${base}/#person`,
        "@type": "Person",
        address: { "@type": "PostalAddress", addressCountry: "IN" },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "professional enquiries",
          email: siteConfig.email.recipient,
          url: `${base}/contact`,
        },
        description: siteConfig.siteDescription,
        image: new URL(siteConfig.images.profileImage, base).href,
        name: siteConfig.name,
        sameAs: [
          siteConfig.social.github,
          siteConfig.social.linkedin,
          siteConfig.social.twitter,
        ],
        url: `${base}/about`,
      },
      {
        "@id": `${base}/#website`,
        "@type": "WebSite",
        description: siteConfig.siteDescription,
        inLanguage: "en",
        name: siteConfig.name,
        publisher: { "@id": `${base}/#person` },
        url: base,
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
