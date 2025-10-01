// src/main.tsx
// Entry point that mounts React app into index.html

import "./styles/tailwind.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from "./app/providers/AuthProvider";
import AppRouter from "./app/router"; // import the router we built

// Find the #root element in index.html
const rootElement = document.getElementById("root") as HTMLElement;

// Mount React app into root
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <HeroUIProvider>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </HeroUIProvider>
    </React.StrictMode>
);
