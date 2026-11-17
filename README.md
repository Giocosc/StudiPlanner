# 🎓 Study Plan Rebalancer — Analisi 1 & Geometria
### *Pianificatore Didattico Adattivo per Studenti Lavoratori (UNIMORE Ingegneria Informatica)*

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SheetJS](https://img.shields.io/badge/SheetJS-XLSX-217346?logo=microsoft-excel&logoColor=white)](https://sheetjs.com/)
[![Status](https://img.shields.io/badge/Status-Production_Ready-emerald)]()
[![Platform](https://img.shields.io/badge/Platform-Web_SPA-blue)]()
[![Target](https://img.shields.io/badge/Target_Exam-10_Gennaio_2027-purple)]()

Una **Single Page Application (SPA)** responsive e moderna, sviluppata specificamente per gli studenti del corso di laurea in **Ingegneria Informatica (UNIMORE)** che lavorano full-time.  
L'applicazione carica in memoria lato client i file di syllabus e i tracker di studio (CSV, TXT, Excel `.xlsx`, LibreOffice Calc `.ods`) e ricalcola dinamicamente un piano di studio personalizzato, ottimizzato per le fasce serali e i weekend, fino alla data d'esame fissata al **10 Gennaio 2027**.

---

## 🌟 Caratteristiche Principali

- 🔄 **Rolling Dynamic Rebalancer:** Se salti dei giorni di studio, gli argomenti arretrati slittano automaticamente alla giornata odierna; se studi in anticipo, il piano attinge subito dai temi futuri per liberare giorni di ripasso.
- 📐 **Propedeuticità Matematica Rigorosa:** L'ordine cronologico di studio è bloccato sulla sequenza naturale del syllabus (da `A-01` a `A-32` per Analisi 1 e da `G-01` a `G-31` per Geometria), evitando che prove finali o argomenti avanzati vengano programmati all'inizio.
- ⏱️ **Buffer Adattivo del +20%:** Per gli argomenti contrassegnati con alta difficoltà ($\ge 4$) o alta priorità d'esame ($\ge 4$), viene allocato automaticamente un buffer temporale di sicurezza ($T_{\text{effettivo}} = T_{\text{stimato}} \times 1.20$).
- 💼 **Modello Lavoratore Full-Time:** Esclusione automatica delle ore lavorative diurne: studio concentrato nelle sere feriali (**2.5h/sera**, 19:30 - 22:00) e blocchi intensivi nel weekend (**4.5h/giorno**).
- ⚠️ **Allerta Sovraccarico Cognitivo:** Scatto di un warning visivo animato qualora il monte ore settimanale richiesto superi la soglia critica di sicurezza (**25 ore/settimana**).
- 📜 **Storico & Diario di Studio:** Tracciamento giorno per giorno delle date passate dall'avvio del piano (16 Novembre 2026), con indicazione chiara di sessioni svolte vs giorni saltati.
- 💾 **Persistenza Locale al 100%:** Nessun database esterno o cloud richiesto. I dati sono salvati in tempo reale in **LocalStorage** con supporto all'esportazione/importazione di backup completi in formato JSON e fogli Excel (`.xlsx`).
- 📱 **Design Dark Mode Responsive:** UI curata in dark mode (`#070b14`), ottimizzata per schermi desktop, tablet e smartphone con bottom navigation bar.

---

## ⚡ Avvio Rapido

L'applicazione è self-contained e non richiede build complessi o installazione di pacchetti:

### Metodo 1: Script Diretto Windows (Consigliato)
Fai doppio clic sul file batch:
```cmd
start-app.bat
```
oppure avvia il server locale da terminale:
```powershell
python server.py
```
L'applicazione si aprirà automaticamente nel browser predefinito su **`http://localhost:3000`**.

### Metodo 2: Apertura Diretta nel Browser
Puoi fare doppio clic direttamente sul file `index.html` con qualsiasi browser moderno (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

---

## 📊 Viste dell'Interfaccia Utente

### 1. Dashboard
- **Progress Bar Analisi 1:** Barra graduata Smeraldo/Teal basata su `Ore_Completate / Ore_Stimate`, con conteggio argomenti e promemoria della prova scritta (5-6 esercizi).
- **Progress Bar Geometria e Algebra:** Barra graduata Indaco/Viola basata su `Ore_Completate / Ore_Stimate`, con conteggio argomenti e promemoria della prova scritta (quiz a 11 quesiti).
- **Card Metriche (KPI):** Conto alla rovescia al 10 Gennaio 2027, fabbisogno medio settimanale, ore residue con buffer (+20%) e percentuale di completamento complessivo.

### 2. To-Do Settimanale
- Navigazione sulle 8 settimane della sessione invernale (16 Nov 2026 – 10 Gen 2027).
- Dettaglio slot giornalieri (Lun-Dom) con indicazione in evidenza di **OGGI (Data Attiva)**, giorni passati e giorni futuri.
- Checkbox interattiva: spuntando un argomento, viene registrato con data di completamento e l'intero piano futuro viene ricalcolato all'istante.
- Filtri veloci per materia (*Tutte*, *Solo Analisi*, *Solo Geometria*).

### 3. Storico & Diario di Studio
- Timeline retrospettiva delle date passate.
- Monitoraggio dei giorni effettivi di studio rispetto ai giorni saltati, con riepilogo ore svolte.
- Selettore rapido in header (`◀ Ieri` • **Oggi** • `Domani ▶`) per simulare in anteprima l'avanzamento dei giorni e verificare come il piano reagisce ai giorni saltati.

### 4. Catalogo Argomenti
- Tabella di tutti i 63 argomenti ufficiali UNIMORE.
- Ricerca istantanea testuale (per ID, argomento, capitolo, dispense di riferimento).
- Filtri a cascata per stato (*Da fare / Completati*), materia e priorità.
- Pulsanti di azione rapida per simulare avanzamenti di studio in blocco.

### 5. Import / Sync & Backup
- **Drag & Drop:** Caricamento immediato di file CSV, TXT, Excel (`.xlsx`, `.xls`), LibreOffice Calc (`.ods`) o backup JSON.
- **Sincronizzazione Automatica:** Mappa gli ID e gli argomenti completati desunti dai fogli Excel tracker.
- **Esportazione:** Download del piano completo in formato Excel (`.xlsx`) o Backup completo JSON.

---

## 🧮 Modello Matematico di Calcolo

### 1. Orizzonte Temporale
$$\Delta_{\text{giorni}} = \text{Data Target (2027-01-10)} - \text{Data Odierna} = 54\text{ giorni } (\approx 7.7\text{ settimane})$$

### 2. Capacità Settimanale Lavoratore Full-Time
$$\text{Capacità} = (5 \times H_{\text{serali}}) + (2 \times H_{\text{weekend}}) = (5 \times 2.5\text{h}) + (2 \times 4.5\text{h}) = 21.5\text{ ore/settimana}$$

### 3. Buffer di Tempo Dinamico (+20%)
Per ciascun argomento con $\text{Priorità} \ge 4$ oppure $\text{Difficoltà} \ge 4$:
$$T_{\text{effettivo}} = T_{\text{stimato}} \times 1.20$$

### 4. Fabbisogno Settimanale Medio
$$F_{\text{settimanale}} = \frac{\sum_{i \in \text{Uncompleted}} T_{\text{effettivo}, i}}{\text{Settimane Rimanenti}}$$
Se $F_{\text{settimanale}} > 25\text{ h/settimana}$, viene mostrato l'**Alert Visivo di Sovraccarico Critico** con 3 suggerimenti pratici di mitigazione:
1. Incrementare le ore dei blocchi del fine settimana (portando Sabato e Domenica a 6h).
2. Anticipare la sessione serale alle 19:00.
3. Focalizzarsi prioritariamente sui macro-blocchi d'esame a Priorità 5 (Taylor, Torricelli, Rouché-Capelli, Coniche).

---

## 📂 Struttura del Repository

```
Planner/
├── .gitignore                     # Regole di esclusione Git
├── index.html                     # Entry point SPA responsive (Dark Mode)
├── bundle.js                      # Bundle applicativo compilato
├── server.py                      # Server Python HTTP locale (porta 3000)
├── start-app.bat                  # Script di avvio rapido con doppio clic
├── README.md                      # Documentazione del repository GitHub
├── GUIDA_APPLICAZIONE.md          # Manuale utente completo e dettagliato
│
├── Analisi/                       # Materiale e dataset Analisi Matematica 1
│   ├── Analisi.csv                # CSV standardizzato dei 32 slot di studio (A-01 -> A-32)
│   ├── Analisi.txt                # Versione tabellare TXT
│   ├── Piano_di_Studio_Analisi1_UNIMORE.xlsx
│   └── Agisci come un professore e tutor di Analisi Mate....md
│
├── Geometria/                     # Materiale e dataset Geometria e Algebra
│   ├── Geometria.txt              # CSV standardizzato dei 31 argomenti (G-01 -> G-31)
│   └── Agisci come un professore e tutor di Geometria e....md
│
├── Piano Studi UNIMORE - Analisi 1 e Geometria (Nov 2026 - Gen 2027) (1).ods
│
├── src/                           # Codice sorgente modulare React
│   ├── app.js                     # Root component e state management reattivo
│   ├── data/
│   │   └── defaultData.js         # Dataset didattico integrato UNIMORE (63 argomenti)
│   ├── services/
│   │   ├── parserService.js       # Parser CSV & Excel/ODS con fuzzy matching
│   │   └── rebalancerEngine.js    # Motore matematico di rolling rebalancing
│   └── components/
│       ├── AlertBanner.js         # Banner allerta sovraccarico (> 25h/settimana)
│       ├── Dashboard.js           # Progress bar Analisi/Geometria e KPI
│       ├── WeeklyTodo.js          # Vista To-Do giorno per giorno
│       ├── HistoryLog.js          # Timeline storico date passate e diario
│       ├── TopicsTable.js         # Catalogo argomenti, ricerca e filtri
│       ├── FileImporter.js        # Gestione caricamento file e backup
│       ├── SettingsModal.js       # Finestra impostazioni orari e date
│       └── Icons.js               # Icone SVG native
│
└── scripts/                       # Strumenti di build e test
    ├── build_bundle.py            # Generatore del bundle JavaScript
    ├── test_app.py                # Test automatico di rendering
    ├── test_interactions.py       # Test automatico interazioni e checkbox
    ├── test_rolling_rebalance.py  # Test automatico del rolling rebalancer
    └── test_engine.mjs            # Test Node.js dell'algoritmo di allocazione
```

---

## 📚 Syllabus UNIMORE Precaricato

L'applicazione contiene l'inventario ufficiale e completo di entrambi i corsi:

- **Analisi Matematica 1 (32 Argomenti, 80h base):**
  Insiemi numerici, sup/inf, principio di induzione, funzioni elementari, numeri complessi (De Moivre), successioni e limiti, teoremi ponte e continuità (Zeri per bisezione, Bolzano, Weierstrass), Formula di Taylor (Peano, Maclaurin), calcolo differenziale, Fermat, Rolle, Lagrange, De L'Hôpital, studio di funzione, integrali definiti di Riemann, Torricelli, metodi di integrazione (parti, sostituzione, fratti semplici), integrali impropri notevoli, serie numeriche, criteri di convergenza e 8 slot di simulazione/prova generale d'esame.

- **Geometria e Algebra Lineare (31 Argomenti, 68h base):**
  Operazioni su matrici, determinante con Laplace e Binet, matrice inversa, rango e riduzione a gradini, spazi vettoriali, generatori, basi e dimensione, componenti di Fourier, Relazione di Grassmann, trasformazioni lineari, nucleo, immagine ed equazione dimensionale, matrici simili, sistemi lineari e Teorema di Rouché-Capelli, rappresentazione cartesiana e parametrica, polinomio caratteristico, autovalori/autovettori, diagonalizzabilità, Teorema Spettrale, spazi vettoriali euclidei, Gram-Schmidt, geometria euclidea in $E^2$ ed $E^3$ (rette, piani, mutue posizioni, distanze), coniche (ampliamento proiettivo, centro, assi, asintoti, forma canonica) e strutture algebriche.

---

## 🛠️ Contribuire e Sviluppo

Il progetto è modulare ed estendibile. Se desideri ricompilare il file `bundle.js` dopo aver modificato i file in `src/`, puoi eseguire:
```powershell
python scripts\build_bundle.py
```

Per eseguire la suite di test automatizzati Playwright:
```powershell
python scripts\test_rolling_rebalance.py
```

---

## 📄 Licenza

Distribuito con licenza **MIT**. Consulta il file `LICENSE` per ulteriori informazioni.
