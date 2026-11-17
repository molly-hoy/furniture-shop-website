/* ==========================================================================
   main.jsx: where the app starts
   --------------------------------------------------------------------------
   Finds <div id="root"> in index.html and tells React to draw the app in it.
   The "provider" components wrap the app so everything inside can use them:
     • BrowserRouter – page navigation (React Router)
     • CartProvider  – the shopping basket (our own Context)
   ========================================================================== */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// Global styles first, so component styles (CSS Modules) can override them.
import "./styles/global.css";
import { CartProvider } from "./context/CartContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  // StrictMode adds extra checks while you develop. It has no effect in
  // the finished build.
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);
