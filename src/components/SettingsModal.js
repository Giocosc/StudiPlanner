import React, { useState } from "react";
import { IconSettings, IconClock, IconCalendar, IconBriefcase, IconFlame, IconSun, IconMoon } from "./Icons.js";
import { getLocalTodayDateStr } from "../services/rebalancerEngine.js";

// Il contenuto viene montato a ogni apertura: il form parte sempre dalle impostazioni
// CORRENTI (prima lo stato del form veniva creato una sola volta all'avvio dell'app e
// salvando si ripristinavano data attiva e impostazioni ormai vecchie).
export function SettingsModal(props) {
  if (!props.isOpen) return null;
  return <SettingsModalContent {...props} />;
}

const numberOr = (raw, fallback) => {
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
};

function SettingsModalContent({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  customDayCapacities = {},
  onResetDayCapacities
}) {
  const [touchedFields, setTouchedFields] = useState({});
  const [formData, setFormData] = useState({
    ...settings,
    eveningStudyHours: settings.eveningStudyHours !== undefined ? settings.eveningStudyHours : (settings.weekdayStudyHours || 2.5),
    weekdayStudyHours: settings.weekdayStudyHours !== undefined ? settings.weekdayStudyHours : (settings.eveningStudyHours || 2.5),
    weekendStudyHours: settings.weekendStudyHours !== undefined ? settings.weekendStudyHours : 4.5,
    criticalWeeklyHoursThreshold: settings.criticalWeeklyHoursThreshold || 25.0
  });

  const handleChange = (field, val) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: val
      };

      if (field === "eveningStudyHours") {
        updated.weekdayStudyHours = Number(val);
      }

      return updated;
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Si salvano SOLO i campi modificati, sopra le impostazioni attuali: così una data
    // avanzata nel frattempo (o arrivata dal sync) non viene sovrascritta.
    const edits = {};
    Object.keys(touchedFields).forEach(field => {
      edits[field] = formData[field];
    });
    if (touchedFields.eveningStudyHours) {
      const evening = numberOr(formData.eveningStudyHours, 2.5);
      edits.eveningStudyHours = evening;
      edits.weekdayStudyHours = evening;
    }
    onSaveSettings({ ...settings, ...edits });
    onClose();
  };

  // Un solo giorno di riposo: il primo giorno disattivato in studyDays
  const restDayValue = (() => {
    const days = formData.studyDays || {};
    const off = [1, 2, 3, 4, 5, 6, 0].find(dow => days[dow] && days[dow].enabled === false);
    return off === undefined ? "none" : String(off);
  })();

  const handleRestDayChange = (value) => {
    const base = formData.studyDays || {};
    const next = {};
    Object.keys(base).forEach(dow => {
      next[dow] = { ...base[dow], enabled: value === "none" ? true : String(dow) !== value };
    });
    handleChange("studyDays", next);
  };

  const currentWeekday = numberOr(formData.eveningStudyHours, 2.5);
  const currentWeekend = numberOr(formData.weekendStudyHours, 4.5);
  const nominalWeeklyCapacity = Number(((currentWeekday * 5) + (currentWeekend * 2)).toFixed(1));
  const customOverridesCount = Object.keys(customDayCapacities || {}).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl p-6 shadow-2xl shadow-cyan-950/40 relative">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
              <IconSettings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Parametri di Ribilanciamento</h3>
              <p className="text-xs text-slate-400">Personalizza orari di studio, slot e date d'esame</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Target Exam Date & Today Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Data Esame (Target)
              </label>
              <input
                type="date"
                value={formData.targetExamDate}
                onChange={(e) => handleChange("targetExamDate", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">
                  Data Odierna (Simulata)
                </label>
                <button
                  type="button"
                  onClick={() => handleChange("currentSimulatedDate", getLocalTodayDateStr(formData.roadmapStartDate, formData.targetExamDate))}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 underline font-mono"
                  title="Reimposta sulla data reale odierna del computer"
                >
                  Usa Oggi Reale
                </button>
              </div>
              <input
                type="date"
                value={formData.currentSimulatedDate}
                onChange={(e) => handleChange("currentSimulatedDate", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Work and Study Slots */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3.5">
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <div className="flex items-center space-x-2">
                <IconBriefcase className="w-4 h-4" />
                <span>Orari Base & Gestione Flessibile Slot Extra</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                Feriale base: {currentWeekday}h/gg
              </span>
            </div>

            {/* Flexible Extra Slots Info Card */}
            <div className="p-3 bg-gradient-to-r from-slate-900/90 to-cyan-950/30 rounded-xl border border-cyan-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
                  <IconSun className="w-4 h-4 text-amber-400" />
                  Gestione Flessibile Slot Extra (Time Shifter)
                </span>
                {customOverridesCount > 0 ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {customOverridesCount} date personalizzate
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold text-slate-400">Dinamico nel To-Do</span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Gli slot extra non sono più rigidi o vincolati al solo pomeriggio. Nella scheda <strong>To-Do Settimanale</strong> puoi usare i controlli <strong>[- 30m]</strong> e <strong>[+ 30m]</strong> nell'header di ogni giorno per modellare al volo il budget in base ai tuoi imprevisti lavorativi!
              </p>
              {customOverridesCount > 0 && onResetDayCapacities && (
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Ripristinare le capacità standard per tutti i ${customOverridesCount} giorni personalizzati?`)) {
                        onResetDayCapacities();
                      }
                    }}
                    className="text-[11px] text-rose-300 hover:text-rose-200 underline"
                  >
                    Ripristina tutti i giorni ai default standard
                  </button>
                </div>
              )}
            </div>

            {/* Baseline Evening & Weekend Slots */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-slate-300 font-semibold text-[11px]">
                  <IconMoon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sera Feriale (19:30 - 22:00)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="6"
                    value={formData.eveningStudyHours}
                    onChange={(e) => handleChange("eveningStudyHours", Math.max(0, numberOr(e.target.value, 0)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-slate-500 font-mono">h/sera</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-slate-300 font-semibold text-[11px]">
                  <IconClock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Weekend (Sab - Dom)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    value={formData.weekendStudyHours}
                    onChange={(e) => handleChange("weekendStudyHours", Math.max(0, numberOr(e.target.value, 0)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-slate-500 font-mono">h/gg</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-900/50 p-2 rounded-xl flex items-center justify-between">
              <span>Capacità nominale standard settimanale:</span>
              <strong className="text-cyan-300 font-mono">{nominalWeeklyCapacity}h / settimana</strong>
            </div>
          </div>

          {/* Giorno di riposo e jolly della serie */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Giorno di riposo</label>
              <select
                value={restDayValue}
                onChange={(e) => handleRestDayChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="none">Nessuno (studio tutti i giorni)</option>
                {[1, 2, 3, 4, 5, 6, 0].map(dow => (
                  <option key={dow} value={String(dow)}>{(formData.studyDays?.[dow]?.name) || dow}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1">Niente studio pianificato: la serie non si interrompe</p>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Jolly al mese</label>
              <select
                value={String(formData.streakJokersPerMonth ?? 1)}
                onChange={(e) => handleChange("streakJokersPerMonth", Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                {[0, 1, 2, 3].map(n => <option key={n} value={String(n)}>{n}</option>)}
              </select>
              <p className="text-[10px] text-slate-500 mt-1">Sere saltate che non azzerano la serie</p>
            </div>
          </div>

          {/* Promemoria serale */}
          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.eveningReminderEnabled)}
                  onChange={async (e) => {
                    const on = e.target.checked;
                    if (on && typeof Notification !== "undefined" && Notification.permission === "default") {
                      try { await Notification.requestPermission(); } catch (err) { /* permesso negato */ }
                    }
                    handleChange("eveningReminderEnabled", on);
                  }}
                  className="w-4 h-4 accent-[#0071E3]"
                />
                Promemoria serale
              </label>
              <input
                type="time"
                value={formData.eveningReminderTime || "19:15"}
                onChange={(e) => handleChange("eveningReminderTime", e.target.value || "19:15")}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <p className="text-[10px] text-slate-500">
              {typeof Notification === "undefined"
                ? "Questo browser non supporta le notifiche."
                : Notification.permission === "denied"
                ? "Notifiche bloccate nel browser: riattivale dalle impostazioni del sito."
                : "Una notifica con l'argomento della sera, solo se non hai ancora studiato. Funziona con l'app aperta o installata e in background."}
            </p>
          </div>

          {/* Critical Threshold & Buffer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <IconFlame className="w-3.5 h-3.5 text-rose-400" />
                Soglia Burnout Critica
              </label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  step="1"
                  min="10"
                  max="45"
                  value={formData.criticalWeeklyHoursThreshold}
                  onChange={(e) => handleChange("criticalWeeklyHoursThreshold", parseFloat(e.target.value) || 25)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                />
                <span className="text-slate-500 font-mono">h/sett.</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Consigliata a 25h/sett. per serale puro, o 35h se impieghi regolarmente slot extra
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Buffer Alta Priorità/Difficoltà
              </label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  step="5"
                  min="0"
                  max="50"
                  value={Math.round((formData.bufferMultiplier - 1) * 100)}
                  onChange={(e) => {
                    const pct = Math.max(0, numberOr(e.target.value, 0));
                    handleChange("bufferMultiplier", 1 + pct / 100);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <span className="text-slate-500 font-mono">%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Tempo extra allocato (+20%)</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition font-medium"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl transition shadow-lg shadow-cyan-950/40"
            >
              Salva e Ricalcola
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
