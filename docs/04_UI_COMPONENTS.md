# 🖥️ Documentazione dell'Interfaccia Utente e dei Componenti React
## StudiPlanner — Ingegneria Informatica UNIMORE (Coorte 2021)

Questo documento fornisce una disamina tecnica, architetturale e stilistica esaustiva di tutti i componenti React residenti in `src/components/` e della loro orchestrazione all'interno di `src/app.js`.

---

## 1. Panoramica Architetturale dell'Interfaccia Utente

StudiPlanner è strutturato come una **Single Page Application (SPA)** autonoma, ad alte prestazioni e a zero dipendenze da complessi bundler server-side (Vite/Webpack), basata su **React 18** e compilata via script di build (`scripts/build_bundle.py`) in un unico file ottimizzato `bundle.js`.

L'interfaccia utente è interamente ottimizzata per il profilo di uno **studente lavoratore full-time** (fasce serali feriali 19:30 - 22:00 e sessioni intensive diurne nel weekend), garantendo un controllo visivo immediato su:
1. **Pacing di Studio Reale vs Atteso** per ciascuna materia (Analisi Matematica 1 e Geometria e Algebra Lineare).
2. **Modulazione Dinamica del Carico Orario (Time Shifter)** con stepper puntuali `[- 30m]` e `[+ 30m]`.
3. **Tracciamento Progressivo Granulare** (ore effettive parziali e completamento formale).
4. **Resilienza Psicologica e Motivazionale** tramite streak quotidiana, badge di maestria didattica e il companion di bordo interattivo `CLARKE-9000`.

### 1.1 Gerarchia dei Componenti (Component Tree)

```mermaid
flowchart TD
    App["App (src/app.js)"]
    
    %% Header & Global Controls
    Header["Top Header & Navigation Bar"]
    App --> Header
    App --> MainContainer["Main Container (Tabs & Split View)"]
    App --> BottomNav["Mobile Bottom Navigation Bar"]
    
    %% Tab Views
    MainContainer --> TabDash["Dashboard (activeTab == 'dashboard')"]
    MainContainer --> TabWeek["WeeklyTodo (activeTab == 'weekly')"]
    MainContainer --> TabHist["HistoryLog (activeTab == 'history')"]
    MainContainer --> TabTopics["TopicsTable (activeTab == 'topics')"]
    MainContainer --> TabImport["FileImporter (activeTab == 'import')"]
    MainContainer --> SplitPdf["PdfSplitView (isPdfSplitOpen)"]
    
    %% Dashboard Subcomponents
    TabDash --> DashBurn["BurndownChart"]
    TabDash --> DashSim["ExamSimulator (Modal)"]
    TabDash --> DashNeura["NeuraDeckPromptGenerator (Modal)"]
    
    %% History Subcomponents
    TabHist --> HistHeat["ActivityHeatmap"]
    
    %% Global Modals & Drawers
    App --> ModalSettings["SettingsModal (isSettingsOpen)"]
    App --> ModalLog["LogStudyModal (isLogModalOpen)"]
    App --> ModalDetail["TopicDetailModal (selectedTopicDetail)"]
    App --> ModalBugs["MathBugTracker (isBugTrackerOpen)"]
    App --> DrawerFormula["MathFormulaDrawer (isFormulaDrawerOpen / F2)"]
    App --> ModalRetro["WeeklyRetrospectiveModal (isRetroModalOpen)"]
    App --> Companion["Clarke9000Companion (Floating Widget)"]
    App -.-> StubAlert["AlertBanner (Stub Compatibilità)"]
```

---

## 2. Design System & Dark Mode

L'identità visiva dell'applicazione è fondata su un tema Dark Mode immersivo e coerente, implementato tramite **Tailwind CSS** e arricchito da tinte semantiche calibrate per evitare l'affaticamento visivo durante le sessioni di studio notturne.

### 2.1 Tavolozza Colori Semantica (Color Palette)

| Ambito Semantico | Valore Esadecimale | Classi Tailwind Chiave | Utilizzo nell'Interfaccia |
| :--- | :--- | :--- | :--- |
| **Sfondo Principale (Background)** | `#070b14` | `bg-[#070b14]`, `bg-slate-950` | Body, canvas principale, sfondi dei modali e barre di navigazione |
| **Superficie Card & Modali** | `#0f172a` / `#111827` | `bg-slate-900/80`, `bg-slate-950/90` | Contenitori, card, finestre di dialogo, tabelle con `backdrop-blur-md` |
| **Bordi & Separatori** | `#1e293b` / `#334155` | `border-slate-800/80`, `border-slate-700/50` | Contorni dei componenti, divisori di riga e input |
| **Analisi Matematica 1** | `#10b981` (Emerald) / `#14b8a6` (Teal) | `text-emerald-400`, `bg-emerald-500/20`, `border-emerald-500/30` | Badge Analisi, barre di avanzamento, pulsanti d'azione positiva |
| **Geometria e Algebra Lineare** | `#6366f1` (Indigo) / `#8b5cf6` (Purple) | `text-indigo-400`, `bg-indigo-500/20`, `border-indigo-500/30` | Badge Geometria, blocco weekend, grafici e accenti di secondo ordine |
| **Allerte & Fabbisogno Critico** | `#f43f5e` (Rose) | `text-rose-400`, `bg-rose-950/40`, `border-rose-500/40` | Superamento soglia 25h/settimana, errori, ripassi scaduti |
| **Buffer & Attenzione** | `#f59e0b` (Amber) | `text-amber-400`, `bg-amber-500/20`, `border-amber-500/30` | Badge +20% Buffer, giorni saltati, streak di studio |
| **Azioni Primarie & Timer** | `#06b6d4` (Cyan) | `text-cyan-400`, `bg-cyan-500/20`, `ring-cyan-500/40` | Giorno "Oggi", timer Pomodoro, indicatori di focus |

