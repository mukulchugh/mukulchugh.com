import { markdownDocument, publicDocuments } from "@/lib/public-content";
export const dynamic = "force-static";
export async function GET() {
  const pages = await Promise.all(
    publicDocuments().map((doc) => markdownDocument(doc.path))
  );
  return new Response(pages.join("\n\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
