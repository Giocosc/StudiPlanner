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
