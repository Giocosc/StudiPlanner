import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  IconDice,
  IconCopy,
  IconCheck,
  IconX,
  IconBookOpen,
  IconFlame,
  IconAlertTriangle,
  IconRefresh,
  IconClock,
  IconPlay,
  IconPause,
  IconRotateCcw
} from "./Icons.js";

/**
 * ExamSimulator.js
 * Simulatore d'Esame Cronometrato & Dinamico per UNIMORE Ingegneria Informatica.
 * - Modalità 1: Prova Scritta Cronometrata Live (120m Analisi 1 / 90m Geometria) con autovalutazione e calcolo voto in trentesimi (/30).
 * - Modalità 2: Generatore Traccia & Prompt per Claude/ChatGPT.
 */
export function ExamSimulator({ isOpen, onClose, topics = [], settings = {} }) {
  const [selectedSubject, setSelectedSubject] = useState("Analisi 1"); // "Analisi 1" | "Geometria"
  const [activeMode, setActiveMode] = useState("live"); // "live" | "prompt"
  const [includeUncompletedFallback, setIncludeUncompletedFallback] = useState(true);
  const [extractedTopics, setExtractedTopics] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const isAnalisi = selectedSubject === "Analisi 1";
  const targetCount = isAnalisi ? 6 : 11;
  const defaultExamMinutes = isAnalisi ? 120 : 90;

  // Live Timer State
  const [timeRemaining, setTimeRemaining] = useState(defaultExamMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // Evaluation state: { [exerciseIndex]: score }
  const [scores, setScores] = useState({});
  const [notes, setNotes] = useState({});
  const [isExamCompleted, setIsExamCompleted] = useState(false);

  // Pool filtering
  const { eligibleCompleted, eligibleAll } = useMemo(() => {
    const isSubjectMatch = (t) => {
      const mat = (t.materia || "").toLowerCase();
      return isAnalisi ? mat.includes("analisi") : mat.includes("geometria");
    };

    const allSubjectHighPriority = (topics || []).filter(
      t => isSubjectMatch(t) && Number(t.prioritaEsame || 0) >= 3
    );

    const completedHighPriority = allSubjectHighPriority.filter(
      t => Boolean(t.completato !== undefined ? t.completato : t.isCompleted)
    );

    return {
      eligibleCompleted: completedHighPriority,
      eligibleAll: allSubjectHighPriority
    };
  }, [topics, isAnalisi]);

  // Extraction logic
  const executeRandomExtraction = useCallback(() => {
    setIsSpinning(true);

    let pool = [...eligibleCompleted];

    if (pool.length < targetCount && (includeUncompletedFallback || eligibleCompleted.length === 0)) {
      const alreadyIncludedIds = new Set(pool.map(t => t.id));
      const uncompletedRemaining = eligibleAll.filter(t => !alreadyIncludedIds.has(t.id));
      const shuffledUncompleted = [...uncompletedRemaining].sort(() => Math.random() - 0.5);
      const needed = targetCount - pool.length;
      pool = [...pool, ...shuffledUncompleted.slice(0, Math.max(0, needed))];
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, targetCount);

    // Sort strictly by didactic ID
    selected.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

    setExtractedTopics(selected);
    setScores({});
    setNotes({});
    setIsExamCompleted(false);
    setTimeRemaining(defaultExamMinutes * 60);
    setIsTimerRunning(false);

    setTimeout(() => {
      setIsSpinning(false);
    }, 250);
  }, [eligibleCompleted, eligibleAll, targetCount, includeUncompletedFallback, defaultExamMinutes]);

  // Reset timer when switching subject
  useEffect(() => {
    if (isOpen) {
      executeRandomExtraction();
    }
  }, [isOpen, selectedSubject, executeRandomExtraction]);

  // Timer countdown ticker
  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeRemaining]);

  // Format timer HH:MM:SS
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Score calculation
  const maxPointsPerItem = isAnalisi ? 5 : 3;
  const theoreticalMax = extractedTopics.length * maxPointsPerItem;
  const currentTotalRaw = Object.values(scores).reduce((acc, v) => acc + (Number(v) || 0), 0);
  const normalizedGrade = theoreticalMax > 0
    ? Math.min(30, Math.round((currentTotalRaw / theoreticalMax) * 30))
    : 0;

  // Prompt generation for Claude / ChatGPT
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

    return `Sei un professore universitario di ${selectedSubject} per il corso di Ingegneria Informatica all'Università di Modena e Reggio Emilia (UNIMORE).\n\nGenera una simulazione d'esame scritta completa della durata di ${defaultExamMinutes} minuti, basata sui seguenti ${extractedTopics.length} argomenti estratti dal programma ufficiale:\n\n${listStr}\n\nPer ciascun esercizio:\n1. Fornisci il testo del problema formattato con formule matematiche in LaTeX.\n2. Specifica i punti massimi assegnati (${maxPointsPerItem} punti).\n3. Alla fine del compito, includi le soluzioni dettagliate con tutti i passaggi matematici commentati e i criteri di correzione dei docenti UNIMORE.`;
  }, [extractedTopics, isAnalisi, selectedSubject, defaultExamMinutes, maxPointsPerItem]);

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

  // Close on ESC
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/25 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl shadow-indigo-950/40 overflow-hidden my-auto">
        {/* Header Modal */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <IconDice className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Simulatore d'Esame Cronometrato
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                  UNIMORE {selectedSubject}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulazione ufficiale prova scritta: timer da {defaultExamMinutes}m, autovalutazione e calcolo voto (/30).
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

        {/* Mode Selector & Subject Pills */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setActiveMode("live")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeMode === "live"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <IconClock className="w-3.5 h-3.5" />
              <span>⏱️ Prova Cronometrata Live</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("prompt")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeMode === "prompt"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <IconCopy className="w-3.5 h-3.5" />
              <span>🤖 Traccia & Prompt AI</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedSubject("Analisi 1")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  isAnalisi
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Analisi 1 (120m)
              </button>
              <button
                type="button"
                onClick={() => setSelectedSubject("Geometria")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  !isAnalisi
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Geometria (90m)
              </button>
            </div>

            <button
              type="button"
              onClick={executeRandomExtraction}
              disabled={isSpinning}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
              title="Estrai una nuova traccia d'esame"
            >
              <IconDice className={`w-3.5 h-3.5 ${isSpinning ? "animate-spin" : ""}`} />
              <span>Nuova Traccia</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm custom-scrollbar">
          {/* Live Exam Mode */}
          {activeMode === "live" && (
            <div className="space-y-6">
              {/* Timer Bar */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-2xl border font-mono font-black text-2xl tracking-widest ${
                    timeRemaining <= 600
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                      : timeRemaining <= 1800
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  }`}>
                    {formatTime(timeRemaining)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200">
                      {isTimerRunning ? "⏱️ Prova in corso..." : timeRemaining === 0 ? "Tempo Scaduto!" : "Timer in Pausa"}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Tempo ufficiale UNIMORE: {defaultExamMinutes} minuti per completare {targetCount} quesiti.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      isTimerRunning
                        ? "bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40"
                        : "bg-emerald-600/40 hover:bg-emerald-600/60 text-emerald-200 border border-emerald-500/40 shadow-lg shadow-emerald-950/40"
                    }`}
                  >
                    {isTimerRunning ? <IconPause className="w-4 h-4" /> : <IconPlay className="w-4 h-4" />}
                    <span>{isTimerRunning ? "Metti in Pausa" : "Avvia Timer Esame"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimeRemaining(defaultExamMinutes * 60);
                    }}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
                    title="Reimposta Timer a 120/90 minuti"
                  >
                    <IconRotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress & Live Score Preview */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl border font-mono font-bold text-base ${
                    normalizedGrade >= 18
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}>
                    {normalizedGrade}/30
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">
                      Punteggio Autovalutato: {currentTotalRaw} / {theoreticalMax} punti grezzi
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Soglia sufficienza UNIMORE: 18/30 ({Math.ceil(theoreticalMax * 0.6)} punti grezzi).
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsExamCompleted(!isExamCompleted)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                      isExamCompleted
                        ? "bg-emerald-500 text-black border-emerald-400 shadow-md font-black"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                    }`}
                  >
                    {isExamCompleted ? "Prova Conclusa ✓" : "Termina e Calcola Voto"}
                  </button>
                </div>
              </div>

              {/* Exam Verdict if Completed */}
              {isExamCompleted && (
                <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                  normalizedGrade >= 18
                    ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-200"
                    : "bg-rose-950/50 border-rose-500/40 text-rose-200"
                }`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{normalizedGrade >= 18 ? "🎉" : "⚠️"}</span>
                    <div>
                      <h4 className="font-bold text-sm">
                        {normalizedGrade >= 18
                          ? `Complimenti! Prova Superata con Voto: ${normalizedGrade}/30`
                          : `Prova Non Superata (${normalizedGrade}/30). È richiesta una media minima di 18/30.`}
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {normalizedGrade >= 28
                          ? "Livello di eccellenza. Sei ampiamente pronto per l'appello ufficiale!"
                          : normalizedGrade >= 18
                          ? "Sopra la soglia di ammissione orale. Rafforza i passaggi sui quesiti a punteggio parziale."
                          : "Identifica gli argomenti in cui hai perso punti e programma una sessione mirata di ripasso."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Extracted Exercises List with Interactive Grading */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Elenco Quesiti d'Esame ({extractedTopics.length} Esercizi):
                </h4>

                <div className="space-y-3">
                  {extractedTopics.map((t, idx) => {
                    const itemScore = scores[idx] !== undefined ? scores[idx] : 0;
                    return (
                      <div
                        key={t.id}
                        className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-3 transition hover:border-slate-700"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start space-x-3">
                            <span className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ${
                                  isAnalisi
                                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                    : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                                }`}>
                                  {t.id}
                                </span>
                                <span className="font-bold text-white text-xs sm:text-sm">
                                  {t.argomento}
                                </span>
                              </div>
                              {t.capitolo && (
                                <span className="text-[11px] text-slate-400 block mt-0.5">
                                  Capitolo: {t.capitolo}
                                </span>
                              )}
                              {t.note && (
                                <p className="text-xs text-indigo-300/80 mt-1 italic">
                                  Focus tipico: {t.note}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Score selector */}
                          <div className="flex items-center space-x-2 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 flex-shrink-0">
                            <span className="text-[11px] text-slate-400">Punti:</span>
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: maxPointsPerItem + 1 }, (_, i) => i).map(pt => (
                                <button
                                  key={pt}
                                  type="button"
                                  onClick={() => setScores(prev => ({ ...prev, [idx]: pt }))}
                                  className={`w-6 h-6 rounded-lg text-xs font-mono font-bold transition ${
                                    itemScore === pt
                                      ? "bg-indigo-600 text-white shadow-sm"
                                      : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                                  }`}
                                >
                                  {pt}
                                </button>
                              ))}
                              <span className="text-[10px] text-slate-500">/{maxPointsPerItem}</span>
                            </div>
                          </div>
                        </div>

                        {/* Note / Scratchpad for this exercise */}
                        <div>
                          <input
                            type="text"
                            placeholder="Appunti o errore riscontrato durante lo svolgimento (es. dimenticato segno, errore nel determinante)..."
                            value={notes[idx] || ""}
                            onChange={(e) => setNotes(prev => ({ ...prev, [idx]: e.target.value }))}
                            className="w-full bg-slate-950/70 border border-slate-800/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* AI Prompt Generation Mode */}
          {activeMode === "prompt" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Traccia Formattata per Claude / ChatGPT / Gemini
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Copia questo prompt e incollalo nell'AI per ricevere una traccia d'esame completa con testo degli esercizi e soluzioni passaggio per passaggio.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    copied
                      ? "bg-emerald-500 text-slate-950 font-black"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
                  }`}
                >
                  {copied ? <IconCheck className="w-4 h-4" /> : <IconCopy className="w-4 h-4" />}
                  <span>{copied ? "Copiato! ✓" : "Copia Prompt"}</span>
                </button>
              </div>

              <textarea
                readOnly
                value={generatedPrompt}
                rows={12}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-indigo-200/90 leading-relaxed focus:outline-none custom-scrollbar select-all"
              />
            </div>
          )}
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

          <div className="flex items-center space-x-2">
            {activeMode === "live" ? (
              <button
                type="button"
                onClick={() => setActiveMode("prompt")}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <IconCopy className="w-3.5 h-3.5" />
                <span>Genera Traccia AI</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveMode("live")}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <IconClock className="w-3.5 h-3.5" />
                <span>Torna alla Prova Cronometrata</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
