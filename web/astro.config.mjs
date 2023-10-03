import nodejs from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: nodejs({ mode: "middleware" }),
  integrations: [tailwind({ configFile: "./tailwind.config.js" })],
  vite: {
    server: {
      watch: {
        ignored: ["*.sqlite3"],
      },
    },
  },
});
