import React, { useState } from "react";
import {
  IconClock,
  IconCalendar,
  IconBookOpen,
  IconBarChart,
  IconCheckCircle,
  IconFlame,
  IconSparkles,
  IconDice
} from "./Icons.js";
import { NeuraDeckPromptGenerator } from "./NeuraDeckPromptGenerator.js";
import { ExamSimulator } from "./ExamSimulator.js";

export function Dashboard({
  progress,
  metrics,
  onTabChange,
  topics = [],
  settings = {},
  onOpenLogModal,
  onOpenTopicDetail,
  onToggleSpacedReview
}) {
  const { analisi, geometria, global } = progress;
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isExamSimulatorOpen, setIsExamSimulatorOpen] = useState(false);

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

      {/* Main Two Progress Bars (Analisi 1 & Geometria) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Analisi 1 Progress Card */}
        <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-500/20 p-5 md:p-6 rounded-3xl shadow-xl shadow-emerald-950/10 relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ANALISI MATEMATICA 1
                </span>
                <span className="text-xs text-slate-400">UNIMORE</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Stato Avanzamento Analisi</h3>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-emerald-400 font-mono">
                {analisi.percent}%
              </span>
            </div>
          </div>

          {/* Progress Bar Analisi */}
          <div className="space-y-2 mb-4">
            <div className="w-full h-4 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-700 ease-out shadow-sm shadow-emerald-500/50"
                style={{ width: `${Math.max(2, analisi.percent)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>{analisi.completedHours}h completate</span>
              <span className="text-slate-300 font-semibold">{analisi.totalHours}h previste</span>
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

          <div className="mt-4 flex items-center justify-between">
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

        {/* Geometria Progress Card */}
        <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-indigo-500/20 p-5 md:p-6 rounded-3xl shadow-xl shadow-indigo-950/10 relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  GEOMETRIA E ALGEBRA
                </span>
                <span className="text-xs text-slate-400">UNIMORE</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Stato Avanzamento Geometria</h3>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-indigo-400 font-mono">
                {geometria.percent}%
              </span>
            </div>
          </div>

          {/* Progress Bar Geometria */}
          <div className="space-y-2 mb-4">
            <div className="w-full h-4 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full transition-all duration-700 ease-out shadow-sm shadow-indigo-500/50"
                style={{ width: `${Math.max(2, geometria.percent)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>{geometria.completedHours}h completate</span>
              <span className="text-slate-300 font-semibold">{geometria.totalHours}h previste</span>
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

          <div className="mt-4 flex items-center justify-between">
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

      {/* AI Study Tools Row (Phase 2 Refactoring) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  UNIMORE Scritto • Claude/GPT
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Priorità ≥ 3</span>
              </div>
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:scale-110 transition">
                <IconDice className="w-5 h-5" />
              </div>
            </div>

            <h4 className="text-lg font-bold text-white">Simulatore d'Esame Dinamico</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Estrae casualmente 6 argomenti per Analisi 1 o 11 per Geometria tra quelli completati con Priorità ≥ 3 e compone il prompt d'esame in Markdown per Claude o ChatGPT con spazio di svolgimento.
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
