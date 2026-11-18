from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://127.0.0.1:3000/index.html')
    page.wait_for_timeout(2000)

    # Click "Apri Bug Tracker" on Dashboard
    bug_btn = page.locator("button:has-text('Apri Bug Tracker')").first
    assert bug_btn.is_visible(), "Apri Bug Tracker button not visible!"
    bug_btn.click()
    page.wait_for_timeout(1000)

    # Verify modal opened
    modal_title = page.locator("text=Registro Errori Ricorrenti (Bug Tracker Matematico)").first
    assert modal_title.is_visible(), "Bug Tracker modal title not visible!"
    print("✓ MathBugTracker modal opened successfully!")

    # Check curated default errors exist
    laplace_bug = page.locator("text=Segno errato nel complemento algebrico di Laplace").first
    assert laplace_bug.is_visible(), "Laplace bug not visible!"
    print("✓ Curated math traps loaded successfully!")

    # Test toggling "Segna Risolto ✓"
    resolve_btn = page.locator("button:has-text('Segna Risolto ✓')").first
    assert resolve_btn.is_visible(), "Segna Risolto button not visible!"
    resolve_btn.click()
    page.wait_for_timeout(500)
    reopen_btn = page.locator("button:has-text('Riapri')").first
    assert reopen_btn.is_visible(), "Riapri button not visible after resolve!"
    print("✓ Bug resolution toggle works!")

    # Test adding new custom bug
    page.locator("button:has-text('+ Segnala Nuovo Errore')").first.click()
    page.wait_for_timeout(500)
    title_input = page.locator("input[placeholder*='Es. Sbagliato il segno']").first
    assert title_input.is_visible(), "Add bug input not visible!"
    title_input.fill("Dimenticato costante c negli integrali indefiniti")
    page.locator("button:has-text('Salva nel Bug Tracker')").first.click()
    page.wait_for_timeout(500)

    # Verify new bug appears in list
    new_bug = page.locator("text=Dimenticato costante c negli integrali indefiniti").first
    assert new_bug.is_visible(), "Newly added bug not visible in list!"
    print("✓ Custom bug added and rendered in list successfully!")

    browser.close()
    print("\nPunto 5 (Math Bug Tracker) verified 100% successfully!")
