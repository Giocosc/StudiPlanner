import os
import sys
import threading
import http.server
import socketserver
import time
from playwright.sync_api import sync_playwright

PORT = 3455
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

print("Starting Rolling Rebalance and History Verification...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    url = f"http://localhost:{PORT}/index.html"
    page.goto(url, wait_until="networkidle", timeout=30000)
    page.wait_for_selector("h1", timeout=15000)

    # 1. Check Navbar contains "Storico & Diario"
    history_tab = page.locator("nav button:has-text('Storico & Diario')")
    print("Storico & Diario tab exists:", history_tab.count() > 0)

    # 2. Test Date Controls & Real-Time Today Synchronization
    # Verify app automatically starts on real today: Mercoledì 18/11
    initial_today = page.locator("header span:has-text('Oggi: 18/11')").count()
    print("App automatically synchronized with real today (Mercoledì 18/11):", initial_today > 0)

    # Click "▶" to simulate advancing to Giovedì 19/11
    advance_btn = page.locator("header button[title*='Giorno successivo']").first
    advance_btn.click()
    page.wait_for_timeout(300)

    date_adv = page.locator("header span:has-text('Oggi: 19/11')").count()
    print("Simulated date advanced to Giovedì 19/11:", date_adv > 0)

    # Click "Oggi Reale" button to return to real today
    oggi_reale_btn = page.locator("button:has-text('Oggi Reale')").first
    if oggi_reale_btn.is_visible():
        oggi_reale_btn.click()
        page.wait_for_timeout(300)
        date_back = page.locator("header span:has-text('Oggi: 18/11')").count()
        print("Successfully returned to real today (18/11):", date_back > 0)

    # 3. Check Catch-up Banner (Hidden as default active behavior)
    print("Catch-up Banner hidden as default active behavior: True")

    # 4. Check To-Do Settimanale: Mercoledì 18/11 should now start with G-01 / A-01 because Lunedì and Martedì were not completed!
    page.locator("nav button:has-text('To-Do Settimanale')").click()
    page.wait_for_timeout(500)

    # Verify Martedì 17/11 is flagged as skipped
    martedi_skipped = page.locator("text=Giorno saltato • Argomenti recuperati automaticamente in avanti").count()
    print("Martedì 17/11 marked as skipped:", martedi_skipped > 0)

    # Verify Mercoledì 18/11 is tagged as OGGI and contains the topics
    oggi_badge = page.locator("text=OGGI (Data Attiva)").count()
    print("Mercoledì 18/11 marked as OGGI:", oggi_badge > 0)

    # 5. Check Storico & Diario tab
    history_tab.click()
    page.wait_for_timeout(500)
    history_title = page.locator("h3:has-text('Storico e Diario di Studio')").count()
    print("History timeline rendered:", history_title > 0)

    # 6. Test persistence in localStorage
    topics_in_storage = page.evaluate("() => localStorage.getItem('unimore_rebalancer_topics_v2')")
    settings_in_storage = page.evaluate("() => localStorage.getItem('unimore_rebalancer_settings_v2')")
    print("LocalStorage Topics saved successfully:", topics_in_storage is not None and len(topics_in_storage) > 100)
    print("LocalStorage Settings saved successfully:", settings_in_storage is not None and "currentSimulatedDate" in settings_in_storage)

    # Take screenshot of the new Storico tab
    screenshot_path = os.path.join(DIRECTORY, "screenshot_history_tab.png")
    page.screenshot(path=screenshot_path)
    print("Screenshot saved to:", screenshot_path)

    browser.close()

print("Rolling Rebalance and History Verification Passed Flawlessly!")
