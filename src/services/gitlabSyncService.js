/**
 * GitLab Cloud Synchronization Service for StudiPlanner
 * Provides frictionless, zero-server cloud sync via GitLab REST API v4.
 * Enables real-time synchronization of study sessions, topics, and settings
 * across multiple devices (Desktop, Laptop, Smartphone, Tablet).
 */

export const LOCAL_STORAGE_KEY_GITLAB_CONFIG = "unimore_rebalancer_gitlab_config_v1";

export const DEFAULT_GITLAB_CONFIG = {
  enabled: false,
  autoSync: true, // Auto-pull on app start & auto-push on state changes
  instanceUrl: "https://gitlab.com",
  projectId: "", // e.g. "username/studiplanner" or numeric project ID
  branch: "main",
  filePath: "data/studiplanner-state.json",
  token: "", // Personal access token (stored only locally in browser)
  lastSynced: null,
  lastCommitId: null,
  syncStatus: "idle", // "idle" | "syncing" | "success" | "error"
  errorMessage: null
};

/**
 * Normalizes GitLab instance URL
 */
function cleanInstanceUrl(url) {
  if (!url) return "https://gitlab.com";
  let cleaned = url.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = "https://" + cleaned;
  }
  return cleaned;
}

/**
 * Normalizes Project Identifier (path with slash or numerical ID)
 */
function encodeProjectId(projectId) {
  if (!projectId) return "";
  const trimmed = String(projectId).trim();
  // If it's a numeric ID, use as is; otherwise URL-encode the namespace/project path
  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }
  return encodeURIComponent(trimmed);
}

/**
 * Decodes UTF-8 base64 encoded text from GitLab API
 */
function decodeBase64Utf8(base64Str) {
  try {
    const binStr = atob(base64Str.replace(/\s/g, ""));
    const bytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      bytes[i] = binStr.charCodeAt(i);
    }
    return new TextDecoder("utf-8").decode(bytes);
  } catch (e) {
    // Fallback
    return decodeURIComponent(escape(atob(base64Str)));
  }
}

/**
 * Tests connection to GitLab and verifies project access
 */
