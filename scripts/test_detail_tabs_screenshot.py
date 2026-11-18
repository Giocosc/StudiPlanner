import time
import os
from playwright.sync_api import sync_playwright

def run_tabs_screenshot():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1600, "height": 950})
        page = context.new_page()

        page.goto("http://127.0.0.1:3000")
        page.wait_for_timeout(2000)

        # Go to Settimanale
        page.locator("button:has-text('Settimanale')").first.click()
        page.wait_for_timeout(1000)

        # Open topic detail for the first topic card (click title)
        page.locator("button:has-text('ℹ Info')").first.click()
        page.wait_for_timeout(800)

        # Tab 1: Programma & Contenuti
        page.locator("button:has-text('Programma & Contenuti')").first.click()
        page.wait_for_timeout(500)
        page.screenshot(path=os.path.join(os.getcwd(), "screenshot_tab_programma.png"))
        print("Tab 1 screenshot saved.")

        # Tab 2: Teoremi & Prove d'Esame
        page.locator("button:has-text('Teoremi & Prove d\\'Esame')").first.click()
        page.wait_for_timeout(500)
        page.screenshot(path=os.path.join(os.getcwd(), "screenshot_tab_teoremi.png"))
        print("Tab 2 screenshot saved.")

        browser.close()

if __name__ == "__main__":
    run_tabs_screenshot()