### 2.2 Micro-Interazioni e Feedback Visivo
- **Trasparenze e Backdrop Blur:** Tutte le superfici flottanti (Header, Card, Modali) utilizzano `backdrop-blur-md` o `backdrop-blur-xl` su sfondi con opacità al 80-90% per conservare la profondità visiva.
- **Transizioni di Pressione (`active:scale-95`):** Tutti i pulsanti interattivi (stepper, registrazione ore, checkbox completamento) riducono istantaneamente la scala al tocco o al click per un feeling nativo.
- **Indicatore Temporale Dinamico:** La data corrente ("Oggi") è costantemente evidenziata da un anello luminoso `ring-1 ring-cyan-500/40` e da animazioni sottili `animate-pulse-subtle`.

---

## 3. Navigazione, Tab & Routing Client-Side

L'architettura di navigazione gestisce il routing interamente nello stato React di `App.js` tramite la variabile di stato `activeTab`.

### 3.1 Flusso di Navigazione Desktop e Mobile
1. **Desktop Header (`sticky top-0 z-40`):**
   - **Branding:** Logo StudiPlanner con gradiente ciano-indaco e tag "UNIMORE Ingegneria".
   - **Tab Switcher:** Pill centrale a 5 vie (`dashboard`, `weekly`, `history`, `topics`, `import`).
   - **Quick Action Bar:**
     - Pulsante rapido `+ Registra Studio` (apre `LogStudyModal`).
     - Pulsante `📐 Formulario [F2]` (apre `MathFormulaDrawer`).
     - Pulsante `📖 Split PDF` (attiva la modalità affiancata responsive a 12 colonne).
     - Indicatori di stato real-time per GitLab Cloud Sync e File System Access API.
     - Pill di simulazione data (stepper `◀` / `▶` e pulsante `Oggi Reale`).
     - Countdown esame in giorni (`metrics.remainingDays`).
     - Pulsante installazione PWA (se non in modalità standalone).
     - Pulsante parametri e impostazioni (`isSettingsOpen`).
2. **Mobile Bottom Navigation Bar (`fixed bottom-0 z-40 lg:hidden`):**
   - Barra a 5 icone con etichette testuali compatte.
   - Pulsante circolare sopraelevato centrale (`+ Studio`) per il logging rapido con una sola mano da smartphone.

```mermaid
stateDiagram-v2
    [*] --> Dashboard: Avvio / Default
    Dashboard --> WeeklyTodo: Click Tab Settimanale
    WeeklyTodo --> HistoryLog: Click Tab Storico
    HistoryLog --> TopicsTable: Click Tab Argomenti
    TopicsTable --> FileImporter: Click Tab Import/Sync
    FileImporter --> Dashboard: Click Tab Dashboard
    
    state "Viste Globali & Modali Sovrapposti" as Overlays {
        LogStudyModal
        TopicDetailModal
        SettingsModal
        MathBugTracker
        MathFormulaDrawer
        WeeklyRetrospectiveModal
        PdfSplitView
    }
    
    Dashboard --> Overlays: Apertura Modal / F2 / Split PDF
    WeeklyTodo --> Overlays: Apertura Modal / F2 / Split PDF
    HistoryLog --> Overlays: Apertura Modal / F2 / Split PDF
    TopicsTable --> Overlays: Apertura Modal / F2 / Split PDF
    FileImporter --> Overlays: Apertura Modal / F2 / Split PDF
```

---

## 4. Analisi Dettagliata dei Componenti (Viste Tab)

### 4.1 `Dashboard.js` — Centrale Operativa e Telemetria

#### Scopo e Ruolo Architetturale
`Dashboard.js` è il centro direzionale dell'applicazione. Sintetizza lo stato globale della preparazione, confronta l'avanzamento reale rispetto alla traiettoria ideale verso il 10 Gennaio 2027, calcola la probabilità euristica di superamento dell'esame e fornisce l'accesso rapido a tutti gli strumenti di supporto didattico.

#### Props Ricevute
| Prop | Tipo | Descrizione |
| :--- | :--- | :--- |
| `progress` | `Object` | Oggetto con le percentuali e le ore per `analisi`, `geometria` e `global` |
| `metrics` | `Object` | Metriche generate dal motore di ribilanciamento (`remainingDays`, `remainingWeeks`, `requiredWeeklyHours`, `isCriticalOverload`, `examPrediction`, `studyStreak`, `spacedRepetition`, ecc.) |
| `onTabChange` | `Function` | Callback `(tabName) => void` per cambiare la vista principale (es. redirezione a `weekly`) |
| `topics` | `Array<Topic>` | Array completo dei 63 argomenti con stato di completamento e ore |
| `settings` | `Object` | Parametri attuali di studio (`currentSimulatedDate`, `targetExamDate`, ecc.) |
| `onOpenLogModal` | `Function` | Callback `(initialData) => void` per aprire il modal di registrazione studio |
| `onOpenTopicDetail` | `Function` | Callback `(topicOrId) => void` per aprire la scheda dettagliata dell'argomento |
| `onToggleSpacedReview` | `Function` | Callback `(topicId, levelKey, isDone) => void` per marcare un ripasso ciclico |
| `mathBugs` | `Array<Object>` | Lista dei trabocchetti matematici registrati nel Bug Tracker |
| `onOpenBugTracker` | `Function` | Callback per aprire il modal del Math Bug Tracker |

#### Stato Interno
- `isFlashcardsOpen` (`boolean`): Controlla l'apertura del generatore flashcard NeuraDeck.
- `isExamSimulatorOpen` (`boolean`): Controlla l'apertura del simulatore d'esame scritto cronometrato.

#### Sezioni Interne & Logica di Calcolo
1. **Algoritmo di Pacing Didattico (`getSubjectPacing`):**
   Calcola per ciascuna materia lo scostamento orario tra le ore completate a oggi e quelle teoricamente previste in base al tempo trascorso tra il 16 Novembre 2026 e il 10 Gennaio 2027:
   $$\text{ProgressRatio} = \frac{\text{DataCorrente} - \text{DataInizio}}{\text{DataEsame} - \text{DataInizio}}$$
   $$\Delta_{\text{ore}} = \text{OreEffettuate} - (\text{OreTotaliMateria} \times \text{ProgressRatio})$$
   - $\Delta_{\text{ore}} \ge +0.8\text{h}$: Badge `🚀 In Vantaggio` (Emerald).
   - $-1.5\text{h} \le \Delta_{\text{ore}} < +0.8\text{h}$: Badge `🎯 Al Passo (Allineato)` (Cyan).
   - $\Delta_{\text{ore}} < -1.5\text{h}$: Badge `⚠️ In Ritardo` (Amber).
