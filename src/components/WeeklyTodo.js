import React, { useState, useEffect } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCheck,
  IconClock,
  IconBriefcase,
  IconFlame,
  IconCheckCircle,
  IconPlay,
  IconPause,
  IconRotateCcw,
  IconTomato
} from "./Icons.js";

const LOCAL_STORAGE_KEY_POMODORO = "unimore_rebalancer_pomodoro_v2";

export function WeeklyTodo({ weeklyPlans, onToggleComplete, settings }) {
  // Default to the week containing Today
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(() => {
    const currentWeek = weeklyPlans.find(w => w.hasToday);
    return currentWeek ? currentWeek.weekNumber : 1;
  });

  const [filterSubject, setFilterSubject] = useState("all");

  // Pomodoro timer state for topic cards
  // { [topicId]: { accumulatedSeconds: number, isRunning: boolean, cycleRemaining: number, isBreak: boolean, completedByTimer: boolean } }
  const [pomodoroMap, setPomodoroMap] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_POMODORO);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to load pomodoro state from localStorage", e);
    }
    return {};
  });

  // Persist Pomodoro map to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_POMODORO, JSON.stringify(pomodoroMap));
    } catch (e) {
      console.warn("Failed to persist pomodoro state", e);
    }
  }, [pomodoroMap]);

  // Global Pomodoro ticker (1 second per tick)
  useEffect(() => {
    const hasRunning = Object.values(pomodoroMap).some(p => p.isRunning);
    if (!hasRunning) return;

    const interval = setInterval(() => {
      setPomodoroMap(prev => {
        let changed = false;
        const nextMap = { ...prev };

        Object.entries(prev).forEach(([topicId, pState]) => {
          if (!pState.isRunning) return;
          changed = true;

          const isBreak = pState.isBreak || false;
          let cycleRemaining = (pState.cycleRemaining !== undefined ? pState.cycleRemaining : 50 * 60) - 1;
          let newIsBreak = isBreak;

          if (cycleRemaining <= 0) {
            // Switch between 50 min study and 10 min break
            newIsBreak = !isBreak;
            cycleRemaining = newIsBreak ? 10 * 60 : 50 * 60;
          }

          // Accumulate focus time only during focus study phase
          const accumulated = isBreak ? (pState.accumulatedSeconds || 0) : (pState.accumulatedSeconds || 0) + 1;
          const targetSeconds = Math.round((Number(pState.targetHours) || 2.0) * 3600);
          const reachedTarget = accumulated >= targetSeconds;

          nextMap[topicId] = {
            ...pState,
            accumulatedSeconds: accumulated,
            cycleRemaining,
            isBreak: newIsBreak,
            isRunning: reachedTarget ? false : pState.isRunning,
            completedByTimer: reachedTarget ? true : pState.completedByTimer
          };

          // Auto-check topic when accumulated timer reaches estimated hours!
          if (reachedTarget && !pState.completedByTimer) {
            onToggleComplete(topicId);
          }
        });

        return changed ? nextMap : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pomodoroMap, onToggleComplete]);

  // Pomodoro Actions
  const togglePomodoro = (topicId, targetHours) => {
    setPomodoroMap(prev => {
      const current = prev[topicId] || {
        accumulatedSeconds: 0,
        cycleRemaining: 50 * 60,
        isBreak: false,
        isRunning: false,
        completedByTimer: false
      };
      return {
        ...prev,
        [topicId]: {
          ...current,
          targetHours: Number(targetHours) || 2.0,
          isRunning: !current.isRunning
        }
      };
    });
  };

  const resetPomodoro = (topicId, targetHours) => {
    setPomodoroMap(prev => ({
      ...prev,
      [topicId]: {
        accumulatedSeconds: 0,
        cycleRemaining: 50 * 60,
        isBreak: false,
        isRunning: false,
        targetHours: Number(targetHours) || 2.0,
        completedByTimer: false
      }
    }));
  };

  const addPomodoroMinutes = (topicId, targetHours, minutes) => {
    setPomodoroMap(prev => {
      const current = prev[topicId] || {
        accumulatedSeconds: 0,
        cycleRemaining: 50 * 60,
        isBreak: false,
        isRunning: false,
        completedByTimer: false
      };
      const added = minutes * 60;
      const accumulated = (current.accumulatedSeconds || 0) + added;
      const targetSeconds = Math.round((Number(targetHours) || 2.0) * 3600);
      const reachedTarget = accumulated >= targetSeconds;

      if (reachedTarget && !current.completedByTimer) {
        onToggleComplete(topicId);
      }

      return {
        ...prev,
        [topicId]: {
          ...current,
          targetHours: Number(targetHours) || 2.0,
          accumulatedSeconds: accumulated,
          isRunning: reachedTarget ? false : current.isRunning,
          completedByTimer: reachedTarget ? true : current.completedByTimer
        }
      };
    });
  };

  const completePomodoroTarget = (topicId, targetHours) => {
    const targetSec = Math.round((Number(targetHours) || 2.0) * 3600);
    setPomodoroMap(prev => {
      const current = prev[topicId] || {};
      return {
        ...prev,
        [topicId]: {
          ...current,
          targetHours: Number(targetHours) || 2.0,
          accumulatedSeconds: targetSec,
          isRunning: false,
          cycleRemaining: 0,
          completedByTimer: true
        }
      };
    });
    // Trigger auto-check of the topic
    onToggleComplete(topicId);
  };

  const formatMinutesSeconds = (totalSec) => {
    const s = Math.max(0, totalSec);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

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
                    const pState = pomodoroMap[topic.id] || {
                      accumulatedSeconds: 0,
                      cycleRemaining: 50 * 60,
                      isRunning: false,
                      isBreak: false,
                      completedByTimer: false
                    };
                    const targetSeconds = Math.round((Number(topic.oreStimate) || 2.0) * 3600);
                    const accumulated = pState.accumulatedSeconds || 0;
                    const percentPomodoro = Math.min(100, Math.round((accumulated / targetSeconds) * 100));

                    return (
                      <div
                        key={topic.id}
                        className={`flex flex-col p-3.5 rounded-2xl border transition-all ${
                          topic.isCompleted
                            ? "bg-slate-950/60 border-slate-800/50 opacity-60"
                            : isAnalisi
                            ? "bg-slate-950/80 hover:bg-slate-900 border-emerald-500/20 hover:border-emerald-500/40"
                            : "bg-slate-950/80 hover:bg-slate-900 border-indigo-500/20 hover:border-indigo-500/40"
                        }`}
                      >
                        {/* Upper row: Checkbox, Title and Meta Pills */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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

                        {/* Pomodoro 50/10 Interactive Tracker Strip */}
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/50 p-2.5 rounded-xl">
                          <div className="flex items-center space-x-2.5">
                            <div className={`p-1.5 rounded-lg border flex-shrink-0 ${
                              pState.isRunning
                                ? (pState.isBreak ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 animate-pulse")
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}>
                              <IconTomato className="w-4 h-4" />
                            </div>

                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-[11px] font-bold text-slate-200">
                                  Pomodoro 50/10
                                </span>
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                                  pState.isBreak
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                    : pState.isRunning
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                    : "bg-slate-800 text-slate-400"
                                }`}>
                                  {pState.isBreak ? "☕ Pausa" : "🍅 Studio"} {formatMinutesSeconds(pState.cycleRemaining !== undefined ? pState.cycleRemaining : 50 * 60)}
                                </span>
                                {accumulated >= targetSeconds && (
                                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                                    ✓ Target Raggiunto
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center space-x-2 mt-1">
                                <div className="w-24 sm:w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-300"
                                    style={{ width: `${percentPomodoro}%` }}
                                  />
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {(accumulated / 3600).toFixed(1)}h / {topic.oreStimate}h ({percentPomodoro}%)
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Pomodoro Timer Controls */}
                          <div className="flex items-center space-x-1.5 self-end sm:self-center flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => togglePomodoro(topic.id, topic.oreStimate)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                                pState.isRunning
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                                  : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
                              }`}
                              title={pState.isRunning ? "Metti in pausa il timer" : "Avvia il timer pomodoro"}
                            >
                              {pState.isRunning ? <IconPause className="w-3.5 h-3.5" /> : <IconPlay className="w-3.5 h-3.5" />}
                              <span>{pState.isRunning ? "Pausa" : "Avvia"}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => resetPomodoro(topic.id, topic.oreStimate)}
                              className="p-1.5 text-slate-500 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
                              title="Azzera il tempo accumulato per questo argomento"
                            >
                              <IconRotateCcw className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => addPomodoroMinutes(topic.id, topic.oreStimate, 30)}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[10px] font-mono transition"
                              title="Aggiungi 30 minuti di studio completati"
                            >
                              +30m
                            </button>

                            <button
                              type="button"
                              onClick={() => completePomodoroTarget(topic.id, topic.oreStimate)}
                              className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-bold transition"
                              title="Simula raggiungimento completo delle ore stimate (auto-check automatico)"
                            >
                              Target Raggiunto
                            </button>
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
