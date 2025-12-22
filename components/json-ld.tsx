import { siteConfig, skillsData, experiencesData } from "@/lib/data";

export function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    givenName: siteConfig.firstName,
    familyName: siteConfig.lastName,
    url: siteConfig.siteUrl,
    image: siteConfig.images.profileImage,
    jobTitle: siteConfig.title,
    description: siteConfig.siteDescription,
    email: `mailto:${siteConfig.email.display}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "India",
    },
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
      siteConfig.social.blog,
    ],
    knowsAbout: skillsData,
    alumniOf: experiencesData.map((exp) => ({
      "@type": "Organization",
      name: exp.company,
    })),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    description: siteConfig.siteDescription,
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: siteConfig.name,
      image: siteConfig.images.profileImage,
      description: siteConfig.siteDescription,
      sameAs: [
        siteConfig.social.github,
        siteConfig.social.linkedin,
        siteConfig.social.twitter,
      ],
    },
  };

  // Work experience as occupation/job postings
  const workExperienceSchema = experiencesData.slice(0, 3).map((exp) => ({
    "@context": "https://schema.org",
    "@type": "Occupation",
    name: exp.title,
    occupationLocation: {
      "@type": "City",
      name: exp.location,
    },
    estimatedSalary: {
      "@type": "MonetaryAmountDistribution",
      currency: "INR",
    },
    description: exp.description?.join(" "),
    skills: skillsData.slice(0, 10).join(", "),
  }));

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
      {workExperienceSchema.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
