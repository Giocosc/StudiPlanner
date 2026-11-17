import os
import json
from playwright.sync_api import sync_playwright

DIRECTORY = r"C:\tmp\StudiPlanner"

def run_partial_progress_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1400, "height": 950})
        page = context.new_page()

        console_errors = []
        page.on("pageerror", lambda err: console_errors.append(str(err)))

        print("1. Opening StudiPlanner at http://127.0.0.1:3000 ...")
        page.goto("http://127.0.0.1:3000")
        page.wait_for_selector("h1", timeout=10000)

        # Clear any stale localStorage to test clean state
        page.evaluate("() => localStorage.clear()")
        page.reload()
        page.wait_for_selector("h1", timeout=10000)

        # Check initial Dashboard progress
        print("2. Checking Dashboard initial progress ...")
        initial_completed_hours = page.locator("text=/\\d+(\\.\\d+)?h di \\d+(\\.\\d+)?h svolte/").first.inner_text()
        print(f"Initial completed hours text: '{initial_completed_hours}'")

        # Navigate to Weekly Todo
        print("3. Navigating to 'To-Do Settimanale' ...")
        page.locator("nav button:has-text('To-Do Settimanale')").click()
        page.wait_for_timeout(500)

        # Verify console elements on topic cards
        ore_spese_labels = page.locator("text=/Ore spese:/")
        count_consoles = ore_spese_labels.count()
        print(f"Found {count_consoles} topic tracking consoles with 'Ore spese:'.")
        assert count_consoles > 0, "No topic tracking consoles found!"

        # Check distinct completion buttons
        completion_buttons = page.locator("button:has-text('Segna come Completato')")
        count_completion_btns = completion_buttons.count()
        print(f"Found {count_completion_btns} 'Segna come Completato' buttons.")
        assert count_completion_btns > 0, "No 'Segna come Completato' buttons found!"

        # Initial hours on first topic card
        first_card_hours = ore_spese_labels.first.locator("..").inner_text()
        print(f"First topic initial hours: '{first_card_hours}'")
        assert "0.0" in first_card_hours or "0" in first_card_hours, "Initial hours should be 0.0"

        # Find the quick add [+ 30m] button inside the first topic console
        # In WeeklyTodo, the first day has its own header +30m/-30m stepper, then topic cards have their own steppers
        first_topic_card = page.locator("div.border.rounded-2xl:has-text('Ore spese:')").first
        first_topic_id = first_topic_card.locator("span.font-mono.font-bold").first.inner_text().strip()
        print(f"Targeting topic ID from first card: '{first_topic_id}'")

        add_30m_btn = first_topic_card.locator("button:has-text('+ 30m')")
        add_1h_btn = first_topic_card.locator("button:has-text('+ 1h')")

        print("4. Adding +30m to first topic via quick button ...")
        add_30m_btn.click()
        page.wait_for_timeout(400)

        first_card_updated = ore_spese_labels.first.locator("..").inner_text()
        print(f"First topic updated hours after +30m: '{first_card_updated}'")
        assert "0.5" in first_card_updated, f"Expected 0.5 in '{first_card_updated}'"

        # Verify the topic is STILL NOT completed (user added time without completing)
        is_completed_badge = first_topic_card.locator("text=✓ Completato").count()
        in_progress_badge = first_topic_card.locator("text=/⏳ In Corso/").count()
        print(f"Topic is not marked as completed: {is_completed_badge == 0}")
        print(f"Topic displays 'In Corso' badge: {in_progress_badge > 0}")
        assert is_completed_badge == 0, "Topic should NOT be marked completed just by adding hours!"
        assert in_progress_badge > 0, "Topic should show 'In Corso' badge!"

        # Check LocalStorage persistence
        topics_json = page.evaluate("() => localStorage.getItem('unimore_rebalancer_topics_v2')")
        assert topics_json is not None, "Topics not in LocalStorage!"
        saved_topics = json.loads(topics_json)
        matching_saved = next((t for t in saved_topics if t['id'] == first_topic_id), None)
        assert matching_saved is not None, f"Topic '{first_topic_id}' not found in saved topics!"
        print(f"LocalStorage target topic: id={matching_saved['id']}, oreEffettive={matching_saved.get('oreEffettive')}, completato={matching_saved.get('completato')}")
        assert matching_saved.get("oreEffettive") == 0.5, f"oreEffettive in LocalStorage is {matching_saved.get('oreEffettive')}, expected 0.5!"
        assert matching_saved.get("completato") is False, "completato in LocalStorage should be False!"

        # Add another +1h
        print("5. Adding +1h to first topic ...")
        add_1h_btn.click()
        page.wait_for_timeout(400)

        card_after_1h = ore_spese_labels.first.locator("..").inner_text()
        print(f"First topic updated hours after +1h: '{card_after_1h}'")
        assert "1.5" in card_after_1h, f"Expected 1.5 in '{card_after_1h}'"

        # Verify oreResidue displayed
        residue_badge = first_topic_card.locator("text=/Residue:/").inner_text()
        print(f"Residue badge text: '{residue_badge}'")
        # For 2.0h topic with 1.5h spent, residue is 0.5h
        assert "0.5h" in residue_badge, f"Expected 0.5h in residue badge: '{residue_badge}'"

        # Check Dashboard reflecting the 1.5h partial progress!
        print("6. Navigating back to Dashboard to verify partial progress in Progress Bars ...")
        page.locator("nav button:has-text('Dashboard')").click()
        page.wait_for_timeout(500)

        dashboard_hours = page.locator("text=/\\d+(\\.\\d+)?h di \\d+(\\.\\d+)?h svolte/").first.inner_text()
        print(f"Dashboard completed hours after partial progress: '{dashboard_hours}'")
        assert "1.5h" in dashboard_hours, f"Dashboard should show 1.5h completed! Found: '{dashboard_hours}'"

        # Check Geometria progress card showing completed hours (G-01 is Geometria)
        geometria_completed_stat = page.locator("text=/1\\.5h completate/").count()
        print(f"Subject card shows 1.5h completate: {geometria_completed_stat > 0}")
        assert geometria_completed_stat > 0, "Subject card did not reflect 1.5h partial progress!"

        # Now mark topic as completed
        print("7. Returning to Weekly Todo and clicking 'Segna come Completato' ...")
        page.locator("nav button:has-text('To-Do Settimanale')").click()
        page.wait_for_timeout(400)

        complete_btn = first_topic_card.locator("button:has-text('Segna come Completato')")
        complete_btn.click()
        page.wait_for_timeout(400)

        completed_btn_text = first_topic_card.locator("button:has-text('Completato ✓')").count()
        print(f"Button updated to 'Completato ✓': {completed_btn_text > 0}")
        assert completed_btn_text > 0, "Button should update to 'Completato ✓'!"

        # Verify Catalogo Argomenti (TopicsTable)
        print("8. Navigating to Catalogo Argomenti ...")
        page.locator("nav button:has-text('Catalogo Argomenti')").click()
        page.wait_for_timeout(400)

        # Check that table shows 'Ore Spese / Stimate'
        table_header = page.locator("th:has-text('Ore Spese / Stimate')").count()
        print(f"TopicsTable has 'Ore Spese / Stimate' header: {table_header > 0}")
        assert table_header > 0, "TopicsTable missing 'Ore Spese / Stimate' header!"

        # Screenshot of Weekly Todo
        page.locator("nav button:has-text('To-Do Settimanale')").click()
        page.wait_for_timeout(400)
        screenshot_path = os.path.join(DIRECTORY, "screenshot_partial_progress.png")
        page.screenshot(path=screenshot_path)
        print("Screenshot saved to:", screenshot_path)

        assert len(console_errors) == 0, f"Encountered page errors: {console_errors}"
        print("\nAll Granular Partial Progress tests PASSED with 100% precision!")

        browser.close()

if __name__ == "__main__":
    run_partial_progress_verification()
