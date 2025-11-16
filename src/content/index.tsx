import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ContentApp from "./ContentApp";
import "./content.css";

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

// Create a container for our React app
const container = document.createElement("div");
container.id = "bookmark-manager-root";
document.body.appendChild(container);

// Mount React app
const root = ReactDOM.createRoot(container);
root.render(
  <QueryClientProvider client={queryClient}>
    <ContentApp />
  </QueryClientProvider>
);

console.log("Bookmark Manager content script loaded");
