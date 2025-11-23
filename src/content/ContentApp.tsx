import { useEffect, useState } from "react";
import SearchOverlay from "./SearchOverlay";
import AddBookmarkOverlay from "./AddBookmarkOverlay";
import type { PageInfo } from "@/types/messages";
import { isContentToIframeMessage } from "@/types/messages";
import { messageToParent } from "@/utils/messages";

export default function ContentApp() {
  const [showSearch, setShowSearch] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  useEffect(() => {
    // Make iframe body transparent so host page shows through
    document.body.style.backgroundColor = "transparent";

    // Listen for messages from parent (content script)
    const handleMessage = (event: MessageEvent<unknown>) => {
      // Type guard the message
      if (!isContentToIframeMessage(event.data)) return;

      const message = event.data;

      switch (message.type) {
        case "OPEN_SEARCH":
          setShowSearch(true);
          setShowAdd(false);
          setPageInfo(message.pageInfo);
          break;
        case "OPEN_ADD":
          setShowAdd(true);
          setShowSearch(false);
          setPageInfo(message.pageInfo);
          break;
        case "CLOSE":
          setShowSearch(false);
          setShowAdd(false);
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleClose = () => {
    setShowSearch(false);
    setShowAdd(false);
    // Notify parent to hide overlay
    messageToParent({ type: "CLOSE_OVERLAY" });
  };

  return (
    <>
      <SearchOverlay open={showSearch} onClose={handleClose} />
      <AddBookmarkOverlay
        open={showAdd}
        onClose={handleClose}
        pageInfo={pageInfo}
      />
    </>
  );
}
