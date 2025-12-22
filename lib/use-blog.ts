"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts, fetchPost, queryKeys, type PostsResponse } from "./hashnode";

// Hook for fetching paginated posts with infinite scroll support
export function usePosts(initialData?: PostsResponse) {
  return useInfiniteQuery({
    queryKey: queryKeys.allPosts,
    queryFn: ({ pageParam }) => fetchPosts(10, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching a single post
export function usePost(slug: string, initialData?: Awaited<ReturnType<typeof fetchPost>>) {
  return useQuery({
    queryKey: queryKeys.post(slug),
    queryFn: () => fetchPost(slug),
    initialData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!slug,
  });
}
