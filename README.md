# Gamopedia frontend

Gamopedia is a video game reference site powered by the IGDB API. Next.js serves the UI and the server-side API handlers that communicate with IGDB. The older Express service remains in the repository but is not used by this frontend.

## Requirements

- Node.js 22.13 or newer (or 24 or newer)
- Yarn 1.22+
- A Twitch developer app with an IGDB API client ID and client secret

## Run locally

Install dependencies and start Next.js:

```sh
yarn install
yarn dev
```

Create `frontend/.env.local` with the credentials from your Twitch developer app:

```env
IGDB_CLIENT_ID=your_twitch_client_id
IGDB_CLIENT_SECRET=your_twitch_client_secret
```

Open <http://localhost:3000>. Both values are read only by Next.js server code. Do not prefix them with `NEXT_PUBLIC_`. Restart Next.js after changing `.env.local`.

IGDB setup instructions: <https://api-docs.igdb.com/#getting-started>

## Commands

```sh
yarn dev    # Local development
yarn build  # Production build
yarn start  # Serve the production build
yarn lint   # ESLint checks
```

The deployment process must run `yarn build` before `yarn start`. The provided `Procfile` starts the production server.

## Structure

- `src/app/` contains the home page, game route, and same-origin API handlers.
- `src/lib/igdb.js` handles IGDB authentication, requests, caching, and data normalization.
- `src/components/` contains the search, game detail, screenshot viewer, and footer UI.
- `src/styles.css` and `DESIGN.md` define the visual system.
