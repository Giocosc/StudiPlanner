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

test("streak: il giorno di riposo è neutro e il jolly copre una sera saltata", async () => {
  const { calculateStudyStreak } = await import("../src/services/rebalancerEngine.js");
  const studyDays = { 0: { enabled: true }, 1: { enabled: true }, 2: { enabled: true }, 3: { enabled: false },
    4: { enabled: true }, 5: { enabled: true }, 6: { enabled: true } };
  const s = (date) => ({ id: date, date, topicId: "A-01", hours: 1 });
  // 2026-11-18 è mercoledì (riposo): 16, 17, 19 studiati → serie 3 senza jolly
  let r = calculateStudyStreak([], "2026-11-19", [s("2026-11-16"), s("2026-11-17"), s("2026-11-19")],
    { studyDays, jokersPerMonth: 0 });
  assert.strictEqual(r.currentStreak, 3);
  // Senza giorno di riposo e senza jolly la serie si spezza
  r = calculateStudyStreak([], "2026-11-19", [s("2026-11-16"), s("2026-11-17"), s("2026-11-19")], { jokersPerMonth: 0 });
  assert.strictEqual(r.currentStreak, 1);
  // Con un jolly la sera saltata viene coperta e il jolly risulta consumato
  r = calculateStudyStreak([], "2026-11-19", [s("2026-11-16"), s("2026-11-17"), s("2026-11-19")], { jokersPerMonth: 1 });
  assert.strictEqual(r.currentStreak, 3);
  assert.strictEqual(r.jokersLeftThisMonth, 0);
  assert.deepStrictEqual(r.jokerDates, ["2026-11-18"]);
  // Un jolly non seguito da studio non viene consumato
  r = calculateStudyStreak([], "2026-11-19", [s("2026-11-19")], { jokersPerMonth: 1 });
  assert.strictEqual(r.currentStreak, 1);
  assert.strictEqual(r.jokersLeftThisMonth, 1);
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

test("impostazioni: weekend a 0h è rispettato (non torna a 4.5h)", () => {
  const plan = rebalanceStudyPlan(freshTopics(), { currentSimulatedDate: "2026-11-19", weekendStudyHours: 0 });
  const sat = plan.calendarDays.find(d => d.date === "2026-11-21");
  assert.strictEqual(sat.maxHours, 0);
});

test("time shifter: il budget giornaliero è limitato a 12h", async () => {
  const { clampDayCapacity, MAX_DAY_CAPACITY_HOURS } = await import("../src/services/rebalancerEngine.js");
  assert.strictEqual(clampDayCapacity(30), MAX_DAY_CAPACITY_HOURS);
  assert.strictEqual(clampDayCapacity(-2), 0);
  assert.strictEqual(clampDayCapacity(3.04), 3);
  const plan = rebalanceStudyPlan(freshTopics(), { currentSimulatedDate: "2026-11-19" }, { "2026-11-20": 40 });
  assert.strictEqual(plan.calendarDays.find(d => d.date === "2026-11-20").maxHours, 12);
});

test("padronanza: gli esiti degli esercizi misurano la padronanza e spostano la previsione", async () => {
  const { calculateMasteryStats, calculateExamReadinessAndGrade } = await import("../src/services/rebalancerEngine.js");
  const topics = freshTopics().map(t => (t.id === "A-01" || t.id === "A-02")
    ? { ...t, completato: true, isCompleted: true, completedDate: "2026-11-10" } : t);
  const sessions = [
    { id: "a", date: "2026-11-10", topicId: "A-01", hours: 2, exercises: { correct: 4, partial: 1, wrong: 0 }, confidence: 5 },
    { id: "b", date: "2026-11-11", topicId: "A-02", hours: 2, exercises: { correct: 0, partial: 1, wrong: 3 }, confidence: 2 },
    { id: "c", date: "2026-11-12", topicId: "A-03", hours: 2 }
  ];
  const m = calculateMasteryStats(topics, sessions);
  assert.strictEqual(m.attempts, 9);
  assert.strictEqual(m.correct, 4);
  assert.strictEqual(m.byTopic["A-01"].level.key, "solid");
  assert.strictEqual(m.byTopic["A-02"].level.key, "weak");
  assert.deepStrictEqual(m.weakTopics.map(w => w.topicId), ["A-02"]);
  assert.strictEqual(m.coverage, 1);
  assert.ok(!m.byTopic["A-03"], "una sessione senza esiti non conta");

  const base = { pastDaysStudied: 10, pastDaysSkipped: 0, requiredWeeklyHours: 20 };
  const noMastery = calculateExamReadinessAndGrade(topics, base);
  const good = calculateExamReadinessAndGrade(topics, { ...base, mastery: { attempts: 10, accuracy: 0.95, coverage: 1, correct: 9 } });
  const bad = calculateExamReadinessAndGrade(topics, { ...base, mastery: { attempts: 10, accuracy: 0.2, coverage: 1, correct: 2 } });
  const few = calculateExamReadinessAndGrade(topics, { ...base, mastery: { attempts: 2, accuracy: 0, coverage: 1, correct: 0 } });
  assert.strictEqual(noMastery.masteryBased, false);
  assert.ok(good.readinessScore > noMastery.readinessScore);
  assert.ok(bad.readinessScore < noMastery.readinessScore);
  assert.strictEqual(few.readinessScore, noMastery.readinessScore, "sotto la soglia minima gli esiti non pesano");

  const plan = rebalanceStudyPlan(topics, { currentSimulatedDate: "2026-11-19" }, {}, sessions);
  assert.strictEqual(plan.metrics.mastery.attempts, 9);
  assert.strictEqual(plan.metrics.examPrediction.masteryBased, true);
});

test("ripassi: intervalli adattivi in base all'esito", async () => {
  const { buildSpacedReviewSchedule } = await import("../src/services/rebalancerEngine.js");
  const t = (spacedReviews) => ({ id: "A-01", materia: "Analisi 1", argomento: "x", completedDate: "2026-11-01", spacedReviews });
  const by = (list) => Object.fromEntries(list.map(r => [r.levelKey, r]));

  // Nessun ripasso fatto: calendario fisso +3 / +7 / +21 dal completamento
  let r = by(buildSpacedReviewSchedule(t({}), "2026-11-02"));
  assert.deepStrictEqual([r.r1.targetDate, r.r2.targetDate, r.r3.targetDate], ["2026-11-04", "2026-11-08", "2026-11-22"]);
  assert.ok(!r.r4, "nessun ripasso di recupero senza fallimenti");

  // Dato storico (true): stesso calendario di prima
  r = by(buildSpacedReviewSchedule(t({ r1: true }), "2026-11-05"));
  assert.strictEqual(r.r1.isDone, true);
  assert.strictEqual(r.r2.targetDate, "2026-11-08");

  // R1 riuscito il 05/11: R2 si allunga a +7 dalla data del ripasso
  r = by(buildSpacedReviewSchedule(t({ r1: { done: true, outcome: "good", date: "2026-11-05" } }), "2026-11-05"));
  assert.strictEqual(r.r2.targetDate, "2026-11-12");

  // R1 fallito: R2 torna a +3 giorni ed è un recupero
  r = by(buildSpacedReviewSchedule(t({ r1: { done: true, outcome: "failed", date: "2026-11-05" } }), "2026-11-05"));
  assert.strictEqual(r.r2.targetDate, "2026-11-08");
  assert.strictEqual(r.r2.isRecovery, true);

  // R3 fallito: compare un R4 di recupero a +3
  r = by(buildSpacedReviewSchedule(t({
    r1: { done: true, outcome: "good", date: "2026-11-04" },
    r2: { done: true, outcome: "good", date: "2026-11-11" },
    r3: { done: true, outcome: "failed", date: "2026-12-02" }
  }), "2026-12-02"));
  assert.strictEqual(r.r3.targetDate, "2026-12-02");
  assert.strictEqual(r.r4.targetDate, "2026-12-05");
  assert.ok(!r.r5);
});

test("stasera: una sola azione dal giorno attivo", async () => {
  const { getTonightFocus } = await import("../src/services/rebalancerEngine.js");
  const plan = rebalanceStudyPlan(freshTopics(), { currentSimulatedDate: "2026-11-19" }, {}, []);
  const today = plan.calendarDays.find(d => d.isToday);
  const f = getTonightFocus(today, plan.metrics.targetExamDate || "2027-01-10");
  assert.strictEqual(f.kind, "study");
  const firstPlanned = today.topics.find(t => !t.isSessionLog && t.partIndex !== undefined);
  assert.strictEqual(f.topic.id, firstPlanned.id);
  assert.strictEqual(f.plannedHours, firstPlanned.effectiveHours);

  assert.strictEqual(getTonightFocus({ ...today, date: "2027-01-10" }, "2027-01-10").kind, "exam");
  assert.strictEqual(getTonightFocus({ date: "2026-11-20", enabled: false, dayStatus: "rest", topics: [] }, "2027-01-10").kind, "rest");
  const done = getTonightFocus({ date: "2026-11-20", topics: [{ id: "A-01", isSessionLog: true, effectiveHours: 2 }] }, "2027-01-10");
  assert.strictEqual(done.kind, "done");
  assert.strictEqual(done.studiedHours, 2);
  assert.strictEqual(getTonightFocus(null).kind, "none");
});
