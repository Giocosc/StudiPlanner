# 🤖 Antigravity / Agent Guidelines & Workspace Standards
## StudiPlanner (UNIMORE — Ingegneria Informatica)

Per tutte le linee guida architetturali, i vincoli algoritmici immutabili, le istruzioni di build e le regole di propedeuticità matematica, fare riferimento al file principale:

👉 **[GEMINI.md](file:///c:/tmp/StudiPlanner/GEMINI.md)**

### Promemoria Rapido dei Vincoli:
1. **Propedeuticità Sequenziale:** Mai ordinare gli argomenti matematici per priorità/difficoltà. Seguire rigorosamente `A-01 -> A-32` e `G-01 -> G-31`.
2. **Buffer Dinamico:** +20% sulle ore stimate solo per argomenti con Priorità $\ge 4$ o Difficoltà $\ge 4$.
3. **Modello Lavoratore Full-Time:** Studio nelle fasce serali feriali (2.5h) e weekend (4.5h/giorno). Soglia critica 25h/settimana.
4. **Build Obbligatorio:** Dopo aver modificato qualsiasi file in `src/`, eseguire sempre:
   ```powershell
   python scripts\build_bundle.py
   ```
