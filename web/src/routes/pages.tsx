import { Hono } from "hono";

import HomePage from "../components/pages/Homepage";
import RootLayout from "../components/templates/layout";

export function getPageRoutes(lang = "en") {
  const app = new Hono();
  app.get("/", (c) => {
    return c.html(
      <RootLayout lang={lang}>
        <HomePage />
      </RootLayout>
    );
  });
  return app;
}
