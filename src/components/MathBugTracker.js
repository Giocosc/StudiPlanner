import React, { useState, useMemo } from "react";
import {
  IconBug,
  IconX,
  IconCheck,
  IconFlame,
  IconAlertTriangle,
  IconBookOpen,
  IconClock
} from "./Icons.js";

export const DEFAULT_MATH_BUGS = [
  {
    id: "bug-1",
    topicId: "A-07",
    materia: "Analisi 1",
    title: "De L'Hôpital applicato senza forma indeterminata",
    description: "Applicare la regola delle derivate senza verificare prima che il limite si presenti come 0/0 o inf/inf.",
    fixRule: "Calcolare sempre la sostituzione diretta prima di derivare. Se non è indeterminata, De L'Hôpital altera il risultato!",
    severity: "critico", // "critico" | "comune" | "minore"
    isResolved: false,
    createdAt: "2026-11-17"
  },
  {
    id: "bug-2",
    topicId: "A-09",
    materia: "Analisi 1",
    title: "Ordine dell'o-piccolo errato negli sviluppi di Taylor",
    description: "Troncare lo sviluppo di Taylor a un ordine insufficiente causando la cancellazione completa dei termini principali.",
    fixRule: "Determinare l'ordine del denominatore: se il denominatore è x^4, sviluppare tutti i termini al numeratore almeno fino all'ordine 4!",
    severity: "critico",
    isResolved: false,
    createdAt: "2026-11-17"
  },
  {
    id: "bug-3",
    topicId: "A-17",
    materia: "Analisi 1",
    title: "Omissione del valore assoluto in primitiva di 1/x",
    description: "Scrivere primitiva 1/x = ln(x) invece di ln|x|, causando errori negli integrali definiti con estremi negativi.",
    fixRule: "La primitiva fondamentale è sempre ln|x| + c. Con estremi negativi, |x| = -x.",
    severity: "comune",
    isResolved: true,
    createdAt: "2026-11-16"
  },
  {
    id: "bug-4",
    topicId: "G-02",
    materia: "Geometria",
    title: "Segno errato nel complemento algebrico di Laplace",
    description: "Dimenticare il fattore (-1)^(i+j) calcolando i complementi algebrici per l'inversa o il determinante.",
    fixRule: "Disegnare la scacchiera dei segni (+ - + / - + - / + - +) prima di eseguire i calcoli.",
    severity: "critico",
    isResolved: false,
    createdAt: "2026-11-17"
  },
  {
    id: "bug-5",
    topicId: "G-14",
    materia: "Geometria",
    title: "Mancata discussione del parametro k in Rouché-Capelli",
    description: "Annullare il determinante senza studiare separatamente i valori di k per cui rango(A) != rango(A|b).",
    fixRule: "Trovare i k critici in det(A)=0, poi riscrivere la matrice e calcolare il rango esplicitamente per ogni k critico.",
    severity: "critico",
    isResolved: false,
    createdAt: "2026-11-18"
  },
  {
    id: "bug-6",
    topicId: "G-17",
    materia: "Geometria",
    title: "Confusione tra molteplicità algebrica e geometrica",
    description: "Dare per scontata la diagonalizzabilità senza verificare che mg(lambda) = n - rango(A - lambda*I) sia uguale a ma(lambda).",
    fixRule: "Una matrice è diagonalizzabile se e solo se tutti gli autovalori sono reali e per ciascuno mg(lambda) == ma(lambda).",
    severity: "comune",
    isResolved: false,
    createdAt: "2026-11-18"
  }
];

