from playwright.sync_api import sync_playwright, expect

def verify_scrolling_classes(page):
    page.goto("http://localhost:5173")

    # Wait for the body to be available
    page.wait_for_selector("body")

    # Get the body class attribute
    body_classes = page.locator("body").get_attribute("class")

    # Verify that overflow-hidden, items-center, justify-center are NOT present
    if "overflow-hidden" in body_classes:
        raise AssertionError("overflow-hidden should not be in body classes")
    if "items-center" in body_classes:
        raise AssertionError("items-center should not be in body classes")
    if "justify-center" in body_classes:
        raise AssertionError("justify-center should not be in body classes")

    print(f"Body classes verified: {body_classes}")

    # Take a screenshot
    page.screenshot(path="verification/scrolling_verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        verify_scrolling_classes(page)
        browser.close()
