import React, { useState, useEffect, useMemo } from "react";
import { INITIAL_TOPICS } from "./data/defaultData.js";
import { rebalanceStudyPlan, DEFAULT_SETTINGS, getLocalTodayDateStr } from "./services/rebalancerEngine.js";
import { AlertBanner } from "./components/AlertBanner.js";
import { Dashboard } from "./components/Dashboard.js";
import { WeeklyTodo } from "./components/WeeklyTodo.js";
import { TopicsTable } from "./components/TopicsTable.js";
import { FileImporter } from "./components/FileImporter.js";
import { HistoryLog } from "./components/HistoryLog.js";
import { SettingsModal } from "./components/SettingsModal.js";
import { Clarke9000Companion } from "./components/Clarke9000Companion.js";
import { LogStudyModal } from "./components/LogStudyModal.js";
import { TopicDetailModal } from "./components/TopicDetailModal.js";
import {
  LOCAL_STORAGE_KEY_GITLAB_CONFIG,
  DEFAULT_GITLAB_CONFIG,
  pullFromGitLab,
  pushToGitLab
} from "./services/gitlabSyncService.js";
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
  IconFileCheck,
  IconPlus,
  IconGitLab
} from "./components/Icons.js";

const LOCAL_STORAGE_KEY_TOPICS = "unimore_rebalancer_topics_v2";
const LOCAL_STORAGE_KEY_SETTINGS = "unimore_rebalancer_settings_v2";
const LOCAL_STORAGE_KEY_CUSTOM_CAPACITIES = "unimore_rebalancer_custom_capacities_v2";
const LOCAL_STORAGE_KEY_SESSIONS = "unimore_rebalancer_sessions_v2";

