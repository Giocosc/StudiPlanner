import os
import sys
import threading
import http.server
import socketserver
import time
from playwright.sync_api import sync_playwright

PORT = 3411
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

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    url = f"http://localhost:{PORT}/index.html"
    page.goto(url, wait_until="networkidle", timeout=30000)
    page.wait_for_selector("h1", timeout=15000)

    # Click Weekly To-Do tab
    page.locator("nav button:has-text('To-Do Settimanale')").click()
    page.wait_for_timeout(500)

    # Screenshot Week 1
    page.screenshot(path=os.path.join(DIRECTORY, "screenshot_week1_fixed.png"))
    print("Saved screenshot_week1_fixed.png")

    # Navigate to final week
    next_btn = page.locator("button[title='Settimana successiva']")
    while next_btn.is_enabled():
        next_btn.click()
        page.wait_for_timeout(100)

    last_week_title = page.locator("h3:has-text('Settimana')").inner_text()
    print(f"\n🏁 Last Week: {last_week_title}")
    
    # Screenshot Final Week
    page.screenshot(path=os.path.join(DIRECTORY, "screenshot_final_week.png"))
    print("Saved screenshot_final_week.png")

    final_topics = page.locator("div.space-y-2\\.5 > div").all()
    for t in final_topics:
        topic_id = t.locator("span.font-mono.font-bold").first.inner_text()
        title = t.locator("p.font-medium").first.inner_text()
        materia = t.locator("span.rounded-md").first.inner_text()
        print(f"   [{topic_id}] ({materia}) {title}")

    browser.close()
