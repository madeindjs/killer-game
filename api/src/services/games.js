// Compatibility shim: the service is written in TypeScript. Existing `.js`
// modules keep importing `./games.js` without having to be migrated.
export * from "./games.ts";
