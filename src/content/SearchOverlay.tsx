import { useState, useRef, useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useBookmarks, useTouchBookmark } from "@/hooks/useBookmarks";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const { data: bookmarks = [] } = useBookmarks();
  const touchBookmark = useTouchBookmark();
  const [search, setSearch] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  // Custom filtering
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      bookmark.title.toLowerCase().includes(searchLower) ||
      bookmark.note?.toLowerCase().includes(searchLower) ||
      bookmark.taskName.toLowerCase().includes(searchLower)
    );
  });

  // Reset scroll to top whenever search changes or filtered results change
  useEffect(() => {
    // Use RAF to ensure DOM has updated with new content
    const rafId = requestAnimationFrame(() => {
      if (listRef.current) {
        listRef.current.scrollTop = 0;
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [search, filteredBookmarks.length]);

  const handleResultClick = (bookmarkId: string, url: string) => {
    // Update lastAccessed timestamp
    touchBookmark.mutate(bookmarkId);

    // Open in new tab
    window.open(url, "_blank");
    onClose();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onClose}
      title="Search Bookmarks"
      description="Search through your saved bookmarks"
      shouldFilter={false}
    >
      <CommandInput
        placeholder="Search bookmarks..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList ref={listRef}>
        <CommandEmpty>
          {bookmarks.length === 0
            ? "No bookmarks yet. Press CMD+SHIFT+K to add one!"
            : "No results found"}
        </CommandEmpty>
        {filteredBookmarks.map((bookmark) => (
          <CommandItem
            key={bookmark.id}
            onSelect={() => handleResultClick(bookmark.id, bookmark.url)}
          >
            <div className="flex flex-col items-start gap-1 p-2 w-full">
              <div className="font-medium leading-snug">{bookmark.title}</div>
              {bookmark.note && (
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {bookmark.note}
                </div>
              )}
              <div className="flex items-center justify-between w-full mt-1">
                <Badge variant="outline" className="text-muted-foreground">
                  {bookmark.taskName}
                </Badge>
              </div>
            </div>
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
