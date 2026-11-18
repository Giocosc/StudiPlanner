# 📘 Guida Completa all'Uso — StudiPlanner
### *Pianificatore Dinamico per gli Esami di Analisi Matematica 1 e Geometria (UNIMORE)*
**Sessione Invernale: 16 Novembre 2026 – 10 Gennaio 2027**  
**Profilo Utente:** Studente Lavoratore Full-Time (Ingegneria Informatica)

---

## 📑 Indice dei Contenuti
1. [Introduzione e Obiettivo dell'Applicazione](#1-introduzione-e-obiettivo-dellapplicazione)
2. [Architettura Tecnica e Tecnologie Utilizzate](#2-architettura-tecnica-e-tecnologie-utilizzate)
3. [Guida all'Avvio Rapido](#3-guida-allavvio-rapido)
4. [La Logica Matematica del Rolling Rebalancer](#4-la-logica-matematica-del-rolling-rebalancer)
   - [Esclusione dell'Orario Lavorativo](#esclusione-dellorario-lavorativo)
   - [Buffer Dinamico del +20% sui Temi Complessi](#buffer-dinamico-del-20-sui-temi-complessi)
   - [Propedeuticità Matematica Rigorosa](#propedeuticità-matematica-rigorosa)
   - [Gestione dei Giorni Saltati (Rolling Forward)](#gestione-dei-giorni-saltati-rolling-forward)
   - [Gestione degli Anticipi (Pull Forward)](#gestione-degli-anticipi-pull-forward)
   - [Allerta Sovraccarico Critico (> 25h/settimana)](#allerta-sovraccarico-critico--25hsettimana)
5. [Panoramica Dettagliata delle Schermate e Funzionalità](#5-panoramica-dettagliata-delle-schermate-e-funzionalità)
   - [Header e Strumenti di Navigazione](#header-e-strumenti-di-navigazione)
   - [Banner di Notifica e Allerta](#banner-di-notifica-e-allerta)
   - [1. Dashboard](#1-dashboard)
   - [2. To-Do Settimanale](#2-to-do-settimanale)
   - [3. Storico & Diario di Studio](#3-storico--diario-di-studio)
   - [4. Catalogo Argomenti](#4-catalogo-argomenti)
   - [5. Import / Sync & Backup Dati](#5-import--sync--backup-dati)
   - [6. Sincronizzazione Cloud Automatica GitLab (Multi-Dispositivo)](#6-sincronizzazione-cloud-automatica-gitlab-multi-dispositivo)
   - [7. Modal Parametri e Impostazioni](#7-modal-parametri-e-impostazioni)
   - [8. Registrazione Rapida Studio (+) e Auto-Adattamento](#8-registrazione-rapida-studio--e-auto-adattamento)
   - [9. Scheda Informativa Dettagliata dell'Argomento](#9-scheda-informativa-dettagliata-dellargomento)
6. [Persistenza Dati e Sicurezza](#6-persistenza-dati-e-sicurezza)
7. [Dataset Didattici UNIMORE Integrati](#7-dataset-didattici-unimore-integrati)
8. [Funzionalità Avanzate di Studio & Supporto Lavoratore](#9-funzionalità-avanzate-di-studio--supporto-per-lo-studente-lavoratore)
9. [Domande Frequenti (FAQ)](#10-domande-frequenti-faq)

---

## 1. Introduzione e Obiettivo dell'Applicazione

Lo **StudiPlanner** è una Single Page Application (SPA) responsive progettata specificamente per risolvere il problema principale degli studenti lavoratori universitari: **la rigidità dei piani di studio tradizionali**.

Quando si lavora a tempo pieno (40 ore settimanali), è inevitabile che imprevisti lavorativi, stanchezza o emergenze personali costringano a saltare uno o più giorni di studio. In una tabella Excel statica, un giorno saltato fa crollare l'intero piano.  

Questa applicazione trasforma il calendario di studio in un **sistema adattivo continuo**:
- Se salti un giorno, il carico viene ricalcolato e riposizionato istantaneamente a partire dalla giornata odierna, preservando l'ordine propedeutico degli argomenti.
- Se sei in anticipo e studi più argomenti del previsto, il sistema anticipa automaticamente i temi futuri, facendoti guadagnare preziosi giorni di ripasso pre-esame.
- Il traguardo finale è fisso e categorico: **10 Gennaio 2027**, data d'inizio della sessione d'esame.

---

## 2. Architettura Tecnica e Tecnologie Utilizzate

L'applicazione segue i più moderni standard dello sviluppo web front-end:

| Componente | Tecnologia Adottata | Scopo e Vantaggi |
| :--- | :--- | :--- |
| **Core Framework** | **React 18** | Reattività istantanea, gestione centralizzata dello stato con Hook (`useState`, `useMemo`, `useEffect`). |
| **Styling & Design** | **Tailwind CSS** | Design responsive (Mobile, Tablet, Desktop), tema Dark Mode di default (`#070b14`), carte con glassmorphism. |
| **Icone** | **SVG Native Inline** | Zero dipendenze pesanti, rendering nitido e immediato a 60 FPS senza chiamate di rete esterne. |
| **Parser Spreadsheet** | **SheetJS (XLSX)** | Parsing ed esportazione client-side di file Excel (`.xlsx`, `.xls`) e LibreOffice Calc (`.ods`). |
| **Parser CSV** | **Engine Regex custom** | Supporto per CSV/TXT con delimitatori variabili (virgola, punto e virgola, tab) e gestione delle virgolette. |
| **Persistenza** | **HTML5 LocalStorage** | Salvataggio automatico locale: nessun dato viene inviato a server esterni, massima privacy e sicurezza. |

---

## 3. Guida all'Avvio Rapido

### Metodo 1: Avvio con Server Locale (Consigliato per Windows)
1. Entra nella cartella di lavoro `c:\tmp\StudiPlanner`.
2. Fai doppio clic sul file eseguibile batch:
   ```cmd
   start-app.bat
   ```
   *oppure apri un terminale PowerShell ed esegui:*
   ```powershell
   python server.py
   ```
3. L'applicazione avvierà un web server locale alla porta `3000` e aprirà in automatico la pagina nel tuo browser all'indirizzo:
   `http://localhost:3000`

### Metodo 2: Apertura Diretta del File HTML
Puoi fare doppio clic direttamente su `index.html` per aprirlo in Google Chrome, Microsoft Edge, Mozilla Firefox o Apple Safari.

---

## 4. La Logica Matematica del Rolling Rebalancer

L'algoritmo di allocazione implementato in `src/services/rebalancerEngine.js` rispetta una serie di vincoli matematici e didattici ben definiti.

### Gestione Flessibile Slot Extra e Time Shifter (Override Dinamico del Budget Giornaliero)
L'utente è uno studente lavoratore a tempo pieno con una routine oraria che combina studio serale e slot flessibili. Per far fronte agli imprevisti lavorativi quotidiani (straordinari, pause pranzo variabili, permessi studio improvvisi), StudiPlanner integra la tecnologia **Time Shifter**:

1. **Valori Standard di Base:**
   - **Dal Lunedì al Venerdì:** Studio serale standard da **2.5 ore/sera** (fascia 19:30 - 22:00).
   - **Sabato e Domenica:** Blocchi intensivi diurni da **4.5 ore/giorno**.
   - *Capacità di riferimento:* $5 \times 2.5\text{h} + 2 \times 4.5\text{h} = 21.5\text{ ore/settimana}$.
   - *Soglia Critica di Sicurezza:* configurabile a partire da 25 ore/settimana.

2. **Override Dinamico Giorno per Giorno (Time Shifter nel To-Do Settimanale):**
   - Nell'header di ogni singolo giorno nel To-Do Settimanale è presente un gruppo di controlli stepper dedicati:
     - **Pulsante `[- 30m]`:** Riduci il budget di 30 minuti se hai straordinari o imprevisti serali.
     - **Badge `Budget: X.Xh`:** Mostra la disponibilità effettiva allocata per quella specifica data (con tasto `↺` di reset rapido).
     - **Pulsante `[+ 30m]` (Slot Extra):** Aggiungi uno slot extra da 30 minuti (o multipli) per pausa pranzo estesa, permessi o anticipo mattutino.
   - **Ricalcolo e Spostamento Istantaneo:** Al click, l'algoritmo rialloca immediatamente la coda degli argomenti propedeutici: se allarghi il budget, gli argomenti futuri vengono anticipati oggi; se lo riduci, scivolano automaticamente sui giorni successivi in modo fluido e trasparente.
   - **Persistenza Dedicata:** Tutte le modifiche vengono memorizzate nell'oggetto `customDayCapacities` in `localStorage` e incluse nei file di backup JSON e nell'auto-sync trasparente del File System.

### Buffer Dinamico del +20% sui Temi Complessi
Gli argomenti non hanno tutti la stessa complessità. Per gli argomenti ad **alta priorità d'esame** ($\ge 4$) o ad **alta difficoltà intrinseca** ($\ge 4$):
$$T_{\text{effettivo}} = T_{\text{stimato}} \times 1.20$$
*Esempio:* La *Formula di Taylor con sviluppi di Maclaurin* (`A-09`), stimata in 2.5h, riceve un tempo effettivo allocato di **3.0 ore** (+30 minuti di cuscinetto di sicurezza).

### Propedeuticità Matematica Rigorosa
A differenza dei normali to-do list scheduler che ordinano per priorità, l'engine rispetta rigidamente la **propedeuticità matematica**:
- Non puoi studiare gli integrali senza prima aver studiato derivate e limiti.
- Non puoi svolgere la simulazione d'esame il primo giorno.
- Gli argomenti vengono distribuiti rigorosamente secondo il loro **ID sequenziale**:
  - `A-01` $\rightarrow$ `A-02` $\rightarrow$ ... $\rightarrow$ `A-32` per Analisi 1.
  - `G-01` $\rightarrow$ `G-02` $\rightarrow$ ... $\rightarrow$ `G-31` per Geometria.

### Gestione dei Giorni Saltati (Rolling Forward)
Se per qualsiasi motivo non studi Lunedì e Martedì:
1. Gli argomenti non completati rimangono in cima alla coda.
2. Quando il giorno attivo diventa Mercoledì, Mercoledì attinge immediatamente dal primo argomento rimasto indietro (`A-01` o `G-01`).
3. L'intera pianificazione futura scorre in avanti di conseguenza.

### Gestione degli Anticipi (Pull Forward)
Se in una serata particolarmente produttiva completi gli argomenti previsti per Lunedì, Martedì e Mercoledì:
1. Spuntando le relative checkbox, questi argomenti vengono archiviati come completati con la data odierna.
2. La giornata di Martedì recupera immediatamente gli argomenti di Giovedì e Venerdì.
3. Il calendario si comprime e guadagni giorni liberi prima della data d'esame.

### Allerta Sovraccarico Critico (> 25h/settimana)
Il fabbisogno medio settimanale viene costantemente calcolato come:
$$F_{\text{settimanale}} = \frac{\sum T_{\text{effettivi residue}}}{\text{Settimane rimanenti}}$$
Se $F_{\text{settimanale}} > 25\text{ ore/settimana}$ (soglia considerata a rischio burnout per un lavoratore full-time), si attiva immediatamente un **Alert Visivo di Allerta Critica** con indicazione dei rimedi consigliati.

---

## 5. Panoramica Dettagliata delle Schermate e Funzionalità

### Header e Strumenti di Navigazione
L'header rimane sempre visibile in cima allo schermo e include:
- **Badge di Laurea:** Identificativo UNIMORE Ingegneria Informatica.
- **Pulsante `+ Registra Studio`:** Accesso istantaneo alla registrazione rapida di sessioni svolte per qualsiasi data, argomento e monte ore.
- **Selettore Rapido "Oggi" (`◀ Ieri` • Data • `Domani ▶`):** Permette di simulare con un click l'avanzamento dei giorni per verificare istantaneamente come il piano si riadatta se salti un giorno o studi in anticipo.
- **Conto alla Rovescia:** Mostra in tempo reale i giorni e le settimane mancanti al 10 Gennaio 2027.
- **Pulsante Impostazioni (icona ingranaggio):** Apre il pannello per personalizzare parametri, orari e date.
- **Bottom Navigation Bar (su Mobile e Tablet):** Barra inferiore touch con pulsanti rapidi per Dashboard, Settimanale, pulsante centrale `+` Studio, Storico, Argomenti e File.

---

### 🏆 Registrazione Rapida Studio (+) & Auto-Adattamento Continuo

La funzionalità **`+ Registra Studio`** è accessibile da qualsiasi punto dell'applicazione:
1. **Dall'Header globale e dalla Dashboard:** Pulsante `+ Registra Studio` sempre a portata di click.
2. **Dal To-Do Settimanale:** Pulsante `+ Registra Studio` nell'intestazione di ciascun giorno (pre-compila la data selezionata) e pulsante `+ Log` su ogni singola scheda argomento.
3. **Dallo Storico & Diario:** Pulsante `+ Studio` per ciascuna data passata o attiva.

#### Come Funziona il Modal di Registrazione:
- **1. Data in cui hai studiato (Giorno):** Seleziona il giorno (con chip rapidi `★ Oggi` o `◀ Ieri` o calendario completo). È possibile registrare sessioni sia per la data odierna, sia per date passate (recuperando giorni saltati), sia per date future (studi intensivi in anticipo).
- **2. Che argomento hai studiato:** Filtra per Analisi 1 o Geometria e cerca velocemente per ID o parola chiave. L'interfaccia mostra subito capitolo, priorità, difficoltà, ore già svolte e ore stimate.
- **3. Quante ore hai studiato:** Stepper touch `[- 30m]` e `[+ 30m]`, input numerico personalizzabile e preset veloci (`0.5h`, `1.0h`, `1.5h`, `2.0h`, `2.5h`, `4.5h` o il pulsante intelligente *"Tutto il Residuo"*).
- **4. Stato di completamento:** Checkbox dinamica per segnare l'argomento come completato. Se le ore cumulate raggiungono o superano la stima, il sistema consiglia automaticamente il completamento.
- **5. Note facoltative:** Appunta esercizi svolti, dimostrazioni o pagine del libro.

#### Come si Auto-Adatta il Piano:
- **Se l'argomento viene completato:** Viene registrato nella data indicata e rimosso dalla coda dei giorni futuri. Il motore anticipa immediatamente il prossimo argomento didattico in sequenza propedeutica ($A-01 \rightarrow A-32$, $G-01 \rightarrow G-31$), liberando giorni preziosi per il ripasso finale pre-esame.
- **Se lo studio è parziale:** L'argomento rimane in programma nei giorni successivi con il solo residuo orario rimanente, riducendo istantaneamente il fabbisogno settimanale.
- **Se registri su un giorno passato:** Se quel giorno era stato contrassegnato come "saltato", si converte in giornata di studio svolta e l'allerta di recupero si riduce.
- **Gestione e Ripristino:** Dal tab *"Ultime Sessioni"* del modal o dallo Storico è possibile visualizzare e cancellare qualsiasi sessione errata, ripristinando all'istante lo stato e le ore precedenti.

---

### Ottimizzazione Spazio Schermo: Rimozione Banner Invasivi

Per massimizzare lo spazio utile su qualsiasi display (desktop, laptop e mobile) ed evitare distrazioni visive:
- **Banner "Ribilanciamento Dinamico Attivo":** Nascosto di default, poiché il ribilanciamento automatico continuo e lo slittamento da "Oggi" in avanti rappresentano il comportamento nativo e immutabile del motore di calcolo.
- **Banner "Allerta Sovraccarico Critico":** Rimosso dalla parte superiore della vista per non occupare spazio prezioso. Le indicazioni sul ritmo e sul carico orario sono ora integrate direttamente all'interno delle schede di materia della Dashboard tramite i nuovi **Indicatori di Passo**.

---

### 1. Dashboard

La Dashboard offre una panoramica d'impatto sullo stato di avanzamento e sulla motivazione quotidiana:

- **4 Carte KPI Superiori:**
  - *Target Esame:* 10 Gennaio 2027 con conteggio giorni e settimane rimanenti.
  - *Fabbisogno Settimanale:* Ore/settimana necessarie con etichetta di sostenibilità o allerta.
  - *Ore Residue:* Monte ore effettivo rimanente con indicazione del buffer (+20%).
  - *Completamento:* Percentuale globale complessiva ($0\% - 100\%$).

- **Indicatori di Passo in Tempo Reale (Analisi 1 e Geometria):**
  Ciascuna sezione di materia monitora il ritmo di studio rispetto alla roadmap ideale (16 Nov 2026 $\rightarrow$ 10 Gen 2027) e mostra un badge dedicato:
  - 🚀 **`In Vantaggio (+X.Xh)` (Verde Smeraldo):** Hai completato più ore rispetto al fabbisogno teorico alla data odierna; visualizza il tempo guadagnato per il ripasso finale.
  - 🎯 **`Al Passo` (Blu Ciano):** Sei perfettamente allineato con la tabella di marcia dell'esame.
  - ⚠️ **`In Ritardo (-X.Xh)` (Ambra / Rosso):** Segnala il ritardo orario accumulato rispetto al programma ideale con consigli per il recupero graduale.
  - **Marker Obiettivo sulla Progress Bar:** Una linea verticale tratteggiata indica l'obiettivo ideale alla data odierna, permettendo di verificare visivamente con un colpo d'occhio se la barra reale ha superato o meno il target.

- **🔥 Centrale della Costanza & Streak Lavoratore (Hub Motivazionale):**
  Progettato specificamente per lo studente lavoratore che affronta lo studio dopo 8 ore di ufficio:
  - **Fiamma della Streak:** Contatore dei giorni consecutivi di studio completati (`X Giorni Consecutivi`) e record personale (`Record: Y gg`).
  - **Badge di Resilienza Dinamici:** Titoli sbloccabili in base alla costanza (es. *Ingegnere Notturno*, *Fiamma di Costanza*, *Titanio UNIMORE*, *Macchina da Guerra*).
  - **Barra di Progresso al Prossimo Livello:** Mostra quanti giorni mancano per conquistare il livello successivo.
  - **Citazione Motivazionale del Lavoratore:** Frasi quotidiane a rotazione pensate per chi studia la sera e nel weekend.
  - **Medaglie Traguardo (Achievements):**
    - 🎯 *Primo Passo:* Prima sessione registrata.
    - ⚡ *Doppio Motore:* Studio registrato sia in Analisi sia in Geometria.
    - 🧠 *Focus Master:* Almeno 10 ore complessive di studio dedicate.
    - 🔥 *Costanza:* Raggiungimento di almeno 3 giorni consecutivi di studio.
- **Strumenti AI & Metodo di Studio (Fase 2):**
  - **Generatore Flashcard NeuraDeck (NotebookLM):**
    - Filtra in automatico gli argomenti completati nell'ultima settimana (ultimi 7 giorni rispetto alla data odierna).
    - Selettore di materia (*Tutte*, *Analisi 1*, *Geometria*) e selezione granulare degli argomenti con anteprima fonti e note.
    - Genera dinamicamente il prompt strutturato per Google NotebookLM:
      > *"Agisci da professore universitario di Ingegneria. Basandoti esclusivamente sulle fonti di questo notebook, generami delle flashcard di ripasso sui seguenti argomenti: [LISTA_ARGOMENTI_COMPLETATI]. Restituisci l'output ESCLUSIVAMENTE in un blocco di codice CSV raw nel formato 'Fronte,Retro', ottimizzato per l'importazione massiva su NeuraDeck."*
    - Pulsante *"Copia Prompt"* con feedback visivo istantaneo e guida in 3 passaggi per l'importazione CSV su NeuraDeck.
  - **Simulatore d'Esame Dinamico (Claude / ChatGPT):**
    - Selezionando *Analisi 1*, estrae casualmente **6 argomenti** con Priorità $\ge 3$ tra quelli completati (rispecchia i 5-6 esercizi della prova scritta UNIMORE).
    - Selezionando *Geometria*, estrae casualmente **11 argomenti** con Priorità $\ge 3$ tra quelli completati (rispecchia gli 11 quesiti del test d'esame UNIMORE).
    - Gli argomenti estratti vengono ordinati per ID (`A-01` $\rightarrow$ `A-32`, `G-01` $\rightarrow$ `G-31`) garantendo la rigorosa propedeuticità didattica.
    - Banner intelligente con opzione di fallback sul programma completo se gli argomenti completati sono inferiori al target.
    - Genera dinamicamente il prompt per Claude o ChatGPT:
      > *"Genera una simulazione d'esame scritta di livello universitario (UNIMORE) basata ESCLUSIVAMENTE su questi argomenti: [LISTA_ESTRATTA]. Formatta il testo in Markdown pronto per la stampa, includendo lo spazio per lo svolgimento."*
    - Pulsante *"Estrai Nuova Simulazione 🎲"* per generare infiniti appelli d'esame di prova.
- **Riepilogo Globale:** Barra cumulativa dell'intero percorso formativo.

---

### 2. To-Do Settimanale
La vista operativa quotidiana che dice esattamente cosa studiare oggi:
- **Selettore di Settimana (da Settimana 1 a Settimana 8):**
  - Permette di scorrere le 8 settimane della sessione invernale.
  - Riporta il periodo di date (es. `17/11 - 23/11`), il monte ore previsto e badge di stato (*Settimana Attiva*, *Passata*, *Sovraccarico*).
- **Filtro Materia:** Pulsanti per mostrare *Tutte*, *Solo Analisi 1* o *Solo Geometria*.
- **Schede Giornaliere (Lun-Dom):**
  - Ciascun giorno indica lo slot orario (*Sera 19:30 - 22:00*, *Weekend*) e le ore totali assegnate rispetto al limite massimo.
  - **Identificazione Visiva:**
    - **OGGI:** Bordo ciano brillante con badge animato.
    - **SESSIONE SVOLTA:** Bordo verde smeraldo con indicazione delle ore fatte.
    - **GIORNO SALTATO:** Visuale opacizzata con promemoria del recupero automatico.
- **Card dell'Argomento e Console di Tracciamento Granulare:**
  - **Console Progresso Parziale Integrata:** Permette di separare il tempo speso dallo stato di completamento effettivo:
    - **Display delle Ore:** Indicatore `Ore spese: X.X / Y.Y stimate` con indicatore visivo delle `Residue da allocare`.
    - **Pulsanti Rapidi di Tempo:** Tasti `[- 30m]`, `[+ 30m]` e `[+ 1h]` per registrare sessioni parziali di studio senza dover per forza chiudere l'argomento.
    - **Micro Progress Bar:** Barra orizzontale dinamica che illustra graficamente la percentuale di ore spese rispetto alla stima.
    - **Toggle Distinto "Segna come Completato":** Pulsante dedicato e ben visibile per sancire la conclusione definitiva del tema (con badge `Completato ✓`).
  - **Timer Pomodoro 50/10 Sincronizzato:** Permette di avviare sessioni di focus interval; al completamento del ciclo o tramite i controlli rapidi (`+30m` / `Target Raggiunto`), il tempo viene automaticamente sommato alle `oreEffettive`.
  - Badge di materia, ID univoco (es. `A-09`, `G-14`) e capitolo.
  - Badge **+20% Buffer Priorità** (se l'argomento è complesso).
  - Titolo completo dell'argomento e deliverable didattico (es. *"Scrivere su foglio bianco la dimostrazione del Teorema di Torricelli"*).
  - Indicatori di Difficoltà (1-5) e Priorità Esame (1-5).

---

### 3. Storico & Diario di Studio
Questa schermata risponde alla necessità di vedere il passato e tracciare la propria costanza:
- **Indicatori Statistici Storici:**
  - *Data Attiva Odierna* con pulsanti per andare a ieri o a domani.
  - *Giorni Trascorsi* dall'avvio della sessione (16 Novembre 2026).
  - *Giorni di Studio Svolti* e monte ore totale effettivamente completato nel passato.
  - *Giorni Saltati* recuperati nei giorni successivi.
- **Filtri Timeline:** Visualizza *Tutti i Giorni*, *Solo Studiati* o *Solo Saltati*.
- **Timeline Cronologica Retrospettiva:**
  - Elenco dal giorno più recente a quello iniziale.
  - Per ogni giorno studiato: elenco dettagliato degli argomenti affrontati e ore spese.
  - Per ogni giorno saltato: attestazione visiva di assenza di studio e indicazione del ribilanciamento effettuato.

---

### 4. Catalogo Argomenti
L'archivio tabellare di tutti i 63 argomenti del corso di studi:
- **Barra di Ricerca in Tempo Reale:** Ricerca libera per ID (es. `G-18`), titolo, capitolo o dispense consigliate.
- **Filtri Selettivi:** Per materia (Analisi/Geometria), per stato (Tutti/Da fare/Completati) o filtro rapido per soli temi ad *Alta Priorità / Buffer*.
- **Azioni Rapide di Simulazione:**
  - *"Reset tutti a Da Fare":* Ripristina tutti i 63 argomenti allo stato iniziale.
  - *"Simula completamento prime 2 sett.":* Spunta automaticamente i primi argomenti per testare istantaneamente il comportamento dell'app a metà percorso.
- **Tabella Interattiva:** Consente di spuntare o deselezionare qualsiasi argomento direttamente dalla riga della tabella.

---

### 5. Import / Sync & Backup Dati
Il centro di gestione e interoperabilità dei file:
- **Box Stato Salvataggio Locale:** Notifica permanente che conferma la registrazione in `LocalStorage`.
- **Collegamento File System Locale Diretto (File System Access API):**
  - Permette di collegare un file locale (es. `studiplanner-data.json` salvato in una cartella sincronizzata con iCloud Drive, Google Drive, OneDrive o Dropbox).
  - Ad ogni modifica, sessione registrata o spunta, il file viene riscritto all'istante in background senza dover scaricare nulla manualmente.
- **Area Drag & Drop:** Trascina direttamente nell'area tratteggiata qualsiasi file didattico:
  - File CSV o TXT (es. `Geometria.txt`, `Analisi.csv`).
  - Fogli Excel (`.xlsx`) o LibreOffice Calc (`.ods`).
  - File di backup JSON (`.json`).
- **Pulsanti Operativi:**
  - **"Seleziona File":** Esplora risorse per caricare file dal proprio disco.
  - **"Carica Dataset Ufficiale UNIMORE":** Ricarica istantaneamente in memoria i 63 argomenti ufficiali del repository.
  - **"Esporta Excel (.xlsx)":** Genera e scarica un file Excel con l'intero piano aggiornato, comprensivo di stato, date assegnate e ore effettive.
  - **"Scarica Backup JSON":** Salva un file JSON contenente lo snapshot esatto di argomenti, impostazioni e storico.
  - **"Ripristina Backup JSON":** Carica un file JSON per ripristinare la sessione su qualsiasi altro computer o browser.

---

### 6. Sincronizzazione Cloud Automatica GitLab (Multi-Dispositivo)
La soluzione definitiva e trasparente per mantenere tutti i propri dispositivi (PC fisso, portatile, smartphone, tablet) perfettamente allineati senza dover fare nulla a mano:

- **Come Funziona (Zero Server Dedicati):**
  - L'applicazione dialoga direttamente con la REST API v4 di GitLab (`https://gitlab.com` o istanze self-hosted).
  - Lo stato completo (argomenti, ore effettive, sessioni registrate, impostazioni, override giornalieri) viene salvato come singolo file JSON crittografato in UTF-8 nel tuo repository GitLab dedicato (es. `data/studiplanner-state.json`).
- **Automazione Totale (Set and Forget):**
  - **Auto-Pull all'Avvio:** Non appena apri l'app su qualsiasi dispositivo, StudiPlanner contatta GitLab e scarica automaticamente la versione più recente dello stato.
  - **Auto-Push & Auto-Commit Trasparente:** Ogni volta che registri una sessione di studio, spunti un argomento o modifichi un orario, l'app effettua automaticamente un commit remoto su GitLab in background (debounced a 2.5s per evitare spam di commit).
  - **Badge di Stato Live nell'Header:** Mostra in tempo reale lo stato della sincronizzazione (`GitLab...` con icona animata durante il sync, orario dell'ultimo sync riuscito, o allerta in caso di problemi di rete).
- **Guida alla Configurazione in 1 Minuto:**
  1. Crea un repository GitLab (anche privato): es. `username/studiplanner-data`.
  2. Genera un **Personal Access Token** su GitLab (`User Settings` $\rightarrow$ `Access Tokens`) con permessi `api` oppure `read_repository, write_repository`.
  3. Nella schermata **Import / Sync** di StudiPlanner, compila i campi:
     - **Istanza:** `https://gitlab.com` (o la tua istanza GitLab).
     - **Project Path o ID:** `tuo-username/tuo-repo` (es. `mario-rossi/studiplanner-data`).
     - **Ramo (Branch):** `main`.
     - **Percorso File:** `data/studiplanner-state.json`.
     - **Personal Access Token:** incolla il tuo token `glpat-...`.
  4. Clicca **"🧪 Testa Connessione"**: l'app verifica l'accesso e, in caso di successo, attiva subito la sincronizzazione automatica.
  5. Ripeti il passaggio 3 sul tuo portatile, smartphone o tablet inserendo lo stesso repository e token: da quel momento in poi, qualsiasi studio registrato dal telefono in treno o sul portatile sarà già presente sul PC di casa!

---

### 7. Modal Parametri e Impostazioni
Accessibile cliccando sull'icona ingranaggio nell'header, permette di calibrare l'algoritmo:
- **Data Esame (Target):** Default `2027-01-10`.
- **Data Odierna (Simulata):** Permette di impostare una data a piacere per viaggiare avanti o indietro nel tempo.
- **Ore serali (Lun-Ven):** Ore disponibili a sera per chi lavora (default `2.5h/sera`).
- **Ore weekend (Sab-Dom):** Ore disponibili nei giorni festivi (default `4.5h/giorno`).
- **Soglia Critica Settimanale:** Valore oltre il quale scatta il banner di allerta (default `25 ore/settimana`).
- **Buffer Percentuale:** Percentuale di tempo aggiuntivo sui temi complessi (default `20%`).

---

### 8. Registrazione Rapida Studio (+) e Auto-Adattamento
Accessibile dal pulsante verde brillante **`+ Registra Studio`** nell'Header di navigazione, nel banner superiore della Dashboard o dal pulsante centrale della barra mobile:
- **Campi della Registrazione:**
  1. **Data della Sessione:** Di default è impostata sulla data odierna (`Oggi`), ma è liberamente modificabile per registrare retroattivamente sessioni passate.
  2. **Argomento Affrontato:** Topic Picker visivo interattivo con ricerca libera, pillole di filtro rapido (*Tutti*, *Analisi 1*, *Geometria*) ed anteprima live dell'argomento selezionato per garantire che la registrazione avvenga esattamente sul tema desiderato.
  3. **Ore di Studio Svolte:** Stepper con tasti rapidi `0.5h`, `1.0h`, `1.5h`, `2.0h`, `2.5h`, `3.0h` o inserimento manuale.
  4. **Stato di Completamento:** Checkbox automatica (suggerita se le ore accumulate raggiungono la stima dell'argomento) per sancire se il tema è concluso o ancora parziale.
  5. **Note / Diario Personale:** Campo facoltativo per appunti operativi (es. *"Esercizi su forme indeterminate svolti, rivedere Taylor all'ordine 3"*).
- **Auto-Adattamento in Tempo Reale (Rolling Engine):**
  - All'invio della sessione, il motore aggiorna le `oreEffettive` del tema.
  - Se il giorno registrato era una data passata precedentemente marcata come saltata, la trasforma all'istante in giornata di studio svolta nel diario e ricalcola il fabbisogno delle settimane future.

---

### 9. Scheda Informativa Dettagliata dell'Argomento
Cliccando su un qualsiasi argomento in **To-Do Settimanale**, nel **Catalogo Argomenti** o nello **Storico** (facendo clic sul titolo, sul codice badge o sul pulsante dedicato `ℹ Info`), si apre una scheda modale immersiva con tutti i dettagli:
- **Header Didattico:**
  - Badge della materia con colorazione tematica (Verde Smeraldo per *Analisi 1*, Viola/Indaco per *Geometria*).
  - Codice univoco (`A-XX` / `G-XX`), Capitolo di appartenenza e badge di stato (*Da Svolgere*, *In Corso*, *Completato*).
  - Titolo didattico per esteso e collocazione di calendario (data programmata o data di effettivo completamento).
- **Card Metriche di Sintesi:**
  - **Monte Ore:** Ore spese vs. stimate, ore residue e indicatore del buffer +20%.
  - **Difficoltà Cognitiva:** Da 1 a 5 con label verbale e badge visivo.
  - **Priorità d'Esame:** Da 1 a 5 con indicazione della frequenza d'apparizione (scritto/orale).
  - **Avanzamento:** Micro progress-bar percentuale e ore residue da completare.
- **Sezioni a Schede Interattive:**
  1. **📖 Programma & Contenuti:** Suddivisione dettagliata in sottotemi/concetti, *Deliverable Operativo* (obiettivo di fine studio) e testi universitari consigliati (Marcellini-Sbordone, Casali-Gagliardi-Grasselli).
  2. **📜 Teoremi & Prove d'Esame:** Requisiti specifici per la prova orale e scritta UNIMORE (dimostrazioni richieste, enunciati formali, criteri di correzione dei docenti e suggerimenti per massimizzare il voto).
  3. **📝 Diario Sessioni:** Storico cronologico di tutte le registrazioni di studio effettuate su quello specifico argomento, con data, ore parziali e note personali.
- **Azioni Rapide Integrate nel Footer:**
  - Toggle rapido *"Segna come Completato / Riapri"*.
  - Tasto *"Registra Ore su Questo Argomento"*: pre-compila all'istante il form di registrazione con il codice dell'argomento e il residuo ore rimasto.

---

## 6. Persistenza Dati e Sicurezza

L'applicazione garantisce che **nessun progresso venga perso**:
1. **LocalStorage HTML5:** Tutte le interazioni (cambio di data, spunta delle checkbox, modifiche alle ore o importazioni) vengono salvate all'istante nel database locale del browser sotto le chiavi:
   - `unimore_rebalancer_topics_v2`
   - `unimore_rebalancer_settings_v2`
2. **Resilienza ai Riavvii:** Puoi chiudere la scheda, spegnere il computer o riavviare il browser; al successivo accesso ritroverai il piano esattamente nello stato in cui lo avevi lasciato.
3. **Portabilità Tramite Backup:** Grazie al pulsante *"Scarica Backup JSON"*, puoi portare il tuo piano di studi su un altro portatile, tablet o smartphone in un secondo.

---

## 7. Dataset Didattici UNIMORE Integrati

L'applicazione include nativamente l'intero programma didattico ufficiale per la Coorte 2021 di Ingegneria Informatica UNIMORE:

### Analisi Matematica 1 (32 Argomenti — Docenti Guarino Lo Bianco / Manfredini)
- **A-01 a A-03:** Insiemi numerici, sup/inf, induzione, funzioni elementari e numeri complessi (De Moivre, radici $n$-esime).
- **A-04 a A-06:** Teoria dei limiti di successioni (unicità, carabinieri, permanenza segno, monotone, numero $e$, gerarchia infiniti).
- **A-07 a A-08:** Limiti di funzioni, teorema ponte, continuità e teoremi globali (Zeri per bisezione, Bolzano, Weierstrass).
- **A-09 a A-11:** Formula di Taylor (Peano $n=1,2$, Maclaurin) e prima simulazione parziale.
- **A-12 a A-16:** Calcolo differenziale, derivata composta/inversa, Fermat, Rolle, Lagrange, De L'Hôpital e studio di funzione completo.
- **A-17 a A-20:** Calcolo integrale (Riemann, Torricelli, media, metodi per parti e sostituzione, integrali impropri notevoli).
- **A-21 a A-24:** Serie numeriche (geometrica, armonica, criteri del rapporto/radice/Leibniz) e serie di Taylor.
- **A-25 a A-32:** Simulazioni cronometrate delle prove scritte, clinica recupero lacune e Prova Generale Finale Scritto + Orale.

### Geometria e Algebra Lineare (31 Argomenti — Programma Ufficiale UNIMORE)
- **G-01 a G-04:** Operazioni su matrici, determinante (Laplace, Binet), matrice inversa e rango a gradini ($T_1, T_2$).
- **G-05 a G-09:** Spazi vettoriali, basi, generatori, componenti e Relazione di Grassmann.
- **G-10 a G-13:** Trasformazioni lineari, $\ker(T)$, $\text{Im}(T)$, equazione dimensionale e matrici simili.
- **G-14 a G-16:** Sistemi lineari, Teorema di Rouché-Capelli e rappresentazione cartesiana/parametrica di sottospazi.
- **G-17 a G-19:** Autovalori, autovettori, molteplicità algebrica/geometrica, diagonalizzabilità e Teorema Spettrale.
- **G-20 a G-22:** Spazi vettoriali euclidei, prodotto scalare, disuguaglianza di Schwarz, Gram-Schmidt e complemento ortogonale.
- **G-23 a G-26:** Geometria analitica in $E^2$ ed $E^3$ (rette, piani, coefficienti direttori, mutue posizioni, distanze, aree e volumi).
- **G-27 a G-30:** Teoria delle coniche (ampliamento proiettivo, centro, assi, asintoti, forma canonica e fasci).
- **G-31:** Strutture algebriche di base (gruppi, anelli, campi, algebre di Boole).

---

## 9. Funzionalità Avanzate di Studio & Supporto per lo Studente Lavoratore

L'applicazione integra un ecosistema avanzato di strumenti progettati per ottimizzare ogni minuto a disposizione dello studente lavoratore:

1. **Spaced Repetition & Ripassi Ciclici Programmati:** Slot automatici di ripasso rapido a 3 giorni, 7 giorni e 21 giorni dal completamento di ciascun tema, per prevenire il decadimento mnemonico della teoria.
2. **Simulatore d'Esame Scritto Cronometrato (Mock Exam):** Timer ufficiale da 2 ore con estrazione casuale di compiti d'esame UNIMORE (Taylor, integrali impropri, serie numeriche, studi di funzione, sistemi a parametro $k$, diagonalizzazione, geometria analitica nello spazio).
3. **Checklist Teoremi & Dimostrazioni Orale (Feynman):** Controllo a 3 livelli (comprensione geometrica, enunciazione formale di ipotesi/tesi, dimostrazione scritta su foglio bianco senza sbirciare).
4. **Calcolatore Euristico Rischio Esame & Voto Atteso:** Stima continua del trend accademico basata sul rispetto dei buffer, ore studiate e regolarità.
5. **Registro degli Errori Ricorrenti (Bug Tracker Matematico):** Diario dei trabocchetti e degli errori ricorrenti commessi durante la risoluzione degli esercizi per ciascun capitolo.
6. **Modalità "Emergenza Lavoro / Settimana Straordinari":** Switch rapido per comprimere la settimana lavorativa complessa a 1h/sera e ridistribuire l'eccedenza senza dover alterare i singoli giorni a mano.
7. **Profilo "Holiday Bootcamp" (24 Dicembre – 6 Gennaio):** Rimodulazione automatica del periodo feriale natalizio con orari di studio intensivi (6-7h/giorno).
8. **Pomodoro Timer Intelligente con Auto-Log:** Rilevazione del completamento del ciclo da 50 minuti e prompt immediato per confermare e accreditare il tempo all'argomento attivo.
9. **Esportazione Calendario (`.ics` / Google Calendar / Outlook):** File di calendario dinamico per bloccare le fasce serali e prevenire conflitti con riunioni lavorative.
10. **Formulario & Cheat-Sheet Rapido a Scomparsa:** Pannello slide-out con tutti gli sviluppi notevoli di Maclaurin, tavole degli integrali, matrici, rette/piani nello spazio e formule delle coniche.
11. **Visualizzatore PDF Split-View Side-by-Side:** Apertura delle dispense dei docenti UNIMORE (Guarino Lo Bianco, Manfredini, Casali) direttamente affiancata al to-do di studio.
12. **Blocco Note & Scratchpad Markdown per Argomento:** Area note persistente e sincronizzata sul cloud per formule, dubbi e chiarimenti.
13. **Esportatore Flashcard per Anki / NeuraDeck:** Download immediato in formato CSV/TSV compatibile con Anki Mobile per ripassare nei tempi morti.
14. **Risoluzione Intelligente dei Conflitti Offline GitLab:** Merge a livello di sessione cronologica che previene sovrascritture accidentali se si studia da più dispositivi contemporaneamente.
15. **Streak Counter & Badge di Resilienza ("Ingegnere Notturno"):** Monitoraggio visivo dei giorni consecutivi di studio serale con badge motivazionali.
16. **Grafico Burndown (Tempo Previsto vs Reale):** Monitoraggio in stile Agile con linea ideale di discesa del debito ore verso il 10 Gennaio 2027.
17. **Retrospettiva Settimanale della Domenica Sera:** Bilancio automatico domenicale per fare il punto su ore svolte e raccomandazioni per il lunedì.
18. **Modalità "Ripasso Express Pre-Esame":** Triage degli ultimi 7 giorni che concentra l'attenzione esclusivamente sui temi a Priorità 5 e sulla Prova Generale Finale ($A\text{-}32$).

---

## 10. Domande Frequenti (FAQ)

### D: Cosa succede se per tutta una settimana non riesco a studiare a causa del lavoro?
**R:** Nessun problema. Quando riaprirai l'applicazione, tutti gli argomenti non svolti saranno rimasti intatti e l'algoritmo li spalmerà sulle settimane restanti. Se il monte ore richiesto supera le 25h/settimana, l'applicazione ti avviserà con l'alert di sovraccarico per suggerirti di incrementare le ore del weekend o iniziare ad anticipare le sessioni serali.

### D: Posso modificare manualmente le ore assegnate a un argomento?
**R:** Certamente. Puoi modificare il file CSV `Analisi.csv` o `Geometria.txt` e ricaricarlo tramite la schermata **Import / Sync**, oppure modificare i parametri orari generali nel modal delle impostazioni.

### D: L'app funziona anche offline senza connessione internet?
**R:** Sì. Il server Python locale gira interamente sulla tua macchina (`localhost`). Le icone e le funzioni di calcolo sono memorizzate localmente. Una volta caricata la prima volta nella cache del browser, l'app è completamente indipendente dalla rete.

### D: Come faccio a mantenere sincronizzati i progressi tra PC, portatile, tablet e smartphone in modo automatico?
**R:** Il modo più comodo e completamente automatico è utilizzare la **Sincronizzazione Cloud GitLab**:
1. Crea un repository gratuito (anche privato) su GitLab (es. `studiplanner-data`).
2. Genera un Personal Access Token con permessi `api` o `read_repository, write_repository`.
3. Inserisci il repository e il token nella scheda **Import / Sync** e clicca su **"🧪 Testa Connessione"**.
4. Ripeti l'operazione sugli altri tuoi dispositivi (smartphone, tablet o portatile).

A questo punto non devi più preoccuparti di nulla: l'applicazione esegue un **auto-pull all'avvio** per scaricare le ultime novità e un **auto-push trasparente ad ogni modifica o sessione registrata**! In alternativa puoi sempre usare il metodo manuale scaricando e ricaricando il file JSON con **"Scarica Backup JSON"** o collegando la cartella cloud (Google Drive, iCloud) con la **File System Access API**.
