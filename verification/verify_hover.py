from playwright.sync_api import sync_playwright

def verify_button_styles():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use device emulation to check touch behavior simulation if possible,
        # though Playwright's 'has_touch' is just a capability flag.
        # We can simulate hover states.

        # 1. Desktop Context (supports hover)
        context_desktop = browser.new_context()
        page_desktop = context_desktop.new_page()
        page_desktop.goto("http://localhost:5173")

        # Wait for "1ねんせい" button
        page_desktop.wait_for_selector("text=1ねんせい")
        page_desktop.click("text=1ねんせい")

        # Wait for quiz screen
        page_desktop.wait_for_timeout(4000) # wait for countdown

        # Hover over an answer button
        # We need to find an answer button. They are buttons with numbers.
        # Let's pick the first button in the grid.
        # The grid is div.grid > button
        btn = page_desktop.locator(".grid button").first
        btn.hover()

        page_desktop.screenshot(path="verification/desktop_hover.png")
        print("Desktop hover screenshot taken.")

        # 2. Mobile Context (touch, no hover)
        # We can configure the context to simulate a mobile device
        context_mobile = browser.new_context(
            viewport={'width': 375, 'height': 667},
            is_mobile=True,
            has_touch=True
        )
        page_mobile = context_mobile.new_page()
        page_mobile.goto("http://localhost:5173")

        page_mobile.wait_for_selector("text=1ねんせい")
        page_mobile.tap("text=1ねんせい")

        page_mobile.wait_for_timeout(4000)

        # In mobile, we "tap". Playwright's tap might trigger hover events depending on impl.
        # But importantly, we want to see if the button REMAINS blue after a sequence?
        # The user's issue was sticky hover.
        # Verifying "sticky hover" is hard in playwright because playwright's tap is clean.
        # However, we can check if the button has the hover style applied.

        btn_mobile = page_mobile.locator(".grid button").first
        # We can try to forcibly hover it? No, on mobile hover shouldn't trigger the style.
        # Let's try to hover and see if style changes.

        # Playwright hover() on a touch device context?
        # It sends mousemove. But if media query (hover: hover) works, it should NOT apply style.
        # Note: Playwright's emulated mobile context might still report (hover: hover) as true
        # unless we strictly define screen capabilities.
        # Actually `has_touch=True` usually implies coarse pointer, but let's see.

        try:
            btn_mobile.hover()
        except:
            pass # hovering might not work or be relevant

        page_mobile.screenshot(path="verification/mobile_hover_attempt.png")
        print("Mobile hover attempt screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_button_styles()
