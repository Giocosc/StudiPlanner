"""Verifica end-to-end (Playwright) di data reale, simulazione giorni, To-Do e Storico.

Le date attese vengono calcolate a runtime: "oggi" e' la data reale limitata
all'intervallo della sessione (inizio roadmap -> esame), come fa l'app.
Esce con codice 1 se un controllo fallisce.
"""
import os
import sys
import threading
import http.server
import socketserver
import time
from datetime import date, timedelta
from playwright.sync_api import sync_playwright

PORT = 3455
DIRECTORY = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROADMAP_START = date(2026, 11, 16)   # DEFAULT_ROADMAP_START_DATE
TARGET_EXAM = date(2027, 1, 10)      # DEFAULT_TARGET_EXAM_DATE

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


def ddmm(d):
    return d.strftime("%d/%m")


today = min(max(date.today(), ROADMAP_START), TARGET_EXAM)
tomorrow = today + timedelta(days=1)
failures = []


def check(label, condition):
    print(("OK   " if condition else "FAIL ") + label)
    if not condition:
        failures.append(label)


threading.Thread(target=start_server, daemon=True).start()
time.sleep(1)

print(f"Starting Rolling Rebalance and History Verification (oggi atteso: {ddmm(today)})...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(f"http://127.0.0.1:{PORT}/index.html", wait_until="networkidle", timeout=30000)
    page.wait_for_selector("h1", timeout=15000)

    # 1. Navigazione
    history_tab = page.locator("nav button:has-text('Storico & Diario')")
    check("tab Storico & Diario presente", history_tab.count() > 0)

    # 2. Data reale e simulazione
    check(f"l'app parte dalla data reale ({ddmm(today)})",
          page.locator(f"header span:has-text('Oggi: {ddmm(today)}')").count() > 0)

    if today < TARGET_EXAM:
        page.locator("header button[title*='Giorno successivo']").first.click()
        page.wait_for_timeout(300)
        check(f"avanzamento simulato a {ddmm(tomorrow)}",
              page.locator(f"header span:has-text('Oggi: {ddmm(tomorrow)}')").count() > 0)

        oggi_reale_btn = page.locator("button:has-text('Oggi Reale')").first
        check("pulsante 'Oggi Reale' visibile durante la simulazione", oggi_reale_btn.is_visible())
        if oggi_reale_btn.is_visible():
            oggi_reale_btn.click()
            page.wait_for_timeout(300)
            check(f"ritorno alla data reale ({ddmm(today)})",
                  page.locator(f"header span:has-text('Oggi: {ddmm(today)}')").count() > 0)

    # 3. To-Do settimanale: giorno attivo e giorni saltati (nessun progresso registrato)
    page.locator("nav button:has-text('To-Do Settimanale')").click()
    page.wait_for_timeout(500)
    check("giorno attivo marcato OGGI", page.locator("text=OGGI (Data Attiva)").count() > 0)
    week_start = today - timedelta(days=today.weekday())
    if max(week_start, ROADMAP_START) < today:
        check("giorni passati della settimana segnalati come saltati",
              page.locator("text=Giorno saltato • Argomenti recuperati automaticamente in avanti").count() > 0)

    # 4. Storico
    history_tab.click()
    page.wait_for_timeout(500)
    check("timeline dello storico visualizzata",
          page.locator("h3:has-text('Storico e Diario di Studio')").count() > 0)

    # 5. Persistenza in localStorage
    topics_in_storage = page.evaluate("() => localStorage.getItem('unimore_rebalancer_topics_v2')")
    settings_in_storage = page.evaluate("() => localStorage.getItem('unimore_rebalancer_settings_v2')")
    check("argomenti salvati in localStorage", topics_in_storage is not None and len(topics_in_storage) > 100)
    check("impostazioni salvate in localStorage",
          settings_in_storage is not None and "currentSimulatedDate" in settings_in_storage)

    screenshot_path = os.path.join(DIRECTORY, "screenshot_history_tab.png")
    page.screenshot(path=screenshot_path)
    print("Screenshot saved to:", screenshot_path)
    browser.close()

if failures:
    print(f"Rolling Rebalance Verification FAILED: {len(failures)} controlli non superati")
    sys.exit(1)
print("Rolling Rebalance and History Verification Passed Flawlessly!")
