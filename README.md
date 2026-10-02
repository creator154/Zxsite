# Zxsite

A lightweight, Heroku-ready exam preparation website inspired by the supplied Quizard reference screenshots.

## Structure

- `index.html` — page shell and header/menu
- `styles.css` — complete responsive UI
- `app.js` — categories, search, batches, tests, instructions and demo test flow
- `server.js` — small Node HTTP server + JSON API
- `Procfile` — Heroku start command

## Run

```bash
npm start
```

Open `http://localhost:3000`.

The test data is demo data. Connect the uploader/backend API later for real batches, tests, DPPs and questions.
