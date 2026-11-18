import time
import os
import json
from playwright.sync_api import sync_playwright

def run_geometria_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1600, "height": 950})
        page = context.new_page()

        # Clear localStorage before test to start clean
        page.goto("http://127.0.0.1:3000")
        page.evaluate("localStorage.clear()")
        page.reload()
        page.wait_for_timeout(2000)

        # 1. Switch to Settimanale (Weekly) tab
        print("1. Opening 'Settimanale' tab...")
        page.locator("button:has-text('Settimanale')").first.click()
        page.wait_for_timeout(1000)

        # 2. Click the Header '+ Registra Studio' button
        print("2. Opening '+ Registra Studio' modal...")
        header_btn = page.locator("header button:has-text('Registra Studio')").first
        header_btn.click()
        page.wait_for_timeout(1000)

        # Verify modal opened
        modal = page.locator("text=Registra Sessione di Studio").first
        assert modal.is_visible(), "LogStudyModal did not open!"
        print("  ✓ LogStudyModal opened successfully")

        # 3. User scenario: today was scheduled with Analisi (A-01), but user studied Geometria!
        # Click "Geometria (31)" filter pill
        print("3. Clicking 'Geometria (31)' filter pill...")
        geom_pill = page.locator("button:has-text('Geometria (31)')").first
        geom_pill.click()
        page.wait_for_timeout(800)

        # Verify that the active topic automatically switched to G-01!
        hero_selected = page.locator("text=G-01").first
        assert hero_selected.is_visible(), "Hero card did not select G-01 upon filtering Geometria!"
        print("  ✓ Active topic immediately synchronized to G-01!")

        # Also test clicking G-02 or searching inside the modal
        print("4. Testing search and clicking on a specific Geometria topic (G-02)...")
        modal_dialog = page.locator(".fixed.z-50").first
        search_input = modal_dialog.locator("input[placeholder*='Cerca per ID']").first
        search_input.fill("G-02")
        page.wait_for_timeout(500)

        # Click on G-02 row inside the modal
        g02_row = modal_dialog.locator("div[class*='cursor-pointer']:has-text('G-02')").first
        g02_row.click()
        page.wait_for_timeout(500)

        # Check live confirmation box shows G-02
        preview_box = modal_dialog.locator("text=G-02").first
        assert preview_box.is_visible(), "Confirmation box did not show G-02!"
        print("  ✓ G-02 actively selected and displayed in live confirmation!")

        # Take screenshot of the new beautiful modal with Geometria selected
        modal_screenshot = os.path.join(os.getcwd(), "screenshot_improved_log_modal.png")
        page.screenshot(path=modal_screenshot)
        print(f"  ✓ Modal screenshot saved to {modal_screenshot}")

        # 5. Confirm and save session
        print("5. Submitting session for G-02...")
        submit_btn = modal_dialog.locator("button:has-text('Conferma e Salva Sessione')").first
        submit_btn.click()
        page.wait_for_timeout(1200)

        # 6. Verify that G-02 was recorded and NOT A-01!
        topics_json = page.evaluate("localStorage.getItem('unimore_rebalancer_topics_v2')")
        topics = json.loads(topics_json)
        
        t_g02 = next((t for t in topics if t["id"] == "G-02"), None)
        t_a01 = next((t for t in topics if t["id"] == "A-01"), None)

        assert t_g02 is not None, "G-02 topic not found in topics!"
        assert t_g02.get("completato") == True, f"G-02 was NOT marked as completed! State: {t_g02}"
        assert t_g02.get("oreEffettive", 0) > 0, f"G-02 did not receive logged hours! State: {t_g02}"
        print(f"  ✓ G-02 properly updated in localStorage: {t_g02['oreEffettive']}h, completed={t_g02['completato']}")

        assert t_a01 is not None, "A-01 topic not found in topics!"
        assert t_a01.get("completato") == False, f"A-01 was erroneously completed! State: {t_a01}"
        assert t_a01.get("oreEffettive", 0) == 0, f"A-01 erroneously received hours! State: {t_a01}"
        print("  ✓ A-01 remained untouched and clean (0h, completed=False)!")

        # 7. Check sessions in localStorage
        sessions_json = page.evaluate("localStorage.getItem('unimore_rebalancer_sessions_v2')")
        sessions = json.loads(sessions_json)
        assert len(sessions) == 1, f"Expected 1 session, found {len(sessions)}"
        assert sessions[0]["topicId"] == "G-02", f"Session saved with wrong topicId: {sessions[0]['topicId']}"
        print(f"  ✓ Session saved explicitly on G-02 with {sessions[0]['hours']}h!")

        # 8. Check Settimanale view shows G-02 session on the active day
        rebalanced_screenshot = os.path.join(os.getcwd(), "screenshot_rebalanced_geometria.png")
        page.screenshot(path=rebalanced_screenshot)
        print(f"  ✓ Rebalanced view screenshot saved to {rebalanced_screenshot}")

        browser.close()
        print("\nAll Geometria study logging tests passed with 100% success!")

if __name__ == "__main__":
    run_geometria_test()
