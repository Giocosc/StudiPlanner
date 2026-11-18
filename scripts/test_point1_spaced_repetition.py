from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://127.0.0.1:3000/index.html')
    page.wait_for_timeout(2000)
    print('H1:', page.locator('h1').first.text_content())

    # Mark A-01 completed with past date 2026-11-15 (3 days ago relative to 18/11)
    page.evaluate('''() => {
      const topics = JSON.parse(localStorage.getItem('unimore_rebalancer_topics_v2') || '[]');
      if (topics.length > 0) {
        topics[0].completato = true;
        topics[0].isCompleted = true;
        topics[0].completedDate = '2026-11-15';
        localStorage.setItem('unimore_rebalancer_topics_v2', JSON.stringify(topics));
      }
    }''')
    page.reload()
    page.wait_for_timeout(1500)

    # Check dashboard banner for spaced repetition
    sr_banner = page.locator('text=Ripassi Spaced Repetition').first
    assert sr_banner.is_visible(), "SR Banner not visible on Dashboard!"
    print('✓ SR Banner on Dashboard visible!')

    # Switch to weekly tab
    page.locator("button:has-text('Settimanale')").first.click()
    page.wait_for_timeout(1000)
    sr_weekly = page.locator('text=Ripasso Spaced Repetition').first
    assert sr_weekly.is_visible(), "SR Banner not visible in Weekly view!"
    print('✓ SR in Weekly view visible!')

    # Check 'Segna Fatto' button
    fatto_btn = page.locator("button:has-text('Segna Fatto')").first
    assert fatto_btn.is_visible(), "Segna Fatto button not visible!"
    fatto_btn.click()
    page.wait_for_timeout(500)
    ripassato_btn = page.locator("button:has-text('Ripassato ✓')").first
    assert ripassato_btn.is_visible(), "Ripassato button not toggled!"
    print('✓ Ripassato button toggled successfully!')

    browser.close()
    print('\nPunto 1 (Spaced Repetition) verified 100% successfully!')
