// Vite configuration.
// Vite is the "build tool": it runs a fast development server while you
// work (npm run dev) and bundles everything into optimised files for
// hosting (npm run build). The React plugin teaches it to understand JSX.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