2. **Spaced Repetition Alert Banner:** Compare automaticamente se ci sono ripassi teorici in scadenza oggi o arretrati (Curva di Ebbinghaus $R_1, R_2, R_3$).
3. **Fila Card KPI (4 metriche critiche):**
   - *Target Esame:* Giorni e settimane rimanenti al 10 Gennaio 2027.
   - *Fabbisogno Settimanale:* Ore/settimana necessarie con banner dinamico in caso di superamento della soglia critica (25h).
   - *Ore Residue:* Ore rimanenti comprensive della quota buffer (+20%).
   - *Completamento Globale:* Percentuale totale su ore e temi completati.
4. **Centrale della Costanza (Streak & Titoli UNIMORE):**
   Traccia la serie di giorni consecutivi di studio (es. *Innesco Serale*, *Fiamma di Costanza*, *Resilienza Lavoratore d'Acciaio*, *Maestro della Disciplina UNIMORE*, *Leggenda Vivente UNIMORE*), progresso verso il livello successivo e citazione motivazionale quotidiana.
5. **Previsione Esame & Voto Atteso (Modello Euristico):**
   Visualizza la probabilità di superamento stimata (0-100%), il voto atteso in trentesimi (es. "27 - 29/30"), il tasso di costanza nelle sere feriali e l'indice di completamento didattico.
6. **Card di Avanzamento Materie (Doppio Motore Analisi / Geometria):**
   Barre graduate di progresso con marcatore dorato del target teorico odierno (`pacing.expectedPercent`), statistiche di dettaglio (argomenti, ore residue, struttura prova scritta).
7. **Scrum / Agile Burndown Chart Integrato:** Embedding diretto del componente `BurndownChart.js`.
8. **Hub Strumenti Didattici AI:** Card per Flashcard NeuraDeck, Simulatore d'Esame e Bug Tracker Matematico.

---

### 4.2 `WeeklyTodo.js` — Vista Operativa Giorno per Giorno

#### Scopo e Ruolo Architetturale
Costituisce il cuore dell'operatività quotidiana dello studente lavoratore. Visualizza il piano di studio dettagliato per ogni giorno della settimana selezionata, gestisce il Time Shifter, il timer Pomodoro 50/10 e la registrazione granulare delle ore.

#### Props Ricevute
| Prop | Tipo | Descrizione |
| :--- | :--- | :--- |
| `weeklyPlans` | `Array<WeekPlan>` | Piani settimanali generati dal Rebalancer con giorni, ore e argomenti |
| `calendarDays` | `Array<DaySchedule>` | Mappa di tutti i giorni dell'intero calendario per esportazione e telemetria |
| `onToggleComplete` | `Function` | Callback `(topicId) => void` per invertire lo stato di completamento del tema |
| `onUpdateTopicHours` | `Function` | Callback `(topicId, deltaOrNew, isDelta) => void` per aggiornare le ore parziali |
| `onLogStudySession` | `Function` | Callback per persistere formalmente una sessione di studio nel diario storico |
| `settings` | `Object` | Parametri globali di studio |
| `customDayCapacities` | `Object<string, number>` | Mappa degli override orari giornalieri del Time Shifter |
| `onUpdateDayCapacity` | `Function` | Callback `(dateStr, newHours) => void` per aggiornare il budget di una singola data |
| `onBatchUpdateDayCapacities` | `Function` | Callback `(updatesMap) => void` per aggiornamenti massivi (es. modalità straordinari) |
| `onOpenLogModal` | `Function` | Callback per aprire il modal di registrazione sessione con data preimpostata |
| `onOpenTopicDetail` | `Function` | Callback per aprire la scheda immersiva dell'argomento |
| `onToggleSpacedReview` | `Function` | Callback per spuntare i ripassi ciclici di teoria |
| `onOpenRetrospective` | `Function` | Callback per aprire la review settimanale della domenica sera |

#### Stato Interno
- `selectedWeekIndex` (`number`): Indice della settimana visualizzata (inizializzato sulla settimana che contiene la data "Oggi").
- `filterSubject` (`string`): Filtro per materia (`all`, `analisi`, `geometria`).
- `pomodoroAlert` (`string | null`): Messaggio temporaneo di notifica completamento ciclo Pomodoro.
- `isExpressReviewActive` (`boolean`): Attivazione del filtro d'emergenza pre-esame (sprint triage).
- `pomodoroMap` (`Object`): Stato persistente dei timer Pomodoro per argomento (`accumulatedSeconds`, `cycleRemaining`, `isRunning`, `isBreak`, `completedByTimer`), memorizzato in `unimore_rebalancer_pomodoro_v2`.

#### Meccaniche Chiave e Comportamenti Utente
1. **Week Selector Bar:**
   - Navigazione rapida fra settimane (`◀ Settimana Precedente`, `Settimana Successiva ▶`).
   - Badge descrittivi: `Settimana Attiva`, `Passata`, `>25h Sovraccarico`.
   - Monte ore totale allocato nella settimana.
   - Pulsanti di azione rapida:
     - *Modalità Straordinari (⚡):* Imposta le sere feriali a 1.0h e sposta il carico sul weekend.
     - *Bootcamp Natale (🎄):* Incrementa la capacità a 6.5h/giorno nel periodo 24 Dicembre - 6 Gennaio.
     - *Esporta .ics (📅):* Scarica il calendario iCalendar per Google Calendar/Apple Calendar.
     - *Review Domenica (📊):* Lancia la retrospettiva settimanale.
     - *Sprint Pre-Esame (🎯):* Filtra esclusivamente argomenti con Priorità $\ge 4$ o Difficoltà $\ge 4$ e prove generali (`A-32`, `G-31`).
2. **Time Shifter Stepper (`[- 30m]` / `[+ 30m]`):**
   Permette allo studente lavoratore di rimodulare il budget orario di ogni singolo giorno (da 0h a 10h a step di 0.5h). In caso di override attivo, compare il pulsante di ripristino `↺`.
3. **Card del Tema Didattico:**
   - Badge materia (`Analisi Matematica 1` in verde smeraldo, `Geometria e Algebra` in indaco).
   - ID tema con pulsante rapido `ℹ Info` per aprire la scheda dettagliata.
   - Badge di completamento con data o badge `⏳ In Corso (xh svolte)`.
   - Badge `+20% Buffer Priorità` se Priorità $\ge 4$ o Difficoltà $\ge 4$.
   - Stepper rapido ore parziali: `[- 30m]`, `[+ 30m]`, `[+ 1h]`, `[+ Log]`.
   - Micro-barra di avanzamento percentuale basata sul rapporto tra ore effettive e stimate.
   - Pulsante dedicato di spunta completamento (`Completato ✓`).
4. **Striscia Pomodoro 50/10 Interattiva:**
   Ogni card argomento include un timer Pomodoro reale (50 minuti di focus intenso alternati a 10 minuti di pausa). Al completamento dei 50 minuti di studio, il timer accredita automaticamente +0.83h sulle ore effettive del tema, registra la sessione nel diario storico e notifica l'utente con un banner. Se le ore accumulate raggiungono la stima, il tema viene spuntato in automatico come completato.

---

### 4.3 `HistoryLog.js` — Storico, Diario e Timeline

#### Scopo e Ruolo Architetturale
Rappresenta il registro retrospettivo dell'app. Permette di analizzare tutte le date passate a partire dall'inizio della roadmap (16 Novembre 2026), esaminare le sessioni di studio svolte, visualizzare come i giorni saltati sono stati gestiti dal motore rebalancer e cancellare o ripristinare singole sessioni storiche.

#### Props Ricevute
| Prop | Tipo | Descrizione |
| :--- | :--- | :--- |
| `historyDays` | `Array<HistoryDay>` | Lista dei giorni passati con sessioni, ore svolte e status (`completed` o `skipped`) |
| `calendarDays` | `Array<DaySchedule>` | Calendario globale per l'Activity Heatmap |
| `metrics` | `Object` | Statistiche su giorni studiati, giorni saltati, totale ore passate |
| `onAdvanceDate` | `Function` | Callback per simulare l'avanzamento al giorno successivo (`+1 gg`) |
| `onRetrocedeDate` | `Function` | Callback per simulare il ritorno al giorno precedente (`-1 gg`) |
| `onSetDate` | `Function` | Callback per impostare puntualmente la data attiva simulata |
| `onOpenLogModal` | `Function` | Callback per registrare ore su una data passata specifica |
| `onDeleteSession` | `Function` | Callback `(sessionId) => void` per eliminare una sessione e stornare le ore dal tema |
| `onOpenTopicDetail` | `Function` | Callback per aprire la scheda dell'argomento associato |

#### Componenti Interni
- **`ActivityHeatmap.js`:** Integrata nella parte superiore per visualizzare la griglia di contribuzione stile GitHub.
- **Timeline a Due Colonne (`grid-cols-1 xl:grid-cols-2`):** Elenca i giorni passati ordinati cronologicamente con filtri `Tutti i Giorni`, `Solo Studiati`, `Solo Saltati`. Ciascun blocco sessione include il pulsante cestino per l'eliminazione con conferma e ripristino immediato delle ore residue.

---

### 4.4 `TopicsTable.js` — Catalogo Completo degli Argomenti

#### Scopo e Ruolo Architetturale
Offre la visualizzazione tabellare esaustiva di tutti i 63 argomenti didattici ufficiali UNIMORE. Permette ricerche istantanee, filtraggi multi-criterio e operazioni batch di simulazione o azzeramento.

#### Props Ricevute
| Prop | Tipo | Descrizione |
| :--- | :--- | :--- |
| `topics` | `Array<Topic>` | Array dei 63 temi |
| `onToggleComplete` | `Function` | Inversione stato completato del tema |
| `onUpdateTopicHours` | `Function` | Aggiornamento granulare ore effettive |
| `onBatchUpdate` | `Function` | Aggiornamento massivo dell'intero array (reset o simulazione) |
| `onOpenTopicDetail` | `Function` | Apertura scheda argomento |

#### Filtri e Interazioni
- **Ricerca Full-Text:** Input reattivo che interroga contemporaneamente ID tema (es. `A-09`, `G-14`), titolo dell'argomento e nome del capitolo.
- **Filtro Materia:** Selettore a tendina (`Tutte`, `Analisi 1`, `Geometria`).
- **Filtro Stato Didattico:** Selettore (`Tutti gli Stati`, `Da Fare (0h)`, `In Corso (Parziale)`, `Solo Completati`).
- **Filtro Alta Priorità:** Tasto toggle che isola gli argomenti con Priorità $\ge 4$ o Difficoltà $\ge 4$ (quelli soggetti al buffer del +20%).
- **Batch Controls:** Link per resettare tutti i temi a "Da fare" o simulare il superamento delle prime 2 settimane didattiche a fini di test.

---

### 4.5 `FileImporter.js` — Hub di Import, Export e Sincronizzazione Cloud

#### Scopo e Ruolo Architetturale
È il modulo centrale di persistenza, importazione dati e sincronizzazione cloud senza server proprietari intermedi. Gestisce il backup JSON locale, il parsing di fogli di calcolo Excel/CSV, la sincronizzazione continua tramite **GitLab REST API v4** e la **File System Access API** del browser.

#### Props Ricevute
| Prop | Tipo | Descrizione |
| :--- | :--- | :--- |
| `topics`, `settings`, `customDayCapacities`, `studySessions` | Vari | Stato globale dell'applicazione |
| `onTopicsUpdated`, `onSettingsUpdated`, `onCustomCapacitiesUpdated`, `onStudySessionsUpdated` | `Function` | Setter dello stato globale in React |
| `fsSyncStatus` | `Object` | Stato sincronizzazione File System (`active`, `fileName`, `lastSaved`, `isSaving`, `error`) |
| `onConnectFileSystem`, `onDisconnectFileSystem`, `onTriggerManualSave` | `Function` | Handler per connettere, disconnettere o forzare il salvataggio su file JSON locale |
| `gitlabConfig` | `Object` | Parametri di configurazione GitLab Cloud (`instanceUrl`, `projectId`, `token`, `branch`, `filePath`, `autoSync`, `syncStatus`, ecc.) |
| `onUpdateGitLabConfig`, `onGitLabPull`, `onGitLabPush` | `Function` | Handler per aggiornare la config GitLab, eseguire pull o push manuale |

#### Funzionalità Chiave
1. **Sincronizzazione GitLab Cloud (REST API v4):**
   - Campi configurabili: URL istanza (default `https://gitlab.com`), Project ID, Branch (default `main`), Path del file (`data/studiplanner-state.json`), Personal Access Token.
   - Pulsante *Verifica Connessione*: invia una `GET /api/v4/projects/:id` validando permessi e connettività.
   - Tasti di *Pull Manuale* (download e merge intelligente) e *Push Manuale* (commit immediato con messaggio personalizzato).
   - Toggle per l'Auto-Sync continuativo (pull all'avvio e push debounced a 2.5s ad ogni modifica dello stato).
