import assert from "assert";
import { test } from "./harness.mjs";
import { INITIAL_TOPICS } from "../src/data/defaultData.js";
import { rebalanceStudyPlan } from "../src/services/rebalancerEngine.js";

const freshTopics = () => INITIAL_TOPICS.map(t => ({ ...t, completato: false, isCompleted: false, oreEffettive: 0 }));
const idNum = id => parseInt(String(id).match(/\d+/)[0], 10);

function scheduledChunks(plan) {
  // Elenco ordinato per data dei blocchi pianificati (escluse le sessioni registrate)
  const out = [];
  plan.calendarDays.forEach(d => d.topics.forEach(t => {
    if (!t.isSessionLog && !t.completato) out.push({ date: d.date, id: t.id, hours: t.effectiveHours, t });
  }));
  return out;
}

function assertSequential(plan) {
  for (const prefix of ["A-", "G-"]) {
    const seq = scheduledChunks(plan).filter(c => c.id.startsWith(prefix)).map(c => idNum(c.id));
    for (let i = 1; i < seq.length; i++) {
      assert.ok(seq[i] >= seq[i - 1], `sequenza ${prefix} violata: ${seq[i - 1]} prima di ${seq[i]}`);
    }
  }
}

test("motore: con capacità sufficiente nessun giorno supera il budget", () => {
  const plan = rebalanceStudyPlan(freshTopics(), {
    currentSimulatedDate: "2026-11-16", weekdayStudyHours: 4, weekendStudyHours: 8
  });
  assert.strictEqual(plan.metrics.isScheduleSaturated, false);
  plan.calendarDays.forEach(d => {
    assert.ok(d.allocatedHours <= d.maxHours + 0.25 + 1e-9, `${d.date}: ${d.allocatedHours}h > ${d.maxHours}h`);
  });
});

test("motore: argomenti lunghi divisi in parti che sommano alle ore effettive", () => {
  const plan = rebalanceStudyPlan(freshTopics(), { currentSimulatedDate: "2026-11-19" });
  const byTopic = new Map();
  scheduledChunks(plan).forEach(c => byTopic.set(c.id, (byTopic.get(c.id) || 0) + c.hours));
  plan.calendarDays.forEach(d => d.topics.forEach(t => {
    if (!t.isSessionLog) assert.ok(Math.abs(byTopic.get(t.id) - t.topicEffectiveHours) < 0.02, t.id);
  }));
  assert.strictEqual(byTopic.size, 63);
  assert.ok(scheduledChunks(plan).some(c => c.t.isSplit), "almeno un argomento diviso");
});

test("motore: sequenza A-xx / G-xx sempre rispettata (anche calendario saturo)", () => {
  assertSequential(rebalanceStudyPlan(freshTopics(), { currentSimulatedDate: "2026-11-19" }));
  const late = rebalanceStudyPlan(freshTopics(), { currentSimulatedDate: "2027-01-02" });
  assert.strictEqual(late.metrics.isScheduleSaturated, true);
  assertSequential(late);
  assert.strictEqual(new Set(scheduledChunks(late).map(c => c.id)).size, 63, "tutti gli argomenti pianificati");
});

test("motore: nessuno studio pianificato nel giorno d'esame", () => {
  for (const today of ["2026-11-19", "2027-01-02", "2027-01-09"]) {
    const plan = rebalanceStudyPlan(freshTopics(), { currentSimulatedDate: today });
    const exam = plan.calendarDays.find(d => d.date === "2027-01-10");
    assert.strictEqual(exam.topics.length, 0, `giorno esame non vuoto con oggi=${today}`);
  }
});

test("motore: A-32 (prova generale) è l'ultimo argomento di Analisi", () => {
  const plan = rebalanceStudyPlan(freshTopics(), { currentSimulatedDate: "2027-01-02" });
  const analisi = scheduledChunks(plan).filter(c => c.id.startsWith("A-"));
  assert.strictEqual(analisi[analisi.length - 1].id, "A-32");
});

test("motore: la Prova Generale A-32 cade solo nell'ultima settimana pre-esame", () => {
  const plan = rebalanceStudyPlan(freshTopics(), { currentSimulatedDate: "2026-11-19" });
  const parts = scheduledChunks(plan).filter(c => c.id === "A-32");
  assert.ok(parts.length > 0);
  parts.forEach(c => assert.ok(c.date >= "2027-01-03", `A-32 pianificato il ${c.date}`));
});
