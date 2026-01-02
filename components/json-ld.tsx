import { siteConfig, skillsData, experiencesData } from "@/lib/data";

// SEO Keywords for structured data
const seoKeywords = [
  // Brand
  "Mukul",
  "Chugh",
  "Mukul Chugh",
  "Digital Mukul",
  "Digital Moshai",
  "Nerd Engineer",
  "themukulchugh",
  // Roles
  "Product Engineer",
  "Mobile Engineer",
  "Full Stack Developer",
  "React Native Developer",
  "Founding Engineer",
  "Software Development Engineer",
  "Web Developer",
  "iOS Developer",
  "Android Developer",
  "Tech Generalist",
  "Creative Technologist",
  // Skills
  "Software Engineering",
  "Mobile Engineering",
  "Digital Experiences",
  "UI UX Design",
  "Product Design",
  "React Native",
  "TypeScript",
  "Next.js",
  "JavaScript",
  "Python",
  "GraphQL",
  "Framer Motion",
  "TailwindCSS",
  // Topics
  "Digital Marketing",
  "Human-Centric Design",
  "Mobile-First Design",
  "Responsive Design",
  "JAMstack",
  "Headless CMS",
  "Blockchain",
  "AI-powered Products",
  // Organizations & Products
  "Quivly",
  "Quivly.ai",
  "Quivly AI",
  // Swiggy
  "Swiggy",
  "Swiggy Engineer",
  "Swiggy Instamart",
  "Instamart",
  "Pyng",
  "Pyng by Swiggy",
  "Swiggy Crew",
  "Quick Commerce",
  "Food Delivery",
  "Hyperlocal Delivery",
  // Zenduty & xurrent
  "Zenduty",
  "Zenduty Engineer",
  "xurrent",
  "xurrent Engineer",
  "Incident Management",
  "On-call Management",
  "ITSM",
  "IT Service Management",
  "Alert Management",
  "DevOps Alerting",
  // Microsoft
  "Microsoft",
  "Microsoft Student Ambassador",
  "MLSA",
  "Azure",
  "Microsoft Learn",
  // Others
  "HeroApp",
  "Digital Moshai",
  "Instahomes",
];

export function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.siteUrl}/#person`,
    name: siteConfig.name,
    givenName: siteConfig.firstName,
    familyName: siteConfig.lastName,
    alternateName: [
      "Mukul",
      "Chugh",
      "Digital Mukul",
      "Digital Moshai",
      "Nerd Engineer",
      "themukulchugh",
      "Mukul Chugh Developer",
      "Mukul Chugh Engineer",
    ],
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
    knowsAbout: [
      ...skillsData,
      // Domain Expertise
      "Digital Experiences",
      "Digital Marketing",
      "Software Engineering",
      "Mobile Engineering",
      "Product Design",
      "UI Design",
      "UX Design",
      "UX Research",
      "Front-end Development",
      "Back-end Development",
      "End-to-End Development",
      "Full Stack Development",
      "Mobile App Development",
      "Cross-platform Development",
      "iOS Development",
      "Android Development",
      "Tech",
      "Coding",
      "Programming",
      "Computer Science",
      "AI-powered Products",
      "Startup Development",
      "Product Strategy",
      "Technical Architecture",
      "Agile Methodologies",
      "Developer Relations",
      "OTA Updates",
      "Incident Monitoring",
      "REST API Development",
      "SDK Development",
      "Data Analysis",
      "Prototyping",
      "Human-Centric Design",
      // Additional from Blog
      "React Component Library",
      "React Performance Optimization",
      "JavaScript Debugging",
      "Error Handling",
      "Font Optimization",
      "Scalability",
      "Framer Motion Animation",
      "Mobile-First Design",
      "Responsive Design",
      "Headless CMS",
      "JAMstack",
      // Additional from LinkedIn/GitHub
      "Styled Components",
      "GatsbyJS",
      "Apollo Client",
      "Blockchain",
      "Ethereum",
      "WordPress",
      "Growth Hacking",
      "Content Creation",
      "Graphic Design",
      "Interaction Design",
      "Web Design",
      "Custom Software Development",
      // Company-specific expertise (from Swiggy)
      "Food Delivery Technology",
      "Quick Commerce",
      "Hyperlocal Delivery",
      "Dark Store Operations",
      "Route Optimization",
      "Logistics Optimization",
      "Demand Forecasting",
      "Real-time Tracking",
      "LLM Integration",
      // Company-specific expertise (from Zenduty/xurrent)
      "Incident Management",
      "On-call Management",
      "Alert Management",
      "IT Service Management",
      "ITSM",
      "DevOps Operations",
      "ChatOps",
      "Workflow Automation",
      "SLA Monitoring",
      "Root Cause Analysis",
      // Company-specific expertise (from Microsoft)
      "Azure Cloud",
      "Community Building",
      "Tech Evangelism",
      "Workshop Facilitation",
    ],
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "Product Engineer",
        occupationLocation: {
          "@type": "Country",
          name: "United States",
        },
        skills: "React Native, TypeScript, Next.js, Node.js, Python, AWS, Docker",
      },
      {
        "@type": "Occupation",
        name: "Mobile Engineer",
        occupationLocation: {
          "@type": "Country",
          name: "United States",
        },
        skills: "React Native, iOS, Android, Mobile App Development",
      },
      {
        "@type": "Occupation",
        name: "Full Stack Developer",
        occupationLocation: {
          "@type": "Country",
          name: "United States",
        },
        skills: "React, Next.js, Node.js, GraphQL, MongoDB, PostgreSQL",
      },
    ],
    worksFor: {
      "@type": "Organization",
      "@id": `${siteConfig.siteUrl}/#organization`,
      name: experiencesData[0].company, // Current employer
      url: "https://quivly.ai",
    },
    alumniOf: [
      // Previous employers from experience data
      ...experiencesData.slice(1).map((exp) => ({
        "@type": "Organization",
        name: exp.company,
      })),
      // xurrent (acquired Zenduty)
      {
        "@type": "Organization",
        name: "xurrent",
        description: "Enterprise Service Management platform that acquired Zenduty",
      },
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "Google UX Design Professional Certificate",
        credentialCategory: "Professional Certificate",
        recognizedBy: {
          "@type": "Organization",
          name: "Google",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Complete Web Development Bootcamp",
        credentialCategory: "Certificate",
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.siteUrl}/#website`,
    name: `${siteConfig.name} - Portfolio`,
    alternateName: [
      "Digital Mukul Portfolio",
      "Digital Moshai Portfolio",
      "Mukul Chugh Developer Portfolio",
    ],
    url: siteConfig.siteUrl,
    description: siteConfig.siteDescription,
    keywords: seoKeywords.join(", "),
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
    alternateName: "Digital Mukul - Nerd Engineer Portfolio",
    description: siteConfig.siteDescription,
    keywords: seoKeywords.join(", "),
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
