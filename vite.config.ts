import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/weather-clock-card.ts",
      formats: ["es"],
      fileName: () => "weather-clock-card.js",
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
