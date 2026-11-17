# weaselwonder.com (Zombuild)

- `public/` is the website: `index.html` is the home page, `tutorial/` is the playable tutorial and free play.
- `src/worker.js` is the server: it serves `public/`, relays the live game (Durable Object `Room`) and keeps `/weasel` and `/play` on the r6 live game until the new live version ships.
- Pushing to `main` deploys automatically (Cloudflare Workers Builds). Every deploy is a commit, so roll back by reverting.
- Secrets are set in the Cloudflare dashboard only.

## Releases
- r7 (2026-11-17): new Zombuild home page (offline mode launches the tutorial), tutorial stages 1 to 13 plus free play (Easy, Medium, Hard).
