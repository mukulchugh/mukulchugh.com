import { markdownDocument } from "@/lib/public-content";
import { absoluteUrl } from "@/lib/seo";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const parts = (await params).path ?? [];
  const path =
    !parts.length || (parts.length === 1 && parts[0] === "index")
      ? "/"
      : `/${parts.join("/")}`;
  const content = await markdownDocument(path);
  if (!content)
    return new Response(
      `# Page not found\n\nThis page does not exist or has moved. Find a public page in the [site index](${absoluteUrl("/llms.txt")}), [sitemap](${absoluteUrl("/sitemap.xml")}), or [writing index](${absoluteUrl("/blog.md")}).\n`,
      {
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "text/markdown; charset=utf-8",
          Vary: "Accept, Accept-Encoding",
          "X-Content-Type-Options": "nosniff",
          "X-Robots-Tag": "noindex",
        },
        status: 404,
      }
    );
  return new Response(content, {
    headers: {
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "text/markdown; charset=utf-8",
      Link: `<${absoluteUrl(path)}>; rel="canonical"`,
      Vary: "Accept, Accept-Encoding",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
