from playwright.sync_api import sync_playwright
import time

def verify_registration():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("1. Clearing localStorage and loading page...")
        # Clear local storage via CDP before navigation or evaluate after
        # Easier to load, clear, reload
        page.goto("http://localhost:5173")
        page.evaluate("localStorage.clear()")
        page.reload()
        page.wait_for_load_state("networkidle")

        # Check if Registration Screen is present
        print("2. Checking for Registration Screen...")
        header = page.locator("h1", has_text="はじめまして！")
        if not header.is_visible():
            print("FAILED: Registration header not found")
            page.screenshot(path="verification/reg_fail_header.png")
            return

        page.screenshot(path="verification/registration_screen.png")

        # Check inputs
        nickname_input = page.locator("#nickname")
        grade_select = page.locator("#grade")
        submit_btn = page.locator("button[type='submit']")

        # 3. Try invalid submit (empty)
        print("3. Verifying validation (empty)...")
        if submit_btn.is_enabled():
            # It might be styled as enabled but logically disabled or handled in click
            # React state usually handles disabled attribute
            if not submit_btn.get_attribute("disabled") and "cursor-not-allowed" not in submit_btn.get_attribute("class"):
                 print("FAILED: Submit button should be disabled initially")

        # 4. Input valid data
        print("4. Entering valid data...")
        nickname_input.fill("Taro")
        grade_select.select_option("2") # 2ねんせい

        # 5. Check enabled
        time.sleep(0.5) # Wait for react state update
        if submit_btn.get_attribute("disabled"):
            print("FAILED: Submit button should be enabled after valid input")
            return

        # 6. Submit
        print("6. Submitting...")
        submit_btn.click()

        # 7. Verify Welcome Screen
        print("7. Verifying Welcome Screen...")
        # Wait for "さんすうクイズ" header
        welcome_header = page.locator("h1", has_text="さんすう")
        welcome_header.wait_for(state="visible", timeout=2000)

        # 8. Verify Displayed Info
        print("8. Verifying displayed profile...")
        # Use a more specific locator or get_by_text with exact match false but scoped better
        profile_display = page.locator("div.text-xl.font-black", has_text="Taroさん (2ねんせい)").first
        if not profile_display.is_visible():
            print("FAILED: Profile info not displayed correctly on Welcome Screen")
            page.screenshot(path="verification/reg_fail_display.png")
        else:
            print("SUCCESS: Profile info displayed!")
            page.screenshot(path="verification/welcome_with_profile.png")

        # 9. Reload and check persistence
        print("9. Verifying persistence on reload...")
        page.reload()
        page.wait_for_load_state("networkidle")

        # Should see welcome screen immediately, not registration
        welcome_header = page.locator("h1", has_text="さんすう")
        if not welcome_header.is_visible():
             print("FAILED: Did not load Welcome Screen on reload")
             page.screenshot(path="verification/reg_fail_reload.png")
        elif page.locator("h1", has_text="はじめまして！").is_visible():
             print("FAILED: Registration screen showed up again")
        else:
             print("SUCCESS: Persistence verified!")

        browser.close()

if __name__ == "__main__":
    try:
        verify_registration()
    except Exception as e:
        print(f"An error occurred: {e}")
