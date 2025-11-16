import { useEffect, useState } from "react";
import SearchOverlay from "./SearchOverlay";
import AddBookmarkOverlay from "./AddBookmarkOverlay";

export default function ContentApp() {
  const [showSearch, setShowSearch] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // CMD+K or CTRL+K (without shift)
      if ((e.metaKey || e.ctrlKey) && key === "k" && !e.shiftKey) {
        e.preventDefault();
        setShowSearch(true);
        setShowAdd(false);
      }

      // CMD+SHIFT+K or CTRL+SHIFT+K
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && key === "k") {
        e.preventDefault();
        setShowAdd(true);
        setShowSearch(false);
      }

      // ESC to close
      if (e.key === "Escape") {
        setShowSearch(false);
        setShowAdd(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!showSearch && !showAdd) {
    return null;
  }

  const handleClose = () => {
    setShowSearch(false);
    setShowAdd(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-999999 flex items-start justify-center pt-[15vh] px-5"
      onClick={handleClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {showSearch && <SearchOverlay onClose={handleClose} />}
        {showAdd && <AddBookmarkOverlay onClose={handleClose} />}
      </div>
    </div>
  );
}
