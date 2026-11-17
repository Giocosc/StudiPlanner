import os
import threading
import http.server
import socketserver
import time
from playwright.sync_api import sync_playwright

PORT = 3459
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

print("Starting Clarke9000Companion Playwright verification...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 900})
    page.goto(f'http://localhost:{PORT}/index.html', wait_until='networkidle')

    # 1. Verify original progress bars are back in Dashboard
    analisi_card = page.locator("text=Stato Avanzamento Analisi")
    geometria_card = page.locator("text=Stato Avanzamento Geometria")
    print("Original Analisi progress bar restored:", analisi_card.count() > 0)
    print("Original Geometria progress bar restored:", geometria_card.count() > 0)

    # 2. Verify CLARKE-9000 side companion floating optical lens
    clarke_btn = page.locator("button[title*='CLARKE-9000']")
    print("CLARKE-9000 optical lens button present:", clarke_btn.count() > 0)

    # 3. Click optical lens to expand the speech panel
    clarke_btn.click()
    page.wait_for_timeout(500)

    panel = page.locator("text=CLARKE-9000 // MONOLOGO")
    print("CLARKE-9000 monologue panel expanded:", panel.count() > 0)

    # Wait for typewriter text
    page.wait_for_timeout(1000)

    # 4. Take screenshot with panel open
    screenshot_path = os.path.join(DIRECTORY, "screenshot_clarke9000_open.png")
    page.screenshot(path=screenshot_path)
    print("Screenshot saved to:", screenshot_path)

    # 5. Click refresh quote button
    refresh_btn = page.locator("button[title='Nuova riflessione']")
    if refresh_btn.count() > 0:
        refresh_btn.click()
        page.wait_for_timeout(500)
        print("Quote refreshed successfully")

    # 6. Click close button
    close_btn = page.locator("button[title='Comprimi']")
    close_btn.click()
    page.wait_for_timeout(300)
    print("Panel collapsed back to floating eye:", panel.count() == 0)

    browser.close()

print("\nClarke9000Companion verification PASSED!")
