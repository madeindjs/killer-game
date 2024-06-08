import fs from "node:fs/promises";
import { join } from "node:path";
import { URL, fileURLToPath } from "node:url";

const dir = await fs.readdir(new URL("./fr", import.meta.url));

for (const lang of ["en", "fr"]) {
  const trans = {};

  for (const file of dir) {
    const path = join(fileURLToPath(new URL(`./${lang}`, import.meta.url)), file);
    console.log(path);
    const content = await fs.readFile(path, { encoding: "utf-8" });

    const key = file.replace(".json", "");
    trans[key] = JSON.parse(content);
  }

  await fs.writeFile(fileURLToPath(new URL(`./${lang}.json`, import.meta.url)), JSON.stringify(trans, undefined, 2));
}
