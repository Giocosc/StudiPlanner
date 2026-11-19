"""Verifica end-to-end (Playwright) dei due flussi serali: Stasera e temi d'esame.

L'orologio del browser e' fissato a lunedi' 14/12/2026 alle 20:00 (ora di Roma),
dentro la finestra dei temi d'esame (dal 13/12). Spostando l'orologio in avanti si
simula il tempo passato al tavolo senza aspettare davvero.

Controlla:
  - Stasera: avvio del timer, persistenza dopo una ricarica, chiusura con ore,
    esiti degli esercizi e fiducia, sessione salvata e ore dell'argomento aggiornate;
  - Temi d'esame: avvio, consegna, voto, curva e riepilogo, persistenza,
    cancellazione con tombstone.
Esce con codice 1 se un controllo fallisce.
"""
import http.server
import json
import os
import socketserver
import sys
import threading
import time
from datetime import datetime, timedelta, timezone

from playwright.sync_api import sync_playwright

PORT = 3456
DIRECTORY = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROME = timezone(timedelta(hours=1))  # dicembre: ora solare
START = datetime(2026, 12, 14, 20, 0, 0, tzinfo=ROME)
TODAY = "2026-12-14"

KEY_SESSIONS = "unimore_rebalancer_sessions_v2"
KEY_TOPICS = "unimore_rebalancer_topics_v2"
KEY_MOCK = "unimore_rebalancer_mock_exams_v1"
KEY_MOCK_DELETED = "unimore_rebalancer_deleted_mock_exams_v1"
KEY_TONIGHT_TIMER = "studiplanner_tonight_timer_v1"

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, *args):
        pass


def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
        httpd.serve_forever()


failures = []


def check(label, condition):
    print(("OK   " if condition else "FAIL ") + label)
    if not condition:
        failures.append(label)


def read_json(page, key):
    raw = page.evaluate(f"() => localStorage.getItem({json.dumps(key)})")
    return json.loads(raw) if raw else None


def set_clock(page, moment):
    page.clock.set_fixed_time(moment)
    page.wait_for_timeout(1300)  # lascia scattare l'intervallo da 1 s dei timer


threading.Thread(target=start_server, daemon=True).start()
time.sleep(1)

