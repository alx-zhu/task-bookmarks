import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ContentApp from "./ContentApp";
import { ShadowRootProvider } from "@/providers/shadow-root";
import styles from "./index.css?inline";
import { StrictMode } from "react";

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

// Create container with Shadow DOM
const hostElement = document.createElement("div");
hostElement.id = "bookmark-manager-root";
document.body.appendChild(hostElement);

// Attach shadow root
const shadowRoot = hostElement.attachShadow({ mode: "closed" });

// Inject styles into shadow DOM
const styleElement = document.createElement("style");
styleElement.textContent = styles;
shadowRoot.appendChild(styleElement);

// Mount React app directly to shadow root
const root = ReactDOM.createRoot(shadowRoot);
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ShadowRootProvider value={shadowRoot}>
        <ContentApp />
      </ShadowRootProvider>
    </QueryClientProvider>
  </StrictMode>
);

console.log("Bookmark Manager content script loaded with Shadow DOM");
