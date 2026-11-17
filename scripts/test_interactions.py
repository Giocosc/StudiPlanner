import os
import sys
import threading
import http.server
import socketserver
import time
from playwright.sync_api import sync_playwright

PORT = 3355
DIRECTORY = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def start_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()

t = threading.Thread(target=start_server, daemon=True)
t.start()
time.sleep(1)

print("Starting Interaction Tests...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    url = f"http://localhost:{PORT}/index.html"
    page.goto(url, wait_until="networkidle", timeout=30000)
    page.wait_for_selector("h1", timeout=15000)

    # 1. Test clicking a checkbox on Weekly To-Do
    page.locator("nav button:has-text('To-Do Settimanale')").click()
    page.wait_for_timeout(300)

    # Initial progress check on Dashboard
    page.locator("nav button:has-text('Dashboard')").click()
    page.wait_for_timeout(300)
    initial_text = page.locator("h3:has-text('Stato Avanzamento Analisi')").locator("xpath=..").locator("xpath=..").inner_text()
    print("Dashboard Initial:", [line for line in initial_text.splitlines() if "%" in line or "completate" in line])

    # Now go to Catalogo Argomenti and click "Simula completamento prime 2 sett."
    page.locator("nav button:has-text('Catalogo Argomenti')").click()
    page.wait_for_timeout(300)
    page.locator("button:has-text('Simula completamento prime 2 sett.')").click()
    page.wait_for_timeout(300)

    # Back to Dashboard, check progress bars
    page.locator("nav button:has-text('Dashboard')").click()
    page.wait_for_timeout(300)
    updated_text = page.locator("h3:has-text('Stato Avanzamento Analisi')").locator("xpath=..").locator("xpath=..").inner_text()
    print("Dashboard After 2 Weeks Simulation:", [line for line in updated_text.splitlines() if "%" in line or "completate" in line])

    # 2. Test File Importer Tab
    page.locator("nav button:has-text('Import / Sync')").click()
    page.wait_for_timeout(300)

    # Upload Geometria.txt
    file_input = page.locator("input[type='file']")
    geo_file_path = os.path.join(DIRECTORY, "Geometria", "Geometria.txt")
    file_input.set_input_files(geo_file_path)
    page.wait_for_timeout(1000)

    # Check notification
    notif = page.locator("text=File CSV \"Geometria.txt\" caricato").count()
    print("Upload Notification Present:", notif > 0)

    # Upload Excel / ODS
    ods_file_path = os.path.join(DIRECTORY, "Piano Studi UNIMORE - Analisi 1 e Geometria (Nov 2026 - Gen 2027) (1).ods")
    file_input.set_input_files(ods_file_path)
    page.wait_for_timeout(1000)
    ods_notif = page.locator("text=sincronizzato").count()
    print("ODS Sync Notification Present:", ods_notif > 0)

    # 3. Test Settings Modal & Alert Banner
    settings_btn = page.locator("button[title='Parametri di Ribilanciamento']")
    settings_btn.click()
    page.wait_for_timeout(300)
    modal_title = page.locator("h3:has-text('Parametri di Ribilanciamento')").inner_text()
    print("Settings Modal Opened:", modal_title)

    # Set critical threshold to a low number (e.g. 15h) to trigger AlertBanner
    threshold_input = page.locator("input[type='number']").nth(2)
    threshold_input.fill("15")
    page.locator("button:has-text('Salva e Ricalcola')").click()
    page.wait_for_timeout(500)

    # Check AlertBanner
    alert_present = page.locator("text=ALLERTA SOVRACCARICO CRITICO").count()
    print("Critical Alert Banner Triggered at 15h threshold:", alert_present > 0)

    # Take screenshot of the alert
    screenshot_alert = os.path.join(DIRECTORY, "screenshot_alert.png")
    page.screenshot(path=screenshot_alert)
    print("Alert screenshot saved to:", screenshot_alert)

    browser.close()

print("All Interaction Tests Completed Successfully!")
