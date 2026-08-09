"use client";

import { IconArrowRight, IconClock } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Post } from "@/lib/blog";

interface Card {
  id: number;
  post: Post;
}

const positionStyles = [
  { scale: 1, y: 12 },
  { scale: 0.95, y: -16 },
  { scale: 0.9, y: -44 },
];

const exitAnimation = {
  scale: 1,
  y: 340,
  zIndex: 10,
};

const enterAnimation = {
  scale: 0.9,
  y: -16,
};

function CardContent({ post }: { post: Post }) {
  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div className="-outline-offset-1 flex h-[160px] w-full items-center justify-center overflow-hidden rounded-xl outline outline-black/10 dark:outline-white/10">
        {post.coverImage?.url ? (
          <Image
            alt={post.title}
            className="h-full w-full select-none object-cover"
            height={160}
            src={post.coverImage.url}
            width={400}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-900 flex items-center justify-center">
            <span className="text-white text-lg font-bold text-center px-4 line-clamp-2">
              {post.title}
            </span>
          </div>
        )}
      </div>
      <div className="flex w-full flex-col gap-2 px-2 pb-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <IconClock className="h-3 w-3" />
          <span>{post.readTimeInMinutes} min read</span>
          {post.tags?.[0] && (
            <>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
                {post.tags[0].name}
              </span>
            </>
          )}
        </div>
        <span className="font-medium text-foreground line-clamp-2 text-sm">
          {post.title}
        </span>
        <span className="text-xs text-muted-foreground line-clamp-2">
          {post.brief}
        </span>
        <Link
          aria-label={`Read article: ${post.title}`}
          className="mt-1 flex w-fit items-center gap-1 text-xs font-medium text-foreground/70 hover:text-foreground transition-colors"
          href={`/blog/${post.slug}`}
        >
          Read article
          <IconArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

function AnimatedCard({
  card,
  index,
  isAnimating,
}: {
  card: Card;
  index: number;
  isAnimating: boolean;
}) {
  const { scale, y } = positionStyles[index] ?? positionStyles[2];
  const zIndex = index === 0 && isAnimating ? 10 : 3 - index;

  const exitAnim = index === 0 ? exitAnimation : undefined;
  const initialAnim = index === 2 ? enterAnimation : undefined;

  return (
    <motion.div
      animate={{ scale, y }}
      className="absolute flex h-[320px] w-[280px] items-center justify-center overflow-hidden rounded-t-xl border-x border-t border-border bg-card p-1.5 shadow-lg will-change-transform sm:w-[320px]"
      exit={exitAnim}
      initial={initialAnim}
      key={card.id}
      style={{
        bottom: 0,
        left: "50%",
        x: "-50%",
        zIndex,
      }}
      transition={{
        bounce: 0,
        duration: 1,
        type: "spring",
      }}
    >
      <CardContent post={card.post} />
    </motion.div>
  );
}

interface AnimatedCardStackProps {
  posts: Post[];
}

export default function AnimatedCardStack({ posts }: AnimatedCardStackProps) {
  const initialCards: Card[] = posts.slice(0, 3).map((post, index) => ({
    id: index + 1,
    post,
  }));

  const [cards, setCards] = useState(initialCards);
  const [isAnimating, setIsAnimating] = useState(false);
  const [nextId, setNextId] = useState(4);
  const [currentPostIndex, setCurrentPostIndex] = useState(2);

  const handleAnimate = () => {
    if (posts.length < 3) {
      return;
    }

    setIsAnimating(true);

    const nextPostIndex = (currentPostIndex + 1) % posts.length;
    const nextPost = posts[nextPostIndex];

    setCards([...cards.slice(1), { id: nextId, post: nextPost }]);
    setNextId((prev) => prev + 1);
    setCurrentPostIndex(nextPostIndex);
    setIsAnimating(false);
  };

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-[380px] text-muted-foreground">
        No blog posts available
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center pt-2">
      <div className="relative h-[380px] w-full overflow-hidden">
        <AnimatePresence initial={false}>
          {cards.slice(0, 3).map((card, index) => (
            <AnimatedCard
              card={card}
              index={index}
              isAnimating={isAnimating}
              key={card.id}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="relative z-10 -mt-px flex w-full items-center justify-center border-t border-border py-4">
        <Button
          className="gap-1"
          onClick={handleAnimate}
          size="sm"
          variant="outline"
        >
          Next Post
          <IconArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
