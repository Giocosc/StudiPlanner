import React, { useState, useEffect, useMemo } from "react";
import { INITIAL_TOPICS } from "./data/defaultData.js";
import { rebalanceStudyPlan, DEFAULT_SETTINGS } from "./services/rebalancerEngine.js";
import { AlertBanner } from "./components/AlertBanner.js";
import { Dashboard } from "./components/Dashboard.js";
import { WeeklyTodo } from "./components/WeeklyTodo.js";
import { TopicsTable } from "./components/TopicsTable.js";
import { FileImporter } from "./components/FileImporter.js";
import { HistoryLog } from "./components/HistoryLog.js";
import { SettingsModal } from "./components/SettingsModal.js";
import { Clarke9000Companion } from "./components/Clarke9000Companion.js";
import {
  IconBarChart,
  IconCalendar,
  IconLayers,
  IconUpload,
  IconSettings,
  IconClock,
  IconFlame,
  IconBookOpen,
  IconHistory,
  IconSave,
  IconFileCheck
} from "./components/Icons.js";

const LOCAL_STORAGE_KEY_TOPICS = "unimore_rebalancer_topics_v2";
const LOCAL_STORAGE_KEY_SETTINGS = "unimore_rebalancer_settings_v2";

export function App() {
  // Load saved state from localStorage if available, or use official UNIMORE defaults
  const [topics, setTopics] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TOPICS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load topics from localStorage", e);
    }
    return INITIAL_TOPICS;
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load settings from localStorage", e);
    }
    return DEFAULT_SETTINGS;
  });

  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "weekly" | "history" | "topics" | "import"
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState("");

  // Transparent File System Access API synchronization
  const [fileHandle, setFileHandle] = useState(null);
  const [fsSyncStatus, setFsSyncStatus] = useState({
    active: false,
    fileName: "",
    lastSaved: null,
    isSaving: false,
    error: null
  });

  // Save to localStorage on change with visual confirmation
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TOPICS, JSON.stringify(topics));
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.warn("Failed to persist topics", e);
    }
  }, [topics]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn("Failed to persist settings", e);
    }
  }, [settings]);

  // Transparent Auto-Sync: Automatically overwrite connected JSON file on any global state change
  useEffect(() => {
    if (!fileHandle) return;

    let isMounted = true;
    const autoSaveToFile = async () => {
      try {
        if (isMounted) setFsSyncStatus(prev => ({ ...prev, isSaving: true, error: null }));
        const writable = await fileHandle.createWritable();
        const backupData = {
          exportDate: new Date().toISOString(),
          settings,
          topics
        };
        await writable.write(JSON.stringify(backupData, null, 2));
        await writable.close();
        if (isMounted) {
          setFsSyncStatus({
            active: true,
            fileName: fileHandle.name,
            lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            isSaving: false,
            error: null
          });
        }
      } catch (err) {
        console.warn("Auto-sync write error:", err);
        if (isMounted) {
          setFsSyncStatus(prev => ({ ...prev, isSaving: false, error: err.message }));
        }
      }
    };

    autoSaveToFile();

    return () => {
      isMounted = false;
    };
  }, [topics, settings, fileHandle]);

  // Connect file handle using File System Access API
  const handleConnectFileSystem = async () => {
    if (typeof window === "undefined" || !("showOpenFilePicker" in window)) {
      throw new Error("La File System Access API non è supportata da questo browser.");
    }
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: "File di Backup JSON (*.json)",
          accept: { "application/json": [".json"] }
        }
      ],
      multiple: false
    });
    if (!handle) return null;

    const file = await handle.getFile();
    const text = await file.text();
    let imported = false;
    if (text.trim()) {
      try {
        const backup = JSON.parse(text);
        if (backup.topics && Array.isArray(backup.topics)) {
          setTopics(backup.topics);
          if (backup.settings) {
            setSettings(backup.settings);
          }
          imported = true;
        }
      } catch (e) {
        console.warn("File JSON iniziale vuoto o non valido; verrà popolato con i dati attuali.", e);
      }
    }

    setFileHandle(handle);
    setFsSyncStatus({
      active: true,
      fileName: handle.name,
      lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isSaving: false,
      error: null
    });

    if (!imported) {
      try {
        const writable = await handle.createWritable();
        await writable.write(JSON.stringify({
          exportDate: new Date().toISOString(),
          settings,
          topics
        }, null, 2));
        await writable.close();
      } catch (err) {
        console.warn("Scrittura iniziale fallita:", err);
      }
    }

    return { fileName: handle.name, imported };
  };

  const handleDisconnectFileSystem = () => {
    setFileHandle(null);
    setFsSyncStatus({
      active: false,
      fileName: "",
      lastSaved: null,
      isSaving: false,
      error: null
    });
  };

  const handleTriggerManualSave = async () => {
    if (!fileHandle) return;
    try {
      setFsSyncStatus(prev => ({ ...prev, isSaving: true, error: null }));
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify({
        exportDate: new Date().toISOString(),
        settings,
        topics
      }, null, 2));
      await writable.close();
      setFsSyncStatus({
        active: true,
        fileName: fileHandle.name,
        lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        isSaving: false,
        error: null
      });
    } catch (err) {
      setFsSyncStatus(prev => ({ ...prev, isSaving: false, error: err.message }));
    }
  };

  // Reactive Rebalancing calculation
  const rebalancedPlan = useMemo(() => {
    return rebalanceStudyPlan(topics, settings);
  }, [topics, settings]);

  const { metrics, weeklyPlans, progress, historyDays } = rebalancedPlan;

  // Toggle completion of a single topic with automatic timestamp
  const handleToggleComplete = (topicId) => {
    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          const willComplete = !t.isCompleted;
          return {
            ...t,
            isCompleted: willComplete,
            completedDate: willComplete ? (t.completedDate || settings.currentSimulatedDate) : null
          };
        }
        return t;
      })
    );
  };

  // Batch update of topics (e.g. from FileImporter or reset)
  const handleTopicsUpdated = (newTopics) => {
    setTopics(newTopics);
  };

  // Date controls: simulate advancing or retroceding date
  const handleAdvanceDate = () => {
    const cur = new Date(settings.currentSimulatedDate);
    cur.setDate(cur.getDate() + 1);
    setSettings(prev => ({
      ...prev,
      currentSimulatedDate: cur.toISOString().split("T")[0]
    }));
  };

  const handleRetrocedeDate = () => {
    const cur = new Date(settings.currentSimulatedDate);
    cur.setDate(cur.getDate() - 1);
    setSettings(prev => ({
      ...prev,
      currentSimulatedDate: cur.toISOString().split("T")[0]
    }));
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}`;
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Subtitle */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                <IconBookOpen className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base md:text-lg font-black tracking-tight text-white">
                  Studi<span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Planner</span>
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  UNIMORE Ingegneria
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Analisi 1 & Geometria • Ribilanciamento dinamico fino al 10 Gennaio 2027
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/80 border border-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-white border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <IconBarChart className="w-4 h-4 text-cyan-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("weekly")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "weekly"
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-white border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <IconCalendar className="w-4 h-4 text-emerald-400" />
              <span>To-Do Settimanale</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-white border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <IconHistory className="w-4 h-4 text-amber-400" />
              <span>Storico & Diario</span>
            </button>

            <button
              onClick={() => setActiveTab("topics")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "topics"
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-white border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <IconLayers className="w-4 h-4 text-indigo-400" />
              <span>Catalogo Argomenti</span>
            </button>

            <button
              onClick={() => setActiveTab("import")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "import"
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-white border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <IconUpload className="w-4 h-4 text-purple-400" />
              <span>Import / Sync</span>
            </button>
          </nav>

          {/* Right Action: Date Simulation Controls & Settings */}
          <div className="flex items-center space-x-2.5">
            {/* Auto-Sync status badge if connected */}
            {fsSyncStatus.active && (
              <button
                type="button"
                onClick={() => setActiveTab("import")}
                className="hidden lg:flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1.5 rounded-xl text-xs font-mono text-emerald-300 hover:bg-emerald-900/60 transition"
                title={`Sincronizzazione automatica attiva su: ${fsSyncStatus.fileName} (Ultimo salvataggio: ${fsSyncStatus.lastSaved || "In corso..."})`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="truncate max-w-[120px] font-bold">{fsSyncStatus.fileName}</span>
              </button>
            )}

            {/* Quick date simulator pill */}
            <div className="hidden sm:flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-xs font-mono">
              <button
                onClick={handleRetrocedeDate}
                className="px-1.5 py-0.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition"
                title="Giorno precedente"
              >
                ◀
              </button>
              <span className="px-2 font-bold text-cyan-300">
                Oggi: {formatDateDisplay(settings.currentSimulatedDate)}
              </span>
              <button
                onClick={handleAdvanceDate}
                className="px-1.5 py-0.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition"
                title="Giorno successivo (simula giorno saltato o avanzamento)"
              >
                ▶
              </button>
            </div>

            {/* Countdown pill */}
            <div className="hidden md:flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-mono">
              <IconClock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-white">{metrics.remainingDays} gg</span>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition"
              title="Parametri di Ribilanciamento"
            >
              <IconSettings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6 pb-24 md:pb-12">
        {/* Rolling Catch-Up Banner (if days were skipped) */}
        {metrics.pastDaysSkipped > 0 && (
          <div className="bg-gradient-to-r from-cyan-950/60 to-indigo-950/50 border border-cyan-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl flex-shrink-0">
                <IconHistory className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-cyan-300 text-sm">
                  🔄 Ribilanciamento Dinamico Attivo
                </span>
                <p className="text-slate-300 mt-0.5">
                  Rilevati <strong>{metrics.pastDaysSkipped} giorni saltati</strong> nel passato: tutti gli argomenti non svolti sono stati automaticamente riposizionati da oggi in avanti, garantendo la copertura completa prima del 10 Gennaio 2027.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-center">
              <button
                onClick={() => setActiveTab("history")}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 px-3 py-1.5 rounded-xl font-semibold transition"
              >
                Vedi Storico
              </button>
            </div>
          </div>
        )}

        {/* Critical Overload Warning Banner */}
        <AlertBanner
          metrics={metrics}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <Dashboard
            progress={progress}
            metrics={metrics}
            onTabChange={setActiveTab}
            topics={topics}
            settings={settings}
          />
        )}

        {activeTab === "weekly" && (
          <WeeklyTodo
            weeklyPlans={weeklyPlans}
            onToggleComplete={handleToggleComplete}
            settings={settings}
          />
        )}

        {activeTab === "history" && (
          <HistoryLog
            historyDays={historyDays}
            calendarDays={rebalancedPlan.calendarDays}
            metrics={metrics}
            onAdvanceDate={handleAdvanceDate}
            onRetrocedeDate={handleRetrocedeDate}
            onSetDate={(newDate) => setSettings(prev => ({ ...prev, currentSimulatedDate: newDate }))}
          />
        )}

        {activeTab === "topics" && (
          <TopicsTable
            topics={topics}
            onToggleComplete={handleToggleComplete}
            onBatchUpdate={handleTopicsUpdated}
          />
        )}

        {activeTab === "import" && (
          <FileImporter
            topics={topics}
            settings={settings}
            onTopicsUpdated={handleTopicsUpdated}
            onSettingsUpdated={(newSettings) => setSettings(newSettings)}
            fsSyncStatus={fsSyncStatus}
            onConnectFileSystem={handleConnectFileSystem}
            onDisconnectFileSystem={handleDisconnectFileSystem}
            onTriggerManualSave={handleTriggerManualSave}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === "dashboard" ? "text-cyan-400 font-bold" : "text-slate-500"
          }`}
        >
          <IconBarChart className="w-5 h-5" />
          <span className="text-[10px] mt-1">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab("weekly")}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === "weekly" ? "text-emerald-400 font-bold" : "text-slate-500"
          }`}
        >
          <IconCalendar className="w-5 h-5" />
          <span className="text-[10px] mt-1">Settimanale</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === "history" ? "text-amber-400 font-bold" : "text-slate-500"
          }`}
        >
          <IconHistory className="w-5 h-5" />
          <span className="text-[10px] mt-1">Storico</span>
        </button>

        <button
          onClick={() => setActiveTab("topics")}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === "topics" ? "text-indigo-400 font-bold" : "text-slate-500"
          }`}
        >
          <IconLayers className="w-5 h-5" />
          <span className="text-[10px] mt-1">Argomenti</span>
        </button>

        <button
          onClick={() => setActiveTab("import")}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === "import" ? "text-purple-400 font-bold" : "text-slate-500"
          }`}
        >
          <IconUpload className="w-5 h-5" />
          <span className="text-[10px] mt-1">File</span>
        </button>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => setSettings(newSettings)}
      />

      {/* CLARKE-9000 Isolated Side Companion */}
      <Clarke9000Companion
        progress={progress}
        metrics={metrics}
      />
    </div>
  );
}
