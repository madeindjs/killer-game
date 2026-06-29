// Compatibility shim: the server implementation has been migrated to TypeScript.
// Re-export everything so existing CommonJS/ESM consumers and .js test files can still import ./server.js.
export * from "./server.ts";
