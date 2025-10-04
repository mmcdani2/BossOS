// src/main.tsx
import "./styles/tailwind.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from "./app/providers/AuthProvider";
import AppRouter from "./app/router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <div className="min-h-screen bg-background text-foreground">
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </div>
    </HeroUIProvider>
  </React.StrictMode>
);
