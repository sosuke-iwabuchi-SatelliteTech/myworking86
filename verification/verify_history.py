from playwright.sync_api import sync_playwright

def verify_history_screen():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Navigate to the app
        page.goto("http://localhost:5173")

        # Handle registration if needed (fresh start)
        if page.get_by_role("heading", name="はじめまして！").is_visible():
            page.get_by_label("ニックネーム").fill("スクショ太郎")
            page.get_by_label("がくねん").select_option("4")
            page.get_by_role("button", name="はじめる！").click()

        # Play a game to generate history
        # Go to Grade 1 Calc
        page.get_by_role("button", name="1ねんせい").click()
        page.get_by_role("button", name="たしざん・ひきざん").click()

        # Answer questions quickly
        first_answer_btn = page.locator("button.answer-btn-hover").first
        for _ in range(10):
            first_answer_btn.click()
            page.wait_for_timeout(200)

        # Wait for result screen
        page.locator("text=けっかはっぴょう！").wait_for(state="visible", timeout=15000)

        # Go to top
        page.get_by_role("button", name="さいしょにもどる").click()

        # Go to history screen
        page.get_by_role("button", name="履歴を見る").click()

        # Verify history screen loaded
        page.locator("text=これまでのせいせき").wait_for(state="visible")

        # Take screenshot
        screenshot_path = "verification/history_verification.png"
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    verify_history_screen()