2. **File System Access API (Chrome / Edge):**
   - Consente di collegare direttamente un file locale `studiplanner-backup.json` sul disco del computer dello studente.
   - Ogni modifica viene salvata in modo trasparente in background tramite `FileSystemWritableFileStream`.
3. **Backup Completo JSON:** Download di uno snapshot strutturato dell'intera applicazione e ripristino istantaneo via drag & drop o file picker.
4. **Import Fogli di Calcolo (Excel XLSX, ODS, XLS e CSV):**
   - Utilizza SheetJS (`XLSX`) caricata localmente (con fallback CDN).
   - Parser intelligente con **fuzzy matching** dei nomi delle colonne (riconosce variazioni come `Argomento`, `Tema`, `Topic`, `Ore_Stimate`, `Stima_Ore`, `Priorità`, `Difficoltà`).
   - Schermata di anteprima delle differenze prima dell'applicazione effettiva allo stato.
5. **Esportazione Calendario (.ics):** Generazione client-side di file iCalendar standard per l'importazione degli slot di studio serali su Google Calendar o smartphone.
6. **Reset Dati Canonici UNIMORE:** Pulsante di ripristino sicuro che reimposta i 63 argomenti ufficiali definiti in `src/data/defaultData.js`.

---

## 5. Analisi dei Modali, Drawer e Viste Specializzate

