# e2e-conduit-automation

Playwright end-to-end automation project for the RealWorld **Conduit** app, designed as a portfolio repo to demonstrate practical test automation skills:
- **UI smoke tests**
- **API and UI** flows (create data via API, validate via UI)
- **Docker Compose** environment (web + API + DB)
- **GitHub Actions CI** with uploaded artifacts (HTML report, traces/videos/screenshots)

---

## What this repo demonstrates

- ✅ Stable locators (role-based selectors, strict mode friendly)
- ✅ Deterministic tests (avoid flaky feed assertions by navigating via resource URLs)
- ✅ Test data setup via API (faster + less UI coupling)
- ✅ Reproducible environment with Docker Compose
- ✅ CI pipeline that runs tests and publishes artifacts for debugging

---

## System under test

Local Conduit stack (submodule):
- Web: `http://localhost:8080`
- API: `http://localhost:3000/api`

---

## Quick Start

### 1) Install dependencies

- npm install

### 2) Start the local Conduit env

- npm run env:up

### 3) Run tests

- npm test

### 4) Stop env

- npm run env:up


## Reports and artifacts

### Local HTML report:

- npx playwright show-report


### Traces (on failure)

- npx playwright show-trace test-results/**/trace.zip


### CI uploads

- playwright-report

- test-results (screenshots/videos/traces)


## Project Structure

- tests/ - Playwright test specs

- playwright.config.ts - test configuration (baseURL, reporters, timeouts)

- infra/conduit-local/ - Conduit local stack (Docker Compose) as a submodule

- .github/workflows/ci.yml - GitHub Actions pipeline
