import assert from "assert";
import { test } from "./harness.mjs";
import { applySessionToTopic, revertSessionFromTopic, withCompletion, isTopicDone, restoreOfficialNotes } from "../src/services/topicStateService.js";

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

test("cancellazione: una sessione parziale non scompleta un argomento spuntato a mano", () => {
  const done = topic({ completato: true, isCompleted: true, completedDate: "2026-11-18", oreEffettive: 3 });
  const sess = { id: "s1", topicId: "A-01", date: "2026-11-17", hours: 1, completed: false };
  const after = revertSessionFromTopic(done, sess, [sess]);
  assert.strictEqual(after.completato, true);
  assert.strictEqual(after.completedDate, "2026-11-18");
  assert.strictEqual(after.oreEffettive, 2);
});

test("cancellazione: la sessione che aveva completato l'argomento lo riapre", () => {
  const done = topic({ completato: true, isCompleted: true, completedDate: "2026-11-18", oreEffettive: 2 });
  const sess = { id: "s1", topicId: "A-01", date: "2026-11-18", hours: 2, completed: true };
  const after = revertSessionFromTopic(done, sess, [sess]);
  assert.strictEqual(after.completato, false);
  assert.strictEqual(after.completedDate, null);
});

test("cancellazione: se un'altra sessione completata esiste resta completato con la sua data", () => {
  const done = topic({ completato: true, isCompleted: true, completedDate: "2026-11-18", oreEffettive: 4 });
  const s1 = { id: "s1", topicId: "A-01", date: "2026-11-18", hours: 2, completed: true };
  const s2 = { id: "s2", topicId: "A-01", date: "2026-11-19", hours: 2, completed: true };
  const after = revertSessionFromTopic(done, s1, [s1, s2]);
  assert.strictEqual(after.completato, true);
  assert.strictEqual(after.completedDate, "2026-11-19");
});

test("completamento: withCompletion allinea completato e isCompleted", () => {
  const done = topic({ completato: true, isCompleted: true, completedDate: "2026-11-18" });
  const reset = withCompletion(done, false);
  assert.strictEqual(isTopicDone(reset), false);
  assert.strictEqual(reset.isCompleted, false);
  assert.strictEqual(reset.completedDate, null);
  const again = withCompletion(reset, true, "2026-11-19");
  assert.strictEqual(isTopicDone(again), true);
  assert.strictEqual(again.completedDate, "2026-11-19");
});

test("note: la migrazione ripristina il focus didattico sovrascritto dagli appunti", () => {
  const defaults = [{ id: "A-01", note: "Definizione formale sup/inf" }, { id: "A-02", note: "Grafici" }];
  const saved = [
    { id: "A-01", note: "miei appunti", scratchpadNotes: "miei appunti" },
    { id: "A-02", note: "Grafici", scratchpadNotes: "altro" }
  ];
  const fixed = restoreOfficialNotes(saved, defaults);
  assert.strictEqual(fixed[0].note, "Definizione formale sup/inf");
  assert.strictEqual(fixed[0].scratchpadNotes, "miei appunti");
  assert.strictEqual(fixed[1].note, "Grafici");
});

test("sync: solo gli argomenti realmente modificati ricevono updatedAt", async () => {
  const { stampChangedTopics } = await import("../src/services/topicStateService.js");
  const prev = [{ id: "A-01", ore: 1 }, { id: "A-02", ore: 2 }, { id: "A-03", ore: 3 }];
  const next = [prev[0], { ...prev[1] }, { ...prev[2], ore: 4 }, { id: "A-04" }];
  const out = stampChangedTopics(prev, next, 123);
  assert.strictEqual(out[0], prev[0]);
  assert.strictEqual(out[1].updatedAt, undefined, "copia identica: nessun timestamp");
  assert.strictEqual(out[2].updatedAt, 123);
  assert.strictEqual(out[3].updatedAt, 123);
  assert.strictEqual(stampChangedTopics(prev, prev, 1), prev);
});
