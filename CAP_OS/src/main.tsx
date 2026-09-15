
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // CAP OS browser entry point.
  // Flow: Vite loads index.html -> this file mounts App -> App's screens read
  // their API base URL from VITE_API_URL.  Vite injects that value from .env at
  // startup/build time; it currently points to the LabQMS FastAPI API on 5003.
  // Global stylesheet imports belong here so every CAP OS screen shares them.
  createRoot(document.getElementById("root")!).render(<App />);
  
