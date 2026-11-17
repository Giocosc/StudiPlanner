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
   - [6. Modal Parametri e Impostazioni](#6-modal-parametri-e-impostazioni)
6. [Persistenza Dati e Sicurezza](#6-persistenza-dati-e-sicurezza)
7. [Dataset Didattici UNIMORE Integrati](#7-dataset-didattici-unimore-integrati)
8. [Domande Frequenti (FAQ)](#8-domande-frequenti-faq)

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
- **Selettore Rapido "Oggi" (`◀ Ieri` • Data • `Domani ▶`):** Permette di simulare con un click l'avanzamento dei giorni per verificare istantaneamente come il piano si riadatta se salti un giorno o studi in anticipo.
- **Conto alla Rovescia:** Mostra in tempo reale i giorni e le settimane mancanti al 10 Gennaio 2027.
- **Pulsante Impostazioni (icona ingranaggio):** Apre il pannello per personalizzare parametri, orari e date.
- **Bottom Navigation Bar (su Mobile e Tablet):** Barra inferiore touch con pulsanti rapidi per Dashboard, Settimanale, Storico, Argomenti e File.

---

### Banner di Notifica e Allerta

1. **Allerta Sovraccarico Critico (Rosso/Ambra):**
   - Appare solo quando il ritmo settimanale supera la soglia di sicurezza.
   - Mostra il monte ore richiesto (es. `28.3 h / sett.`), il surplus rispetto alla soglia e un pulsante *"Strategia di Recupero"* con 3 consigli concreti:
     1. Espansione dei blocchi del weekend (es. portare il sabato a 6h).
     2. Anticipo della sessione serale alle 19:00.
     3. Scaletta di concentrazione sui soli argomenti a Priorità 5.

2. **Banner Ribilanciamento Dinamico Attivo (Ciano/Indaco):**
   - Appare non appena il sistema rileva giorni passati senza studio svolto.
   - Conferma che nessun argomento è andato perduto e che tutti i compiti sono stati spalmati da oggi in avanti.

---

### 1. Dashboard
La Dashboard offre una panoramica d'impatto sullo stato di avanzamento:
- **4 Carte KPI Superiori:**
  - *Target Esame:* 10 Gennaio 2027 con conteggio giorni e settimane rimanenti.
  - *Fabbisogno Settimanale:* Ore/settimana necessarie con etichetta di sostenibilità o allerta.
  - *Ore Residue:* Monte ore effettivo rimanente con indicazione del buffer (+20%).
  - *Completamento:* Percentuale globale complessiva ($0\% - 100\%$).
- **Progress Bar Analisi Matematica 1:**
  - Barra graduata color Smeraldo/Teal basata su `Ore_Completate / Ore_Stimate`.
  - Contatore argomenti svolti (`X / 32`), ore residue e promemoria della struttura d'esame scritto (5-6 esercizi da svolgere).
- **Progress Bar Geometria e Algebra:**
  - Barra graduata color Indaco/Viola basata su `Ore_Completate / Ore_Stimate`.
  - Contatore argomenti svolti (`X / 31`), ore residue e promemoria della struttura d'esame scritto (test a 11 quesiti a risposta multipla).
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

### 6. Modal Parametri e Impostazioni
Accessibile cliccando sull'icona ingranaggio nell'header, permette di calibrare l'algoritmo:
- **Data Esame (Target):** Default `2027-01-10`.
- **Data Odierna (Simulata):** Permette di impostare una data a piacere per viaggiare avanti o indietro nel tempo.
- **Ore serali (Lun-Ven):** Ore disponibili a sera per chi lavora (default `2.5h/sera`).
- **Ore weekend (Sab-Dom):** Ore disponibili nei giorni festivi (default `4.5h/giorno`).
- **Soglia Critica Settimanale:** Valore oltre il quale scatta il banner di allerta (default `25 ore/settimana`).
- **Buffer Percentuale:** Percentuale di tempo aggiuntivo sui temi complessi (default `20%`).

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

## 8. Domande Frequenti (FAQ)

### D: Cosa succede se per tutta una settimana non riesco a studiare a causa del lavoro?
**R:** Nessun problema. Quando riaprirai l'applicazione, tutti gli argomenti non svolti saranno rimasti intatti e l'algoritmo li spalmerà sulle settimane restanti. Se il monte ore richiesto supera le 25h/settimana, l'applicazione ti avviserà con l'alert di sovraccarico per suggerirti di incrementare le ore del weekend o iniziare ad anticipare le sessioni serali.

### D: Posso modificare manualmente le ore assegnate a un argomento?
**R:** Certamente. Puoi modificare il file CSV `Analisi.csv` o `Geometria.txt` e ricaricarlo tramite la schermata **Import / Sync**, oppure modificare i parametri orari generali nel modal delle impostazioni.

### D: L'app funziona anche offline senza connessione internet?
**R:** Sì. Il server Python locale gira interamente sulla tua macchina (`localhost`). Le icone e le funzioni di calcolo sono memorizzate localmente. Una volta caricata la prima volta nella cache del browser, l'app è completamente indipendente dalla rete.

### D: Come faccio a trasferire i miei progressi dal PC al tablet o cellulare?
**R:** Vai nella scheda **Import / Sync**, clicca su **"Scarica Backup JSON"**. Invia il file `.json` al tuo dispositivo e, aprendo l'app sul tablet, clicca su **"Seleziona File"** caricando il backup: tutti i tuoi argomenti completati e le date verranno sincronizzati all'istante.
