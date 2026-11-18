from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://127.0.0.1:3000/index.html')
    page.wait_for_timeout(2000)

    # Click "Avvia Simulazione" on Dashboard
    sim_btn = page.locator("button:has-text('Avvia Simulazione')").first
    assert sim_btn.is_visible(), "Avvia Simulazione button not visible!"
    sim_btn.click()
    page.wait_for_timeout(1000)

    # Check modal opened
    modal_title = page.locator("text=Simulatore d'Esame Cronometrato").first
    assert modal_title.is_visible(), "ExamSimulator modal not visible!"
    print("✓ ExamSimulator modal opened successfully!")

    # Check live timer is visible and shows 2:00:00 (120 minutes)
    timer_display = page.locator("text=2:00:00").first
    assert timer_display.is_visible(), "Timer display 2:00:00 not found!"
    print("✓ Live Exam Timer visible (2:00:00)!")

    # Start timer
    start_btn = page.locator("button:has-text('Avvia Timer Esame')").first
    assert start_btn.is_visible(), "Start Timer button not visible!"
    start_btn.click()
    page.wait_for_timeout(1500)
    pause_btn = page.locator("button:has-text('Metti in Pausa')").first
    assert pause_btn.is_visible(), "Pause button not visible after start!"
    print("✓ Timer countdown running successfully!")

    # Switch to Geometria
    geom_btn = page.locator("button:has-text('Geometria (90m)')").first
    geom_btn.click()
    page.wait_for_timeout(800)
    timer_geom = page.locator("text=1:30:00").first
    assert timer_geom.is_visible(), "Geometria 90m timer not set!"
    print("✓ Geometria 90m timer updated successfully!")

    # Switch to Prompt AI mode
    prompt_tab = page.locator("button:has-text('Traccia & Prompt AI')").first
    prompt_tab.click()
    page.wait_for_timeout(500)
    copy_btn = page.locator("button:has-text('Copia Prompt')").first
    assert copy_btn.is_visible(), "Copy prompt button visible!"
    print("✓ AI prompt mode works properly!")

    browser.close()
    print("\nPunto 2 (Exam Simulator & Live Timer) verified 100% successfully!")