export function MathBugTracker({
  isOpen,
  onClose,
  bugs = [],
  onSaveBugs,
  topics = [],
  onOpenTopicDetail
}) {
  const [filterSubject, setFilterSubject] = useState("all"); // "all" | "Analisi 1" | "Geometria"
  const [filterStatus, setFilterStatus] = useState("all"); // "all" | "open" | "resolved"
  const [isAdding, setIsAdding] = useState(false);

  // New bug form
  const [newTopicId, setNewTopicId] = useState("A-09");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFix, setNewFix] = useState("");
  const [newSeverity, setNewSeverity] = useState("critico");

  const filteredBugs = useMemo(() => {
    return (bugs || []).filter(b => {
      if (filterSubject !== "all" && !b.materia.toLowerCase().includes(filterSubject.toLowerCase())) return false;
      if (filterStatus === "open" && b.isResolved) return false;
      if (filterStatus === "resolved" && !b.isResolved) return false;
      return true;
    });
  }, [bugs, filterSubject, filterStatus]);

  const stats = useMemo(() => {
    const total = (bugs || []).length;
    const resolved = (bugs || []).filter(b => b.isResolved).length;
    const critical = (bugs || []).filter(b => !b.isResolved && b.severity === "critico").length;
    return { total, resolved, open: total - resolved, critical };
  }, [bugs]);

  const handleToggleResolve = (bugId) => {
    const updated = (bugs || []).map(b => b.id === bugId ? { ...b, isResolved: !b.isResolved } : b);
    if (onSaveBugs) onSaveBugs(updated);
  };

  const handleDeleteBug = (bugId) => {
    const updated = (bugs || []).filter(b => b.id !== bugId);
    if (onSaveBugs) onSaveBugs(updated);
  };

  const handleAddBug = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const topicRef = topics.find(t => t.id === newTopicId);
    const materia = topicRef?.materia || (newTopicId.startsWith("A") ? "Analisi 1" : "Geometria");

    const newBug = {
      id: `bug-${Date.now()}`,
      topicId: newTopicId,
      materia,
      title: newTitle.trim(),
      description: newDesc.trim(),
      fixRule: newFix.trim(),
      severity: newSeverity,
      isResolved: false,
      createdAt: new Date().toISOString().split("T")[0]
    };

    const updated = [newBug, ...(bugs || [])];
    if (onSaveBugs) onSaveBugs(updated);

    setNewTitle("");
    setNewDesc("");
    setNewFix("");
    setIsAdding(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#0b1120] border border-rose-500/30 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-rose-950/40 overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-rose-300">
              <IconBug className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Registro Errori Ricorrenti (Bug Tracker Matematico)
                </h3>
                <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full">
                  Anti-Trabocchetto
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Traccia gli errori tipici commessi durante gli esercizi per non ripeterli all'appello d'esame.
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

        {/* Filters and Stats Strip */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Subject Filters */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setFilterSubject("all")}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  filterSubject === "all" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Tutti ({stats.total})
              </button>
              <button
                type="button"
                onClick={() => setFilterSubject("Analisi 1")}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  filterSubject === "Analisi 1" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
                }`}
              >
                Analisi 1
              </button>
              <button
                type="button"
                onClick={() => setFilterSubject("Geometria")}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  filterSubject === "Geometria" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "text-slate-400 hover:text-white"
                }`}
              >
                Geometria
              </button>
            </div>

            {/* Status Filters */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setFilterStatus("all")}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  filterStatus === "all" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Tutti
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("open")}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  filterStatus === "open" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "text-slate-400 hover:text-white"
                }`}
              >
                Da Risolvere ({stats.open})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("resolved")}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  filterStatus === "resolved" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
                }`}
              >
                Padroneggiati ({stats.resolved})
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-rose-950/40"
          >
            <span>{isAdding ? "✕ Annulla" : "+ Segnala Nuovo Errore"}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs custom-scrollbar">
          {/* Add Form Accordion */}
          {isAdding && (
            <form onSubmit={handleAddBug} className="bg-slate-950 p-4 rounded-2xl border border-rose-500/40 space-y-3 animate-fade-in">
              <h4 className="font-bold text-white text-xs flex items-center gap-2">
                <span className="p-1 rounded-lg bg-rose-500/20 text-rose-300">📝</span>
                <span>Registra un Errore / Trabocchetto Riscontrato</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Argomento di Riferimento:</label>
                  <select
                    value={newTopicId}
                    onChange={(e) => setNewTopicId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                  >
                    {topics.map(t => (
                      <option key={t.id} value={t.id}>
                        [{t.id}] {t.argomento.slice(0, 35)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1 font-medium">Titolo dell'Errore / Errore Commesso:</label>
                  <input
                    type="text"
                    required
                    placeholder="Es. Sbagliato il segno nel complemento algebrico..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Descrizione del Trabocchetto:</label>
                  <textarea
                    rows={2}
                    placeholder="Cosa hai sbagliato esattamente durante il calcolo..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Regola d'Oro / Come Evitarlo:</label>
                  <textarea
                    rows={2}
                    placeholder="La procedura corretta da seguire per non cadere nell'errore..."
                    value={newFix}
                    onChange={(e) => setNewFix(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">Livello Gravità:</span>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs"
                  >
                    <option value="critico">Critico (Fa perdere l'esercizio)</option>
                    <option value="comune">Comune (Penalità parziale)</option>
                    <option value="minore">Minore (Distrazione di calcolo)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition shadow-md shadow-rose-950/40"
                >
                  Salva nel Bug Tracker
                </button>
              </div>
            </form>
          )}

          {/* Bugs List */}
          {filteredBugs.length === 0 ? (
            <div className="text-center py-12 bg-slate-950/40 border border-slate-800 rounded-2xl space-y-2 text-slate-400">
              <p>Nessun errore trovato con i filtri attivi.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBugs.map(bug => {
                const isCrit = bug.severity === "critico";
                return (
                  <div
                    key={bug.id}
                    className={`p-4 rounded-2xl border transition ${
                      bug.isResolved
                        ? "bg-slate-900/60 border-slate-800/80 opacity-75"
                        : isCrit
                        ? "bg-gradient-to-r from-rose-950/30 to-slate-900/80 border-rose-500/40 shadow-sm"
                        : "bg-slate-900/80 border-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <span className={`p-1.5 rounded-xl border mt-0.5 ${
                          bug.isResolved
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : isCrit
                            ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        }`}>
                          <IconBug className="w-4 h-4" />
                        </span>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-slate-700">
                              {bug.topicId}
                            </span>
                            <span className="font-bold text-white text-xs sm:text-sm">
                              {bug.title}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              bug.severity === "critico"
                                ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            }`}>
                              {bug.severity.toUpperCase()}
                            </span>
                            {bug.isResolved && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Padroneggiato ✓
                              </span>
                            )}
                          </div>

                          {bug.description && (
                            <p className="text-slate-300 text-xs leading-relaxed">
                              {bug.description}
                            </p>
                          )}

                          {bug.fixRule && (
                            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-emerald-300 flex items-start gap-2 mt-2">
                              <span className="font-bold text-emerald-400">💡 Regola d'Oro:</span>
                              <span>{bug.fixRule}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            if (onOpenTopicDetail) onOpenTopicDetail(bug.topicId);
                          }}
                          className="p-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-[10px] font-bold transition flex items-center gap-1"
                          title="Apri scheda dell'argomento"
                        >
                          <IconBookOpen className="w-3.5 h-3.5" />
                          <span>Scheda</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleResolve(bug.id)}
                          className={`p-1.5 px-2.5 rounded-xl text-[10px] font-bold border transition ${
                            bug.isResolved
                              ? "bg-slate-800 text-slate-400 border-slate-700"
                              : "bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border-emerald-500/40 shadow-sm"
                          }`}
                        >
                          {bug.isResolved ? "Riapri" : "Segna Risolto ✓"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteBug(bug.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                          title="Elimina dal registro"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{stats.open} trabocchetti ancora aperti da padroneggiare.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
