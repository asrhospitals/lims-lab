import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/lims-lab",
  plugins: [react()],
  server: {
    historyApiFallback: true,
  },
});
