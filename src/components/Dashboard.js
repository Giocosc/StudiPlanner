import React, { useState } from "react";
import {
  IconClock,
  IconCalendar,
  IconBookOpen,
  IconBarChart,
  IconCheckCircle,
  IconFlame,
  IconSparkles,
  IconDice,
  IconBug,
  IconPlus,
  IconCheck
} from "./Icons.js";
import { NeuraDeckPromptGenerator } from "./NeuraDeckPromptGenerator.js";
import { ExamSimulator } from "./ExamSimulator.js";
import { BurndownChart } from "./BurndownChart.js";
import { TonightFocus } from "./TonightFocus.js";
import { MockExamPanel } from "./MockExamPanel.js";
import { DEFAULT_ROADMAP_START_DATE, DEFAULT_TARGET_EXAM_DATE, calculateWeeklyRetrospective, MASTERY_MIN_ATTEMPTS, getTonightFocus, calculateWeeklyDigest } from "../services/rebalancerEngine.js";

/**
 * Calculates whether the student is ahead, on track, or behind schedule for a subject
 */
function getSubjectPacing(subjectData, currentSimulatedDate, roadmapStartDate = DEFAULT_ROADMAP_START_DATE, targetExamDate = DEFAULT_TARGET_EXAM_DATE) {
  const start = new Date(roadmapStartDate + "T00:00:00");
  const end = new Date(targetExamDate + "T00:00:00");
  const current = new Date((currentSimulatedDate || roadmapStartDate) + "T00:00:00");

  const totalDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
  const elapsedDays = Math.max(0, Math.round((current - start) / (1000 * 60 * 60 * 24)));
  const progressRatio = Math.min(1, Math.max(0, elapsedDays / totalDays));

  const totalHours = Number(subjectData.totalHours) || 1;
  const completedHours = Number(subjectData.completedHours) || 0;
  const expectedHours = Number((totalHours * progressRatio).toFixed(1));
  const expectedPercent = Math.min(100, Math.round(progressRatio * 100));

  const deltaHours = Number((completedHours - expectedHours).toFixed(1));
  const deltaPercent = (subjectData.percent || 0) - expectedPercent;

  if (deltaHours >= 0.8) {
    return {
      status: "ahead",
      badge: `🚀 In Vantaggio (+${deltaHours}h)`,
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950/30",
      borderClass: "border-emerald-500/40",
      textClass: "text-emerald-300",
      bgGradient: "from-emerald-950/20 via-slate-900/40 to-slate-950/80",
      message: `Sei in anticipo di ${deltaHours}h (+${deltaPercent}%) rispetto alla tabella ideale a oggi (${expectedHours}h previste). Stai guadagnando preziosi giorni di ripasso per l'esame del 10 Gennaio!`,
      expectedHours,
      expectedPercent
    };
  } else if (deltaHours >= -1.5) {
    return {
      status: "on_track",
      badge: "🎯 Al Passo (Allineato)",
      badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-950/30",
      borderClass: "border-cyan-500/40",
      textClass: "text-cyan-300",
      bgGradient: "from-cyan-950/20 via-slate-900/40 to-slate-950/80",
      message: `Perfetto allineamento al piano di marcia (completate ${completedHours}h su ${expectedHours}h attese a oggi). Continua a presidiare le fasce serali feriali (19:30 - 22:00).`,
      expectedHours,
      expectedPercent
    };
  } else {
    const absDelta = Math.abs(deltaHours);
    return {
      status: "behind",
      badge: `⚠️ In Ritardo (-${absDelta}h)`,
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-950/30",
      borderClass: "border-amber-500/40",
      textClass: "text-amber-300",
      bgGradient: "from-amber-950/20 via-slate-900/40 to-slate-950/80",
      message: `Sei indietro di ${absDelta}h rispetto al target teorico ad oggi (${expectedHours}h attese, ${completedHours}h svolte). Il Rolling Rebalancer ha redistribuito il carico in avanti: programma 30m extra con il Time Shifter o intensifica il blocco del weekend.`,
      expectedHours,
      expectedPercent
    };
  }
}

const DASHBOARD_DETAILS_KEY = "studiplanner_dashboard_details_open_v1";

