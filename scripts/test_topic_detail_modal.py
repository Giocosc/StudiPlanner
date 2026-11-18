import time
import os
from playwright.sync_api import sync_playwright

def run_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1600, "height": 950})
        page = context.new_page()

        print("Navigating to StudiPlanner at http://127.0.0.1:3000...")
        page.goto("http://127.0.0.1:3000")
        page.wait_for_timeout(2500)

        # 1. Switch to Settimanale (Weekly) Tab
        print("Clicking 'Settimanale' tab...")
        weekly_btn = page.locator("button:has-text('Settimanale')").first
        weekly_btn.click()
        page.wait_for_timeout(1000)

        # 2. Click on the first topic card's title or 'Info' button
        print("Looking for topic cards and clicking 'ℹ Info' on A-01...")
        info_btn = page.locator("button:has-text('ℹ Info')").first
        info_btn.click()
        page.wait_for_timeout(1000)

        # 3. Verify TopicDetailModal is open
        print("Verifying TopicDetailModal contents...")
        modal_title = page.locator("text=Scheda Argomento Didattica").first
        assert modal_title.is_visible(), "Modal title 'Scheda Argomento Didattica' not visible!"
        print("  ✓ Scheda Argomento header visible")

        # Verify subject & code badge
        badge_a = page.locator("span:has-text('A-01')").first
        assert badge_a.is_visible(), "Topic ID 'A-01' not visible in modal!"
        print("  ✓ Topic ID badge visible")

        # Verify metric cards
        assert page.locator("text=Monte Ore").first.is_visible(), "Monte Ore card not visible!"
        assert page.locator("text=Difficoltà").first.is_visible(), "Difficoltà card not visible!"
        assert page.locator("text=Priorità Esame").first.is_visible(), "Priorità Esame card not visible!"
        print("  ✓ Metric cards (Monte Ore, Difficoltà, Priorità) visible")

        # Verify tabs
        tab_theorems = page.locator("button:has-text('Teoremi & Prove d\\'Esame')").first
        assert tab_theorems.is_visible(), "Teoremi tab not visible!"
        tab_theorems.click()
        page.wait_for_timeout(500)
        assert page.locator("text=Teoremi e Rigore Dimostrativo").first.is_visible(), "Oral exam proof card not visible!"
        print("  ✓ Teoremi & Prove d'Esame tab rendered correctly")

        tab_sessions = page.locator("button:has-text('Diario Sessioni')").first
        assert tab_sessions.is_visible(), "Diario Sessioni tab not visible!"
        tab_sessions.click()
        page.wait_for_timeout(500)
        print("  ✓ Diario Sessioni tab rendered correctly")

        # Screenshot modal open
        screenshot_path = os.path.join(os.getcwd(), "screenshot_topic_detail_modal.png")
        page.screenshot(path=screenshot_path)
        print(f"  ✓ Screenshot saved to {screenshot_path}")

        # Close modal
        close_btn = page.locator("button:has-text('Chiudi')").first
        close_btn.click()
        page.wait_for_timeout(500)

        # 4. Test opening from TopicsTable ('Argomenti' tab)
        print("Testing topic detail trigger in TopicsTable ('Argomenti' tab)...")
        topics_tab_btn = page.locator("button:has-text('Argomenti')").first
        topics_tab_btn.click()
        page.wait_for_timeout(1000)

        # Click on topic title in table
        first_table_topic = page.locator("tbody tr button:has-text('A-01')").first
        first_table_topic.click()
        page.wait_for_timeout(1000)

        assert page.locator("text=Scheda Argomento").first.is_visible(), "Modal not opened from TopicsTable!"
        print("  ✓ Modal successfully opened from TopicsTable!")

        page.locator("button:has-text('Chiudi')").first.click()
        page.wait_for_timeout(500)

        browser.close()
        print("\nAll Topic Detail Modal tests passed with 100% success!")

if __name__ == "__main__":
    run_test()
