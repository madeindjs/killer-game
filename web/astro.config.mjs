import nodejs from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: nodejs({ mode: "standalone" }),
  integrations: [tailwind({ configFile: "./tailwind.config.js" })],
});
