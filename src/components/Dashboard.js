import React from "react";
import { IconClock, IconCalendar, IconBookOpen, IconBarChart, IconCheckCircle, IconFlame } from "./Icons.js";

export function Dashboard({ progress, metrics, onTabChange }) {
  const { analisi, geometria, global } = progress;

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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
  );
}
