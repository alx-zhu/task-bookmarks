import { useEffect, useState } from "react";
import SearchOverlay from "./SearchOverlay";
import AddBookmarkOverlay from "./AddBookmarkOverlay";

export default function ContentApp() {
  const [showSearch, setShowSearch] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if ((e.metaKey || e.ctrlKey) && key === "k" && !e.shiftKey) {
        e.preventDefault();
        setShowSearch(true);
        setShowAdd(false);
      }

      if ((e.metaKey || e.ctrlKey) && e.shiftKey && key === "k") {
        e.preventDefault();
        setShowAdd(true);
        setShowSearch(false);
      }

      if (e.key === "Escape") {
        setShowSearch(false);
        setShowAdd(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClose = () => {
    setShowSearch(false);
    setShowAdd(false);
  };

  return (
    <>
      <SearchOverlay open={showSearch} onClose={handleClose} />
      <AddBookmarkOverlay open={showAdd} onClose={handleClose} />
    </>
  );
}
