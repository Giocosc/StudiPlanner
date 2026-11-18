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
 * Pushes updated state to GitLab repository (creates file if not present, updates if present)
 */
export async function pushToGitLab(config, payload, commitMessage = "") {
  const instanceUrl = cleanInstanceUrl(config.instanceUrl);
  const projectId = encodeProjectId(config.projectId);
  const token = (config.token || "").trim();
  const branch = (config.branch || "main").trim();
  const rawFilePath = (config.filePath || "data/studiplanner-state.json").trim();
  const filePath = encodeURIComponent(rawFilePath);

  if (!projectId || !token) {
    throw new Error("Configurazione GitLab incompleta per il push.");
  }

  const checkEndpoint = `${instanceUrl}/api/v4/projects/${projectId}/repository/files/${filePath}?ref=${encodeURIComponent(branch)}`;
  let fileExists = false;

  try {
    const checkRes = await fetch(checkEndpoint, {
      method: "HEAD",
      headers: { "PRIVATE-TOKEN": token }
    });
    fileExists = checkRes.status === 200;
  } catch (e) {
    fileExists = false;
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
