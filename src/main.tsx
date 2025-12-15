import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { AppRouter } from "./router/AppRouter";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AppRouter />
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "8px",
        },
        success: {
          iconTheme: {
            primary: "#dcb300",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  </BrowserRouter>
);
