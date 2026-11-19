import React, { useState, useEffect, useMemo, useRef } from "react";
import { INITIAL_TOPICS } from "./data/defaultData.js";
import { rebalanceStudyPlan, DEFAULT_SETTINGS, getLocalTodayDateStr, clampDayCapacity, normalizeExercises } from "./services/rebalancerEngine.js";
import { applySessionToTopic, revertSessionFromTopic, restoreOfficialNotes, stampChangedTopics } from "./services/topicStateService.js";
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
import { MathFormulaDrawer } from "./components/MathFormulaDrawer.js";
import { PdfSplitView } from "./components/PdfSplitView.js";
import { WeeklyRetrospectiveModal } from "./components/WeeklyRetrospectiveModal.js";
import { MathBugTracker, DEFAULT_MATH_BUGS } from "./components/MathBugTracker.js";
import {
  LOCAL_STORAGE_KEY_GITLAB_CONFIG,
  DEFAULT_GITLAB_CONFIG,
  pullFromGitLab,
  mergeStudyPlannerStates,
  syncWithGitLab,
  stableStringify
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
  IconGitLab,
  IconChevronLeft,
  IconChevronRight,
  IconBug,
  IconCloud,
  IconDownload
} from "./components/Icons.js";

// Data reale odierna limitata all'intervallo della sessione configurata
const todayForSettings = (s) => getLocalTodayDateStr(s && s.roadmapStartDate, s && s.targetExamDate);

const LOCAL_STORAGE_KEY_TOPICS = "unimore_rebalancer_topics_v2";
const LOCAL_STORAGE_KEY_SETTINGS = "unimore_rebalancer_settings_v2";
const LOCAL_STORAGE_KEY_CUSTOM_CAPACITIES = "unimore_rebalancer_custom_capacities_v2";
const LOCAL_STORAGE_KEY_SESSIONS = "unimore_rebalancer_sessions_v2";
const LOCAL_STORAGE_KEY_DELETED_SESSIONS = "unimore_rebalancer_deleted_sessions_v1";
const LOCAL_STORAGE_KEY_SYNC_META = "unimore_rebalancer_sync_meta_v1";
const LOCAL_STORAGE_KEY_MOCK_EXAMS = "unimore_rebalancer_mock_exams_v1";
const LOCAL_STORAGE_KEY_DELETED_MOCK_EXAMS = "unimore_rebalancer_deleted_mock_exams_v1";

