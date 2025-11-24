from playwright.sync_api import sync_playwright

def verify_app_padding():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:5173")
            # Wait for content to load
            page.wait_for_selector('text=さんすう')

            # Take screenshot
            page.screenshot(path="verification/app_layout.png")
            print("Screenshot taken")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_app_padding()
