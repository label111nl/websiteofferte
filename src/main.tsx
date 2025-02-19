import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./router";
import "./index.css";
import App from "./App";

// Initialize router
void (async () => {
  // Wait for the router to be ready
  await router.load();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})();