### 5.1 `TopicDetailModal.js` — Scheda Immersiva dell'Argomento Didattico

La scheda dettagliata dell'argomento si apre cliccando sull'ID di qualsiasi tema in qualunque sezione dell'app. È articolata in 4 schede interne:

```mermaid
flowchart LR
    Modal["TopicDetailModal.js"]
    Modal --> TabOver["Overview (Panoramica)"]
    Modal --> TabTheo["Theorems (Teoremi & Dimostrazioni)"]
    Modal --> TabSess["Sessions (Diario Sessioni)"]
    Modal --> TabNotes["Notes (Appunti Scratchpad)"]
    
    TabOver --> T1["Didattica, Ore, Pacing, Subtopics"]
    TabTheo --> T2["Validazione Feynman a 3 Stadi & Formule LaTeX"]
    TabSess --> T3["Storico sessioni dedicate & Storno"]
    TabNotes --> T4["Editor Markdown con Anteprima"]
```

1. **Tab Overview:**
   - Visualizza capitolo, materia, badge ore e barre percentuali.
   - Matrice di Difficoltà (1-5) e Priorità d'Esame (1-5) con spiegazione testuale del peso per lo scritto e l'orale UNIMORE.
   - Scomposizione analitica dei sotto-argomenti didattici.
2. **Tab Teoremi & Dimostrazioni (Feynman Checklist):**
   - Rileva automaticamente se il tema richiede dimostrazioni formali.
   - Fornisce la **Validazione a 3 Stadi della Tecnica di Feynman**:
     - *Stadio 1 (Comprensione Intuitiva):* Spiegare il concetto con parole semplici senza formalismi.
     - *Stadio 2 (Definizione Formale):* Scrivere enunciato, ipotesi e tesi con rigore matematico.
     - *Stadio 3 (Dimostrazione alla Lavagna):* Ricostruire i passaggi della dimostrazione a libro chiuso.
   - Sezione formule chiave con snippet matematici e notazione KaTeX/LaTeX.
