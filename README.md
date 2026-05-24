# AI-Powered Automated Testing System

This project implements the assignment as a React hotel booking website, a FastAPI backend, and a Python Playwright automation tool that reads Excel test cases, takes screenshots, verifies results, updates Excel, and creates a Word report.

## Project Structure

- `frontend/` - React + Vite hotel booking website
- `backend/` - FastAPI room and booking API
- `automation/` - Excel generator, Playwright runner, AI vision verifier, report generator
- `docs/` - bug-fix notes and approach diagram
- `screenshots/` - generated PNG screenshots

## Run Locally

Terminal 1:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Run Automation

Start the backend and frontend first, then run:

```bash
pip install -r automation/requirements.txt
playwright install chromium
python automation/generate_test_cases.py
python automation/run_tests.py
```

Outputs:

- `test_cases.xlsx`
- `test_results.xlsx`
- `test_report.docx`
- `screenshots/*.png`

The verifier uses local deterministic checks by default. To use screenshot-based AI vision, create `.env` from `.env.example` and set OpenRouter:

```bash
copy .env.example .env
```

```bash
set OPENROUTER_API_KEY=your_key_here
set OPENROUTER_MODEL=openai/gpt-4o-mini
```

You can also put these values in `automation/.env`; the verifier loads both locations. If your assignment requires every screenshot to be verified by AI, set:

```bash
set AI_VERIFICATION_REQUIRED=true
```

With `AI_VERIFICATION_REQUIRED=true`, an OpenRouter connection or quota error marks the verification as failed instead of silently using the local fallback. The verifier retries transient network resets before failing.

The automation preflight checks that the frontend and backend are running before it starts the browser tests.
## Docker

```bash
docker compose up --build
```

The website runs at `http://localhost:5173` and the API runs at `http://localhost:8000`.

## Test Coverage

The Excel file contains 15 required test cases:

- Happy path: valid booking, search rooms, room details, my bookings
- Validation: first name, last name, email, phone, dates, guests, card, expiry, CVV

## Understanding Questions

1. Test cases were selected from the booking flow and every validation rule in the assignment, so coverage includes both successful user journeys and expected failures.
2. AI vision is useful for visible UI verification, but it is not perfect. This project combines DOM assertions with AI verification so the final status is more reliable.
3. Slow dynamic content is handled with Playwright load-state waits, visible-element waits, and a short stability pause before screenshots.
4. For 1000 tests, run browser contexts in controlled parallel batches, keep Excel writes in one locked queue, and shard reports by worker before merging.
5. Flaky tests usually come from timing, unstable selectors, shared state, network delays, or parallel writes. This project uses role/label selectors, explicit waits, isolated pages, and atomic file updates.



