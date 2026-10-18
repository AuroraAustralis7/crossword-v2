import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const cellSize = 30;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
