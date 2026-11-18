import React, { useState, useMemo } from "react";
import {
  IconX,
  IconClock,
  IconCalendar,
  IconBookOpen,
  IconCheck,
  IconSparkles,
  IconFlame,
  IconCheckCircle,
  IconTrash,
  IconInfo
} from "./Icons.js";

export function TopicDetailModal({
  isOpen,
  onClose,
  topic,
  onToggleComplete,
  onOpenLogModal,
  onUpdateTopic,
  studySessions = []
}) {
  if (!isOpen || !topic) return null;

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "theorems" | "sessions"

  const feynman = topic.feynmanChecklist || { intuitive: false, formal: false, proof: false };
  const feynmanCount = (feynman.intuitive ? 1 : 0) + (feynman.formal ? 1 : 0) + (feynman.proof ? 1 : 0);

  const handleToggleFeynmanStage = (stage, val) => {
    if (onUpdateTopic) {
      onUpdateTopic(topic.id, {
        feynmanChecklist: {
          ...feynman,
          [stage]: val
        }
      });
    }
  };

  const isAnalisi = topic.materia ? topic.materia.toLowerCase().includes("analisi") : true;
  const isDone = Boolean(topic.completato !== undefined ? topic.completato : topic.isCompleted);
  const effHours = Number(topic.oreEffettive || 0);
  const estHours = Number(topic.oreStimate || 2.0);
  const residue = Math.max(0, Number((estHours - effHours).toFixed(2)));
  const hasBuffer = Boolean(topic.hasBuffer || (topic.prioritaEsame >= 4 || topic.difficolta >= 4));

  // Sessions for this topic
  const topicSessions = useMemo(() => {
    return (studySessions || []).filter(s => s.topicId === topic.id);
  }, [studySessions, topic.id]);

  // Subtopics breakdown
  const subtopics = useMemo(() => {
    if (!topic.argomento) return [];
    // Split by commas, semicolons or colons that represent lists
    const rawParts = topic.argomento.split(/[,;:]+/).map(p => p.trim()).filter(Boolean);
    return rawParts.length > 1 ? rawParts : [topic.argomento];
  }, [topic.argomento]);

  // Check if proof/theorem is required
  const hasProofMention = useMemo(() => {
    const text = ((topic.argomento || "") + " " + (topic.note || "") + " " + (topic.fonti || "")).toLowerCase();
    return text.includes("dim") || text.includes("teorema") || text.includes("dimostrazione");
  }, [topic]);

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const getDifficultyLabel = (diff) => {
    const d = Number(diff) || 3;
    if (d <= 2) return "Bassa / Accessibile";
    if (d === 3) return "Media / Standard";
    if (d === 4) return "Alta / Impegnativo";
    return "Massima / Critico";
  };

  const getPriorityLabel = (prio) => {
    const p = Number(prio) || 3;
    if (p <= 2) return "Secondaria (Frequenza bassa)";
    if (p === 3) return "Rilevante (Standard scritto/orale)";
    if (p === 4) return "Frequente (Sbarramento scritto)";
    return "Pilastro d'Esame (Presenza fissa)";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className={`bg-[#0b101d] border rounded-3xl w-full max-w-3xl 2xl:max-w-4xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] ${
        isAnalisi ? "border-emerald-500/30" : "border-indigo-500/30"
      }`}>
        {/* Header */}
        <div className={`p-5 sm:p-6 border-b flex flex-col gap-3 relative overflow-hidden bg-gradient-to-r ${
          isAnalisi
            ? "from-slate-900/95 via-emerald-950/30 to-slate-950/90 border-emerald-500/20"
            : "from-slate-900/95 via-indigo-950/30 to-slate-950/90 border-indigo-500/20"
        }`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Subject Badge */}
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl uppercase tracking-wider ${
                isAnalisi
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
              }`}>
                {topic.materia}
              </span>

              {/* Topic ID */}
              <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded-xl bg-slate-950 text-white border border-slate-800">
                {topic.id}
              </span>

              {/* Chapter */}
              <span className="text-xs text-slate-400 font-medium">
                Capitolo: <strong className="text-slate-200">{topic.capitolo}</strong>
              </span>

              {/* Status Badge */}
              {isDone ? (
                <span className="text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <IconCheck className="w-3.5 h-3.5" />
                  <span>Completato {topic.completedDate ? `il ${formatDateDisplay(topic.completedDate)}` : ""}</span>
                </span>
              ) : effHours > 0 ? (
                <span className="text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                  ⏳ In Corso ({effHours.toFixed(1)}h svolte)
                </span>
              ) : (
                <span className="text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full">
                  ⚪ Da Svolgere
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition flex-shrink-0"
              title="Chiudi scheda"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Big Argument Title */}
          <div>
            <div className="text-[10px] uppercase font-mono font-extrabold tracking-widest text-cyan-400 mb-0.5">
              Scheda Argomento Didattica
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
              {topic.argomento}
            </h2>
            {topic.assignedDate && (
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
                <IconCalendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {isDone ? "Svolto il:" : "Previsto nel calendario per:"}{" "}
                  <strong className="text-cyan-300">{topic.assignedDayName || "Giorno"} {formatDateDisplay(topic.assignedDate)}</strong>
                  {topic.assignedWeek ? ` (Settimana ${topic.assignedWeek})` : ""}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 sm:p-5 bg-slate-950/60 border-b border-slate-800/80 text-xs">
          {/* Hours Card */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center justify-between">
              <span>Monte Ore</span>
              <IconClock className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-base font-extrabold text-white font-mono mt-1">
              <span className="text-cyan-300">{effHours.toFixed(1)}h</span>
              <span className="text-slate-500 font-normal"> / {estHours.toFixed(1)}h</span>
            </div>
            <div className="text-[10px] text-amber-400/90 font-mono mt-0.5">
              Residuo: {residue.toFixed(1)}h {hasBuffer ? "(+20% buffer)" : ""}
            </div>
          </div>

          {/* Difficulty Card */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center justify-between">
              <span>Difficoltà</span>
              <span className="text-cyan-400 font-bold font-mono">{topic.difficolta || 3}/5</span>
            </div>
            <div className="text-base font-extrabold text-white mt-1">
              {topic.difficolta >= 4 ? "🔥 " : "⚡ "}
              {getDifficultyLabel(topic.difficolta).split("/")[0]}
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              {getDifficultyLabel(topic.difficolta)}
            </div>
          </div>

          {/* Priority Card */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center justify-between">
              <span>Priorità Esame</span>
              <span className="text-amber-400 font-bold font-mono">{topic.prioritaEsame || 3}/5</span>
            </div>
            <div className="text-base font-extrabold text-white mt-1">
              {topic.prioritaEsame >= 4 ? "★ Alta" : "☆ Media"}
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              {getPriorityLabel(topic.prioritaEsame)}
            </div>
          </div>

          {/* Completion Progress Card */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center justify-between">
              <span>Avanzamento</span>
              <span className="text-emerald-400 font-bold font-mono">
                {Math.min(100, Math.round((effHours / estHours) * 100))}%
              </span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 mt-2">
              <div
                className={`h-full transition-all duration-500 ${
                  isDone ? "bg-emerald-400" : effHours > 0 ? "bg-cyan-400" : "bg-transparent"
                }`}
                style={{ width: `${Math.min(100, Math.round((effHours / estHours) * 100))}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              {isDone ? "Completato al 100%" : `${residue.toFixed(1)}h rimanenti`}
            </div>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex items-center space-x-2 px-5 pt-3 border-b border-slate-800/80 bg-slate-950/30 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`pb-2.5 px-3 font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "overview"
                ? isAnalisi ? "border-emerald-400 text-emerald-300" : "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <IconBookOpen className="w-4 h-4" />
            <span>Programma & Contenuti</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("theorems")}
            className={`pb-2.5 px-3 font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "theorems"
                ? isAnalisi ? "border-emerald-400 text-emerald-300" : "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <IconSparkles className="w-4 h-4" />
            <span>Teoremi & Prove d'Esame</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sessions")}
            className={`pb-2.5 px-3 font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "sessions"
                ? isAnalisi ? "border-emerald-400 text-emerald-300" : "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <IconClock className="w-4 h-4" />
            <span>Diario Sessioni</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {topicSessions.length}
            </span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Detailed Breakdown of Concepts */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span>
                  <span>Concetti Didattici Inclusi nell'Argomento</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {subtopics.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-900/60 border border-slate-800/60 rounded-xl flex items-start space-x-2 text-slate-200"
                    >
                      <span className="text-cyan-400 font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverable / Learning Goal */}
              {topic.note && (
                <div className="bg-gradient-to-r from-cyan-950/30 to-indigo-950/30 border border-cyan-500/30 rounded-2xl p-4 space-y-1.5 text-xs">
                  <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                    <IconSparkles className="w-4 h-4 text-cyan-400" />
                    <span>Deliverable Operativo (Obiettivo di Fine Studio):</span>
                  </div>
                  <p className="text-slate-200 font-medium leading-relaxed">
                    {topic.note}
                  </p>
                </div>
              )}

              {/* Official Sources and Textbooks */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-2 text-xs">
                <h4 className="font-bold text-slate-300 flex items-center gap-2">
                  <IconBookOpen className="w-4 h-4 text-indigo-400" />
                  <span>Fonti Bibliografiche e Riferimenti Ufficiali UNIMORE</span>
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  {topic.fonti || (isAnalisi
                    ? "Testo ufficiale Marcellini-Sbordone (Analisi Matematica 1), Registro delle Lezioni e dispense d'aula."
                    : "Testo Casali-Gagliardi-Grasselli (Geometria), dispense Algoritmo B e registro ufficiale.")}
                </p>
              </div>
            </div>
          )}

          {activeTab === "theorems" && (
            <div className="space-y-4">
              {/* Theorem and Proof Box */}
              <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <IconSparkles className="w-4 h-4 text-amber-400" />
                    <span>Teoremi e Rigore Dimostrativo per l'Orale</span>
                  </h4>
                  {hasProofMention && (
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                      Dimostrazione Richiesta
                    </span>
                  )}
                </div>

                <div className="p-3 bg-black/40 border border-slate-800 rounded-xl space-y-2 text-slate-300">
                  <p className="leading-relaxed">
                    {topic.note ? (
                      <>
                        <strong className="text-amber-300 font-semibold">Focus Dimostrazioni & Formule:</strong>{" "}
                        {topic.note}
                      </>
                    ) : (
                      "Padroneggiare tutte le definizioni formali ($\forall \varepsilon > 0$), gli enunciati esatti e le ipotesi necessarie."
                    )}
                  </p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {isAnalisi
                      ? "Regola aurea della commissione: nello scritto ogni passaggio deve essere rigorosamente giustificato (sviluppi di Taylor all'ordine corretto, limiti notevoli, criteri di convergenza). All'orale vengono chiesti enunciati e dimostrazioni integrali."
                      : "Regola d'esame Geometria: il test scritto contiene 11 domande con penalità (-1 risposta errata). All'orale è determinante la perfetta esposizione delle dimostrazioni numerate del testo Casali-Gagliardi-Grasselli."}
                  </p>
                </div>
              </div>

              {/* Checklist Feynman a 3 Livelli (Dimostrazioni & Orale) */}
              <div className="p-4 bg-slate-950/80 border border-indigo-500/30 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-300">🎓</span>
                    <h4 className="font-bold text-white text-xs sm:text-sm">
                      Checklist Orale & Dimostrazioni (Metodo Feynman)
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    feynmanCount === 3
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : feynmanCount === 2
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : feynmanCount === 1
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}>
                    {feynmanCount === 3
                      ? "Pronto per l'Orale (3/3) ✓"
                      : `${feynmanCount}/3 Padronanza`}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400">
                  Per superare l'esame orale con il massimo dei voti, assicurati di completare i tre stadi di padronanza concettuale:
                </p>

                <div className="space-y-2 pt-1">
                  {/* Livello 1 */}
                  <label className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(feynman.intuitive)}
                      onChange={(e) => handleToggleFeynmanStage("intuitive", e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 bg-slate-950"
                    />
                    <div>
                      <span className="font-bold text-slate-200">
                        1. Comprensione Intuitiva & Geometrica
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        So spiegare il concetto con parole semplici, disegnando un grafico qualitativo e fornendo un esempio pratico.
                      </p>
                    </div>
                  </label>

                  {/* Livello 2 */}
                  <label className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(feynman.formal)}
                      onChange={(e) => handleToggleFeynmanStage("formal", e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 bg-slate-950"
                    />
                    <div>
                      <span className="font-bold text-slate-200">
                        2. Enunciato Formale & Ipotesi Necessarie
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Conosco l'enunciato rigoroso (ipotesi, tesi, quantificatori) e so spiegare perché ciascuna ipotesi è indispensabile (controesempi).
                      </p>
                    </div>
                  </label>

                  {/* Livello 3 */}
                  <label className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(feynman.proof)}
                      onChange={(e) => handleToggleFeynmanStage("proof", e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 bg-slate-950"
                    />
                    <div>
                      <span className="font-bold text-slate-200">
                        3. Dimostrazione su Foglio Bianco (Feynman Test)
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Riesco a scrivere l'intera dimostrazione passaggio per passaggio su un foglio bianco senza consultare dispense o appunti.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Strategic Exam Tips Card */}
              <div className="p-4 bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-500/30 rounded-2xl text-xs space-y-2">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <IconFlame className="w-4 h-4 text-amber-400" />
                  <span>Consigli per Massimizzare il Punteggio:</span>
                </span>
                <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px] leading-relaxed">
                  <li>
                    {isAnalisi
                      ? "Non limitarsi al risultato numerico: la docente valuta la coerenza logica, la notazione corretta degli o-piccolo e la verifica delle ipotesi dei teoremi."
                      : "Negli esercizi con parametro (k), discutere sempre separatamente i valori critici del determinante e del rango per evitare penalità."}
                  </li>
                  <li>
                    Per l'orale, prova a riesporre il teorema e a scrivere la dimostrazione su un foglio bianco senza consultare gli appunti.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "sessions" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Ore registrate specificamente per <strong>{topic.id}</strong>:</span>
                <span className="font-mono">{topicSessions.length} registrazioni</span>
              </div>

              {topicSessions.length === 0 ? (
                <div className="text-center py-8 bg-slate-950/40 border border-slate-800 rounded-2xl space-y-3 text-xs text-slate-400">
                  <p>Non hai ancora registrato sessioni di studio per questo argomento.</p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenLogModal && onOpenLogModal({ topicId: topic.id, hours: residue > 0 ? residue : estHours });
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold rounded-xl text-xs shadow-md transition"
                  >
                    + Registra Ore Ora
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {topicSessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white font-mono">
                            {formatDateDisplay(sess.date)}
                          </span>
                          <span className="font-bold text-cyan-300 font-mono">
                            +{sess.hours}h
                          </span>
                          {sess.completed && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 rounded font-bold">
                              ✓ Completato
                            </span>
                          )}
                        </div>
                        {sess.note && (
                          <p className="text-slate-400 text-[11px] italic mt-0.5">
                            "{sess.note}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          {/* Quick toggle complete */}
          <button
            type="button"
            onClick={() => onToggleComplete && onToggleComplete(topic.id)}
            className={`px-4 py-2.5 rounded-xl border font-bold transition flex items-center justify-center gap-2 ${
              isDone
                ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/30"
                : "bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-700 hover:border-slate-500"
            }`}
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
              isDone ? "bg-emerald-500 border-emerald-400 text-white" : "border-slate-500 bg-slate-950"
            }`}>
              {isDone && <IconCheck className="w-3 h-3" />}
            </div>
            <span>{isDone ? "Completato ✓ (Clicca per riaprire)" : "Segna come Completato"}</span>
          </button>

          <div className="flex items-center space-x-2.5">
            {/* Quick Log Studio Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLogModal && onOpenLogModal({
                  topicId: topic.id,
                  hours: residue > 0 ? residue : estHours
                });
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-md transition active:scale-95"
            >
              <span className="font-black text-sm leading-none">+</span>
              <span>Registra Ore su Questo Argomento</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl font-semibold border border-slate-800 transition"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
