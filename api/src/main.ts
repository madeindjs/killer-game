import { startServer } from "./server.ts";

startServer().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
