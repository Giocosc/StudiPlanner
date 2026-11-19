# Documentazione tecnica di StudiPlanner

Indice della documentazione per chi sviluppa, mantiene o estende l'app. Per l'uso quotidiano vedere [GUIDA_APPLICAZIONE.md](../GUIDA_APPLICAZIONE.md); per una panoramica il [README](../README.md).

---

## Documenti

| # | Documento | Contenuto |
| :--- | :--- | :--- |
| 01 | [Architettura](01_ARCHITECTURE.md) | Caricamento nel browser, pipeline di build, stato globale, chiavi `localStorage`, modello dati, PWA e Service Worker |
| 02 | [Motore di ribilanciamento](02_REBALANCER_ENGINE.md) | Invarianti, ore residue e buffer, calendario, allocazione a blocchi, saturazione, ripetizione spaziata, metriche |
| 03 | [Servizi e sincronizzazione](03_SERVICES_AND_SYNC.md) | Stato degli argomenti, import CSV/Excel, export ICS, sync GitLab (merge, tombstone, concorrenza) |
| 04 | [Componenti UI](04_UI_COMPONENTS.md) | Props e comportamenti dei componenti React, flussi di interazione, linee guida della UI |
| 05 | [Modello didattico e syllabus](05_ACADEMIC_MODEL_AND_SYLLABUS.md) | Profilo dello studente lavoratore, syllabus dei 63 argomenti, teoremi, metodo di studio, NotebookLM |
| 06 | [Build, test e DevOps](06_DEVOPS_AND_SCRIPTS.md) | Ciclo di sviluppo, test unitari ed E2E, server locale, integrazione Windows |

Documenti nella radice del repository:

- [GEMINI.md](../GEMINI.md) e [AGENTS.md](../AGENTS.md) — regole vincolanti per gli agenti AI.
- [PIANO_NOTEBOOKLM.md](../PIANO_NOTEBOOKLM.md), [PIANO_NOTEBOOKLM_Gemini.md](../PIANO_NOTEBOOKLM_Gemini.md) — organizzazione dei materiali di studio in NotebookLM.

---

## Percorsi di lettura

| Obiettivo | Leggere |
| :--- | :--- |
| Capire il progetto in 10 minuti | README → 01 §1–4 |
| Modificare la pianificazione | 02 per intero, poi `tests/engine.test.mjs` |
| Toccare il sync GitLab | 03 §4, poi `tests/gitlabSync.test.mjs` |
| Aggiungere un componente o una vista | 01 §3 (scope condiviso del bundle), 04 §7 |
| Aggiungere un formato di import | 03 §2 |
| Installare l'app su Windows | 06 §4–5 |

---

## Vincoli che ogni modifica deve rispettare

1. **Ordine sequenziale.** `A-01 → A-32` e `G-01 → G-31`; priorità e difficoltà non riordinano mai la coda.
2. **Buffer +20%** solo per priorità ≥ 4 o difficoltà ≥ 4, applicato alle ore residue.
3. **Modello del lavoratore.** 2,5 h nelle sere feriali, 4,5 h nei giorni di weekend, Time Shifter 0–12 h per giorno, soglia di sovraccarico configurabile (default 25 h/settimana).
4. **Build e test** dopo ogni modifica in `src/`: `python scripts\build_bundle.py`, `npm test`, `python scripts\test_rolling_rebalance.py`, `python scripts\test_tonight_and_mock_exams.py`.
5. **Sync GitLab senza perdite.** Decodifica base64 UTF-8, debounce, fusione con tombstone e timestamp, scrittura con `last_commit_id`.

---

## Glossario

| Termine | Significato |
| :--- | :--- |
| **Data attiva** (`currentSimulatedDate`) | Il "giorno corrente" del piano. Segue la data reale ma si può spostare per simulare; non viene sincronizzata. |
| **Ore residue** | `oreStimate − oreEffettive`, con un minimo di 0,5 h per un argomento ancora aperto. |
| **Ore effettive** (`effectiveHours`) | Ore residue più l'eventuale buffer del 20%: sono quelle che il motore pianifica. |
| **Blocco / parte** | Porzione di un argomento pianificata in un giorno. Un argomento lungo è diviso in "Parte 1/N … N/N". |
| **Saturazione** (`capacityScale`) | Fattore per cui vanno moltiplicati i budget giornalieri perché il programma entri prima dell'esame (1 = nessuna saturazione). |
| **Time Shifter** | Override del budget di un singolo giorno (`customDayCapacities`). |
| **Giorno saltato** | Giorno passato abilitato senza sessioni né completamenti; i suoi argomenti vengono ripianificati da oggi. |
| **Tombstone** | ID di una sessione cancellata, conservato per impedire che il sync la faccia ricomparire. |
| **`updatedAt` / `syncMeta`** | Timestamp dell'ultima modifica di un argomento / di una sezione, usati per far vincere la modifica più recente nel merge. |
| **`last_commit_id`** | ID dell'ultimo commit che ha toccato il file remoto; GitLab rifiuta la scrittura se nel frattempo è cambiato. |
| **Ripasso spaziato** | Promemoria a +3, +7, +21 giorni dal completamento (R1, R2, R3). |
| **Finestra pre-esame** | Gli ultimi 7 giorni prima dell'esame (modalità "Ripasso express"). |
