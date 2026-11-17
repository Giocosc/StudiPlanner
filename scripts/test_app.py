import os
import sys
import threading
import http.server
import socketserver
import time
from playwright.sync_api import sync_playwright

PORT = 3344
DIRECTORY = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def start_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()

# Start background server
t = threading.Thread(target=start_server, daemon=True)
t.start()
time.sleep(1)

print(f"Testing app on http://localhost:{PORT}...")

errors = []
logs = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    page.on("console", lambda msg: logs.append(f"[{msg.type}] {msg.text}"))
    page.on("pageerror", lambda err: errors.append(str(err)))

    url = f"http://localhost:{PORT}/index.html"
    page.goto(url, wait_until="networkidle", timeout=30000)

    # Wait for React to mount by checking for Study Plan Rebalancer title
    page.wait_for_selector("h1", timeout=15000)

    title_text = page.locator("h1").inner_text()
    print("Page Title:", title_text)

    # Check progress bars
    analisi_badge = page.locator("text=ANALISI MATEMATICA 1").count()
    geometria_badge = page.locator("text=GEOMETRIA E ALGEBRA").count()
    print("Analisi Card Present:", analisi_badge > 0)
    print("Geometria Card Present:", geometria_badge > 0)

    # Check Weekly To-Do tab
    weekly_btn = page.locator("nav button:has-text('To-Do Settimanale')")
    weekly_btn.click()
    page.wait_for_timeout(500)

    settimana_title = page.locator("h3:has-text('Settimana')").inner_text()
    print("Weekly View Loaded:", settimana_title)

    # Check Catalan topics tab
    topics_btn = page.locator("nav button:has-text('Catalogo Argomenti')")
    topics_btn.click()
    page.wait_for_timeout(500)
    topics_count_text = page.locator("text=su 63 argomenti totali").count()
    print("Topics Table Loaded (63 items):", topics_count_text > 0)

    # Take screenshot for verification
    screenshot_path = os.path.join(DIRECTORY, "screenshot_test.png")
    page.screenshot(path=screenshot_path)
    print("Screenshot saved to:", screenshot_path)

    browser.close()

print("\n--- Console Errors ---")
if errors:
    for e in errors:
        print("ERROR:", e)
    sys.exit(1)
else:
    print("Zero errors detected! Pure perfection.")

print("\n--- Key Console Logs ---")
for l in logs[:10]:
    print(l)
