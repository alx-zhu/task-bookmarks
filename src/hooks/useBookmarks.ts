import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Bookmark } from "@/types/tasks";
import * as bookmarksApi from "@/api/bookmarks.api";

export const bookmarkKeys = {
  all: ["bookmarks"] as const,
  lists: () => [...bookmarkKeys.all, "list"] as const,
};

/**
 * Fetch all bookmarks
 */
export const useBookmarks = () => {
  return useQuery({
    queryKey: bookmarkKeys.lists(),
    queryFn: bookmarksApi.fetchBookmarks,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Create a new bookmark
 */
export const useCreateBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookmarksApi.createBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
    },
  });
};

/**
 * Update a bookmark
 */
export const useUpdateBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookmarkId,
      updates,
    }: {
      bookmarkId: string;
      updates: Partial<Bookmark>;
    }) => bookmarksApi.updateBookmark(bookmarkId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
    },
  });
};

/**
 * Delete a bookmark
 */
export const useDeleteBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookmarksApi.deleteBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
    },
  });
};

/**
 * Touch a bookmark (update lastAccessed)
 */
export const useTouchBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookmarksApi.touchBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
    },
  });
};
