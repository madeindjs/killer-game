import { readFile } from "node:fs/promises";
import { fileURLToPath, URL } from "node:url";

let version;

/**
 *
 * @returns {Promise<string>}
 */
export async function getBackendVersion() {
  if (version) return version;

  const url = fileURLToPath(new URL("../../package.json", import.meta.url));

  const pkgStr = await readFile(url, { encoding: "utf-8" });
  const pkg = JSON.parse(pkgStr);
  version = pkg.version;

  return version;
}