export function Dashboard({
  progress,
  metrics,
  onTabChange,
  topics = [],
  settings = {},
  onOpenLogModal,
  onOpenTopicDetail,
  onToggleSpacedReview,
  onLogStudySession,
  mockExams = [],
  studySessions = [],
  onOpenRetrospective,
  onSaveMockExam,
  onDeleteMockExam,
  mathBugs = [],
  onOpenBugTracker,
  currentWeekPlan = null,
  todayPlan = null
}) {
  const { analisi, geometria, global } = progress;
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isExamSimulatorOpen, setIsExamSimulatorOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(() => {
    try {
      return window.localStorage.getItem(DASHBOARD_DETAILS_KEY) === "1";
    } catch (e) {
      return false;
    }
  });
  const toggleDetails = () => {
    setIsDetailsOpen(prev => {
      const next = !prev;
      try {
        window.localStorage.setItem(DASHBOARD_DETAILS_KEY, next ? "1" : "0");
      } catch (e) {
        // Preferenza solo locale: se lo storage non è disponibile resta chiusa.
      }
      return next;
    });
  };

  // Subject Pacing Analysis (In vantaggio, Al passo, In ritardo)
  const pacingAnalisi = getSubjectPacing(analisi, settings.currentSimulatedDate, settings.roadmapStartDate, settings.targetExamDate);
  const pacingGeometria = getSubjectPacing(geometria, settings.currentSimulatedDate, settings.roadmapStartDate, settings.targetExamDate);

  // Streak & Psychological Resilience Metrics
  const streak = metrics.studyStreak || { currentStreak: 0, bestStreak: 0, badgeName: "Innesco Serale", badgeIcon: "🌱", badgeDesc: "" };
  let nextTierName = "Ingegnere Notturno";
  let nextTierDays = 3;
  let nextTierIcon = "⚡";
  if (streak.currentStreak >= 21) {
    nextTierName = "Leggenda Vivente UNIMORE";
    nextTierDays = 30;
    nextTierIcon = "🏆";
  } else if (streak.currentStreak >= 14) {
    nextTierName = "Maestro della Disciplina UNIMORE";
    nextTierDays = 21;
    nextTierIcon = "👑";
  } else if (streak.currentStreak >= 7) {
    nextTierName = "Resilienza Lavoratore d'Acciaio";
    nextTierDays = 14;
    nextTierIcon = "🛡️";
  } else if (streak.currentStreak >= 3) {
    nextTierName = "Fiamma di Costanza";
    nextTierDays = 7;
    nextTierIcon = "🔥";
  }
  const daysToNextTier = Math.max(1, nextTierDays - streak.currentStreak);
  const tierProgressPct = Math.min(100, Math.round((streak.currentStreak / nextTierDays) * 100));

  const workerQuotes = [
    "Studiare la sera dopo 8 ore d'ufficio richiede una determinazione straordinaria. Ogni ora rubata alla stanchezza vale doppio per il tuo 30 a UNIMORE.",
    "La costanza batte l'intensità: 2 ore tutte le sere sono infinitamente più efficaci di 10 ore disperate prima dell'esame.",
    "Non guardare l'intera montagna dei 63 argomenti: concentrati solo sull'argomento di stasera. Un passo alla volta verso il 10 Gennaio 2027.",
    "Se stasera sei stanco dal lavoro, non mollare a zero: fai anche solo 30 minuti o una rapida ripassata di formule [F2]. La streak non si spezza!",
    "Lavoratore di giorno, futuro Ingegnere Informatico di notte: stai compiendo una delle sfide più ambiziose e rispettabili."
  ];
  const quoteIndex = Math.abs((settings.currentSimulatedDate || "").split("-").reduce((acc, c) => acc + c.charCodeAt(0), 0)) % workerQuotes.length;
  const dailyQuote = workerQuotes[quoteIndex];

  const achievements = [
    { id: "first_topic", label: "Primo passo", unlocked: global.completedCount > 0, desc: "Primo argomento chiuso" },
    { id: "dual_subject", label: "Doppio motore", unlocked: analisi.completedHours > 0 && geometria.completedHours > 0, desc: "Analisi e Geometria avviate" },
    { id: "focus_master", label: "Focus", unlocked: metrics.pastDaysStudied > 0, desc: "Sessione di studio svolta" },
    { id: "streak_warrior", label: "Costanza", unlocked: streak.currentStreak >= 3, desc: "Almeno 3 giorni consecutivi" }
  ];

  // --- Intestazione e anelli (tema "Calma, stile Apple") ---
  const fmtNum = (n) => Number(n || 0).toLocaleString("it-IT", { maximumFractionDigits: 1 });
  const parseDay = (s) => new Date(String(s || "") + "T00:00:00");
  const todayStr = settings.currentSimulatedDate;
  const examStr = settings.targetExamDate || DEFAULT_TARGET_EXAM_DATE;
  const startStr = settings.roadmapStartDate || DEFAULT_ROADMAP_START_DATE;
  const heroDateLabel = todayStr
    ? parseDay(todayStr).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })
    : "";
  const examDateLabel = parseDay(examStr).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const plannedToday = Number(todayPlan?.allocatedHours || 0);
  let heroTitle;
  if (todayStr && todayStr === examStr) heroTitle = "Oggi è il giorno dell'esame.";
  else if (todayStr && todayStr > examStr) heroTitle = "Il periodo di studio è concluso.";
  else if (!todayPlan || todayPlan.enabled === false || plannedToday <= 0) heroTitle = "Oggi non c'è studio in programma.";
  else heroTitle = `Oggi, ${fmtNum(plannedToday)} ${plannedToday === 1 ? "ora" : "ore"} di studio.`;

  const roadmapDays = Math.max(1, Math.round((parseDay(examStr) - parseDay(startStr)) / 86400000));
  const elapsedRoadmapDays = Math.round((parseDay(todayStr || startStr) - parseDay(startStr)) / 86400000);
  const elapsedRoadmapPct = Math.min(100, Math.max(0, Math.round((elapsedRoadmapDays / roadmapDays) * 100)));

  const weekRetro = calculateWeeklyRetrospective(currentWeekPlan);
  const weekBudget = Number(((currentWeekPlan?.days || [])
    .filter(d => d.enabled !== false)
    .reduce((acc, d) => acc + Number(d.maxHours || 0), 0)).toFixed(1));
  const pctOf = (v, tot) => (tot > 0 ? Math.min(100, Math.round((v / tot) * 100)) : 0);
  const heroRings = [
    { key: "week", label: "Settimana", value: fmtNum(weekRetro.actualHours), unit: `di ${fmtNum(weekBudget)} h`,
      pct: pctOf(weekRetro.actualHours, weekBudget), radius: 72, color: "#0071E3", track: "#E6F0FC", ink: "#0062C4" },
    { key: "streak", label: "Costanza", value: streak.currentStreak, unit: streak.currentStreak === 1 ? "sera di fila" : "sere di fila",
      pct: pctOf(streak.currentStreak, nextTierDays), radius: 54, color: "#FF9F0A", track: "#FFEBD1", ink: "#B86E00" },
    { key: "program", label: "Programma", value: `${global.percent}%`, unit: `${global.completedCount}/${global.totalCount} argomenti`,
      pct: global.percent, radius: 36, color: "#5E5CE6", track: "#E7E6FB", ink: "#4341C2" }
  ];

  return (
    <div className="space-y-6">
      {/* Intestazione in stile Apple: data, titolo grande e azione principale */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="eyebrow">{heroDateLabel}</div>
          <h2 className="large-title md:text-[40px] mt-1 text-ink">{heroTitle}</h2>
        </div>
        <button
          type="button"
          onClick={() => onOpenLogModal && onOpenLogModal({ date: settings.currentSimulatedDate })}
          className="self-start sm:self-auto flex items-center gap-1.5 h-9 px-4 rounded-full bg-accent-tint text-accent-ink text-sm font-semibold hover:brightness-95 transition shrink-0"
          title="Indica data, ore e argomento: il piano si ribilancia subito"
        >
          <IconPlus className="w-4 h-4" />
          <span>Registra ore di studio</span>
        </button>
      </header>

      {/* Il punto della domenica: numeri concreti della settimana */}
      {todayPlan && todayPlan.dayOfWeek === 0 && currentWeekPlan && (() => {
        const digest = calculateWeeklyDigest(currentWeekPlan, studySessions, topics, mockExams);
        return (
          <section className="bg-paper rounded-[20px] p-5 md:p-6 shadow-card flex flex-col sm:flex-row sm:items-end justify-between gap-4" aria-label="Il punto della domenica">
            <div className="min-w-0 flex flex-col gap-1.5">
              <span className="eyebrow">Il punto della domenica</span>
              <h3 className="text-[22px] font-bold tracking-tight">La tua settimana in numeri</h3>
              <ul className="flex flex-col gap-0.5 text-[14px] text-ink">
                {digest.lines.map(line => <li key={line}>{line}</li>)}
              </ul>
            </div>
            {onOpenRetrospective && (
              <button type="button" onClick={onOpenRetrospective}
                className="self-start sm:self-auto h-10 px-4 rounded-full bg-accent-tint text-accent-ink text-sm font-semibold shrink-0">
                Prepara la prossima settimana
              </button>
            )}
          </section>
        );
      })()}

      {/* Modalità Stasera: una sola azione chiara */}
      <TonightFocus
        focus={getTonightFocus(todayPlan, settings.targetExamDate)}
        settings={settings}
        onLogStudySession={onLogStudySession}
        onOpenTopicDetail={onOpenTopicDetail}
        onOpenLogModal={onOpenLogModal}
        reviewsDue={metrics?.spacedRepetition?.activeReviews?.length || 0}
        reviewsOverdue={metrics?.spacedRepetition?.overdue || 0}
        onOpenReviews={onTabChange ? () => onTabChange("weekly") : undefined}
      />

      {/* Anelli, conto alla rovescia e ritmo richiesto */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.25fr_1fr_1fr] gap-4">
        <div className="bg-paper rounded-[20px] p-5 md:p-6 shadow-card flex items-center gap-6 md:col-span-2 xl:col-span-1">
          <svg width="152" height="152" viewBox="0 0 168 168" className="shrink-0" role="img"
            aria-label={`Anelli: settimana ${heroRings[0].pct}%, costanza ${heroRings[1].pct}%, programma ${heroRings[2].pct}%`}>
            <g transform="rotate(-90 84 84)" fill="none" strokeLinecap="round" strokeWidth="16">
              {heroRings.map(r => {
                const c = 2 * Math.PI * r.radius;
                const len = Math.max(0.001, Math.min(1, r.pct / 100)) * c;
                return (
                  <g key={r.key}>
                    <circle cx="84" cy="84" r={r.radius} stroke={r.track} />
                    {r.pct > 0 && <circle cx="84" cy="84" r={r.radius} stroke={r.color} strokeDasharray={`${len} ${c}`} />}
                  </g>
                );
              })}
            </g>
          </svg>
          <div className="flex flex-col gap-3.5 min-w-0">
            {heroRings.map(r => (
              <div key={r.key} className="flex flex-col">
                <span className="text-xs font-semibold text-ink-2">{r.label}</span>
                <span className="text-[22px] font-bold tracking-tight tabular leading-tight" style={{ color: r.ink }}>
                  {r.value}
                  <span className="text-[13px] font-medium text-ink-2 ml-1">{r.unit}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-paper rounded-[20px] p-5 md:p-6 shadow-card flex flex-col justify-between gap-4">
          <span className="text-[13px] font-semibold text-ink-2">All'esame</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[72px] md:text-[84px] font-extrabold tracking-[-0.06em] leading-[0.9] tabular">{metrics.remainingDays}</span>
            <span className="text-xl font-semibold tracking-tight">{metrics.remainingDays === 1 ? "giorno" : "giorni"}</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-1.5 rounded-full bg-black/[0.07] overflow-hidden">
              <div className="h-full rounded-full bg-ink" style={{ width: `${elapsedRoadmapPct}%` }} />
            </div>
            <span className="text-[13px] text-ink-2 first-letter:uppercase">{examDateLabel}</span>
          </div>
        </div>

        <div className={`rounded-[20px] p-5 md:p-6 flex flex-col justify-between gap-3 ${metrics.isCriticalOverload ? "bg-warn-tint" : "bg-accent-tint"}`}>
          <div className={`flex items-center gap-2 text-[13px] font-semibold ${metrics.isCriticalOverload ? "text-warn-ink" : "text-accent-ink"}`}>
            {metrics.isCriticalOverload ? <IconFlame className="w-4 h-4" /> : <IconClock className="w-4 h-4" />}
            <span>{metrics.isCriticalOverload ? "Ritmo alto" : "Ritmo richiesto"}</span>
          </div>
          <div className="text-[21px] font-bold tracking-tight leading-snug">
            Servono {fmtNum(metrics.requiredWeeklyHours)} h a settimana.
          </div>
          <div className="text-[13px] text-[#3A3A3C] leading-relaxed">
            {metrics.isCriticalOverload
              ? `Più della soglia di ${fmtNum(metrics.criticalWeeklyHoursThreshold)} h che hai scelto. Un'ora in più nel weekend con il Time Shifter riporta il piano in equilibrio.`
              : `Sotto la soglia di ${fmtNum(metrics.criticalWeeklyHoursThreshold)} h.`}
            {" "}Restano {fmtNum(metrics.totalRemainingEffectiveHours)} h, margine incluso (+{fmtNum(metrics.totalBufferHours)} h).
          </div>
        </div>
      </div>

      {/* Costanza e previsione d'esame */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-paper rounded-[20px] p-5 md:p-6 shadow-card flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[13px] font-semibold text-ink-2">Costanza</span>
              <h3 className="text-[22px] font-bold tracking-tight mt-0.5">
                {streak.currentStreak} {streak.currentStreak === 1 ? "sera di fila" : "sere di fila"}
              </h3>
              <p className="text-[13px] text-ink-2 mt-0.5">
                {streak.badgeName}{streak.badgeDesc ? ` · ${streak.badgeDesc}` : ""}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-warn-tint text-warn-ink whitespace-nowrap tabular">
              Record {streak.bestStreak} gg
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between gap-3 text-[13px]">
              <span className="text-ink-2">Prossimo traguardo: <span className="text-ink font-medium">{nextTierName}</span></span>
              <span className="text-ink-2 tabular">{streak.currentStreak}/{nextTierDays}</span>
            </div>
            <div className="h-1.5 rounded-full bg-black/[0.07] overflow-hidden">
              <div className="h-full rounded-full bg-warn transition-all duration-500" style={{ width: `${tierProgressPct}%` }} />
            </div>
            <span className="text-xs text-ink-2">
              Mancano {daysToNextTier} {daysToNextTier === 1 ? "sera" : "sere"}
              {streak.jokersPerMonth > 0 && ` · Jolly del mese: ${streak.jokersLeftThisMonth} su ${streak.jokersPerMonth}`}
              {streak.isRestDayToday && " · Oggi riposo: la serie è al sicuro"}
            </span>
          </div>

          <p className="text-[13px] text-[#3A3A3C] leading-relaxed border-t border-black/[0.06] pt-4">{dailyQuote}</p>

          <div className="flex flex-wrap gap-1.5">
            {achievements.map(ach => (
              <span
                key={ach.id}
                title={`${ach.label}: ${ach.desc} (${ach.unlocked ? "sbloccato" : "da sbloccare"})`}
                className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                  ach.unlocked ? "bg-ok-tint text-ok-ink" : "bg-black/[0.04] text-ink-3"
                }`}
              >
                {ach.unlocked && <IconCheck className="w-3 h-3" />}
                {ach.label}
              </span>
            ))}
          </div>
        </section>

        {metrics?.examPrediction && (
          <section className="bg-paper rounded-[20px] p-5 md:p-6 shadow-card flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[13px] font-semibold text-ink-2">Previsione d'esame</span>
                <h3 className="text-[22px] font-bold tracking-tight mt-0.5">Voto stimato {metrics.examPrediction.gradeLabel}</h3>
                <p className="text-[13px] text-ink-2 mt-0.5">
                  {metrics.examPrediction.mockBased
                    ? `Stima basata sui temi d'esame a tempo (media recente ${metrics.examPrediction.mockRecentPct}%), oltre a esercizi, ritmo e costanza.`
                    : metrics.examPrediction.masteryBased
                    ? "Stima basata sugli esercizi svolti senza appunti, oltre a ritmo e costanza."
                    : `Stima basata su ore e costanza. Registra almeno ${MASTERY_MIN_ATTEMPTS} esercizi senza appunti per misurare la padronanza.`}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                {
                  emerald: "bg-ok-tint text-ok-ink",
                  cyan: "bg-accent-tint text-accent-ink",
                  amber: "bg-warn-tint text-warn-ink"
                }[metrics.examPrediction.riskColor] || "bg-warn-tint text-warn-ink"
              }`}>
                {metrics.examPrediction.riskLevel}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-auto">
              {[
                { label: "Probabilità", value: `${metrics.examPrediction.passProbability}%` },
                { label: "Esercizi giusti", value: metrics.examPrediction.masteryAttempts > 0
                  ? `${metrics.examPrediction.masteryAccuracy}%` : "—" },
                { label: "Sere attive", value: `${metrics.examPrediction.consistencyRate}%` },
                { label: "Argomenti chiusi", value: `${metrics.examPrediction.completionPercent}%` }
              ].map(tile => (
                <div key={tile.label} className="bg-canvas rounded-xl p-3">
                  <div className="text-xs text-ink-2">{tile.label}</div>
                  <div className="text-lg font-bold tracking-tight tabular mt-0.5">{tile.value}</div>
                </div>
              ))}
            </div>

            {metrics.mastery && metrics.mastery.weakTopics.length > 0 && (
              <div className="flex flex-col gap-1.5 border-t border-black/[0.06] pt-3">
                <span className="text-[13px] font-semibold text-ink-2">Da consolidare</span>
                <div className="flex flex-wrap gap-1.5">
                  {metrics.mastery.weakTopics.slice(0, 4).map(w => (
                    <button key={w.topicId} type="button"
                      onClick={() => onOpenTopicDetail && onOpenTopicDetail(w.topicId)}
                      className="text-xs font-medium px-2.5 py-1 rounded-full bg-warn-tint text-warn-ink hover:brightness-95"
                      title={`${w.level.label}: ${w.correct} giusti su ${w.attempts}`}>
                      {w.topicId} · {w.correct} su {w.attempts}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Temi d'esame settimanali a tempo */}
      <MockExamPanel
        stats={metrics.mockExams}
        settings={settings}
        mockExams={mockExams}
        onSaveMockExam={onSaveMockExam}
        onDeleteMockExam={onDeleteMockExam}
      />

      {/* Dettagli e strumenti: chiusi di default per tenere la dashboard essenziale */}
      <section className="flex flex-col gap-5">
        <button
          type="button"
          onClick={toggleDetails}
          aria-expanded={isDetailsOpen}
          className="self-start h-9 px-4 rounded-full bg-fill text-ink-2 hover:text-ink text-[13px] font-semibold flex items-center gap-2 transition"
        >
          <span>{isDetailsOpen ? "Nascondi dettagli e strumenti" : "Dettagli e strumenti"}</span>
          <span aria-hidden="true" className={`transition-transform ${isDetailsOpen ? "rotate-180" : ""}`}>⌄</span>
        </button>
        {!isDetailsOpen && (
          <p className="text-[12px] text-ink-3 -mt-2">Avanzamento per materia, burndown, flashcard, simulatore e registro errori.</p>
        )}
        {isDetailsOpen && (
          <div className="flex flex-col gap-5">
            {/* Main Two Progress Bars with Real-Time Pacing Indicators (Analisi 1 & Geometria) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Analisi 1 Progress Card with Pacing Indicator */}
              <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-indigo-500/20 p-5 md:p-6 rounded-3xl shadow-xl shadow-indigo-950/10 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          ANALISI MATEMATICA 1
                        </span>
                        <span className="text-xs text-slate-400">UNIMORE</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mt-1">Stato Avanzamento Analisi</h3>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-3xl font-black text-indigo-400 font-mono leading-none">
                        {analisi.percent}%
                      </span>
                      <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border mt-1.5 ${pacingAnalisi.badgeClass}`}>
                        {pacingAnalisi.badge}
                      </span>
                    </div>
                  </div>

                  {/* Pacing Feedback Banner for Analisi */}
                  <div className={`p-3 rounded-2xl border text-xs leading-relaxed mb-4 bg-slate-950/80 ${pacingAnalisi.borderClass}`}>
                    <div className="flex items-center justify-between mb-1 text-[11px] font-mono">
                      <span className="text-slate-400">Target teorico a oggi: <strong>{pacingAnalisi.expectedHours}h</strong> ({pacingAnalisi.expectedPercent}%)</span>
                      <span className={pacingAnalisi.textClass}>Svolte: <strong>{analisi.completedHours}h</strong></span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      {pacingAnalisi.message}
                    </p>
                  </div>

                  {/* Progress Bar Analisi with Target Marker */}
                  <div className="space-y-1.5 mb-4">
                    <div className="relative w-full h-4 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-700 ease-out shadow-sm shadow-indigo-500/50"
                        style={{ width: `${Math.max(2, analisi.percent)}%` }}
                      />
                      {/* Expected Target Tick Marker */}
                      {pacingAnalisi.expectedPercent > 0 && pacingAnalisi.expectedPercent < 100 && (
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10 shadow-sm"
                          style={{ left: `${pacingAnalisi.expectedPercent}%` }}
                          title={`Target atteso a oggi: ${pacingAnalisi.expectedPercent}%`}
                        />
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                      <span>{analisi.completedHours}h completate ({analisi.completedCount} temi)</span>
                      <span className="text-slate-300 font-semibold">{analisi.totalHours}h previste (32 temi)</span>
                    </div>
                  </div>

                  {/* Detailed stats */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center">
                    <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400">Argomenti</div>
                      <div className="text-sm font-bold text-white font-mono mt-0.5">
                        {analisi.completedCount} / {analisi.totalCount}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400">Ore Residue</div>
                      <div className="text-sm font-bold text-indigo-300 font-mono mt-0.5">
                        {analisi.remainingHours}h
                      </div>
                    </div>
                    <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400">Esame Scritto</div>
                      <div className="text-sm font-bold text-slate-200 mt-0.5">
                        5-6 Esercizi
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Focus: Taylor, Integrali, Studio Funzione, Serie
                  </span>
                  <button
                    onClick={() => onTabChange("weekly")}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
                  >
                    Vedi orari Analisi →
                  </button>
                </div>
              </div>

              {/* Geometria Progress Card with Pacing Indicator */}
              <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-teal-500/20 p-5 md:p-6 rounded-3xl shadow-xl shadow-teal-950/10 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                          GEOMETRIA E ALGEBRA
                        </span>
                        <span className="text-xs text-slate-400">UNIMORE</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mt-1">Stato Avanzamento Geometria</h3>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-3xl font-black text-teal-400 font-mono leading-none">
                        {geometria.percent}%
                      </span>
                      <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border mt-1.5 ${pacingGeometria.badgeClass}`}>
                        {pacingGeometria.badge}
                      </span>
                    </div>
                  </div>

                  {/* Pacing Feedback Banner for Geometria */}
                  <div className={`p-3 rounded-2xl border text-xs leading-relaxed mb-4 bg-slate-950/80 ${pacingGeometria.borderClass}`}>
                    <div className="flex items-center justify-between mb-1 text-[11px] font-mono">
                      <span className="text-slate-400">Target teorico a oggi: <strong>{pacingGeometria.expectedHours}h</strong> ({pacingGeometria.expectedPercent}%)</span>
                      <span className={pacingGeometria.textClass}>Svolte: <strong>{geometria.completedHours}h</strong></span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      {pacingGeometria.message}
                    </p>
                  </div>

                  {/* Progress Bar Geometria with Target Marker */}
                  <div className="space-y-1.5 mb-4">
                    <div className="relative w-full h-4 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-700 ease-out shadow-sm shadow-teal-500/50"
                        style={{ width: `${Math.max(2, geometria.percent)}%` }}
                      />
                      {/* Expected Target Tick Marker */}
                      {pacingGeometria.expectedPercent > 0 && pacingGeometria.expectedPercent < 100 && (
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10 shadow-sm"
                          style={{ left: `${pacingGeometria.expectedPercent}%` }}
                          title={`Target atteso a oggi: ${pacingGeometria.expectedPercent}%`}
                        />
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                      <span>{geometria.completedHours}h completate ({geometria.completedCount} temi)</span>
                      <span className="text-slate-300 font-semibold">{geometria.totalHours}h previste (31 temi)</span>
                    </div>
                  </div>

                  {/* Detailed stats */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center">
                    <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400">Argomenti</div>
                      <div className="text-sm font-bold text-white font-mono mt-0.5">
                        {geometria.completedCount} / {geometria.totalCount}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400">Ore Residue</div>
                      <div className="text-sm font-bold text-teal-300 font-mono mt-0.5">
                        {geometria.remainingHours}h
                      </div>
                    </div>
                    <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400">Test Scritto</div>
                      <div className="text-sm font-bold text-slate-200 mt-0.5">
                        11 Domande Quiz
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Focus: Rouché-Capelli, Autovalori, Coniche, Spazi Vettoriali
                  </span>
                  <button
                    onClick={() => onTabChange("weekly")}
                    className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition flex items-center gap-1"
                  >
                    Vedi orari Geometria →
                  </button>
                </div>
              </div>
            </div>

            {/* Agile / Scrum Burndown Progress Chart (Punto 18) */}
            <BurndownChart
              metrics={metrics}
              progress={progress}
              settings={settings}
            />

            {/* AI Study Tools Row (Phase 2 Refactoring) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Tool 1: NeuraDeck Flashcards (NotebookLM) */}
              <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-cyan-950/40 border border-cyan-500/30 p-5 md:p-6 rounded-3xl shadow-xl shadow-cyan-950/20 relative overflow-hidden flex flex-col justify-between group hover:border-cyan-500/50 transition">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        NotebookLM • CSV Raw
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Fase 2 AI</span>
                    </div>
                    <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl group-hover:scale-110 transition">
                      <IconSparkles className="w-5 h-5" />
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-white">Generatore Flashcard NeuraDeck</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Filtra in automatico gli argomenti completati nell'ultima settimana e compone il prompt ottimizzato per NotebookLM per estrarre le flashcard nel formato <code>Fronte,Retro</code> pronto all'import.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-cyan-400/80 font-mono">
                    Analisi 1 & Geometria
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsFlashcardsOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition active:scale-95"
                  >
                    <IconSparkles className="w-4 h-4 text-slate-950" />
                    <span>Genera Flashcard</span>
                  </button>
                </div>
              </div>

              {/* Tool 2: Exam Simulator (Claude / ChatGPT) */}
              <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/40 border border-indigo-500/30 p-5 md:p-6 rounded-3xl shadow-xl shadow-indigo-950/20 relative overflow-hidden flex flex-col justify-between group hover:border-indigo-500/50 transition">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        UNIMORE Scritto • 120m/90m
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Priorità ≥ 3</span>
                    </div>
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:scale-110 transition">
                      <IconDice className="w-5 h-5" />
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-white">Simulatore d'Esame Live</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Estrae compiti ufficiali cronometrati (120m per Analisi, 90m per Geometria), fornisce autovalutazione passaggio per passaggio e stima il voto d'esame in trentesimi (/30).
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-indigo-400/80 font-mono">
                    6 Esercizi o 11 Quiz
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsExamSimulatorOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-indigo-500/20 transition active:scale-95"
                  >
                    <IconDice className="w-4 h-4 text-white" />
                    <span>Avvia Simulazione</span>
                  </button>
                </div>
              </div>

              {/* Tool 3: Math Bug Tracker (Registro Errori) */}
              <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-rose-950/40 border border-rose-500/30 p-5 md:p-6 rounded-3xl shadow-xl shadow-rose-950/20 relative overflow-hidden flex flex-col justify-between group hover:border-rose-500/50 transition">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Anti-Trabocchetto
                      </span>
                      <span className="text-[10px] text-rose-300 font-mono">
                        {mathBugs.filter(b => !b.isResolved).length} aperti
                      </span>
                    </div>
                    <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl group-hover:scale-110 transition">
                      <IconBug className="w-5 h-5" />
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-white">Bug Tracker Matematico</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Traccia e debella gli errori ricorrenti commessi durante gli esercizi (segni nei determinanti, o-piccolo di Taylor, ipotesi di De L'Hôpital) prima dell'appello d'esame.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-mono">
                    {mathBugs.filter(b => b.isResolved).length} padroneggiati
                  </span>
                  <button
                    type="button"
                    onClick={onOpenBugTracker}
                    className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-rose-600/20 transition active:scale-95"
                  >
                    <IconBug className="w-4 h-4 text-white" />
                    <span>Apri Bug Tracker</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Global Progress Strip */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5 w-full md:w-auto">
                <div className="p-3 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-xl text-white shadow-md">
                  <IconBookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Riepilogo Globale del Piano di Studio</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Totale {global.totalCount} argomenti ({global.completedCount} completati, {metrics.uncompletedCount} rimanenti).
                  </p>
                </div>
              </div>

              <div className="w-full md:w-72 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300 font-medium">
                  <span>Avanzamento Totale</span>
                  <span className="font-mono text-cyan-400">{global.percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(2, global.percent)}%` }}
                  />
                </div>
              </div>
            </div>

          </div>
        )}
      </section>

      {/* Interactive Tool Modals */}
      <NeuraDeckPromptGenerator
        isOpen={isFlashcardsOpen}
        onClose={() => setIsFlashcardsOpen(false)}
        topics={topics}
        settings={settings}
      />

      <ExamSimulator
        isOpen={isExamSimulatorOpen}
        onClose={() => setIsExamSimulatorOpen(false)}
        topics={topics}
        settings={settings}
      />
    </div>
  );
}
