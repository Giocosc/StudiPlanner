import React, { useState, useMemo, useEffect } from "react";
import {
  IconSparkles,
  IconCopy,
  IconCheck,
  IconX,
  IconBookOpen,
  IconCalendar,
  IconLayers,
  IconAlertTriangle
} from "./Icons.js";

/**
 * NeuraDeckPromptGenerator.js
 * Genera dinamicamente prompt ottimizzati per Google NotebookLM
 * mirati all'estrazione di flashcard CSV ("Fronte,Retro") per NeuraDeck
 * basandosi sugli argomenti completati nell'ultima settimana.
 */
export function NeuraDeckPromptGenerator({ isOpen, onClose, topics = [], settings = {} }) {
  const [selectedSubject, setSelectedSubject] = useState("all"); // "all" | "analisi" | "geometria"
  const [dateRange, setDateRange] = useState("week"); // "week" (ultimi 7gg) | "twoweeks" | "all_completed"
  const [selectedTopicIds, setSelectedTopicIds] = useState(new Set());
  const [copied, setCopied] = useState(false);

  const refDateStr = settings.currentSimulatedDate || new Date().toISOString().split("T")[0];

  // Calcolo finestra temporale (ultimi 7 giorni rispetto alla data simulata/corrente)
  const { sevenDaysAgoStr, fourteenDaysAgoStr } = useMemo(() => {
    const ref = new Date(refDateStr + "T00:00:00");
    const d7 = new Date(ref);
    d7.setDate(d7.getDate() - 7);
    const d14 = new Date(ref);
    d14.setDate(d14.getDate() - 14);
    return {
      sevenDaysAgoStr: d7.toISOString().split("T")[0],
      fourteenDaysAgoStr: d14.toISOString().split("T")[0]
    };
  }, [refDateStr]);

  // Filtra gli argomenti completati in base a materia e finestra temporale
  const filteredCompletedTopics = useMemo(() => {
    return (topics || []).filter(t => {
      if (!t.isCompleted) return false;

      // Filtro Materia
      if (selectedSubject !== "all") {
        const isAnalisi = t.materia.toLowerCase().includes("analisi");
        if (selectedSubject === "analisi" && !isAnalisi) return false;
        if (selectedSubject === "geometria" && isAnalisi) return false;
      }

      // Filtro Data Completamento
      if (dateRange === "week") {
        if (t.completedDate) {
          return t.completedDate >= sevenDaysAgoStr && t.completedDate <= refDateStr;
        }
        // Se non ha data specifica ma è completato, consideralo recente
        return true;
      } else if (dateRange === "twoweeks") {
        if (t.completedDate) {
          return t.completedDate >= fourteenDaysAgoStr && t.completedDate <= refDateStr;
        }
        return true;
      }
      return true; // "all_completed"
    });
  }, [topics, selectedSubject, dateRange, sevenDaysAgoStr, fourteenDaysAgoStr, refDateStr]);

  // Inizializza/Aggiorna la selezione attiva quando cambia la lista filtrata
  useEffect(() => {
    setSelectedTopicIds(new Set(filteredCompletedTopics.map(t => t.id)));
  }, [filteredCompletedTopics]);

  // Toggle selezione singolo argomento
  const handleToggleTopic = (id) => {
    setSelectedTopicIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedTopicIds(new Set(filteredCompletedTopics.map(t => t.id)));
  };

  const handleDeselectAll = () => {
    setSelectedTopicIds(new Set());
  };

  // Costruzione della lista formattata degli argomenti inclusi
  const activeSelectedTopics = useMemo(() => {
    return filteredCompletedTopics.filter(t => selectedTopicIds.has(t.id));
  }, [filteredCompletedTopics, selectedTopicIds]);

  // Generazione del prompt completo
  const generatedPrompt = useMemo(() => {
    if (activeSelectedTopics.length === 0) {
      return "";
    }

    const topicsFormattedList = activeSelectedTopics
      .map(t => {
        const fontiStr = t.fonti ? ` (Fonti didattiche: ${t.fonti})` : "";
        const noteStr = t.note ? ` [Note chiave: ${t.note}]` : "";
        return `• [${t.id}] ${t.materia} - ${t.capitolo ? t.capitolo + ": " : ""}${t.argomento}${fontiStr}${noteStr}`;
      })
      .join("\n");

    return `Agisci da professore universitario di Ingegneria. Basandoti esclusivamente sulle fonti di questo notebook, generami delle flashcard di ripasso sui seguenti argomenti:\n${topicsFormattedList}\n\nRestituisci l'output ESCLUSIVAMENTE in un blocco di codice CSV raw nel formato 'Fronte,Retro', ottimizzato per l'importazione massiva su NeuraDeck.`;
  }, [activeSelectedTopics]);

  // Copia negli appunti
  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(generatedPrompt);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = generatedPrompt;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Copia fallita:", err);
    }
  };

  // Chiusura con tasto ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#0b1120] border border-cyan-500/30 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-cyan-950/40 overflow-hidden my-auto">
        {/* Header Modal */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-cyan-500/20">
              <IconSparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Generatore Flashcard NeuraDeck
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  NotebookLM AI
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Estrae automaticamente gli argomenti completati nell'ultima settimana e formatta il prompt CSV ("Fronte,Retro").
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition"
            title="Chiudi"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm custom-scrollbar">
          {/* Controls Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/70 border border-slate-800/80 p-4 rounded-2xl">
            {/* Materia Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Materia di Studio:
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedSubject("all")}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                    selectedSubject === "all"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Tutte
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubject("analisi")}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                    selectedSubject === "analisi"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Analisi 1
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubject("geometria")}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                    selectedSubject === "geometria"
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Geometria
                </button>
              </div>
            </div>

            {/* Time Window Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Finestra Temporale di Completamento:
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setDateRange("week")}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                    dateRange === "week"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Ultimi 7 giorni fino ad oggi"
                >
                  Ultima Settimana
                </button>
                <button
                  type="button"
                  onClick={() => setDateRange("twoweeks")}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                    dateRange === "twoweeks"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Ultimi 14 gg
                </button>
                <button
                  type="button"
                  onClick={() => setDateRange("all_completed")}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                    dateRange === "all_completed"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Tutti i Completati
                </button>
              </div>
            </div>
          </div>

          {/* Topics Selection Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Argomenti Rilevati ({activeSelectedTopics.length} di {filteredCompletedTopics.length} inclusi)
                </span>
                {dateRange === "week" && (
                  <span className="text-[11px] text-cyan-400 font-mono">
                    (da {sevenDaysAgoStr.slice(5)} a {refDateStr.slice(5)})
                  </span>
                )}
              </div>

              {filteredCompletedTopics.length > 0 && (
                <div className="flex items-center space-x-2 text-xs">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    Seleziona tutti
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-slate-400 hover:text-slate-300 font-semibold"
                  >
                    Deseleziona tutti
                  </button>
                </div>
              )}
            </div>

            {filteredCompletedTopics.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-center space-y-2">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 w-10 h-10 rounded-xl mx-auto flex items-center justify-center">
                  <IconAlertTriangle className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Nessun argomento completato nel periodo</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Non risultano argomenti contrassegnati come completati nell'intervallo temporale selezionato.
                  Spunta gli argomenti svolti dal <strong className="text-slate-300">To-Do Settimanale</strong> o passa al filtro <button onClick={() => setDateRange("all_completed")} className="text-cyan-400 underline font-semibold">Tutti i Completati</button>.
                </p>
              </div>
            ) : (
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredCompletedTopics.map(t => {
                  const isSelected = selectedTopicIds.has(t.id);
                  const isAnalisi = t.materia.toLowerCase().includes("analisi");
                  return (
                    <div
                      key={t.id}
                      onClick={() => handleToggleTopic(t.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                        isSelected
                          ? "bg-slate-900 border-cyan-500/40 text-white"
                          : "bg-slate-950/60 border-slate-800/70 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-1 h-4 w-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-900 bg-slate-800"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ${
                            isAnalisi
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          }`}>
                            {t.id}
                          </span>
                          <span className="text-xs font-bold text-slate-200 truncate">
                            {t.capitolo ? `${t.capitolo}: ` : ""}{t.argomento}
                          </span>
                          {t.completedDate && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              Completato: {t.completedDate}
                            </span>
                          )}
                        </div>
                        {t.fonti && (
                          <p className="text-[11px] text-slate-400 mt-1 truncate">
                            📚 Fonti: {t.fonti}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Generated Prompt Preview */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <IconBookOpen className="w-4 h-4 text-cyan-400" />
                <span>Prompt Pronto per Google NotebookLM</span>
              </label>

              {generatedPrompt && (
                <span className="text-xs text-slate-400 font-mono">
                  {generatedPrompt.length} caratteri • {activeSelectedTopics.length} argomenti
                </span>
              )}
            </div>

            <div className="relative group">
              <textarea
                readOnly
                rows={6}
                value={
                  generatedPrompt ||
                  "Seleziona almeno un argomento completato per generare il prompt strutturato per NotebookLM..."
                }
                className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-cyan-200/90 leading-relaxed focus:outline-none resize-none selection:bg-cyan-500/30 selection:text-white"
              />

              {generatedPrompt && (
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition ${
                    copied
                      ? "bg-emerald-500 text-slate-950 shadow-emerald-500/30 font-black"
                      : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20"
                  }`}
                >
                  {copied ? (
                    <>
                      <IconCheck className="w-4 h-4" />
                      <span>Copiato! ✓</span>
                    </>
                  ) : (
                    <>
                      <IconCopy className="w-4 h-4" />
                      <span>Copia Prompt</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Quick Guide Card for NeuraDeck & NotebookLM */}
          <div className="bg-gradient-to-r from-cyan-950/40 to-indigo-950/30 border border-cyan-500/20 rounded-2xl p-4 space-y-2">
            <h5 className="text-xs font-bold text-cyan-300 flex items-center space-x-1.5">
              <span>💡 Come importare le Flashcard su NeuraDeck in 3 passaggi:</span>
            </h5>
            <ol className="text-xs text-slate-300 list-decimal list-inside space-y-1 leading-normal pl-1">
              <li>
                Incolla il prompt nella chat del tuo <strong>NotebookLM</strong> (contenente i PDF del syllabus UNIMORE).
              </li>
              <li>
                NotebookLM genererà un blocco CSV con le colonne <code>Fronte,Retro</code> basato fedelmente sulle fonti ufficiali.
              </li>
              <li>
                Copia il blocco di codice CSV, aprilo o salvalo come file <code>.csv</code> e importalo massivamente in <strong>NeuraDeck</strong> per la ripetizione spaziata.
              </li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition"
          >
            Chiudi
          </button>

          <button
            type="button"
            disabled={!generatedPrompt}
            onClick={handleCopyPrompt}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
              !generatedPrompt
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : copied
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25"
                : "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25"
            }`}
          >
            {copied ? (
              <>
                <IconCheck className="w-4 h-4" />
                <span>Prompt Copiato negli Appunti!</span>
              </>
            ) : (
              <>
                <IconCopy className="w-4 h-4" />
                <span>Copia Prompt per NotebookLM</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
