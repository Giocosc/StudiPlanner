import assert from "assert";
import { test } from "./harness.mjs";
import { INITIAL_TOPICS } from "../src/data/defaultData.js";
import { rebalanceStudyPlan, calculateExamReadinessAndGrade } from "../src/services/rebalancerEngine.js";

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

test("motore: spunta in un giorno diverso dalle sessioni non raddoppia le ore", () => {
  const topics = freshTopics().map(t => t.id === "A-01"
    ? { ...t, completato: true, isCompleted: true, completedDate: "2026-11-18", oreEffettive: 4 } : t);
  const sessions = [
    { id: "s1", date: "2026-11-16", topicId: "A-01", hours: 2 },
    { id: "s2", date: "2026-11-17", topicId: "A-01", hours: 2 }
  ];
  const plan = rebalanceStudyPlan(topics, { currentSimulatedDate: "2026-11-19" }, {}, sessions);
  assert.strictEqual(plan.metrics.totalPastHours, 4);
  const day18 = plan.calendarDays.find(d => d.date === "2026-11-18");
  assert.strictEqual(day18.dayStatus, "completed");
  assert.strictEqual(day18.allocatedHours, 0);
});

test("motore: un argomento non completato con ore >= stima resta nel piano", () => {
  const topics = freshTopics().map(t => t.id === "A-01" ? { ...t, oreEffettive: Number(t.oreStimate) + 1 } : t);
  const plan = rebalanceStudyPlan(topics, { currentSimulatedDate: "2026-11-19" });
  const parts = scheduledChunks(plan).filter(c => c.id === "A-01");
  assert.ok(parts.length > 0, "A-01 deve restare pianificato");
  assert.ok(plan.progress.analisi.remainingHours > 0);
});

test("metriche: ritmo richiesto 0 (tutto finito) non viene trattato come 20h", () => {
  const done = freshTopics().map(t => ({ ...t, completato: true }));
  const zero = calculateExamReadinessAndGrade(done, { requiredWeeklyHours: 0, pastDaysStudied: 1, pastDaysSkipped: 9 });
  const twenty = calculateExamReadinessAndGrade(done, { requiredWeeklyHours: 20, pastDaysStudied: 1, pastDaysSkipped: 9 });
  assert.ok(zero.readinessScore > twenty.readinessScore);
  assert.strictEqual(zero.requiredWeeklyHours, 0);
});

test("metriche: nell'ultima settimana il ritmo richiesto non è sottostimato", () => {
  const topics = freshTopics().map(t => (t.id === "A-01" ? t : { ...t, completato: true }));
  const plan = rebalanceStudyPlan(topics, { currentSimulatedDate: "2027-01-07" });
  // 3 giorni residui: ritmo = ore / (3/7)
  const expected = Number((plan.metrics.totalRemainingEffectiveHours / (3 / 7)).toFixed(1));
  assert.strictEqual(plan.metrics.requiredWeeklyHours, expected);
});

test("date: finestra pre-esame e bootcamp seguono la data d'esame impostata", async () => {
  const e = await import("../src/services/rebalancerEngine.js");
  assert.strictEqual(e.getPreExamWindowStart("2027-02-15"), "2027-02-08");
  const dates = e.getHolidayBootcampDates("2028-01-20");
  assert.strictEqual(dates[0], "2027-12-24");
  assert.strictEqual(dates[dates.length - 1], "2028-01-06");
  assert.strictEqual(dates.length, 14);
  const plan = rebalanceStudyPlan(freshTopics(), { currentSimulatedDate: "2027-01-12", targetExamDate: "2027-01-20" });
  assert.strictEqual(plan.metrics.isPreExamWindow, false);
  const plan2 = rebalanceStudyPlan(freshTopics(), { currentSimulatedDate: "2027-01-14", targetExamDate: "2027-01-20" });
  assert.strictEqual(plan2.metrics.isPreExamWindow, true);
});

test("streak: conta sessioni e giorni con argomenti spuntati, senza doppi conteggi", () => {
  const topics = freshTopics().map(t => t.id === "A-02"
    ? { ...t, completato: true, isCompleted: true, completedDate: "2026-11-18", oreEffettive: 2.5 } : t);
  const sessions = [
    { id: "s1", date: "2026-11-16", topicId: "A-01", hours: 1 },
    { id: "s2", date: "2026-11-17", topicId: "A-01", hours: 1 }
  ];
  const plan = rebalanceStudyPlan(topics, { currentSimulatedDate: "2026-11-19" }, {}, sessions);
  // 16, 17 (sessioni) e 18 (spunta) consecutivi; il 19 non ancora studiato
  assert.strictEqual(plan.metrics.studyStreak.currentStreak, 3);
});

test("burndown: grandezze omogenee e asse temporale fisso", async () => {
  const { calculateBurndown } = await import("../src/services/rebalancerEngine.js");
  const base = { totalHours: 166, roadmapStartDate: "2026-11-16", targetExamDate: "2027-01-11" }; // 56 giorni
  // Giorno 0, niente fatto: esattamente sulla linea ideale (prima risultava "in ritardo")
  const d0 = calculateBurndown({ ...base, remainingHours: 166, currentSimulatedDate: "2026-11-16" });
  assert.strictEqual(d0.isAheadOfSchedule, true);
  assert.strictEqual(d0.deltaHours, 0);
  // A metà periodo con metà ore fatte: in linea
  const mid = calculateBurndown({ ...base, remainingHours: 83, currentSimulatedDate: "2026-12-14" });
  assert.strictEqual(mid.fraction, 0.5);
  assert.strictEqual(mid.idealRemainingToday, 83);
  assert.strictEqual(mid.isAheadOfSchedule, true);
  // A metà periodo con 100h residue: in ritardo di 17h
  const late = calculateBurndown({ ...base, remainingHours: 100, currentSimulatedDate: "2026-12-14" });
  assert.strictEqual(late.isAheadOfSchedule, false);
  assert.strictEqual(late.deltaHours, 17);
});

test("burndown: le ore residue del piano sono senza buffer come il totale", () => {
  const plan = rebalanceStudyPlan(freshTopics(), { currentSimulatedDate: "2026-11-16" });
  assert.strictEqual(plan.progress.global.remainingHours, plan.progress.global.totalHours);
});

test("retrospettiva: ore effettive reali e boost sulla settimana successiva", async () => {
  const { calculateWeeklyRetrospective, getNextWeekEveningBoost } = await import("../src/services/rebalancerEngine.js");
  const sessions = [
    { id: "s1", date: "2026-11-16", topicId: "A-01", hours: 2 },
    { id: "s2", date: "2026-11-17", topicId: "G-01", hours: 1.5 }
  ];
  const plan = rebalanceStudyPlan(freshTopics(), { currentSimulatedDate: "2026-11-18" }, {}, sessions);
  const week = plan.weeklyPlans.find(w => w.hasToday);
  const stats = calculateWeeklyRetrospective(week);
  assert.strictEqual(stats.elapsedDays, 3);
  assert.strictEqual(stats.targetHours, 7.5);
  assert.strictEqual(stats.actualHours, 3.5); // i blocchi pianificati di oggi non contano
  assert.strictEqual(stats.efficiency, 47);
  const boost = getNextWeekEveningBoost(plan.weeklyPlans, week);
  assert.deepStrictEqual(Object.keys(boost), ["2026-11-23", "2026-11-24", "2026-11-25", "2026-11-26", "2026-11-27"]);
  Object.values(boost).forEach(h => assert.strictEqual(h, 3));
});
