import assert from "node:assert";
import { describe, it } from "node:test";
import { generateSmallUuid, generateUuid } from "./uuid.js";

describe("uuid utilities", () => {
  describe(generateUuid.name, () => {
    it("should return a valid UUID v4", () => {
      const uuid = generateUuid();
      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      // where x is any hex digit and y is one of 8, 9, A, or B
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      assert.ok(uuidRegex.test(uuid), `Invalid UUID format: ${uuid}`);
    });

    it("should return a unique UUID each time", () => {
      const uuid1 = generateUuid();
      const uuid2 = generateUuid();
      assert.notStrictEqual(uuid1, uuid2);
    });
  });

  describe(generateSmallUuid.name, () => {
    it("should return a valid UUID v4", () => {
      const uuid = generateSmallUuid();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      assert.ok(uuidRegex.test(uuid), `Invalid UUID format: ${uuid}`);
    });

    it("should return a unique UUID each time", () => {
      const uuid1 = generateSmallUuid();
      const uuid2 = generateSmallUuid();
      assert.notStrictEqual(uuid1, uuid2);
    });
  });
});
