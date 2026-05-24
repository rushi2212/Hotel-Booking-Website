# Project Explanation Script and Understanding Answers

## Demo Video Script

Hello, my name is Rushi, and this is my AI-Powered Automated Testing System project.

In this project, I built a hotel booking website and an automated testing tool that reads test cases from Excel, runs those tests in a browser, captures screenshots, verifies the result using AI vision, updates Excel with pass/fail results, and generates a Word report with screenshots.

## Technology Stack

For the frontend, I used React with Vite. The frontend contains the hotel booking user interface, including the home page, search page, room details page, booking form, confirmation page, and my bookings page.

For the backend, I used FastAPI in Python. The backend provides APIs for rooms and bookings. I made the backend modular by separating the code into routers, services, models, and data files.

For automation, I used Python with Playwright. Playwright opens the website in a browser, performs user actions, validates the UI, and takes screenshots.

For Excel and Word report generation, I used openpyxl and python-docx. openpyxl reads and updates Excel test case files, and python-docx creates the final test report.

For AI verification, I used OpenRouter. The API key is loaded from the `.env` file using the name `OPENROUTER_API_KEY`. Screenshots are sent to OpenRouter with a structured prompt, and the AI returns a JSON result containing status, confidence, and observation.

## Website Workflow

The website starts on the home page. The user can search for rooms by city, check-in date, check-out date, and number of guests.

After searching, the user is taken to the search results page. This page displays available rooms with their city, rating, price, image, and a View Details button.

When the user clicks View Details, the room details page opens. This page shows the room description, amenities, price, and a Book Now button.

After clicking Book Now, the booking form opens. The booking form collects first name, last name, email, phone, check-in date, check-out date, number of guests, special requests, card number, expiry date, and CVV.

The form includes validation rules. For example, first name and last name are required, email must be valid, phone must be exactly 10 digits, check-out must be after check-in, guests must be between 1 and 10, card number must be 16 digits, expiry date must not be expired, and CVV must be 3 digits.

When the form is valid, the booking is submitted to the FastAPI backend. The backend creates a booking reference number and stores the booking in a JSON file. The user is then shown the confirmation page with the booking reference number.

The My Bookings page displays all saved bookings from the backend.

## Backend Code Structure

The backend is modular:

- `backend/main.py` creates the FastAPI app, configures CORS, and registers routers.
- `backend/models.py` contains the Pydantic request models and validation rules.
- `backend/rooms_data.py` stores the available room catalog.
- `backend/services/room_service.py` contains room search and room detail logic.
- `backend/services/booking_store.py` handles reading and writing bookings to JSON.
- `backend/routers/rooms.py` defines room API endpoints.
- `backend/routers/bookings.py` defines booking API endpoints.
- `backend/routers/health.py` defines the health check endpoint.

This structure keeps the code clean because routes, validation, business logic, and storage are separated.

## Automation Tool Workflow

The main automation file is `automation/run_tests.py`.

First, the script checks that the frontend and backend are running. This is done using a preflight check so tests do not start if the website is unavailable.

Next, it reads test cases from `test_cases.xlsx`. Each test case contains a test ID, test name, category, steps, expected result, status, and AI observation.

The script then opens Chromium using Playwright. For each test case, it creates a new browser page, runs the mapped test function, captures a screenshot, sends the screenshot to the AI verifier, updates Excel, and stores data for the Word report.

The test functions cover happy path flows and validation scenarios. For example, TC-001 completes a full valid booking, TC-002 searches for rooms, TC-003 views room details, and TC-004 checks My Bookings. Other tests verify form validation errors.

After each test, the script calls `stable_screenshot`. This function waits for the page to load, waits for network activity to settle, waits for the page body to exist, adds a short stability delay, and then takes a screenshot. If the test already failed, it still captures the current browser state so the report has evidence.

The AI verifier is in `automation/ai_verifier.py`. It sends the screenshot and a structured prompt to OpenRouter. The prompt asks the AI to return only JSON with three fields: status, confidence, and observation. If the OpenRouter request fails, the tool falls back to local verification so the report can still be generated.

The Excel update is handled by `ResultWriter`. It uses a thread lock so only one write happens at a time. It also writes to a temporary file first and then replaces the final Excel file. This prevents corruption if multiple tests write results or if a crash happens during saving.

Finally, `run_tests.py` generates `test_results.xlsx`, `test_report.docx`, and screenshots in the `screenshots` folder.

