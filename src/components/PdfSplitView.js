import React, { useState, useEffect } from "react";
import { IconBookOpen } from "./Icons.js";

const DEFAULT_PRESETS = [
  {
    id: "analisi-dispense",
    title: "Dispense Teoria: Analisi Matematica 1",
    subtitle: "Calcolo Differenziale, Sviluppi di Taylor e Integrali",
    url: "https://www.matematica.unimore.it/analisi1.pdf"
  },
  {
    id: "analisi-esercizi",
    title: "Eserciziario Ufficiale: Analisi 1",
    subtitle: "Raccolta temi d'esame risolti UNIMORE",
    url: "https://www.matematica.unimore.it/esercizi_analisi.pdf"
  },
  {
    id: "geo-dispense",
    title: "Dispense Teoria: Geometria e Algebra Lineare",
    subtitle: "Sistemi Lineari, Matrici, Autovalori e Coniche",
    url: "https://www.matematica.unimore.it/geometria.pdf"
  },
  {
    id: "geo-esercizi",
    title: "Eserciziario Ufficiale: Geometria",
    subtitle: "Esercizi di diagonalizzazione e geometria analitica nello spazio",
    url: "https://www.matematica.unimore.it/esercizi_geometria.pdf"
  }
];

export function PdfSplitView({ isOpen, onClose }) {
  const [pdfSource, setPdfSource] = useState("preset"); // "preset" | "local" | "url"
  const [selectedPreset, setSelectedPreset] = useState(DEFAULT_PRESETS[0]);
  const [customUrl, setCustomUrl] = useState("");
  const [localPdfUrl, setLocalPdfUrl] = useState(null);
  const [localFileName, setLocalFileName] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file && file.type === "application/pdf") {
      if (localPdfUrl) {
        URL.revokeObjectURL(localPdfUrl);
      }
      const objUrl = URL.createObjectURL(file);
      setLocalPdfUrl(objUrl);
      setLocalFileName(file.name);
      setPdfSource("local");
    }
  };

  const currentPdfUrl = () => {
    if (pdfSource === "local" && localPdfUrl) return localPdfUrl;
    if (pdfSource === "url" && customUrl.trim()) return customUrl.trim();
    return selectedPreset?.url || "";
  };

  if (!isOpen) return null;

  return (
    <div className="bg-[#0b101e] border border-slate-800 rounded-3xl p-4 md:p-5 flex flex-col h-[750px] shadow-2xl relative">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <IconBookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Viewer Dispense & Eserciziari (Split View)
            </h3>
            <p className="text-[11px] text-slate-400">
              {pdfSource === "local" ? `File locale: ${localFileName}` : (selectedPreset?.title || "Documento PDF")}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Upload local PDF */}
          <label className="cursor-pointer px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5">
            <span>📂 Carica PDF Locale</span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {/* Close Split View */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Chiudi Split View"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Preset & Source Selector */}
      <div className="py-2.5 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[11px] text-slate-500 font-medium">Dispense rapide:</span>
        {DEFAULT_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              setSelectedPreset(preset);
              setPdfSource("preset");
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
              pdfSource === "preset" && selectedPreset?.id === preset.id
                ? "bg-purple-600/30 text-purple-200 border border-purple-500/40"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            {preset.id.startsWith("analisi") ? "📐 " : "🔷 "}
            {preset.title.split(":")[1]?.trim() || preset.title}
          </button>
        ))}
      </div>

      {/* PDF Container / Fallback */}
      <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden relative mt-1">
        {currentPdfUrl() ? (
          <iframe
            src={currentPdfUrl()}
            className="w-full h-full border-none"
            title="PDF Document Viewer"
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 text-xs">
            <IconBookOpen className="w-12 h-12 text-slate-700 mb-3" />
            <p className="font-semibold text-slate-400 text-sm">Nessuna dispensa caricata</p>
            <p className="mt-1 max-w-sm">
              Clicca su <strong>Carica PDF Locale</strong> per selezionare dal tuo computer la dispensa di Analisi 1 o Geometria del docente UNIMORE.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-2 text-[10px] text-slate-500 flex items-center justify-between">
        <span>Monitor Widescreen / Split-screen Attivo</span>
        <span>Per il pieno rendering offline di file remoti, usa "Carica PDF Locale"</span>
      </div>
    </div>
  );
}
