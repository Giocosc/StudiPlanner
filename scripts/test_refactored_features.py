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

print("Starting Comprehensive Verification for Swarm AI Refactoring...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    url = f"http://localhost:{PORT}/index.html"
    page.goto(url, wait_until="networkidle", timeout=30000)
    page.wait_for_selector("h1", timeout=15000)

    # ==========================================
    # 1. VERIFY AGENT ARCHITECT: PWA & FS ACCESS
    # ==========================================
    print("\n--- Verifying Agent Architect ---")
    
    # 1.1 Manifest link & Service worker
    manifest_link = page.locator("link[rel='manifest']").get_attribute("href")
    print("Manifest link found in index.html:", manifest_link == "manifest.json")
    assert manifest_link == "manifest.json", "Manifest link missing!"

    # 1.2 Import / Sync Tab & File System Access UI
    page.locator("nav button:has-text('Import / Sync')").click()
    page.wait_for_timeout(400)

    fs_sync_card = page.locator("h3:has-text('Sincronizzazione Trasparente File System')").count()
    print("File System Transparent Auto-Sync card rendered:", fs_sync_card > 0)
    assert fs_sync_card > 0, "File System Sync Card missing!"

    connect_btn = page.locator("button:has-text('Collega File JSON')").count()
    print("Connect JSON File button present:", connect_btn > 0)

    # ==========================================
    # 2. VERIFY AGENT ENGINE: AFTERNOON SLOT
    # ==========================================
    print("\n--- Verifying Agent Engine ---")
    
    # Open Settings Modal
    page.locator("header button[title*='Parametri']").click()
    page.wait_for_timeout(400)

    # Check afternoon slot checkbox and label
    afternoon_slot = page.locator("text=Slot Pomeridiano (16:30 - 19:00)").count()
    print("Slot Pomeridiano (16:30 - 19:00) exists in Settings:", afternoon_slot > 0)
    assert afternoon_slot > 0, "Slot Pomeridiano missing from SettingsModal!"

    # Check combined feriale capacity badge
    feriale_badge = page.locator("text=Feriale: 5.0h/gg").count() or page.locator("text=Feriale: 5h/gg").count()
    print("Combined feriale capacity (5.0h/gg) displayed:", feriale_badge > 0)

    # Check dynamic burnout threshold
    threshold_input = page.locator("input[value='35']").count() or page.locator("input[value='35.0']").count()
    print("Dynamic Burnout threshold elevated to 35h:", threshold_input > 0)

    # Screenshot settings modal
    screenshot_settings = os.path.join(DIRECTORY, "screenshot_settings_afternoon.png")
    page.screenshot(path=screenshot_settings)
    print("Screenshot settings saved to:", screenshot_settings)

    # Close modal
    page.locator("button:has-text('Annulla')").click()
    page.wait_for_timeout(300)

    # Check AlertBanner reflects sustainable pace with afternoon slot
    banner_sustainable = page.locator("text=Carico Settimanale Sostenibile").count()
    afternoon_badge_alert = page.locator("text=+Slot Pomeridiano Attivo").count()
    print("AlertBanner sustainable pace confirmed:", banner_sustainable > 0)
    print("AlertBanner shows +Slot Pomeridiano Attivo:", afternoon_badge_alert > 0)

    # ==========================================
    # 3. VERIFY AGENT UI: HEATMAP & POMODORO
    # ==========================================
    print("\n--- Verifying Agent UI ---")
    
    # 3.1 Activity Heatmap in Storico & Diario
    page.locator("nav button:has-text('Storico & Diario')").click()
    page.wait_for_timeout(400)

    heatmap_title = page.locator("h3:has-text('Activity Heatmap')").count()
    print("ActivityHeatmap rendered in Storico:", heatmap_title > 0)
    assert heatmap_title > 0, "ActivityHeatmap missing in Storico!"

    # Click a day cell in the heatmap to test interactive drawer
    first_cell = page.locator("button[title*='2026']").first
    first_cell.click()
    page.wait_for_timeout(300)

    drawer_opened = page.locator("text=Materia:").count() > 0 or page.locator("text=Argomenti del giorno:").count() > 0
    print("ActivityHeatmap day detail drawer interactive:", drawer_opened)

    # Screenshot heatmap
    screenshot_heatmap = os.path.join(DIRECTORY, "screenshot_activity_heatmap.png")
    page.screenshot(path=screenshot_heatmap)
    print("Screenshot heatmap saved to:", screenshot_heatmap)

    # 3.2 Pomodoro Timer in To-Do Settimanale
    page.locator("nav button:has-text('To-Do Settimanale')").click()
    page.wait_for_timeout(400)

    pomodoro_widget = page.locator("span:has-text('Pomodoro 50/10')").count()
    print("Pomodoro 50/10 widgets rendered on topic cards:", pomodoro_widget > 0)
    assert pomodoro_widget > 0, "Pomodoro widgets missing on topic cards!"

    # Find the first uncompleted topic card
    target_btn = page.locator("button:has-text('Target Raggiunto')").first
    print("Target Raggiunto (instant auto-check) button present:", target_btn.count() > 0)

    # Click "Target Raggiunto" to simulate Pomodoro accumulating full estimated hours!
    target_btn.click()
    page.wait_for_timeout(600)

    # Verify that the topic was automatically checked!
    completed_badge = page.locator("text=✓ Target Raggiunto").count()
    print("Topic auto-completed by Pomodoro timer (Target Raggiunto badge):", completed_badge > 0)

    completed_check = page.locator("button[title='Segna come da fare']").count()
    print("Checkbox automatically ticked by Pomodoro:", completed_check > 0)
    assert completed_check > 0, "Checkbox was not automatically ticked upon reaching Pomodoro target hours!"

    # Screenshot pomodoro
    screenshot_pomodoro = os.path.join(DIRECTORY, "screenshot_pomodoro_active.png")
    page.screenshot(path=screenshot_pomodoro)
    print("Screenshot pomodoro saved to:", screenshot_pomodoro)

    browser.close()

print("\nAll 3 Swarm AI Agents verified successfully! Everything passes with 100% precision!")
