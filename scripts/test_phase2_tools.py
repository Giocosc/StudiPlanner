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

print("Starting Phase 2 Tools (NeuraDeck & ExamSimulator) Verification...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    url = f"http://localhost:{PORT}/index.html"
    page.goto(url, wait_until="networkidle", timeout=30000)
    page.wait_for_selector("h1", timeout=15000)

    # 1. Mark some topics as completed in TopicsTable to have rich data
    page.locator("nav button:has-text('Catalogo Argomenti')").click()
    page.wait_for_timeout(400)

    # Click 'Simula completamento prime 2 sett.' to complete topics with completedDate
    simulate_btn = page.locator("button:has-text('Simula completamento prime 2 sett.')")
    if simulate_btn.count() > 0:
        simulate_btn.click()
        page.wait_for_timeout(300)
        print("✓ Completed topics populated via 'Simula completamento prime 2 sett.'")

    # Also complete some Geometria topics
    geo_buttons = page.locator("table tbody tr button[title='Segna come completato']")
    for i in range(min(geo_buttons.count(), 10)):
        geo_buttons.nth(i).click()
        page.wait_for_timeout(50)

    # Return to Dashboard
    page.locator("nav button:has-text('Dashboard')").click()
    page.wait_for_timeout(300)

    # 2. Test NeuraDeck Flashcards Generator
    print("Testing NeuraDeck Prompt Generator...")
    flashcard_card_btn = page.locator("button:has-text('Genera Flashcard')").first
    assert flashcard_card_btn.count() > 0, "Button 'Genera Flashcard' not found on Dashboard"
    flashcard_card_btn.click()
    page.wait_for_timeout(500)

    modal_title = page.locator("h3:has-text('Generatore Flashcard NeuraDeck')")
    assert modal_title.count() > 0, "NeuraDeck Modal did not open"
    print("✓ NeuraDeck modal opened successfully")

    # Check subject filters
    btn_analisi = page.locator("button:has-text('Analisi 1')").first
    btn_analisi.click()
    page.wait_for_timeout(200)

    # Switch date range to 'Tutti i Completati' using first match
    page.locator("button:has-text('Tutti i Completati')").first.click()
    page.wait_for_timeout(200)

    # Check textarea content
    prompt_textarea = page.locator("textarea")
    textarea_val = prompt_textarea.input_value()
    assert "Agisci da professore universitario di Ingegneria" in textarea_val, "Prompt missing professor intro"
    assert "Fronte,Retro" in textarea_val, "Prompt missing Fronte,Retro CSV specification"
    assert "NeuraDeck" in textarea_val, "Prompt missing NeuraDeck reference"
    print("✓ NeuraDeck prompt text validated perfectly")

    # Close NeuraDeck modal
    page.locator("button[title='Chiudi']").click()
    page.wait_for_timeout(300)

    # 3. Test Exam Simulator
    print("Testing Exam Simulator...")
    exam_card_btn = page.locator("button:has-text('Avvia Simulazione')").first
    assert exam_card_btn.count() > 0, "Button 'Avvia Simulazione' not found on Dashboard"
    exam_card_btn.click()
    page.wait_for_timeout(500)

    exam_modal_title = page.locator('h3:has-text("Simulatore d\'Esame Dinamico")')
    assert exam_modal_title.count() > 0, "Exam Simulator Modal did not open"
    print("✓ Exam Simulator modal opened successfully")

    # Verify fallback checkbox if visible, or check count
    fallback_checkbox = page.locator("input[type='checkbox']:has-text('Completa a 6'), label:has-text('intero programma') input")
    if fallback_checkbox.count() > 0 and not fallback_checkbox.is_checked():
        fallback_checkbox.check()
        page.wait_for_timeout(300)

    exam_prompt_textarea = page.locator("textarea")
    exam_textarea_val = exam_prompt_textarea.input_value()
    assert "Genera una simulazione d'esame scritta di livello universitario (UNIMORE)" in exam_textarea_val, "Exam prompt missing header"
    assert "Markdown pronto per la stampa, includendo lo spazio per lo svolgimento" in exam_textarea_val, "Exam prompt missing markdown print instruction"
    print("✓ Analisi 1 Exam prompt text validated")

    # Switch to Geometria inside modal
    geo_btn = page.locator(".fixed button:has-text('Geometria')").first
    geo_btn.click()
    page.wait_for_timeout(500)

    geo_textarea_val = page.locator("textarea").input_value()
    assert "Genera una simulazione d'esame scritta" in geo_textarea_val, "Geometria exam prompt missing"
    print("✓ Geometria Exam prompt generated successfully")

    # Re-shuffle
    reshuffle_btn = page.locator("button:has-text('Estrai Nuova Simulazione')")
    reshuffle_btn.click()
    page.wait_for_timeout(300)
    print("✓ Re-shuffle function executed")

    # Close modal
    page.locator("button[title='Chiudi']").click()
    page.wait_for_timeout(300)

    # Take screenshot of Dashboard with AI tools
    screenshot_path = os.path.join(DIRECTORY, "screenshot_phase2_dashboard.png")
    page.screenshot(path=screenshot_path, full_page=True)
    print(f"Screenshot saved to: {screenshot_path}")

    browser.close()

print("Phase 2 Tools Verification Passed Flawlessly!")
