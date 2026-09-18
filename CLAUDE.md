# CLAUDE.md

Project instructions for AI assistants working in this repository.

## Project

Mobile Legends: Bang Bang hero reference app. Expo + React Native front end, plain PHP REST API, MySQL database on free shared hosting. Users browse heroes, filter by role/lane/difficulty, search by name, open a detail screen, and save favorites locally.

Solo student project. Prefer the simplest thing that works over the most correct architecture.

## Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| App | Expo SDK 57 + React Native 0.86 + TypeScript | Expo Router for navigation |
| HTTP | Axios | Base URL from `process.env.EXPO_PUBLIC_API_URL` |
| Local storage | AsyncStorage | Favorites and response caching |
| Backend | PHP 7+ with PDO | No framework, no Composer |
| Database | MySQL 8, `gabcas7_gelodb` | Managed through phpMyAdmin |
| Hosting | Freehostia (shared) | FTP upload to `public_html/` |
| API testing | Postman | Collection in `docs/postman/` |

## Repository layout

```
MLHeroes/
├── mobile/                      # Expo project (scaffolded, SDK 57)
│   ├── app.json
│   ├── tsconfig.json            # "@/*" -> "./src/*"
│   └── src/
│       ├── app/                 # Expo Router screens (file-based routing)
│       │   ├── _layout.tsx
│       │   ├── (tabs)/
│       │   │   ├── _layout.tsx
│       │   │   ├── index.tsx    # Hero list + filters + search
│       │   │   ├── favorites.tsx
│       │   │   └── about.tsx
│       │   └── hero/[id].tsx    # Hero detail
│       ├── api/client.ts        # Axios instance
│       ├── services/heroService.ts
│       ├── types/hero.ts
│       ├── hooks/               # useHeroes, useFavorites
│       ├── components/
│       └── constants/           # theme.ts, roleColors.ts
├── backend/                     # Mirrors public_html/ on the server
│   ├── api/                     # heroes.php, hero.php, filters.php
│   ├── config/                  # config.sample.php ONLY in Git
│   └── includes/helpers.php
├── database/
│   ├── mobile_legends_heroes.sql
│   └── upgrade.sql
└── docs/
    ├── PROJECT_PLAN.md
    └── postman/
```

Routes live under `mobile/src/app/`, not `mobile/app/` — that is where the Expo template put them. The scaffold currently has placeholder `index.tsx` / `explore.tsx` and a `components/app-tabs.tsx`; replace them with the `(tabs)/` layout above rather than building alongside them.

`mobile/CLAUDE.md` imports Expo's own `AGENTS.md` (SDK 57 guidance). It applies inside `mobile/` in addition to this file.

## Commands

```bash
# App
cd mobile && npx expo start          # dev server, scan QR with Expo Go
npx expo install <package>           # ALWAYS this, never plain npm install, for Expo packages
npx tsc --noEmit                     # type check
npx eas build -p android --profile preview   # APK

# Backend has no build step. Upload backend/ contents to public_html/ via FTP.
# Verify with: https://<host>/api/filters.php  -> should return JSON
```

## Database

Single table. Do not invent columns that aren't listed here.

```sql
mobile_legends_heroes
  hero_id     INT AUTO_INCREMENT PRIMARY KEY
  name        VARCHAR(255) NOT NULL
  role        VARCHAR(255) NOT NULL   -- "Mage" or "Mage/Tank"
  lane        VARCHAR(255) NOT NULL   -- "Mid" or "Gold/EXP"
  difficulty  VARCHAR(255) NOT NULL   -- "Easy" | "Medium" | "Hard"
  picture     VARCHAR(1000) NOT NULL  -- full https:// image URL
```

Optional, may not exist yet — code must tolerate its absence:

```sql
hero_skills
  skill_id, hero_id (FK), slot ENUM('passive','skill1','skill2','ultimate'),
  name, description, cooldown, mana_cost, icon_url
```

The same database contains a `students` table from an unrelated project. **Never query, alter, or reference it.**

### Data conventions
- Multiple roles/lanes are separated by `/`. The API splits on `/`, `,` and `|`.
- `difficulty` is one of exactly `Easy`, `Medium`, `Hard`.
- `picture` holds a URL. Never store image binaries in the database or on the host.

## API contract

Base: `https://<host>/api/`

Every response uses this envelope. Do not deviate:

```json
{ "success": true, "message": "OK", "data": [], "meta": { "page": 1, "per_page": 20, "total": 42, "total_pages": 3 } }
```

Errors: `success: false`, plain-language `message`, `data: null`, correct HTTP status (400 / 404 / 405 / 500).

