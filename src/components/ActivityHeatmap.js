import React, { useState, useMemo } from "react";
import { IconFlame, IconCheckCircle, IconClock, IconCalendar, IconBookOpen } from "./Icons.js";

export function ActivityHeatmap({ calendarDays = [], historyDays = [], metrics = {}, onSetDate }) {
  const [selectedDay, setSelectedDay] = useState(null);

  // Group days into weeks for the GitHub-like grid
  // Standard UNIMORE roadmap starts Monday 16 Nov 2026
  const { weeksGrid, streakDays, totalCompletedHours, completedDaysCount } = useMemo(() => {
    const days = calendarDays.length > 0 ? calendarDays : historyDays;
    
    // Sort chronologically
    const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));

    // Group by weekIndex
    const map = new Map();
    let compHours = 0;
    let compCount = 0;

    sorted.forEach(day => {
      if (!map.has(day.weekIndex)) {
        map.set(day.weekIndex, []);
      }
      map.get(day.weekIndex).push(day);

      if ((day.isPast || day.isToday) && day.dayStatus === "completed") {
        compHours += Number(day.allocatedHours) || 0;
        compCount += 1;
      }
    });

    const weeks = Array.from(map.entries()).map(([wIndex, wDays]) => {
      // Ensure days are ordered Monday (1) to Sunday (0)
      const daySlots = [null, null, null, null, null, null, null]; // 0=Mon ... 6=Sun
      wDays.forEach(d => {
        // Javascript getDay(): 0 is Sun, 1 is Mon...
        const slotIdx = d.dayOfWeek === 0 ? 6 : d.dayOfWeek - 1;
        daySlots[slotIdx] = d;
      });
      return {
        weekIndex: wIndex,
        startDate: wDays[0]?.date,
        endDate: wDays[wDays.length - 1]?.date,
        daySlots
      };
    });

    // Calculate active study streak
    let currentStreak = 0;
    const pastDaysChronological = sorted.filter(d => d.isPast || d.isToday);
    for (let i = pastDaysChronological.length - 1; i >= 0; i--) {
      const d = pastDaysChronological[i];
      if (d.dayStatus === "completed") {
        currentStreak++;
      } else if (d.dayStatus === "skipped") {
        break;
      }
    }

    return {
      weeksGrid: weeks,
      streakDays: currentStreak,
      totalCompletedHours: Number(compHours.toFixed(1)),
      completedDaysCount: compCount
    };
  }, [calendarDays, historyDays]);

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  // Cell style logic based on completed hours and day status
  const getCellClasses = (day) => {
    if (!day) return "bg-transparent opacity-0 cursor-default";

    const isToday = day.isToday;
    const isCompleted = (day.isPast || day.isToday) && day.dayStatus === "completed";
    const isSkipped = day.isPast && day.dayStatus === "skipped";
    const isFuture = day.isFuture;
    const hours = Number(day.allocatedHours) || 0;

    let base = "w-6 h-6 sm:w-7 sm:h-7 rounded-lg transition-all flex items-center justify-center text-[10px] font-mono cursor-pointer relative ";

    if (isToday) {
      return base + "ring-2 ring-cyan-400 bg-cyan-950/80 border border-cyan-400 text-cyan-200 font-bold shadow-lg shadow-cyan-500/20";
    }

    if (isCompleted) {
      if (hours >= 4.0) {
        return base + "bg-emerald-400 text-slate-950 font-bold border border-emerald-300 shadow-sm shadow-emerald-400/40 hover:scale-110";
      } else if (hours >= 2.0) {
        return base + "bg-emerald-600 text-white font-semibold border border-emerald-500/60 shadow-sm shadow-emerald-600/30 hover:scale-110";
      } else {
        return base + "bg-emerald-800/80 text-emerald-200 border border-emerald-700/40 hover:scale-110";
      }
    }

    if (isSkipped) {
      return base + "bg-slate-900 border border-amber-500/50 text-amber-400 hover:border-amber-400";
    }

    if (isFuture) {
      if (day.topics && day.topics.length > 0) {
        return base + "bg-slate-900/60 border border-slate-700/60 text-slate-500 hover:border-slate-500 hover:text-slate-300";
      }
      return base + "bg-slate-950/60 border border-slate-800/60 text-slate-600";
    }

    return base + "bg-slate-950 border border-slate-800/40 text-slate-700";
  };

  const dayLabels = ["L", "M", "M", "G", "V", "S", "D"];

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 md:p-6 backdrop-blur-md shadow-xl space-y-4">
      {/* Top Banner / Heatmap Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              <IconCalendar className="w-5 h-5 text-emerald-400" />
              Activity Heatmap (Mappa di Studio)
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              UNIMORE Contribution
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Tracciamento visivo delle ore di studio effettuate e programmate fino al 10 Gennaio 2027.
          </p>
        </div>

        {/* Quick Streak & Stats Pills */}
        <div className="flex items-center space-x-2 flex-wrap">
          <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center space-x-2">
            <IconFlame className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">Streak attiva:</span>
            <span className="text-xs font-bold text-amber-300 font-mono">{streakDays} gg</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center space-x-2">
            <IconCheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">Ore svolte:</span>
            <span className="text-xs font-bold text-emerald-300 font-mono">{totalCompletedHours}h</span>
          </div>
        </div>
      </div>

      {/* The GitHub-style Grid */}
      <div className="overflow-x-auto pb-2 pt-1">
        <div className="min-w-[650px] flex gap-2">
          {/* Day of Week Labels Column */}
          <div className="flex flex-col justify-between py-1 pr-1 text-[11px] font-bold text-slate-400 font-mono select-none">
            {dayLabels.map((l, idx) => (
              <span key={idx} className="h-6 sm:h-7 flex items-center justify-center w-4">
                {l}
              </span>
            ))}
          </div>

          {/* Weeks Columns */}
          <div className="flex gap-2">
            {weeksGrid.map((week) => (
              <div key={week.weekIndex} className="flex flex-col gap-1.5">
                {/* Week Header */}
                <div className="text-[10px] font-mono text-slate-400 text-center font-bold">
                  W{week.weekIndex}
                </div>

                {/* 7 Days in Week */}
                {week.daySlots.map((day, dIdx) => (
                  <button
                    type="button"
                    key={dIdx}
                    onClick={() => day && setSelectedDay(day)}
                    className={getCellClasses(day)}
                    title={day ? `${day.dayName} ${day.date} — ${day.allocatedHours}h (${day.dayStatus})` : ""}
                  >
                    {day?.isToday ? (
                      <span className="text-[9px] font-black">★</span>
                    ) : day?.dayStatus === "completed" ? (
                      <span>{day.allocatedHours > 0 ? Math.round(day.allocatedHours) : "✓"}</span>
                    ) : day?.dayStatus === "skipped" ? (
                      <span className="text-amber-400 text-[10px]">✕</span>
                    ) : null}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend & Explanations */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/70 gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-[11px]">Intensità ore:</span>
          <span className="text-[10px]">Meno</span>
          <div className="flex items-center space-x-1">
            <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-800" title="0h" />
            <div className="w-3.5 h-3.5 rounded bg-emerald-800/80 border border-emerald-700" title="< 2h" />
            <div className="w-3.5 h-3.5 rounded bg-emerald-600 border border-emerald-500" title="2h - 3.5h" />
            <div className="w-3.5 h-3.5 rounded bg-emerald-400 border border-emerald-300" title="> 3.5h" />
          </div>
          <span className="text-[10px]">Più</span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded ring-2 ring-cyan-400 bg-cyan-950 inline-block" /> Oggi
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded border border-amber-500/60 bg-slate-900 text-amber-400 flex items-center justify-center text-[9px]">✕</span> Saltato
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded border border-slate-700 bg-slate-900/60 inline-block" /> Programmato
          </span>
        </div>
      </div>

      {/* Selected Day Details Drawer (if clicked) */}
      {selectedDay && (
        <div className="mt-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 animate-fade-in text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded-lg font-mono font-bold ${
                selectedDay.isToday
                  ? "bg-cyan-500 text-black"
                  : selectedDay.dayStatus === "completed"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-slate-800 text-slate-300"
              }`}>
                {selectedDay.dayName} {formatDateDisplay(selectedDay.date)}
              </span>
              <span className="text-slate-400 font-mono">
                {selectedDay.timeSlot}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {onSetDate && !selectedDay.isToday && (
                <button
                  type="button"
                  onClick={() => onSetDate(selectedDay.date)}
                  className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg font-bold transition text-[11px]"
                >
                  Simula come "Oggi"
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="text-slate-500 hover:text-white px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-slate-300">
            <div>
              Stato: <strong className={selectedDay.dayStatus === "completed" ? "text-emerald-400" : selectedDay.dayStatus === "skipped" ? "text-amber-400" : "text-cyan-300"}>
                {selectedDay.dayStatus === "completed" ? `Completato (${selectedDay.allocatedHours}h)` : selectedDay.dayStatus === "skipped" ? "Giorno saltato (ribilanciato)" : `Programmato (${selectedDay.allocatedHours}h)`}
              </strong>
            </div>
            <div className="text-slate-400">
              Materia: <strong>{selectedDay.preferredSubject}</strong>
            </div>
          </div>

          {selectedDay.topics && selectedDay.topics.length > 0 ? (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-semibold">Argomenti del giorno:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {selectedDay.topics.map(t => (
                  <div key={t.id} className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="font-mono font-bold text-cyan-300">{t.id}</span>
                      <span className="text-slate-200 truncate">{t.argomento}</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-semibold flex-shrink-0 ml-2">
                      {t.effectiveHours || t.oreStimate}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-500 italic text-[11px] pt-1">Nessun argomento specifico assegnato per questo giorno.</p>
          )}
        </div>
      )}
    </div>
  );
}