## Note About OpenRouter Connection Errors

If the report shows something like:

`Local verifier (OpenRouter error: connection was forcibly closed by the remote host)`

that means the website test itself passed, but the external AI API connection failed. The script handles this safely by falling back to the local Playwright result. This prevents the whole automation run from failing because of a temporary API or network issue.

## Understanding Questions

### 1. How did you decide what test cases to include?

I selected test cases based on the main user journey and the validation rules given in the assignment. First, I covered happy path scenarios such as searching rooms, viewing room details, completing a valid booking, and checking My Bookings. Then I added negative validation tests for each important booking form rule, including empty name fields, invalid email, invalid phone, wrong dates, invalid guest count, invalid card number, expired card date, and invalid CVV.

This gives balanced coverage because it tests both successful user behavior and expected error handling.

### 2. How accurate is AI at verifying test results?

AI vision is useful for checking visible UI results, such as whether a confirmation page is displayed or whether an error message appears. However, it is not 100 percent reliable. AI can sometimes misread screenshots, miss small text, or hallucinate details that are not visible.

To improve accuracy, I used Playwright DOM assertions first and AI vision as an additional verification layer. The AI prompt is structured and asks for JSON only, with a confidence score and a short observation. If the AI API fails, the system falls back to the deterministic Playwright result.

### 3. How do you handle dynamic content that loads slowly?

I handle slow dynamic content by using explicit waits instead of taking screenshots immediately. The script waits for DOM content to load, waits for network activity to become idle, waits for the page body to be attached, and waits for specific UI elements using Playwright assertions.

For example, after submitting a booking, the test waits for the Booking Confirmed heading before marking the flow successful. This reduces timing issues and makes screenshots more reliable.

### 4. How would you run 1000 tests efficiently?

To run 1000 tests efficiently, I would use parallel execution with controlled worker groups. Each worker would run a separate browser context so tests are isolated. I would avoid sharing browser state unless required.

For reporting, I would not allow every worker to write directly to the same Excel file at the same time. Instead, I would use a result queue or write separate worker result files and merge them at the end. I would also group tests by feature, run smoke tests first, retry only known flaky failures once, and use CI/CD to run the suite automatically.

### 5. What makes tests flaky and how do you fix it?

Tests become flaky when they depend on timing, unstable selectors, shared state, slow network calls, animations, or external services. For example, a test may fail if it clicks a button before the page is ready or if it checks for text before the API response has rendered.

I fix flaky tests by using stable selectors like labels and roles, explicit waits for visible elements, isolated browser pages, deterministic test data, and proper cleanup. I also avoid fixed sleeps except for a small stability pause before screenshots. For external AI failures, I use fallback verification so temporary API issues do not break the whole run.

## Bug Fixes

### Screenshot Timing Fix

The screenshot timing issue is handled in `stable_screenshot` inside `automation/run_tests.py`.

The fix includes:

- Waiting for `domcontentloaded`.
- Waiting for `networkidle`.
- Waiting for the page body to be attached.
- Adding a short stability pause before screenshot capture.
- Capturing screenshots even when the test has already failed, so the report still contains evidence.

This prevents screenshots from being taken too early while pages, validation messages, or dynamic content are still loading.

### AI Prompt Fix

The AI prompt issue is handled in `automation/ai_verifier.py`.

The fix includes:

- A structured prompt with clear rules.
- PASS and FAIL examples.
- A strict JSON output format.
- Required fields: `status`, `confidence`, and `observation`.
- Instructions to use only visible screenshot evidence.
- JSON parsing and cleanup for markdown fenced responses.

This reduces hallucination and makes AI responses easier to process automatically.

### Excel Concurrency Fix

The Excel concurrency issue is handled by the `ResultWriter` class in `automation/run_tests.py`.

The fix includes:

- A `threading.Lock()` to prevent simultaneous writes.
- Opening the latest Excel file state before each update.
- Writing results to a temporary file first.
- Atomically replacing the final result file after saving.

This prevents result overwrites, partial writes, and Excel corruption during automation runs.

## Deliverables Summary

The project includes:

- Hotel booking website using React.
- FastAPI backend.
- Modular backend structure.
- Excel-based test cases.
- Playwright automation script.
- Screenshot capture for each test.
- OpenRouter-based AI vision verifier.
- Excel result update.
- Word report generation.
- Docker Compose setup.
- Bug fix documentation.
