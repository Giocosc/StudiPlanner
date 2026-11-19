import React, { useState, useEffect, useMemo } from "react";
import { getLocalTodayDateStr } from "../services/rebalancerEngine.js";
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
  IconSearch
} from "./Icons.js";

// Wrapper: monta il contenuto solo quando il modale è aperto, così gli hook
// del contenuto vengono sempre chiamati nello stesso ordine (Rules of Hooks).
export function LogStudyModal(props) {
  if (!props.isOpen) return null;
  return <LogStudyModalContent {...props} />;
}

function LogStudyModalContent({
  isOpen,
  onClose,
  topics = [],
  settings = {},
  initialData = {},
  onSaveSession,
  studySessions = [],
  onDeleteSession
}) {

  const [activeTab, setActiveTab] = useState("new"); // "new" | "recent"
  const [selectedDate, setSelectedDate] = useState(() => {
    return initialData.date || settings.currentSimulatedDate || getLocalTodayDateStr(settings.roadmapStartDate, settings.targetExamDate);
  });
  const [selectedSubject, setSelectedSubject] = useState("all"); // "all" | "analisi" | "geometria"
  const [statusFilter, setStatusFilter] = useState("all"); // "uncompleted" | "all"
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTopicId, setSelectedTopicId] = useState(() => {
    if (initialData.topicId) return initialData.topicId;
    // Default to the first uncompleted topic
    const firstUncompleted = topics.find(t => !(t.completato !== undefined ? t.completato : t.isCompleted));
    return firstUncompleted ? firstUncompleted.id : (topics[0]?.id || "A-01");
  });

  const [hours, setHours] = useState(() => {
    if (initialData.hours !== undefined && initialData.hours !== null) {
      return Number(initialData.hours);
    }
    return 2.0;
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [hasManuallyToggledComplete, setHasManuallyToggledComplete] = useState(false);
  const [note, setNote] = useState("");
  const [notification, setNotification] = useState(null);

  // Sync initialData when modal opens or initialData changes
  useEffect(() => {
    if (initialData.date) {
      setSelectedDate(initialData.date);
    } else if (settings.currentSimulatedDate) {
      setSelectedDate(settings.currentSimulatedDate);
    }

    if (initialData.topicId) {
      setSelectedTopicId(initialData.topicId);
      const t = topics.find(item => item.id === initialData.topicId);
      if (t) {
        if (t.materia.toLowerCase().includes("analisi")) {
          setSelectedSubject("analisi");
        } else if (t.materia.toLowerCase().includes("geometria")) {
          setSelectedSubject("geometria");
        }
        const est = Number(t.oreStimate || 2.0);
        const eff = Number(t.oreEffettive || 0);
        const residue = Math.max(0, Number((est - eff).toFixed(2)));
        if (initialData.hours !== undefined) {
          setHours(Number(initialData.hours));
        } else if (residue > 0) {
          setHours(residue);
        } else {
          setHours(est);
        }
      }
    }

    setHasManuallyToggledComplete(false);
    setNotification(null);
  }, [initialData, settings.currentSimulatedDate, topics]);

  // Current selected topic reference
  const currentTopic = useMemo(() => {
    return topics.find(t => t.id === selectedTopicId) || topics[0] || null;
  }, [topics, selectedTopicId]);

  // Filtered topics list for selection
  const filteredTopics = useMemo(() => {
    return topics.filter(t => {
      const isDone = Boolean(t.completato !== undefined ? t.completato : t.isCompleted);
      if (statusFilter === "uncompleted" && isDone) return false;

      // Subject filter
      if (selectedSubject === "analisi" && !t.materia.toLowerCase().includes("analisi")) return false;
      if (selectedSubject === "geometria" && !t.materia.toLowerCase().includes("geometria")) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const mId = t.id.toLowerCase().includes(q);
        const mArg = t.argomento.toLowerCase().includes(q);
        const mCap = (t.capitolo || "").toLowerCase().includes(q);
        if (!mId && !mArg && !mCap) return false;
      }

      return true;
    });
  }, [topics, statusFilter, selectedSubject, searchQuery]);

  // CRITICAL FIX: Prevent topic desync when user filters by subject or searches!
  // If the currently selected topic is no longer present in filteredTopics, auto-select the first matching topic.
  useEffect(() => {
    if (filteredTopics.length > 0) {
      const isStillInList = filteredTopics.some(t => t.id === selectedTopicId);
      if (!isStillInList) {
        const target = filteredTopics[0];
        setSelectedTopicId(target.id);
        const est = Number(target.oreStimate || 2.0);
        const eff = Number(target.oreEffettive || 0);
        const residue = Math.max(0, Number((est - eff).toFixed(2)));
        setHours(residue > 0 ? residue : est);
        setHasManuallyToggledComplete(false);
      }
    }
  }, [filteredTopics, selectedTopicId]);

  // Select topic handler
  const handleSelectTopic = (topic) => {
    if (!topic) return;
    setSelectedTopicId(topic.id);
    const est = Number(topic.oreStimate || 2.0);
    const eff = Number(topic.oreEffettive || 0);
    const residue = Math.max(0, Number((est - eff).toFixed(2)));
    setHours(residue > 0 ? residue : est);
    setHasManuallyToggledComplete(false);
  };

  // Change subject filter and auto-pick corresponding topic if needed
  const handleFilterSubject = (subj) => {
    setSelectedSubject(subj);
    // If current topic does not belong to new subject, pick first topic of that subject
    if (subj === "analisi" && (!currentTopic || !currentTopic.materia.toLowerCase().includes("analisi"))) {
      const firstAnalisi = topics.find(t => t.materia.toLowerCase().includes("analisi") && !t.completato);
      if (firstAnalisi) handleSelectTopic(firstAnalisi);
    } else if (subj === "geometria" && (!currentTopic || !currentTopic.materia.toLowerCase().includes("geometria"))) {
      const firstGeom = topics.find(t => t.materia.toLowerCase().includes("geometria") && !t.completato);
      if (firstGeom) handleSelectTopic(firstGeom);
    }
  };

  // Auto-suggest completion when hours are entered unless user manually toggled
  useEffect(() => {
    if (!currentTopic || hasManuallyToggledComplete) return;

    const est = Number(currentTopic.oreStimate || 2.0);
    const eff = Number(currentTopic.oreEffettive || 0);
    const totalAfter = eff + Number(hours || 0);

    // If accumulated hours reach or exceed estimate, suggest completion
    if (totalAfter >= est * 0.95) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  }, [currentTopic, hours, hasManuallyToggledComplete]);

  // Next topic in sequential order (for previewing auto-adapt)
  const nextSequentialTopic = useMemo(() => {
    if (!currentTopic) return null;
    const isAnalisi = currentTopic.materia.toLowerCase().includes("analisi");
    const sameSubject = topics.filter(t => isAnalisi ? t.materia.toLowerCase().includes("analisi") : t.materia.toLowerCase().includes("geometria"));
    const currentIndex = sameSubject.findIndex(t => t.id === currentTopic.id);
    if (currentIndex >= 0 && currentIndex < sameSubject.length - 1) {
      return sameSubject[currentIndex + 1];
    }
    return null;
  }, [topics, currentTopic]);

  const handleAdjustHours = (delta) => {
    setHours(prev => Math.max(0.25, Number((prev + delta).toFixed(2))));
  };

  const handleSetExactResidue = () => {
    if (!currentTopic) return;
    const est = Number(currentTopic.oreStimate || 2.0);
    const eff = Number(currentTopic.oreEffettive || 0);
    const residue = Math.max(0.5, Number((est - eff).toFixed(2)));
    setHours(residue);
  };

  const handleQuickDate = (target) => {
    if (target === "today") {
      setSelectedDate(settings.currentSimulatedDate || new Date().toISOString().split("T")[0]);
    } else if (target === "yesterday") {
      const cur = new Date(settings.currentSimulatedDate || new Date());
      cur.setDate(cur.getDate() - 1);
      setSelectedDate(cur.toISOString().split("T")[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTopicId || !selectedDate || hours <= 0) {
      setNotification({ type: "error", message: "Compila tutti i campi obbligatori (argomento, data e ore > 0)." });
      return;
    }

    if (onSaveSession) {
      onSaveSession({
        topicId: selectedTopicId,
        date: selectedDate,
        hours: Number(hours),
        completed: Boolean(isCompleted),
        note: note.trim()
      });
    }

    setNotification({
      type: "success",
      message: `✓ Registrate ${hours}h su ${selectedTopicId} in data ${formatDateDisplay(selectedDate)}! Il piano si è aggiornato.`
    });

    setTimeout(() => {
      onClose();
    }, 600);
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const isCurrentAnalisi = currentTopic ? currentTopic.materia.toLowerCase().includes("analisi") : true;
  const oreStimate = Number(currentTopic?.oreStimate || 2.0);
  const oreGiaSvolte = Number(currentTopic?.oreEffettive || 0);
  const oreTotaliPost = Number((oreGiaSvolte + Number(hours || 0)).toFixed(2));
  const residuoPost = Math.max(0, Number((oreStimate - oreTotaliPost).toFixed(2)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/25 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl 2xl:max-w-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800/80 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-950/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">
              +
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Registra Sessione di Studio</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Ribilanciamento Dinamico
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Indica il giorno, l'argomento e le ore svolte: il piano si adatta in tempo reale!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            title="Chiudi finestra"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Nuova sessione vs Ultime registrazioni */}
        <div className="flex items-center justify-between px-5 pt-2.5 border-b border-slate-800/60 bg-slate-950/40 text-xs">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab("new")}
              className={`pb-2.5 px-3 font-bold border-b-2 transition ${
                activeTab === "new"
                  ? "border-emerald-400 text-emerald-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              + Nuova Registrazione
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("recent")}
              className={`pb-2.5 px-3 font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === "recent"
                  ? "border-emerald-400 text-emerald-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>Ultime Sessioni</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
                {studySessions.length}
              </span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-cyan-400">
            Oggi: {formatDateDisplay(settings.currentSimulatedDate)}
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {notification && (
            <div className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
              notification.type === "success"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
            }`}>
              <IconCheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{notification.message}</span>
            </div>
          )}

          {activeTab === "recent" ? (
            /* Recent Sessions List */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Storico delle sessioni registrate:</span>
                <span className="font-mono">{studySessions.length} sessioni</span>
              </div>

              {studySessions.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/30 border border-slate-800/80 rounded-2xl text-slate-400 text-xs">
                  Nessuna sessione registrata finora. Registra la tua prima sessione con il tab "+ Nuova Registrazione"!
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {studySessions.map((sess) => {
                    const topic = topics.find(t => t.id === sess.topicId);
                    const isAnalisi = topic ? topic.materia.toLowerCase().includes("analisi") : true;

                    return (
                      <div
                        key={sess.id}
                        className="p-3.5 bg-slate-900/80 border border-slate-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-slate-700 transition"
                      >
                        <div className="flex items-start space-x-3">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono ${
                            isAnalisi
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                          }`}>
                            {sess.topicId}
                          </span>

                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white font-mono">
                                {formatDateDisplay(sess.date)}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="font-bold text-cyan-300 font-mono">
                                +{sess.hours}h
                              </span>
                              {sess.completed && (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                                  ✓ Completato
                                </span>
                              )}
                            </div>

                            <p className="text-slate-300 font-medium mt-0.5 truncate max-w-sm">
                              {topic ? topic.argomento : sess.topicId}
                            </p>

                            {sess.note && (
                              <p className="text-slate-400 text-[11px] italic mt-0.5">
                                "{sess.note}"
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Eliminare la sessione di ${sess.hours}h su ${sess.topicId} del ${formatDateDisplay(sess.date)}? Le ore e lo stato verranno ripristinati.`)) {
                              onDeleteSession && onDeleteSession(sess.id);
                            }
                          }}
                          className="self-end sm:self-center p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                          title="Elimina questa sessione (ripristina ore)"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Form to Log New Study Session */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Data di Studio */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3 sm:p-4 space-y-2">
                <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <IconCalendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>1. Data della Sessione di Studio:</span>
                  </span>
                  <span className="text-[11px] font-normal text-slate-400">
                    Oggi: <strong className="text-cyan-300 font-mono">{formatDateDisplay(settings.currentSimulatedDate)}</strong>
                  </span>
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={settings.roadmapStartDate || "2026-11-16"}
                    max={settings.targetExamDate || "2027-01-10"}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500 transition shadow-inner"
                  />

                  {/* Quick Date Chips */}
                  <button
                    type="button"
                    onClick={() => handleQuickDate("today")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                      selectedDate === settings.currentSimulatedDate
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    ★ Oggi
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDate("yesterday")}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium border bg-slate-900 text-slate-400 border-slate-800 hover:text-white transition"
                  >
                    ◀ Ieri
                  </button>
                </div>
              </div>

              {/* 2. Selezione Visiva dell'Argomento */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3 sm:p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <IconBookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>2. Quale argomento hai studiato?</span>
                  </label>

                  {/* Subject filter tabs */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <div className="flex bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => handleFilterSubject("all")}
                        className={`px-2.5 py-1 rounded-lg transition font-medium ${
                          selectedSubject === "all" ? "bg-slate-800 text-white font-bold shadow" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Tutte ({topics.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFilterSubject("analisi")}
                        className={`px-2.5 py-1 rounded-lg transition font-medium ${
                          selectedSubject === "analisi" ? "bg-indigo-600/30 text-indigo-300 font-bold shadow" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Analisi 1 (32)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFilterSubject("geometria")}
                        className={`px-2.5 py-1 rounded-lg transition font-medium ${
                          selectedSubject === "geometria" ? "bg-teal-600/30 text-teal-300 font-bold shadow" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Geometria (31)
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStatusFilter(prev => prev === "uncompleted" ? "all" : "uncompleted")}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-mono border transition ${
                        statusFilter === "uncompleted"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                      title="Mostra solo argomenti da completare"
                    >
                      {statusFilter === "uncompleted" ? "Da Svolgere" : "Tutti gli stati"}
                    </button>
                  </div>
                </div>

                {/* Search Bar for instantaneous lookup */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <IconSearch className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cerca per ID (es. G-01, A-09) o parole chiave (es. matrici, integrali, autovalori)..."
                    className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white text-xs"
                      title="Cancella ricerca"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* CURRENT SELECTED TOPIC HERO CARD */}
                {currentTopic && (
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    isCurrentAnalisi
                      ? "bg-indigo-950/20 border-indigo-500/40 shadow-sm shadow-indigo-950/20"
                      : "bg-teal-950/20 border-teal-500/40 shadow-sm shadow-teal-950/20"
                  }`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isCurrentAnalisi
                            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                            : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                        }`}>
                          {currentTopic.materia}
                        </span>
                        <span className="font-mono font-black text-white text-sm">
                          {currentTopic.id}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          • {currentTopic.capitolo}
                        </span>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Argomento Selezionato
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {currentTopic.argomento}
                    </h3>

                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                      <div className="flex items-center space-x-3">
                        <span>Già svolte: <strong className="text-cyan-300">{oreGiaSvolte}h</strong></span>
                        <span>Stimate: <strong className="text-white">{oreStimate}h</strong></span>
                        <span>Residuo attuale: <strong className="text-amber-300">{Math.max(0, Number((oreStimate - oreGiaSvolte).toFixed(1)))}h</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>Difficoltà: <strong className="text-cyan-400">{currentTopic.difficolta}/5</strong></span>
                        <span>Priorità: <strong className="text-amber-400">{currentTopic.prioritaEsame}/5</strong></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SCROLLABLE TOPIC PICKER LIST */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span>Oppure seleziona un altro argomento dall'elenco ({filteredTopics.length} disponibili):</span>
                    {filteredTopics.length > 0 && (
                      <span className="text-slate-500 text-[10px]">Fai clic su un elemento per selezionarlo</span>
                    )}
                  </div>

                  {filteredTopics.length === 0 ? (
                    <div className="p-4 text-center rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-2">
                      <p>Nessun argomento trovato con i filtri attuali.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubject("all");
                          setStatusFilter("all");
                          setSearchQuery("");
                        }}
                        className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-bold transition"
                      >
                        Azzera filtri di ricerca
                      </button>
                    </div>
                  ) : (
                    <div className="max-h-48 sm:max-h-56 overflow-y-auto space-y-1.5 pr-1 border border-slate-800/80 rounded-2xl p-2 bg-slate-950/80 shadow-inner">
                      {filteredTopics.map((t) => {
                        const isSelected = t.id === selectedTopicId;
                        const isAnalisi = t.materia.toLowerCase().includes("analisi");
                        const isDone = Boolean(t.completato !== undefined ? t.completato : t.isCompleted);
                        const doneHours = Number(t.oreEffettive || 0);

                        return (
                          <div
                            key={t.id}
                            onClick={() => handleSelectTopic(t)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                              isSelected
                                ? isAnalisi
                                  ? "bg-indigo-950/40 border-indigo-500/80 shadow-sm shadow-indigo-500/20"
                                  : "bg-teal-950/40 border-teal-500/80 shadow-sm shadow-teal-500/20"
                                : "bg-slate-900/60 hover:bg-slate-850 border-slate-800/70 hover:border-slate-700"
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                              {/* Custom Radio Button */}
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition ${
                                isSelected
                                  ? isAnalisi
                                    ? "border-indigo-400 bg-indigo-500 text-white"
                                    : "border-teal-400 bg-teal-500 text-white"
                                  : "border-slate-600 bg-slate-950"
                              }`}>
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-paper" />}
                              </div>

                              {/* Topic ID */}
                              <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                                isAnalisi ? "bg-indigo-500/10 text-indigo-300" : "bg-teal-500/10 text-teal-300"
                              }`}>
                                {t.id}
                              </span>

                              {/* Topic Name */}
                              <span className={`truncate text-xs font-medium ${
                                isSelected ? "text-white font-bold" : "text-slate-300"
                              }`}>
                                {t.argomento}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2 flex-shrink-0 text-[10px] font-mono">
                              <span className="text-slate-400">
                                {doneHours}h / {t.oreStimate}h
                              </span>
                              {isDone ? (
                                <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                                  ✓ Fatto
                                </span>
                              ) : doneHours > 0 ? (
                                <span className="text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.2 rounded">
                                  In Corso
                                </span>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Quante ore hai studiato? */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3 sm:p-4 space-y-2.5">
                <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <IconClock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>3. Quante ore hai studiato in questa sessione?</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    +{hours} ore ({Math.round(hours * 60)} min)
                  </span>
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-inner">
                    <button
                      type="button"
                      onClick={() => handleAdjustHours(-0.5)}
                      disabled={hours <= 0.25}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold border border-slate-700 transition disabled:opacity-30"
                      title="Riduci di 30 minuti (-0.5h)"
                    >
                      - 30m
                    </button>
                    <input
                      type="number"
                      step="0.25"
                      min="0.25"
                      max="14.0"
                      value={hours}
                      onChange={(e) => setHours(Math.max(0.25, Number(e.target.value)))}
                      className="w-20 text-center bg-transparent text-white font-mono font-bold text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAdjustHours(0.5)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-500/40 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 transition active:scale-95"
                      title="Aggiungi 30 minuti (+0.5h)"
                    >
                      + 30m
                    </button>
                  </div>

                  {/* Stepper +1h */}
                  <button
                    type="button"
                    onClick={() => handleAdjustHours(1.0)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold border border-slate-800 transition active:scale-95"
                  >
                    + 1h
                  </button>

                  {/* Residuo esatto button */}
                  {currentTopic && Math.max(0, oreStimate - oreGiaSvolte) > 0 && (
                    <button
                      type="button"
                      onClick={handleSetExactResidue}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-mono font-bold border border-amber-500/40 transition active:scale-95"
                      title="Imposta le ore esattamente pari al residuo stimato dell'argomento"
                    >
                      Tutto il Residuo ({Math.max(0, Number((oreStimate - oreGiaSvolte).toFixed(1)))}h)
                    </button>
                  )}
                </div>

                {/* Quick Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500">Preset rapidi:</span>
                  {[0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 4.5].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setHours(val)}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono transition border ${
                        hours === val
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      {val}h
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Completamento Argomento */}
              <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="completeToggle"
                  checked={isCompleted}
                  onChange={(e) => {
                    setIsCompleted(e.target.checked);
                    setHasManuallyToggledComplete(true);
                  }}
                  className="w-4 h-4 mt-0.5 accent-emerald-500 rounded cursor-pointer"
                />
                <label htmlFor="completeToggle" className="cursor-pointer select-none text-xs flex-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>Segna questo argomento come COMPLETATO</span>
                    {isCompleted && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
                        ✓ Pronto per avanzamento
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {isCompleted
                      ? "L'argomento sarà archiviato come svolto. I giorni successivi attingeranno subito dai prossimi argomenti in sequenza propedeutica!"
                      : `Studio parziale: l'argomento rimarrà in programma nei giorni successivi con ${residuoPost}h residue.`}
                  </p>
                </label>
              </div>

              {/* 5. Note facoltative */}
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Note di sessione (facoltativo):
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="es. Svolti esercizi sulle matrici inverse, rivedere il determinante..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
                />
              </div>

              {/* 6. Dynamic Auto-Adapt Confirmation Box */}
              <div className="p-3.5 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-indigo-950/30 border border-cyan-500/30 rounded-2xl text-xs space-y-1.5">
                <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                  <IconSparkles className="w-4 h-4 text-cyan-400" />
                  <span>Riepilogo Registrazione & Auto-Adattamento:</span>
                </div>
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  Verranno registrate <strong>+{hours}h</strong> in data <strong>{formatDateDisplay(selectedDate)}</strong> sull'argomento:
                  <div className="mt-1 p-2 bg-slate-850 rounded-xl border border-slate-800 font-mono text-cyan-300 font-bold flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/30 text-white">
                      {currentTopic?.id}
                    </span>
                    <span className="truncate">{currentTopic?.argomento}</span>
                    <span className="text-slate-400 text-[10px] ml-auto">
                      ({isCompleted ? "✓ Completato" : "In Corso"})
                    </span>
                  </div>
                </div>
                <p className="text-slate-400 text-[11px] pt-1">
                  💡 <em>Se oggi avevi in programma un'altra materia, il calendario riadatterà automaticamente i carichi a partire da domani senza perdere nessun argomento.</em>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 transition"
                >
                  Annulla
                </button>

                <button
                  type="submit"
                  className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/25 border border-emerald-400/40 transition transform active:scale-95"
                >
                  <IconCheck className="w-4 h-4" />
                  <span>Conferma e Salva Sessione</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