print(f"Verifica Stasera e temi d'esame (orologio fissato a {START.isoformat()})...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(timezone_id="Europe/Rome", locale="it-IT", viewport={"width": 1280, "height": 900})
    page = context.new_page()
    page.on("dialog", lambda dialog: dialog.accept())
    errors = []
    page.on("pageerror", lambda exc: errors.append(str(exc)))

    page.clock.set_fixed_time(START)
    page.goto(f"http://127.0.0.1:{PORT}/index.html", wait_until="networkidle", timeout=30000)
    page.wait_for_selector("h1", timeout=15000)
    check("l'app parte alla data fissata (14/12)", page.locator("header span:has-text('Oggi: 14/12')").count() > 0)

    # ------------------------------------------------------------------ Stasera
    tonight = page.locator("section[aria-label='Cosa fare stasera']")
    check("card Stasera presente", tonight.count() == 1)
    title = tonight.locator("h3").inner_text().strip() if tonight.count() else ""
    topic_id = title.split(" ")[0] if title else ""
    check(f"Stasera propone un argomento del syllabus ({topic_id or 'nessuno'})",
          len(topic_id) == 4 and topic_id[0] in "AG" and topic_id[1] == "-")
    hours_before = next((t.get("oreEffettive", 0) for t in (read_json(page, KEY_TOPICS) or []) if t.get("id") == topic_id), 0)

    tonight.locator("button:has-text('Inizia')").click()
    running = page.locator("section[aria-label='Sessione di stasera in corso']")
    running.wait_for(timeout=5000)
    check("il timer di Stasera parte", running.count() == 1)

    set_clock(page, START + timedelta(minutes=50))
    check("il timer segna 50 minuti", "50:0" in running.inner_text())
    check("dopo 25 minuti suggerisce la pausa", "alzati 5 minuti" in running.inner_text() or "Blocco 2" in running.inner_text())

    page.reload(wait_until="networkidle")
    page.wait_for_selector("h1", timeout=15000)
    running = page.locator("section[aria-label='Sessione di stasera in corso']")
    check("il timer sopravvive alla ricarica della pagina", running.count() == 1 and "50:0" in running.inner_text())

    running.locator("button:has-text('Ho finito')").click()
    wrap = page.locator("section[aria-label='Chiudi la sessione di stasera']")
    wrap.wait_for(timeout=5000)
    check("si apre la chiusura della sessione", wrap.count() == 1)
    for _ in range(3):
        wrap.locator("button[aria-label='Giusti: più uno']").click()
    wrap.locator("button[aria-label='Sbagliati: più uno']").click()
    wrap.locator("button:text-is('4')").click()
    check("il riepilogo degli esercizi dice 3 su 4", "3 su 4 giusti" in wrap.inner_text())
    if wrap.locator("input[type='checkbox']").is_checked():
        wrap.locator("input[type='checkbox']").uncheck()
    wrap.locator("button:has-text('Registra sessione')").click()
    page.wait_for_timeout(500)

    sessions = read_json(page, KEY_SESSIONS) or []
    session = next((s for s in sessions if s.get("note") == "Sessione Stasera"), None)
    check("la sessione di Stasera è salvata", session is not None)
    if session:
        check("la sessione è sull'argomento proposto", session.get("topicId") == topic_id)
        check("la sessione ha la data di oggi", session.get("date") == TODAY)
        check("50 minuti diventano 0,75 h", abs(float(session.get("hours", 0)) - 0.75) < 1e-9)
        check("gli esiti degli esercizi sono salvati", session.get("exercises") == {"correct": 3, "partial": 0, "wrong": 1})
        check("la fiducia è salvata", session.get("confidence") == 4)
    hours_after = next((t.get("oreEffettive", 0) for t in (read_json(page, KEY_TOPICS) or []) if t.get("id") == topic_id), 0)
    check("le ore dell'argomento crescono di 0,75 h", abs(float(hours_after) - float(hours_before) - 0.75) < 1e-6)
    check("il timer di Stasera viene azzerato", read_json(page, KEY_TONIGHT_TIMER) is None)
    check("la card conferma la registrazione", "3 su 4 giusti" in page.locator("section[aria-label='Cosa fare stasera']").inner_text())

    # ------------------------------------------------------------ Temi d'esame
    mock = page.locator("section[aria-label=\"Temi d'esame a tempo\"]")
    check("pannello dei temi presente", mock.count() == 1)
    check("il tema di Analisi è proposto per questa settimana", "Questa settimana" in mock.inner_text())

    set_clock(page, START + timedelta(hours=1))
    mock.locator("button:has-text('120 min')").click()
    page.wait_for_timeout(300)
    check("il tema parte con il conto alla rovescia", "Tema in corso" in mock.inner_text())

    set_clock(page, START + timedelta(hours=1, minutes=100))
    check("il conto alla rovescia scende a 20 minuti", "20:0" in mock.inner_text())
    mock.locator("button:has-text('Consegna')").click()
    page.wait_for_timeout(300)
    check("dopo la consegna chiede il voto", "Com'è andata?" in mock.inner_text())
    save_button = mock.locator("button:has-text('Salva voto')")
    check("senza voto non si può salvare", save_button.is_disabled())
    mock.locator("#mock-score").fill("21")
    mock.locator("input[placeholder^='Cosa è andato storto']").fill("Serie da rivedere")
    save_button.click()
    page.wait_for_timeout(500)

    exams = read_json(page, KEY_MOCK) or []
    check("il tema è salvato", len(exams) == 1)
    exam = exams[0] if exams else {}
    check("il tema ha materia, data, durata e voto giusti",
          exam.get("subject") == "analisi" and exam.get("date") == TODAY
          and exam.get("durationMin") == 100 and exam.get("score") == 21 and exam.get("maxScore") == 30)
    check("il tema ha updatedAt per il sync", isinstance(exam.get("updatedAt"), (int, float)))
    check("il pannello mostra 1 tema svolto e il voto 21/30",
          "1 tema svolto" in mock.inner_text() and "21/30" in mock.inner_text())
    check("la curva dei voti è disegnata", mock.locator("svg[aria-label^='Curva dei voti']").count() == 1)

    page.reload(wait_until="networkidle")
    page.wait_for_selector("h1", timeout=15000)
    mock = page.locator("section[aria-label=\"Temi d'esame a tempo\"]")
    check("il tema resta dopo la ricarica", "1 tema svolto" in mock.inner_text())

    mock.locator("button:has-text('Vedi i temi svolti')").click()
    mock.locator("button[aria-label='Elimina tema']").click()
    page.wait_for_timeout(500)
    check("il tema viene cancellato", (read_json(page, KEY_MOCK) or []) == [])
    check("la cancellazione lascia il tombstone per il sync", exam.get("id") in (read_json(page, KEY_MOCK_DELETED) or []))

    check("nessun errore JavaScript nella pagina", not errors)
    if errors:
        print("\n".join("     " + e for e in errors[:5]))
    browser.close()

if failures:
    print(f"\n{len(failures)} controlli falliti.")
    sys.exit(1)
print("\nStasera e temi d'esame verificati.")
