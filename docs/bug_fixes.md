# Bug Fix Documentation

## Bug 1: Screenshot Timing

Problem: screenshots were being taken before the UI finished loading. This can happen after clicks, route changes, delayed validation messages, dynamic content rendering, or animations.

Implemented fix in `automation/run_tests.py`:

- Wait for `domcontentloaded` before screenshot capture.
- Wait for `networkidle` so API-driven UI updates finish.
- Wait until the document body is attached.
- Add a short stability pause before capture.
- If a test already failed, still capture the current browser state instead of crashing the report step.
- Use Playwright role/text assertions before screenshots to confirm the page reached the expected state.

This makes screenshots reliable for both passing tests and failed-test evidence.

## Bug 2: AI Vision Prompt

Problem: open-ended AI prompts can return long answers, hallucinated UI details, missing confidence values, or inconsistent pass/fail formats.

Implemented fix in `automation/ai_verifier.py`:

- The verifier asks for compact JSON only.
- The required schema is `status`, `confidence`, and `observation`.
- The prompt tells the model to use only visible screenshot evidence.
- PASS and FAIL examples are included in the prompt.
- OpenRouter is supported through `OPENROUTER_API_KEY` in `.env`.
- The parser strips markdown fences and validates the returned status/confidence.
- If OpenRouter quota or API errors occur, the tool falls back to local deterministic verification so the report can still be generated.

## Bug 3: Excel Update Concurrency

Problem: parallel or repeated test runs can corrupt Excel if multiple writes happen at once, if Excel locks the file, or if the process crashes during save.

Implemented fix in `automation/run_tests.py`:

- `ResultWriter` uses `threading.Lock()` so only one thread writes results at a time.
- Each update opens the latest workbook state.
- Results are first saved to a temporary `.tmp.xlsx` file.
- The temporary file then replaces the final `test_results.xlsx` atomically.

This prevents overwrites and reduces risk of partial/corrupted Excel output.

## Flaky Test Prevention

The test runner also includes:

- Server preflight checks for frontend and backend before tests begin.
- Stable selectors using labels, roles, and visible text.
- Isolated browser pages per test case.
- Full-page screenshots for report evidence.