| Endpoint | Params | Returns |
|----------|--------|---------|
| `GET /api/heroes.php` | `search`, `role`, `lane`, `page`, `per_page` (max 50) | Hero array + `meta` |
| `GET /api/hero.php` | `id` (required, digits only) | One hero + `skills[]` |
| `GET /api/filters.php` | — | `{ roles[], lanes[], difficulties[] }` distinct from the table |
| `GET /api/health.php` | — | `{ database, table, heroes, php }` — connection check, open this first after upload |

Hero objects include both the raw column and a pre-split array, so the client never parses strings:

```ts
{ hero_id: number; name: string; role: string; roles: string[];
  lane: string; lanes: string[]; difficulty: string; picture: string; skills?: Skill[] }
```

`filters.php` is the source of truth for filter chips. Never hardcode role or lane lists in the app.

## PHP rules

- **Always** PDO with prepared statements. Never concatenate user input into SQL. `LIMIT`/`OFFSET` may be interpolated only after `(int)` casting.
- Validate `id` with `ctype_digit` before use.
- `require_once includes/helpers.php` first in every endpoint — it sets JSON and CORS headers and answers the `OPTIONS` preflight.
- Return through `json_success()` / `json_error()`. Never `echo` raw JSON.
- Catch `PDOException`, log with `error_log()`, return a generic message. Never expose SQL, file paths, or credentials to the client.
- Cap `per_page` at 50.
- Target plain PHP 7 syntax — `array()` over `[]` is already used, no arrow functions, no typed properties. The host's PHP version is unconfirmed.
- No Composer, no Laravel, no autoloaders. Shared hosting blocks shell access.

## TypeScript / React Native rules

- Strict typing. Every API call returns `ApiResponse<T>`; no `any`.
- `FlatList` for the hero list, never `ScrollView` + `.map()`.
- Every screen handles three states: loading, error with retry, empty.
- `expo-image` for portraits, with an onError fallback — `picture` URLs are external and may be dead or hotlink-blocked.
- Colour-code roles from `constants/roleColors.ts`. One colour per role, used consistently.
- Keep API calls in `src/services/`, not inside components.

## Hard rules

1. **Never commit `backend/config/database.php`, `mobile/.env`, or any real credential.** Only `config.sample.php` goes in Git. If you find a credential in a tracked file, stop and say so.
2. **Never add columns or tables to the plan without saying so explicitly.** The schema above is what exists.
3. **Do not touch the `students` table.**
4. Do not introduce a framework, ORM, or build step on the backend.
5. Do not add server-side auth, users, or login. Favorites are device-local via AsyncStorage. This is a deliberate scope decision.
6. Do not reproduce Moonton's skill descriptions verbatim. Write original summaries.

## Known constraints

- **Android blocks cleartext HTTP** (API 28+). Symptom: "Network request failed" with no detail. Fix by serving the API over HTTPS. `usesCleartextTraffic` in `app.json` is a fallback and does **not** work inside Expo Go.
- **`localhost` on a phone means the phone.** For local testing use the PC's LAN IP, e.g. `http://192.168.1.x/api`.
- **DuckDNS cannot reliably point at shared hosting.** It sets an A record to an IP; shared hosts route by `Host` header. Use the host's own subdomain unless the backend is self-hosted.
- **Free host limits.** Small storage, throttling, possible suspension. Keep a phpMyAdmin export in `database/` so the DB can be rebuilt.
- When debugging a failing request, reproduce it in Postman first. That separates API bugs from app bugs.

## Scope

**In:** hero list, role/lane/difficulty filters, name search, hero detail, device-local favorites.

**Out for now** — each needs a new table first, so flag the table before implementing:
item builds (`items`, `builds`, `build_items`), counters (`hero_counters`), user accounts (`users`, `favorites`), tier lists.

## Current status

- Database and table: created, data entry in progress
- `backend/` PHP files: written in `backend/` (helpers + health, filters, heroes, hero). Lint-clean and error paths smoke-tested on PHP 8.5 locally. **Not yet tested against a real MySQL** — this PC has no `pdo_mysql`, so the first live test is on Freehostia.
- Postman collection: not started
- Expo project: scaffolded at `mobile/` (SDK 57). `expo-image` is installed; `axios` and `@react-native-async-storage/async-storage` are not yet. Template placeholder screens still in place.

Next: set the real password in `backend/config/database.php` (exists, git-ignored), upload `backend/` contents to `public_html/`, open `/api/health.php` and confirm `"database":"connected"`.
