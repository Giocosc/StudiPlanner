# Guida all'uso di StudiPlanner

**Pianificatore adattivo per gli esami di Analisi Matematica 1 e Geometria e Algebra Lineare (UNIMORE)**

Questa guida spiega come usare l'app giorno per giorno: come legge il piano, come si registra lo studio, come si adatta agli imprevisti e come si tengono allineati più dispositivi. Per i dettagli tecnici vedere [docs/INDEX.md](docs/INDEX.md).

---

## Indice

1. [A cosa serve](#1-a-cosa-serve)
2. [Avvio](#2-avvio)
3. [Come viene costruito il piano](#3-come-viene-costruito-il-piano)
4. [Le schermate](#4-le-schermate)
5. [Registrare lo studio](#5-registrare-lo-studio)
6. [Scheda dell'argomento](#6-scheda-dellargomento)
7. [Impostazioni](#7-impostazioni)
8. [Strumenti di studio](#8-strumenti-di-studio)
9. [Dati, backup e più dispositivi](#9-dati-backup-e-più-dispositivi)
10. [Programma precaricato](#10-programma-precaricato)
11. [Domande frequenti](#11-domande-frequenti)

---

## 1. A cosa serve

Chi lavora a tempo pieno studia la sera e nel weekend, e prima o poi salta qualche giorno per straordinari, stanchezza o imprevisti. Con un piano statico (un foglio Excel, un calendario a blocchi fissi) basta una serata persa per rendere inutili tutte le scadenze successive.

StudiPlanner ricalcola il piano a ogni modifica, da oggi fino al giorno d'esame (default **10 gennaio 2027**):

- se salti un giorno, gli argomenti rimasti indietro ripartono da oggi, nello stesso ordine;
- se vai avanti più veloce, gli argomenti successivi vengono anticipati e guadagni giorni di ripasso;
- l'ordine propedeutico (`A-01 → A-32`, `G-01 → G-31`) non viene mai alterato.

---

## 2. Avvio

1. Apri un terminale nella cartella del progetto ed esegui:
   ```powershell
   python server.py
   ```
   oppure fai doppio clic su `start-app.bat`.
2. Si apre il browser su `http://localhost:3000`. Se la porta è occupata il server usa la successiva libera (fino a 3009): l'indirizzo esatto è nei log.
3. Dagli altri dispositivi della stessa rete (tablet, portatile, telefono) usa l'**indirizzo LAN** mostrato nei log, ad esempio `http://192.168.1.20:3000`.

**Installare come app.** In Chrome o Edge usa l'icona "Installa" nella barra degli indirizzi (o il menu ⋮ → *Installa StudiPlanner*): l'app si apre in una finestra dedicata e funziona anche offline dopo il primo caricamento. Per collegamento sulla taskbar, icona nella system tray e avvio automatico vedi [docs/06](docs/06_DEVOPS_AND_SCRIPTS.md#5-integrazione-windows).

> Aprire `index.html` con un doppio clic (indirizzo `file://`) funziona solo in parte: installazione, funzionamento offline e alcune funzioni del browser richiedono il server.

---

## 3. Come viene costruito il piano

### 3.1 La data attiva

Il piano parte dalla **data attiva** ("Oggi"), che segue la data reale e passa da sola al giorno successivo. Con i pulsanti `◀` / `▶` nell'header puoi simulare altri giorni (per vedere cosa succede se salti una sera) e tornare con **Oggi Reale**. La data attiva è propria di ogni dispositivo e non viene sincronizzata.

### 3.2 Ore disponibili

| Giorni | Budget di default |
| :--- | :--- |
| Lunedì – venerdì | 2,5 h la sera (19:30 – 22:00; venerdì 19:00 – 21:30) |
| Sabato e domenica | 4,5 h al giorno |

Totale nominale: 5 × 2,5 + 2 × 4,5 = **21,5 h/settimana**. Ogni giorno può essere modificato con il Time Shifter (§4.3). Lunedì, mercoledì e venerdì sono dedicati di preferenza ad Analisi, martedì e giovedì a Geometria, il weekend è misto.

### 3.3 Ordine e buffer

- Gli argomenti di ogni materia vengono pianificati **in ordine di ID**. Priorità e difficoltà non cambiano mai l'ordine.
- Agli argomenti con **priorità ≥ 4 o difficoltà ≥ 4** viene aggiunto un **+20%** di tempo sulle ore residue. Esempio: un argomento stimato 2,5 h e ancora da iniziare riceve 3 h nel piano.
- Un argomento aperto ha sempre almeno 30 minuti nel piano, anche se hai già superato la stima: resta lì finché non lo segni come completato.

### 3.4 Blocchi e argomenti divisi

Nessun giorno riceve più ore del suo budget. Se un argomento non entra in una sera, viene **diviso**: la card mostra "Parte 1/2" oggi e "Parte 2/2" il giorno dopo, con le ore di ciascun blocco. L'argomento successivo inizia solo dopo l'ultima parte.

### 3.5 Giorni saltati e anticipi

- **Giorno saltato.** Un giorno passato senza sessioni né argomenti completati viene segnato come saltato. I suoi argomenti non si perdono: ripartono da oggi.
- **Anticipo.** Se completi argomenti in anticipo, i giorni successivi prendono subito gli argomenti seguenti e il calendario si accorcia.

### 3.6 Regole sul finale

- La **Prova Generale `A-32`** viene pianificata solo negli ultimi 7 giorni prima dell'esame.
- Il **giorno d'esame** non riceve studio.

### 3.7 Sovraccarico e calendario saturo

- **Ritmo richiesto**: ore residue (con buffer) diviso settimane residue. Se supera la soglia (default **25 h/settimana**), la Dashboard segnala il sovraccarico.
- **Calendario saturo**: se le ore residue non entrano nei budget giornalieri prima dell'esame, il piano aumenta in proporzione il carico di ogni giorno e la Dashboard lo segnala. Aumenta le ore con il Time Shifter o nelle impostazioni per tornare a un piano sostenibile.

---

## 4. Le schermate

### 4.1 Header

- **`+ Registra Studio`**: registra una sessione per qualsiasi data e argomento.
- **Data attiva** con `◀` / `▶` e **Oggi Reale**.
- **Conto alla rovescia** all'esame.
- **Badge GitLab** (se attivo): sync in corso, ora dell'ultimo sync o errore.
- **Formulario** (`F2`), **PDF affiancato**, **Impostazioni** (ingranaggio).
- Su telefono e tablet una barra in basso dà accesso alle schede e al pulsante `+`.

### 4.2 Dashboard

- **Indicatori principali**: giorni e settimane all'esame, ritmo richiesto rispetto alla soglia, ore residue con la quota di buffer, completamento complessivo.
- **Avanzamento per materia** con indicatore di passo rispetto alla traiettoria ideale: *In vantaggio*, *Al passo* o *In ritardo* (con le ore di scarto) e una tacca sulla barra che mostra dove dovresti essere oggi.
- **Ripassi in scadenza** (ripetizione spaziata).
- **Costanza**: serie di giorni consecutivi di studio (conta un giorno con almeno 0,8 h reali), record, badge e traguardi.
- **Previsione d'esame**: punteggio di preparazione, fascia di voto e probabilità stimata, calcolati da ritmo, costanza e completamento. È un'euristica motivazionale, non una previsione accurata.
- **Burndown**: ore stimate residue contro la linea ideale dall'inizio della roadmap all'esame.
- **Strumenti AI**: generatore di flashcard, simulatore d'esame, registro errori.

### 4.3 To-Do settimanale

La vista operativa: cosa studiare ogni giorno della settimana selezionata.

**Barra della settimana**
- Navigazione tra le settimane della roadmap, con ore totali e badge (*Attiva*, *Passata*, *Sovraccarico*).
- Filtro per materia.
- **⚡ Emergenza lavoro**: porta le sere feriali della settimana a 1 h e aggiunge 1,5 h ai giorni di weekend (massimo 8 h). Un secondo clic ripristina.
- **🎄 Bootcamp Natale**: 6,5 h al giorno dal 24 dicembre al 6 gennaio (anni calcolati dalla data d'esame).
- **🎯 Ripasso express**: negli ultimi 7 giorni mostra solo gli argomenti a priorità o difficoltà alta e le prove generali.
- **📅 Esporta .ics**: calendario con i blocchi pianificati da oggi in poi (§8).
- **📊 Retrospettiva**: bilancio della settimana (§8).

**Scheda del giorno**
- Fascia oraria, ore pianificate rispetto al budget e stato: **OGGI**, **studiato**, **saltato**, **riposo**.
- **Time Shifter**: `−30m` e `+30m` cambiano il budget di quel giorno (da 0 a 12 h; a 12 h il `+30m` si disattiva); `↺` torna al default. Il piano si ricalcola subito.
- `+ Registra Studio` con la data del giorno già impostata.

**Card dell'argomento**
- Materia, ID, capitolo, titolo, obiettivo didattico, difficoltà e priorità, badge **+20%** e **Parte i/N**.
- Ore spese sulla stima, ore residue, barra di avanzamento.
- `−30m`, `+30m`, `+1h`: correzioni rapide delle ore spese, senza creare una sessione.
- `+ Log`: registra una sessione su quell'argomento.
- **Segna come completato** / riapri.
- **Pomodoro 50/10**: a fine ciclo di focus il tempo diventa una sessione nel diario; quando il focus accumulato raggiunge l'obiettivo del timer, l'argomento viene completato e il timer si ferma. Il tempo è misurato sull'orologio, quindi resta corretto anche se la scheda resta in background. Il Pomodoro non toglie mai un completamento.
- **Ripassi** del giorno (R1/R2/R3) da spuntare.

### 4.4 Storico e diario

- Statistiche: giorni trascorsi dall'inizio della roadmap, giorni studiati, ore totali, giorni saltati.
- **Heatmap** delle attività (colore più intenso = più ore).
- Timeline dal giorno più recente, filtrabile (*Tutti*, *Studiati*, *Saltati*), con le sessioni e gli argomenti completati di ogni giorno.
- Da qui puoi registrare studio su una data passata (un giorno saltato diventa studiato) o **cancellare una sessione** sbagliata.

### 4.5 Catalogo argomenti

- Tabella dei 63 argomenti con ricerca per ID, titolo, capitolo o fonti.
- Filtri per materia, stato (*da fare*, *in corso*, *completati*) e alta priorità.
- Spunta diretta dalla riga.
- **Reset tutti a "Da fare"** e **Simula completamento** (prime due settimane) per provare il comportamento del piano.

### 4.6 Import / Sync

- Stato del salvataggio locale e del file collegato.
- Area drag & drop e selezione file (CSV/TXT, Excel/ODS, backup JSON).
- **Carica dataset ufficiale**, **Esporta Excel**, **Scarica / Ripristina backup JSON**.
- **File locale collegato** (Chrome/Edge).
- **Sincronizzazione GitLab** (§9.3).

---

## 5. Registrare lo studio

Il modale **Registra Studio** si apre dall'header, dalla Dashboard, dai giorni del To-Do, dalle card (`+ Log`), dallo Storico e dalla scheda dell'argomento.

1. **Data**: oggi, ieri o qualsiasi data (anche passata, per recuperare un giorno saltato).
2. **Argomento**: ricerca per ID o parole, filtro per materia; l'anteprima mostra ore svolte e stimate.
3. **Ore**: stepper da 30 minuti, valori rapidi o "tutto il residuo".
4. **Completato**: proposto automaticamente quando le ore raggiungono la stima; puoi cambiarlo.
5. **Note** facoltative (esercizi svolti, pagine, dubbi).

La scheda **Ultime sessioni** del modale permette di rivedere e cancellare le registrazioni recenti.

### 5.1 Regole sulle ore e sul completamento

| Azione | Effetto |
| :--- | :--- |
| Registri una sessione **parziale** | Le ore si sommano; l'argomento resta nel piano con il residuo. |
| Registri una sessione **completata** | L'argomento è completato nella data della sessione ed esce dal piano futuro. |
| Registri ore su un argomento **già completato** senza spuntare "completato" | Le ore si sommano, il completamento **resta**. |
| **Spunti** un argomento senza aver registrato ore | Si considera svolta la stima. Se togli la spunta, quelle ore presunte vengono tolte. |
| **Cancelli** una sessione | Le sue ore vengono tolte. L'argomento si riapre solo se era stata quella sessione a completarlo; uno spuntato a mano resta completato. |
| Usi `±30m` sulla card | Corregge le ore spese senza creare una sessione nel diario. |

---

## 6. Scheda dell'argomento

Si apre cliccando su ID, titolo o `ℹ` di un argomento in qualsiasi vista.

- **Intestazione**: materia, ID, capitolo, stato, data pianificata o di completamento.
- **Metriche**: ore spese / stimate / residue con buffer, difficoltà, priorità, avanzamento.
- **Programma e contenuti**: sottotemi, obiettivo operativo, testi consigliati.
- **Teoremi e prove d'esame**: dimostrazioni richieste, enunciati, consigli per lo scritto e l'orale, **checklist di Feynman** a tre livelli (intuizione, enunciato formale, dimostrazione a libro chiuso).
- **Diario sessioni** dell'argomento.
- **Appunti** personali in Markdown con anteprima e modelli rapidi. Gli appunti sono separati dal focus didattico ufficiale dell'argomento, che resta intatto.
- Azioni rapide: completa / riapri, registra ore su questo argomento.

---

## 7. Impostazioni

Dall'ingranaggio nell'header:

| Parametro | Default | Note |
| :--- | :--- | :--- |
| Data d'esame | 10/01/2027 | Le date di ripasso express e Bootcamp seguono questa data. |
| Data attiva | oggi | Con "Usa oggi reale". |
| Ore sere feriali | 2,5 h | `0` è ammesso (nessuno studio feriale). |
| Ore weekend | 4,5 h | `0` è ammesso. |
| Soglia critica settimanale | 25 h | Oltre questo ritmo scatta l'avviso di sovraccarico. |
| Buffer | 20% | `0%` lo disattiva. |

Il salvataggio applica solo i campi che hai modificato, quindi non annulla altre modifiche fatte nel frattempo (per esempio la data cambiata con le frecce). Il modale mostra anche quanti giorni hanno un override del Time Shifter e permette di azzerarli tutti.

---

## 8. Strumenti di studio

| Strumento | Dove | Cosa fa |
| :--- | :--- | :--- |
| **Ripetizione spaziata** | Dashboard, To-Do | Ripassi a +3, +7, +21 giorni dal completamento; quelli arretrati compaiono nel giorno attivo. |
| **Simulatore d'esame** | Dashboard | Prova cronometrata (Analisi 120 min / 6 esercizi, Geometria 90 min / 11 quesiti) con autovalutazione, oppure prompt per Claude/ChatGPT con argomenti estratti tra i completati a priorità ≥ 3, in ordine di ID. |
| **Flashcard NeuraDeck / Anki** | Dashboard | Prompt per NotebookLM sugli argomenti completati di recente (output CSV `Fronte,Retro`) ed export TSV per Anki. |
| **Registro errori ricorrenti** | Dashboard | Trabocchetti tipici precaricati e registrazione dei tuoi, con regola di correzione e stato "padroneggiato". |
| **Formulario** | `F2` | Sviluppi di Maclaurin, integrali, Grassmann, Rouché-Capelli, diagonalizzazione, Gram-Schmidt, geometria analitica, coniche; ricerca e copia rapida. |
| **PDF affiancato** | Header | Dispense ed eserciziari accanto al piano, anche da file locale. |
| **Retrospettiva settimanale** | To-Do | Ore studiate rispetto al budget dei giorni trascorsi, efficienza, argomenti chiusi e rimasti; pulsante per aggiungere 30 minuti alle sere della settimana successiva. |
| **Export calendario (.ics)** | To-Do | Un evento per ogni giorno da oggi in poi con studio pianificato, all'ora della fascia del giorno e con durata pari alle ore pianificate, promemoria 15 minuti prima. Reimportando il file gli eventi vengono aggiornati, non duplicati. |
| **CLARKE-9000** | In basso a destra | Companion con telemetria e citazioni; si può ridurre a icona e silenziare. |

---

## 9. Dati, backup e più dispositivi

### 9.1 Salvataggio locale

Ogni modifica è salvata subito nel `localStorage` del browser. Chiudere la scheda o riavviare il computer non fa perdere nulla. Cancellare i dati del sito dal browser invece cancella il piano: tieni un backup o attiva il sync.

### 9.2 Backup e file collegato

- **Scarica backup JSON**: copia completa di argomenti, impostazioni, Time Shifter e sessioni; **Ripristina backup JSON** la ricarica su qualsiasi browser.
- **Collega file locale** (Chrome/Edge): scegli un file `.json`, magari in una cartella sincronizzata (OneDrive, iCloud Drive, Google Drive). L'app lo riscrive a ogni modifica.
- **Reimportare un CSV** aggiorna titoli, stime e priorità senza cancellare ore, appunti e completamenti. **Da Excel/ODS** si importano solo i completamenti, riconosciuti per ID esatto o titolo.

### 9.3 Sincronizzazione GitLab

Tiene allineati PC, portatile, tablet e telefono usando un repository GitLab privato come archivio, senza server intermedi.

**Configurazione (una volta per dispositivo)**
1. Crea un repository privato su GitLab, ad esempio `tuo-utente/studiplanner-data`.
2. Crea un **Personal Access Token** (*User Settings → Access Tokens*) con scope `api`, oppure `read_repository` + `write_repository`.
3. In **Import / Sync** compila:
   - Istanza: `https://gitlab.com` (o la tua istanza)
   - Progetto: `tuo-utente/studiplanner-data`
   - Branch: `main`
   - Percorso file: `data/studiplanner-state.json`
   - Token: `glpat-…`
4. Premi **Testa connessione**: se riesce, il sync si attiva.
5. Ripeti sugli altri dispositivi con lo stesso repository.

**Come funziona**
- L'app si sincronizza all'apertura, circa 2,5 secondi dopo ogni modifica e quando torni sulla finestra o sulla scheda.
- Ogni sync **legge** il file remoto, lo **fonde** con i dati locali e **scrive** il risultato solo se è cambiato qualcosa.
- Se due dispositivi scrivono quasi insieme, GitLab rifiuta la seconda scrittura; l'app rilegge e rifonde automaticamente, senza perdere nulla.
- **Pull** manuale: scarica e fonde senza scrivere. **Push** manuale: sync completo con un messaggio di commit a tua scelta.

**Cosa succede ai dati quando si fondono**

| Situazione | Risultato |
| :--- | :--- |
| Hai registrato sessioni offline su due dispositivi | Le sessioni si sommano: nessuna ora persa. |
| Hai cancellato una sessione su un dispositivo | Sparisce anche dagli altri. |
| Hai tolto la spunta a un argomento o svuotato un appunto | Vince la modifica più recente, quindi si propaga. |
| Hai cambiato impostazioni o Time Shifter, anche azzerandolo | Vince la modifica più recente. |
| Data attiva | Resta quella di ciascun dispositivo. |

**Privacy.** Il token resta solo nel browser del dispositivo e viene inviato solo all'istanza GitLab indicata. Il file di stato **non è cifrato**: usa un repository privato e un token con i permessi minimi, e non attivare il sync su computer condivisi.

---

## 10. Programma precaricato

### Analisi Matematica 1 — 32 argomenti

- **A-01 – A-03**: insiemi numerici, sup/inf, induzione, funzioni elementari, numeri complessi (De Moivre, radici n-esime).
- **A-04 – A-06**: limiti di successioni (unicità, carabinieri, permanenza del segno, successioni monotone, numero *e*, gerarchia degli infiniti).
- **A-07 – A-08**: limiti di funzioni, teorema ponte, continuità, teoremi degli zeri, di Bolzano e di Weierstrass.
- **A-09 – A-11**: formula di Taylor con resto di Peano, sviluppi di Maclaurin, prima simulazione.
- **A-12 – A-16**: derivate (composta, inversa), Fermat, Rolle, Lagrange, De L'Hôpital, studio di funzione.
- **A-17 – A-20**: integrale di Riemann, teorema fondamentale, integrazione per parti e per sostituzione, integrali impropri.
- **A-21 – A-24**: serie numeriche (geometrica, armonica, criteri del rapporto, della radice, di Leibniz), serie di Taylor.
- **A-25 – A-32**: simulazioni cronometrate, recupero lacune, Prova Generale (scritto + orale).

### Geometria e Algebra Lineare — 31 argomenti

- **G-01 – G-04**: matrici, determinante (Laplace, Binet), inversa, rango.
- **G-05 – G-09**: spazi vettoriali, generatori, basi, dimensione, Grassmann.
- **G-10 – G-13**: applicazioni lineari, nucleo e immagine, teorema delle dimensioni, matrici associate e simili.
- **G-14 – G-16**: sistemi lineari, Rouché-Capelli, rappresentazioni cartesiane e parametriche.
- **G-17 – G-19**: autovalori e autovettori, molteplicità, diagonalizzabilità, teorema spettrale.
- **G-20 – G-22**: spazi euclidei, prodotto scalare, Cauchy-Schwarz, Gram-Schmidt, complemento ortogonale.
- **G-23 – G-26**: geometria analitica nel piano e nello spazio (rette, piani, posizioni reciproche, distanze, aree, volumi).
- **G-27 – G-30**: coniche (ampliamento proiettivo, centro, assi, asintoti, forma canonica, fasci).
- **G-31**: strutture algebriche (gruppi, anelli, campi, algebre di Boole).

Syllabus completo, pesi d'esame e teoremi: [docs/05](docs/05_ACADEMIC_MODEL_AND_SYLLABUS.md).

---

## 11. Domande frequenti

**Per una settimana non riesco a studiare. Cosa succede?**
Niente va perso: alla riapertura gli argomenti arretrati ripartono da oggi e il piano si ridistribuisce sulle settimane restanti. Se il ritmo richiesto supera la soglia o il calendario diventa saturo, la Dashboard te lo segnala: usa il Time Shifter, le ore del weekend o la modalità Bootcamp per recuperare.

**Posso cambiare le ore stimate di un argomento?**
Sì: modifica `Analisi/Analisi.csv` o `Geometria/Geometria.txt` e reimportali da **Import / Sync**. Il progresso già registrato resta. Le ore disponibili per giorno si cambiano dalle impostazioni o con il Time Shifter.

**Ho registrato una sessione sbagliata.**
Cancellala dallo Storico o da *Ultime sessioni* nel modale di registrazione: ore e completamento tornano come prima. Con il sync attivo la cancellazione si propaga agli altri dispositivi.

**Ho spuntato per errore un argomento.**
Togli la spunta: le ore presunte aggiunte dalla spunta vengono rimosse e l'argomento torna nel piano.

**Perché un argomento compare su due giorni?**
Non entrava nel budget di una sola sera ed è stato diviso in parti ("Parte 1/2", "Parte 2/2").

**Funziona offline?**
Sì. Dopo il primo caricamento l'app è nella cache del browser e i dati sono locali. Il sync GitLab riprende quando torna la rete.

**Come tengo allineati più dispositivi?**
Con la sincronizzazione GitLab (§9.3). In alternativa puoi collegare su ogni dispositivo lo stesso file JSON in una cartella cloud, oppure spostare a mano un backup JSON.
