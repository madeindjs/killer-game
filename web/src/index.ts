import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { getPageRoutes } from "./routes/pages";

const app = new Hono();

app.route("", getPageRoutes("en"));
app.route("/en", getPageRoutes("en"));
app.route("/fr", getPageRoutes("fr"));
app.get("/static/*", serveStatic({ root: "./" }));

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
