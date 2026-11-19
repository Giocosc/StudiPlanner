import React, { useState, useMemo } from "react";
import { withCompletion } from "../services/topicStateService.js";
import { getLocalTodayDateStr } from "../services/rebalancerEngine.js";
import { IconSearch, IconFilter, IconCheck, IconClock, IconFlame, IconCheckCircle } from "./Icons.js";

export function TopicsTable({ topics, onToggleComplete, onUpdateTopicHours, onBatchUpdate, onOpenTopicDetail }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTopics = useMemo(() => {
    return topics.filter(t => {
      const isDone = Boolean(t.completato !== undefined ? t.completato : t.isCompleted);
      const isPartial = !isDone && (Number(t.oreEffettive) || 0) > 0;

      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = t.id.toLowerCase().includes(query);
        const matchesArg = t.argomento.toLowerCase().includes(query);
        const matchesCap = (t.capitolo || "").toLowerCase().includes(query);
        if (!matchesId && !matchesArg && !matchesCap) return false;
      }

      // Subject
      if (subjectFilter !== "all") {
        if (!t.materia.toLowerCase().includes(subjectFilter.toLowerCase())) return false;
      }

      // Status
      if (statusFilter === "completed" && !isDone) return false;
      if (statusFilter === "in_progress" && !isPartial) return false;
      if (statusFilter === "todo" && (isDone || isPartial)) return false;

      // Priority
      if (priorityFilter === "high" && (t.prioritaEsame < 4 && t.difficolta < 4)) return false;

      return true;
    });
  }, [topics, searchQuery, subjectFilter, statusFilter, priorityFilter]);

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 md:p-5 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <IconSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per ID (es. A-09, G-14), argomento, capitolo..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Tutte le Materie</option>
            <option value="analisi">Analisi 1</option>
            <option value="geometria">Geometria</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Tutti gli Stati</option>
            <option value="todo">Da Fare (0h)</option>
            <option value="in_progress">In Corso (Parziale)</option>
            <option value="completed">Solo Completati</option>
          </select>

          {/* Priority Filter */}
          <button
            onClick={() => setPriorityFilter(priorityFilter === "high" ? "all" : "high")}
            className={`text-xs px-3 py-2 rounded-xl border transition flex items-center gap-1.5 ${
              priorityFilter === "high"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            <IconFlame className="w-3.5 h-3.5 text-amber-400" />
            Alta Priorità / Buffer
          </button>
        </div>
      </div>

      {/* Topics Count and Batch Controls */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-400">
        <div>
          Visualizzati <strong className="text-white">{filteredTopics.length}</strong> su{" "}
          <strong className="text-white">{topics.length}</strong> argomenti totali
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onBatchUpdate(topics.map(t => withCompletion(t, false)))}
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            Reset tutti a "Da fare"
          </button>
          <span>•</span>
          <button
            onClick={() => {
              // Mark first 6 topics completed as a test
              const today = getLocalTodayDateStr();
              const updated = topics.map((t, idx) => (idx < 6 ? withCompletion(t, true, today) : t));
              onBatchUpdate(updated);
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition"
          >
            Simula completamento prime 2 sett.
          </button>
        </div>
      </div>

      {/* Table / Cards */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Stato</th>
                <th className="py-3 px-3 w-20">ID</th>
                <th className="py-3 px-3 w-28">Materia</th>
                <th className="py-3 px-4">Capitolo & Argomento</th>
                <th className="py-3 px-3 w-36 text-center">Ore Spese / Stimate</th>
                <th className="py-3 px-3 w-20 text-center">Difficoltà</th>
                <th className="py-3 px-3 w-20 text-center">Priorità</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTopics.map((topic) => {
                const isAnalisi = topic.materia.toLowerCase().includes("analisi");
                const isDone = Boolean(topic.completato !== undefined ? topic.completato : topic.isCompleted);
                const hasBuffer = (topic.prioritaEsame >= 4 || topic.difficolta >= 4);
                const effHours = Number(topic.oreEffettive || 0);

                return (
                  <tr
                    key={topic.id}
                    className={`hover:bg-slate-850/60 transition ${
                      isDone ? "bg-slate-950/40 opacity-60" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onToggleComplete(topic.id)}
                        className={`w-5 h-5 mx-auto rounded-lg border flex items-center justify-center transition-colors ${
                          isDone
                            ? "bg-emerald-500 border-emerald-400 text-white"
                            : effHours > 0
                            ? "border-cyan-500/60 bg-cyan-950/40 text-cyan-300"
                            : "border-slate-600 hover:border-slate-400 bg-slate-900"
                        }`}
                        title={isDone ? "Segna come incompleto" : "Segna come completato"}
                      >
                        {isDone && <IconCheck className="w-3.5 h-3.5" />}
                        {!isDone && effHours > 0 && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      </button>
                    </td>

                    {/* ID */}
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => onOpenTopicDetail && onOpenTopicDetail(topic)}
                        className="font-mono font-bold text-slate-200 hover:text-cyan-300 transition flex items-center gap-1 group/btn"
                        title="Apri scheda informativa"
                      >
                        <span>{topic.id}</span>
                        <span className="text-[9px] font-sans px-1 py-0.2 rounded bg-cyan-500/10 text-cyan-400 group-hover/btn:bg-cyan-500/20 border border-cyan-500/30">
                          ℹ
                        </span>
                      </button>
                    </td>

                    {/* Subject */}
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        isAnalisi
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      }`}>
                        {topic.materia}
                      </span>
                    </td>

                    {/* Chapter & Topic */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenTopicDetail && onOpenTopicDetail(topic)}
                          className="font-semibold text-slate-200 hover:text-cyan-300 transition text-xs text-left group/title"
                          title="Apri scheda informativa dettagliata"
                        >
                          <span className="group-hover/title:underline">{topic.argomento}</span>
                        </button>
                        {!isDone && effHours > 0 && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex-shrink-0">
                            In Corso
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Capitolo: <span className="text-slate-300">{topic.capitolo}</span>
                        {topic.fonti && <span className="text-slate-500"> • {topic.fonti}</span>}
                      </div>
                    </td>

                    {/* Hours (Spese / Stimate) */}
                    <td className="py-3 px-3 text-center">
                      <div className="font-mono font-bold text-xs">
                        <span className="text-cyan-400">{effHours.toFixed(1)}h</span>
                        <span className="text-slate-400"> / {topic.oreStimate}h</span>
                      </div>
                      {!isDone && (
                        <div className="text-[10px] text-amber-400/90 font-mono">
                          Residue: {Number(topic.oreResidue !== undefined ? topic.oreResidue : Math.max(0, (topic.oreStimate || 2.0) - effHours)).toFixed(1)}h
                        </div>
                      )}
                      {hasBuffer && (
                        <span className="text-[9px] text-amber-500/80 font-mono block">
                          +20% buffer
                        </span>
                      )}
                      {onUpdateTopicHours && (
                        <div className="mt-1 flex items-center justify-center space-x-1">
                          <button
                            type="button"
                            onClick={() => onUpdateTopicHours(topic.id, 0.5, true)}
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-mono border border-slate-700"
                            title="Aggiungi 30m"
                          >
                            +30m
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateTopicHours(topic.id, 1.0, true)}
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[10px] font-mono border border-slate-700"
                            title="Aggiungi 1h"
                          >
                            +1h
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Difficulty */}
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono font-bold">
                        {topic.difficolta}/5
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full font-mono font-bold ${
                        topic.prioritaEsame >= 4
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-slate-800 text-slate-300"
                      }`}>
                        {topic.prioritaEsame}/5
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
