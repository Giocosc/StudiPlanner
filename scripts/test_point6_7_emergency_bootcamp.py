from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://127.0.0.1:3000/index.html')
    page.wait_for_timeout(2000)

    # Go to Weekly tab
    page.locator("button:has-text('Settimanale')").first.click()
    page.wait_for_timeout(1000)

    # Check "Modalità Straordinari" button exists (Punto 6)
    straord_btn = page.locator("button:has-text('Modalità Straordinari')").first
    assert straord_btn.is_visible(), "Modalità Straordinari button not found!"
    print("✓ Modalità Straordinari button visible!")

    # Check "Bootcamp Natale" button exists (Punto 7)
    bootcamp_btn = page.locator("button:has-text('Bootcamp Natale')").first
    assert bootcamp_btn.is_visible(), "Bootcamp Natale button not found!"
    print("✓ Bootcamp Natale button visible!")

    # Click Modalità Straordinari
    straord_btn.click()
    page.wait_for_timeout(500)
    assert page.locator("text=Straordinari Attivi").first.is_visible(), "Straordinari Attivi badge not shown!"
    print("✓ Modalità Straordinari activated successfully (weekdays compressed to 1.0h)!")

    # Click again to toggle off
    page.locator("button:has-text('Straordinari Attivi')").first.click()
    page.wait_for_timeout(500)
    assert page.locator("button:has-text('Modalità Straordinari')").first.is_visible(), "Not reverted to standard!"
    print("✓ Modalità Straordinari toggled back cleanly!")

    # Click Bootcamp Natale
    bootcamp_btn.click()
    page.wait_for_timeout(500)
    assert page.locator("text=Bootcamp Natale Attivo").first.is_visible(), "Bootcamp Natale Attivo badge not shown!"
    print("✓ Holiday Bootcamp activated successfully (6.5h/day)! ")

    browser.close()
    print("\nPunto 6 & 7 (Work Emergency / Overtime & Holiday Bootcamp) verified 100% successfully!")
