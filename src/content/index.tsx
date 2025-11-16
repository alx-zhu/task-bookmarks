import ReactDOM from "react-dom/client";
import ContentApp from "./ContentApp";
import "./content.css";

// Create a container for our React app
const container = document.createElement("div");
container.id = "bookmark-manager-root";
document.body.appendChild(container);

// Mount React app
const root = ReactDOM.createRoot(container);
root.render(<ContentApp />);

console.log("Bookmark Manager content script loaded");
