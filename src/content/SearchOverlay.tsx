import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  // Mock data for now
  const mockResults = [
    {
      id: "1",
      title: "Use The Index, Luke - Database Indexing Explained",
      note: "Explains B-tree vs hash indexes and when to use each",
      taskName: "Database optimization",
      url: "https://use-the-index-luke.com",
    },
    {
      id: "2",
      title: "PostgreSQL Documentation - Index Types",
      note: "Official comparison of different index strategies",
      taskName: "Database optimization",
      url: "https://postgresql.org/docs",
    },
    {
      id: "3",
      title: "High Performance PostgreSQL",
      note: "Advanced indexing patterns for complex queries",
      taskName: "Backend performance",
      url: "https://example.com",
    },
  ];

  const handleResultClick = (url: string) => {
    window.open(url, "_blank");
    onClose();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onClose}
      title="Search Bookmarks"
      description="Search through your saved bookmarks"
      className="backdrop-blur-xl"
    >
      <CommandInput placeholder="Search bookmarks..." />
      <CommandList>
        <CommandEmpty>Start typing to search your bookmarks</CommandEmpty>
        {mockResults.map((result) => (
          <CommandItem
            key={result.id}
            onSelect={() => handleResultClick(result.url)}
          >
            <div className="flex flex-col items-start gap-1 p-2 w-full">
              <div className="font-medium leading-snug">{result.title}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {result.note}
              </div>
              <div className="flex items-center justify-between w-full mt-1">
                <Badge variant="outline" className="text-muted-foreground">
                  {result.taskName}
                </Badge>
                <CommandShortcut>↵</CommandShortcut>
              </div>
            </div>
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
