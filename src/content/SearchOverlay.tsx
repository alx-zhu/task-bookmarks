import { useState } from "react";
import { Input } from "@/components/ui/input";

interface SearchOverlayProps {
  onClose: () => void;
}

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");

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

  const filteredResults = query
    ? mockResults.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.note.toLowerCase().includes(query.toLowerCase()) ||
          r.taskName.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleResultClick = (url: string) => {
    window.open(url, "_blank");
    onClose();
  };

  return (
    <div className="w-full max-w-[640px] bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden">
      <Input
        type="text"
        placeholder="Search bookmarks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border-0 border-b border-border rounded-none px-6 py-5 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
        autoFocus
      />

      {query === "" ? (
        <div className="py-16 px-6 text-center text-muted-foreground text-sm">
          Start typing to search your bookmarks
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="py-16 px-6 text-center text-muted-foreground text-sm">
          No bookmarks found
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto">
          {filteredResults.map((result) => (
            <div
              key={result.id}
              onClick={() => handleResultClick(result.url)}
              className="py-3.5 px-6 border-b border-border/50 last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="text-sm font-medium text-foreground mb-1">
                {result.title}
              </div>
              <div className="text-[13px] text-muted-foreground leading-relaxed">
                {result.note}
              </div>
              <span className="inline-block mt-1.5 bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground">
                {result.taskName}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="py-3 px-6 bg-muted/50 border-t border-border text-xs text-muted-foreground flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <kbd className="bg-muted px-1.5 py-0.5 rounded font-mono text-[11px]">
              ↵
            </kbd>
            <span>Open</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="bg-muted px-1.5 py-0.5 rounded font-mono text-[11px]">
              Esc
            </kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
