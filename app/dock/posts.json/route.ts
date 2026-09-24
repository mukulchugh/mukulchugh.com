import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

export function GET() {
  return Response.json(getAllPosts(), {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=3600",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}
