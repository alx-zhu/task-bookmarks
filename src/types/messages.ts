// Messages sent from content script to iframe
export type ContentToIframeMessage =
  | {
      type: "OPEN_SEARCH";
      pageInfo: PageInfo;
    }
  | {
      type: "OPEN_ADD";
      pageInfo: PageInfo;
    }
  | {
      type: "CLOSE";
    };

// Messages sent from iframe to content script
export type IframeToContentMessage = {
  type: "CLOSE_OVERLAY";
};

export interface PageInfo {
  url: string;
  title: string;
}

// Runtime validator for PageInfo
function isPageInfo(data: unknown): data is PageInfo {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.url === "string" && typeof obj.title === "string";
}

// Type guard to check if message is from our extension
export function isContentToIframeMessage(
  data: unknown
): data is ContentToIframeMessage {
  if (!data || typeof data !== "object") return false;
  const msg = data as { type?: string; pageInfo?: unknown };

  switch (msg.type) {
    case "OPEN_SEARCH":
    case "OPEN_ADD":
      // These messages require valid pageInfo
      return isPageInfo(msg.pageInfo);
    case "CLOSE":
      // CLOSE message doesn't have pageInfo
      return true;
    default:
      return false;
  }
}

export function isIframeToContentMessage(
  data: unknown
): data is IframeToContentMessage {
  if (!data || typeof data !== "object") return false;
  const msg = data as { type?: string };
  return msg.type === "CLOSE_OVERLAY";
}
