import type { Post, PageInfo, PostsResponse } from "./types/index";

const HASHNODE_GQL_ENDPOINT = "https://gql.hashnode.com";
export const HASHNODE_HOST = process.env.NEXT_PUBLIC_HASHNODE_HOST || "mukulchugh.hashnode.dev";

// Re-export types for backwards compatibility
export type { Post, PageInfo, PostsResponse } from "./types/index";

// GraphQL Queries
export const GET_POSTS_QUERY = `
  query GetPosts($host: String!, $first: Int!, $after: String) {
    publication(host: $host) {
      posts(first: $first, after: $after) {
        edges {
          node {
            id
            title
            slug
            brief
            publishedAt
            readTimeInMinutes
            coverImage {
              url
            }
            tags {
              name
              slug
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

export const GET_POST_QUERY = `
  query GetPost($host: String!, $slug: String!) {
    publication(host: $host) {
      post(slug: $slug) {
        id
        title
        slug
        brief
        content {
          html
          markdown
        }
        publishedAt
        readTimeInMinutes
        coverImage {
          url
        }
        author {
          name
          profilePicture
        }
        tags {
          name
          slug
        }
        seo {
          title
          description
        }
      }
    }
  }
`;

// Base fetch function for GraphQL
async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const response = await fetch(HASHNODE_GQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Hashnode API error: ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message || "GraphQL error");
  }

  return json.data;
}

// Query functions for TanStack Query
export async function fetchPosts(first: number = 10, after?: string): Promise<PostsResponse> {
  const data = await fetchGraphQL<{
    publication: {
      posts: {
        edges: Array<{ node: Post }>;
        pageInfo: PageInfo;
      };
    };
  }>(GET_POSTS_QUERY, { host: HASHNODE_HOST, first, after });

  return {
    posts: data.publication.posts.edges.map((edge) => edge.node),
    pageInfo: data.publication.posts.pageInfo,
  };
}

export async function fetchPost(slug: string): Promise<Post | null> {
  const data = await fetchGraphQL<{
    publication: {
      post: Post | null;
    };
  }>(GET_POST_QUERY, { host: HASHNODE_HOST, slug });

  return data.publication.post;
}

// Query keys for TanStack Query
export const queryKeys = {
  posts: (cursor?: string) => ["posts", cursor] as const,
  post: (slug: string) => ["post", slug] as const,
  allPosts: ["posts"] as const,
};

// Server-side fetch with Next.js caching (for SSR/SSG)
export async function getPostsServer(first: number = 10, after?: string): Promise<PostsResponse> {
  const response = await fetch(HASHNODE_GQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_POSTS_QUERY,
      variables: { host: HASHNODE_HOST, first, after },
    }),
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Hashnode API error: ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message || "GraphQL error");
  }

  return {
    posts: json.data.publication.posts.edges.map((edge: { node: Post }) => edge.node),
    pageInfo: json.data.publication.posts.pageInfo,
  };
}

export async function getPostServer(slug: string): Promise<Post | null> {
  const response = await fetch(HASHNODE_GQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_POST_QUERY,
      variables: { host: HASHNODE_HOST, slug },
    }),
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Hashnode API error: ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message || "GraphQL error");
  }

  return json.data.publication.post;
}
