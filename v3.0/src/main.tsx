import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <header>
      <title>Stuyspec Crossword Demo</title>
      <link rel="icon" type="image/x-icon" href="public\crossword.ico"></link>
    </header>
    <App />
  </StrictMode>,
);
