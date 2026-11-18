import React, { useState } from "react";
import { IconHistory, IconCheckCircle, IconClock, IconFlame, IconCheck, IconCalendar, IconTrash } from "./Icons.js";
import { ActivityHeatmap } from "./ActivityHeatmap.js";

export function HistoryLog({
  historyDays,
  calendarDays = [],
  metrics,
  onAdvanceDate,
  onRetrocedeDate,
  onSetDate,
  onOpenLogModal,
  onDeleteSession,
  onOpenTopicDetail
}) {
  const [filterType, setFilterType] = useState("all"); // "all" | "completed" | "skipped"

  const filteredHistory = historyDays.filter(day => {
    if (filterType === "completed") return day.dayStatus === "completed";
    if (filterType === "skipped") return day.dayStatus === "skipped";
    return true;
  });

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="space-y-6">
      {/* Historical Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Data Attiva (Oggi)
          </div>
          <div className="text-xl md:text-2xl font-black text-cyan-300 font-mono">
            {formatDateDisplay(metrics.currentSimulatedDate)}
          </div>
          <div className="flex items-center space-x-1.5 mt-2">
            <button
              onClick={onRetrocedeDate}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-bold"
              title="Giorno precedente"
            >
              ◀ Ieri
            </button>
            <button
              onClick={onAdvanceDate}
              className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[11px] font-bold"
              title="Giorno successivo (simula avanzamento)"
            >
              Domani ▶
            </button>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Giorni Trascorsi
          </div>
          <div className="text-xl md:text-2xl font-black text-white font-mono">
            {metrics.historyCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            dall'inizio del piano ({formatDateDisplay(metrics.roadmapStartDate)})
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Giorni di Studio Svolti
          </div>
          <div className="text-xl md:text-2xl font-black text-emerald-400 font-mono">
            {metrics.pastDaysStudied}
          </div>
          <p className="text-[11px] text-emerald-300/80 mt-1">
            {metrics.totalPastHours}h di studio effettivo
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Giorni Saltati
          </div>
          <div className="text-xl md:text-2xl font-black text-amber-400 font-mono">
            {metrics.pastDaysSkipped}
          </div>
          <p className="text-[11px] text-amber-300/80 mt-1">
            Recuperati nei giorni successivi
          </p>
        </div>
      </div>

      {/* GitHub-like Contribution Activity Heatmap */}
      <ActivityHeatmap
        calendarDays={calendarDays}
        historyDays={historyDays}
        metrics={metrics}
        onSetDate={onSetDate}
      />

      {/* Header Bar with Filters */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 md:p-5 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <IconHistory className="w-5 h-5 text-cyan-400" />
            Storico e Diario di Studio
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Tracciamento delle date passate: vedi cosa è stato svolto e come i giorni saltati si sono ribilanciati in avanti.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenLogModal && onOpenLogModal({ date: metrics.currentSimulatedDate })}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-emerald-500/20 border border-emerald-400/40 transition active:scale-95"
            title="Registra ore di studio svolte (+)"
          >
            <span className="text-sm font-black leading-none">+</span>
            <span>Registra Studio</span>
          </button>

          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1 rounded-lg transition ${
                filterType === "all" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Tutti i Giorni
            </button>
            <button
              onClick={() => setFilterType("completed")}
              className={`px-3 py-1 rounded-lg transition ${
                filterType === "completed" ? "bg-emerald-600/30 text-emerald-300 shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Solo Studiati
            </button>
            <button
              onClick={() => setFilterType("skipped")}
              className={`px-3 py-1 rounded-lg transition ${
                filterType === "skipped" ? "bg-amber-600/30 text-amber-300 shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Solo Saltati
            </button>
          </div>
        </div>
      </div>

      {/* Timeline of Days */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredHistory.map(day => {
          const isToday = day.isToday;
          const isSkipped = day.dayStatus === "skipped";
          const isCompleted = day.dayStatus === "completed";

          return (
            <div
              key={day.date}
              className={`p-4 md:p-5 rounded-2xl border transition backdrop-blur-md flex flex-col justify-between ${
                isToday
                  ? "bg-slate-900/95 border-cyan-500/50 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/30"
                  : isCompleted
                  ? "bg-slate-900/80 border-emerald-500/30"
                  : isSkipped
                  ? "bg-slate-950/80 border-slate-800"
                  : "bg-slate-950/50 border-slate-800/60"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold ${
                    isToday
                      ? "bg-cyan-500 text-black font-extrabold"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-300"
                  }`}>
                    {day.dayName} {formatDateDisplay(day.date)}
                  </span>

                  {isToday && (
                    <span className="text-[11px] uppercase tracking-wider font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                      Oggi (Data Attiva)
                    </span>
                  )}

                  {isCompleted && (
                    <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                      <IconCheckCircle className="w-4 h-4 text-emerald-400" />
                      Sessione di studio completata ({day.allocatedHours}h)
                    </span>
                  )}

                  {isSkipped && (
                    <span className="text-xs text-amber-400/90 font-medium flex items-center gap-1">
                      <IconClock className="w-4 h-4 text-amber-400" />
                      Giorno saltato / Nessuno studio • Ribilanciato automaticamente
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500 font-mono">
                    {day.timeSlot}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenLogModal && onOpenLogModal({ date: day.date })}
                    className="px-2 py-0.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 transition active:scale-95 flex items-center gap-1"
                    title={`Aggiungi o registra sessione per ${day.dayName} ${formatDateDisplay(day.date)} (+)`}
                  >
                    <span className="font-black">+</span>
                    <span>Studio</span>
                  </button>
                </div>
              </div>

              {/* Topics list for this day */}
              {day.topics.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/70 space-y-2">
                  {day.topics.map(t => (
                    <div
                      key={t.sessionId || (t.id + '_' + (t.isSessionLog ? 'log' : 'topic'))}
                      className="flex items-center justify-between text-xs bg-black/30 p-2.5 rounded-xl border border-slate-800/60"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1 pr-2">
                        <button
                          type="button"
                          onClick={() => onOpenTopicDetail && onOpenTopicDetail(t.id)}
                          className="font-mono font-bold text-slate-200 hover:text-cyan-300 transition text-left cursor-pointer flex items-center gap-1 group/btn"
                          title="Apri scheda dettagli argomento"
                        >
                          <span>{t.id}</span>
                          <span className="text-[9px] font-sans px-1 py-0.2 rounded bg-cyan-500/10 text-cyan-400 group-hover/btn:bg-cyan-500/20 border border-cyan-500/30">
                            ℹ
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenTopicDetail && onOpenTopicDetail(t.id)}
                          className="text-slate-300 hover:text-cyan-200 truncate text-left transition cursor-pointer"
                          title="Apri scheda dettagli argomento"
                        >
                          {t.argomento}
                        </button>
                        {t.isSessionLog && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold flex-shrink-0">
                            Sessione
                          </span>
                        )}
                        {t.sessionNote && (
                          <span className="text-[11px] text-slate-400 italic truncate max-w-xs">
                            "{t.sessionNote}"
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="font-mono text-emerald-400 font-bold">
                          {t.effectiveHours}h
                        </span>
                        {t.sessionId && onDeleteSession && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Eliminare la sessione di ${t.effectiveHours}h su ${t.id}?`)) {
                                onDeleteSession(t.sessionId);
                              }
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                            title="Elimina sessione"
                          >
                            <IconTrash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
