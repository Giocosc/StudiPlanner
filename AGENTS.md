# Linee guida per gli agenti — StudiPlanner

Regole per qualsiasi agente AI (Antigravity, Gemini, Claude, …) che lavora su questo repository.

Il documento di riferimento completo, con vincoli didattici, architettura e schema dati, è **[GEMINI.md](GEMINI.md)**. La documentazione tecnica è indicizzata in [docs/INDEX.md](docs/INDEX.md).

## Promemoria dei vincoli

1. **Propedeuticità sequenziale.** Mai ordinare gli argomenti per priorità o difficoltà: seguire sempre `A-01 → A-32` e `G-01 → G-31`. `A-32` (prova generale) solo nell'ultima settimana; nessuno studio nel giorno d'esame.
2. **Buffer dinamico.** +20% sulle ore residue solo per argomenti con priorità ≥ 4 o difficoltà ≥ 4.
3. **Modello lavoratore e Time Shifter.** Sere feriali 2,5 h, weekend 4,5 h, override per singolo giorno con `−30m` / `+30m` (0–12 h). Soglia di sovraccarico configurabile, default 25 h/settimana.
4. **Build e test obbligatori.** Dopo ogni modifica in `src/`:
   ```powershell
   python scripts\build_bundle.py
   npm test
   python scripts\test_rolling_rebalance.py
   python scripts\test_tonight_and_mock_exams.py
   ```
5. **Sync GitLab.** Preservare la decodifica base64 UTF-8, il debounce, la fusione senza perdite (tombstone, `updatedAt`, `syncMeta`) e la scrittura con `last_commit_id` in `gitlabSyncService.js`. Ogni modifica alla fusione va coperta in `tests/gitlabSync.test.mjs`.