const loadJson = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn(`Could not load ${key} from localStorage`, e);
  }
  return fallback;
};
const persistJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to persist ${key}`, e);
  }
};

// Chiave di confronto delle impostazioni ai fini del sync (la data simulata è locale)
const settingsSyncKey = (s) => {
  const { currentSimulatedDate, ...rest } = s || {};
  return stableStringify(rest);
};
const isGitLabReady = (cfg) => Boolean(cfg && cfg.enabled && cfg.token && cfg.projectId);
const nowTimeLabel = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const GITLAB_FOCUS_SYNC_THROTTLE_MS = 30000;

// Voci di navigazione: etichetta completa (sidebar) e breve (tab bar iOS), colore dell'icona di sistema
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", short: "Oggi", Icon: IconBarChart, color: "#0071E3" },
  { id: "weekly", label: "To-Do Settimanale", short: "Settimana", Icon: IconCalendar, color: "#FF3B30" },
  { id: "history", label: "Storico & Diario", short: "Storico", Icon: IconHistory, color: "#AF52DE" },
  { id: "topics", label: "Catalogo Argomenti", short: "Catalogo", Icon: IconLayers, color: "#34C759" },
  { id: "import", label: "Import / Sync", short: "Sync", Icon: IconUpload, color: "#8E8E93" }
];

// Titoli grandi delle schede (la Dashboard ha la propria intestazione con la data)
const PAGE_HEADINGS = {
  weekly: { eyebrow: "Piano sera per sera", title: "Settimana" },
  history: { eyebrow: "Cosa hai fatto e cosa è slittato", title: "Storico" },
  topics: { eyebrow: "Analisi I e Geometria", title: "Catalogo argomenti" },
  import: { eyebrow: "Backup, file e GitLab", title: "Importa e sincronizza" }
};

export function App() {
  // Load saved state from localStorage if available, or use official UNIMORE defaults
  // Ensures granular partial progress: oreEffettive (float) and completato (boolean)
  const [topics, setTopicsRaw] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TOPICS);
      if (saved) {
        const parsed = restoreOfficialNotes(JSON.parse(saved), INITIAL_TOPICS);
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
    let todayStr = getLocalTodayDateStr();
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        todayStr = todayForSettings(parsed);
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

  // Ogni modifica dell'utente agli argomenti viene marcata con updatedAt (per il sync).
  // Lo stato fuso proveniente da GitLab usa invece setTopicsRaw e non viene rimarcato.
  const setTopics = (updater) => {
    setTopicsRaw(prev => stampChangedTopics(prev, typeof updater === "function" ? updater(prev) : updater));
  };

  // ID delle sessioni cancellate: impediscono che il sync le faccia ricomparire
  const [deletedSessionIds, setDeletedSessionIds] = useState(() => loadJson(LOCAL_STORAGE_KEY_DELETED_SESSIONS, []));
  // Data dell'ultima modifica di impostazioni, Time Shifter e bug tracker (per il sync)
  const [syncMeta, setSyncMeta] = useState(() => loadJson(LOCAL_STORAGE_KEY_SYNC_META, {}));
  useEffect(() => { persistJson(LOCAL_STORAGE_KEY_DELETED_SESSIONS, deletedSessionIds); }, [deletedSessionIds]);
  useEffect(() => { persistJson(LOCAL_STORAGE_KEY_SYNC_META, syncMeta); }, [syncMeta]);

  // Temi d'esame a tempo (sincronizzati come le sessioni, con tombstone)
  const [mockExams, setMockExams] = useState(() => loadJson(LOCAL_STORAGE_KEY_MOCK_EXAMS, []));
  const [deletedMockExamIds, setDeletedMockExamIds] = useState(() => loadJson(LOCAL_STORAGE_KEY_DELETED_MOCK_EXAMS, []));
  useEffect(() => { persistJson(LOCAL_STORAGE_KEY_MOCK_EXAMS, mockExams); }, [mockExams]);
  useEffect(() => { persistJson(LOCAL_STORAGE_KEY_DELETED_MOCK_EXAMS, deletedMockExamIds); }, [deletedMockExamIds]);
  const handleSaveMockExam = (exam) => {
    setMockExams(prev => [exam, ...prev.filter(e => e.id !== exam.id)]);
  };
  const handleDeleteMockExam = (examId) => {
    setMockExams(prev => prev.filter(e => e.id !== examId));
    setDeletedMockExamIds(prev => (prev.includes(examId) ? prev : [...prev, examId]));
  };

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logModalInitialData, setLogModalInitialData] = useState({});
  const [selectedTopicDetail, setSelectedTopicDetail] = useState(null);

  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "weekly" | "history" | "topics" | "import"
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBugTrackerOpen, setIsBugTrackerOpen] = useState(false);
  const [isFormulaDrawerOpen, setIsFormulaDrawerOpen] = useState(false);
  const [isPdfSplitOpen, setIsPdfSplitOpen] = useState(false);
  const [isRetroModalOpen, setIsRetroModalOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState("");

  // Global keyboard shortcuts (e.g. F2 for Math Formula Drawer)
  useEffect(() => {
    const handleGlobalShortcuts = (e) => {
      if (e.key === "F2") {
        e.preventDefault();
        setIsFormulaDrawerOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalShortcuts);
    return () => window.removeEventListener("keydown", handleGlobalShortcuts);
  }, []);

  // Mathematical recurring error tracker (Bug Tracker)
  const [mathBugs, setMathBugs] = useState(() => {
    try {
      const saved = localStorage.getItem("unimore_rebalancer_math_bugs_v1");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load mathBugs from localStorage", e);
    }
    return DEFAULT_MATH_BUGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem("unimore_rebalancer_math_bugs_v1", JSON.stringify(mathBugs));
    } catch (e) {
      console.warn("Failed to persist mathBugs", e);
    }
  }, [mathBugs]);

  // Marca in syncMeta l'ora dell'ultima modifica locale di ogni sezione sincronizzata.
  // Le modifiche arrivate dal sync (remoteAppliedRef) non vengono marcate.
  const sectionKeys = () => ({
    settingsUpdatedAt: settingsSyncKey(settings),
    capacitiesUpdatedAt: stableStringify(customDayCapacities),
    mathBugsUpdatedAt: stableStringify(mathBugs)
  });
  const lastSectionKeysRef = useRef(null);
  if (lastSectionKeysRef.current === null) lastSectionKeysRef.current = sectionKeys();
  const remoteAppliedRef = useRef({});
  useEffect(() => {
    const current = sectionKeys();
    const bumped = {};
    Object.keys(current).forEach(metaKey => {
      if (current[metaKey] === lastSectionKeysRef.current[metaKey]) return;
      if (remoteAppliedRef.current[metaKey] !== current[metaKey]) bumped[metaKey] = Date.now();
      delete remoteAppliedRef.current[metaKey];
      lastSectionKeysRef.current[metaKey] = current[metaKey];
    });
    if (Object.keys(bumped).length > 0) setSyncMeta(prev => ({ ...prev, ...bumped }));
  }, [settings, customDayCapacities, mathBugs]);

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
      setSettings(prev => {
        const todayStr = todayForSettings(prev);
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
          studySessions,
          mockExams
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
  }, [topics, settings, customDayCapacities, studySessions, mockExams, fileHandle]);

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
          if (Array.isArray(backup.mockExams)) {
            setMockExams(backup.mockExams);
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
          studySessions,
          mockExams
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
        studySessions,
        mockExams
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

  // ---- GitLab Cloud Sync -------------------------------------------------------
  // Ogni sincronizzazione legge il file remoto, lo fonde con lo stato locale e scrive
  // solo se serve, con controllo di concorrenza (last_commit_id): più dispositivi
  // aperti contemporaneamente non si sovrascrivono a vicenda.
  const latestSyncStateRef = useRef(null);
  latestSyncStateRef.current = { topics, settings, customDayCapacities, studySessions, deletedSessionIds, mathBugs, mockExams, deletedMockExamIds, syncMeta };
  const gitlabConfigRef = useRef(gitlabConfig);
  gitlabConfigRef.current = gitlabConfig;
  const syncInFlightRef = useRef(false);
  const syncPendingRef = useRef(false);
  const lastSyncAtRef = useRef(0);

  // Applica lo stato fuso solo per le parti che cambiano davvero (niente render/commit inutili)
  const applyMergedState = (merged) => {
    const cur = latestSyncStateRef.current;
    const differs = (a, b) => stableStringify(a) !== stableStringify(b);
    if (Array.isArray(merged.topics) && merged.topics.length > 0 && differs(merged.topics, cur.topics)) {
      setTopicsRaw(merged.topics);
    }
    if (Array.isArray(merged.studySessions) && differs(merged.studySessions, cur.studySessions)) {
      setStudySessions(merged.studySessions);
    }
    if (Array.isArray(merged.deletedSessionIds) && differs(merged.deletedSessionIds, cur.deletedSessionIds)) {
      setDeletedSessionIds(merged.deletedSessionIds);
    }
    if (merged.customDayCapacities && differs(merged.customDayCapacities, cur.customDayCapacities)) {
      remoteAppliedRef.current.capacitiesUpdatedAt = stableStringify(merged.customDayCapacities);
      setCustomDayCapacities(merged.customDayCapacities);
    }
    if (merged.settings) {
      const nextSettings = { ...cur.settings, ...merged.settings, currentSimulatedDate: cur.settings.currentSimulatedDate };
      if (settingsSyncKey(nextSettings) !== settingsSyncKey(cur.settings)) {
        remoteAppliedRef.current.settingsUpdatedAt = settingsSyncKey(nextSettings);
        setSettings(nextSettings);
      }
    }
    if (Array.isArray(merged.mathBugs) && differs(merged.mathBugs, cur.mathBugs)) {
      remoteAppliedRef.current.mathBugsUpdatedAt = stableStringify(merged.mathBugs);
      setMathBugs(merged.mathBugs);
    }
    if (Array.isArray(merged.mockExams) && differs(merged.mockExams, cur.mockExams)) {
      setMockExams(merged.mockExams);
    }
    if (Array.isArray(merged.deletedMockExamIds) && differs(merged.deletedMockExamIds, cur.deletedMockExamIds)) {
      setDeletedMockExamIds(merged.deletedMockExamIds);
    }
    if (merged.syncMeta && differs(merged.syncMeta, cur.syncMeta)) {
      setSyncMeta(merged.syncMeta);
    }
  };

  const runGitLabSync = async ({ pushChanges = true, commitMessage = "", manual = false } = {}) => {
    const cfg = gitlabConfigRef.current;
    if (manual && !(cfg && cfg.token && cfg.projectId)) {
      throw new Error("Configurazione GitLab incompleta: inserisci progetto e token.");
    }
    if (!manual && !isGitLabReady(cfg)) return { skipped: true };
    if (syncInFlightRef.current) {
      syncPendingRef.current = true;
      return { busy: true };
    }
    syncInFlightRef.current = true;
    lastSyncAtRef.current = Date.now();
    setGitlabConfig(prev => ({ ...prev, syncStatus: "syncing", errorMessage: null }));
    try {
      const snapshot = latestSyncStateRef.current;
      let merged;
      let info;
      if (pushChanges) {
        info = await syncWithGitLab(cfg, snapshot, commitMessage);
        merged = info.merged;
      } else {
        const res = await pullFromGitLab(cfg);
        if (!res.data) {
          setGitlabConfig(prev => ({ ...prev, syncStatus: "idle" }));
          return { notFound: true, message: res.message };
        }
        merged = mergeStudyPlannerStates(snapshot, res.data);
        info = { pushed: false, commitId: res.lastCommitId || res.commitId };
      }
      // Rifonde con lo stato più recente: eventuali modifiche fatte durante la
      // richiesta di rete non vanno perse (e verranno inviate dal sync successivo).
      applyMergedState(mergeStudyPlannerStates(latestSyncStateRef.current, merged));
      setGitlabConfig(prev => ({
        ...prev,
        syncStatus: "success",
        lastSynced: info.timestamp || nowTimeLabel(),
        lastCommitId: info.commitId || prev.lastCommitId,
        errorMessage: null
      }));
      return info;
    } catch (err) {
      console.warn("GitLab sync error:", err);
      setGitlabConfig(prev => ({ ...prev, syncStatus: "error", errorMessage: err.message }));
      throw err;
    } finally {
      syncInFlightRef.current = false;
      if (syncPendingRef.current) {
        syncPendingRef.current = false;
        runGitLabSync().catch(() => {});
      }
    }
  };

  // 1. Sync iniziale all'apertura dell'app
  useEffect(() => {
    if (!gitlabConfig?.autoSync) return;
    runGitLabSync().catch(() => {});
  }, []);

  // 2. Sync automatico (debounce 2.5s) a ogni modifica dei dati sincronizzati
  const isGitLabMountRef = useRef(true);
  useEffect(() => {
    if (isGitLabMountRef.current) {
      isGitLabMountRef.current = false;
      return;
    }
    if (!gitlabConfig?.autoSync || !isGitLabReady(gitlabConfig)) return;
    const timer = setTimeout(() => { runGitLabSync().catch(() => {}); }, 2500);
    return () => clearTimeout(timer);
  }, [topics, settingsSyncKey(settings), customDayCapacities, studySessions, deletedSessionIds, mathBugs, mockExams, deletedMockExamIds, gitlabConfig?.enabled, gitlabConfig?.autoSync]);

  // 3. Rientrando nell'app (focus/scheda visibile) si scaricano le modifiche degli altri dispositivi
  useEffect(() => {
    const onReturn = () => {
      if (document.visibilityState === "hidden") return;
      const cfg = gitlabConfigRef.current;
      if (!cfg?.autoSync || !isGitLabReady(cfg)) return;
      if (Date.now() - lastSyncAtRef.current < GITLAB_FOCUS_SYNC_THROTTLE_MS) return;
      runGitLabSync().catch(() => {});
    };
    window.addEventListener("focus", onReturn);
    document.addEventListener("visibilitychange", onReturn);
    return () => {
      window.removeEventListener("focus", onReturn);
      document.removeEventListener("visibilitychange", onReturn);
    };
  }, []);

  // 4. Pull & Push manuali
  const handleGitLabPull = async () => {
    const res = await runGitLabSync({ pushChanges: false, manual: true });
    if (res.busy) return { success: false, message: "Sincronizzazione già in corso, riprova tra qualche secondo." };
    if (res.notFound) return { success: false, message: res.message || "Nessun file trovato nel repo." };
    return { success: true, message: "Dati scaricati e fusi intelligentemente con successo da GitLab!" };
  };

  const handleGitLabPush = async (customMsg) => {
    const res = await runGitLabSync({ commitMessage: customMsg, manual: true });
    if (res.busy) return { success: false, message: "Sincronizzazione già in corso, riprova tra qualche secondo." };
    if (res.pushed === false) return { success: true, message: "GitLab è già allineato: nessun commit necessario." };
    return { success: true, message: "Nuovo commit inviato con successo su GitLab (dopo la fusione con i dati remoti)!" };
  };

  // Dynamic Daily Capacity Override (Time Shifter) Handlers
  const handleUpdateDayCapacity = (dateStr, newHours) => {
    setCustomDayCapacities(prev => {
      const updated = { ...prev };
      if (newHours === null || newHours === undefined) {
        delete updated[dateStr];
      } else {
        updated[dateStr] = clampDayCapacity(newHours);
      }
      return updated;
    });
  };

  const handleBatchUpdateDayCapacities = (capacitiesMap) => {
    setCustomDayCapacities(prev => {
      const updated = { ...prev };
      Object.entries(capacitiesMap).forEach(([dateStr, hours]) => {
        if (hours === null || hours === undefined) {
          delete updated[dateStr];
        } else {
          updated[dateStr] = clampDayCapacity(hours);
        }
      });
      return updated;
    });
  };

  const handleResetDayCapacities = () => {
    setCustomDayCapacities({});
  };

  // Reactive Rebalancing calculation
  const rebalancedPlan = useMemo(() => {
    return rebalanceStudyPlan(topics, settings, customDayCapacities, studySessions, mockExams);
  }, [topics, settings, customDayCapacities, studySessions, mockExams]);

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
  const handleLogStudySession = ({ topicId, date, hours, completed, note, exercises, confidence }) => {
    const numHours = Number(hours) || 0;
    const sessionDate = date || settings.currentSimulatedDate;
    const newSession = {
      id: "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
      topicId,
      date: sessionDate,
      hours: numHours,
      completed: Boolean(completed),
      note: note || "",
      // Esiti degli esercizi senza appunti e fiducia: alimentano la padronanza
      ...(normalizeExercises(exercises) ? { exercises: normalizeExercises(exercises) } : {}),
      ...(Number(confidence) >= 1 && Number(confidence) <= 5 ? { confidence: Number(confidence) } : {}),
      timestamp: new Date().toISOString()
    };

    // Registrare una sessione non toglie mai il completamento (vedi topicStateService)
    setTopics(prev => prev.map(t => (
      t.id === topicId ? applySessionToTopic(t, { hours: numHours, completed, date: sessionDate }) : t
    )));

    setStudySessions(prev => [newSession, ...prev]);
  };

  // Delete a recorded study session and revert topic hours/completion
  const handleDeleteStudySession = (sessionId) => {
    const session = studySessions.find(s => s.id === sessionId);
    if (!session) return;

    setTopics(prev => prev.map(t => (
      t.id === session.topicId ? revertSessionFromTopic(t, session, studySessions) : t
    )));

    setStudySessions(prev => prev.filter(s => s.id !== sessionId));
    setDeletedSessionIds(prev => (prev.includes(sessionId) ? prev : [...prev, sessionId]));
  };

  // Toggle completion of a single topic with automatic timestamp
  const handleToggleComplete = (topicId) => {
    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          const isDone = Boolean(t.completato !== undefined ? t.completato : t.isCompleted);
          const willComplete = !isDone;
          const currentEff = Number(t.oreEffettive || 0);
          if (willComplete) {
            // Se si spunta senza ore registrate, si assume svolta la stima: la quota
            // "presunta" viene ricordata in autoFilledHours per poterla annullare.
            const autoFilled = currentEff === 0 ? Number(t.oreStimate || 2.0) : 0;
            return {
              ...t,
              completato: true,
              isCompleted: true,
              completedDate: t.completedDate || settings.currentSimulatedDate,
              oreEffettive: Number((currentEff + autoFilled).toFixed(2)),
              autoFilledHours: autoFilled
            };
          }
          // Togliendo la spunta si rimuovono le ore presunte aggiunte al completamento,
          // così l'argomento torna nel piano con le sue ore residue reali.
          const autoFilled = Number(t.autoFilledHours || 0);
          return {
            ...t,
            completato: false,
            isCompleted: false,
            completedDate: null,
            oreEffettive: Math.max(0, Number((currentEff - autoFilled).toFixed(2))),
            autoFilledHours: 0
          };
        }
        return t;
      })
    );
  };

  // Completa un argomento senza invertire lo stato (idempotente): usato dal Pomodoro
  const handleMarkTopicCompleted = (topicId) => {
    setTopics(prev => prev.map(t => {
      if (t.id !== topicId) return t;
      if (Boolean(t.completato !== undefined ? t.completato : t.isCompleted)) return t;
      return { ...t, completato: true, isCompleted: true, completedDate: t.completedDate || settings.currentSimulatedDate };
    }));
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

  // Spaced Repetition: Toggle review level completion (r1, r2, r3)
  // Con l'esito (good | partial | failed) il ripasso successivo si ricalcola dalla data
  // di oggi: allungato, accorciato o riportato a +3 giorni.
  const handleToggleSpacedReview = (topicId, levelKey, isDone, outcome = "good") => {
    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          const curReviews = t.spacedReviews || {};
          return {
            ...t,
            spacedReviews: {
              ...curReviews,
              [levelKey]: isDone
                ? { done: true, outcome: outcome || "good", date: settings.currentSimulatedDate }
                : false
            }
          };
        }
        return t;
      })
    );
  };

  // Granular Topic Field Update (e.g. Feynman checklist, notes, bug logs)
  const handleTopicUpdate = (topicId, updates) => {
    setTopics(prev => prev.map(t => (t.id === topicId ? { ...t, ...updates } : t)));
    if (selectedTopicDetail && selectedTopicDetail.id === topicId) {
      setSelectedTopicDetail(prev => (prev ? { ...prev, ...updates } : null));
    }
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

  const renderTabBarItem = (item) => {
    const active = activeTab === item.id;
    const ItemIcon = item.Icon;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => setActiveTab(item.id)}
        aria-current={active ? "page" : undefined}
        className={`flex flex-col items-center gap-0.5 py-1 transition ${active ? "text-accent" : "text-[#8E8E93]"}`}
      >
        <ItemIcon className="w-6 h-6" />
        <span className="text-[10px] font-medium">{item.short}</span>
      </button>
    );
  };

  const isSimulatingDate = settings.currentSimulatedDate !== todayForSettings(settings);
  const resetToRealToday = () => setSettings(prev => ({ ...prev, currentSimulatedDate: todayForSettings(prev) }));

  // Stato della sincronizzazione mostrato in fondo alla sidebar
  const syncSummary = (() => {
    if (gitlabConfig?.enabled) {
      if (gitlabConfig.syncStatus === "syncing") return { title: "Sincronizzazione…", detail: "GitLab", color: "#0071E3", spin: true };
      if (gitlabConfig.syncStatus === "error") return { title: "Errore di sincronizzazione", detail: "GitLab · tocca per i dettagli", color: "#FF3B30" };
      return { title: "Sincronizzato", detail: gitlabConfig.lastSynced ? `GitLab · ${gitlabConfig.lastSynced}` : "GitLab · attivo", color: "#34C759" };
    }
    if (fsSyncStatus.active) {
      return { title: "File collegato", detail: `${fsSyncStatus.fileName}${fsSyncStatus.lastSaved ? " · " + fsSyncStatus.lastSaved : ""}`, color: "#34C759" };
    }
    return { title: "Solo su questo dispositivo", detail: "Configura GitLab o un file", color: "#8E8E93" };
  })();

  const navMeta = {
    topics: `${progress.global.completedCount}/${progress.global.totalCount}`
  };

  const toolButtonClass = "flex items-center gap-2.5 h-8 px-2 rounded-lg text-[13px] text-ink text-left hover:bg-black/[0.04] transition";

  return (
    <div className="min-h-screen bg-canvas text-ink flex font-sans">
      {/* Sidebar macOS (desktop) */}
      <aside className="hidden lg:flex flex-col w-[248px] shrink-0 sticky top-0 h-screen bg-sidebar border-r border-black/10 px-3 pt-4 pb-3 gap-5 overflow-y-auto">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-[9px] bg-accent flex items-center justify-center text-paper shadow-seg">
            <IconBookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[15px] font-semibold tracking-tight text-ink leading-tight">StudiPlanner</h1>
            <p className="text-[11px] text-ink-2 truncate">UNIMORE · Ingegneria</p>
          </div>
        </div>

        <nav aria-label="Sezioni" className="flex flex-col gap-0.5">
          <span className="text-[11px] font-semibold text-ink-2 px-2 pb-1.5">StudiPlanner</span>
          {NAV_ITEMS.map(item => {
            const active = activeTab === item.id;
            const ItemIcon = item.Icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 h-[34px] px-2 rounded-lg text-[13px] font-medium text-left text-ink transition ${
                  active ? "bg-black/[0.07]" : "hover:bg-black/[0.04]"
                }`}
              >
                <span className="w-[22px] h-[22px] rounded-md flex items-center justify-center text-paper shrink-0" style={{ background: item.color }}>
                  <ItemIcon className="w-3.5 h-3.5" />
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {navMeta[item.id] && <span className="text-xs text-ink-2 tabular">{navMeta[item.id]}</span>}
              </button>
            );
          })}
        </nav>

        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-semibold text-ink-2 px-2 pb-1.5">Materie</span>
          {[
            { key: "analisi", label: "Analisi I", color: "#5E5CE6" },
            { key: "geometria", label: "Geometria", color: "#0A9396" }
          ].map(s => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActiveTab("topics")}
              className="flex items-center gap-2.5 h-8 px-2 rounded-lg text-[13px] text-ink text-left hover:bg-black/[0.04] transition"
            >
              <span className="w-2.5 h-2.5 rounded-full mx-1.5 shrink-0" style={{ background: s.color }}></span>
              <span className="flex-1">{s.label}</span>
              <span className="text-xs text-ink-2 tabular">{progress[s.key].completedCount}/{progress[s.key].totalCount}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-semibold text-ink-2 px-2 pb-1.5">Strumenti</span>
          <button type="button" onClick={() => setIsFormulaDrawerOpen(true)} className={toolButtonClass} title="Apri il Formulario Rapido (Tasto F2)">
            <span className="w-[22px] text-center text-ink-2 font-semibold text-[13px]">∑</span>
            <span className="flex-1">Formulario</span>
            <kbd className="text-[11px] text-ink-2 font-sans">F2</kbd>
          </button>
          <button
            type="button"
            onClick={() => setIsPdfSplitOpen(prev => !prev)}
            className={toolButtonClass}
            aria-pressed={isPdfSplitOpen}
            title="Attiva/disattiva il visualizzatore affiancato di dispense PDF ed eserciziari (Split View)"
          >
            <IconBookOpen className="w-[22px] h-4 text-ink-2" />
            <span className="flex-1">Dispense affiancate</span>
            <span className={`w-7 h-4 rounded-full p-0.5 transition ${isPdfSplitOpen ? "bg-ok" : "bg-black/15"}`}>
              <span className={`block w-3 h-3 rounded-full bg-paper shadow-seg transition ${isPdfSplitOpen ? "translate-x-3" : ""}`}></span>
            </span>
          </button>
          <button type="button" onClick={() => setIsBugTrackerOpen(true)} className={toolButtonClass} title="Apri il registro degli errori ricorrenti">
            <IconBug className="w-[22px] h-4 text-ink-2" />
            <span className="flex-1">Errori ricorrenti</span>
          </button>
          <button type="button" onClick={() => setIsSettingsOpen(true)} className={toolButtonClass} title="Parametri di Ribilanciamento">
            <IconSettings className="w-[22px] h-4 text-ink-2" />
            <span className="flex-1">Impostazioni</span>
          </button>
          {!isStandalone && (
            <button type="button" onClick={handleInstallClick} className={toolButtonClass} title="Installa StudiPlanner come app desktop nativa tramite Chrome o Edge">
              <IconDownload className="w-[22px] h-4 text-ink-2" />
              <span className="flex-1">Installa app</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setActiveTab("import")}
          className="mt-auto flex items-center gap-2.5 px-2 pt-3 pb-1 border-t border-black/10 text-left"
          title="Gestisci la sincronizzazione"
        >
          <span className={`shrink-0 ${syncSummary.spin ? "animate-pulse" : ""}`} style={{ color: syncSummary.color }}>
            <IconCloud className="w-4 h-4" />
          </span>
          <span className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-ink truncate">{syncSummary.title}</span>
            <span className="text-[11px] text-ink-2 truncate">{syncSummary.detail}</span>
          </span>
        </button>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Barra strumenti */}
        <header className="sticky top-0 z-30 vibrancy border-b border-black/[0.08]">
          <div className="h-[52px] px-4 md:px-6 flex items-center gap-2.5">
            <div className="lg:hidden flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-paper shrink-0">
                <IconBookOpen className="w-3.5 h-3.5" />
              </div>
              <span className="text-[15px] font-semibold tracking-tight truncate hidden min-[400px]:inline">StudiPlanner</span>
            </div>

            <div className="flex-1" />

            <span className="hidden md:inline text-[13px] text-ink-2 tabular" title="Giorni che mancano all'esame">
              <span className="font-semibold text-ink">{metrics.remainingDays}</span> giorni all'esame
            </span>

            <div className="flex items-center bg-fill rounded-lg p-0.5">
              <button
                type="button"
                onClick={handleRetrocedeDate}
                className="w-8 h-7 rounded-md flex items-center justify-center text-ink hover:bg-black/[0.05] transition"
                title="Giorno precedente"
                aria-label="Giorno precedente"
              >
                <IconChevronLeft className="w-4 h-4" />
              </button>
              <span className="h-7 px-3 rounded-md bg-paper shadow-seg text-xs font-semibold flex items-center tabular whitespace-nowrap">
                Oggi: {formatDateDisplay(settings.currentSimulatedDate)}
              </span>
              <button
                type="button"
                onClick={handleAdvanceDate}
                className="w-8 h-7 rounded-md flex items-center justify-center text-ink hover:bg-black/[0.05] transition"
                title="Giorno successivo (simula giorno saltato o avanzamento)"
                aria-label="Giorno successivo"
              >
                <IconChevronRight className="w-4 h-4" />
              </button>
            </div>

            {isSimulatingDate && (
              <button
                type="button"
                onClick={resetToRealToday}
                className="h-7 px-3 rounded-full bg-accent-tint text-accent-ink text-xs font-semibold hover:brightness-95 transition whitespace-nowrap"
                title={`Reimposta sulla data reale odierna (${formatDateDisplay(todayForSettings(settings))})`}
              >
                Oggi Reale
              </button>
            )}

            <button
              type="button"
              onClick={() => handleOpenLogModal({ date: settings.currentSimulatedDate })}
              className="hidden sm:flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-accent hover:bg-accent-hover text-paper text-[13px] font-semibold transition active:scale-[0.97] shrink-0"
              title="Registra ore di studio svolte (+)"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Registra studio</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFormulaDrawerOpen(true)}
              className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center text-accent hover:bg-black/[0.05] font-semibold"
              title="Formulario (F2)"
              aria-label="Apri il formulario"
            >
              ∑
            </button>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center text-accent hover:bg-black/[0.05]"
              title="Parametri di Ribilanciamento"
              aria-label="Impostazioni"
            >
              <IconSettings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Contenuto */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 2xl:px-10 py-6 md:py-8 space-y-6 pb-28 lg:pb-12">
          {PAGE_HEADINGS[activeTab] && (
            <div>
              <div className="eyebrow">{PAGE_HEADINGS[activeTab].eyebrow}</div>
              <h2 className="large-title mt-1 text-ink">{PAGE_HEADINGS[activeTab].title}</h2>
            </div>
          )}
        {/* Tab Content & Side-by-Side PDF Split View (Punto 11) */}
        <div className={isPdfSplitOpen ? "grid grid-cols-1 xl:grid-cols-12 gap-6 items-start" : ""}>
          <div className={isPdfSplitOpen ? "xl:col-span-7 space-y-6" : ""}>
            {activeTab === "dashboard" && (
              <Dashboard
                progress={progress}
                metrics={metrics}
                onTabChange={setActiveTab}
                topics={topics}
                settings={settings}
                onOpenLogModal={handleOpenLogModal}
                onOpenTopicDetail={handleOpenTopicDetail}
                onToggleSpacedReview={handleToggleSpacedReview}
                onLogStudySession={handleLogStudySession}
                mockExams={mockExams}
                onSaveMockExam={handleSaveMockExam}
                onDeleteMockExam={handleDeleteMockExam}
                mathBugs={mathBugs}
                onOpenBugTracker={() => setIsBugTrackerOpen(true)}
                currentWeekPlan={rebalancedPlan.currentWeekPlan}
                todayPlan={rebalancedPlan.calendarDays.find(d => d.isToday) || null}
              />
            )}

            {activeTab === "weekly" && (
              <WeeklyTodo
                weeklyPlans={weeklyPlans}
                calendarDays={rebalancedPlan.calendarDays}
                onToggleComplete={handleToggleComplete}
                onUpdateTopicHours={handleUpdateTopicHours}
                onLogStudySession={handleLogStudySession}
                onMarkTopicCompleted={handleMarkTopicCompleted}
                settings={settings}
                customDayCapacities={customDayCapacities}
                onUpdateDayCapacity={handleUpdateDayCapacity}
                onBatchUpdateDayCapacities={handleBatchUpdateDayCapacities}
                onOpenLogModal={handleOpenLogModal}
                onOpenTopicDetail={handleOpenTopicDetail}
                onToggleSpacedReview={handleToggleSpacedReview}
                onOpenRetrospective={() => setIsRetroModalOpen(true)}
                mathBugs={mathBugs}
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
                calendarDays={rebalancedPlan.calendarDays}
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
          </div>

          {isPdfSplitOpen && (
            <div className="xl:col-span-5 sticky top-[68px]">
              <PdfSplitView isOpen={isPdfSplitOpen} onClose={() => setIsPdfSplitOpen(false)} />
            </div>
          )}
        </div>
        </main>
      </div>

      {/* Tab bar iOS (mobile e tablet) */}
      <nav aria-label="Sezioni" className="lg:hidden fixed bottom-0 inset-x-0 z-40 vibrancy border-t border-black/10 pb-safe">
        <div className="grid grid-cols-6 items-end px-1 pt-1.5">
          {NAV_ITEMS.slice(0, 2).map(item => renderTabBarItem(item))}
          <button
            type="button"
            onClick={() => handleOpenLogModal({ date: settings.currentSimulatedDate })}
            className="flex flex-col items-center gap-0.5 text-accent"
            title="Registra Sessione di Studio (+)"
          >
            <span className="w-11 h-11 -mt-4 rounded-full bg-accent text-paper flex items-center justify-center shadow-float active:scale-95 transition">
              <IconPlus className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-medium">Studio</span>
          </button>
          {NAV_ITEMS.slice(2).map(item => renderTabBarItem(item))}
        </div>
      </nav>

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
        onUpdateTopic={handleTopicUpdate}
        studySessions={studySessions}
      />

      {/* Math Bug Tracker Modal (Punto 5) */}
      <MathBugTracker
        isOpen={isBugTrackerOpen}
        onClose={() => setIsBugTrackerOpen(false)}
        bugs={mathBugs}
        onSaveBugs={setMathBugs}
        topics={topics}
        onOpenTopicDetail={handleOpenTopicDetail}
      />

      {/* Quick Math Formula Cheat-Sheet Drawer (Punto 10) */}
      <MathFormulaDrawer
        isOpen={isFormulaDrawerOpen}
        onClose={() => setIsFormulaDrawerOpen(false)}
      />

      {/* Weekly Retrospective Modal (Punto 19) */}
      <WeeklyRetrospectiveModal
        isOpen={isRetroModalOpen}
        onClose={() => setIsRetroModalOpen(false)}
        weeklyPlans={weeklyPlans}
        settings={settings}
        metrics={metrics}
        customDayCapacities={customDayCapacities}
        onBatchUpdateDayCapacities={handleBatchUpdateDayCapacities}
      />

      {/* CLARKE-9000 Isolated Side Companion */}
      <Clarke9000Companion
        progress={progress}
        metrics={metrics}
      />
    </div>
  );
}
