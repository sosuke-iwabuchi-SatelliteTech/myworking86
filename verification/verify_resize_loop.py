from playwright.sync_api import sync_playwright, expect
import time

def verify_height_stability():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a large viewport to trigger the desktop layout
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        print("Navigating to app...")
        page.goto("http://localhost:5173")

        # Wait for load
        page.wait_for_selector("h1", timeout=10000)

        # Start the game
        print("Starting game...")
        page.get_by_role("button", name="1ねんせい").click()
        page.get_by_role("button", name="たしざん・ひきざん").click()

        # Wait for quiz screen
        expect(page.get_by_text("もんだい")).to_be_visible()
        expect(page.locator("canvas")).to_be_visible()

        print("Measuring initial height...")
        # Get the height of the main container or body
        initial_height = page.evaluate("document.body.scrollHeight")
        print(f"Initial height: {initial_height}")

        # Wait for 5 seconds to let any resize loop happen
        print("Waiting 5 seconds...")
        time.sleep(5)

        print("Measuring final height...")
        final_height = page.evaluate("document.body.scrollHeight")
        print(f"Final height: {final_height}")

        # Check if height increased
        if final_height > initial_height + 10: # Allow small margin of error/loading
            print(f"FAILURE: Page height increased from {initial_height} to {final_height}")
            page.screenshot(path="verification/resize_failure.png")
            raise Exception("Page height is unstable (infinite resize loop detected)")
        else:
            print("SUCCESS: Page height remained stable.")

        browser.close()

if __name__ == "__main__":
    verify_height_stability()
