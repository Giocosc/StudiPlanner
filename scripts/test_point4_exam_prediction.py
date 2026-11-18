from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://127.0.0.1:3000/index.html')
    page.wait_for_timeout(2000)

    # Check that the prediction card is visible on the Dashboard
    heading = page.locator("text=Previsione Esame & Voto Atteso").first
    assert heading.is_visible(), "Previsione Esame & Voto Atteso heading not found!"
    print("✓ Exam prediction card heading visible!")

    # Check for probability of passing
    prob_elem = page.locator("text=Probabilità Superamento").first
    assert prob_elem.is_visible(), "Probabilità Superamento not found!"
    print("✓ Probabilità Superamento element visible!")

    # Check for Voto Stimato
    voto_elem = page.locator("text=Voto Stimato").first
    assert voto_elem.is_visible(), "Voto Stimato element not found!"
    print("✓ Voto Stimato element visible!")

    # Check sub-metrics: Passo Richiesto, Indice di Costanza, Completamento Didattico
    assert page.locator("text=Passo Richiesto").first.is_visible(), "Passo Richiesto not found!"
    assert page.locator("text=Indice di Costanza").first.is_visible(), "Indice di Costanza not found!"
    assert page.locator("text=Completamento Didattico").first.is_visible(), "Completamento Didattico not found!"
    print("✓ All 3 sub-metrics breakdown elements visible!")

    browser.close()
    print("\nPunto 4 (Heuristic Exam Prediction & Grade Forecast) verified 100% successfully!")
