import assert from "assert";
import { test } from "./harness.mjs";
import { applySessionToTopic } from "../src/services/topicStateService.js";

const topic = (extra = {}) => ({ id: "A-01", oreStimate: 2, oreEffettive: 0, completato: false, isCompleted: false, ...extra });

test("sessione: una sessione con completed:false non scompleta un argomento completato", () => {
  const done = topic({ completato: true, isCompleted: true, completedDate: "2026-11-17", oreEffettive: 2 });
  const after = applySessionToTopic(done, { hours: 0.83, completed: false, date: "2026-11-19" });
  assert.strictEqual(after.completato, true);
  assert.strictEqual(after.isCompleted, true);
  assert.strictEqual(after.completedDate, "2026-11-17");
  assert.strictEqual(after.oreEffettive, 2.83);
});

test("sessione: completed:true completa e registra la data della sessione", () => {
  const after = applySessionToTopic(topic(), { hours: 1, completed: true, date: "2026-11-19" });
  assert.strictEqual(after.completato, true);
  assert.strictEqual(after.completedDate, "2026-11-19");
});

test("sessione: completed:false su argomento aperto lo lascia aperto anche oltre la stima", () => {
  const after = applySessionToTopic(topic(), { hours: 3, completed: false, date: "2026-11-19" });
  assert.strictEqual(after.completato, false);
  assert.strictEqual(after.completedDate, null);
});

test("sessione: senza flag si completa al raggiungimento della stima", () => {
  assert.strictEqual(applySessionToTopic(topic(), { hours: 1, date: "2026-11-19" }).completato, false);
  assert.strictEqual(applySessionToTopic(topic(), { hours: 2, date: "2026-11-19" }).completato, true);
});
