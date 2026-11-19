import assert from "assert";
import { test } from "./harness.mjs";
import { INITIAL_TOPICS } from "../src/data/defaultData.js";
import { mergeTopicsWithExcelData, normalizeTopicId } from "../src/services/parserService.js";

const fresh = () => INITIAL_TOPICS.map(t => ({ ...t, completato: false, isCompleted: false, oreEffettive: 0 }));
const doneIds = (topics) => topics.filter(t => t.completato).map(t => t.id);

test("excel: normalizeTopicId", () => {
  assert.strictEqual(normalizeTopicId("a1"), "A-01");
  assert.strictEqual(normalizeTopicId("A-01"), "A-01");
  assert.strictEqual(normalizeTopicId(" g 7 "), "G-07");
  assert.strictEqual(normalizeTopicId("S1-A"), "S1-A");
});

test("excel: un ID completato marca solo quell'argomento e scrive completato", () => {
  const { topics, matchedCount } = mergeTopicsWithExcelData(fresh(), { completedIds: new Set(["A-1"]), completedKeywords: [] }, "2026-11-19");
  assert.deepStrictEqual(doneIds(topics), ["A-01"]);
  assert.strictEqual(matchedCount, 1);
  const a01 = topics.find(t => t.id === "A-01");
  assert.strictEqual(a01.isCompleted, true);
  assert.strictEqual(a01.completedDate, "2026-11-19");
});

test("excel: ID numerico generico non marca argomenti per sottostringa", () => {
  const { topics } = mergeTopicsWithExcelData(fresh(), { completedIds: new Set(["1", "A"]), completedKeywords: [] });
  assert.deepStrictEqual(doneIds(topics), []);
});

test("excel: una parola chiave corta non marca tutti gli argomenti che la contengono", () => {
  const { topics } = mergeTopicsWithExcelData(fresh(), { completedIds: new Set(), completedKeywords: ["limiti", "matrici"] });
  assert.deepStrictEqual(doneIds(topics), []);
});

test("excel: il titolo esatto di un argomento lo marca", () => {
  const target = INITIAL_TOPICS.find(t => t.id === "G-01");
  const { topics } = mergeTopicsWithExcelData(fresh(), { completedIds: new Set(), completedKeywords: [target.argomento.toLowerCase()] });
  assert.ok(doneIds(topics).includes("G-01"));
});

test("csv: gli apostrofi italiani non rompono le colonne", async () => {
  const { parseCSVString } = await import("../src/services/parserService.js");
  const csv = [
    "ID,Materia,Capitolo,Argomento,Ore_Stimate,Difficolta,Priorita",
    "A-20,Analisi 1,Derivate,Teorema dell'Hôpital e applicazioni,3,4,5",
    'A-21,Analisi 1,"Integrali, primitive",L\'integrale di Riemann,2.5,3,4'
  ].join("\n");
  const rows = parseCSVString(csv, "Analisi.csv");
  assert.strictEqual(rows.length, 2);
  assert.strictEqual(rows[0].argomento, "Teorema dell'Hôpital e applicazioni");
  assert.strictEqual(rows[0].oreStimate, 3);
  assert.strictEqual(rows[0].prioritaEsame, 5);
  assert.strictEqual(rows[1].capitolo, "Integrali, primitive");
  assert.strictEqual(rows[1].argomento, "L'integrale di Riemann");
  assert.strictEqual(rows[1].oreStimate, 2.5);
});

test("csv: reimportare il catalogo conserva ore e completamenti esistenti", async () => {
  const { parseCSVString, mergeTopicsWithCsvRows } = await import("../src/services/parserService.js");
  const existing = fresh().map(t => t.id === "A-01"
    ? { ...t, completato: true, isCompleted: true, completedDate: "2026-11-17", oreEffettive: 2.5 }
    : t.id === "A-02" ? { ...t, oreEffettive: 1 } : t);
  const csv = "ID,Materia,Capitolo,Argomento,Ore_Stimate\nA-01,Analisi 1,Basi,Nuovo titolo A1,3\nA-02,Analisi 1,Basi,Titolo A2,2\nA-99,Analisi 1,Extra,Nuovo,1";
  const { topics, newCount, updatedCount } = mergeTopicsWithCsvRows(existing, parseCSVString(csv, "Analisi.csv"), "2026-11-19");
  const a01 = topics.find(t => t.id === "A-01");
  assert.strictEqual(a01.completato, true);
  assert.strictEqual(a01.oreEffettive, 2.5);
  assert.strictEqual(a01.argomento, "Nuovo titolo A1");
  assert.strictEqual(topics.find(t => t.id === "A-02").oreEffettive, 1);
  const a99 = topics.find(t => t.id === "A-99");
  assert.strictEqual(a99.completato, false);
  assert.strictEqual(a99.isCompleted, false);
  assert.strictEqual(newCount, 1);
  assert.strictEqual(updatedCount, 2);
});

test("csv: la colonna Stato completa davvero l'argomento (entrambi i campi)", async () => {
  const { parseCSVString, mergeTopicsWithCsvRows } = await import("../src/services/parserService.js");
  const csv = "ID,Materia,Argomento,Stato\nA-03,Analisi 1,Numeri complessi,Completato";
  const { topics } = mergeTopicsWithCsvRows(fresh(), parseCSVString(csv, "a.csv"), "2026-11-19");
  const a03 = topics.find(t => t.id === "A-03");
  assert.strictEqual(a03.completato, true);
  assert.strictEqual(a03.isCompleted, true);
  assert.strictEqual(a03.completedDate, "2026-11-19");
});
