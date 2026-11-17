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

---

### 3. Architettura Frontend & Tecnologie

- **Stack:** Single Page Application responsive (Mobile, Tablet, Desktop) in **React 18** (senza build tool pesanti come Webpack/Vite complessi: gira autonomamente nel browser).
- **Stile:** **Tailwind CSS** con **Dark Mode di default** (`#070b14`), palette colori distintive:
  - Analisi 1: Smeraldo / Teal (`#10b981`)
  - Geometria: Indaco / Viola (`#6366f1`)
  - Allerta: Rosa / Ambra (`#f43f5e`, `#f59e0b`)
- **Icone:** Icone SVG native zero-dependency definite in `src/components/Icons.js`.
- **Parsing Spreadsheet:** Libreria SheetJS (`XLSX`) caricata via CDN per lettura/scrittura di `.xlsx`, `.ods`, `.xls`.
- **Persistenza:** `localStorage` (`unimore_rebalancer_topics_v2`, `unimore_rebalancer_settings_v2`) con supporto al download/ripristino di backup completi in JSON.

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
> python scripts\test_rolling_rebalance.py
> ```

---

### 5. Mappa dei File Chiave del Workspace

- `index.html`: Entry point dell'applicazione web.
- `bundle.js`: Bundle consolidato per l'esecuzione browser.
- `server.py`: Server di sviluppo Python locale (porta 3000, supporto CORS e no-cache).
- `start-app.bat`: Script di avvio rapido con doppio clic su Windows.
- `src/services/rebalancerEngine.js`: Motore matematico di ribilanciamento e calendario.
- `src/services/parserService.js`: Parser client-side per CSV ed Excel con fuzzy matching.
- `src/components/WeeklyTodo.js`: Vista operativa to-do giorno per giorno.
- `src/components/HistoryLog.js`: Timeline e diario storico delle date passate.
- `src/components/Dashboard.js`: Progress bar Analisi/Geometria e metriche KPI.
- `src/data/defaultData.js`: Dataset precaricato dei 63 argomenti ufficiali UNIMORE.
- `Analisi/Analisi.csv` e `Geometria/Geometria.txt`: Dataset CSV canonici.
- `GUIDA_APPLICAZIONE.md`: Manuale utente completo ed esaustivo.
- `README.md`: Documentazione pubblica del repository GitHub.
