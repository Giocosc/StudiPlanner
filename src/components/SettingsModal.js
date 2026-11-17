import React, { useState } from "react";
import { IconSettings, IconClock, IconCalendar, IconBriefcase, IconFlame, IconSun, IconMoon } from "./Icons.js";

export function SettingsModal({ isOpen, onClose, settings, onSaveSettings }) {
  const [formData, setFormData] = useState({
    ...settings,
    enableAfternoonSlot: settings.enableAfternoonSlot !== false,
    afternoonStudyHours: settings.afternoonStudyHours !== undefined ? settings.afternoonStudyHours : 2.5,
    eveningStudyHours: settings.eveningStudyHours !== undefined ? settings.eveningStudyHours : 2.5,
  });

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: val
      };

      // Keep weekdayStudyHours synced with afternoon + evening sum
      const afternoon = updated.enableAfternoonSlot ? Number(updated.afternoonStudyHours || 2.5) : 0;
      const evening = Number(updated.eveningStudyHours || 2.5);
      updated.weekdayStudyHours = Number((afternoon + evening).toFixed(1));

      // If user toggles afternoon slot, suggest updated burnout threshold
      if (field === "enableAfternoonSlot") {
        updated.criticalWeeklyHoursThreshold = val ? 35.0 : 25.0;
      }

      return updated;
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const afternoon = formData.enableAfternoonSlot ? Number(formData.afternoonStudyHours || 2.5) : 0;
    const evening = Number(formData.eveningStudyHours || 2.5);
    const combinedWeekday = Number((afternoon + evening).toFixed(1));

    const toSave = {
      ...formData,
      weekdayStudyHours: combinedWeekday
    };
    onSaveSettings(toSave);
    onClose();
  };

  const currentAfternoon = formData.enableAfternoonSlot ? Number(formData.afternoonStudyHours || 2.5) : 0;
  const currentEvening = Number(formData.eveningStudyHours || 2.5);
  const totalWeekdayCapacity = Number((currentAfternoon + currentEvening).toFixed(1));
  const nominalWeeklyCapacity = Number(((totalWeekdayCapacity * 5) + (Number(formData.weekendStudyHours || 4.5) * 2)).toFixed(1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg p-6 shadow-2xl shadow-cyan-950/40 relative">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
              <IconSettings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Parametri di Ribilanciamento</h3>
              <p className="text-xs text-slate-400">Personalizza orari di studio e date d'esame</p>
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
              <label className="block text-slate-300 font-semibold mb-1">
                Data Odierna (Simulata)
              </label>
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
                <span>Orari & Fasce di Studio Feriali e Weekend</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                Feriale: {totalWeekdayCapacity}h/gg
              </span>
            </div>

            {/* Afternoon Slot (16:30 - 19:00) */}
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableAfternoonSlot}
                    onChange={(e) => handleChange("enableAfternoonSlot", e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                    <IconSun className="w-4 h-4 text-amber-400" />
                    Slot Pomeridiano (16:30 - 19:00)
                  </span>
                </label>
                <span className="text-[10px] uppercase font-bold text-slate-400">Lun - Ven</span>
              </div>

              {formData.enableAfternoonSlot && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">Ore dedicate allo slot pomeridiano:</span>
                  <div className="flex items-center space-x-1.5 w-28">
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="4.0"
                      value={formData.afternoonStudyHours}
                      onChange={(e) => handleChange("afternoonStudyHours", parseFloat(e.target.value) || 2.5)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white font-mono text-right focus:outline-none focus:border-cyan-500"
                    />
                    <span className="text-slate-500 font-mono text-xs">h</span>
                  </div>
                </div>
              )}
            </div>

            {/* Evening & Weekend Slots */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-slate-300 font-semibold text-[11px]">
                  <IconMoon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Slot Serale (19:30 - 22:00)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="5"
                    value={formData.eveningStudyHours}
                    onChange={(e) => handleChange("eveningStudyHours", parseFloat(e.target.value) || 2.5)}
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
                    min="1"
                    max="10"
                    value={formData.weekendStudyHours}
                    onChange={(e) => handleChange("weekendStudyHours", parseFloat(e.target.value) || 4.5)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-slate-500 font-mono">h/gg</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-900/50 p-2 rounded-xl flex items-center justify-between">
              <span>Capacità nominale totale settimanale:</span>
              <strong className="text-cyan-300 font-mono">{nominalWeeklyCapacity}h / settimana</strong>
            </div>
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
                  onChange={(e) => handleChange("criticalWeeklyHoursThreshold", parseFloat(e.target.value) || (formData.enableAfternoonSlot ? 35 : 25))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                />
                <span className="text-slate-500 font-mono">h/sett.</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                {formData.enableAfternoonSlot
                  ? "Consigliata a 35h con slot pomeridiano attivo"
                  : "Consigliata a 25h per solo studio serale"}
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
                    const pct = parseFloat(e.target.value) || 20;
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
