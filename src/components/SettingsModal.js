import React, { useState } from "react";
import { IconSettings, IconClock, IconCalendar, IconBriefcase, IconFlame } from "./Icons.js";

export function SettingsModal({ isOpen, onClose, settings, onSaveSettings }) {
  const [formData, setFormData] = useState({ ...settings });

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

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

          {/* Full-time work and Study Hours */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold">
              <IconBriefcase className="w-4 h-4" />
              <span>Orari Lavoratore Full-Time</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">
                  Ore serali (Lun-Ven)
                </label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="6"
                    value={formData.weekdayStudyHours}
                    onChange={(e) => handleChange("weekdayStudyHours", parseFloat(e.target.value) || 2.5)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-slate-500 font-mono">h/sera</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Ore weekend (Sab-Dom)
                </label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="10"
                    value={formData.weekendStudyHours}
                    onChange={(e) => handleChange("weekendStudyHours", parseFloat(e.target.value) || 4.5)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-slate-500 font-mono">h/giorno</span>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Threshold & Buffer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <IconFlame className="w-3.5 h-3.5 text-rose-400" />
                Soglia Critica Settimanale
              </label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  step="1"
                  min="10"
                  max="40"
                  value={formData.criticalWeeklyHoursThreshold}
                  onChange={(e) => handleChange("criticalWeeklyHoursThreshold", parseFloat(e.target.value) || 25)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                />
                <span className="text-slate-500 font-mono">h/sett.</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Scatta l'alert visivo se superata</p>
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
