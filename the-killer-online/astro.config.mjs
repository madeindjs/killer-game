import nodejs from "@astrojs/node";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: nodejs({ mode: "middleware" }),
  vite: {
    server: {
      watch: {
        ignored: ["*.sqlite3"],
      },
    },
  },
});
