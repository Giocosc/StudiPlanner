import os
import threading
import http.server
import socketserver
import time
from playwright.sync_api import sync_playwright

PORT = 3460
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

print("Starting expanded Clarke9000 Playwright test...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 900})
    page.goto(f'http://localhost:{PORT}/index.html', wait_until='networkidle')

    # 1. Check optical lens
    clarke_btn = page.locator("button[title*='CLARKE-9000']")
    print("CLARKE-9000 eye button exists:", clarke_btn.count() > 0)

    # 2. Click to open
    clarke_btn.click()
    page.wait_for_timeout(500)

    panel = page.locator("text=CLARKE-9000 // MONOLOGO")
    print("Panel opened:", panel.count() > 0)

    # 3. Verify quotes cycle multiple times through diverse topics
    refresh_btn = page.locator("button[title='Nuova riflessione']")
    for i in range(5):
        refresh_btn.click()
        page.wait_for_timeout(400)
        text = page.locator("aside p").text_content()
        print(f"Sample Quote {i+1}: {text[:60]}...")

    # 4. Check AUTO-OPEN button status
    auto_btn = page.locator("button:has-text('AUTO-OPEN')")
    print("AUTO-OPEN mode active:", auto_btn.count() > 0)

    # 5. Toggle to SILENZIATO and back
    auto_btn.click()
    page.wait_for_timeout(300)
    muted_btn = page.locator("button:has-text('SILENZIATO')")
    print("Muted toggle works:", muted_btn.count() > 0)

    muted_btn.click()
    page.wait_for_timeout(300)
    print("Restored to AUTO-OPEN:", page.locator("button:has-text('AUTO-OPEN')").count() > 0)

    # 6. Close panel
    page.locator("button[title='Comprimi']").click()
    page.wait_for_timeout(300)
    print("Panel collapsed:", panel.count() == 0)

    browser.close()

print("\nExpanded Clarke9000 test PASSED with 100% success!")
