import os
import threading
import http.server
import socketserver
import time
from playwright.sync_api import sync_playwright

PORT = 3457
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

print("Testing Widescreen Layout at 1920x1080 and 2560x1440...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    # Set viewport to Full HD 1920x1080
    page = browser.new_page(viewport={"width": 1920, "height": 1080})

    url = f"http://localhost:{PORT}/index.html"
    page.goto(url, wait_until="networkidle", timeout=30000)
    page.wait_for_selector("h1", timeout=15000)

    # 1. Screenshot Dashboard 1920
    page.screenshot(path=os.path.join(DIRECTORY, "screenshot_dashboard_widescreen.png"))
    print("Dashboard 1920x1080 screenshot saved.")

    # 2. Screenshot Weekly Todo 1920
    page.locator("nav button:has-text('To-Do Settimanale')").click()
    page.wait_for_timeout(500)
    page.screenshot(path=os.path.join(DIRECTORY, "screenshot_weekly_widescreen.png"))
    print("Weekly Todo 1920x1080 screenshot saved.")

    # 3. Screenshot History Log 1920
    page.locator("nav button:has-text('Storico & Diario')").click()
    page.wait_for_timeout(500)
    page.screenshot(path=os.path.join(DIRECTORY, "screenshot_history_widescreen.png"))
    print("History Log 1920x1080 screenshot saved.")

    # 4. Screenshot Catalogo Argomenti 1920
    page.locator("nav button:has-text('Catalogo Argomenti')").click()
    page.wait_for_timeout(500)
    page.screenshot(path=os.path.join(DIRECTORY, "screenshot_topics_widescreen.png"))
    print("Catalogo Argomenti 1920x1080 screenshot saved.")

    browser.close()

print("Widescreen Verification Completed Successfully!")
