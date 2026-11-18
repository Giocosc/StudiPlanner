import os
import time
from playwright.sync_api import sync_playwright

def run_gitlab_sync_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1600, "height": 950})
        page = context.new_page()

        page.goto("http://127.0.0.1:3000")
        page.wait_for_timeout(2000)

        # 1. Switch to "Import / Sync" tab
        print("1. Opening 'Import / Sync' tab...")
        tab_btn = page.locator("button:has-text('Import / Sync')").first
        tab_btn.click()
        page.wait_for_timeout(1000)

        # 2. Verify GitLab Cloud Sync Card is visible
        print("2. Verifying GitLab Cloud Sync Card...")
        gitlab_heading = page.locator("text=Sincronizzazione Cloud GitLab (Multi-Dispositivo)").first
        assert gitlab_heading.is_visible(), "GitLab Sync Card heading not found!"
        print("  ✓ GitLab card is visible")

        # 3. Verify Form Fields
        print("3. Checking GitLab input fields...")
        instance_input = page.locator("input[placeholder*='gitlab.com']").first
        project_input = page.locator("input[placeholder*='username/studiplanner']").first
        branch_input = page.locator("input[placeholder*='main']").first
        token_input = page.locator("input[placeholder*='glpat-']").first

        assert instance_input.is_visible(), "Instance URL input not found!"
        assert project_input.is_visible(), "Project ID input not found!"
        assert branch_input.is_visible(), "Branch input not found!"
        assert token_input.is_visible(), "Token input not found!"
        print("  ✓ All configuration inputs are present")

        # 4. Fill in mock configuration
        print("4. Filling mock GitLab configuration...")
        project_input.fill("unimore-student/studiplanner-data")
        token_input.fill("glpat-mock-token-xyz-123456789")
        page.wait_for_timeout(500)

        # 5. Click "Salva" button
        print("5. Clicking 'Salva' button...")
        save_btn = page.locator("button:has-text('Salva')").first
        save_btn.click()
        page.wait_for_timeout(800)

        # Verify notification
        notif = page.locator("text=Configurazione GitLab").first
        assert notif.is_visible(), "Success notification not displayed!"
        print("  ✓ Success notification confirmed:", notif.text_content())

        # 6. Click "Abilita GitLab Sync" button
        print("6. Clicking 'Abilita GitLab Sync' button...")
        enable_btn = page.locator("button:has-text('Abilita GitLab Sync')").first
        enable_btn.click()
        page.wait_for_timeout(800)

        # 7. Verify LocalStorage has saved gitlabConfig enabled: true
        stored_config = page.evaluate("() => localStorage.getItem('unimore_rebalancer_gitlab_config_v1')")
        print("  ✓ Stored config in localStorage:", stored_config)
        assert '"enabled":true' in stored_config, "enabled is not true in localStorage!"
        assert "unimore-student/studiplanner-data" in stored_config, "Project ID not in localStorage!"
        assert "glpat-mock" in stored_config, "Token not in localStorage!"

        # 8. Check Header Status Badge
        header_sync_badge = page.locator("header button:has-text('GitLab')").first
        assert header_sync_badge.is_visible(), "Header GitLab sync badge should be visible when enabled!"
        print("  ✓ Header GitLab element detected and visible!")

        # 9. Take full screenshot
        screenshot_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "screenshot_gitlab_sync_ui.png")
        page.screenshot(path=screenshot_path)
        print("  ✓ Screenshot captured at:", screenshot_path)

        browser.close()
        print("\nAll GitLab Cloud Sync UI tests passed 100% successfully!")

if __name__ == "__main__":
    run_gitlab_sync_test()
