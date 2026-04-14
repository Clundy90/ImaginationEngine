import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path"; // Add this import at the top

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    // We use path.resolve to tell Vitest EXACTLY where the file is
    setupFiles: [path.resolve(__dirname, "./src/setup.ts")],
  },
});
