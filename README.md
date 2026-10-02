# Zxsite — Detailed Student Site UI

Heroku-ready dependency-free Node.js student exam-test website, built from the supplied Quizard-style screenshots.

## What is included
- Mobile-first green hero header with Zxsite branding
- Search bar + notification-style hamburger menu
- Slide-out menu: Test Series, DPP's, Login, Sign Up
- Exam category cards with expandable batch lists
- Batch search results
- Batch detail page with test-series cards
- Instructions page
- Demo test-taking page
- Floating Join us + Telegram controls
- Responsive desktop/mobile styling
- Sample API endpoints ready for a future shared backend/uploader panel
- Reference screenshots in `docs/reference/`

## Run locally
```bash
npm start
```
Then open `http://localhost:3000`.

## Heroku
This repo contains a `Procfile` and uses `process.env.PORT`.

## API
- `GET /api/batches`
- `GET /api/batches?q=jee`
- `GET /api/batches/:id/tests`
- `GET /api/tests/:id`

The data is demo data. Connect the separate uploader/admin app to the same backend/database later.

## Detailed UI
See `docs/UI-SCREENS.md` for the complete screen-by-screen UI map.
