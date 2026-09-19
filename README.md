# MLHeroes

Mobile Legends: Bang Bang hero reference app.
Expo + React Native front end, plain PHP + MySQL REST API on the back.

## Folder layout

```
MLHeroes/
├── mobile/        # Expo app (TypeScript, Expo Router)
│   ├── src/app/          screens — (tabs)/index, favorites, about; hero/[id]
│   ├── src/components/   hero-card, filter-bar, search-input, state-views, …
│   ├── src/services/     heroService (API calls), storage (AsyncStorage)
│   ├── src/constants/    theme, role colours
│   └── src/hooks/        use-heroes, use-filters, use-favorites, …
├── backend/       # PHP API — mirrors /www/gelror.duckdns.org/ on the host
│   ├── api/       #   heroes.php, hero.php, filters.php
│   ├── config/    #   config.sample.php (committed) · database.php (local only, ignored)
│   └── includes/  #   helpers.php — CORS, JSON envelope, row formatting
├── database/      # phpMyAdmin exports (.sql) and upgrade.sql
└── docs/          # Project plan, ERD, screenshots
    └── postman/   #   Exported Postman collection + environments
```

## Where things go

| I want to…                         | Put it in                      |
|------------------------------------|--------------------------------|
| Add or edit an API endpoint        | `backend/api/`                 |
| Set real DB credentials            | `backend/config/database.php` (copy from `config.sample.php`) |
| Export the table from phpMyAdmin   | `database/mobile_legends_heroes.sql` |
| Save the Postman collection        | `docs/postman/`                |
| Add a screen                       | `mobile/src/app/`              |
| Add a component / hook / service   | `mobile/src/components/`, `mobile/src/hooks/`, `mobile/src/services/` |

## What stays out of Git

`backend/config/database.php`, `.env`, `node_modules/`, `.expo/`, `android/`, `ios/`, `*.log` — all handled by `.gitignore`.

## Quick start

### Backend

Set `DB_PASS` in `backend/config/database.php` (copy `config.sample.php` if it doesn't exist; on Freehostia `DB_HOST` is `localhost`). Drag the `api/`, `includes/` and `config/` folders from `backend/` into `/www/gelror.duckdns.org/` in Freehostia's File Manager, then open `http://gelror.duckdns.org/api/health.php` — it should return `"database":"connected"`.

### Mobile app (Expo)

1. Install dependencies

   ```bash
   cd mobile
   npm install
   ```

2. Point the app at the API — create `mobile/.env` (git-ignored):

   ```
   EXPO_PUBLIC_API_URL=http://gelror.duckdns.org/api
   ```

3. Start the dev server

   ```bash
   npx expo start
   ```

   The terminal then offers ways to open the app:

   - [Expo Go](https://expo.dev/go) — scan the QR code with your phone (easiest)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/) (macOS only)
   - [Development build](https://docs.expo.dev/develop/development-builds/introduction/) — needed once native modules go beyond what Expo Go ships

Screens live in `mobile/src/app/` and use [file-based routing](https://docs.expo.dev/router/introduction) (Expo Router). Only screens and layouts go in `src/app/`; everything else lives in `src/components/`, `src/hooks/`, `src/services/`, etc.

Other scripts (run from `mobile/`):

| Command | What it does |
|---------|--------------|
| `npx expo start --android` / `--ios` / `--web` | Start straight into one platform |
| `npx expo lint` | ESLint — see [Using ESLint and Prettier](https://docs.expo.dev/guides/using-eslint/) |
| `npx tsc --noEmit` | Type check — see [Using TypeScript](https://docs.expo.dev/guides/typescript/) |
| `npm run reset-project` | **Careful:** moves the whole `src/` and `scripts/` to `example/` and leaves a blank `src/app/`. It wipes `src/constants/`, `src/hooks/`, etc. — not just the template screens. |
| `npx expo install <package>` | Always this, never plain `npm install <package>`, for Expo-managed packages |

Unit testing isn't set up; if you add it, follow [Unit Testing with Jest](https://docs.expo.dev/develop/unit-testing/).

### Expo resources

- [Expo documentation](https://docs.expo.dev/) and [guides](https://docs.expo.dev/guides)
- [SDK 57 versioned docs](https://docs.expo.dev/versions/v57.0.0/) — the version this project is pinned to
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/)
- [Expo on GitHub](https://github.com/expo/expo) · [Discord community](https://chat.expo.dev)

Full plan, phases and API contract: [docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md)

---
Mobile Legends: Bang Bang and all hero names/artwork are © Moonton. Educational project.
