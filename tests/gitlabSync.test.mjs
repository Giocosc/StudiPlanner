import assert from "assert";
import { test } from "./harness.mjs";
import {
  mergeStudyPlannerStates,
  syncWithGitLab,
  syncStatesEqual,
  buildSyncPayload
} from "../src/services/gitlabSyncService.js";

const topic = (id, extra = {}) => ({ id, materia: "Analisi 1", argomento: id, oreStimate: 3, oreEffettive: 0, completato: false, isCompleted: false, ...extra });
const sess = (id, topicId, hours, extra = {}) => ({ id, topicId, hours, date: "2026-11-18", completed: false, ...extra });

test("merge: ore registrate offline su due dispositivi si sommano (prima: max)", () => {
  const local = { topics: [topic("A-01", { oreEffettive: 2 })], studySessions: [sess("s1", "A-01", 2)] };
  const remote = { topics: [topic("A-01", { oreEffettive: 1.5 })], studySessions: [sess("s2", "A-01", 1.5)] };
  const m = mergeStudyPlannerStates(local, remote);
  assert.strictEqual(m.studySessions.length, 2);
  assert.strictEqual(m.topics[0].oreEffettive, 3.5);
});

test("merge: una sessione cancellata non ricompare dall'altro dispositivo", () => {
  // Il dispositivo locale ha cancellato s1 (tombstone); il remoto la ha ancora
  const local = { topics: [topic("A-01", { oreEffettive: 0, updatedAt: 200 })], studySessions: [], deletedSessionIds: ["s1"] };
  const remote = { topics: [topic("A-01", { oreEffettive: 2, updatedAt: 100 })], studySessions: [sess("s1", "A-01", 2)] };
  const m = mergeStudyPlannerStates(local, remote);
  assert.strictEqual(m.studySessions.length, 0);
  assert.strictEqual(m.topics[0].oreEffettive, 0);
  assert.deepStrictEqual(m.deletedSessionIds, ["s1"]);
  // ...e viceversa (tombstone sul remoto)
  const m2 = mergeStudyPlannerStates(remote, local);
  assert.strictEqual(m2.studySessions.length, 0);
  assert.strictEqual(m2.topics[0].oreEffettive, 0);
});

test("merge: togliere la spunta si propaga (vince la modifica più recente)", () => {
  const local = { topics: [topic("A-01", { completato: false, isCompleted: false, updatedAt: 300 })], studySessions: [] };
  const remote = { topics: [topic("A-01", { completato: true, isCompleted: true, completedDate: "2026-11-17", updatedAt: 100 })], studySessions: [] };
  assert.strictEqual(mergeStudyPlannerStates(local, remote).topics[0].completato, false);
  assert.strictEqual(mergeStudyPlannerStates(remote, local).topics[0].completato, false);
});

test("merge: dati legacy senza updatedAt mantengono l'unione conservativa", () => {
  const local = { topics: [topic("A-01", { completato: false })], studySessions: [] };
  const remote = { topics: [topic("A-01", { completato: true, completedDate: "2026-11-17" })], studySessions: [] };
  const m = mergeStudyPlannerStates(local, remote);
  assert.strictEqual(m.topics[0].completato, true);
  assert.strictEqual(m.topics[0].completedDate, "2026-11-17");
});

test("merge: note ufficiali e appunti restano separati", () => {
  const local = { topics: [topic("A-01", { note: "Focus ufficiale", scratchpadNotes: "miei appunti", updatedAt: 2 })] };
  const remote = { topics: [topic("A-01", { note: "Focus ufficiale", scratchpadNotes: "", updatedAt: 1 })] };
  const m = mergeStudyPlannerStates(local, remote);
  assert.strictEqual(m.topics[0].note, "Focus ufficiale");
  assert.strictEqual(m.topics[0].scratchpadNotes, "miei appunti");
});

test("merge: reset del Time Shifter e impostazioni si propagano col timestamp", () => {
  const local = { topics: [], customDayCapacities: {}, settings: { weekendStudyHours: 4.5, currentSimulatedDate: "2026-11-19" }, syncMeta: { capacitiesUpdatedAt: 500, settingsUpdatedAt: 10 } };
  const remote = { topics: [], customDayCapacities: { "2026-11-20": 4 }, settings: { weekendStudyHours: 6, currentSimulatedDate: "2026-12-01" }, syncMeta: { capacitiesUpdatedAt: 100, settingsUpdatedAt: 50 } };
  const m = mergeStudyPlannerStates(local, remote);
  assert.deepStrictEqual(m.customDayCapacities, {});
  assert.strictEqual(m.settings.weekendStudyHours, 6);
  assert.strictEqual(m.settings.currentSimulatedDate, "2026-11-19", "la data simulata resta locale");
});

