import React, { useState, useMemo } from "react";
import { IconSearch, IconFilter, IconCheck, IconClock, IconFlame, IconCheckCircle } from "./Icons.js";

export function TopicsTable({ topics, onToggleComplete, onBatchUpdate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTopics = useMemo(() => {
    return topics.filter(t => {
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
      if (statusFilter === "completed" && !t.isCompleted) return false;
      if (statusFilter === "todo" && t.isCompleted) return false;

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
            <option value="todo">Solo Da Fare</option>
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
            onClick={() => onBatchUpdate(topics.map(t => ({ ...t, isCompleted: false })))}
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            Reset tutti a "Da fare"
          </button>
          <span>•</span>
          <button
            onClick={() => {
              // Mark first 6 topics completed as a test
              const updated = topics.map((t, idx) => ({
                ...t,
                isCompleted: idx < 6 ? true : t.isCompleted
              }));
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
                <th className="py-3 px-3 w-24 text-center">Ore Stimate</th>
                <th className="py-3 px-3 w-20 text-center">Difficoltà</th>
                <th className="py-3 px-3 w-20 text-center">Priorità</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTopics.map((topic) => {
                const isAnalisi = topic.materia.toLowerCase().includes("analisi");
                const hasBuffer = (topic.prioritaEsame >= 4 || topic.difficolta >= 4);

                return (
                  <tr
                    key={topic.id}
                    className={`hover:bg-slate-850/60 transition ${
                      topic.isCompleted ? "bg-slate-950/40 opacity-60" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onToggleComplete(topic.id)}
                        className={`w-5 h-5 mx-auto rounded-lg border flex items-center justify-center transition-colors ${
                          topic.isCompleted
                            ? "bg-emerald-500 border-emerald-400 text-white"
                            : "border-slate-600 hover:border-slate-400 bg-slate-900"
                        }`}
                        title={topic.isCompleted ? "Segna come incompleto" : "Segna come completato"}
                      >
                        {topic.isCompleted && <IconCheck className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    {/* ID */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-200">
                      {topic.id}
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
                      <div className="font-semibold text-slate-200 text-xs">
                        {topic.argomento}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Capitolo: <span className="text-slate-300">{topic.capitolo}</span>
                        {topic.fonti && <span className="text-slate-500"> • {topic.fonti}</span>}
                      </div>
                    </td>

                    {/* Hours */}
                    <td className="py-3 px-3 text-center">
                      <div className="font-mono font-bold text-slate-200">
                        {topic.oreStimate}h
                      </div>
                      {hasBuffer && (
                        <span className="text-[10px] text-amber-400/90 font-mono">
                          +20% buff.
                        </span>
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
