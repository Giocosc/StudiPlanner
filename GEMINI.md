# 🤖 Antigravity / Gemini — Workspace Guidelines & Standards
## StudiPlanner (UNIMORE — Ingegneria Informatica)

Questo documento definisce il contesto operativo, gli standard architetturali, i vincoli algoritmici e le linee guida per qualsiasi conversazione e sessione di sviluppo all'interno di questo repository.

---

### 1. Profilo Utente e Contesto Accademico
- **Utente:** Studente lavoratore a tempo pieno (**Full-Time**, orario d'ufficio 9:00 - 18:00).
- **Corso di Laurea:** Ingegneria Informatica, **UNIMORE** (Università di Modena e Reggio Emilia), Coorte 2021.
- **Insegnamenti Coinvolti:**
  1. **Analisi Matematica 1** (32 argomenti didattici, da `A-01` a `A-32`).
  2. **Geometria e Algebra Lineare** (31 argomenti didattici, da `G-01` a `G-31`).
- **Data Target Esame:** **10 Gennaio 2027** (Data limite fissa per il completamento del programma).
- **Data Inizio Sessione (Roadmap):** 16 Novembre 2026.

---

### 2. Vincoli Didattici e Modello di Studio (IMMUTABILI)

#### A. Rispetto della Propedeuticità Sequenziale
- **REGOLA FONDAMENTALE:** La sequenza di studio degli argomenti **NON deve mai essere alterata** da ordinamenti basati su Priorità, Difficoltà o pesi.
- Gli argomenti matematici sono strettamente propedeutici e devono seguire sempre l'ordine dell'ID:
  - Analisi 1: `A-01` $\rightarrow$ `A-02` $\rightarrow$ ... $\rightarrow$ `A-32` (la Prova Generale Finale `A-32` va sempre e solo all'ultima settimana pre-esame).
  - Geometria: `G-01` $\rightarrow$ `G-02` $\rightarrow$ ... $\rightarrow$ `G-31`.

#### B. Uso di Priorità e Difficoltà
- I campi `Priorità_Esame` (1-5) e `Difficoltà` (1-5) devono essere utilizzati **ESCLUSIVAMENTE** per:
  1. **Buffer Temporale (+20%):** Se Priorità $\ge 4$ o Difficoltà $\ge 4$, alloca $T_{\text{effettivo}} = T_{\text{stimato}} \times 1.20$.
  2. **Badge Visivi della UI:** Colori, indicatori numerici e tag di allerta.

#### C. Modello di Capacità Oraria (Lavoratore) & Time Shifter
- **Feriali (Lun-Ven):**
  - **Regime Base (Serale):** default **2.5h/sera** (fascia 19:30 - 22:00).
  - **Time Shifter (Slot Extra Dinamici):** override puntuale per singola data (`customDayCapacities`) tramite stepper UI `[- 30m]` e `[+ 30m]` per pausa pranzo, permessi o anticipi pre-lavoro.
- **Weekend (Sab-Dom):** Blocchi intensivi diurni (default **4.5h/giorno**), anch'essi modulabili tramite Time Shifter.
- **Soglia Critica di Sicurezza:** **Dinamica** (default 25 ore/settimana, estendibile fino a 35h con slot extra attivi). Se superata, attivare sempre il banner di allerta sovraccarico.

#### D. Meccanica del Rolling Rebalancer (Adattivo Continuo)
- **Giorni saltati:** Se uno o più giorni non vengono dedicati allo studio, gli argomenti non svolti **non vengono mai cancellati**, ma slittano automaticamente a partire dalla data odierna ("Oggi").
- **Anticipi:** Se lo studente spunta argomenti futuri in anticipo, i giorni successivi attingono immediatamente dagli argomenti a seguire, liberando tempo per il ripasso finale.
- **Allocazione a blocchi:** nessun giorno supera il proprio budget; un argomento lungo viene diviso in parti su giorni consecutivi, senza mai alterare la sequenza.
- **Saturazione:** se il programma non entra nei budget prima dell'esame, i budget vengono scalati uniformemente (`capacityScale`) e la situazione viene segnalata. Mai accumulare il residuo sugli ultimi giorni.
- **Giorno d'esame:** nessuno studio pianificato in `targetExamDate`; la prova generale `A-32` solo negli ultimi 7 giorni.
- **Time Shifter:** budget giornaliero limitato a 0–12 h (`clampDayCapacity`). Un budget di 0 h è valido e va rispettato.

Algoritmo completo: [docs/02_REBALANCER_ENGINE.md](docs/02_REBALANCER_ENGINE.md).

---

### 3. Architettura Frontend & Tecnologie

- **Stack:** Single Page Application responsive (Mobile, Tablet, Desktop) in **React 18** (senza build tool pesanti come Webpack/Vite complessi: gira autonomamente nel browser).
- **Stile:** **Tailwind CSS** con **Dark Mode di default** (`#070b14`), palette colori distintive:
  - Analisi 1: Smeraldo / Teal (`#10b981`)
  - Geometria: Indaco / Viola (`#6366f1`)
  - Allerta: Rosa / Ambra (`#f43f5e`, `#f59e0b`)
- **Icone:** Icone SVG native zero-dependency definite in `src/components/Icons.js`.
- **Parsing Spreadsheet:** Libreria SheetJS (`XLSX`) caricata da `vendor/` (con fallback CDN) per lettura/scrittura di `.xlsx`, `.ods`, `.xls`.
- **Persistenza:** `localStorage` (chiavi al §6) con backup JSON, file locale (File System Access API) e sync GitLab opzionale.
- **Bundle:** `scripts/build_bundle.py` concatena i moduli di `src/` in un unico scope: niente nomi top-level duplicati tra file diversi; ogni nuovo file va aggiunto a `files_order`.
- **Regole di business nei servizi puri** (`src/services/`), testati in Node con `npm test`. Le transizioni di stato degli argomenti passano da `topicStateService.js`.

---

### 4. Flusso di Lavoro Obbligatorio per le Modifiche al Codice

Tutto il codice sorgente modulare risiede in `src/`.  
L'applicazione in esecuzione in `index.html` consuma `bundle.js`.

> [!IMPORTANT]
> **REGOLA DI COMPILAZIONE DEL BUNDLE:**
> Ogni volta che si modifica qualsiasi file in `src/` (`src/app.js`, `src/services/*`, `src/components/*`), è **obbligatorio** rieseguire lo script di build per sincronizzare `bundle.js`:
> ```powershell
> python scripts\build_bundle.py
> ```
> Dopo aver generato il bundle, verificare il corretto funzionamento eseguendo:
> ```powershell
> npm test
> python scripts\test_rolling_rebalance.py
> python scripts\test_tonight_and_mock_exams.py
> ```
> `npm test` (Node ≥ 16, nessuna dipendenza) esegue i test unitari in `tests/` e verifica che il bundle venga transpilato. Ogni bug corretto in un servizio va coperto da un test.

---

### 5. Mappa dei File Chiave del Workspace

- `index.html`: Entry point dell'applicazione web.
- `bundle.js`: Bundle consolidato per l'esecuzione browser.
- `server.py`: Server di sviluppo Python locale (porta 3000, supporto CORS e no-cache).
- `start-app.bat`: Script di avvio rapido con doppio clic su Windows.
- `src/services/rebalancerEngine.js`: Motore matematico di ribilanciamento e calendario.
- `src/services/topicStateService.js`: Regole di completamento e ore degli argomenti (sessioni, cancellazioni, spunte, `updatedAt`).
- `src/services/parserService.js`: Import CSV/TXT/Excel e fusione col catalogo senza perdere il progresso.
- `src/services/calendarExportService.js`: Export iCalendar dei blocchi pianificati.
- `src/services/gitlabSyncService.js`: Sync GitLab REST v4: pull → merge → push con `last_commit_id`.
- `tests/`: Test unitari Node (`npm test`).
- `src/components/WeeklyTodo.js`: Vista operativa to-do giorno per giorno con Time Shifter.
- `src/components/HistoryLog.js`: Timeline e diario storico delle date passate con rollback delle sessioni.
- `src/components/Dashboard.js`: Progress bar Analisi/Geometria, metriche KPI, telemetria e countdown esame.
- `src/components/LogStudyModal.js`: Modal per registrazione sessioni con Topic Picker filtrabile per materia.
- `src/components/TopicDetailModal.js`: Scheda informativa immersiva con Programma didattico, Teoremi/Dimostrazioni d'esame UNIMORE e Diario sessioni.
- `src/components/FileImporter.js`: Centro import/export (Excel, CSV, backup JSON, File System API e GitLab).
- `src/components/SettingsModal.js`: Configurazione parametri di studio e simulazione data.
- `src/data/defaultData.js`: Dataset precaricato dei 63 argomenti ufficiali UNIMORE.
- `Analisi/Analisi.csv` e `Geometria/Geometria.txt`: Dataset CSV canonici.
- `GUIDA_APPLICAZIONE.md`: Manuale utente completo ed esaustivo.
- `README.md`: Documentazione pubblica del repository GitHub.

---

### 6. Schema Dati e Chiavi di Persistenza (LocalStorage & Cloud JSON)

Tutti i dati dell'applicazione persistono in parallelo su **HTML5 LocalStorage** e su **GitLab Cloud** (`data/studiplanner-state.json`):

| Chiave LocalStorage | Tipo | Descrizione |
| :--- | :--- | :--- |
| `unimore_rebalancer_topics_v2` | `Array<Topic>` | 63 argomenti (`id`, `materia`, `capitolo`, `argomento`, `oreStimate`, `oreEffettive`, `prioritaEsame`, `difficolta`, `completato`/`isCompleted`, `completedDate`, `note` ufficiale, `scratchpadNotes`, `updatedAt`, …) |
| `unimore_rebalancer_settings_v2` | `Object` | Parametri globali (`roadmapStartDate: '2026-11-16'`, `targetExamDate: '2027-01-10'`, `currentSimulatedDate`, `weekdayStudyHours: 2.5`, `weekendStudyHours: 4.5`, `criticalWeeklyHoursThreshold: 25`, `highPriorityThreshold: 4`, `bufferMultiplier: 1.2`, `studyDays`) |
| `unimore_rebalancer_custom_capacities_v2` | `Object<string, number>` | Override giornalieri Time Shifter (`{"2026-11-18": 3.0, "2026-11-19": 1.5}`), 0–12 h |
| `unimore_rebalancer_sessions_v2` | `Array<StudySession>` | Registro delle sessioni (`id`, `date`, `topicId`, `hours`, `completed`, `note`, `timestamp`) |
| `unimore_rebalancer_deleted_sessions_v1` | `Array<string>` | Tombstone: ID delle sessioni cancellate |
| `unimore_rebalancer_sync_meta_v1` | `Object` | `settingsUpdatedAt`, `capacitiesUpdatedAt`, `mathBugsUpdatedAt` |
| `unimore_rebalancer_math_bugs_v1` | `Array<MathBug>` | Registro degli errori ricorrenti |
| `unimore_rebalancer_pomodoro_v2` | `Object` | Stato dei timer Pomodoro per argomento |
| `unimore_rebalancer_gitlab_config_v1` | `GitLabConfig` | Configurazione sincronizzazione GitLab (`enabled`, `autoSync`, `instanceUrl`, `projectId`, `branch`, `filePath`, `token`, `lastSynced`, `lastCommitId`, `syncStatus`) |

Il campo `note` è il focus didattico **ufficiale** del dataset (usato da simulatore e flashcard): gli appunti dell'utente vanno solo in `scratchpadNotes`.

---

### 7. Architettura di Sincronizzazione GitLab Cloud (REST API v4)

L'applicazione comunica direttamente dal browser client con GitLab senza alcun server middleware proprietario:
1. **Endpoint Progetto:** `GET {instanceUrl}/api/v4/projects/{projectId}` con header `PRIVATE-TOKEN: {token}` per verificare i permessi (`api` o `read/write_repository`).
2. **Ogni sync è pull → merge → push** (`syncWithGitLab`): `GET .../repository/files/{filePath}?ref={branch}`, decodifica Base64 con `TextDecoder("utf-8")` per preservare gli accenti, fusione con lo stato locale (`mergeStudyPlannerStates`), poi `PUT` con `last_commit_id` (o `POST` se il file non esiste). Se un altro dispositivo ha scritto nel frattempo GitLab rifiuta: si rilegge e si rifonde (max 3 tentativi). Nessun commit se lo stato remoto è già allineato.
3. **Quando:** all'avvio, 2,5 s dopo l'ultima modifica (debounce) e al rientro nell'app (focus/visibilità, max uno ogni 30 s).
4. **Regole di fusione:** sessioni unite per ID meno i tombstone; stato degli argomenti per `updatedAt` più recente; `oreEffettive` = ore delle sessioni fuse + correzioni manuali; `note` e `scratchpadNotes` separati; Time Shifter, impostazioni e bug tracker per `syncMeta`; `currentSimulatedDate` sempre locale. La fusione deve restare idempotente.
5. **Cache:** le chiamate `/api/` non devono mai essere servite dal Service Worker (`sw.js`) né dalla cache HTTP (`cache: "no-store"`).
6. **Resilienza Offline:** In assenza di connettività, l'app opera al 100% su LocalStorage e sincronizza il cloud appena la rete ritorna disponibile.

Dettagli: [docs/03_SERVICES_AND_SYNC.md](docs/03_SERVICES_AND_SYNC.md).
