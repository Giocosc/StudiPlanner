import React, { useMemo } from "react";
import { IconCheckCircle, IconFlame, IconClock, IconCalendar, IconCheck, IconX } from "./Icons.js";

export function WeeklyRetrospectiveModal({
  isOpen,
  onClose,
  weeklyPlans = [],
  settings = {},
  metrics = {},
  customDayCapacities = {},
  onBatchUpdateDayCapacities
}) {
  if (!isOpen) return null;

  // Find the current active week
  const activeWeek = useMemo(() => {
    return weeklyPlans.find(w => w.hasToday) || weeklyPlans[0] || null;
  }, [weeklyPlans]);

  // Compute stats for this week
  const weekStats = useMemo(() => {
    if (!activeWeek || !activeWeek.days) {
      return { targetHours: 0, actualHours: 0, completedTopics: [], remainingTopics: [], efficiency: 0 };
    }

    const targetHours = activeWeek.totalAllocatedHours || 0;
    let actualHours = 0;
    const completedTopics = [];
    const remainingTopics = [];

    activeWeek.days.forEach(day => {
      actualHours += Number(day.studiedHours || 0);
      (day.scheduledTopics || day.topics || []).forEach(t => {
        const isDone = Boolean(t.isCompleted || t.completato);
        if (isDone) {
          if (!completedTopics.some(x => x.id === t.id)) completedTopics.push(t);
        } else {
          if (!remainingTopics.some(x => x.id === t.id)) remainingTopics.push(t);
        }
      });
    });

    const efficiency = targetHours > 0 ? Math.min(150, Math.round((actualHours / targetHours) * 100)) : 100;

    return {
      targetHours,
      actualHours: Number(actualHours.toFixed(1)),
      completedTopics,
      remainingTopics,
      efficiency
    };
  }, [activeWeek]);

  // Auto-apply +30m for the next work week (Monday to Friday)
  const handleBoostNextWeek = () => {
    if (!onBatchUpdateDayCapacities || !activeWeek || !activeWeek.days) return;

    // Find days of current/next week
    const updates = {};
    activeWeek.days.forEach(d => {
      if (!d.isWeekend) {
        updates[d.date] = 3.0; // Boost to 3h/evening (2.5h + 30m)
      }
    });

    onBatchUpdateDayCapacities(updates);
    onClose();
  };

  const getDiagnostics = () => {
    if (weekStats.efficiency >= 95) {
      return {
        title: "🏆 Settimana Esemplare da Lavoratore!",
        color: "emerald",
        advice: "Hai mantenuto una costanza impeccabile nelle sessioni serali e nel weekend. Non sovraccaricarti: continua con il regime base di 2.5h/sera."
      };
    }
    if (weekStats.efficiency >= 70) {
      return {
        title: "⚡ Buon Ritmo & Buona Tenuta",
        color: "cyan",
        advice: "Sei riuscito a recuperare parte del lavoro nel weekend. Il Rolling Rebalancer ha già riassorbito gli argomenti senza creare picchi critici."
      };
    }
    return {
      title: "⚠️ Carico Accumulato & Allineamento",
      color: "amber",
      advice: "Gli straordinari o imprevisti lavorativi hanno ridotto le ore serali. Gli argomenti non svolti sono slittati in avanti. Consigliato: applica uno slot extra di +30m nelle prossime sere feriali."
    };
  };

  const diag = getDiagnostics();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0b101e] border border-cyan-500/30 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <IconCalendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">
                  Retrospezione Settimanale
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  Domenica Sera
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Riepilogo ore studiate, chiusura argomenti e raccomandazioni per il lavoro e lo studio serale.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 text-xs text-slate-300">
          {/* Key KPI Strip */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ore Target</span>
              <strong className="text-lg font-black font-mono text-white mt-0.5 block">{weekStats.targetHours}h</strong>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ore Effettive</span>
              <strong className="text-lg font-black font-mono text-cyan-400 mt-0.5 block">{weekStats.actualHours}h</strong>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Efficienza</span>
              <strong className={`text-lg font-black font-mono mt-0.5 block ${
                weekStats.efficiency >= 80 ? "text-emerald-400" : "text-amber-400"
              }`}>
                {weekStats.efficiency}%
              </strong>
            </div>
          </div>

          {/* Diagnostic Message */}
          <div className={`p-4 rounded-2xl border ${
            diag.color === "emerald"
              ? "bg-emerald-950/25 border-emerald-500/30 text-emerald-200"
              : diag.color === "cyan"
              ? "bg-cyan-950/25 border-cyan-500/30 text-cyan-200"
              : "bg-amber-950/25 border-amber-500/30 text-amber-200"
          }`}>
            <h4 className="font-bold text-sm mb-1">{diag.title}</h4>
            <p className="leading-relaxed text-[11px] opacity-90">{diag.advice}</p>
          </div>

          {/* Topics Completed & In-Progress */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Argomenti Didattici della Settimana:
            </h5>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {weekStats.completedTopics.map(t => (
                <div key={t.id} className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-emerald-400">[{t.id}]</span>
                    <span className="text-white">{t.argomento || t.titolo}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    ✓ Chiuso
                  </span>
                </div>
              ))}

              {weekStats.remainingTopics.map(t => (
                <div key={t.id} className="p-2.5 bg-slate-950/40 border border-slate-800/80 rounded-xl flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-amber-400">[{t.id}]</span>
                    <span className="text-slate-300">{t.argomento || t.titolo}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                    Slittato in avanti
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={handleBoostNextWeek}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl transition shadow-md"
          >
            ⚡ Applica +30m Serale Prossima Settimana (3h/sera)
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition"
          >
            Chiudi Retrospezione
          </button>
        </div>
      </div>
    </div>
  );
}
