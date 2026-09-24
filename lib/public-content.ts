import { getPostCoverSrc } from "@/components/blog/post-cover";
import { getAllPosts, getPostServer } from "@/lib/blog";
import {
  aboutContent,
  contactContent,
  experiencesData,
  siteConfig,
  zendutyChapter,
} from "@/lib/data";
import { privacyProviders, privacySections } from "@/lib/privacy";
import { projectArtwork } from "@/lib/project-artwork";
import { projectDetails } from "@/lib/project-details";
import {
  focusPanels,
  overviewBodies,
  overviewTitles,
} from "@/lib/project-editorial";
import {
  getProjectBySlug,
  getVisibleProjects,
  slugifyProjectTitle,
} from "@/lib/projects";
import { absoluteUrl, markdownPath, publicPages, socialImage } from "@/lib/seo";

export function publicDocuments() {
  return [
    ...Object.entries(publicPages).map(([path, page]) => ({
      description: page.description as string,
      heading: page.heading as string,
      image: siteConfig.images.profileImage as string,
      kind: "page",
      path,
      publishedAt: undefined as string | undefined,
      title: page.title,
      updatedAt: undefined as string | undefined,
    })),
    ...getAllPosts().map((post) => ({
      description: post.brief,
      heading: post.title,
      image: getPostCoverSrc(post),
      kind: "article",
      path: `/blog/${post.slug}`,
      publishedAt: post.publishedAt,
      title: post.title,
      updatedAt: post.updatedAt,
    })),
    ...getVisibleProjects().map((project) => {
      const slug = slugifyProjectTitle(project.title);
      return {
        description: project.description,
        heading: project.title,
        image: projectArtwork[slug]?.src ?? `/design/projects/${slug}.png`,
        kind: "project",
        path: `/projects/${slug}`,
        publishedAt: undefined,
        title: project.title,
        updatedAt: undefined,
      };
    }),
  ];
}

export function publicDocument(path: string) {
  return publicDocuments().find((doc) => doc.path === path);
}

const projectList = () =>
  getVisibleProjects()
    .map(
      (project) =>
        `- [${project.title}](${absoluteUrl(`/projects/${slugifyProjectTitle(project.title)}`)}): ${project.description}`
    )
    .join("\n");
const articleList = () =>
  getAllPosts()
    .map(
      (post) =>
        `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}): ${post.brief} (${post.publishedAt.slice(0, 10)})`
    )
    .join("\n");
const history = () =>
  experiencesData
    .map(
      (item) =>
        `## ${item.company}\n\n${item.title} · ${item.date} · ${item.location}\n\n${item.description.map((line) => `- ${line}`).join("\n")}${item.company === zendutyChapter.company ? `\n\n### ${zendutyChapter.currentBrand}, formerly Zenduty\n\n${zendutyChapter.acquisitionPeriod}\n\n${zendutyChapter.acquisitionStory}` : ""}`
    )
    .join("\n\n");

