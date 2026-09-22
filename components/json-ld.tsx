import {
  experiencesData,
  hiddenProjectTitles,
  projectsData,
  siteConfig,
  skillsData,
} from "@/lib/data";

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
  "Staff Engineer",
  "Principal Engineer",
  "Tech Lead",
  "CTO",
  "T-Shaped Engineer",
  "Product-Minded Engineer",
  // Skills & Technologies
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
  "System Design",
  "Microservices",
  "Cloud Architecture",
  "DevOps",
  "CI/CD",
  "API Design",
  // Topics
  "Digital Marketing",
  "Human-Centric Design",
  "Mobile-First Design",
  "Responsive Design",
  "JAMstack",
  "Headless CMS",
  "Blockchain",
  "AI-powered Products",
  "MVP Development",
  "SaaS Development",
  "Scalability",
  "Performance Optimization",
  "Technical Leadership",
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
  // Developer Tools
  "Vercel",
  "GitHub",
  "Supabase",
  "Storybook",
  "Design System",
];

export function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@id": `${siteConfig.siteUrl}/#person`,
    "@type": "Person",
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
    alumniOf: [
      // Previous employers from experience data
      ...experiencesData.slice(1).map((exp) => ({
        "@type": "Organization",
        name: exp.company,
      })),
      // xurrent (acquired Zenduty)
      {
        "@type": "Organization",
        description:
          "Enterprise Service Management platform that acquired Zenduty",
        name: "xurrent",
      },
    ],
    description: siteConfig.siteDescription,
    email: siteConfig.email.display,
    familyName: siteConfig.lastName,
    givenName: siteConfig.firstName,
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Professional Certificate",
        name: "Google UX Design Professional Certificate",
        recognizedBy: {
          "@type": "Organization",
          name: "Google",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Certificate",
        name: "Complete Web Development Bootcamp",
      },
    ],
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "Product Engineer",
        occupationLocation: {
          "@type": "Country",
          name: "United States",
        },
        skills:
          "React Native, TypeScript, Next.js, Node.js, Python, AWS, Docker",
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
      {
        "@type": "Occupation",
        name: "Founding Engineer",
        occupationLocation: {
          "@type": "Country",
          name: "United States",
        },
        skills:
          "MVP Development, System Design, Technical Architecture, Full Stack Development",
      },
      {
        "@type": "Occupation",
        name: "Staff Engineer",
        occupationLocation: {
          "@type": "Country",
          name: "United States",
        },
        skills:
          "Technical Leadership, System Design, Architecture, Mentoring, Cross-team Collaboration",
      },
      {
        "@type": "Occupation",
        name: "Tech Lead",
        occupationLocation: {
          "@type": "Country",
          name: "United States",
        },
        skills:
          "Technical Leadership, Code Review, Architecture Decision, Team Management",
      },
    ],
    image: {
      "@type": "ImageObject",
      caption: siteConfig.name,
      url: siteConfig.images.profileImage,
    },
    jobTitle: siteConfig.title,
    knowsAbout: [
      ...skillsData,
      ...projectsData
        .filter(({ title }) => hiddenProjectTitles.has(title))
        .flatMap(({ title, tags }) => [title, ...tags]),
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
      // Deep Research Keywords (2025)
      // System Design & Architecture
      "System Design",
      "Software Architecture",
      "Microservices Architecture",
      "Event-Driven Architecture",
      "Distributed Systems",
      "Cloud Architecture",
      "Serverless Architecture",
      "Kubernetes",
      "Docker",
      "Container Orchestration",
      // DevOps & CI/CD
      "DevOps",
      "CI/CD",
      "Continuous Integration",
      "Continuous Deployment",
      "GitOps",
      "Infrastructure as Code",
      "DevSecOps",
      "Pipeline Automation",
      // API & Performance
      "API Design",
      "REST API Design",
      "GraphQL API",
      "Performance Optimization",
      "React Native Performance",
      "Web Performance",
      "Core Web Vitals",
      // Leadership & Strategy
      "Technical Leadership",
      "Engineering Leadership",
      "Technical Strategy",
      "Architecture Decision",
      "Team Scaling",
      // Startup & Product
      "MVP Development",
      "SaaS Development",
      "Product-Market Fit",
      "Lean Startup",
      "Rapid Prototyping",
      // Modern Tools
      "Vercel",
      "Supabase",
      "GitHub Actions",
      "Storybook",
      "Design System",
      "AI Coding Assistant",
    ],
    name: siteConfig.name,
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
      siteConfig.social.blog,
    ],
    url: siteConfig.siteUrl,
    workLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "US",
        addressLocality: "San Francisco",
        addressRegion: "CA",
      },
    },
    worksFor: {
      "@id": `${siteConfig.siteUrl}/#organization`,
      "@type": "Organization",
      name: experiencesData[0].company, // Current employer
      url: "https://quivly.ai",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@id": `${siteConfig.siteUrl}/#website`,
    "@type": "WebSite",
    alternateName: [
      "Digital Mukul Portfolio",
      "Digital Moshai Portfolio",
      "Mukul Chugh Developer Portfolio",
    ],
    author: {
      "@id": `${siteConfig.siteUrl}/#person`,
    },
    description: siteConfig.siteDescription,
    inLanguage: "en-US",
    keywords: seoKeywords.join(", "),
    name: `${siteConfig.name} - Portfolio`,
    potentialAction: {
      "@type": "SearchAction",
      "query-input": "required name=search_term_string",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.siteUrl}/blog?q={search_term_string}`,
      },
    },
    publisher: {
      "@id": `${siteConfig.siteUrl}/#person`,
    },
    url: siteConfig.siteUrl,
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@id": siteConfig.siteUrl,
    "@type": "ProfilePage",
    about: {
      "@id": `${siteConfig.siteUrl}/#person`,
    },
    alternateName: "Digital Mukul - Nerd Engineer Portfolio",
    description: siteConfig.siteDescription,
    inLanguage: "en-US",
    isPartOf: {
      "@id": `${siteConfig.siteUrl}/#website`,
    },
    keywords: seoKeywords.join(", "),
    mainEntity: {
      "@id": `${siteConfig.siteUrl}/#person`,
    },
    name: `${siteConfig.name} - ${siteConfig.title}`,
    url: siteConfig.siteUrl,
  };

  // Organization schema for current employer
  const organizationSchema = {
    "@context": "https://schema.org",
    "@id": `${siteConfig.siteUrl}/#organization`,
    "@type": "Organization",
    description: "AI-powered product platform",
    employee: {
      "@id": `${siteConfig.siteUrl}/#person`,
    },
    logo: experiencesData[0].icon,
    name: experiencesData[0].company,
    url: "https://quivly.ai",
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profilePageSchema).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
    </>
  );
}
