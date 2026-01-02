import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data";

const HASHNODE_GQL_ENDPOINT = "https://gql.hashnode.com";
const HASHNODE_HOST = "mukulchugh.hashnode.dev";

// Minimal type for sitemap
interface SitemapPost {
  slug: string;
  publishedAt: string;
}

async function getBlogPosts(): Promise<SitemapPost[]> {
  try {
    const response = await fetch(HASHNODE_GQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query Publication($host: String) {
            publication(host: $host) {
              posts(first: 20) {
                edges {
                  node {
                    id
                    slug
                    publishedAt
                  }
                }
              }
            }
          }
        `,
        variables: { host: HASHNODE_HOST },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error("Sitemap: Hashnode API returned", response.status);
      return [];
    }

    const json = await response.json();

    if (json.errors) {
      console.error("Sitemap: GraphQL errors", json.errors);
      return [];
    }

    return json.data.publication.posts.edges.map(
      (edge: { node: SitemapPost }) => edge.node
    );
  } catch (error) {
    console.error("Sitemap: Error fetching posts", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.siteUrl;

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Dynamic blog post routes
  const posts = await getBlogPosts();

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes];
}
