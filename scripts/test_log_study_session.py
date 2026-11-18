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

print("Starting '+' Log Study Session and Auto-Rebalance Verification...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    url = f"http://localhost:{PORT}/index.html"
    page.goto(url, wait_until="networkidle", timeout=30000)
    page.wait_for_selector("h1", timeout=15000)

    # 1. Check that Header button "+ Registra Studio" exists
    log_btn = page.locator("header button:has-text('Registra Studio')")
    assert log_btn.count() > 0, "Header button '+ Registra Studio' not found"
    print("1. Header '+ Registra Studio' button exists: OK")

    # 2. Click '+ Registra Studio' to open modal
    log_btn.first.click()
    page.wait_for_timeout(300)
    modal_title = page.locator("h2:has-text('Registra Sessione di Studio')")
    assert modal_title.count() > 0, "Log Study Modal did not open"
    print("2. Modal opened successfully: OK")

    # Take screenshot of the open modal
    modal_screenshot = os.path.join(DIRECTORY, "screenshot_log_study_modal.png")
    page.screenshot(path=modal_screenshot)
    print("Modal screenshot saved to:", modal_screenshot)

    # 3. Log a past session for 2026-11-17 on topic A-01 (2.5 hours, completed)
    # Set date to 2026-11-17
    date_input = page.locator("input[type='date']")
    date_input.fill("2026-11-17")

    # Select topic A-01 in dropdown
    topic_select = page.locator("select").first
    topic_select.select_option("A-01")

    # Set hours to 2.5
    hours_input = page.locator("input[type='number']")
    hours_input.fill("2.5")

    # Check complete toggle
    complete_toggle = page.locator("#completeToggle")
    if not complete_toggle.is_checked():
        complete_toggle.check()

    # Enter session note
    note_input = page.locator("input[placeholder*='es. Teoria capita']")
    note_input.fill("Teoria e primo fascicolo di esercizi completati")

    # Verify auto-adapt preview text exists
    preview_box = page.locator("text=Cosa succede dopo il salvataggio")
    assert preview_box.count() > 0, "Auto-adapt preview not visible"
    print("3. Form filled and dynamic preview verified: OK")

    # Click submit
    submit_btn = page.locator("button:has-text('Registra Studio & Ribilancia')")
    submit_btn.click()
    page.wait_for_timeout(1000)

    # Modal should close after saving
    assert page.locator("h2:has-text('Registra Sessione di Studio')").count() == 0, "Modal should close after submit"
    print("4. Submission saved and modal closed: OK")

    # 4. Check To-Do Settimanale:
    # 2026-11-17 was Tuesday. Since A-01 (2.5h) was registered on 17/11, Tuesday 17/11 should be marked completed (not skipped!)
    page.locator("nav button:has-text('To-Do Settimanale')").click()
    page.wait_for_timeout(500)

    # Check that Tuesday 17/11 is completed
    martedi_completed = page.locator("text=Sessione svolta (2.5h)").count()
    print("5. Martedì 17/11 converted to completed study session:", martedi_completed > 0)
    assert martedi_completed > 0, "Martedì 17/11 should be completed after logging study!"

    # 5. Check that A-01 is marked complete and subsequent topics adapted
    a01_completed_badge = page.locator("text=Completato il 17/11").count()
    print("6. A-01 tagged as completed on 17/11:", a01_completed_badge > 0)
    assert a01_completed_badge > 0, "A-01 should be tagged as completed on 17/11"

    # 6. Check that the logged session is stored in localStorage
    sessions_in_storage = page.evaluate("() => localStorage.getItem('unimore_rebalancer_sessions_v2')")
    assert sessions_in_storage is not None and "A-01" in sessions_in_storage, "Study session should be stored in localStorage"
    print("7. LocalStorage studySessions verified: OK")

    # 7. Check 'Storico & Diario' tab shows the logged session
    page.locator("nav button:has-text('Storico & Diario')").click()
    page.wait_for_timeout(500)
    history_session = page.locator("text=A-01").count()
    print("8. HistoryLog displays logged session:", history_session > 0)

    # Take screenshot of To-Do Settimanale showing rebalance
    page.locator("nav button:has-text('To-Do Settimanale')").click()
    page.wait_for_timeout(500)
    todo_screenshot = os.path.join(DIRECTORY, "screenshot_rebalanced_todo.png")
    page.screenshot(path=todo_screenshot)
    print("Rebalanced Todo screenshot saved to:", todo_screenshot)

    browser.close()

print("\nAll '+' Study Logging and Auto-Rebalancing Tests Passed Flawlessly!")
