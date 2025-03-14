import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

// Performance optimization: Disable React.StrictMode in production
// This prevents double rendering which can impact performance
const AppWithRouter =
  process.env.NODE_ENV === "production" ? (
    <ThemeProvider defaultTheme="light">
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  ) : (
    <React.StrictMode>
      <ThemeProvider defaultTheme="light">
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  );

ReactDOM.createRoot(document.getElementById("root")!).render(AppWithRouter);
