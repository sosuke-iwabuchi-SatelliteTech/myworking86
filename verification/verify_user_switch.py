from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:5173")

    # Check for "はじめまして！" (User Registration Screen)
    # The registration screen appears first if no user is present.
    # We should register a user to get to the Welcome Screen.

    if page.get_by_role("heading", name="はじめまして！").is_visible():
        page.get_by_label("ニックネーム").fill("テスト花子")
        page.get_by_label("がくねん").select_option("2")
        page.get_by_role("button", name="はじめる！").click()

    # Wait for Welcome Screen
    page.wait_for_selector("text=さんすう")

    # Click Switch User Icon
    page.get_by_label("ユーザーを切り替える").click()

    # Verify Modal is Open
    page.wait_for_selector("text=ユーザーきりかえ")

    # Take screenshot
    page.screenshot(path="verification/user_switch.png")

    # Close browser
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
