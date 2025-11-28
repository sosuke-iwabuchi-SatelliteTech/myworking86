from playwright.sync_api import sync_playwright, expect
import re

def verify_pen_size_settings():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        # Emulate a large screen to ensure DrawingCanvas is visible
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        try:
            # 1. Navigate to the app
            page.goto("http://localhost:5173")

            # 2. Register/Login flow (required if not previously registered)
            # Check if we are on registration screen by looking for specific text "はじめまして！"
            # We wait a bit to be sure the page has loaded
            page.wait_for_timeout(1000)

            if page.get_by_text("はじめまして！").is_visible():
                print("Registering new user...")
                # Fill nickname
                page.get_by_label("ニックネーム").fill("Tester")
                # Select grade from dropdown
                page.locator("select#grade").select_option("1")
                # Click submit button
                page.get_by_role("button", name="はじめる！").click()

            # 3. Navigate to a quiz that has drawing canvas (Large screen)
            # Select 1st grade
            print("Selecting grade...")
            # On WelcomeScreen, grades are buttons.
            page.get_by_role("button", name="1ねんせい").click()

            # Select first unit
            print("Selecting unit...")
            page.get_by_role("button", name="たしざん・ひきざん").click()

            # Answer Mode Modal might appear
            if page.get_by_text("どちらのモードで").is_visible():
                 page.get_by_role("button", name="えらぶ").click()

            # Start quiz
            # Wait for countdown to finish (it blocks interaction)
            print("Waiting for countdown...")
            page.wait_for_timeout(4000)

            # Check if Drawing Canvas is visible
            # Refine selector to avoid strict mode violation (we have nested divs with dashed borders)
            # The actual canvas container inside the wrapper
            canvas_container = page.locator("canvas").first
            expect(canvas_container).to_be_visible()

            # Verify Pen Size Buttons exist
            print("Verifying pen size buttons...")
            # Use title attribute we added
            small_btn = page.locator("button[title*='細 (2px)']")
            medium_btn = page.locator("button[title*='中 (5px)']")
            large_btn = page.locator("button[title*='太 (10px)']")

            expect(small_btn).to_be_visible()
            expect(medium_btn).to_be_visible()
            expect(large_btn).to_be_visible()

            # Click buttons to change size and verify visual feedback (active state)
            # Default should be Small (2px)
            # Check if Small is active (bg-slate-800 is the active class)
            # Use regex to check class presence
            expect(small_btn).to_have_class(re.compile(r"bg-slate-800"))

            # Click Medium
            medium_btn.click()
            expect(medium_btn).to_have_class(re.compile(r"bg-slate-800"))
            expect(small_btn).not_to_have_class(re.compile(r"bg-slate-800"))

            # Click Large
            large_btn.click()
            expect(large_btn).to_have_class(re.compile(r"bg-slate-800"))
            expect(medium_btn).not_to_have_class(re.compile(r"bg-slate-800"))

            # Take screenshot
            print("Taking screenshot...")
            page.screenshot(path="verification/pen_size_ui.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_pen_size_settings()
