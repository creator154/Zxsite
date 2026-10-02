# Yakeen Batch Site — Heroku

This is the frontend-only Next.js site.

## Heroku deploy
Create a Heroku app, connect this repository, and deploy the `main` branch.

Heroku will use:
- `Procfile`
- Node.js 20 (`runtime.txt`)
- `npm run build` during build
- `npm start` to serve the site

Later set:
`NEXT_PUBLIC_API_URL=https://YOUR-BACKEND.herokuapp.com`

The login page is currently a UI placeholder. JWT/backend will be connected in the backend phase.
