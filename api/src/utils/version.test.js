import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import { getBackendVersion } from "./version.js";

describe("version utilities", () => {
  describe(getBackendVersion.name, () => {
    it("should return a valid version string from package.json", async () => {
      const version = await getBackendVersion();
      assert.ok(typeof version === "string");
      assert.ok(version.length > 0);
      // Semantic version format: major.minor.patch
      const semverRegex = /^\d+\.\d+\.\d+$/;
      assert.ok(semverRegex.test(version), `Invalid semver format: ${version}`);
    });

    it("should cache the version after first call", async () => {
      const version1 = await getBackendVersion();
      const version2 = await getBackendVersion();
      assert.strictEqual(version1, version2);
    });
  });
});
