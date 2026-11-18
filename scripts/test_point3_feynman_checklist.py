from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://127.0.0.1:3000/index.html')
    page.wait_for_timeout(2000)

    # Go to "Catalogo Argomenti" tab
    page.locator("button:has-text('Argomenti')").first.click()
    page.wait_for_timeout(1000)

    # Click on A-01 row to open TopicDetailModal
    topic_row = page.locator("text=A-01").first
    assert topic_row.is_visible(), "Topic A-01 row not visible!"
    topic_row.click()
    page.wait_for_timeout(1000)

    # Check modal opened
    sheet_header = page.locator("text=Scheda Argomento Didattica").first
    assert sheet_header.is_visible(), "Topic detail sheet not opened!"
    print("✓ TopicDetailModal opened successfully!")

    # Switch to "Teoremi & Prove d'Esame" tab
    theo_tab = page.locator("button:has-text('Teoremi & Prove d\\'Esame')").first
    theo_tab.click()
    page.wait_for_timeout(500)

    # Check Feynman Checklist heading
    feynman_heading = page.locator("text=Checklist Orale & Dimostrazioni (Metodo Feynman)").first
    assert feynman_heading.is_visible(), "Feynman heading not visible!"
    print("✓ Feynman 3-stage checklist visible!")

    # Check initial status is 0/3 Padronanza
    status_badge = page.locator("text=0/3 Padronanza").first
    assert status_badge.is_visible(), "Initial status badge 0/3 not found!"
    print("✓ Initial status is 0/3!")

    # Click Level 1 (Comprensione Intuitiva)
    lvl1_label = page.locator("text=1. Comprensione Intuitiva & Geometrica").first
    lvl1_label.click()
    page.wait_for_timeout(500)
    assert page.locator("text=1/3 Padronanza").first.is_visible(), "Status did not update to 1/3!"
    print("✓ Level 1 checked and status updated to 1/3!")

    # Click Level 2 (Enunciato Formale) and Level 3 (Dimostrazione Foglio Bianco)
    page.locator("text=2. Enunciato Formale & Ipotesi Necessarie").first.click()
    page.wait_for_timeout(300)
    page.locator("text=3. Dimostrazione su Foglio Bianco (Feynman Test)").first.click()
    page.wait_for_timeout(500)

    # Verify 3/3 Feynman Master status!
    master_badge = page.locator("text=Pronto per l'Orale (3/3) ✓").first
    assert master_badge.is_visible(), "Master badge 3/3 not displayed!"
    print("✓ Master status 'Pronto per l'Orale (3/3) ✓' confirmed!")

    browser.close()
    print("\nPunto 3 (Checklist Feynman Orale) verified 100% successfully!")