3. **Tab Diario Sessioni:** Elenca tutte le registrazioni temporali collegate a questo specifico ID, con data, ore svolte, note descrittive e opzione di cancellazione.
4. **Tab Appunti Scratchpad:** Editor di testo rapido per formule e appunti con supporto a Markdown, modalità anteprima renderizzata e inserimento rapido di template (es. Teorema, Dimostrazione, Trabocchetto d'Esame).

---

### 5.2 `LogStudyModal.js` — Registrazione Sessioni di Studio

Aperto dal pulsante globale `+` o dai tasti `Registra Studio` posizionati sui giorni del to-do:
- **Topic Picker Reattivo:** Campo di selezione argomento con ricerca full-text integrata e filtri rapidi per materia (`Analisi 1`, `Geometria`) e stato (`Tutti`, `Solo Non Completati`).
- **Anti-Desync Protection:** Se l'utente applica un filtro che esclude il tema correntemente selezionato, il modal seleziona automaticamente il primo tema valido della lista filtrata, evitando incongruenze di stato.
- **Calcolo Dinamico delle Ore Residue:** Quando si seleziona un argomento, il campo ore viene precompilato con il residuo mancante ($T_{\text{stimato}} - T_{\text{effettivo}}$).
- **Preset Rapidi:** Pulsanti a selezione istantanea `+30m`, `+1h`, `+2h`, `🍅 Pomodoro (50m / 0.8h)`.
- **Completamento Automatico Intelligente:** Se le ore inserite portano il monte ore effettivo a pareggiare o superare la stima didattica, la casella "Segna come completato" si attiva automaticamente (lasciando comunque la possibilità di override manuale).
- **Tab Sessioni Recenti:** Permette di ispezionare le ultime sessioni registrate ed eliminare eventuali inserimenti errati.

---

### 5.3 `SettingsModal.js` — Parametri di Ribilanciamento

Permette di personalizzare i vincoli orari del modello lavoratore:
- **Data Target Esame:** Default fisso al `2027-01-10`.
- **Data Odierna Simulata:** Campo data modificabile per simulare l'avanzamento temporale o giorni saltati, con tasto scorciatoia `Usa Oggi Reale` collegato all'orologio di sistema.
- **Quote Orarie di Studio Base:**
  - *Feriale Serale (Lun-Ven):* Default `2.5h/sera` (fascia 19:30 - 22:00).
  - *Weekend (Sab-Dom):* Default `4.5h/giorno` (sessioni intensive diurne).
- **Soglia Critica Settimanale:** Default `25.0h/settimana`. Se il fabbisogno calcolato dal rebalancer supera questa soglia, la UI attiva gli indicatori di allerta sovraccarico.
- **Riepilogo Override Time Shifter:** Mostra il conteggio dei giorni che hanno un override orario personalizzato con pulsante di ripristino globale.

---

### 5.4 `WeeklyRetrospectiveModal.js` — Diagnostica Domenicale

Attivabile dalla barra settimanale (in particolare la domenica sera):
- **Metriche di Efficienza Settimanale:** Calcola il rapporto percentuale fra le ore di studio effettivamente registrate e le ore target programmate nella settimana:
  $$\text{Efficienza} = \min\left(150\%, \frac{\text{OreEffettive}}{\text{OreTarget}} \times 100\right)$$
- **Diagnostica Lavoratore a Tre Livelli:**
  - *Efficienza $\ge 95\%$ (Verde Smeraldo):* Settimana esemplare. Consiglio di preservare il riposo e mantenere il regime base di 2.5h.
  - *Efficienza $70\% - 94\%$ (Ciano):* Buon ritmo. Il rolling rebalancer ha assorbito il carico residuo senza picchi critici.
  - *Efficienza $< 70\%$ (Ambra):* Accumulo di carico dovuto a straordinari aziendali.
- **Pulsante di Boost Automatizzato (+30m):** Applica istantaneamente un incremento di +30 minuti (portando le sere a 3.0h) su tutti i giorni feriali della settimana successiva tramite `onBatchUpdateDayCapacities`.

---

### 5.5 `MathBugTracker.js` — Registro Anti-Trabocchetto

Modal specializzato nel contrasto degli errori ricorrenti commessi durante le esercitazioni:
- **Dataset Precaricato di Bug Tipici UNIMORE:** Include le 6 trappole classiche d'esame (De L'Hôpital applicato senza forma indeterminata, ordine insufficiente dell'o-piccolo di Taylor, omissione del valore assoluto in $\int \frac{1}{x}dx$, scacchiera dei segni di Laplace, discussione del parametro $k$ in Rouché-Capelli, confusione tra molteplicità algebrica e geometrica).
- **Form di Inserimento Rapido:** Permette allo studente di registrare un nuovo trabocchetto indicando tema didattico, titolo, descrizione dell'errore, regola di correzione ("Fix Rule") e livello di gravità (`critico`, `comune`, `minore`).
- **Stato di Risoluzione:** Tasto per alternare lo stato da "Aperto" a "Padroneggiato ✓".
- **Filtri:** Per materia (`Analisi 1`, `Geometria`) e stato (`Tutti`, `Aperti`, `Risolti`).

---

### 5.6 `MathFormulaDrawer.js` — Formulario Rapido (Tasto F2)

Cassetto a comparsa laterale (Off-Canvas Drawer), accessibile in qualunque momento premendo il tasto **F2** o cliccando su `📐 Formulario [F2]` nell'header:
- Chiusura istantanea tramite tasto **Escape** o click all'esterno.
- **Ricerca Istantanea:** Filtra al volo formule, nomi e note esplicative.
- **Formulario Completo di Analisi 1:**
  - Sviluppi di Maclaurin fondamentali ($e^x$, $\sin x$, $\cos x$, $\ln(1+x)$, $(1+x)^\alpha$, $\tan x$, $\arctan x$) con condizioni di convergenza e ordine dell'o-piccolo.
  - Integrazione per parti con regola mnemonica **ALPET** (Arcotangente, Logaritmo, Polinomio, Esponenziale, Trigonometriche).
  - Integrali notevoli ricorrenti per la decomposizione in fratti semplici.
- **Formulario Completo di Geometria e Algebra Lineare:**
  - Formula di Grassmann per le dimensioni dei sottospazi vettoriali.
  - Teorema di Rouché-Capelli e dimensione dello spazio delle soluzioni $\infty^{n-r}$.
  - Criterio di diagonalizzabilità su $\mathbb{R}$ ($m_g(\lambda) = m_a(\lambda)$).
  - Inversione matrice con matrice aggiunta dei complementi algebrici.
  - Procedimento di ortogonalizzazione di Gram-Schmidt.
  - Equazione del piano nello spazio $\mathbb{R}^3$ e formula distanza punto-piano.
  - Classificazione metrica delle coniche tramite invarianti $I_1, I_2, I_3$.
- Pulsante per copiare la formula negli appunti con un solo click.

---

### 5.7 `PdfSplitView.js` — Visualizzatore Affiancato Dispense & Eserciziari

Pannello affiancato attivabile tramite il pulsante `📖 Split PDF` nell'header:
- **Layout a Griglia Flessibile:** Quando attivo, suddivide il viewport desktop (`xl:grid-cols-12`) allocando 7 colonne al flusso principale dell'applicazione e 5 colonne alla visualizzazione del documento PDF in modalità `sticky top-24`.
- **Preset Didattici Ufficiali:** Collegamenti rapidi a dispense teoriche ed eserciziari di Analisi 1 e Geometria.
- **Supporto File Locale (Blob URL):** Consente di caricare qualsiasi dispensa PDF memorizzata sul computer dello studente tramite `URL.createObjectURL(file)`, garantendo la consultazione offline ad alte prestazioni.

---

### 5.8 `ExamSimulator.js` — Simulatore d'Esame Cronometrato

Strumento per simulare l'appello d'esame scritto secondo gli standard del Dipartimento di Ingegneria "Enzo Ferrari" di UNIMORE:
- **Due Modalità Operative:**
  1. *Prova Scritta Cronometrata Live:*
     - 120 minuti per Analisi Matematica 1 (6 esercizi a risposta aperta, max 5 punti ciascuno).
     - 90 minuti per Geometria e Algebra Lineare (11 domande quiz/esercizi, max 3 punti ciascuno).
     - Timer interattivo con controlli Avvia, Pausa, Reset.
     - Griglia di autovalutazione passaggio per passaggio.
     - Calcolo in tempo reale del voto finale normalizzato in trentesimi (`/30`) con verdetto di superamento.
  2. *Generatore Traccia per Claude / ChatGPT:*
     - Compone un prompt formattato per i modelli di intelligenza artificiale con gli argomenti estratti, i vincoli di tempo e i parametri dell'insegnamento UNIMORE per generare compiti d'esame inediti con relative soluzioni.
- **Estrazione Casuale Vincolata:** I temi vengono estratti a sorte esclusivamente dal sottoinsieme degli argomenti con Priorità $\ge 3$, ordinati rigorosamente secondo la propedeuticità didattica sequenziale.

---

### 5.9 `BurndownChart.js` — Grafico Agile Burndown Ore Residue

Componente SVG reattivo integrato nella Dashboard:
- Traccia sull'asse delle ascisse le settimane dall'inizio della roadmap (16 Novembre 2026) al 10 Gennaio 2027.
- Sull'asse delle ordinate rappresenta il monte ore complessivo da bruciare (ore effettive residue).
- **Linea Ideale (Tratteggiata Grigia):** Rappresenta la velocità teorica costante di completamento che converge a 0 ore il 10 Gennaio.
- **Linea Effettiva (Verde/Ambra):** Mostra la traiettoria reale delle ore rimanenti calcolate dal rebalancer.
- Badge di stato con calcolo del delta orario rispetto all'ideale (*In Anticipo* o *Lieve Ritardo*).

---

### 5.10 `ActivityHeatmap.js` — Mappa di Contribuzione Annuale

Griglia di visualizzazione dell'attività di studio ispirata al contribution graph di GitHub:
- Raggruppa i giorni in settimane (dal Lunedì alla Domenica).
- Scala cromatica basata sull'intensità delle ore di studio svolte:
  - `0h` (Giorno saltato): Bordo ambra su sfondo scuro.
  - `< 2h`: Verde smeraldo scuro (`bg-emerald-800/80`).
  - `2h - 3.9h`: Verde smeraldo intermedio (`bg-emerald-600`).
  - `≥ 4h` (Weekend intensivo): Verde brillante ad alto contrasto (`bg-emerald-400 text-slate-950`).
- Giorno odierno evidenziato da un anello ciano acceso (`ring-2 ring-cyan-400`).
- Tooltip dettagliato al passaggio del mouse e click sulla cella per selezionare e ispezionare il giorno.

---

### 5.11 `NeuraDeckPromptGenerator.js` — Generatore Flashcard per NotebookLM

Modulo dedicato all'integrazione con Google NotebookLM e all'esportazione verso l'app di flashcard NeuraDeck:
- Filtra automaticamente gli argomenti didattici completati nella finestra temporale prescelta (ultimi 7 giorni, ultimi 14 giorni o storico completo).
- Compone un prompt ottimizzato per NotebookLM istruendo l'AI ad estrarre definizioni, formule, teoremi e controesempi esclusivamente in formato CSV raw `Fronte,Retro`.
- Include il pulsante per il download diretto del file TSV compatibile con Anki (`#separator:tab`, `#html:true`).

---

### 5.12 `Clarke9000Companion.js` — Assistente di Bordo Flottante

Widget flottante posizionato nell'angolo inferiore destro, ispirato a HAL 9000 e alla figura di Arthur C. Clarke:
- **Occhio Ottico Animato:** Lente circolare rossa con riflessi concentrici, glow soffuso ed effetto di respirazione visiva (`animate-ping`).
- **Sintetizzatore Sonoro Web Audio API:** Genera bip sintetici discreti alla ricezione di notifiche o interazioni, silenziabile con un click.
- **Dizionario Esteso di Oltre 100 Citazioni:** Raccoglie aforismi categorizzati (Filosofia classica e stoicismo con Marco Aurelio e Seneca, Letteratura universale con Dante e Goethe, Esistenzialismo con Nietzsche e Camus, Disciplina del lavoratore, Scienza con Feynman e Turing, battute canoniche di HAL 9000).
- **Stato Collassabile:** Può essere ridotto ad una singola icona circolare o espanso per leggere i messaggi motivazionali e la telemetria di progresso verso il 10 Gennaio 2027.

---

### 5.13 `AlertBanner.js` — Stub di Compatibilità

Componente originariamente destinato alla notifica di allerte globali a tutto schermo:
- Come documentato nel sorgente, il banner è stato rimosso per eliminare ingombri visivi e restituire il massimo spazio utile all'interfaccia operativa.
- Le segnalazioni critiche (superamento soglia 25h/settimana, ripassi scaduti, allineamento orari) sono state integrate in forma compatta direttamente nelle card KPI della Dashboard e negli header della vista To-Do.
- Il file esporta una funzione React che restituisce `null`, preservando l'integrità delle importazioni nei vari moduli.

---

### 5.14 `Icons.js` — Libreria Iconografica SVG Zero-Dipendenze

Modulo autonomo contenente tutte le icone SVG vettoriali utilizzate dall'applicazione, esenti da librerie esterne pesanti (come FontAwesome o Lucide).

#### Icone Esportate
| Componente Icona | Dimensione Default | Rappresentazione Semantica |
| :--- | :--- | :--- |
| `IconCalendar` | `w-5 h-5` | Date, pianificazione, scadenze e calendario |
| `IconClock` | `w-5 h-5` | Fabbisogno orario, durate e timer |
| `IconCheckCircle` | `w-5 h-5` | Completamento con successo e verifiche superate |
| `IconAlertTriangle` | `w-5 h-5` | Avvisi di rischio e sovraccarico |
| `IconBookOpen` | `w-5 h-5` | Didattica, programmi di studio, dispense |
| `IconLayers` | `w-5 h-5` | Catalogo argomenti e livelli di astrazione |
| `IconBarChart` | `w-5 h-5` | Statistiche KPI, telemetria e grafici |
| `IconSettings` | `w-5 h-5` | Parametri di configurazione e preferenze |
| `IconUpload` / `IconDownload` | `w-5 h-5` | Importazione file e salvataggio backup |
| `IconFlame` | `w-5 h-5` | Streak di studio e carichi intensivi |
| `IconSearch` / `IconFilter` | `w-5 h-5` | Interrogazione e filtraggio argomenti |
| `IconBriefcase` | `w-5 h-5` | Vincoli lavorativi e orario d'ufficio (9:00 - 18:00) |
| `IconTomato` | `w-4 h-4` | Sessione timer Pomodoro (50m studio / 10m pausa) |
| `IconSparkles` | `w-5 h-5` | Strumenti AI (NeuraDeck / NotebookLM) |
| `IconDice` | `w-5 h-5` | Simulatore casuale d'esame |
| `IconBug` | `w-5 h-5` | Bug Tracker e trabocchetti matematici |
| `IconGitLab` | `w-5 h-5` | Integrazione e sincronizzazione cloud GitLab |
| `IconCloud` | `w-5 h-5` | Stato di connessione remoto |
| `IconTrash` | `w-4 h-4` | Eliminazione e rollback di sessioni di studio |

Tutte le icone accettano la prop `className`, consentendo un ridimensionamento e una colorazione contestuale fluida (es. `className="w-4 h-4 text-emerald-400"`).

---

## 6. Diagrammi di Flusso delle Interazioni Utente

### 6.1 Registrazione di una Sessione di Studio e Propagazione dello Stato

```mermaid
sequenceDiagram
    autonumber
    actor Studente as Studente Lavoratore
    participant UI as WeeklyTodo / Dashboard
    participant Modal as LogStudyModal
    participant State as App State (React 18)
    participant Engine as rebalancerEngine.js
    participant Storage as LocalStorage & GitLab Sync
    
    Studente->>UI: Click "+ Registra Studio" o "+30m Stepper"
    UI->>Modal: handleOpenLogModal({ date, topicId })
    Modal->>Studente: Visualizza form con ore residue calcolate
    Studente->>Modal: Inserisce ore svolte (es. 2.5h) e note
    Studente->>Modal: Click "Salva Sessione nel Diario"
    Modal->>State: handleLogStudySession({ topicId, date, hours, completed, note })
    Note over State: Aggiorna topics (oreEffettive, completato)<br/>Aggiunge elemento a studySessions
    State->>Engine: rebalanceStudyPlan(topics, settings, capacities, sessions)
    Engine-->>State: Restituisce piano ribilanciato (metrics, weeklyPlans)
    State->>Storage: Auto-salvataggio localStorage (topics, sessions)
    State->>Storage: Debounced auto-push su GitLab Cloud (data/studiplanner-state.json)
    State-->>UI: Re-render reattivo di Dashboard e To-Do Settimanale
```

### 6.2 Flusso Operativo del Time Shifter (Rimodulazione Feriale)

```mermaid
flowchart TD
    A["Inizio Giornata Lavorativa"] --> B{"Imprevisto in Ufficio o Straordinario?"}
    
    B -- "Sì: Straordinari Serale" --> C["Click '[- 30m]' nel To-Do del giorno"]
    C --> D["Capacità del giorno ridotta (es. da 2.5h a 1.0h)"]
    D --> E["Il Rolling Rebalancer sposta gli argomenti in eccesso a domani"]
    
    B -- "No: Pausa Pranzo o Permesso Studio" --> F["Click '[+ 30m]' per Slot Extra"]
    F --> G["Capacità aumentata (es. da 2.5h a 3.5h)"]
    G --> H["Il Rebalancer anticipa argomenti dai giorni futuri liberando il pre-esame"]
    
    B -- "Regime Standard" --> I["Sessione serale standard 2.5h (19:30 - 22:00)"]
    
    E --> J["Visualizzazione To-Do Aggiornato in Tempo Reale"]
    H --> J
    I --> J
```

---

## 7. Linee Guida per la Manutenzione e l'Estensione della UI

1. **Aderenza Rigorosa al Dark Mode:** Nessun componente deve utilizzare sfondi bianchi o chiari. Utilizzare sempre le costanti semantiche `#070b14`, `#0f172a` e le classi Tailwind `bg-slate-950`, `bg-slate-900`, `text-slate-100`.
2. **Preservazione dei Colori per Materia:**
   - **Analisi Matematica 1:** Esclusivamente tonalità smeraldo/teal (`emerald-400`, `emerald-500`, `teal-500`).
   - **Geometria e Algebra Lineare:** Esclusivamente tonalità indaco/viola (`indigo-400`, `indigo-500`, `purple-500`).
3. **Flusso Obbligatorio di Build:**
   Dopo qualsiasi modifica apportata a file in `src/components/` o `src/app.js`, è obbligatorio sincronizzare il bundle eseguendo:
   ```powershell
   python scripts\build_bundle.py
   python scripts\test_rolling_rebalance.py
   ```
4. **Accessibilità e Responsive Design:** Verificare sempre che le card e i pulsanti siano fruibili sia su schermi desktop (1920px) sia su smartphone touch (360px - 414px) sfruttando le classi responsive di Tailwind (`hidden md:flex`, `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`).
