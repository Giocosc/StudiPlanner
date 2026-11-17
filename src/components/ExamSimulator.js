import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  IconDice,
  IconCopy,
  IconCheck,
  IconX,
  IconBookOpen,
  IconFlame,
  IconAlertTriangle,
  IconRefresh
} from "./Icons.js";

/**
 * ExamSimulator.js
 * Simulatore d'Esame Dinamico per UNIMORE Ingegneria Informatica.
 * Estrae casualmente:
 * - 6 argomenti con Priorità >= 3 per Analisi Matematica 1 (simulazione prova scritta 5-6 esercizi)
 * - 11 argomenti con Priorità >= 3 per Geometria e Algebra Lineare (simulazione test scritto 11 quesiti)
 * Genera il prompt per Claude/ChatGPT formattato in Markdown pronto per la stampa.
 */
export function ExamSimulator({ isOpen, onClose, topics = [], settings = {} }) {
  const [selectedSubject, setSelectedSubject] = useState("Analisi 1"); // "Analisi 1" | "Geometria"
  const [includeUncompletedFallback, setIncludeUncompletedFallback] = useState(false);
  const [extractedTopics, setExtractedTopics] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const targetCount = selectedSubject === "Analisi 1" ? 6 : 11;
  const isAnalisi = selectedSubject === "Analisi 1";

  // Filtra il pool degli argomenti candidati
  const { eligibleCompleted, eligibleAll } = useMemo(() => {
    const isSubjectMatch = (t) => {
      const mat = (t.materia || "").toLowerCase();
      return isAnalisi ? mat.includes("analisi") : mat.includes("geometria");
    };

    const allSubjectHighPriority = (topics || []).filter(
      t => isSubjectMatch(t) && Number(t.prioritaEsame || 0) >= 3
    );

    const completedHighPriority = allSubjectHighPriority.filter(t => t.isCompleted);

    return {
      eligibleCompleted: completedHighPriority,
      eligibleAll: allSubjectHighPriority
    };
  }, [topics, isAnalisi]);

  // Funzione di estrazione casuale
  const executeRandomExtraction = useCallback(() => {
    setIsSpinning(true);

    let pool = [...eligibleCompleted];

    // Se gli argomenti completati non bastano e il fallback è attivo, attingi anche dai non completati
    if (pool.length < targetCount && (includeUncompletedFallback || eligibleCompleted.length === 0)) {
      const alreadyIncludedIds = new Set(pool.map(t => t.id));
      const uncompletedRemaining = eligibleAll.filter(t => !alreadyIncludedIds.has(t.id));
      const shuffledUncompleted = [...uncompletedRemaining].sort(() => Math.random() - 0.5);
      const needed = targetCount - pool.length;
      pool = [...pool, ...shuffledUncompleted.slice(0, Math.max(0, needed))];
    }

    // Estrazione casuale dal pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, targetCount);

    // Ordina rigorosamente per ID propedeutico (A-01 -> A-32, G-01 -> G-31) come da vincolo accademico
    selected.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

    setExtractedTopics(selected);

    setTimeout(() => {
      setIsSpinning(false);
    }, 250);
  }, [eligibleCompleted, eligibleAll, targetCount, includeUncompletedFallback]);

  // Esegui estrazione al cambio materia o apertura
  useEffect(() => {
    if (isOpen) {
      executeRandomExtraction();
    }
  }, [isOpen, selectedSubject, executeRandomExtraction]);

  // Generazione del prompt formattato per Claude / ChatGPT
  const generatedPrompt = useMemo(() => {
    if (extractedTopics.length === 0) return "";

    const listStr = extractedTopics
      .map((t, idx) => {
        const itemType = isAnalisi ? `Esercizio ${idx + 1}` : `Quesito ${idx + 1}`;
        const focusStr = t.note ? ` (Focus didattico: ${t.note})` : "";
        const capStr = t.capitolo ? `[${t.capitolo}] ` : "";
        return `${idx + 1}. [${t.id}] ${capStr}${t.argomento}${focusStr}`;
      })
      .join("\n");

    return `Genera una simulazione d'esame scritta di livello universitario (UNIMORE) basata ESCLUSIVAMENTE su questi argomenti:\n${listStr}\n\nFormatta il testo in Markdown pronto per la stampa, includendo lo spazio per lo svolgimento.`;
  }, [extractedTopics, isAnalisi]);

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
      <div className="bg-[#0b1120] border border-indigo-500/30 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-indigo-950/40 overflow-hidden my-auto">
        {/* Header Modal */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <IconDice className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Simulatore d'Esame Dinamico
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  UNIMORE Coorte 2021
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Estrae casualmente quesiti d'esame (Priorità ≥ 3) per generare la traccia d'esame per Claude / ChatGPT.
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
          {/* Subject Switcher & Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-900/70 border border-slate-800/80 p-4 rounded-2xl">
            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Seleziona Insegnamento d'Esame:
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedSubject("Analisi 1")}
                  className={`py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 ${
                    selectedSubject === "Analisi 1"
                      ? "bg-gradient-to-r from-emerald-500/30 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>Analisi 1</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 rounded-full font-mono">
                    6 Esercizi
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSubject("Geometria")}
                  className={`py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 ${
                    selectedSubject === "Geometria"
                      ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>Geometria</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-indigo-500/20 rounded-full font-mono">
                    11 Quiz
                  </span>
                </button>
              </div>
            </div>

            {/* Reshuffle Button & Status */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={executeRandomExtraction}
                disabled={isSpinning}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 transition active:scale-95"
              >
                <IconDice className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} />
                <span>Estrai Nuova Simulazione</span>
              </button>
            </div>
          </div>

          {/* Completion Status / Fallback Notice */}
          {eligibleCompleted.length < targetCount && (
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2.5">
                <IconAlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-amber-300">
                    Argomenti completati (Priorità ≥ 3): {eligibleCompleted.length} su {targetCount} richiesti
                  </span>
                  <p className="text-slate-400 mt-0.5">
                    {eligibleCompleted.length === 0
                      ? "Non hai ancora contrassegnato argomenti con Priorità ≥ 3 come completati."
                      : `Per una simulazione ufficiale completa servono ${targetCount} argomenti.`}
                  </p>
                </div>
              </div>

              <label className="flex items-center space-x-2 cursor-pointer bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700/60 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={includeUncompletedFallback}
                  onChange={(e) => {
                    setIncludeUncompletedFallback(e.target.checked);
                    executeRandomExtraction();
                  }}
                  className="rounded border-slate-700 text-indigo-500 focus:ring-indigo-400 bg-slate-800"
                />
                <span className="text-slate-200 font-semibold text-xs">
                  Completa a {targetCount} dall'intero programma
                </span>
              </label>
            </div>
          )}

          {/* Extracted Topics List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <span>Traccia Estratta: {extractedTopics.length} Quesiti Selezionati</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  (Ordinati sequenzialmente per propedeuticità didattica)
                </span>
              </span>
            </div>

            {extractedTopics.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
                <p className="text-xs text-slate-400">
                  Nessun argomento estraibile al momento. Attiva l'opzione per includere argomenti dell'intero programma.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {extractedTopics.map((t, idx) => {
                  return (
                    <div
                      key={t.id}
                      className="bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 p-3 rounded-2xl flex items-start space-x-3 transition group"
                    >
                      <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ${
                            isAnalisi
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          }`}>
                            {t.id}
                          </span>
                          <span className="text-xs font-bold text-white truncate">
                            {t.capitolo ? `${t.capitolo}` : t.argomento}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {t.argomento}
                        </p>

                        <div className="flex items-center space-x-3 mt-2 text-[10px] font-mono">
                          <span className="text-amber-400 flex items-center gap-0.5">
                            ★ Priorità: {t.prioritaEsame}/5
                          </span>
                          <span className="text-slate-400">
                            Diff: {t.difficolta}/5
                          </span>
                          {t.isCompleted ? (
                            <span className="text-emerald-400 font-semibold">✓ Completato</span>
                          ) : (
                            <span className="text-slate-500">In programma</span>
                          )}
                        </div>
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
                <IconBookOpen className="w-4 h-4 text-indigo-400" />
                <span>Prompt Copiabile per Claude / ChatGPT</span>
              </label>

              {generatedPrompt && (
                <span className="text-xs text-slate-400 font-mono">
                  {extractedTopics.length} quesiti configurati
                </span>
              )}
            </div>

            <div className="relative group">
              <textarea
                readOnly
                rows={6}
                value={generatedPrompt}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-indigo-200/90 leading-relaxed focus:outline-none resize-none selection:bg-indigo-500/30 selection:text-white"
              />

              {generatedPrompt && (
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition ${
                    copied
                      ? "bg-emerald-500 text-slate-950 shadow-emerald-500/30 font-black"
                      : "bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/20"
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

          {/* UNIMORE Exam Format Guide */}
          <div className="bg-gradient-to-r from-indigo-950/40 to-purple-950/30 border border-indigo-500/20 rounded-2xl p-4 space-y-2">
            <h5 className="text-xs font-bold text-indigo-300 flex items-center space-x-1.5">
              <span>📋 Specifiche Appello d'Esame UNIMORE (Ingegneria Informatica):</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="font-bold text-emerald-400">Analisi Matematica 1:</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  5-6 Esercizi a svolgimento completo (Limiti, Taylor, Studio di Funzione, Integrali, Serie numeriche, Equazioni differenziali). Tempo: 2 ore.
                </p>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="font-bold text-indigo-400">Geometria e Algebra Lineare:</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  11 Quesiti a risposta multipla o breve (Sistemi lineari, Rouché-Capelli, Autovalori/Autovettori, Diagonalizzazione, Coniche/Quadriche). Tempo: 90 minuti.
                </p>
              </div>
            </div>
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
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25"
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
                <span>Copia Prompt per Claude / ChatGPT</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
