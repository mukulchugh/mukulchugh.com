import Image from "next/image";
import type { Post } from "@/lib/blog";
import { cn } from "@/lib/utils";

export const refinedArticleSlugs = new Set([
  "agent-stuck-detection-tool-loops",
  "agent-suggested-actions-as-tools",
  "agent-working-memory-injection-hygiene",
  "brik-react-to-native-widgets",
  "checkpointing-agent-edits-without-touching-git-index",
  "ferry-apple-watch-mac-mic",
  "human-in-the-loop-agent-plans",
  "mcp-gateway-for-team-tools",
  "mobile-lessons-from-swiggy-scale",
  "openkvm-one-keyboard-two-macs",
  "phased-agent-turns-gather-analyze-synthesize",
  "progressive-tool-results-transcript-chunks",
  "quivly-skills-agent-expertise",
  "self-hosted-personal-agent-fleet",
  "skip-your-own-api-when-you-own-the-database",
]);

export function getPostCoverSrc(post: Pick<Post, "slug" | "coverImage">) {
  return (
    post.coverImage?.url ||
    `/design/articles/${post.slug}${refinedArticleSlugs.has(post.slug) ? "-reference" : ""}.png`
  );
}

interface PostCoverProps {
  className?: string;
  hero?: boolean;
  interactive?: boolean;
  post: Post;
  priority?: boolean;
  src?: string;
}

export function PostCover({
  post,
  priority = false,
  className,
  hero = false,
  interactive = false,
  src,
}: PostCoverProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-[14px] bg-[#101112]",
        hero ? "aspect-[16/7]" : "aspect-video",
        className
      )}
    >
      <Image
        alt=""
        className={cn(
          "object-cover",
          interactive &&
            "transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
        )}
        fill
        preload={priority}
        sizes={
          hero
            ? "(max-width: 768px) 100vw, 1400px"
            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 460px"
        }
        src={src || getPostCoverSrc(post)}
      />
    </div>
  );
}
