import re
from playwright.sync_api import sync_playwright, expect

def solve_question(question_text: str) -> int:
    """Parses a simple math question and returns the answer."""
    # Example: "5 + 3 = ?"
    parts = question_text.split()
    num1 = int(parts[0])
    operator = parts[1]
    num2 = int(parts[2])

    if operator == '+':
        return num1 + num2
    elif operator == '-':
        return num1 - num2
    elif operator == '×':
        return num1 * num2
    else:
        raise ValueError(f"Unknown operator: {operator}")

def verify_full_quiz_flow():
    """
    Verifies the entire quiz flow:
    1. Plays a full 10-question quiz.
    2. Checks the result screen.
    3. Verifies the history is saved.
    4. Verifies the history can be cleared.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Start and complete the quiz
        page.goto("http://localhost:5173")
        page.wait_for_selector("text=さんすう")

        page.get_by_role("button", name="1ねんせい", exact=True).click()
        page.get_by_role("button", name="たしざん・ひきざん", exact=True).click()

        page.wait_for_timeout(4000)

        for i in range(1, 11):
            question_header = page.locator(f"text=もんだい {i}/10")
            expect(question_header).to_be_visible()

            question_text_element = page.locator(".text-6xl.font-black")
            expect(question_text_element).to_be_visible()
            question_text = question_text_element.inner_text()

            correct_answer = solve_question(question_text)

            page.get_by_role("button", name=str(correct_answer), exact=True).click()
            page.wait_for_timeout(500)

        # 2. Check the result screen
        print("Verifying result screen...")
        expect(page.locator("text=けっかはっぴょう！")).to_be_visible()
        score_container = page.locator(".bg-slate-50")
        expect(score_container.locator("text=100")).to_be_visible()
        print("Result screen verified.")

        page.get_by_role("button", name="さいしょにもどる").click()

        # 3. Verify history is saved
        print("Verifying history screen...")
        page.wait_for_selector("text=さんすう")
        page.get_by_role("button", name="履歴を見る").click()

        expect(page.locator("text=これまでのせいせき")).to_be_visible()
        history_entry = page.locator(".bg-white.p-3").first
        expect(history_entry.locator("text=たしざん・ひきざん")).to_be_visible()
        expect(history_entry.locator("text=100")).to_be_visible()
        print("History screen verified.")

        # 4. Verify history can be cleared
        print("Verifying history clearing...")
        page.get_by_role("button", name="履歴をすべて消す").click()

        # Handle the confirmation modal text with <br />
        expect(page.get_by_text("ほんとうに すべてのきろくを けしますか？")).to_be_visible()
        page.get_by_role("button", name="けす").click()

        expect(page.locator("text=まだデータがありません")).to_be_visible()
        print("History clearing verified.")

        browser.close()
        print("E2E test completed successfully!")


if __name__ == "__main__":
    verify_full_quiz_flow()
