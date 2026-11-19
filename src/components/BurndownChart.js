import React from "react";
import { IconFlame, IconClock, IconCalendar } from "./Icons.js";
import { calculateBurndown, DEFAULT_ROADMAP_START_DATE, DEFAULT_TARGET_EXAM_DATE } from "../services/rebalancerEngine.js";

const MONTHS_IT = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
const formatShortDate = (s) => {
  const [, m, d] = String(s).split("-").map(Number);
  return `${d} ${MONTHS_IT[m - 1] || ""}`;
};

export function BurndownChart({ metrics, progress, settings }) {
  if (!metrics || !progress) return null;

  const roadmapStartDate = metrics.roadmapStartDate || (settings && settings.roadmapStartDate) || DEFAULT_ROADMAP_START_DATE;
  const targetExamDate = metrics.targetExamDate || (settings && settings.targetExamDate) || DEFAULT_TARGET_EXAM_DATE;
  const burndown = calculateBurndown({
    totalHours: progress.global.totalHours,
    // Ore stimate residue (senza buffer), omogenee con le ore stimate totali
    remainingHours: progress.global.remainingHours,
    roadmapStartDate,
    targetExamDate,
    currentSimulatedDate: metrics.currentSimulatedDate || (settings && settings.currentSimulatedDate) || roadmapStartDate
  });
  const totalHours = burndown.totalHours || 1;
  const remainingHours = burndown.remainingHours;
  const completedHours = progress.global.completedHours || 0;

  // SVG Coordinates setup
  const width = 800;
  const height = 240;
  const padLeft = 60;
  const padRight = 40;
  const padTop = 30;
  const padBottom = 40;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Coordinate scales
  const getY = (hrs) => {
    const clamped = Math.max(0, Math.min(totalHours, hrs));
    return padTop + chartH - (clamped / totalHours) * chartH;
  };

  // Asse X fisso: frazione [0, 1] del periodo inizio roadmap -> giorno d'esame
  const getX = (fraction) => padLeft + fraction * chartW;

  // Generate data points
  // Ideal points: (0, totalHours) -> (totalWeeks-1, 0)
  const idealX1 = getX(0);
  const idealY1 = getY(totalHours);
  const idealX2 = getX(1);
  const idealY2 = getY(0);

  // Actual points:
  // Week 0: totalHours
  // Today's point: (currentWeekFraction, remainingHours)
  const todayX = getX(burndown.fraction);
  const todayY = getY(remainingHours);

  const { isAheadOfSchedule, deltaHours } = burndown;

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 md:p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <IconFlame className="w-3 h-3 text-cyan-400" />
              Scrum / Agile Study Tracking
            </span>
            <span className="text-xs text-slate-400">Target: {formatShortDate(targetExamDate)} {String(targetExamDate).slice(0, 4)}</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Grafico Burndown: Ore Residue vs Linea Ideale
          </h3>
          <p className="text-xs text-slate-400">
            Confronto continuo tra la traiettoria ideale di bruciatura ore e il carico effettivo rimanente.
          </p>
        </div>

        {/* Ahead / Behind Schedule Badge */}
        <div className={`px-3.5 py-1.5 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
          isAheadOfSchedule
            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
            : "bg-amber-500/15 border-amber-500/30 text-amber-300"
        }`}>
          <span>{isAheadOfSchedule ? "🚀 In Anticipo" : "⚠️ Lieve Ritardo"}</span>
          <span className="font-mono">({deltaHours}h {isAheadOfSchedule ? "sotto target" : "sopra target"})</span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[550px] select-none"
        >
          {/* Background grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = padTop + chartH * pct;
            const hrs = Math.round(totalHours * (1 - pct));
            return (
              <g key={i}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padLeft - 10}
                  y={y + 4}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {hrs}h
                </text>
              </g>
            );
          })}

          {/* Ideal Burn Line (Dashed Slate) */}
          <line
            x1={idealX1}
            y1={idealY1}
            x2={idealX2}
            y2={idealY2}
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />

          {/* Actual Line (Start to Today) */}
          <line
            x1={idealX1}
            y1={idealY1}
            x2={todayX}
            y2={todayY}
            stroke={isAheadOfSchedule ? "#10b981" : "#f59e0b"}
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Projected Line (Today to Finish) */}
          <line
            x1={todayX}
            y1={todayY}
            x2={idealX2}
            y2={idealY2}
            stroke={isAheadOfSchedule ? "#065f46" : "#78350f"}
            strokeWidth="2"
            strokeDasharray="3 3"
          />

          {/* Start Point */}
          <circle cx={idealX1} cy={idealY1} r="5" fill="#38bdf8" />

          {/* Today Point */}
          <circle
            cx={todayX}
            cy={todayY}
            r="7"
            fill={isAheadOfSchedule ? "#10b981" : "#f59e0b"}
            stroke="#070b14"
            strokeWidth="3"
            className="animate-pulse"
          />

          {/* Today Label Tag */}
          <rect
            x={todayX - 35}
            y={todayY - 26}
            width="70"
            height="18"
            rx="5"
            fill="#0f172a"
            stroke={isAheadOfSchedule ? "#10b981" : "#f59e0b"}
            strokeWidth="1"
          />
          <text
            x={todayX}
            y={todayY - 14}
            fill="#f8fafc"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            OGGI: {remainingHours}h
          </text>

          {/* End Point (10 Jan 2027) */}
          <circle cx={idealX2} cy={idealY2} r="5" fill="#a855f7" />

          {/* X Axis Labels */}
          <text x={idealX1} y={height - 12} fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
            Inizio ({formatShortDate(roadmapStartDate)})
          </text>
          <text x={todayX} y={height - 12} fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            Data Odierna
          </text>
          <text x={idealX2} y={height - 12} fill="#c084fc" fontSize="10" textAnchor="end" fontFamily="sans-serif">
            Esame ({formatShortDate(targetExamDate)})
          </text>
        </svg>
      </div>

      {/* Legend & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400 mt-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-0.5 bg-slate-400 border-b border-dashed border-slate-400 inline-block"></span>
            <span>Traiettoria Ideale</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className={`w-3.5 h-1 rounded inline-block ${isAheadOfSchedule ? "bg-emerald-400" : "bg-amber-400"}`}></span>
            <span>Ore Stimate Residue</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 font-mono text-[11px]">
          <span>Ore Iniziali: <strong className="text-white">{totalHours}h</strong></span>
          <span>Completate: <strong className="text-emerald-400">{completedHours}h</strong></span>
          <span>Da Bruciare: <strong className="text-cyan-400">{remainingHours}h</strong></span>
        </div>
      </div>
    </div>
  );
}
