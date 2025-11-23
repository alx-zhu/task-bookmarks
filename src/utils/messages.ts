import type {
  IframeToContentMessage,
  ContentToIframeMessage,
} from "@/types/messages";

// Helper to send typed messages to parent
export const messageToParent = (message: IframeToContentMessage) => {
  window.parent.postMessage(message, "*");
};

export const messageToIframe = (
  iframe: HTMLIFrameElement,
  message: ContentToIframeMessage
) => {
  iframe.contentWindow?.postMessage(message, "*");
};
