from playwright.sync_api import sync_playwright

def verify_quiz_generation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app
        page.goto("http://localhost:5173")

        # Wait for the Welcome Screen to load by checking for the title
        # "さんすう" is part of the h1
        page.wait_for_selector("text=さんすう")

        # Click on Grade 1 Calculation button
        # Use partial text match or exact match from source
        page.get_by_role("button", name="1ねんせい (たしざん・ひきざん)").click()

        # Wait for quiz screen (countdown)
        page.wait_for_timeout(4000) # Wait 4s for countdown (3s) to finish

        # Verify a question is displayed
        page.wait_for_selector("text=もんだい 1/10")

        # Take screenshot of Grade 1 Quiz
        page.screenshot(path="verification/grade1_quiz.png")
        print("Grade 1 screenshot taken")

        # Go back to top
        page.get_by_role("button", name="トップにもどる").click()

        # Wait for Welcome Screen again
        page.wait_for_selector("text=さんすう")

        # Click on Grade 4 Geometry button
        page.get_by_role("button", name="4ねんせい (図形の面積)").click()

        # Wait for quiz screen (countdown)
        page.wait_for_timeout(4000)

        # Verify geometry display exists
        # We can check for the SVG
        page.wait_for_selector("svg")

        # Take screenshot of Grade 4 Quiz
        page.screenshot(path="verification/grade4_quiz.png")
        print("Grade 4 screenshot taken")

        browser.close()

if __name__ == "__main__":
    verify_quiz_generation()
