# AGENTS.md

This document outlines the rules and guidelines for AI agents working on this repository.

## 1. Core Directives (Mandatory)

*   **Update Documentation**: For every feature change, addition, or architectural modification, you **MUST** update `doc/design.md`. This file acts as the source of truth for the project's design and logic.
*   **Write Tests**: You **MUST** write or update tests for your changes.
    *   Use **Vitest** for unit testing logic (in `tests/`).
    *   Use **Playwright (Python)** for end-to-end verification (refer to `verification/verify_quiz.py`).

## 2. Tech Stack & Conventions

*   **Frontend**: React (v19+), TypeScript, Vite.
*   **Styling**: Tailwind CSS (configured via CDN/script in `index.html` and `src/index.css`).
*   **Language**:
    *   **Code**: English (variable names, comments).
    *   **UI Text**: Japanese (Hiragana/Katakana preferred for lower grades).
    *   **Communication**: Japanese (when chatting with the user).

## 3. Workflow & Verification

1.  **Plan**: Analyze requirements and existing code.
2.  **Implement**: Write clean, functional code.
3.  **Test**:
    *   Run unit tests: `npm test`
    *   Run E2E verification:
        1.  Start server: `npm run dev &`
        2.  Run script: `python verification/verify_quiz.py`
4.  **Document**: Update `doc/design.md` with new features or logic changes.
5.  **Submit**: Ensure all tests pass before submitting.

## 4. Project Structure

*   `src/`: Source code.
*   `tests/`: Unit tests (Vitest).
*   `verification/`: E2E verification scripts (Playwright).
*   `doc/`: Documentation (`design.md`).
*   `static/`: Static assets (textbooks, etc.).

## 5. Specific Implementation Details

*   **State Management**: Use React local state or Context. Avoid complex external libraries unless necessary.
*   **Routing**: Custom state-based navigation (no `react-router` currently, mostly `screen` state).
*   **Storage**: `localStorage` is used for history and settings.
