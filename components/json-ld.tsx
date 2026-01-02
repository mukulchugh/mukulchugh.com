import { siteConfig, skillsData, experiencesData } from "@/lib/data";

export function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.siteUrl}/#person`,
    name: siteConfig.name,
    givenName: siteConfig.firstName,
    familyName: siteConfig.lastName,
    url: siteConfig.siteUrl,
    image: {
      "@type": "ImageObject",
      url: siteConfig.images.profileImage,
      caption: siteConfig.name,
    },
    jobTitle: siteConfig.title,
    description: siteConfig.siteDescription,
    email: siteConfig.email.display,
    workLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Francisco",
        addressRegion: "CA",
        addressCountry: "US",
      },
    },
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
      siteConfig.social.blog,
    ],
    knowsAbout: skillsData,
    worksFor: {
      "@type": "Organization",
      "@id": `${siteConfig.siteUrl}/#organization`,
      name: experiencesData[0].company, // Current employer
      url: "https://quivly.ai",
    },
    alumniOf: experiencesData.slice(1, 4).map((exp) => ({
      "@type": "Organization",
      name: exp.company,
    })),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.siteUrl}/#website`,
    name: `${siteConfig.name} - Portfolio`,
    url: siteConfig.siteUrl,
    description: siteConfig.siteDescription,
    inLanguage: "en-US",
    author: {
      "@id": `${siteConfig.siteUrl}/#person`,
    },
    publisher: {
      "@id": `${siteConfig.siteUrl}/#person`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.siteUrl}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": siteConfig.siteUrl,
    url: siteConfig.siteUrl,
    name: `${siteConfig.name} - ${siteConfig.title}`,
    description: siteConfig.siteDescription,
    inLanguage: "en-US",
    isPartOf: {
      "@id": `${siteConfig.siteUrl}/#website`,
    },
    about: {
      "@id": `${siteConfig.siteUrl}/#person`,
    },
    mainEntity: {
      "@id": `${siteConfig.siteUrl}/#person`,
    },
  };

  // Organization schema for current employer
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.siteUrl}/#organization`,
    name: experiencesData[0].company,
    url: "https://quivly.ai",
    logo: experiencesData[0].icon,
    employee: {
      "@id": `${siteConfig.siteUrl}/#person`,
    },
    description: "AI-powered product platform",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
