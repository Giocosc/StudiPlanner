import React, { useState, useEffect, useMemo, useRef } from "react";
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
  IconTomato,
  IconCalendar
} from "./Icons.js";
import { downloadIcsCalendar } from "../services/calendarExportService.js";
import { getPreExamWindowStart, getHolidayBootcampDates, MAX_DAY_CAPACITY_HOURS, REVIEW_OUTCOMES } from "../services/rebalancerEngine.js";

const LOCAL_STORAGE_KEY_POMODORO = "unimore_rebalancer_pomodoro_v2";

export function WeeklyTodo({
  weeklyPlans,
  calendarDays = [],
  onToggleComplete,
  onUpdateTopicHours,
  onLogStudySession,
  onMarkTopicCompleted,
  settings,
  customDayCapacities = {},
  onUpdateDayCapacity,
  onBatchUpdateDayCapacities,
  onOpenLogModal,
  onOpenTopicDetail,
  onToggleSpacedReview,
  onOpenRetrospective,
  mathBugs = []
}) {
  // Default to the week containing Today
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(() => {
    const currentWeek = weeklyPlans.find(w => w.hasToday);
    return currentWeek ? currentWeek.weekNumber : 1;
  });

  const [filterSubject, setFilterSubject] = useState("all");
  const [pomodoroAlert, setPomodoroAlert] = useState(null);
  const isInPreExamWindow = Boolean(
    settings &&
    settings.currentSimulatedDate >= getPreExamWindowStart(settings.targetExamDate) &&
    settings.currentSimulatedDate <= (settings.targetExamDate || "9999-12-31")
  );
  const [isExpressReviewActive, setIsExpressReviewActive] = useState(isInPreExamWindow);

  // La modalità Sprint segue la data attiva: si attiva entrando negli ultimi 7 giorni
  // e si spegne uscendone (resta comunque attivabile/disattivabile a mano).
  useEffect(() => {
    setIsExpressReviewActive(isInPreExamWindow);
  }, [isInPreExamWindow]);

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

  // --- Pomodoro 50/10 ---------------------------------------------------------
  // Il tempo è misurato con timestamp reali (Date.now), non contando i tick: i browser
  // rallentano setInterval nelle schede in background e il timer resterebbe indietro.
  // Le ore di focus vengono registrate SOLO tramite onLogStudySession (una sessione nel
  // diario), mai anche con onUpdateTopicHours, per non contarle due volte.
  const FOCUS_SECONDS = 50 * 60;
  const BREAK_SECONDS = 10 * 60;

  const pomodoroRef = useRef(pomodoroMap);
  useEffect(() => {
    pomodoroRef.current = pomodoroMap;
  }, [pomodoroMap]);

  // Callback sempre aggiornate per l'intervallo (evita closure obsolete)
  const pomodoroCallbacksRef = useRef({});
  pomodoroCallbacksRef.current = {
    onLogStudySession,
    onMarkTopicCompleted,
    date: settings.currentSimulatedDate
  };

  const logFocusSeconds = (topicId, seconds, completeTopic, note) => {
    const { onLogStudySession: logFn, onMarkTopicCompleted: markFn, date } = pomodoroCallbacksRef.current;
    const hours = Number((seconds / 3600).toFixed(2));
    if (hours > 0 && logFn) {
      logFn({ topicId, date, hours, completed: completeTopic ? true : undefined, note });
    } else if (completeTopic && markFn) {
      markFn(topicId);
    }
  };

  const hasRunningPomodoro = Object.values(pomodoroMap).some(p => p.isRunning);

  useEffect(() => {
    if (!hasRunningPomodoro) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const prev = pomodoroRef.current;
      const next = { ...prev };
      const events = [];
      let changed = false;

      Object.entries(prev).forEach(([topicId, pState]) => {
        if (!pState.isRunning) return;
        changed = true;

        const startTick = pState.lastTickAt || now;
        const totalElapsed = Math.max(0, Math.floor((now - startTick) / 1000));
        let elapsed = totalElapsed;
        let cycleRemaining = pState.cycleRemaining !== undefined ? pState.cycleRemaining : FOCUS_SECONDS;
        let isBreak = Boolean(pState.isBreak);
        let accumulated = pState.accumulatedSeconds || 0;
        let logged = pState.loggedSeconds || 0;
        let isRunning = true;
        let completedByTimer = Boolean(pState.completedByTimer);
        const targetSeconds = Math.round((Number(pState.targetHours) || 2.0) * 3600);

        while (elapsed > 0 && isRunning) {
          let step = Math.min(elapsed, cycleRemaining);
          if (!isBreak && !completedByTimer && targetSeconds > accumulated) {
            step = Math.min(step, targetSeconds - accumulated);
          }
          if (!isBreak) accumulated += step;
          cycleRemaining -= step;
          elapsed -= step;

          if (!isBreak && !completedByTimer && accumulated >= targetSeconds) {
            // Obiettivo raggiunto: registra il focus non ancora salvato e completa l'argomento
            events.push({ topicId, seconds: accumulated - logged, complete: true, note: "Obiettivo Pomodoro raggiunto" });
            logged = accumulated;
            completedByTimer = true;
            isRunning = false;
            break;
          }

          if (cycleRemaining <= 0) {
            if (!isBreak) {
              events.push({ topicId, seconds: accumulated - logged, complete: false, note: "Ciclo Pomodoro 50m completato automaticamente" });
              logged = accumulated;
            }
            isBreak = !isBreak;
            cycleRemaining = isBreak ? BREAK_SECONDS : FOCUS_SECONDS;
          }
        }

        next[topicId] = {
          ...pState,
          accumulatedSeconds: accumulated,
          loggedSeconds: logged,
          cycleRemaining,
          isBreak,
          isRunning,
          completedByTimer,
          // Avanza solo dei secondi interi consumati: le frazioni restano per il tick successivo
          lastTickAt: isRunning ? startTick + (totalElapsed - elapsed) * 1000 : null
        };
      });

      if (!changed) return;
      pomodoroRef.current = next;
      setPomodoroMap(next);

      // Effetti collaterali FUORI dall'aggiornamento di stato
      events.forEach(ev => {
        logFocusSeconds(ev.topicId, ev.seconds, ev.complete, ev.note);
        setPomodoroAlert(ev.complete
          ? `🍅 Obiettivo raggiunto: ${ev.topicId} completato e focus registrato nel diario!`
          : `🍅 Ottimo lavoro! 50m di focus completati e registrati nel diario per ${ev.topicId}!`);
        setTimeout(() => setPomodoroAlert(null), 4000);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasRunningPomodoro]);

  // Pomodoro Actions
  const handleQuickLogPomodoro = (topicId) => {
    if (onLogStudySession) {
      onLogStudySession({
        topicId,
        date: settings.currentSimulatedDate,
        hours: Number((50 / 60).toFixed(2)),
        note: "Sessione Pomodoro (50 minuti di focus intenso)"
      });
      setPomodoroAlert(`🍅 Sessione Pomodoro da 50m (0.83h) registrata con successo nel diario per ${topicId}!`);
      setTimeout(() => setPomodoroAlert(null), 4000);
    }
  };

  const emptyPomodoroState = () => ({
    accumulatedSeconds: 0,
    loggedSeconds: 0,
    cycleRemaining: FOCUS_SECONDS,
    isBreak: false,
    isRunning: false,
    completedByTimer: false,
    lastTickAt: null
  });

  const togglePomodoro = (topicId, targetHours) => {
    setPomodoroMap(prev => {
      const current = prev[topicId] || emptyPomodoroState();
      const willRun = !current.isRunning;
      return {
        ...prev,
        [topicId]: {
          ...current,
          targetHours: Number(targetHours) || 2.0,
          isRunning: willRun,
          lastTickAt: willRun ? Date.now() : null
        }
      };
    });
  };

  const resetPomodoro = (topicId, targetHours) => {
    setPomodoroMap(prev => ({
      ...prev,
      [topicId]: { ...emptyPomodoroState(), targetHours: Number(targetHours) || 2.0 }
    }));
  };

  const addPomodoroMinutes = (topicId, targetHours, minutes) => {
    const current = pomodoroRef.current[topicId] || emptyPomodoroState();
    const added = minutes * 60;
    const accumulated = (current.accumulatedSeconds || 0) + added;
    const targetSeconds = Math.round((Number(targetHours) || 2.0) * 3600);
    const reachedTarget = accumulated >= targetSeconds && !current.completedByTimer;

    // Il tempo aggiunto a mano diventa una sessione nel diario (storico coerente)
    logFocusSeconds(topicId, added, reachedTarget, `Pomodoro: +${minutes} minuti aggiunti manualmente`);

    setPomodoroMap(prev => {
      const cur = prev[topicId] || emptyPomodoroState();
      return {
        ...prev,
        [topicId]: {
          ...cur,
          targetHours: Number(targetHours) || 2.0,
          accumulatedSeconds: accumulated,
          loggedSeconds: (cur.loggedSeconds || 0) + added,
          isRunning: reachedTarget ? false : cur.isRunning,
          lastTickAt: reachedTarget ? null : cur.lastTickAt,
          completedByTimer: reachedTarget ? true : cur.completedByTimer
        }
      };
    });
  };

  const completePomodoroTarget = (topicId, targetHours) => {
    const targetSec = Math.round((Number(targetHours) || 2.0) * 3600);
    const current = pomodoroRef.current[topicId] || emptyPomodoroState();
    // Registra il focus non ancora salvato e completa l'argomento (senza "toggle":
    // se era già completato resta completato)
    const unlogged = Math.max(0, (current.accumulatedSeconds || 0) - (current.loggedSeconds || 0));
    logFocusSeconds(topicId, unlogged, true, "Pomodoro: obiettivo segnato come raggiunto");
    setPomodoroMap(prev => ({
      ...prev,
      [topicId]: {
        ...(prev[topicId] || emptyPomodoroState()),
        targetHours: Number(targetHours) || 2.0,
        accumulatedSeconds: Math.max(targetSec, current.accumulatedSeconds || 0),
        loggedSeconds: Math.max(targetSec, current.accumulatedSeconds || 0),
        isRunning: false,
        lastTickAt: null,
        cycleRemaining: 0,
        completedByTimer: true
      }
    }));
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

  const currentWeek = (weeklyPlans || []).find(w => w.weekNumber === selectedWeekIndex) || (weeklyPlans || [])[0];

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

  // Punto 6: Work Emergency / Overtime Mode (Weekdays compressed to 1.0h, shifted to weekend)
  const isEmergencyActive = useMemo(() => {
    if (!currentWeek || !currentWeek.days) return false;
    const weekdays = currentWeek.days.filter(d => !d.isWeekend);
    if (weekdays.length === 0) return false;
    return weekdays.every(d => customDayCapacities[d.date] !== undefined && customDayCapacities[d.date] <= 1.0);
  }, [currentWeek, customDayCapacities]);

  const handleToggleEmergencyWeek = () => {
    if (!onBatchUpdateDayCapacities || !currentWeek || !currentWeek.days) return;
    const updates = {};
    if (isEmergencyActive) {
      currentWeek.days.forEach(d => {
        updates[d.date] = null;
      });
    } else {
      currentWeek.days.forEach(d => {
        if (!d.isWeekend) {
          updates[d.date] = 1.0;
        } else {
          updates[d.date] = Math.min(8.0, Number(((d.maxHours || 4.5) + 1.5).toFixed(1)));
        }
      });
    }
    onBatchUpdateDayCapacities(updates);
  };

  // Punto 7: Holiday Bootcamp Profile (24 Dec - 6 Jan boosted to 6.5h/day)
  const examDateForHolidays = settings && settings.targetExamDate;
  const holidayDates = useMemo(() => getHolidayBootcampDates(examDateForHolidays), [examDateForHolidays]);

  const isHolidayBootcampActive = useMemo(() => {
    return holidayDates.every(d => customDayCapacities[d] && customDayCapacities[d] >= 6.0);
  }, [holidayDates, customDayCapacities]);

  const handleToggleHolidayBootcamp = () => {
    if (!onBatchUpdateDayCapacities) return;
    const updates = {};
    if (isHolidayBootcampActive) {
      holidayDates.forEach(d => {
        updates[d] = null;
      });
    } else {
      holidayDates.forEach(d => {
        updates[d] = 6.5;
      });
    }
    onBatchUpdateDayCapacities(updates);
  };

  // Early return solo DOPO tutti gli hook (Rules of Hooks)
  if (!weeklyPlans || weeklyPlans.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
        <p className="text-base">Nessun piano settimanale disponibile. Tutti gli argomenti potrebbero essere già completati!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pomodoroAlert && (
        <div className="bg-gradient-to-r from-rose-950/80 to-amber-950/60 border border-rose-500/50 rounded-2xl p-3.5 px-5 flex items-center justify-between text-rose-200 text-sm shadow-xl animate-fade-in">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🍅</span>
            <span className="font-semibold">{pomodoroAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setPomodoroAlert(null)}
            className="text-rose-400 hover:text-white text-xs font-mono px-2 py-1 rounded-lg bg-rose-900/50"
          >
            Chiudi
          </button>
        </div>
      )}

      {/* Pre-Exam Sprint Triage Banner (Punto 20) */}
      {isExpressReviewActive && (
        <div className="bg-gradient-to-r from-rose-950/80 via-red-950/60 to-slate-900 border border-rose-500/40 rounded-3xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 text-lg font-black flex-shrink-0">
              🎯
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  Modalità Ripasso Sprint Pre-Esame (Triage Attivo)
                </h4>
                <span className="text-[10px] bg-rose-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                  Solo Priorità 4 & 5
                </span>
              </div>
              <p className="text-xs text-rose-200/90 mt-0.5">
                Filtrati esclusivamente i pilastri d'esame UNIMORE (Taylor, integrali, sistemi lineari, autovalori/diagonalizzazione) e le prove generali (A-32). Tutti gli argomenti secondari sono esclusi per massimizzare il voto nel tempo rimasto.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsExpressReviewActive(false)}
            className="text-xs bg-rose-900/60 hover:bg-rose-800 text-rose-200 px-3 py-1.5 rounded-xl border border-rose-500/30 transition flex-shrink-0"
          >
            Disattiva Triage
          </button>
        </div>
      )}

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

          {/* Work Emergency / Overtime Mode (Punto 6) */}
          <button
            type="button"
            onClick={handleToggleEmergencyWeek}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-sm ${
              isEmergencyActive
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-950/30"
                : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800"
            }`}
            title="Modalità Straordinari: comprime le sere feriali di questa settimana a 1h/sera e ridistribuisce il carico"
          >
            <span>⚡ {isEmergencyActive ? "Straordinari Attivi (1h)" : "Modalità Straordinari"}</span>
          </button>

          {/* Holiday Bootcamp (Punto 7) */}
          <button
            type="button"
            onClick={handleToggleHolidayBootcamp}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-sm ${
              isHolidayBootcampActive
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-950/30"
                : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800"
            }`}
            title="Holiday Bootcamp (24 Dic - 6 Gen): attiva 6.5h/giorno a tempo pieno durante le vacanze natalizie"
          >
            <span>🎄 {isHolidayBootcampActive ? "Bootcamp Natale Attivo (6.5h)" : "Bootcamp Natale"}</span>
          </button>

          {/* iCal / Google Calendar Export (Punto 9) */}
          <button
            type="button"
            onClick={() => downloadIcsCalendar(calendarDays)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-sm bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 border-sky-500/40"
            title="Esporta il calendario serale e weekend completo (.ics) compatibile con Google Calendar, Apple Calendar e Outlook"
          >
            <IconCalendar className="w-3.5 h-3.5 text-sky-400" />
            <span>Esporta .ics</span>
          </button>

          {/* Sunday Weekly Retrospective (Punto 19) */}
          {onOpenRetrospective && (
            <button
              type="button"
              onClick={onOpenRetrospective}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-sm bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border-indigo-500/40"
              title="Apri la retrospezione settimanale della domenica sera con diagnostica lavoratore"
            >
              <span>📊 Review Domenica</span>
            </button>
          )}

          {/* Pre-Exam Express Review Toggle (Punto 20) */}
          <button
            type="button"
            onClick={() => setIsExpressReviewActive(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-sm ${
              isExpressReviewActive
                ? "bg-amber-500/25 text-amber-200 border-amber-500/50"
                : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800"
            }`}
            title="Modalità Sprint Pre-Esame (Triage 7gg): concentra lo studio solo su argomenti a Priorità 4 e 5 e temi d'esame"
          >
            <span>🎯 {isExpressReviewActive ? "Sprint Pre-Esame Attivo" : "Sprint Pre-Esame"}</span>
          </button>

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
                filterSubject === "analisi" ? "bg-indigo-600/30 text-indigo-300 shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Analisi
            </button>
            <button
              onClick={() => setFilterSubject("geometria")}
              className={`px-3 py-1 rounded-lg transition ${
                filterSubject === "geometria" ? "bg-teal-600/30 text-teal-300 shadow" : "text-slate-400 hover:text-slate-200"
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
            if (filterSubject === "analisi" && !t.materia.toLowerCase().includes("analisi")) return false;
            if (filterSubject === "geometria" && !t.materia.toLowerCase().includes("geometria")) return false;
            if (isExpressReviewActive) {
              const isHighPrio = (t.prioritaEsame >= 4 || t.difficolta >= 4);
              const isExamTrial = t.id === "A-32" || t.id === "G-31";
              return isHighPrio || isExamTrial;
            }
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

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Quick Log Studio Button for this day */}
                  <button
                    type="button"
                    onClick={() => onOpenLogModal && onOpenLogModal({ date: day.date })}
                    className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-500/40 hover:to-teal-500/40 text-emerald-300 hover:text-emerald-200 text-xs font-mono font-bold border border-emerald-500/40 transition active:scale-95 flex items-center gap-1.5 shadow-sm"
                    title={`Registra ore di studio svolte per ${day.dayName} ${formatDateDisplay(day.date)} (+)`}
                  >
                    <span className="text-sm font-black leading-none">+</span>
                    <span>Registra Studio</span>
                  </button>

                  {/* Time Shifter: Stepper Controls */}
                  <div className="flex items-center space-x-1 bg-slate-950/80 border border-slate-800 p-1 rounded-xl shadow-inner">
                    <button
                      type="button"
                      onClick={() => onUpdateDayCapacity && onUpdateDayCapacity(day.date, Math.max(0, Number((day.maxHours - 0.5).toFixed(1))))}
                      disabled={day.maxHours <= 0}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold border border-slate-700 transition disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                      title="Riduci budget di 30 minuti (-0.5h)"
                    >
                      - 30m
                    </button>

                    <div
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition ${
                        day.hasCustomOverride
                          ? day.maxHours > (day.standardHours || 2.5)
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-slate-900 text-slate-300 border border-slate-800"
                      }`}
                      title={day.hasCustomOverride ? `Capacità modificata rispetto al default (${day.standardHours || 2.5}h)` : "Capacità standard"}
                    >
                      <span>Budget: {day.maxHours}h</span>
                      {day.hasCustomOverride && (
                        <button
                          type="button"
                          onClick={() => onUpdateDayCapacity && onUpdateDayCapacity(day.date, null)}
                          className="ml-1 text-[10px] text-slate-400 hover:text-white hover:bg-slate-800 rounded px-1"
                          title="Ripristina budget predefinito"
                        >
                          ↺
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onUpdateDayCapacity && onUpdateDayCapacity(day.date, Number((day.maxHours + 0.5).toFixed(1)))}
                      disabled={day.maxHours >= MAX_DAY_CAPACITY_HOURS}
                      className="px-2 py-0.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-mono font-bold border border-cyan-500/40 transition active:scale-95 shadow-sm"
                      title={day.maxHours >= MAX_DAY_CAPACITY_HOURS ? `Budget massimo raggiunto (${MAX_DAY_CAPACITY_HOURS}h)` : "Slot Extra: Aumenta budget di 30 minuti (+0.5h)"}
                    >
                      + 30m
                    </button>
                  </div>

                  {/* Workload Indicator */}
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs font-mono">
                    <span className="text-slate-500">Carico:</span>
                    <span className={`font-bold ${
                      day.allocatedHours > day.maxHours ? "text-amber-400" : "text-slate-200"
                    }`}>
                      {day.allocatedHours}h / {day.maxHours}h max
                    </span>
                  </div>
                </div>
              </div>

              {/* Spaced Repetition Cyclical Reviews Banner */}
              {day.spacedReviews && day.spacedReviews.length > 0 && (
                <div className="mb-3.5 p-3 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/40 border border-purple-500/40 shadow-md">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-purple-500/20 text-purple-300">🧠</span>
                      <span className="font-extrabold text-xs text-purple-200">
                        Ripasso Spaced Repetition ({day.spacedReviews.length})
                      </span>
                    </div>
                    <span className="text-[10px] text-purple-300/80 font-mono">
                      15-20m • Teoria & formule a memoria
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {day.spacedReviews.map(rev => (
                      <div
                        key={`${rev.topicId}-${rev.levelKey}`}
                        className={`flex flex-col gap-2 p-2 rounded-xl border text-xs transition ${
                          rev.isDone
                            ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
                            : rev.isOverdue
                            ? "bg-amber-950/40 border-amber-500/30 text-amber-200"
                            : "bg-slate-900/90 border-slate-800 text-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            rev.isDone
                              ? "bg-emerald-500/20 text-emerald-300"
                              : rev.isOverdue
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-purple-500/20 text-purple-300"
                          }`}>
                            {rev.levelLabel}
                          </span>
                          <span className="font-mono font-bold text-slate-100">{rev.topicId}</span>
                          <span className="truncate text-slate-300 text-[11px] max-w-[140px] sm:max-w-[200px]" title={rev.argomento}>
                            {rev.argomento}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => onOpenTopicDetail && onOpenTopicDetail(rev.topicId)}
                            className="p-1 px-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold border border-slate-700 transition"
                            title="Apri scheda informativa per ripasso veloce"
                          >
                            📖 Scheda
                          </button>
                          {rev.isDone && (
                            <button
                              type="button"
                              onClick={() => onToggleSpacedReview && onToggleSpacedReview(rev.topicId, rev.levelKey, false)}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold border bg-emerald-500/30 border-emerald-500/50 text-emerald-200 transition"
                              title="Annulla il ripasso"
                            >
                              {rev.outcome && REVIEW_OUTCOMES[rev.outcome] ? REVIEW_OUTCOMES[rev.outcome].label : "Ripassato"} ✓
                            </button>
                          )}
                        </div>
                        </div>
                        {!rev.isDone && (() => {
                          const openBugs = (mathBugs || []).filter(b => b.topicId === rev.topicId && !b.isResolved);
                          return (
                            <div className="flex flex-col gap-2">
                              {openBugs.length > 0 && (
                                <div className="text-[11px] text-slate-300 bg-amber-950/40 rounded-lg px-2 py-1.5">
                                  <span className="font-semibold text-amber-300">Prima di ripassare, i tuoi errori qui:</span>
                                  <ul className="mt-0.5 space-y-0.5">
                                    {openBugs.slice(0, 3).map(b => (
                                      <li key={b.id}>• {b.title}{b.fixRule ? ` — ${b.fixRule}` : ""}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[10px] text-slate-400 mr-1">Ripeti a memoria, poi:</span>
                                {[
                                  { key: "good", cls: "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300" },
                                  { key: "partial", cls: "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300" },
                                  { key: "failed", cls: "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300" }
                                ].map(opt => (
                                  <button
                                    key={opt.key}
                                    type="button"
                                    onClick={() => onToggleSpacedReview && onToggleSpacedReview(rev.topicId, rev.levelKey, true, opt.key)}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${opt.cls}`}
                                  >
                                    {REVIEW_OUTCOMES[opt.key].label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics list for the day */}
              {isSkipped ? (
                <div className="py-3 px-4 bg-slate-850 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>In questa data non è stato registrato studio. Gli argomenti sono stati riprogrammati a partire da oggi.</span>
                  <span className="text-amber-400/90 font-mono text-[11px]">0h svolte</span>
                </div>
              ) : visibleTopics.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-500 italic">
                  Nessun argomento previsto in questo slot (riposo o filtro attivo).
                </div>
              ) : (
                <div className={`grid gap-3.5 ${
                  visibleTopics.length >= 3
                    ? "grid-cols-1 md:grid-cols-2 2xl:grid-cols-3"
                    : visibleTopics.length === 2
                    ? "grid-cols-1 xl:grid-cols-2"
                    : "grid-cols-1"
                }`}>
                  {visibleTopics.map(topic => {
                    const isAnalisi = topic.materia.toLowerCase().includes("analisi");
                    const isDone = Boolean(topic.completato !== undefined ? topic.completato : topic.isCompleted);
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
                        key={topic.sessionId || (topic.id + '_' + (topic.isSessionLog ? 'log' : 'sched'))}
                        className={`flex flex-col justify-between p-3.5 md:p-4 rounded-2xl border transition-all h-full ${
                          isDone
                            ? "bg-slate-950/60 border-slate-800/50 opacity-60"
                            : topic.isSessionLog
                            ? "bg-slate-950/90 border-emerald-500/40 shadow-sm shadow-emerald-950/20"
                            : isAnalisi
                            ? "bg-slate-950/80 hover:bg-slate-900 border-indigo-500/20 hover:border-indigo-500/40"
                            : "bg-slate-950/80 hover:bg-slate-900 border-teal-500/20 hover:border-teal-500/40"
                        }`}
                      >
                        {/* Upper row: Topic Header, Meta and Subject */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                              {/* Subject Badge */}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isAnalisi
                                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                  : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                              }`}>
                                {topic.materia}
                              </span>

                              {/* Topic ID & Info Trigger */}
                              <button
                                type="button"
                                onClick={() => onOpenTopicDetail && onOpenTopicDetail(topic)}
                                className="text-[11px] font-mono font-bold text-slate-300 hover:text-cyan-300 transition flex items-center gap-1 group/btn"
                                title="Apri scheda informativa dettagliata"
                              >
                                <span>{topic.id}</span>
                                <span className="text-[9px] font-sans px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 group-hover/btn:bg-cyan-500/20 border border-cyan-500/30">
                                  ℹ Info
                                </span>
                              </button>

                              {/* Chapter */}
                              <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                                • {topic.capitolo}
                              </span>

                              {/* Session Log Badge */}
                              {topic.isSessionLog && (
                                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                                  ✓ Sessione Svolta ({topic.effectiveHours}h){isDone ? ` • Completato il ${formatDateDisplay(topic.completedDate || topic.assignedDate)}` : ""}
                                </span>
                              )}

                              {/* Buffer +20% badge */}
                              {topic.hasBuffer && (
                                <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                                  +20% Buffer Priorità
                                </span>
                              )}

                              {isDone && !topic.isSessionLog && (
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                  ✓ Completato {topic.completedDate ? `il ${formatDateDisplay(topic.completedDate)}` : ""}
                                </span>
                              )}

                              {!isDone && (topic.oreEffettive || 0) > 0 && !topic.isSessionLog && (
                                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                                  ⏳ In Corso ({Number(topic.oreEffettive).toFixed(1)}h svolte)
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => onOpenTopicDetail && onOpenTopicDetail(topic)}
                              className="text-left group/title block cursor-pointer w-full"
                              title="Clicca per aprire la scheda dell'argomento"
                            >
                              <p className={`text-xs md:text-sm font-semibold transition ${
                                isDone ? "line-through text-slate-500" : "text-slate-200 group-hover/title:text-cyan-300"
                              }`}>
                                {topic.argomento}
                              </p>
                            </button>

                            {topic.sessionNote ? (
                              <p className="text-[11px] text-emerald-300/90 italic mt-0.5">
                                Nota di studio: "{topic.sessionNote}"
                              </p>
                            ) : topic.note ? (
                              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                Obiettivo: {topic.note}
                              </p>
                            ) : null}
                          </div>

                          {/* Allocation info on this day */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 flex-shrink-0 pt-1">
                            <div className="text-right">
                              <span className="text-[11px] text-slate-400 font-mono">In programma: </span>
                              <span className="text-xs font-mono font-bold text-white">
                                {topic.effectiveHours}h
                              </span>
                            </div>
                            {topic.isSplit && !topic.isSessionLog && (
                              <span
                                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30"
                                title={`Argomento diviso su più giorni: ${topic.topicEffectiveHours}h totali pianificate`}
                              >
                                Parte {topic.partIndex}/{topic.partCount}
                              </span>
                            )}
                            <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                              <span>P: <strong className="text-amber-400">{topic.prioritaEsame}/5</strong></span>
                              <span>D: <strong className="text-cyan-400">{topic.difficolta}/5</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Partial Progress & Hours Tracking Console */}
                        <div className="mt-3 p-3 bg-slate-950/70 border border-slate-800/90 rounded-2xl space-y-2.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            {/* Display Hours */}
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="text-xs font-mono text-slate-200 flex items-center gap-1.5">
                                <IconClock className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Ore spese:</span>
                                <strong className="text-cyan-300 font-bold text-sm">
                                  {Number(topic.oreEffettive || 0).toFixed(1)}
                                </strong>
                                <span className="text-slate-400">/ {Number(topic.oreStimate || 2.0).toFixed(1)} stimate</span>
                              </div>

                              {!isDone && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                  Residue: <strong>{Number(topic.oreResidue !== undefined ? topic.oreResidue : Math.max(0, (topic.oreStimate || 2.0) - (topic.oreEffettive || 0))).toFixed(1)}h</strong>
                                </span>
                              )}
                            </div>

                            {/* Quick Add Time Stepper Buttons */}
                            <div className="flex items-center space-x-1.5 self-start sm:self-center">
                              <button
                                type="button"
                                onClick={() => onUpdateTopicHours && onUpdateTopicHours(topic.id, -0.5, true)}
                                disabled={(topic.oreEffettive || 0) <= 0}
                                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[11px] font-mono font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Riduci ore spese (-30 minuti)"
                              >
                                - 30m
                              </button>

                              <button
                                type="button"
                                onClick={() => onUpdateTopicHours && onUpdateTopicHours(topic.id, 0.5, true)}
                                className="px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 text-[11px] font-mono font-bold transition active:scale-95 shadow-sm"
                                title="Aggiungi 30 minuti al tempo speso (+0.5h)"
                              >
                                + 30m
                              </button>

                              <button
                                type="button"
                                onClick={() => onUpdateTopicHours && onUpdateTopicHours(topic.id, 1.0, true)}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/40 text-[11px] font-mono font-bold transition active:scale-95 shadow-sm"
                                title="Aggiungi 1 ora al tempo speso (+1.0h)"
                              >
                                + 1h
                              </button>

                              <button
                                type="button"
                                onClick={() => onOpenLogModal && onOpenLogModal({ date: day.date, topicId: topic.id })}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600/25 hover:bg-emerald-500/35 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 text-[11px] font-mono font-bold transition active:scale-95 shadow-sm flex items-center gap-1"
                                title="Registra sessione personalizzata (+)"
                              >
                                <span className="font-black">+</span>
                                <span>Log</span>
                              </button>
                            </div>
                          </div>

                          {/* Progress Bar & Distinct Completed Toggle Button */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1.5 border-t border-slate-900">
                            {/* Micro Progress Bar */}
                            <div className="flex-1 flex items-center space-x-2.5">
                              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800/80">
                                <div
                                  className={`h-full transition-all duration-500 ${
                                    isDone
                                      ? "bg-emerald-400"
                                      : (topic.oreEffettive || 0) > 0
                                      ? "bg-gradient-to-r from-cyan-400 to-indigo-400"
                                      : "bg-transparent"
                                  }`}
                                  style={{
                                    width: `${Math.min(100, Math.round(((topic.oreEffettive || 0) / (topic.oreStimate || 2.0)) * 100))}%`
                                  }}
                                />
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                                {Math.min(100, Math.round(((topic.oreEffettive || 0) / (topic.oreStimate || 2.0)) * 100))}%
                              </span>
                            </div>

                            {/* Distinct Completion Toggle Button */}
                            <button
                              type="button"
                              onClick={() => onToggleComplete(topic.id)}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 flex-shrink-0 active:scale-95 ${
                                isDone
                                  ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/30 shadow-sm shadow-emerald-950/40"
                                  : "bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-700 hover:border-slate-500"
                              }`}
                              title={isDone ? "Argomento completato (clicca per riaprire)" : "Segna questo argomento come completato"}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                                isDone ? "bg-emerald-500 border-emerald-400 text-white" : "border-slate-500 bg-slate-950"
                              }`}>
                                {isDone && <IconCheck className="w-3 h-3" />}
                              </div>
                              <span>{isDone ? "Completato ✓" : "Segna come Completato"}</span>
                            </button>
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
                              onClick={() => handleQuickLogPomodoro(topic.id)}
                              className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                              title="Registra istantaneamente una sessione Pomodoro da 50 minuti (0.8h) nel diario di studio"
                            >
                              <span>🍅 +50m Log</span>
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
