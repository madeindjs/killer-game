import i18next from "i18next";
import Backend from "i18next-fs-backend";
import path from "node:path";

import { readdir } from "node:fs/promises";

const files = await readdir(path.join("locales", "en"));

export const i18n = await i18next.use(Backend).init({
  backend: {
    loadPath: path.join("locales", "{{lng}}", "{{ns}}.json"),
    addPath: path.join("locales", "{{lng}}", "{{ns}}.missing.json"),
  },
  debug: true,
  initImmediate: true,
  fallbackLng: "en",
  defaultNS: "common",
  fallbackNS: "common",
  ns: files.map((f) => f.replace(".json", "")),
});
