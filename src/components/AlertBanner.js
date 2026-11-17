import React, { useState } from "react";
import { IconAlertTriangle, IconFlame, IconClock, IconBriefcase } from "./Icons.js";

export function AlertBanner({ metrics, onOpenSettings }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!metrics || !metrics.isCriticalOverload) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-emerald-950/20 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <IconClock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-emerald-300">Carico Settimanale Sostenibile</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                {metrics.requiredWeeklyHours}h / sett. (Soglia Max {metrics.criticalWeeklyHoursThreshold}h)
              </span>
              {metrics.hasCustomOverrides && (
                <span className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  +Slot Extra Flessibili Attivi ({metrics.customOverridesCount} gg)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Il ritmo di studio è ben calibrato: {metrics.hasCustomOverrides ? "la flessibilità degli slot extra nei singoli giorni garantisce sostenibilità elevata senza sovraccarico" : "le serate e i weekend coprono interamente il programma"} entro il 10 Gennaio 2027.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenSettings}
          className="text-xs text-slate-400 hover:text-emerald-300 underline transition-colors px-2 py-1"
        >
          Modifica Soglia
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-rose-950/80 via-red-950/70 to-amber-950/60 border-2 border-rose-500/50 rounded-2xl p-4 md:p-5 shadow-2xl shadow-rose-950/40 backdrop-blur-md animate-pulse-subtle">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-400 border border-rose-500/30 flex-shrink-0 animate-bounce-subtle">
            <IconAlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-bold text-rose-200 tracking-wide flex items-center gap-1.5">
                <IconFlame className="w-4 h-4 text-rose-400" />
                ALLERTA SOVRACCARICO CRITICO
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-200 font-mono font-bold border border-rose-500/40">
                {metrics.requiredWeeklyHours} ORE / SETT.
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-black/40 text-rose-300 border border-rose-500/20">
                Soglia Massima: {metrics.criticalWeeklyHoursThreshold}h/sett. (+{metrics.excessHours}h in eccesso)
              </span>
            </div>

            <p className="text-xs md:text-sm text-rose-200/90 mt-1 leading-relaxed">
              <strong>Attenzione per lavoratore full-time:</strong> Il monte ore di studio netto necessario per completare Analisi 1 e Geometria entro il <strong>10 Gennaio 2027</strong> supera la soglia critica di sicurezza ({metrics.criticalWeeklyHoursThreshold}h/settimana). Rischio elevato di affaticamento cognitivo o ritardo.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end md:self-center flex-shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 px-3 py-1.5 rounded-xl border border-rose-700/50 transition-colors font-medium"
          >
            {isExpanded ? "Nascondi Consigli" : "Strategia di Recupero"}
          </button>
          <button
            onClick={onOpenSettings}
            className="text-xs bg-rose-500 hover:bg-rose-600 text-white font-semibold px-3 py-1.5 rounded-xl transition shadow-md shadow-rose-950/50"
          >
            Ribilancia Orari
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-rose-500/20 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-rose-100">
          <div className="bg-black/30 p-3 rounded-xl border border-rose-500/20">
            <div className="font-semibold text-rose-300 flex items-center gap-1.5 mb-1">
              <IconBriefcase className="w-4 h-4 text-rose-400" />
              1. Gestione Flessibile Slot Extra
            </div>
            <p className="text-rose-200/80">
              Usa i pulsanti [+ 30m] nel To-Do Settimanale per aggiungere ore nei giorni con permessi, pause o anticipi feriali, distribuendo il carico.
            </p>
          </div>

          <div className="bg-black/30 p-3 rounded-xl border border-rose-500/20">
            <div className="font-semibold text-rose-300 flex items-center gap-1.5 mb-1">
              <IconClock className="w-4 h-4 text-amber-400" />
              2. Weekend Intensivi
            </div>
            <p className="text-rose-200/80">
              Aumenta le ore nei blocchi di Sabato e Domenica da 4.5h a 6h per accumulare ore diurne di qualità ed evitare affaticamento.
            </p>
          </div>

          <div className="bg-black/30 p-3 rounded-xl border border-rose-500/20">
            <div className="font-semibold text-rose-300 flex items-center gap-1.5 mb-1">
              <IconFlame className="w-4 h-4 text-emerald-400" />
              3. Priorità a Scaletta
            </div>
            <p className="text-rose-200/80">
              Il sistema ha già ordinato gli argomenti: focalizzati al 100% su quelli con Priorità 5 (Taylor, Integrali, Rouché-Capelli, Coniche).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