export function App() {
  // Load saved state from localStorage if available, or use official UNIMORE defaults
  // Ensures granular partial progress: oreEffettive (float) and completato (boolean)
  const [topics, setTopics] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TOPICS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(t => {
          const isDone = Boolean(t.completato !== undefined ? t.completato : t.isCompleted);
          const oreEff = t.oreEffettive !== undefined && t.oreEffettive !== null
            ? Number(t.oreEffettive)
            : (isDone ? Number(t.oreStimate || 2.0) : 0);
          return {
            ...t,
            completato: isDone,
            isCompleted: isDone,
            oreEffettive: oreEff
          };
        });
      }
    } catch (e) {
      console.warn("Could not load topics from localStorage", e);
    }
    return INITIAL_TOPICS.map(t => ({
      ...t,
      completato: false,
      isCompleted: false,
      oreEffettive: 0
    }));
  });

  const [settings, setSettings] = useState(() => {
    const todayStr = getLocalTodayDateStr();
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If the saved date is older than today or empty, automatically sync to today's real date!
        if (!parsed.currentSimulatedDate || parsed.currentSimulatedDate < todayStr) {
          return {
            ...parsed,
            currentSimulatedDate: todayStr
          };
        }
        return parsed;
      }
    } catch (e) {
      console.warn("Could not load settings from localStorage", e);
    }
    return {
      ...DEFAULT_SETTINGS,
      currentSimulatedDate: todayStr
    };
  });

  // Dynamic daily capacities override (Time Shifter)
  const [customDayCapacities, setCustomDayCapacities] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOM_CAPACITIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load customDayCapacities from localStorage", e);
    }
    return {};
  });

  // Recorded study sessions log
  const [studySessions, setStudySessions] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SESSIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load studySessions from localStorage", e);
    }
    return [];
  });

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logModalInitialData, setLogModalInitialData] = useState({});
  const [selectedTopicDetail, setSelectedTopicDetail] = useState(null);

  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "weekly" | "history" | "topics" | "import"
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState("");

  // GitLab Cloud Sync state
  const [gitlabConfig, setGitlabConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_GITLAB_CONFIG);
      if (saved) return { ...DEFAULT_GITLAB_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.warn("Could not load gitlabConfig", e);
    }
    return DEFAULT_GITLAB_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_GITLAB_CONFIG, JSON.stringify(gitlabConfig));
    } catch (e) {
      console.warn("Failed to persist gitlabConfig", e);
    }
  }, [gitlabConfig]);

  // Transparent File System Access API synchronization
  const [fileHandle, setFileHandle] = useState(null);
  const [fsSyncStatus, setFsSyncStatus] = useState({
    active: false,
    fileName: "",
    lastSaved: null,
    isSaving: false,
    error: null
  });

  // PWA Installation & Standalone detection
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect standalone PWA mode
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    setIsStandalone(isRunningStandalone);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("[PWA] beforeinstallprompt event captured and ready");
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      console.log("[PWA] App installed successfully!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
    } else {
      alert("Per installare StudiPlanner tramite Chrome o Edge:\n\n1. Clicca sull'icona 'Installa' nella barra degli indirizzi in alto a destra (icona monitor con freccia verso il basso).\n2. Oppure apri il menu a tre puntini (⋮) -> 'Installa StudiPlanner'.\n\nL'app si aprirà in una finestra desktop dedicata e potrai fissarla alla Barra delle Applicazioni!");
    }
  };


  // Auto-sync date if day rolls over while tab is open or window receives focus
  useEffect(() => {
    const checkDateRoll = () => {
      const todayStr = getLocalTodayDateStr();
      setSettings(prev => {
        if (prev.currentSimulatedDate < todayStr) {
          return { ...prev, currentSimulatedDate: todayStr };
        }
        return prev;
      });
    };

    window.addEventListener("focus", checkDateRoll);
    const timer = setInterval(checkDateRoll, 60000); // Check once a minute
    return () => {
      window.removeEventListener("focus", checkDateRoll);
      clearInterval(timer);
    };
  }, []);
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

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_CAPACITIES, JSON.stringify(customDayCapacities));
    } catch (e) {
      console.warn("Failed to persist customDayCapacities", e);
    }
  }, [customDayCapacities]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SESSIONS, JSON.stringify(studySessions));
    } catch (e) {
      console.warn("Failed to persist studySessions", e);
    }
  }, [studySessions]);

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
          topics,
          customDayCapacities,
          studySessions
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
  }, [topics, settings, customDayCapacities, studySessions, fileHandle]);

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
          if (backup.customDayCapacities && typeof backup.customDayCapacities === "object") {
            setCustomDayCapacities(backup.customDayCapacities);
          }
          if (backup.studySessions && Array.isArray(backup.studySessions)) {
            setStudySessions(backup.studySessions);
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
          topics,
          customDayCapacities,
          studySessions
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
        topics,
        customDayCapacities,
        studySessions
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

  // 1. GitLab Initial Auto-Pull on App Mount
  useEffect(() => {
    if (!gitlabConfig?.enabled || !gitlabConfig?.autoSync || !gitlabConfig?.token || !gitlabConfig?.projectId) return;

    let isMounted = true;
    const initialPull = async () => {
      try {
        setGitlabConfig(prev => ({ ...prev, syncStatus: "syncing", errorMessage: null }));
        const res = await pullFromGitLab(gitlabConfig);
        if (!isMounted) return;

        if (res.success && res.data) {
          const remoteData = res.data;
          if (remoteData.topics && Array.isArray(remoteData.topics)) setTopics(remoteData.topics);
          if (remoteData.settings) setSettings(prev => ({ ...prev, ...remoteData.settings, currentSimulatedDate: getLocalTodayDateStr() }));
          if (remoteData.customDayCapacities) setCustomDayCapacities(remoteData.customDayCapacities);
          if (remoteData.studySessions && Array.isArray(remoteData.studySessions)) setStudySessions(remoteData.studySessions);

          setGitlabConfig(prev => ({
            ...prev,
            syncStatus: "success",
            lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            lastCommitId: res.commitId || prev.lastCommitId,
            errorMessage: null
          }));
        } else {
          setGitlabConfig(prev => ({ ...prev, syncStatus: "idle" }));
        }
      } catch (err) {
        if (isMounted) {
          console.warn("GitLab auto-pull error:", err);
          setGitlabConfig(prev => ({ ...prev, syncStatus: "error", errorMessage: err.message }));
        }
      }
    };

    initialPull();
    return () => { isMounted = false; };
  }, []);

  // 2. GitLab Auto-Push on State Changes (Debounced to avoid rapid commit spam)
  const isGitLabMountRef = useRef(true);
  useEffect(() => {
    if (isGitLabMountRef.current) {
      isGitLabMountRef.current = false;
      return;
    }
    if (!gitlabConfig?.enabled || !gitlabConfig?.autoSync || !gitlabConfig?.token || !gitlabConfig?.projectId) return;

    setGitlabConfig(prev => ({ ...prev, syncStatus: "syncing" }));

    const timer = setTimeout(async () => {
      try {
        const payload = {
          exportDate: new Date().toISOString(),
          settings,
          topics,
          customDayCapacities,
          studySessions
        };
        const res = await pushToGitLab(gitlabConfig, payload);
        setGitlabConfig(prev => ({
          ...prev,
          syncStatus: "success",
          lastSynced: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          lastCommitId: res.commitId || prev.lastCommitId,
          errorMessage: null
        }));
      } catch (err) {
        console.warn("GitLab auto-push error:", err);
        setGitlabConfig(prev => ({ ...prev, syncStatus: "error", errorMessage: err.message }));
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [topics, settings, customDayCapacities, studySessions, gitlabConfig?.enabled, gitlabConfig?.autoSync]);

  // 3. Manual GitLab Pull & Push Handlers
  const handleGitLabPull = async () => {
    setGitlabConfig(prev => ({ ...prev, syncStatus: "syncing", errorMessage: null }));
    try {
      const res = await pullFromGitLab(gitlabConfig);
      if (res.success && res.data) {
        const remoteData = res.data;
        if (remoteData.topics && Array.isArray(remoteData.topics)) setTopics(remoteData.topics);
        if (remoteData.settings) setSettings(prev => ({ ...prev, ...remoteData.settings, currentSimulatedDate: getLocalTodayDateStr() }));
        if (remoteData.customDayCapacities) setCustomDayCapacities(remoteData.customDayCapacities);
        if (remoteData.studySessions && Array.isArray(remoteData.studySessions)) setStudySessions(remoteData.studySessions);

        setGitlabConfig(prev => ({
          ...prev,
          syncStatus: "success",
          lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          lastCommitId: res.commitId || prev.lastCommitId,
          errorMessage: null
        }));
        return { success: true, message: "Dati scaricati e sincronizzati con successo da GitLab!" };
      }
      return { success: false, message: res.message || "Nessun file trovato nel repo." };
    } catch (err) {
      setGitlabConfig(prev => ({ ...prev, syncStatus: "error", errorMessage: err.message }));
      throw err;
    }
  };

  const handleGitLabPush = async (customMsg) => {
    setGitlabConfig(prev => ({ ...prev, syncStatus: "syncing", errorMessage: null }));
    try {
      const payload = {
        exportDate: new Date().toISOString(),
        settings,
        topics,
        customDayCapacities,
        studySessions
      };
      const res = await pushToGitLab(gitlabConfig, payload, customMsg);
      setGitlabConfig(prev => ({
        ...prev,
        syncStatus: "success",
        lastSynced: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        lastCommitId: res.commitId || prev.lastCommitId,
        errorMessage: null
      }));
      return { success: true, message: "Nuovo commit inviato con successo su GitLab!" };
    } catch (err) {
      setGitlabConfig(prev => ({ ...prev, syncStatus: "error", errorMessage: err.message }));
      throw err;
    }
  };

  // Dynamic Daily Capacity Override (Time Shifter) Handlers
  const handleUpdateDayCapacity = (dateStr, newHours) => {
    setCustomDayCapacities(prev => {
      const updated = { ...prev };
      if (newHours === null || newHours === undefined) {
        delete updated[dateStr];
      } else {
        updated[dateStr] = Math.max(0, Number(Number(newHours).toFixed(1)));
      }
      return updated;
    });
  };

  const handleResetDayCapacities = () => {
    setCustomDayCapacities({});
  };

  // Reactive Rebalancing calculation
  const rebalancedPlan = useMemo(() => {
    return rebalanceStudyPlan(topics, settings, customDayCapacities, studySessions);
  }, [topics, settings, customDayCapacities, studySessions]);

  const { metrics, weeklyPlans, progress, historyDays } = rebalancedPlan;

  // Open / Close Log Study Modal
  const handleOpenLogModal = (initialData = {}) => {
    setLogModalInitialData(initialData || {});
    setIsLogModalOpen(true);
  };

  const handleCloseLogModal = () => {
    setIsLogModalOpen(false);
    setLogModalInitialData({});
  };

  // Open / Close Topic Detail Sheet Modal
  const handleOpenTopicDetail = (topicOrId) => {
    if (!topicOrId) return;
    const found = typeof topicOrId === "string"
      ? topics.find(t => t.id === topicOrId)
      : (topics.find(t => t.id === topicOrId.id) || topicOrId);
    setSelectedTopicDetail(found || null);
  };

  const handleCloseTopicDetail = () => {
    setSelectedTopicDetail(null);
  };

  // Keep selectedTopicDetail in sync with updated topics state
  useEffect(() => {
    if (selectedTopicDetail) {
      const fresh = topics.find(t => t.id === selectedTopicDetail.id);
      if (fresh) setSelectedTopicDetail(fresh);
    }
  }, [topics]);

  // Add recorded study session and update topic state
  const handleLogStudySession = ({ topicId, date, hours, completed, note }) => {
    const numHours = Number(hours) || 0;
    const sessionDate = date || settings.currentSimulatedDate;
    const newSession = {
      id: "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
      topicId,
      date: sessionDate,
      hours: numHours,
      completed: Boolean(completed),
      note: note || "",
      timestamp: new Date().toISOString()
    };

    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        const currentEff = Number(t.oreEffettive || 0);
        const newEff = Number((currentEff + numHours).toFixed(2));
        const isDone = completed !== undefined ? Boolean(completed) : (t.completato || newEff >= Number(t.oreStimate || 2.0));
        return {
          ...t,
          oreEffettive: newEff,
          completato: isDone,
          isCompleted: isDone,
          completedDate: isDone ? (t.completedDate || sessionDate) : null
        };
      }
      return t;
    }));

    setStudySessions(prev => [newSession, ...prev]);
  };

  // Delete a recorded study session and revert topic hours/completion
  const handleDeleteStudySession = (sessionId) => {
    const session = studySessions.find(s => s.id === sessionId);
    if (!session) return;

    setTopics(prev => prev.map(t => {
      if (t.id === session.topicId) {
        const currentEff = Number(t.oreEffettive || 0);
        const revertedEff = Math.max(0, Number((currentEff - session.hours).toFixed(2)));
        const otherCompletedSession = studySessions.some(s => s.id !== sessionId && s.topicId === session.topicId && s.completed);
        const stillDone = otherCompletedSession;
        return {
          ...t,
          oreEffettive: revertedEff,
          completato: stillDone,
          isCompleted: stillDone,
          completedDate: stillDone ? t.completedDate : null
        };
      }
      return t;
    }));

    setStudySessions(prev => prev.filter(s => s.id !== sessionId));
  };

  // Toggle completion of a single topic with automatic timestamp
  const handleToggleComplete = (topicId) => {
    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          const isDone = Boolean(t.completato !== undefined ? t.completato : t.isCompleted);
          const willComplete = !isDone;
          const currentEff = Number(t.oreEffettive || 0);
          return {
            ...t,
            completato: willComplete,
            isCompleted: willComplete,
            completedDate: willComplete ? (t.completedDate || settings.currentSimulatedDate) : null,
            // If marking completed and had 0 hours logged, defaults to oreStimate; else preserves accumulated hours
            oreEffettive: willComplete && currentEff === 0 ? Number(t.oreStimate || 2.0) : currentEff
          };
        }
        return t;
      })
    );
  };

  // Granular Partial Progress: Add or set hours spent on a topic without completing it
  const handleUpdateTopicHours = (topicId, deltaOrNewHours, isDelta = true) => {
    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          const cur = Number(t.oreEffettive || 0);
          const nextVal = isDelta
            ? Math.max(0, Number((cur + deltaOrNewHours).toFixed(2)))
            : Math.max(0, Number(Number(deltaOrNewHours).toFixed(2)));
          return {
            ...t,
            oreEffettive: nextVal
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
      <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-6 lg:px-8 2xl:px-12 py-3.5 shadow-md">
        <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between gap-4">
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
            {/* Quick Log Studio Action (+) */}
            <button
              type="button"
              onClick={() => handleOpenLogModal({ date: settings.currentSimulatedDate })}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-emerald-500/20 border border-emerald-400/40 transition transform active:scale-95 flex-shrink-0"
              title="Registra ore di studio svolte (+)"
            >
              <span className="text-base font-black leading-none">+</span>
              <span className="hidden sm:inline">Registra Studio</span>
            </button>

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

            {/* GitLab Cloud Sync status badge if configured */}
            {gitlabConfig?.enabled && (
              <button
                type="button"
                onClick={() => setActiveTab("import")}
                className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono border transition ${
                  gitlabConfig.syncStatus === "syncing"
                    ? "bg-orange-950/80 border-orange-500/40 text-orange-300"
                    : gitlabConfig.syncStatus === "error"
                    ? "bg-rose-950/80 border-rose-500/40 text-rose-300"
                    : "bg-orange-950/50 hover:bg-orange-900/60 border-orange-500/30 text-orange-200"
                }`}
                title={`GitLab Cloud Sync: ${gitlabConfig.syncStatus === 'syncing' ? 'Sincronizzazione in corso...' : gitlabConfig.lastSynced ? 'Ultimo sync: ' + gitlabConfig.lastSynced : 'Attiva'}. Clicca per gestire.`}
              >
                <IconGitLab className={`w-3.5 h-3.5 text-orange-400 ${gitlabConfig.syncStatus === "syncing" ? "animate-spin" : ""}`} />
                <span className="truncate max-w-[120px] font-bold">
                  {gitlabConfig.syncStatus === "syncing" ? "GitLab..." : gitlabConfig.lastSynced ? `GitLab: ${gitlabConfig.lastSynced}` : "GitLab"}
                </span>
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

              {settings.currentSimulatedDate !== getLocalTodayDateStr() && (
                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, currentSimulatedDate: getLocalTodayDateStr() }))}
                  className="ml-1 px-1.5 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-sans font-bold border border-cyan-500/40 transition"
                  title={`Reimposta sulla data reale odierna (${formatDateDisplay(getLocalTodayDateStr())})`}
                >
                  Oggi Reale
                </button>
              )}
            </div>

            {/* Countdown pill */}
            <div className="hidden md:flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-mono">
              <IconClock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-white">{metrics.remainingDays} gg</span>
            </div>

            {/* PWA Install Button (active when accessed via browser) */}
            {!isStandalone && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold px-2.5 py-1.5 rounded-xl text-xs shadow-md shadow-cyan-500/20 border border-cyan-400/30 transition transform active:scale-95"
                title="Installa StudiPlanner come app desktop nativa su Windows tramite Chrome o Edge"
              >
                <svg className="w-3.5 h-3.5 text-cyan-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">Installa PWA</span>
              </button>
            )}

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
      <main className="flex-1 w-full max-w-[1920px] mx-auto p-4 md:p-6 lg:p-8 2xl:px-12 space-y-6 pb-24 md:pb-12">
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
            onOpenLogModal={handleOpenLogModal}
          />
        )}

        {activeTab === "weekly" && (
          <WeeklyTodo
            weeklyPlans={weeklyPlans}
            onToggleComplete={handleToggleComplete}
            onUpdateTopicHours={handleUpdateTopicHours}
            settings={settings}
            customDayCapacities={customDayCapacities}
            onUpdateDayCapacity={handleUpdateDayCapacity}
            onOpenLogModal={handleOpenLogModal}
            onOpenTopicDetail={handleOpenTopicDetail}
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
            onOpenLogModal={handleOpenLogModal}
            onDeleteSession={handleDeleteStudySession}
            onOpenTopicDetail={handleOpenTopicDetail}
          />
        )}

        {activeTab === "topics" && (
          <TopicsTable
            topics={topics}
            onToggleComplete={handleToggleComplete}
            onUpdateTopicHours={handleUpdateTopicHours}
            onBatchUpdate={handleTopicsUpdated}
            onOpenTopicDetail={handleOpenTopicDetail}
          />
        )}

        {activeTab === "import" && (
          <FileImporter
            topics={topics}
            settings={settings}
            customDayCapacities={customDayCapacities}
            onCustomCapacitiesUpdated={(newCapacities) => setCustomDayCapacities(newCapacities)}
            onTopicsUpdated={handleTopicsUpdated}
            onSettingsUpdated={(newSettings) => setSettings(newSettings)}
            studySessions={studySessions}
            onStudySessionsUpdated={(newSessions) => setStudySessions(newSessions)}
            fsSyncStatus={fsSyncStatus}
            onConnectFileSystem={handleConnectFileSystem}
            onDisconnectFileSystem={handleDisconnectFileSystem}
            onTriggerManualSave={handleTriggerManualSave}
            gitlabConfig={gitlabConfig}
            onUpdateGitLabConfig={(newConfig) => setGitlabConfig(newConfig)}
            onGitLabPull={handleGitLabPull}
            onGitLabPush={handleGitLabPush}
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

        {/* Center Mobile Quick Log Button (+) */}
        <button
          type="button"
          onClick={() => handleOpenLogModal({ date: settings.currentSimulatedDate })}
          className="flex flex-col items-center py-0.5 px-2 rounded-xl transition text-emerald-400 -mt-3"
          title="Registra Sessione di Studio (+)"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 border-2 border-[#070b14] active:scale-95 transition">
            <span className="text-xl font-black leading-none">+</span>
          </div>
          <span className="text-[10px] mt-0.5 font-bold">Studio</span>
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
        customDayCapacities={customDayCapacities}
        onResetDayCapacities={handleResetDayCapacities}
      />

      {/* Log Study Modal (+) */}
      <LogStudyModal
        isOpen={isLogModalOpen}
        onClose={handleCloseLogModal}
        topics={topics}
        settings={settings}
        initialData={logModalInitialData}
        onSaveSession={handleLogStudySession}
        studySessions={studySessions}
        onDeleteSession={handleDeleteStudySession}
      />

      {/* Topic Detail Sheet Modal */}
      <TopicDetailModal
        isOpen={Boolean(selectedTopicDetail)}
        onClose={handleCloseTopicDetail}
        topic={selectedTopicDetail}
        onToggleComplete={handleToggleComplete}
        onOpenLogModal={handleOpenLogModal}
        studySessions={studySessions}
      />

      {/* CLARKE-9000 Isolated Side Companion */}
      <Clarke9000Companion
        progress={progress}
        metrics={metrics}
      />
    </div>
  );
}
