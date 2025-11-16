import type { Bookmark } from "@/types/tasks";
import { simulateApiCall } from "./client";
import { mockBookmarks } from "@/data/mockData";

const BOOKMARKS_STORAGE_KEY = "bookmark-manager:bookmarks";

const initializeStorage = (): void => {
  if (!localStorage.getItem(BOOKMARKS_STORAGE_KEY)) {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(mockBookmarks));
  }
};

const getBookmarksFromStorage = (): Bookmark[] => {
  initializeStorage();
  const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveBookmarksToStorage = (bookmarks: Bookmark[]): void => {
  localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
};

/**
 * Fetch all bookmarks
 */
export const fetchBookmarks = async (): Promise<Bookmark[]> => {
  const bookmarks = getBookmarksFromStorage();
  return simulateApiCall(bookmarks);
};

/**
 * Create a new bookmark
 */
export const createBookmark = async (
  newBookmark: Omit<Bookmark, "id" | "createdAt" | "lastAccessed">
): Promise<Bookmark> => {
  const bookmarks = getBookmarksFromStorage();

  const id = `bookmark-${Date.now()}`;
  const now = Date.now();

  const bookmark: Bookmark = {
    ...newBookmark,
    id,
    createdAt: now,
    lastAccessed: now,
  };

  const updatedBookmarks = [...bookmarks, bookmark];
  saveBookmarksToStorage(updatedBookmarks);

  return simulateApiCall(bookmark);
};

/**
 * Update a bookmark
 */
export const updateBookmark = async (
  bookmarkId: string,
  updates: Partial<Bookmark>
): Promise<Bookmark> => {
  const bookmarks = getBookmarksFromStorage();

  const updatedBookmarks = bookmarks.map((bookmark) =>
    bookmark.id === bookmarkId ? { ...bookmark, ...updates } : bookmark
  );

  saveBookmarksToStorage(updatedBookmarks);

  const updatedBookmark = updatedBookmarks.find((b) => b.id === bookmarkId);
  if (!updatedBookmark) throw new Error(`Bookmark ${bookmarkId} not found`);

  return simulateApiCall(updatedBookmark);
};

/**
 * Delete a bookmark
 */
export const deleteBookmark = async (bookmarkId: string): Promise<void> => {
  const bookmarks = getBookmarksFromStorage();
  const updatedBookmarks = bookmarks.filter((b) => b.id !== bookmarkId);
  saveBookmarksToStorage(updatedBookmarks);

  return simulateApiCall(undefined);
};

/**
 * Update lastAccessed timestamp when opening a bookmark
 */
export const touchBookmark = async (bookmarkId: string): Promise<void> => {
  await updateBookmark(bookmarkId, { lastAccessed: Date.now() });
};
