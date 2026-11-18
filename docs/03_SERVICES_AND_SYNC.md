# 🔄 Documentazione Servizi & Sincronizzazione: StudiPlanner
## Architettura Zero-Server, GitLab Cloud REST API v4, Parser Documentale & iCalendar Engine

---

### Indice Generale

1. [Panoramica Architetturale dei Servizi](#1-panoramica-architetturale-dei-servizi)
   - [Filosofia Zero-Backend & Browser-First](#filosofia-zero-backend--browser-first)
   - [Mappa dei Moduli e Competenze](#mappa-dei-moduli-e-competenze)
2. [GitLab Cloud Synchronization Service (`gitlabSyncService.js`)](#2-gitlab-cloud-synchronization-service)
   - [Architettura di Rete e Autenticazione Client-Side](#architettura-di-rete-e-autenticazione-client-side)
   - [Modello di Configurazione e Persistenza Locale](#modello-di-configurazione-e-persistenza-locale)
   - [Risoluzione del Problema di Codifica Base64/UTF-8](#risoluzione-del-problema-di-codifica-base64utf-8)
   - [Ciclo di Vita Auto-Pull all'Avvio (Mount Effect)](#ciclo-di-vita-auto-pull-allavvio)
   - [Ciclo di Vita Auto-Push Debounced (2.5s)](#ciclo-di-vita-auto-push-debounced-25s)
   - [Algoritmo Intelligente di Risoluzione Conflitti (`mergeStudyPlannerStates`)](#algoritmo-intelligente-di-risoluzione-conflitti)
   - [Diagramma di Sequenza del Flusso di Sincronizzazione Cloud](#diagramma-di-sequenza-del-flusso-di-sincronizzazione-cloud)
   - [Resilienza Offline e Gestione Errori HTTP](#resilienza-offline-e-gestione-errori-http)
3. [Parser Service & Normalizzazione Dati (`parserService.js`)](#3-parser-service--normalizzazione-dati)
   - [Supporto Multi-Formato: CSV, TXT, Excel (.xlsx, .xls) e OpenDocument (.ods)](#supporto-multi-formato)
   - [Parser CSV Robusto con Delimiter Detection e Quote Escaping](#parser-csv-robusto)
   - [Mappatura Fuzzy degli Header di Colonna](#mappatura-fuzzy-degli-header-di-colonna)
   - [Normalizzazione Tipologica e Inferenza Corso](#normalizzazione-tipologica-e-inferenza-corso)
   - [Parsing Fogli Elettronici con SheetJS (XLSX)](#parsing-fogli-elettronici-con-sheetjs)
   - [Algoritmo di Fuzzy Matching & Riconoscimento Completamento](#algoritmo-di-fuzzy-matching)
   - [Flusso di Elaborazione Documentale](#flusso-di-elaborazione-documentale)
4. [Calendar Export Service (`calendarExportService.js`)](#4-calendar-export-service)
   - [Obiettivo Didattico per Studente Lavoratore](#obiettivo-didattico-per-studente-lavoratore)
   - [Conformità allo Standard RFC 5545 (iCalendar)](#conformità-allo-standard-rfc-5545)
   - [Formattazione Temporale e Gestione Fusi Orari](#formattazione-temporale-e-gestione-fusi-orari)
   - [Sanitizzazione ed Escape dei Campi Testuali](#sanitizzazione-ed-escape-dei-campi-testuali)
   - [Struttura Evento (`VEVENT`), Syllabus e Promemoria (`VALARM`)](#struttura-evento-vevent)
   - [Differenziazione Fasce Orarie Feriali vs Weekend con Time Shifter](#differenziazione-fasce-orarie)
   - [Generazione Client-Side e Trigger Download via Blob](#generazione-client-side-e-trigger-download)
5. [Schemi Dati e Payload di Sincronizzazione](#5-schemi-dati-e-payload-di-sincronizzazione)
   - [Payload Stato Globale (`studiplanner-state.json`)](#payload-stato-globale)
   - [Schema Configurazione GitLab](#schema-configurazione-gitlab)
   - [Esempio di File iCalendar Generato (`.ics`)](#esempio-di-file-icalendar-generato)
6. [Sicurezza, Privacy e Politiche CORS](#6-sicurezza-privacy-e-politiche-cors)

---

### 1. Panoramica Architetturale dei Servizi

#### Filosofia Zero-Backend & Browser-First
**StudiPlanner** è concepito per operare al 100% all'interno del client web (browser desktop, mobile o tablet) senza la necessità di un backend proprietario dedicato (Node.js, Python/Django, database PostgreSQL o Firebase). 

Questo approccio offre vantaggi determinanti per l'utente:
1. **Zero Costi di Hosting e Manutenzione:** L'applicazione può essere ospitata su GitHub Pages, GitLab Pages o servita localmente tramite un semplice server HTTP statico.
2. **Privacy Assoluta:** I dati di studio, le note personali, i ritmi giornalieri e i token non transitano mai su server intermedi non controllati dall'utente.
3. **Resilienza Offline:** L'applicazione funziona pienamente anche in assenza di connessione Internet (es. in treno, in aereo o durante disconnessioni temporanee), persistendo ogni modifica in `localStorage`.
4. **Sincronizzazione Cloud Multi-Device Istituzionale/Personale:** Sfrutta le API REST v4 native di **GitLab** per trasformare un repository Git personale o aziendale nel database distribuito dell'applicazione.

#### Mappa dei Moduli e Competenze

I moduli di servizio residenti in `src/services/` gestiscono l'integrazione esterna, l'ingestione dei dati e la persistenza:

| File Servizio | Responsabilità Principale | Dipendenze Esterne |
| :--- | :--- | :--- |
| `src/services/gitlabSyncService.js` | Sincronizzazione bidirezionale con GitLab Cloud (REST API v4), codifica Base64/UTF-8, algoritmi di merge e conflict resolution multi-dispositivo. | Nessuna (`fetch`, `TextDecoder` nativi del browser) |
| `src/services/parserService.js` | Ingestione ed esportazione di dataset accademici in formato CSV, TXT, Excel (.xlsx/.xls) e OpenDocument (.ods). Fuzzy matching delle intestazioni di colonna e riconciliazione degli argomenti. | SheetJS (`XLSX` caricato globalmente da CDN) |
| `src/services/calendarExportService.js` | Generazione dinamica di calendari `.ics` (iCalendar RFC 5545) per importazione su Google Calendar, Apple Calendar, Outlook e Thunderbird, con gestione automatica di orari serali feriali e blocchi weekend. | Nessuna (standard W3C `Blob` e URL Object) |
| `src/services/rebalancerEngine.js` | Motore matematico del Rolling Rebalancer: calcolo sequenziale propedeutico, buffer +20%, Time Shifter giornaliero e monitoraggio sovraccarico settimanale. *(Trattato esaustivamente in `docs/02_REBALANCER_ENGINE.md`)*. | Nessuna (puro JavaScript funzionale) |

---

### 2. GitLab Cloud Synchronization Service (`gitlabSyncService.js`)

Il modulo `gitlabSyncService.js` fornisce la sincronizzazione cloud trasparente "Set and Forget". Permette allo studente lavoratore di registrare sessioni di studio dal telefono durante il rientro serale e ritrovare immediatamente la dashboard aggiornata sul PC desktop di casa.

#### Architettura di Rete e Autenticazione Client-Side
L'integrazione comunica direttamente con l'endpoint REST API v4 di GitLab:
- **GitLab Cloud Ufficiale:** `https://gitlab.com/api/v4`
- **Istanze Self-Hosted:** `{instanceUrl}/api/v4` (es. GitLab universitario o privato)

L'autenticazione avviene tramite **Personal Access Token (PAT)** di GitLab, inviato nell'header HTTP:
```http
PRIVATE-TOKEN: <personal-access-token>
```
I permessi minimi richiesti per il token sono `api` oppure `read_repository` + `write_repository`. Il token viene memorizzato esclusivamente nel `localStorage` del browser client e non viene mai condiviso con terzi.

#### Modello di Configurazione e Persistenza Locale
La configurazione di GitLab è persistita sotto la chiave:
```javascript
export const LOCAL_STORAGE_KEY_GITLAB_CONFIG = "unimore_rebalancer_gitlab_config_v1";
```

Lo schema predefinito è definito dalla costante:
```javascript
export const DEFAULT_GITLAB_CONFIG = {
  enabled: false,           // Flag di attivazione globale del servizio
  autoSync: true,          // Esegue auto-pull al mount e auto-push al cambio di stato
  instanceUrl: "https://gitlab.com", // URL base dell'istanza GitLab
  projectId: "",           // Percorso namespace/progetto (es. "utente/studiplanner") o ID numerico
  branch: "main",          // Ramo Git di destinazione
  filePath: "data/studiplanner-state.json", // Percorso relativo del file JSON nel repository
  token: "",               // Personal Access Token di GitLab (locale)
  lastSynced: null,        // Timestamp formattato dell'ultima sincronizzazione riuscita
  lastCommitId: null,      // SHA dell'ultimo commit registrato
  syncStatus: "idle",      // Stato reattivo: "idle" | "syncing" | "success" | "error"
  errorMessage: null       // Messaggio d'errore dell'ultimo tentativo fallito
};
```

Funzioni di utilità per la sanitizzazione dei parametri:
- `cleanInstanceUrl(url)`: Rimuove barre finali, garantisce il prefisso di protocollo `https://` o `http://` e imposta il default `https://gitlab.com`.
- `encodeProjectId(projectId)`: Se l'ID è puramente numerico (es. `54912034`), lo mantiene invariato; se contiene barre (es. `mario.rossi/studiplanner-state`), applica `encodeURIComponent` trasformando le barre in `%2F`, conformemente alle specifiche delle API v4 di GitLab.

#### Risoluzione del Problema di Codifica Base64/UTF-8

> [!CRITICAL]
> **PRESERVAZIONE CARATTERI ACCENTATI E FORMULE:**  
> Le API v4 di GitLab restituiscono il contenuto dei file codificato in stringa **Base64**.  
> La funzione standard di JavaScript `atob()` decodifica le stringhe interpretando ogni byte come carattere Latin-1 / ASCII. Poiché il syllabus UNIMORE contiene numerosi caratteri accentati (es. *Continuità*, *Derivabilità*, *Proprietà*, *Teorema di Cauchy*), una chiamata ingenua a `JSON.parse(atob(content))` genera un errore critico di decodifica `DOMException: The string to be decoded is not correctly encoded` o produce caratteri corrotti (es. `ProprietÃ `).

Per garantire l'integrità totale dei testi, `gitlabSyncService.js` implementa la decodifica binaria nativa via `TextDecoder`:

```javascript
function decodeBase64Utf8(base64Str) {
  try {
    const binStr = atob(base64Str.replace(/\s/g, ""));
    const bytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      bytes[i] = binStr.charCodeAt(i);
    }
    return new TextDecoder("utf-8").decode(bytes);
  } catch (e) {
    // Fallback di sicurezza per browser legacy
    return decodeURIComponent(escape(atob(base64Str)));
  }
}
```

In direzione opposta (invio da client a GitLab tramite `pushToGitLab`), il payload JSON viene serializzato in stringa UTF-8 nativa e inviato specificando `encoding: "text"` nel corpo della richiesta JSON, lasciando al server GitLab l'onere della serializzazione Git interna.

#### Ciclo di Vita Auto-Pull all'Avvio (Mount Effect)

All'apertura dell'applicazione (`src/app.js`), un hook `useEffect` dedicato verifica se la sincronizzazione GitLab è abilitata (`enabled && autoSync && token && projectId`). In caso affermativo, esegue immediatamente `pullFromGitLab`:

1. **Richiesta HTTP:**
   ```http
   GET {instanceUrl}/api/v4/projects/{projectId}/repository/files/{filePath}?ref={branch}
   PRIVATE-TOKEN: {token}
   ```
2. **Gestione del Risultato:**
   - **File non ancora esistente (HTTP 404):** Viene interpretato come primo avvio su un nuovo repository. La funzione ritorna `{ success: true, notFound: true, data: null }` senza errori; il file verrà creato automaticamente al primo push.
   - **Successo (HTTP 200):** Il contenuto Base64 viene estratto, decodificato tramite `decodeBase64Utf8`, convertito in oggetto JSON e fuso con lo stato locale tramite `mergeStudyPlannerStates`.
   - **Errore di Rete / Autenticazione (401, 403, 500):** L'errore viene catturato, lo stato viene aggiornato a `syncStatus: "error"`, visualizzando l'allerta nella UI senza bloccare il funzionamento locale dell'app basato su `localStorage`.

#### Ciclo di Vita Auto-Push Debounced (2.5s)

Per evitare di saturare il repository GitLab con centinaia di micro-commit durante l'uso continuo (es. mentre l'utente preme ripetutamente lo stepper `[+ 30m]` del Time Shifter o digita note nel diario), l'applicazione implementa un meccanismo di **debouncing di 2500 millisecondi (2.5 secondi)** in `src/app.js`:

```javascript
// GitLab Auto-Push on State Changes (Debounced)
const isGitLabMountRef = useRef(true);

useEffect(() => {
  // Ignora il trigger al montaggio iniziale per evitare di sovrascrivere il cloud prima del pull
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
        lastSynced: res.timestamp,
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
```

All'interno di `pushToGitLab`:
1. Viene effettuata una verifica preventiva dell'esistenza del file tramite `HEAD {instanceUrl}/api/v4/projects/{projectId}/repository/files/{filePath}?ref={branch}`.
2. Se il file esiste già (`status === 200`), viene impiegato il metodo HTTP **`PUT`** per aggiornarlo.
3. Se il file non esiste ancora (`status === 404`), viene impiegato il metodo HTTP **`POST`** per crearlo.

#### Algoritmo Intelligente di Risoluzione Conflitti (`mergeStudyPlannerStates`)

Quando l'app effettua un pull (sia all'avvio che manuale), non sovrascrive ciecamente i dati locali con quelli remoti. Se l'utente ha registrato una sessione offline su un dispositivo mobile e successivamente riapre il desktop, una sovrascrittura diretta causerebbe la perdita di dati.

La funzione `mergeStudyPlannerStates(localState, remoteState)` implementa una logica di unione a grana fine a 4 livelli:

```mermaid
flowchart TD
    subgraph Ingestione
        L[Stato Locale HTML5]
        R[Stato Remoto GitLab]
    end

    subgraph Risoluzione Conflitti
        M1[1. Sessioni di Studio: Deduplicazione per UUID & Unione]
        M2[2. Argomenti Didattici: Propedeuticità & Unione Stato]
        M3[3. Time Shifter: Unione Dizionario Override]
        M4[4. Parametri: Fusione Impostazioni & Data Odierna]
    end

    subgraph Output Consolidato
        MergedState[Stato Globale Riconciliato]
    end

    L --> M1 & M2 & M3 & M4
    R --> M1 & M2 & M3 & M4
    M1 & M2 & M3 & M4 --> MergedState
```

Dettaglio dei 4 livelli di merge:
1. **Unione Sessioni di Studio (`studySessions`):**
   - Utilizza una `Map<session.id, session>`.
   - Se un ID di sessione esiste in entrambi gli stati (stessa sessione modificata), conserva il valore massimo di ore registrate `Math.max(local.hours, remote.hours)` e l'unione logica dello stato completato (`Boolean(local.completed || remote.completed)`).
   - Ordina infine le sessioni risultanti in senso decrescente per data (`date DESC`).
2. **Unione Argomenti Didattici (`topics`):**
   - Preserva rigorosamente l'ordine propedeutico originario della sequenza locale (`A-01 -> A-32`, `G-01 -> G-31`).
   - Stato di completamento: unione logica OR (`local.isCompleted || remote.isCompleted`).
   - Ore effettive spese: conserva il valore massimo `Math.max(local.oreEffettive, remote.oreEffettive)`.
   - Checklist Feynman: unione logica OR su ciascuno dei tre livelli (`intuitive`, `formal`, `proof`).
   - Note e Scratchpad: preserva il testo più lungo o non vuoto tra locale e remoto.
3. **Unione Override Time Shifter (`customDayCapacities`):**
   - Esegue la fusione ad albero degli oggetti `{ ...remoteState.customDayCapacities, ...localState.customDayCapacities }`, preservando gli override specifici impostati localmente per singole date.
4. **Unione Parametri Globali (`settings`):**
   - Fonde i parametri generali (ore feriali/weekend, soglia critica), ma forza la `currentSimulatedDate` alla data odierna reale locale per garantire che il rolling rebalancer calcoli sempre la roadmap a partire da "Oggi".

#### Diagramma di Sequenza del Flusso di Sincronizzazione Cloud

```mermaid
sequenceDiagram
    autonumber
    actor Studente as Studente (Browser)
    participant App as React App (src/app.js)
    participant LocalDB as LocalStorage HTML5
    participant Sync as gitlabSyncService
    participant GitLab as GitLab Cloud API v4

    Note over Studente, GitLab: Fase 1: Avvio Applicazione (Auto-Pull)
    Studente->>App: Apre StudiPlanner
    App->>LocalDB: Carica configurazione unimore_rebalancer_gitlab_config_v1
    LocalDB-->>App: gitlabConfig (enabled: true, autoSync: true)
    App->>Sync: pullFromGitLab(config)
    Sync->>GitLab: GET /api/v4/projects/:id/repository/files/:path?ref=main
    alt File Presente (200 OK)
        GitLab-->>Sync: JSON { content: "base64...", commit_id: "sha1" }
        Sync->>Sync: decodeBase64Utf8(content) -> JSON State
        Sync-->>App: { success: true, data: remoteState }
        App->>Sync: mergeStudyPlannerStates(localState, remoteState)
        Sync-->>App: mergedState (senza perdite)
        App->>LocalDB: Salva mergedState
        App-->>Studente: UI aggiornata con badge verde "GitLab: HH:mm:ss"
    else File non Esistente (404 Not Found)
        GitLab-->>Sync: 404 Not Found
        Sync-->>App: { success: true, notFound: true, data: null }
        App-->>Studente: Pronto per il primo push
    end

    Note over Studente, GitLab: Fase 2: Attività Utente e Auto-Push Debounced
    Studente->>App: Completa argomento o registra 2.5h di studio
    App->>LocalDB: Persistenza immediata in LocalStorage (< 5ms)
    App->>App: Avvia timer debounce (2500ms)
    Note over App: Se l'utente clicca altri bottoni entro 2.5s, il timer si resetta
    App->>Sync: pushToGitLab(config, payload)
    Sync->>GitLab: HEAD /api/v4/projects/:id/repository/files/:path?ref=main
    GitLab-->>Sync: 200 OK (File esistente)
    Sync->>GitLab: PUT /api/v4/projects/:id/repository/files/:path
    Note right of GitLab: commit_message: "Update StudiPlanner: DD/MM/YYYY HH:mm:ss"<br/>encoding: "text"
    GitLab-->>Sync: 200 OK { commit_id: "sha2", file_path: "..." }
    Sync-->>App: { success: true, commitId: "sha2", timestamp: "HH:mm:ss" }
    App->>LocalDB: Aggiorna lastSynced e lastCommitId
    App-->>Studente: Badge UI: "GitLab: HH:mm:ss"
```

#### Resilienza Offline e Gestione Errori HTTP

Il servizio garantisce che eventuali disconnessioni di rete o errori server non intacchino mai l'esperienza d'uso locale:
- **Codice 401 Unauthorized:** Solleva l'eccezione *"Token non valido o scaduto (401 Unauthorized). Verifica i permessi del tuo Personal Access Token."*. L'utente viene avvisato tramite badge arancione/rosso nella topbar, ma continua a studiare e salvare in locale.
- **Codice 404 Not Found (su Test Connessione):** Avvisa che il percorso del progetto (`projectId`) non è stato trovato o non è visibile al token.
- **Connessione Assente (`TypeError: Failed to fetch`):** L'errore viene intercettato nel blocco `catch`, impostando `syncStatus: "error"`. L'applicazione continua a funzionare al 100% su `localStorage`. Non appena la rete ritorna o viene eseguita una nuova azione, l'auto-push riesegue il tentativo con il nuovo snapshot.

---

### 3. Parser Service & Normalizzazione Dati (`parserService.js`)

Il modulo `parserService.js` costituisce il motore di interoperabilità tabellare di StudiPlanner. È progettato per importare syllabus didattici ufficiali UNIMORE da fogli di calcolo preesistenti, CSV canonici e file Excel compilati dallo studente.

#### Supporto Multi-Formato
Il servizio gestisce indistintamente:
- **CSV / TXT (`parseCSVString`):** File di testo con separatori a virgola, punto e virgola o tabulazione.
- **Fogli Elettronici Binari (`parseExcelData`):** Fogli Microsoft Excel 97-2004 (`.xls`), Microsoft Excel OpenXML (`.xlsx`) e OpenDocument Spreadsheet (`.ods`).

#### Parser CSV Robusto con Delimiter Detection e Quote Escaping
Molti file CSV accademici contengono virgole all'interno dei titoli degli argomenti (es. `"Limiti notevoli, forme indeterminate e gerarchia degli infiniti"`). Un parser basato semplicemente su `line.split(",")` corromperebbe la struttura delle colonne.

`parseCSVString` implementa una macchina a stati per riga che gestisce:
1. **Rilevamento Automatico del Delimitatore:** Analizza la prima riga del file (header). Se contiene `;` e non `,`, adotta il punto e virgola; se contiene `\t`, adotta la tabulazione; altrimenti adotta la virgola standard.
2. **Gestione dei Campi Quotati:** Riconosce le virgolette doppie (`"`) e singole (`'`). I delimitatori che compaiono all'interno di stringhe quotate vengono trattati come testo semplice.
3. **Escape delle Virgolette Annidate:** Supporta lo standard RFC 4180 in cui una virgoletta all'interno di un campo quotato viene rappresentata come coppia di virgolette consecutive (`""`).

```javascript
// Frammento di parsing riga a caratteri da parseCSVString
const parseRow = (line) => {
  const result = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      if (inQuotes && line[i + 1] === char) {
        cur += char;
        i++; // salta virgoletta escapata
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(cur.trim());
      cur = "";
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
};
```

#### Mappatura Fuzzy degli Header di Colonna
Gli utenti possono importare file CSV generati da software differenti o con intestazioni in italiano o inglese. Il parser non richiede nomi di colonna rigidi, ma applica una mappatura a sinonimi (fuzzy alias matching):

| Campo Destinazione | Alias Semantici Riconosciuti (Case-Insensitive) | Default di Fallback |
| :--- | :--- | :--- |
| `id` | `id`, `codice`, `slot`, `n.` | `TOPIC-{indice}` |
| `materia` | `materia`, `corso`, `subject` | Inferito dal nome file (`Analisi 1` o `Geometria`) |
| `capitolo` | `capitolo`, `blocco`, `sezione`, `modulo` | `"Generale"` |
| `argomento` | `argomento`, `argomenti`, `teorici`, `nome`, `titolo`, `descrizione` | `Argomento {indice}` |
| `oreStimate` | `ore_stimate`, `ore`, `stima`, `durata`, `hours` | `2.5` |
| `difficolta` | `difficoltà`, `difficolta`, `diff`, `difficulty` | `3` |
| `prioritaEsame`| `priorità`, `priorita`, `peso`, `priority` | `3` |
| `isCompleted` | `stato`, `status`, `completato`, `fatto`, `done` | `false` |

#### Normalizzazione Tipologica e Inferenza Corso
Durante il ciclo di parsing, ogni valore grezzo viene normalizzato:
- **Ore Stimate:** Rimuove l'eventuale suffisso `"h"` (es. `"2.5h"` $\rightarrow$ `2.5`), sostituisce la virgola con il punto decimale (`"2,5"` $\rightarrow$ `2.5`) e applica un valore minimo di sicurezza pari a `0.5h` (`Math.max(0.5, parseFloat(rawOre) || 2.5)`).
- **Difficoltà:** Convertito in intero e vincolato all'intervallo didattico `[1, 5]`.
- **Priorità Esame:** Supporta sia valori numerici che etichette verbali frequenti nelle schede universitarie:
  - `"altissima"` $\rightarrow$ `5`
  - `"alta"` $\rightarrow$ `4`
  - `"media"` $\rightarrow$ `3`
  - `"bassa"` $\rightarrow$ `2`
  - `"bassissima"` $\rightarrow$ `1`
- **Stato di Completamento:** Riconosce come `true` le stringhe: `"completato"`, `"fatto"`, `"done"`, `"completata"`, `"si"`, `"yes"`, `"1"`, `"true"`, `"superato"`, `"studiato"`.
- **Inferenza Materia:** Se la colonna della materia è assente, il parser analizza il nome del file caricato (`lowerFilename`): se contiene `"analisi"` assegna `"Analisi 1"`; se contiene `"geometria"` assegna `"Geometria"`.

#### Parsing Fogli Elettronici con SheetJS (`parseExcelData`)

Quando l'utente carica un file binario (`.xlsx`, `.xls`, `.ods`), il file viene letto tramite `XLSX.read(arrayBuffer, { type: "array" })`.

Il servizio scorre tutti i fogli del documento (`workbook.SheetNames`), estrae le righe tramite `XLSX.utils.sheet_to_json` e scansiona dinamicamente le colonne per identificare:
- **ID di argomenti completati:** Normalizzati in maiuscolo (`completedIds.add(rowId.toUpperCase())`).
- **Keyword didattiche di argomenti completati:** Estratte da colonne di descrizione/teorema se lo stato indica completamento.

#### Algoritmo di Fuzzy Matching & Riconoscimento Completamento

La funzione `mergeTopicsWithExcelData(topics, excelParsedData)` riconcilia il piano di studi attualmente in memoria con i progressi estratti dal foglio elettronico, applicando una strategia euristica a 3 livelli:

```javascript
// Pulizia testo per il matching fuzzy
function cleanTextForMatching(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
```

1. **Livello 1 - Match Diretto su ID:**  
   Verifica se l'ID del topic (es. `A-05`) è presente nell'insieme `completedIds`.
2. **Livello 2 - Match per Inclusione Codice Slot:**  
   Verifica se l'ID del topic contiene la stringa del codice o viceversa (es. `S1-A` contenuto in `SLOT-S1-A`).
3. **Livello 3 - Token Overlap Semantico sul Testo:**  
   Se l'ID non corrisponde, confronta il titolo dell'argomento (`topic.argomento`) con le keyword completate:
   - Normalizza le stringhe rimuovendo punteggiatura e spazi ridondanti.
   - Filtra le parole significative con lunghezza $> 3$ caratteri.
   - Se le parole significative sono $\ge 3$ e la percentuale di sovrapposizione è $\ge 60\%$ (`matchCount / words.length >= 0.6`), l'argomento viene contrassegnato come completato con `completedSource: "Excel Sync"`.

#### Flusso di Elaborazione Documentale

```mermaid
flowchart TD
    File[File Caricato dall'Utente] --> CheckExt{Verifica Estensione}
    
    CheckExt -- .csv / .txt --> CSV[parseCSVString]
    CheckExt -- .xlsx / .ods / .xls --> Excel[parseExcelData via SheetJS]
    CheckExt -- .json --> Backup[Restore Backup JSON]

    CSV --> Delim[Riconoscimento Delimitatore virgola / punto-e-virgola / tab]
    Delim --> RowParse[Parsing riga a riga con quote-escaping]
    RowParse --> ColMap[Mappatura Fuzzy Header]
    ColMap --> Norm[Normalizzazione Ore, Difficoltà, Priorità]
    Norm --> NewTopics[Nuovo Insieme Topics]

    Excel --> ScanSheets[Scansione Fogli & Righe]
    ScanSheets --> ExtrStatus[Estrazione ID e Keyword Completate]
    ExtrStatus --> FuzzyMerge[mergeTopicsWithExcelData]
    FuzzyMerge --> MatchLvl1[Livello 1: Match Esatto ID]
    MatchLvl1 -- Non trovato --> MatchLvl2[Livello 2: Match Codice Slot]
    MatchLvl2 -- Non trovato --> MatchLvl3[Livello 3: Token Overlap >= 60%]
    MatchLvl1 & MatchLvl2 & MatchLvl3 --> Reconciled[Piano Riconciliato con Flag Completato]
```

---

### 4. Calendar Export Service (`calendarExportService.js`)

Il modulo `calendarExportService.js` genera al volo un file di calendario in standard universale **iCalendar (`.ics`)** a partire dalla roadmap proiettata dal Rolling Rebalancer.

#### Obiettivo Didattico per Studente Lavoratore
Uno studente lavoratore a tempo pieno è soggetto a imprevisti professionali, straordinari e riunioni serali. L'esportazione del piano di studio nei calendari personali (Google Calendar su smartphone, Apple Calendar, Microsoft Outlook aziendale) permette di:
1. **Bloccare Proattivamente gli Slot:** Difendere le finestre 19:30 - 22:00 da sovrapposizioni lavorative e sociali.
2. **Promemoria Puntuali:** Notifiche sul dispositivo 15 minuti prima dell'inizio dello slot.
3. **Visibilità Immediata del Programma della Serata:** Il titolo dell'evento e la descrizione contengono esattamente gli argomenti matematici e le dispense da affrontare.

#### Conformità allo Standard RFC 5545 (iCalendar)
Il generatore implementa le specifiche **RFC 5545**:
- Terminatori di riga standard CRLF (`\r\n`).
- Proprietà di intestazione calendario:
  - `VERSION:2.0`
  - `PRODID:-//StudiPlanner//UNIMORE Ingegneria Informatica//IT`
  - `CALSCALE:GREGORIAN`
  - `METHOD:PUBLISH`
  - `X-WR-CALNAME:StudiPlanner UNIMORE (Analisi 1 & Geometria)`
  - `X-WR-TIMEZONE:Europe/Rome`

#### Formattazione Temporale e Gestione Fusi Orari
Le date e gli orari vengono formattati tramite `formatIcsDateTime`:
```javascript
export function formatIcsDateTime(dateStr, timeStr) {
  // dateStr: "YYYY-MM-DD", timeStr: "HH:mm"
  const cleanDate = dateStr.replace(/-/g, "");
  const [hours, mins] = timeStr.split(":");
  return `${cleanDate}T${hours.padStart(2, "0")}${mins.padStart(2, "0")}00`;
}
```
L'orario di fine sessione viene calcolato dinamicamente sommando la capacità oraria effettiva del giorno tramite `addHoursToTime`:
```javascript
export function addHoursToTime(timeStr, hoursToAdd) {
  const [h, m] = timeStr.split(":").map(Number);
  const totalMins = Math.round(h * 60 + m + hoursToAdd * 60);
  const newH = Math.floor(totalMins / 60) % 24;
  const newM = totalMins % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}
```

#### Sanitizzazione ed Escape dei Campi Testuali
Conformemente a RFC 5545 §3.3.11, i caratteri speciali che fungono da separatori sintattici devono essere preceduti da backslash (`\`):
```javascript
export function escapeIcsText(text) {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}
```

#### Struttura Evento (`VEVENT`), Syllabus e Promemoria (`VALARM`)
Per ciascuna giornata in cui il Rebalancer ha programmato argomenti didattici (`day.scheduledTopics.length > 0`), viene creato un blocco `VEVENT`:

1. **UID Deterministico:** `sp-${day.date}-${index}@studiplanner.unimore.it`, per permettere la re-importazione e l'aggiornamento automatico degli eventi nei client di calendario.
2. **SUMMARY:** Sintesi rapida dei codici e titoli (es. `Studio: A-04 Limiti notevoli + G-03 Matrici trasposte`).
3. **DESCRIPTION:** Scheda dettagliata formattata:
   - Data e nome del giorno.
   - Ore effettive assegnate.
   - Elenco puntato di ciascun argomento con ore stimate e materia.
   - Data obiettivo sessione esami (`10 Gennaio 2027`).
4. **LOCATION:** `"Postazione Studio / Casa"`.
5. **STATUS / TRANSP:** `STATUS:CONFIRMED` e `TRANSP:OPAQUE` (segna l'orario come "Occupato" nei calendari condivisi).
6. **Allarme Sonoro / Notifica Push (`VALARM`):**
   ```ics
   BEGIN:VALARM
   TRIGGER:-PT15M
   ACTION:DISPLAY
   DESCRIPTION:Inizio studio tra 15 minuti: ...
   END:VALARM
   ```

#### Differenziazione Fasce Orarie Feriali vs Weekend con Time Shifter

Il servizio calcola l'orario di inizio e la durata in base alla natura del giorno:
- **Giorni Feriali (Lunedì - Venerdì):**
  - Orario Inizio predefinito: `19:30`.
  - Durata base: `2.5h` (fine stimata: `22:00`).
- **Giorni Festivi (Sabato - Domenica):**
  - Orario Inizio predefinito: `10:00`.
  - Durata base: `4.5h` (fine stimata: `14:30`).
- **Override Time Shifter:** Se lo studente ha impostato una capacità personalizzata per quel giorno (es. `3.5h` per una serata libera o `1.0h` per un imprevisto), `day.effectiveCapacity` sovrascrive automaticamente la durata base e adatta l'orario di fine (`DTEND`).

#### Generazione Client-Side e Trigger Download via Blob

Il download del file `.ics` avviene senza alcun passaggio di rete verso server esterni, sfruttando le API native del browser:
```javascript
export function downloadIcsCalendar(calendarDays = [], filename = "StudiPlanner_UNIMORE_Calendario.ics") {
  const icsContent = generateIcsCalendar(calendarDays);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

---

### 5. Schemi Dati e Payload di Sincronizzazione

#### Payload Stato Globale (`studiplanner-state.json`)
Questo payload JSON rappresenta lo snapshot completo persistito sia nel repository GitLab che nei backup JSON manuali:

```json
{
  "exportDate": "2026-11-18T22:30:00.000Z",
  "settings": {
    "targetExamDate": "2027-01-10",
    "currentSimulatedDate": "2026-11-18",
    "weekdayHours": 2.5,
    "weekendHours": 4.5,
    "criticalWeeklyHours": 25,
    "bufferMultiplier": 1.2
  },
  "topics": [
    {
      "id": "A-01",
      "materia": "Analisi 1",
      "capitolo": "Fondamenti e Numeri",
      "argomento": "Insiemi numerici, estremo superiore e inferiore, assioma di completezza",
      "oreStimate": 2.5,
      "oreEffettive": 2.5,
      "prioritaEsame": 3,
      "difficolta": 2,
      "completato": true,
      "isCompleted": true,
      "completedDate": "2026-11-16",
      "note": "Rivedere dimostrazione dell'unicità dell'estremo superiore",
      "scratchpadNotes": "Rivedere dimostrazione dell'unicità dell'estremo superiore",
      "feynmanChecklist": {
        "intuitive": true,
        "formal": true,
        "proof": false
      }
    },
    {
      "id": "G-01",
      "materia": "Geometria",
      "capitolo": "Matrici e Sistemi Lineari",
      "argomento": "Definizione di matrice, operazioni, prodotto righe per colonne",
      "oreStimate": 2.0,
      "oreEffettive": 0,
      "prioritaEsame": 4,
      "difficolta": 2,
      "completato": false,
      "isCompleted": false,
      "completedDate": null,
      "note": "",
      "scratchpadNotes": "",
      "feynmanChecklist": {
        "intuitive": false,
        "formal": false,
        "proof": false
      }
    }
  ],
  "customDayCapacities": {
    "2026-11-19": 3.0,
    "2026-11-20": 1.5
  },
  "studySessions": [
    {
      "id": "sess-1700345678901-ab3f",
      "date": "2026-11-18",
      "topicId": "A-01",
      "hours": 2.5,
      "completed": true,
      "notes": "Completato studio teorico ed esercizi sul libro",
      "timestamp": "2026-11-18T21:45:00.000Z"
    }
  ]
}
```

#### Schema Configurazione GitLab
Memorizzato nella chiave `unimore_rebalancer_gitlab_config_v1` di `localStorage`:

```json
{
  "enabled": true,
  "autoSync": true,
  "instanceUrl": "https://gitlab.com",
  "projectId": "utente-unimore/studiplanner-data",
  "branch": "main",
  "filePath": "data/studiplanner-state.json",
  "token": "glpat-xxxxxxxxxxxxxxxxxxxx",
  "lastSynced": "22:45:12",
  "lastCommitId": "8f3b4c12d9a7e0e5",
  "syncStatus": "success",
  "errorMessage": null
}
```

#### Esempio di File iCalendar Generato (`.ics`)
Estratto reale dell'output generato da `generateIcsCalendar`:

```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//StudiPlanner//UNIMORE Ingegneria Informatica//IT
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:StudiPlanner UNIMORE (Analisi 1 & Geometria)
X-WR-TIMEZONE:Europe/Rome
X-WR-CALDESC:Programma di studio ottimizzato per studente lavoratore UNIMORE
BEGIN:VEVENT
UID:sp-2026-11-19-0@studiplanner.unimore.it
DTSTAMP:20261118T223000Z
DTSTART:20261119T193000
DTEND:20261119T220000
SUMMARY:Studio: A-04 Limiti notevoli e forme indeterminate
DESCRIPTION:Sessione di Studio StudiPlanner UNIMORE\nData: 2026-11-19 (Giovedì)\nOre assegnate: 2.5h\n\nArgomenti in programma:\n• [A-04] Limiti notevoli e forme indeterminate (3h stimate\, Analisi 1)\n\nObiettivo Sessione Esami: 10 Gennaio 2027.
LOCATION:Postazione Studio / Casa
STATUS:CONFIRMED
TRANSP:OPAQUE
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Inizio studio tra 15 minuti: A-04 Limiti notevoli e forme indeterminate
END:VALARM
END:VEVENT
END:VCALENDAR
```

---

### 6. Sicurezza, Privacy e Politiche CORS

1. **Politica CORS di GitLab API v4:**  
   GitLab supporta nativamente richieste Cross-Origin Resource Sharing (`CORS`) da qualsiasi dominio web (`Access-Control-Allow-Origin: *`) per gli endpoint `/api/v4/`. Questo consente a StudiPlanner di dialogare con GitLab direttamente da `localhost`, da `https://mio-dominio.it` o tramite protocollo file `file://` senza bisogno di proxy server o proxy CORS terzi.
2. **Archiviazione Sicura del Token:**  
   Il Personal Access Token GitLab risiede solo nella memoria di `localStorage` del browser dell'utente. Non viene mai salvato nel file di backup JSON esportato, né nel payload inviato a GitLab stesso.
3. **Principio del Minimo Privilegio (POLP):**  
   Si consiglia all'utente di creare un repository GitLab dedicato e **privato** (es. `studiplanner-backup`) e di generare un Personal Access Token con validità temporale limitata (es. fino al 10 Gennaio 2027) avente scope circoscritto a `read_repository` e `write_repository`.
4. **Isolamento Dati:**  
   Tutte le operazioni di parsing (SheetJS, CSV) e di export iCalendar avvengono nella sandbox JavaScript del browser. Nessun file caricato dall'utente viene inviato a server esterni durante l'elaborazione.
