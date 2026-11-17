import React, { useState, useEffect } from "react";
import { IconChevronLeft, IconChevronRight, IconCheck, IconClock, IconBriefcase, IconFlame, IconCheckCircle } from "./Icons.js";

export function WeeklyTodo({ weeklyPlans, onToggleComplete, settings }) {
  // Default to the week containing Today
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(() => {
    const currentWeek = weeklyPlans.find(w => w.hasToday);
    return currentWeek ? currentWeek.weekNumber : 1;
  });

  const [filterSubject, setFilterSubject] = useState("all");

  // Keep selected week in sync if currentSimulatedDate changes week
  useEffect(() => {
    const currentWeek = weeklyPlans.find(w => w.hasToday);
    if (currentWeek) {
      setSelectedWeekIndex(currentWeek.weekNumber);
    }
  }, [settings.currentSimulatedDate]);

  if (!weeklyPlans || weeklyPlans.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
        <p className="text-base">Nessun piano settimanale disponibile. Tutti gli argomenti potrebbero essere già completati!</p>
      </div>
    );
  }

  const currentWeek = weeklyPlans.find(w => w.weekNumber === selectedWeekIndex) || weeklyPlans[0];

  const handlePrevWeek = () => {
    if (selectedWeekIndex > 1) {
      setSelectedWeekIndex(selectedWeekIndex - 1);
    }
  };

  const handleNextWeek = () => {
    if (selectedWeekIndex < weeklyPlans.length) {
      setSelectedWeekIndex(selectedWeekIndex + 1);
    }
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}`;
  };

  return (
    <div className="space-y-6">
      {/* Week Selector Bar */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 md:p-5 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Navigation buttons and title */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={handlePrevWeek}
            disabled={selectedWeekIndex === 1}
            className={`p-2 rounded-xl border transition ${
              selectedWeekIndex === 1
                ? "bg-slate-950/40 text-slate-600 border-slate-800 cursor-not-allowed"
                : "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
            }`}
            title="Settimana precedente"
          >
            <IconChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center md:text-left">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg md:text-xl font-extrabold text-white">
                Settimana {currentWeek.weekNumber}
              </h3>
              {currentWeek.hasToday && (
                <span className="text-[11px] uppercase tracking-wider font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                  Settimana Attiva
                </span>
              )}
              {currentWeek.isPastWeek && (
                <span className="text-[11px] font-medium bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                  Passata
                </span>
              )}
              {currentWeek.isOverloaded && (
                <span className="text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <IconFlame className="w-3 h-3 text-rose-400" /> &gt;{settings.criticalWeeklyHoursThreshold}h
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Periodo: {formatDateDisplay(currentWeek.startDate)} – {formatDateDisplay(currentWeek.endDate)}
            </p>
          </div>

          <button
            onClick={handleNextWeek}
            disabled={selectedWeekIndex === weeklyPlans.length}
            className={`p-2 rounded-xl border transition ${
              selectedWeekIndex === weeklyPlans.length
                ? "bg-slate-950/40 text-slate-600 border-slate-800 cursor-not-allowed"
                : "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
            }`}
            title="Settimana successiva"
          >
            <IconChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekly metrics and filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Workload badge */}
          <div className="bg-slate-950/70 border border-slate-800 px-3.5 py-1.5 rounded-xl flex items-center space-x-2">
            <IconClock className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-slate-400">Monte ore:</span>
            <span className={`text-sm font-bold font-mono ${
              currentWeek.isOverloaded ? "text-rose-400" : "text-white"
            }`}>
              {currentWeek.totalAllocatedHours}h
            </span>
          </div>

          {/* Filter subject */}
          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setFilterSubject("all")}
              className={`px-3 py-1 rounded-lg transition ${
                filterSubject === "all" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Tutte
            </button>
            <button
              onClick={() => setFilterSubject("analisi")}
              className={`px-3 py-1 rounded-lg transition ${
                filterSubject === "analisi" ? "bg-emerald-600/30 text-emerald-300 shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Analisi
            </button>
            <button
              onClick={() => setFilterSubject("geometria")}
              className={`px-3 py-1 rounded-lg transition ${
                filterSubject === "geometria" ? "bg-indigo-600/30 text-indigo-300 shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Geometria
            </button>
          </div>
        </div>
      </div>

      {/* Days Grid */}
      <div className="space-y-4">
        {currentWeek.days.map((day) => {
          const isToday = day.isToday;
          const isPast = day.isPast;
          const isSkipped = isPast && day.dayStatus === "skipped";
          const isCompletedPast = isPast && day.dayStatus === "completed";

          const visibleTopics = day.topics.filter(t => {
            if (filterSubject === "analisi") return t.materia.toLowerCase().includes("analisi");
            if (filterSubject === "geometria") return t.materia.toLowerCase().includes("geometria");
            return true;
          });

          return (
            <div
              key={day.date}
              className={`border rounded-3xl p-4 md:p-5 transition backdrop-blur-md relative overflow-hidden ${
                isToday
                  ? "bg-slate-900/95 border-cyan-500/60 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/40"
                  : isCompletedPast
                  ? "bg-slate-900/70 border-emerald-500/30"
                  : isSkipped
                  ? "bg-slate-950/70 border-slate-800/80 opacity-75"
                  : day.isWeekend
                  ? "bg-gradient-to-r from-slate-900/90 to-indigo-950/30 border-indigo-500/20"
                  : "bg-slate-900/70 border-slate-800/80"
              }`}
            >
              {/* Day Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/70">
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono ${
                    isToday
                      ? "bg-cyan-500 text-black font-extrabold"
                      : isCompletedPast
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : isSkipped
                      ? "bg-slate-800 text-slate-400"
                      : day.isWeekend
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  }`}>
                    {day.dayName} {formatDateDisplay(day.date)}
                  </span>

                  {isToday && (
                    <span className="text-[11px] uppercase tracking-wider font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full animate-pulse-subtle">
                      ★ OGGI (Data Attiva)
                    </span>
                  )}

                  {isCompletedPast && (
                    <span className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                      <IconCheckCircle className="w-4 h-4 text-emerald-400" />
                      Sessione svolta ({day.allocatedHours}h)
                    </span>
                  )}

                  {isSkipped && (
                    <span className="text-xs text-amber-400/90 font-medium flex items-center gap-1">
                      <IconClock className="w-4 h-4 text-amber-400" />
                      Giorno saltato • Argomenti recuperati automaticamente in avanti
                    </span>
                  )}

                  {!isPast && !isToday && (
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      {day.isWeekend ? (
                        <span className="text-indigo-300 font-medium">Blocco Weekend ({day.timeSlot})</span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400">
                          <IconBriefcase className="w-3.5 h-3.5 text-slate-500" />
                          Lavoro Full-Time escluso • Studio {day.timeSlot}
                        </span>
                      )}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-500 font-mono">Carico:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {day.allocatedHours}h / {day.maxHours}h max
                  </span>
                </div>
              </div>

              {/* Topics list for the day */}
              {isSkipped ? (
                <div className="py-3 px-4 bg-black/30 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>In questa data non è stato registrato studio. Gli argomenti sono stati riprogrammati a partire da oggi.</span>
                  <span className="text-amber-400/90 font-mono text-[11px]">0h svolte</span>
                </div>
              ) : visibleTopics.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-500 italic">
                  Nessun argomento previsto in questo slot (riposo o filtro attivo).
                </div>
              ) : (
                <div className="space-y-2.5">
                  {visibleTopics.map(topic => {
                    const isAnalisi = topic.materia.toLowerCase().includes("analisi");

                    return (
                      <div
                        key={topic.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          topic.isCompleted
                            ? "bg-slate-950/60 border-slate-800/50 opacity-60"
                            : isAnalisi
                            ? "bg-slate-950/80 hover:bg-slate-900 border-emerald-500/20 hover:border-emerald-500/40"
                            : "bg-slate-950/80 hover:bg-slate-900 border-indigo-500/20 hover:border-indigo-500/40"
                        }`}
                      >
                        {/* Checkbox and Title */}
                        <div className="flex items-start space-x-3.5 flex-1 min-w-0 pr-2">
                          <button
                            type="button"
                            onClick={() => onToggleComplete(topic.id)}
                            className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center transition-colors flex-shrink-0 ${
                              topic.isCompleted
                                ? "bg-emerald-500 border-emerald-400 text-white"
                                : "border-slate-600 hover:border-slate-400 bg-slate-900"
                            }`}
                            title={topic.isCompleted ? "Segna come da fare" : "Segna come completato"}
                          >
                            {topic.isCompleted && <IconCheck className="w-3.5 h-3.5" />}
                          </button>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              {/* Subject Badge */}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isAnalisi
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              }`}>
                                {topic.materia}
                              </span>

                              {/* Topic ID */}
                              <span className="text-[11px] font-mono font-bold text-slate-300">
                                {topic.id}
                              </span>

                              {/* Chapter */}
                              <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                                • {topic.capitolo}
                              </span>

                              {/* Buffer +20% badge */}
                              {topic.hasBuffer && (
                                <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                                  +20% Buffer Priorità
                                </span>
                              )}

                              {topic.isCompleted && topic.completedDate && (
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                                  ✓ Svolto il {formatDateDisplay(topic.completedDate)}
                                </span>
                              )}
                            </div>

                            <p className={`text-xs md:text-sm font-medium ${
                              topic.isCompleted ? "line-through text-slate-500" : "text-slate-200"
                            }`}>
                              {topic.argomento}
                            </p>

                            {topic.note && (
                              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                Obiettivo: {topic.note}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Meta Pills (Hours, Difficulty, Priority) */}
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0 flex-shrink-0 self-end sm:self-center">
                          {/* Hours */}
                          <div className="text-right">
                            <div className="text-xs font-mono font-bold text-white">
                              {topic.effectiveHours}h
                            </div>
                            {topic.hasBuffer && (
                              <div className="text-[10px] text-slate-500 font-mono">
                                (base {topic.oreStimate}h)
                              </div>
                            )}
                          </div>

                          {/* Difficulty and Priority indicators */}
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-[10px] text-slate-400">
                              Priorità: <strong className="text-amber-400">{topic.prioritaEsame}/5</strong>
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Difficoltà: <strong className="text-cyan-400">{topic.difficolta}/5</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
