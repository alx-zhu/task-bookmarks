import { useEffect, useState } from "react";

export default function ContentApp() {
  const [showSearch, setShowSearch] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log("Keydown event detected:", e.key, e);
      // CMD+K or CTRL+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k" && !e.shiftKey) {
        e.preventDefault();
        console.log("Search overlay triggered (CMD+K)");
        setShowSearch(true);
        setShowAdd(false);
      }

      // CMD+SHIFT+K or CTRL+SHIFT+K
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        (e.key === "k" || e.key === "K")
      ) {
        e.preventDefault();
        console.log("Add overlay triggered (CMD+SHIFT+K)");
        setShowAdd(true);
        setShowSearch(false);
      }

      // ESC to close
      if (e.key === "Escape") {
        console.log("Overlays closed (ESC)");
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

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 999999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "20vh",
      }}
      onClick={() => {
        console.log("Overlay background clicked - closing");
        setShowSearch(false);
        setShowAdd(false);
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          minWidth: "500px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {showSearch && <div>Search Overlay (CMD+K)</div>}
        {showAdd && <div>Add Bookmark Overlay (CMD+SHIFT+K)</div>}
      </div>
    </div>
  );
}