test("merge: argomenti presenti solo sul remoto vengono aggiunti", () => {
  const m = mergeStudyPlannerStates({ topics: [topic("A-01")] }, { topics: [topic("A-01"), topic("A-99")] });
  assert.deepStrictEqual(m.topics.map(t => t.id), ["A-01", "A-99"]);
});

// ---- syncWithGitLab con un finto server GitLab ------------------------------------------

function fakeGitLab(initialState) {
  const server = { content: initialState ? JSON.stringify(initialState) : null, commit: initialState ? "c0" : null, puts: 0, beforePut: null };
  const b64 = (s) => Buffer.from(s, "utf-8").toString("base64");
  globalThis.atob = (s) => Buffer.from(s, "base64").toString("binary");
  globalThis.fetch = async (url, opts = {}) => {
    const method = opts.method || "GET";
    const json = (status, body) => ({ ok: status < 300, status, statusText: String(status), json: async () => body, text: async () => JSON.stringify(body) });
    if (method === "GET") {
      if (!server.content) return json(404, {});
      return json(200, { content: b64(server.content), commit_id: server.commit, last_commit_id: server.commit, file_name: "s.json" });
    }
    if (server.beforePut) { const f = server.beforePut; server.beforePut = null; f(); }
    const body = JSON.parse(opts.body);
    if (method === "PUT" && body.last_commit_id && body.last_commit_id !== server.commit) {
      return json(400, { message: "You are attempting to update a file that has changed since you started editing it." });
    }
    server.puts++;
    server.content = body.content;
    server.commit = "c" + server.puts;
    return json(200, { file_path: "s.json", branch: "main" });
  };
  return server;
}
const config = { enabled: true, projectId: "u/p", token: "t", branch: "main", filePath: "s.json" };

test("sync: scrittura concorrente di un altro dispositivo -> rilettura e fusione, nessuna perdita", async () => {
  const base = { topics: [topic("A-01")], studySessions: [] };
  const server = fakeGitLab(buildSyncPayload(base));
  // Mentre questo dispositivo sta per scrivere, un altro registra una sessione
  server.beforePut = () => {
    const other = { topics: [topic("A-01", { oreEffettive: 1 })], studySessions: [sess("other", "A-01", 1)] };
    server.content = JSON.stringify(buildSyncPayload(other));
    server.commit = "other-commit";
  };
  const local = { topics: [topic("A-01", { oreEffettive: 2 })], studySessions: [sess("mine", "A-01", 2)] };
  const res = await syncWithGitLab(config, local);
  assert.strictEqual(res.pushed, true);
  assert.ok(res.attempts >= 2, "deve aver riprovato dopo il conflitto");
  const saved = JSON.parse(server.content);
  assert.deepStrictEqual(saved.studySessions.map(s => s.id).sort(), ["mine", "other"]);
  assert.strictEqual(saved.topics[0].oreEffettive, 3);
});

test("sync: nessun commit se lo stato remoto è già identico", async () => {
  const state = { topics: [topic("A-01")], studySessions: [sess("s1", "A-01", 1)], settings: { weekendStudyHours: 4.5 } };
  const server = fakeGitLab(buildSyncPayload(state));
  const res = await syncWithGitLab(config, { ...state, settings: { ...state.settings, currentSimulatedDate: "2026-11-19" } });
  assert.strictEqual(res.pushed, false);
  assert.strictEqual(server.puts, 0);
  const remote = JSON.parse(server.content);
  assert.ok(syncStatesEqual(res.merged, mergeStudyPlannerStates(remote, remote)));
});

test("sync: file remoto assente -> viene creato", async () => {
  const server = fakeGitLab(null);
  const res = await syncWithGitLab(config, { topics: [topic("A-01")], studySessions: [] });
  assert.strictEqual(res.pushed, true);
  assert.strictEqual(server.puts, 1);
  assert.ok(!("currentSimulatedDate" in JSON.parse(server.content).settings));
});

test("merge: è idempotente (rifondere lo stato fuso non cambia nulla, niente sync a vuoto)", () => {
  const local = { topics: [topic("A-01", { oreEffettive: 2, updatedAt: 5 }), topic("A-02")], studySessions: [sess("s1", "A-01", 2)], settings: { weekendStudyHours: 4 } };
  const remote = { topics: [topic("A-01", { completato: true, updatedAt: 9 }), topic("A-02", { scratchpadNotes: "x" })], studySessions: [sess("s2", "A-01", 1)], deletedSessionIds: ["old"] };
  const once = mergeStudyPlannerStates(local, remote);
  assert.ok(syncStatesEqual(mergeStudyPlannerStates(once, remote), once));
  assert.ok(syncStatesEqual(mergeStudyPlannerStates(once, once), once));
});
