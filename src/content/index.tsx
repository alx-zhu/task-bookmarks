import type { ContentToIframeMessage } from "@/types/messages";
import { isIframeToContentMessage } from "@/types/messages";

// Create iframe for complete style isolation
const iframe = document.createElement("iframe");
iframe.id = "bookmark-manager-iframe";
const extensionOrigin = chrome.runtime.getURL("").slice(0, -1); // Remove trailing slash
iframe.allow = `clipboard-write self ${extensionOrigin}`;
iframe.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  z-index: 2147483647;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
  color-scheme: light;
`;

// Load the iframe content from extension
iframe.src = chrome.runtime.getURL("iframe.html");
document.body.appendChild(iframe);

// Track visibility state
let isVisible = false;

// Show/hide functions
function showOverlay() {
  iframe.style.pointerEvents = "auto";
  iframe.style.opacity = "1";
  isVisible = true;
}

function hideOverlay() {
  iframe.style.pointerEvents = "none";
  iframe.style.opacity = "0";
  isVisible = false;
}

// Get current page info
function getPageInfo() {
  return {
    url: window.location.href,
    title: document.title,
  };
}

// Helper to send typed messages to iframe
function sendToIframe(message: ContentToIframeMessage) {
  iframe.contentWindow?.postMessage(message, "*");
}

// Listen for keyboard shortcuts
document.addEventListener("keydown", (e: KeyboardEvent) => {
  const key = e.key.toLowerCase();

  // CMD+K or CTRL+K (search)
  if ((e.metaKey || e.ctrlKey) && key === "k" && !e.shiftKey) {
    e.preventDefault();
    showOverlay();
    sendToIframe({ type: "OPEN_SEARCH", pageInfo: getPageInfo() });
  }

  // CMD+SHIFT+K or CTRL+SHIFT+K (quick add)
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && key === "k") {
    e.preventDefault();
    showOverlay();
    sendToIframe({ type: "OPEN_ADD", pageInfo: getPageInfo() });
  }

  // ESC to close (only if visible)
  if (e.key === "Escape" && isVisible) {
    hideOverlay();
    sendToIframe({ type: "CLOSE" });
  }
});

// Listen for close messages from iframe
window.addEventListener("message", (event: MessageEvent<unknown>) => {
  // Verify message is from our iframe
  if (event.source !== iframe.contentWindow) return;

  // Type guard the message
  if (!isIframeToContentMessage(event.data)) return;

  if (event.data.type === "CLOSE_OVERLAY") {
    hideOverlay();
  }
});

console.log("Bookmark Manager content script loaded");
