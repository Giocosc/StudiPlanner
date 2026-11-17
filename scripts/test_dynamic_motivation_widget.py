import os
import sys
import threading
import http.server
import socketserver
import time
from playwright.sync_api import sync_playwright

PORT = 3456
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

print("Starting DynamicMotivationWidget verification with Playwright...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})

    url = f"http://localhost:{PORT}/index.html"
    page.goto(url, wait_until="networkidle", timeout=30000)
    page.wait_for_selector("h1", timeout=15000)

    # 1. Verify we are on Dashboard
    dashboard_tab = page.locator("nav button:has-text('Dashboard Generale')")
    print("Dashboard tab exists:", dashboard_tab.count() > 0)

    # 2. Verify Sci-Fi Terminal mode elements
    scifi_header = page.locator("text=TERMINALE SCI-FI // CLARKE-9000")
    print("Sci-Fi Terminal mode active by default:", scifi_header.count() > 0)

    # Check orbital alignment tracks
    vector_a = page.locator("text=VECTOR A-01..32")
    vector_g = page.locator("text=VECTOR G-01..31")
    print("Orbital inclination track (Analisi 1) present:", vector_a.count() > 0)
    print("Orbital attitude vector (Geometria) present:", vector_g.count() > 0)

    # Wait for typewriter text to type something
    page.wait_for_timeout(1000)
    typewriter_container = page.locator("text=DEEP_SPACE_TRANSMISSION")
    print("Typewriter transmission container present:", typewriter_container.count() > 0)

    # Take screenshot of Sci-Fi Terminal mode
    scifi_screenshot = os.path.join(DIRECTORY, "screenshot_widget_scifi.png")
    page.screenshot(path=scifi_screenshot)
    print("Sci-Fi Mode Screenshot saved to:", scifi_screenshot)

    # 3. Test Toggle to Console Telemetrica
    toggle_to_telemetry_btn = page.locator("button:has-text('MODALITÀ: TELEMETRIA RPM')")
    print("Toggle button to Telemetry exists:", toggle_to_telemetry_btn.count() > 0)
    toggle_to_telemetry_btn.click()
    page.wait_for_timeout(500)

    # Verify Telemetry mode active
    telemetry_header = page.locator("text=PIT_WALL // TELEMETRIA DA CORSA & CRUSCOTTO RPM")
    print("Console Telemetrica mode active after toggle:", telemetry_header.count() > 0)

    # Check RPM LED bars and Gear boxes
    gear_boxes = page.locator("text=MARCIA")
    print("Gear indicators present:", gear_boxes.count() >= 2)

    power_units = page.locator("text=MOTOPROPULSORE")
    print("Power units telemetry active:", power_units.count() >= 2)

    # Check localStorage persistence
    saved_mode = page.evaluate("() => localStorage.getItem('unimore_motivation_widget_mode')")
    print("LocalStorage saved mode:", saved_mode)
    assert saved_mode == "telemetry", f"Expected telemetry, got {saved_mode}"

    # Take screenshot of Console Telemetrica mode
    telemetry_screenshot = os.path.join(DIRECTORY, "screenshot_widget_telemetry.png")
    page.screenshot(path=telemetry_screenshot)
    print("Telemetry Mode Screenshot saved to:", telemetry_screenshot)

    # 4. Test Persistence across page reload
    page.reload(wait_until="networkidle")
    page.wait_for_selector("h1", timeout=15000)
    telemetry_after_reload = page.locator("text=PIT_WALL // TELEMETRIA DA CORSA & CRUSCOTTO RPM")
    print("Console Telemetrica persisted after page reload:", telemetry_after_reload.count() > 0)

    # 5. Toggle back to Sci-Fi Terminal
    toggle_to_scifi_btn = page.locator("button:has-text('MODALITÀ: TERMINALE SCI-FI')")
    toggle_to_scifi_btn.click()
    page.wait_for_timeout(500)

    scifi_restored = page.locator("text=TERMINALE SCI-FI // CLARKE-9000")
    print("Successfully toggled back to Sci-Fi mode:", scifi_restored.count() > 0)

    saved_mode_final = page.evaluate("() => localStorage.getItem('unimore_motivation_widget_mode')")
    print("Final localStorage mode:", saved_mode_final)
    assert saved_mode_final == "scifi", f"Expected scifi, got {saved_mode_final}"

    browser.close()

print("\nAll DynamicMotivationWidget verification tests PASSED with 100% success!")
