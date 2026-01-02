import { HASHNODE_HOST } from "@/lib/hashnode";
import { redirect } from "next/navigation";

// Redirect to Hashnode's native RSS feed
export async function GET() {
  redirect(`https://${HASHNODE_HOST}/rss.xml`);
}
