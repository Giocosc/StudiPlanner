import { readdirSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
import { runAll } from "./harness.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const files = readdirSync(here).filter(f => f.endsWith(".test.mjs")).sort();
for (const f of files) {
  console.log(`\n# ${f}`);
  await import(pathToFileURL(join(here, f)).href);
}
const failed = await runAll();
process.exit(failed > 0 ? 1 : 0);
