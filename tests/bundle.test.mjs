import assert from "assert";
import { readFileSync } from "fs";
import vm from "vm";
import { test } from "./harness.mjs";

// vendor/babel.min.js è UMD: lo valutiamo in una sandbox CommonJS
// (package.json usa "type": "module", quindi require() lo rifiuterebbe).
function loadBabel() {
  const src = readFileSync(new URL("../vendor/babel.min.js", import.meta.url), "utf-8");
  const module = { exports: {} };
  vm.runInNewContext(src, { module, exports: module.exports, console, globalThis: {} });
  return module.exports;
}

test("bundle.js è JSX valido e viene transpilato da Babel senza errori", () => {
  const Babel = loadBabel();
  const code = readFileSync(new URL("../bundle.js", import.meta.url), "utf-8");
  const out = Babel.transform(code, { presets: ["react"], compact: true }).code;
  assert.ok(out.length > 1000);
});

test("i servizi in src/ sono moduli ES importabili", async () => {
  const engine = await import("../src/services/rebalancerEngine.js");
  assert.strictEqual(typeof engine.rebalanceStudyPlan, "function");
  const sync = await import("../src/services/gitlabSyncService.js");
  assert.strictEqual(typeof sync.mergeStudyPlannerStates, "function");
});