export async function markdownDocument(path: string) {
  const doc = publicDocument(path);
  if (!doc) return null;
  let body = "";
  if (doc.kind === "article") {
    const post = await getPostServer(path.slice("/blog/".length));
    if (!post) return null;
    body = post.content?.markdown ?? "";
  } else if (doc.kind === "project") {
    const slug = path.slice("/projects/".length);
    const project = getProjectBySlug(slug)!;
    const detail = projectDetails[slug];
    body = `${project.description}\n\n## Technology\n\n${project.tags.join(", ")}`;
    if (detail)
      body += `\n\n## ${overviewTitles[slug] ?? detail.heading}\n\n${overviewBodies[slug] ?? detail.problem}\n\n## How it works\n\n${detail.workflow.map((item) => `- ${item}`).join("\n")}\n\n## Implementation\n\n${detail.implementation}\n\n## Scope and boundaries\n\n${detail.boundary}\n\n## Sources\n\n${detail.sources.map((url) => `- <${url}>`).join("\n")}`;
    if (focusPanels[slug])
      body += `\n\n## ${focusPanels[slug].title}\n\n${focusPanels[slug].body}`;
    if (project.github) body += `\n\n[Repository](${project.github})`;
    if (project.demo) body += `\n\n[Project website](${project.demo})`;
  } else {
    switch (path) {
      case "/":
        body = `I’m Mukul, a founding engineer at Quivly. I build useful products across mobile, full-stack, and AI.\n\n${siteConfig.tagline}\n\n## About\n\n${aboutContent.paragraphs.join("\n\n")}\n\n## Projects\n\n${projectList()}\n\n## Writing\n\n${articleList()}\n\n## Experience\n\n${history()}\n\n[Book a short call](https://cal.com/mukulchugh/15min)`;
        break;
      case "/about":
        body = aboutContent.paragraphs.join("\n\n");
        break;
      case "/projects":
        body = projectList();
        break;
      case "/blog":
        body = articleList();
        break;
      case "/experience":
        body = history();
        break;
      case "/contact":
        body = `${contactContent.description}\n\n${contactContent.paragraphs.join("\n\n")}\n\n## 15 minutes.\n\nAn idea is enough.\n\n[Book a short call](https://cal.com/mukulchugh/15min)\n\n[Email ${siteConfig.name}](mailto:${siteConfig.email.recipient})\n\n${Object.entries(
          siteConfig.social
        )
          .map(([name, url]) => `- [${name}](${url})`)
          .join("\n")}`;
        break;
      case "/privacy":
        body =
          privacySections
            .map((section) => `## ${section.title}\n\n${section.body}`)
            .join("\n\n") +
          "\n\n## Service provider policies\n\n" +
          privacyProviders
            .map(([name, url]) => `- [${name}](${url})`)
            .join("\n");
        break;
      default:
        return null;
    }
  }
  const fields = {
    author: siteConfig.name,
    canonical: absoluteUrl(path),
    description: doc.description,
    image: socialImage(path),
    language: "en",
    modified: doc.updatedAt,
    published: doc.publishedAt,
    title: doc.title,
    type: doc.kind,
  };
  const frontmatter = Object.entries(fields)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n");
  return `---\n${frontmatter}\n---\n\n# ${doc.heading}\n\n${body.trim()}\n\n---\n\n[View this page](${absoluteUrl(path)}) · [Site index](${absoluteUrl("/llms.txt")})\n`;
}

export function llmsIndex() {
  return `# ${siteConfig.name}\n\n> ${siteConfig.siteDescription}\n\nPublic portfolio and first-person writing. These links are alternative representations of the same public pages, not additional evidence of results or capabilities. Project artwork is illustrative. Follow each project's scope and source notes.\n\nUse this site to evaluate Mukul’s engineering experience, explore his public projects, read first-person technical explanations, or find a way to discuss a potential collaboration. This portfolio is not a hosted API, MCP server or service endpoint; projects described here may link to their own repositories and documentation.\n\nTo read a page, send GET with Accept: text/markdown to its canonical URL, or follow its .md alternate. Follow the canonical link when citing a page. For missing pages, use the sitemap or this index; do not invent private project details.\n\n## When to use this site\n\n- [Experience](${absoluteUrl("/experience.md")}): Evaluate Mukul’s work history and contributions before discussing a role or collaboration.\n- [Projects](${absoluteUrl("/projects.md")}): Find public tools, source repositories and the stated boundaries of private work.\n- [Writing](${absoluteUrl("/blog.md")}): Read implementation explanations about mobile products, developer tools and AI agents.\n- [Contact](${absoluteUrl("/contact.md")}): Find the public email address and booking link. Only send messages or book time with the user’s permission.\n- [Privacy](${absoluteUrl("/privacy.md")}): Understand this site’s analytics, booking services and browser privacy choices.\n\n## Pages and writing\n\n${publicDocuments()
    .map(
      (doc) =>
        `- [${doc.title}](${absoluteUrl(markdownPath(doc.path))}): ${doc.description}`
    )
    .join(
      "\n"
    )}\n\n## Other formats\n\n- [Sitemap](${absoluteUrl("/sitemap.xml")})\n- [RSS](${absoluteUrl("/blog/rss.xml")})\n- [Complete public text](${absoluteUrl("/llms-full.txt")})\n`;
}
