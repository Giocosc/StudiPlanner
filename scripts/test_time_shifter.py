import os
import json
from playwright.sync_api import sync_playwright

DIRECTORY = r"C:\tmp\StudiPlanner"

def run_time_shifter_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1400, "height": 950})
        page = context.new_page()

        console_errors = []
        page.on("pageerror", lambda err: console_errors.append(str(err)))

        print("1. Opening StudiPlanner at http://127.0.0.1:3000 ...")
        page.goto("http://127.0.0.1:3000")
        page.wait_for_selector("h1", timeout=10000)

        # Go to Weekly Todo tab
        print("2. Navigating to 'To-Do Settimanale' tab ...")
        weekly_tab_btn = page.locator("nav button:has-text('To-Do Settimanale')")
        weekly_tab_btn.click()
        page.wait_for_timeout(500)

        # Verify presence of stepper controls
        minus_buttons = page.locator("button:has-text('- 30m')")
        plus_buttons = page.locator("button:has-text('+ 30m')")
        budget_badges = page.locator("text=/Budget: \\d+(\\.\\d+)?h/")

        count_minus = minus_buttons.count()
        count_plus = plus_buttons.count()
        count_badges = budget_badges.count()

        print(f"Found {count_minus} [- 30m] buttons, {count_plus} [+ 30m] buttons, {count_badges} budget badges.")
        assert count_minus > 0, "No [- 30m] stepper buttons found!"
        assert count_plus > 0, "No [+ 30m] stepper buttons found!"
        assert count_badges > 0, "No budget badges found!"

        # Read initial budget of the first day
        initial_badge_text = budget_badges.first.inner_text()
        print(f"Initial first day budget text: '{initial_badge_text}'")

        # Click [+ 30m] on first day
        print("3. Clicking [+ 30m] (Slot Extra) on first visible day ...")
        plus_buttons.first.click()
        page.wait_for_timeout(400)

        # Check updated budget badge
        updated_badge_text = budget_badges.first.inner_text()
        print(f"Updated badge text after +30m: '{updated_badge_text}'")
        assert updated_badge_text != initial_badge_text, "Badge did not update after [+ 30m]!"

        # Verify LocalStorage customDayCapacities
        local_storage_val = page.evaluate("() => localStorage.getItem('unimore_rebalancer_custom_capacities_v2')")
        print("LocalStorage customDayCapacities:", local_storage_val)
        assert local_storage_val is not None, "customDayCapacities not found in LocalStorage!"
        parsed_capacities = json.loads(local_storage_val)
        assert len(parsed_capacities) > 0, "customDayCapacities object is empty!"
        print("Parsed LocalStorage capacities:", parsed_capacities)

        # Click [+ 30m] again to expand further
        print("4. Adding another +30m slot extra ...")
        plus_buttons.first.click()
        page.wait_for_timeout(400)
        third_badge_text = budget_badges.first.inner_text()
        print(f"Badge text after second +30m: '{third_badge_text}'")

        # Click [- 30m] to reduce
        print("5. Clicking [- 30m] to reduce capacity ...")
        minus_buttons.first.click()
        page.wait_for_timeout(400)
        reduced_badge_text = budget_badges.first.inner_text()
        print(f"Badge text after -30m: '{reduced_badge_text}'")

        # Take screenshot of Weekly Todo with active custom capacity
        screenshot_path = os.path.join(DIRECTORY, "screenshot_time_shifter.png")
        page.screenshot(path=screenshot_path)
        print("Screenshot saved to:", screenshot_path)

        # 6. Verify SettingsModal mentions Gestione Flessibile Slot Extra
        print("6. Verifying Settings Modal ...")
        settings_btn = page.locator("header button[title*='Parametri']")
        settings_btn.click()
        page.wait_for_timeout(400)

        flexible_slot_title = page.locator("text=Gestione Flessibile Slot Extra").count()
        print("SettingsModal has 'Gestione Flessibile Slot Extra':", flexible_slot_title > 0)
        assert flexible_slot_title > 0, "Missing 'Gestione Flessibile Slot Extra' in SettingsModal!"

        # Verify count of custom dates badge in settings modal
        custom_dates_badge = page.locator("text=/\\d+ date personalizzate/").count()
        print("SettingsModal shows custom dates badge:", custom_dates_badge > 0)

        screenshot_settings = os.path.join(DIRECTORY, "screenshot_settings_slot_extra.png")
        page.screenshot(path=screenshot_settings)
        print("Settings Modal screenshot saved to:", screenshot_settings)

        # Close settings modal
        page.locator("button:has-text('Annulla')").click()
        page.wait_for_timeout(300)

        assert len(console_errors) == 0, f"Encountered page errors: {console_errors}"
        print("\nAll Time Shifter & Slot Extra tests PASSED successfully!")

        browser.close()

if __name__ == "__main__":
    run_time_shifter_verification()
