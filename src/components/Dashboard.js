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
  IconBug
} from "./Icons.js";
import { NeuraDeckPromptGenerator } from "./NeuraDeckPromptGenerator.js";
import { ExamSimulator } from "./ExamSimulator.js";
import { BurndownChart } from "./BurndownChart.js";

/**
 * Calculates whether the student is ahead, on track, or behind schedule for a subject
 */
function getSubjectPacing(subjectData, currentSimulatedDate, roadmapStartDate = "2026-11-16", targetExamDate = "2027-01-10") {
  const start = new Date(roadmapStartDate + "T00:00:00");
  const end = new Date(targetExamDate + "T00:00:00");
  const current = new Date((currentSimulatedDate || "2026-11-18") + "T00:00:00");

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

export function Dashboard({
  progress,
  metrics,
  onTabChange,
  topics = [],
  settings = {},
  onOpenLogModal,
  onOpenTopicDetail,
  onToggleSpacedReview,
  mathBugs = [],
  onOpenBugTracker
}) {
  const { analisi, geometria, global } = progress;
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isExamSimulatorOpen, setIsExamSimulatorOpen] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Quick Action Banner for Logging Study */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-teal-950/40 border border-emerald-500/30 rounded-3xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md shadow-lg">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-500/20">
            +
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
              <span>Registra Sessione di Studio</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                Adattamento Dinamico
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Hai svolto ore di studio oggi o in una data passata? Clicca qui per indicare data, ore e argomento: il resto si adatterà in tempo reale!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenLogModal && onOpenLogModal({ date: settings.currentSimulatedDate })}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-lg shadow-emerald-500/20 border border-emerald-400/30 transition transform active:scale-95 flex-shrink-0"
        >
          <span className="text-base font-black leading-none">+</span>
          <span>Registra Ore di Studio</span>
        </button>
      </div>

      {/* Spaced Repetition Active Alert Banner if any due */}
      {metrics?.spacedRepetition?.activeReviews?.length > 0 && (
        <div className="bg-gradient-to-r from-purple-950/60 via-indigo-950/50 to-slate-900/80 border border-purple-500/40 rounded-3xl p-4 md:p-5 backdrop-blur-md shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-black text-xl shadow-md shadow-purple-500/20 flex-shrink-0">
              🧠
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                <span>Ripassi Spaced Repetition in Scadenza ({metrics.spacedRepetition.activeReviews.length})</span>
                <span className="text-[10px] bg-purple-500/30 text-purple-200 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono">
                  Curva di Ebbinghaus
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Hai {metrics.spacedRepetition.dueToday} ripassi previsti per oggi e {metrics.spacedRepetition.overdue} arretrati. Dedica 15 minuti a ripassare teoremi e formule prima di procedere!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onTabChange && onTabChange("weekly")}
            className="w-full md:w-auto px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/50 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 flex-shrink-0"
          >
            <span>Vai al To-Do per Ripassare</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 2xl:gap-6">
        {/* Days Left */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Target Esame</span>
            <div className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-400">
              <IconCalendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">
              {metrics.remainingDays}
            </span>
            <span className="text-xs text-slate-400 font-medium">giorni</span>
          </div>
          <div className="mt-1 text-xs text-cyan-400 flex items-center gap-1 font-medium">
            <span>10 Gennaio 2027</span>
            <span className="text-slate-500">({metrics.remainingWeeks} sett.)</span>
          </div>
        </div>

        {/* Weekly Pace */}
        <div className={`p-4 rounded-2xl backdrop-blur-md relative overflow-hidden group transition border ${
          metrics.isCriticalOverload
            ? "bg-rose-950/40 border-rose-500/40 hover:border-rose-500/60"
            : "bg-slate-900/80 border-slate-800/80 hover:border-slate-700"
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Fabbisogno Sett.</span>
            <div className={`p-1.5 rounded-lg ${
              metrics.isCriticalOverload ? "bg-rose-500/20 text-rose-400" : "bg-indigo-500/10 text-indigo-400"
            }`}>
              <IconClock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className={`text-2xl md:text-3xl font-extrabold font-mono ${
              metrics.isCriticalOverload ? "text-rose-300" : "text-white"
            }`}>
              {metrics.requiredWeeklyHours}
            </span>
            <span className="text-xs text-slate-400 font-medium">h / sett.</span>
          </div>
          <div className="mt-1 text-xs flex items-center gap-1 font-medium">
            {metrics.isCriticalOverload ? (
              <span className="text-rose-400 flex items-center gap-1">
                <IconFlame className="w-3.5 h-3.5" /> Soglia max superata
              </span>
            ) : (
              <span className="text-emerald-400">Ritmo sostenibile</span>
            )}
          </div>
        </div>

        {/* Remaining Hours */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Ore Residue</span>
            <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400">
              <IconBarChart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">
              {metrics.totalRemainingEffectiveHours}
            </span>
            <span className="text-xs text-slate-400 font-medium">h effettive</span>
          </div>
          <div className="mt-1 text-xs text-amber-400/90 font-medium flex items-center gap-1">
            <span>+{metrics.totalBufferHours}h buffer (+20%)</span>
          </div>
        </div>

        {/* Progress Global */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Completamento</span>
            <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
              <IconCheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">
              {global.percent}%
            </span>
            <span className="text-xs text-slate-400 font-medium">complessivo</span>
          </div>
          <div className="mt-1 text-xs text-slate-400 font-medium">
            <span>{global.completedHours}h di {global.totalHours}h svolte</span>
          </div>
        </div>
      </div>

      {/* Motivation & Streak Hub (Centrale della Costanza Lavoratore) */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/25 to-slate-900 border border-amber-500/40 p-5 md:p-6 rounded-3xl shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          {/* Left: Streak Icon & Big Number */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 border border-amber-400/50 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/25">
                🔥
              </div>
              {streak.currentStreak > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-slate-950"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span>STREAK DI STUDIO ATTIVA</span>
                </span>
                <span className="text-xs text-slate-400">
                  Record: <strong className="text-white font-mono">{streak.bestStreak} gg</strong>
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                {streak.currentStreak} {streak.currentStreak === 1 ? "Giorno Consecutivo" : "Giorni Consecutivi"}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                <span className="text-base">{streak.badgeIcon}</span>
                <strong className="text-amber-300 font-bold">{streak.badgeName}</strong>
                <span className="text-slate-400 hidden sm:inline">• {streak.badgeDesc}</span>
              </p>
            </div>
          </div>

          {/* Right: Next Level Progression Bar */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[280px]">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl flex-1">
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-400">Prossimo Titolo:</span>
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  {nextTierIcon} {nextTierName}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${tierProgressPct}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex justify-between font-mono">
                <span>{streak.currentStreak} / {nextTierDays} giorni</span>
                <span className="text-amber-400 font-bold">Mancano {daysToNextTier} {daysToNextTier === 1 ? "sera" : "sere"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Quote & 4 Achievement Badges */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Worker Daily Quote */}
          <div className="flex items-start space-x-2 text-xs text-slate-300 italic max-w-2xl">
            <span className="text-amber-400 text-lg leading-none font-serif flex-shrink-0">“</span>
            <span>{dailyQuote}</span>
          </div>

          {/* 4 Mini Achievement Badges */}
          <div className="flex items-center gap-1.5 flex-wrap flex-shrink-0">
            {[
              {
                id: "first_topic",
                icon: "🌟",
                label: "Primo Passo",
                unlocked: global.completedCount > 0,
                desc: "Primo argomento chiuso"
              },
              {
                id: "dual_subject",
                icon: "⚔️",
                label: "Doppio Motore",
                unlocked: analisi.completedHours > 0 && geometria.completedHours > 0,
                desc: "Analisi e Geometria avviate"
              },
              {
                id: "focus_master",
                icon: "🍅",
                label: "Focus Master",
                unlocked: metrics.pastDaysStudied > 0,
                desc: "Sessione di studio svolta"
              },
              {
                id: "streak_warrior",
                icon: "🛡️",
                label: "Costanza",
                unlocked: streak.currentStreak >= 3,
                desc: "Almeno 3gg consecutivi"
              }
            ].map(ach => (
              <div
                key={ach.id}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[10px] font-bold border transition ${
                  ach.unlocked
                    ? "bg-amber-500/20 text-amber-200 border-amber-500/40 shadow-sm"
                    : "bg-slate-950/40 text-slate-600 border-slate-800 opacity-60"
                }`}
                title={`${ach.label}: ${ach.desc} ${ach.unlocked ? '(Sbloccato! ✓)' : '(Da sbloccare)'}`}
              >
                <span>{ach.icon}</span>
                <span className="hidden sm:inline">{ach.label}</span>
                {ach.unlocked && <span className="text-emerald-400">✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heuristic Exam Prediction & Grade Forecast (Punto 4) */}
      {metrics?.examPrediction && (
        <div className={`p-5 rounded-3xl border backdrop-blur-md shadow-xl transition ${
          metrics.examPrediction.riskColor === "emerald"
            ? "bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-teal-950/40 border-emerald-500/30 shadow-emerald-950/20"
            : metrics.examPrediction.riskColor === "cyan"
            ? "bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-indigo-950/40 border-cyan-500/30 shadow-cyan-950/20"
            : metrics.examPrediction.riskColor === "amber"
            ? "bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-orange-950/40 border-amber-500/30 shadow-amber-950/20"
            : "bg-gradient-to-r from-rose-950/50 via-slate-900/90 to-red-950/40 border-rose-500/40 shadow-rose-950/30"
        }`}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border flex-shrink-0 ${
                metrics.examPrediction.riskColor === "emerald"
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : metrics.examPrediction.riskColor === "cyan"
                  ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                  : metrics.examPrediction.riskColor === "amber"
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "bg-rose-500/20 border-rose-500/40 text-rose-300"
              }`}>
                🎯
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-extrabold text-white">
                    Previsione Esame & Voto Atteso
                  </h3>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    metrics.examPrediction.riskColor === "emerald"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : metrics.examPrediction.riskColor === "cyan"
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : metrics.examPrediction.riskColor === "amber"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                  }`}>
                    {metrics.examPrediction.riskLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Algoritmo euristico predittivo basato su ritmo orario, costanza serale e completamento temi propedeutici.
                </p>
              </div>
            </div>

            {/* Score & Probability Badges */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              <div className="bg-slate-950/80 border border-slate-800 p-2.5 px-3.5 rounded-2xl text-center">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Probabilità Superamento
                </span>
                <span className={`text-xl font-black font-mono ${
                  metrics.examPrediction.passProbability >= 70 ? "text-emerald-400" : "text-amber-400"
                }`}>
                  {metrics.examPrediction.passProbability}%
                </span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-2.5 px-3.5 rounded-2xl text-center">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Voto Stimato
                </span>
                <span className="text-xl font-black text-cyan-300 font-mono">
                  {metrics.examPrediction.gradeLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Sub-metrics breakdown */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
            <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/60 text-center">
              <span className="text-slate-400 text-[10px] block">Passo Richiesto</span>
              <strong className="text-slate-200 font-mono">{metrics.examPrediction.requiredWeeklyHours}h / sett.</strong>
            </div>
            <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/60 text-center">
              <span className="text-slate-400 text-[10px] block">Indice di Costanza</span>
              <strong className="text-slate-200 font-mono">{metrics.examPrediction.consistencyRate}% sere attive</strong>
            </div>
            <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/60 text-center">
              <span className="text-slate-400 text-[10px] block">Completamento Didattico</span>
              <strong className="text-slate-200 font-mono">{metrics.examPrediction.completionPercent}% argomenti</strong>
            </div>
          </div>
        </div>
      )}

      {/* Main Two Progress Bars with Real-Time Pacing Indicators (Analisi 1 & Geometria) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Analisi 1 Progress Card with Pacing Indicator */}
        <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-500/20 p-5 md:p-6 rounded-3xl shadow-xl shadow-emerald-950/10 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ANALISI MATEMATICA 1
                  </span>
                  <span className="text-xs text-slate-400">UNIMORE</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">Stato Avanzamento Analisi</h3>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-3xl font-black text-emerald-400 font-mono leading-none">
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
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-700 ease-out shadow-sm shadow-emerald-500/50"
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
                <div className="text-sm font-bold text-emerald-300 font-mono mt-0.5">
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
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
            >
              Vedi orari Analisi →
            </button>
          </div>
        </div>

        {/* Geometria Progress Card with Pacing Indicator */}
        <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-indigo-500/20 p-5 md:p-6 rounded-3xl shadow-xl shadow-indigo-950/10 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    GEOMETRIA E ALGEBRA
                  </span>
                  <span className="text-xs text-slate-400">UNIMORE</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">Stato Avanzamento Geometria</h3>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-3xl font-black text-indigo-400 font-mono leading-none">
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
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full transition-all duration-700 ease-out shadow-sm shadow-indigo-500/50"
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
                <div className="text-sm font-bold text-indigo-300 font-mono mt-0.5">
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
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
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