export async function testGitLabConnection(config) {
  const instanceUrl = cleanInstanceUrl(config.instanceUrl);
  const projectId = encodeProjectId(config.projectId);
  const token = (config.token || "").trim();

  if (!projectId) {
    throw new Error("Specificare il Project ID o il percorso del repository (es. username/studiplanner).");
  }
  if (!token) {
    throw new Error("Specificare un Personal Access Token di GitLab.");
  }

  const endpoint = `${instanceUrl}/api/v4/projects/${projectId}`;
  const response = await fetch(endpoint, {
    method: "GET",
    cache: "no-store",
    headers: {
      "PRIVATE-TOKEN": token,
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Token non valido o scaduto (401 Unauthorized). Verifica i permessi del tuo Personal Access Token.");
    }
    if (response.status === 404) {
      throw new Error("Repository non trovato (404 Not Found). Verifica che il Project ID/Path sia corretto e accessibile al token.");
    }
    throw new Error(`Errore connessione GitLab (${response.status}): ${response.statusText}`);
  }

  const projectData = await response.json();
  return {
    success: true,
    projectName: projectData.name_with_namespace || projectData.name,
    defaultBranch: projectData.default_branch || "main",
    webUrl: projectData.web_url
  };
}

/**
 * Pulls latest state from GitLab repository
 */
export async function pullFromGitLab(config) {
  const instanceUrl = cleanInstanceUrl(config.instanceUrl);
  const projectId = encodeProjectId(config.projectId);
  const token = (config.token || "").trim();
  const branch = (config.branch || "main").trim();
  const filePath = encodeURIComponent((config.filePath || "data/studiplanner-state.json").trim());

  if (!projectId || !token) {
    throw new Error("Configurazione GitLab incompleta per il pull.");
  }

  const endpoint = `${instanceUrl}/api/v4/projects/${projectId}/repository/files/${filePath}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(endpoint, {
    method: "GET",
    cache: "no-store",
    headers: {
      "PRIVATE-TOKEN": token,
      "Accept": "application/json"
    }
  });

  if (response.status === 404) {
    // File not yet created on remote repository
    return {
      success: true,
      notFound: true,
      data: null,
      message: "Il file di stato non esiste ancora nel repository remoto: verrà creato al primo push."
    };
  }

  if (!response.ok) {
    throw new Error(`Errore durante il download da GitLab (${response.status}): ${response.statusText}`);
  }

  const fileData = await response.json();
  const jsonContent = decodeBase64Utf8(fileData.content);
  const parsedData = JSON.parse(jsonContent);

  return {
    success: true,
    notFound: false,
    data: parsedData,
    commitId: fileData.commit_id,
    lastCommitId: fileData.last_commit_id,
    fileName: fileData.file_name
  };
}

/**
 * Errore di conflitto: il file remoto è cambiato dopo l'ultima lettura
 * (GitLab rifiuta il commit perché `last_commit_id` non è più l'ultimo).
 */
export class GitLabConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "GitLabConflictError";
    this.isConflict = true;
  }
}

/**
 * Pushes updated state to GitLab repository (creates file if not present, updates if present)
 * options.lastCommitId: se presente, GitLab accetta l'aggiornamento solo se il file non è
 *   cambiato da quel commit (controllo di concorrenza ottimistico); altrimenti -> GitLabConflictError.
 * options.fileExists: se noto (es. da un pull appena fatto) evita la richiesta HEAD.
 */
export async function pushToGitLab(config, payload, commitMessage = "", options = {}) {
  const instanceUrl = cleanInstanceUrl(config.instanceUrl);
  const projectId = encodeProjectId(config.projectId);
  const token = (config.token || "").trim();
  const branch = (config.branch || "main").trim();
  const rawFilePath = (config.filePath || "data/studiplanner-state.json").trim();
  const filePath = encodeURIComponent(rawFilePath);

  if (!projectId || !token) {
    throw new Error("Configurazione GitLab incompleta per il push.");
  }

  let fileExists = options.fileExists;
  if (fileExists === undefined) {
    const checkEndpoint = `${instanceUrl}/api/v4/projects/${projectId}/repository/files/${filePath}?ref=${encodeURIComponent(branch)}`;
    try {
      const checkRes = await fetch(checkEndpoint, {
        method: "HEAD",
        headers: { "PRIVATE-TOKEN": token }
      });
      fileExists = checkRes.status === 200;
    } catch (e) {
      fileExists = false;
    }
  }

  const method = fileExists ? "PUT" : "POST";
  const endpoint = `${instanceUrl}/api/v4/projects/${projectId}/repository/files/${filePath}`;

  const defaultMsg = commitMessage || `Update StudiPlanner: ${new Date().toLocaleDateString('it-IT')} ${new Date().toLocaleTimeString('it-IT')}`;

  const requestBody = {
    branch: branch,
    commit_message: defaultMsg,
    content: JSON.stringify(payload, null, 2),
    encoding: "text"
  };
  if (fileExists && options.lastCommitId) {
    requestBody.last_commit_id = options.lastCommitId;
  }

  const response = await fetch(endpoint, {
    method: method,
    headers: {
      "PRIVATE-TOKEN": token,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    // 400 "...has changed since you started editing it" / 409: il file remoto è cambiato.
    // Un POST su file già creato da un altro dispositivo risponde 400 "already exists".
    if (response.status === 409 || (response.status === 400 && /changed|already exists|last_commit_id/i.test(errorBody))) {
      throw new GitLabConflictError(`Il file remoto è cambiato nel frattempo (${response.status}).`);
    }
    throw new Error(`Errore durante il push su GitLab (${response.status}): ${errorBody || response.statusText}`);
  }

  const resultData = await response.json().catch(() => ({}));

  return {
    success: true,
    created: !fileExists,
    commitId: resultData.commit_id || null,
    filePath: rawFilePath,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
}

/* ------------------------------------------------------------------------- */
/* Merge                                                                     */
/* ------------------------------------------------------------------------- */

const sumSessionHoursByTopic = (sessions) => {
  const map = new Map();
  (sessions || []).forEach(s => {
    if (!s || !s.topicId) return;
    map.set(s.topicId, (map.get(s.topicId) || 0) + Number(s.hours || 0));
  });
  return map;
};

const syncTs = (value) => {
  const n = typeof value === "string" ? Date.parse(value) : Number(value);
  return Number.isFinite(n) ? n : 0;
};

/**
 * Serializzazione JSON con chiavi ordinate: serve a confrontare due stati
 * indipendentemente dall'ordine delle proprietà.
 */
export function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().filter(k => value[k] !== undefined).map(k => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
  }
  return JSON.stringify(value === undefined ? null : value);
}

/**
 * Intelligent Conflict Resolution & Session-Level Merge (Punto 16)
 * Merges local and remote states preventing data loss across offline devices.
 * - Sessioni: unione per ID, MENO quelle cancellate su un qualsiasi dispositivo
 *   (deletedSessionIds, "tombstone"): una sessione eliminata non ricompare.
 * - Argomenti: per stato (completamento, Feynman, ripassi, appunti) vince la modifica
 *   più recente (updatedAt); se nessuno dei due ha updatedAt si usa l'unione storica.
 * - oreEffettive: ricalcolate = ore delle sessioni unite + correzioni manuali (±30m,
 *   spunte senza sessioni) del lato più recente. Prima si prendeva il massimo dei due
 *   lati e le ore registrate offline su due dispositivi andavano perse.
 * - `note` (focus didattico ufficiale) e `scratchpadNotes` (appunti) restano distinti.
 * - Time Shifter, impostazioni e bug tracker: vince il lato modificato più di recente
 *   (syncMeta), così anche un reset/cancellazione si propaga.
 */
export function mergeStudyPlannerStates(localState = {}, remoteState = {}) {
  if (!remoteState) return localState;
  if (!localState) return remoteState;

  // 0. Tombstone delle sessioni cancellate (unione dei due lati)
  const deletedIds = new Set([
    ...((remoteState.deletedSessionIds) || []),
    ...((localState.deletedSessionIds) || [])
  ]);

  // 1. Merge Study Sessions by Unique ID (Deduplication + Union - Tombstones)
  const sessionsMap = new Map();
  (remoteState.studySessions || []).forEach(sess => {
    if (sess && sess.id && !deletedIds.has(sess.id)) {
      sessionsMap.set(sess.id, sess);
    }
  });
  (localState.studySessions || []).forEach(sess => {
    if (sess && sess.id && !deletedIds.has(sess.id)) {
      if (sessionsMap.has(sess.id)) {
        const existing = sessionsMap.get(sess.id);
        sessionsMap.set(sess.id, {
          ...existing,
          ...sess,
          hours: Math.max(Number(existing.hours || 0), Number(sess.hours || 0)),
          completed: Boolean(existing.completed || sess.completed)
        });
      } else {
        sessionsMap.set(sess.id, sess);
      }
    }
  });
  const mergedSessions = Array.from(sessionsMap.values()).sort((a, b) => {
    const byDate = (b.date || "").localeCompare(a.date || "");
    return byDate !== 0 ? byDate : String(b.timestamp || "").localeCompare(String(a.timestamp || ""));
  });

  const localSessionHours = sumSessionHoursByTopic(localState.studySessions);
  const remoteSessionHours = sumSessionHoursByTopic(remoteState.studySessions);
  const mergedSessionHours = sumSessionHoursByTopic(mergedSessions);

  // 2. Merge Topics
  const localTopics = localState.topics || [];
  const remoteTopicsMap = new Map((remoteState.topics || []).map(t => [t.id, t]));
  const localIds = new Set(localTopics.map(t => t.id));

  const mergeTopic = (localT, remoteT) => {
    const lTime = syncTs(localT.updatedAt);
    const rTime = syncTs(remoteT.updatedAt);
    const hasTimestamps = lTime > 0 || rTime > 0;
    const remoteIsNewer = rTime > lTime;
    const newer = remoteIsNewer ? remoteT : localT;
    const older = remoteIsNewer ? localT : remoteT;

    const manualDelta = (t, sessionHours) => Number(t.oreEffettive || 0) - (sessionHours.get(t.id) || 0);
    const localManual = manualDelta(localT, localSessionHours);
    const remoteManual = manualDelta(remoteT, remoteSessionHours);
    const manual = hasTimestamps ? (remoteIsNewer ? remoteManual : localManual) : Math.max(localManual, remoteManual);
    const effHours = Math.max(0, Number(((mergedSessionHours.get(localT.id) || 0) + manual).toFixed(2)));

    let state;
    if (hasTimestamps) {
      const isCompleted = Boolean(newer.completato !== undefined ? newer.completato : newer.isCompleted);
      state = {
        completato: isCompleted,
        isCompleted,
        completedDate: isCompleted ? (newer.completedDate || older.completedDate || null) : null,
        feynmanChecklist: newer.feynmanChecklist || older.feynmanChecklist,
        spacedReviews: newer.spacedReviews || older.spacedReviews,
        scratchpadNotes: newer.scratchpadNotes !== undefined ? newer.scratchpadNotes : older.scratchpadNotes,
        autoFilledHours: newer.autoFilledHours !== undefined ? newer.autoFilledHours : older.autoFilledHours
      };
    } else {
      // Dati legacy senza updatedAt: unione conservativa (nessuna perdita)
      const isCompleted = Boolean(localT.isCompleted || localT.completato || remoteT.isCompleted || remoteT.completato);
      const lFeynman = localT.feynmanChecklist || {};
      const rFeynman = remoteT.feynmanChecklist || {};
      state = {
        completato: isCompleted,
        isCompleted,
        completedDate: isCompleted ? (localT.completedDate || remoteT.completedDate || null) : null,
        feynmanChecklist: {
          intuitive: Boolean(lFeynman.intuitive || rFeynman.intuitive),
          formal: Boolean(lFeynman.formal || rFeynman.formal),
          proof: Boolean(lFeynman.proof || rFeynman.proof)
        },
        spacedReviews: { ...(remoteT.spacedReviews || {}), ...(localT.spacedReviews || {}) },
        scratchpadNotes: localT.scratchpadNotes || remoteT.scratchpadNotes || ""
      };
    }

    return {
      ...older,
      ...newer,
      ...state,
      note: newer.note !== undefined ? newer.note : older.note,
      oreEffettive: effHours,
      updatedAt: Math.max(lTime, rTime) || undefined
    };
  };

  const mergedTopics = localTopics.map(localT => {
    const remoteT = remoteTopicsMap.get(localT.id);
    return remoteT ? mergeTopic(localT, remoteT) : localT;
  });
  // Argomenti presenti solo sull'altro dispositivo (es. import CSV fatto altrove)
  (remoteState.topics || []).forEach(remoteT => {
    if (remoteT && remoteT.id && !localIds.has(remoteT.id)) mergedTopics.push(remoteT);
  });

  // 3. Metadati di sincronizzazione (ultimo aggiornamento per sezione)
  const localMeta = localState.syncMeta || {};
  const remoteMeta = remoteState.syncMeta || {};
  const pickNewer = (key, localValue, remoteValue, legacyMerge) => {
    const l = syncTs(localMeta[key]);
    const r = syncTs(remoteMeta[key]);
    if (l === 0 && r === 0) return legacyMerge();
    return r > l ? remoteValue : localValue;
  };

  // 4. Merge Custom Day Capacities
  const mergedCapacities = pickNewer(
    "capacitiesUpdatedAt",
    localState.customDayCapacities || {},
    remoteState.customDayCapacities || {},
    () => ({ ...(remoteState.customDayCapacities || {}), ...(localState.customDayCapacities || {}) })
  );

  // 5. Merge Settings (la data simulata resta sempre quella del dispositivo locale)
  const chosenSettings = pickNewer(
    "settingsUpdatedAt",
    localState.settings || {},
    remoteState.settings || {},
    () => ({ ...(remoteState.settings || {}), ...(localState.settings || {}) })
  );
  const mergedSettings = { ...chosenSettings };
  if (localState.settings && localState.settings.currentSimulatedDate) {
    mergedSettings.currentSimulatedDate = localState.settings.currentSimulatedDate;
  } else {
    delete mergedSettings.currentSimulatedDate;
  }

  // 6. Bug tracker matematico
  const mergedMathBugs = pickNewer(
    "mathBugsUpdatedAt",
    localState.mathBugs,
    remoteState.mathBugs,
    () => (localState.mathBugs && localState.mathBugs.length > 0 ? localState.mathBugs : remoteState.mathBugs)
  );

  // Temi d'esame: unione per id meno i cancellati; a parità di id vince updatedAt più recente
  const deletedMockIds = new Set([
    ...(remoteState.deletedMockExamIds || []),
    ...(localState.deletedMockExamIds || [])
  ]);
  const mockMap = new Map();
  [...(remoteState.mockExams || []), ...(localState.mockExams || [])].forEach(exam => {
    if (!exam || !exam.id || deletedMockIds.has(exam.id)) return;
    const existing = mockMap.get(exam.id);
    if (!existing || syncTs(exam.updatedAt) >= syncTs(existing.updatedAt)) mockMap.set(exam.id, exam);
  });
  const mergedMockExams = Array.from(mockMap.values())
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || String(a.id).localeCompare(String(b.id)));

  const mergedMeta = {};
  ["settingsUpdatedAt", "capacitiesUpdatedAt", "mathBugsUpdatedAt"].forEach(key => {
    const value = Math.max(syncTs(localMeta[key]), syncTs(remoteMeta[key]));
    if (value > 0) mergedMeta[key] = value;
  });

  return {
    topics: mergedTopics.length > 0 ? mergedTopics : (remoteState.topics || []),
    studySessions: mergedSessions,
    deletedSessionIds: Array.from(deletedIds),
    customDayCapacities: mergedCapacities,
    settings: mergedSettings,
    mathBugs: mergedMathBugs,
    mockExams: mergedMockExams,
    deletedMockExamIds: Array.from(deletedMockIds),
    syncMeta: mergedMeta
  };
}

/* ------------------------------------------------------------------------- */
/* Sync completo: pull -> merge -> push con controllo di concorrenza          */
/* ------------------------------------------------------------------------- */

/** Payload salvato su GitLab (senza la data simulata, che è propria di ogni dispositivo). */
export function buildSyncPayload(state = {}) {
  const settings = { ...(state.settings || {}) };
  delete settings.currentSimulatedDate;
  const payload = {
    exportDate: new Date().toISOString(),
    settings,
    topics: state.topics || [],
    customDayCapacities: state.customDayCapacities || {},
    studySessions: state.studySessions || [],
    deletedSessionIds: state.deletedSessionIds || [],
    syncMeta: state.syncMeta || {}
  };
  if (state.mathBugs !== undefined) payload.mathBugs = state.mathBugs;
  if (state.mockExams !== undefined) payload.mockExams = state.mockExams;
  if (state.deletedMockExamIds !== undefined) payload.deletedMockExamIds = state.deletedMockExamIds;
  return payload;
}

const comparableSyncPayload = (payload) => {
  const { exportDate, ...rest } = payload || {};
  const settings = { ...(rest.settings || {}) };
  delete settings.currentSimulatedDate;
  return stableStringify({ ...rest, settings });
};

/** true se i due stati sono equivalenti ai fini del sync (data di export e data simulata escluse) */
export function syncStatesEqual(a, b) {
  return comparableSyncPayload(buildSyncPayload(a)) === comparableSyncPayload(buildSyncPayload(b));
}

/**
 * Sincronizzazione completa e sicura con più dispositivi aperti:
 * 1. legge il file remoto (e il suo last_commit_id);
 * 2. fonde lo stato remoto con quello locale;
 * 3. se il risultato differisce dal remoto, lo scrive passando last_commit_id:
 *    se nel frattempo un altro dispositivo ha scritto, GitLab rifiuta e si riparte dal punto 1.
 * Restituisce lo stato fuso, da applicare in locale.
 */
export async function syncWithGitLab(config, localState, commitMessage = "", maxAttempts = 3) {
  let lastError = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const remote = await pullFromGitLab(config);
    const merged = remote.data ? mergeStudyPlannerStates(localState, remote.data) : { ...localState };

    // Il remoto viene normalizzato con la stessa fusione (campi mancanti nei dati legacy),
    // così uno stato già allineato non genera commit inutili.
    if (remote.data && syncStatesEqual(merged, mergeStudyPlannerStates(remote.data, remote.data))) {
      return { merged, pushed: false, commitId: remote.lastCommitId || remote.commitId || null, attempts: attempt };
    }

    try {
      const res = await pushToGitLab(config, buildSyncPayload(merged), commitMessage, {
        fileExists: !remote.notFound,
        lastCommitId: remote.lastCommitId
      });
      return { merged, pushed: true, commitId: res.commitId, timestamp: res.timestamp, attempts: attempt };
    } catch (err) {
      if (!err || !err.isConflict) throw err;
      lastError = err;
      // Conflitto: un altro dispositivo ha scritto. Si rilegge e si rifonde.
      localState = merged;
    }
  }
  throw lastError || new Error("Sincronizzazione GitLab non riuscita dopo più tentativi.");
}
