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
    >
      <CommandInput placeholder="Search bookmarks..." />
      <CommandList>
        <CommandEmpty>
          {bookmarks.length === 0
            ? "No bookmarks yet. Press CMD+SHIFT+K to add one!"
            : "No results found"}
        </CommandEmpty>
        {bookmarks.map((bookmark) => (
          <CommandItem
            key={bookmark.id}
            onSelect={() => handleResultClick(bookmark.id, bookmark.url)}
            keywords={[bookmark.title, bookmark.note, bookmark.taskName]}
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
