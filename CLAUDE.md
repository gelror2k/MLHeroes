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
| Hosting | Freehostia (shared) | Domain `gelror.duckdns.org`, web root `/www/gelror.duckdns.org/` |
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
├── backend/                     # Mirrors /www/gelror.duckdns.org/ on the server
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

Expo's own `AGENTS.md` (SDK 57 guidance) lives at `mobile/AGENTS.md` and is imported here so it applies whenever working inside `mobile/`:

@mobile/AGENTS.md

## Commands

```bash
# App
cd mobile && npx expo start          # dev server, scan QR with Expo Go
npx expo install <package>           # ALWAYS this, never plain npm install, for Expo packages
npx tsc --noEmit                     # type check
npx eas build -p android --profile preview   # APK

# Backend has no build step. Drag backend/api, backend/includes, backend/config into
# /www/gelror.duckdns.org/ in Freehostia's File Manager (or FTP).
# Verify with: http://gelror.duckdns.org/api/health.php  -> {"database":"connected", ...}
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

- **The API is `http://` only.** The DuckDNS domain has no SSL certificate (paid add-on on the free plan). Browsers, curl and Postman don't care. Android release builds block cleartext HTTP (API 28+) — symptom: "Network request failed" with no detail — so an EAS APK needs `usesCleartextTraffic` set in `app.json`. Whether Expo Go accepts `http://` is unverified; test it on the phone before assuming either way.
- **`localhost` on a phone means the phone.** For local testing use the PC's LAN IP, e.g. `http://192.168.1.x/api`.
- **DuckDNS works here only because `gelror.duckdns.org` is registered as a Hosted Domain in the Freehostia panel.** Shared hosts route by `Host` header, so the DuckDNS A record alone is not enough — the panel entry is what makes it resolve to `/www/gelror.duckdns.org/`. Don't move the domain elsewhere without re-registering it there.
- **Free host limits.** Small storage, throttling, possible suspension. Keep a phpMyAdmin export in `database/` so the DB can be rebuilt.
- When debugging a failing request, reproduce it in Postman first. That separates API bugs from app bugs.

## Scope

**In:** hero list, role/lane/difficulty filters, name search, hero detail, device-local favorites.

**Out for now** — each needs a new table first, so flag the table before implementing:
item builds (`items`, `builds`, `build_items`), counters (`hero_counters`), user accounts (`users`, `favorites`), tier lists.

## Current status

- Database and table: created. **Table is empty (0 rows)** — data entry through phpMyAdmin is the current blocker. No `.sql` export in `database/` yet.
- `backend/` PHP files: **live on Freehostia** at `http://gelror.duckdns.org/api/` (PHP 7.4.33, MySQL 8.4). Verified 2026-09-19: `health.php` reports `database: connected`; `filters.php` / `heroes.php` return correct empty envelopes; `hero.php` returns 404 for a missing id and 400 for a non-numeric one.
- The server web root also holds older files not in this repo: `.htaccess`, `auth.php`, `connection.php`, `mobile_legends_heroes.php`, `student.php`. `student.php` and `connection.php` belong to the unrelated students project — leave them alone. The `.htaccess` rewrites only touch `mobile_legends_heroes*` URLs and don't affect `api/`.
- Postman collection: not started
- Expo project: scaffolded at `mobile/` (SDK 57). `axios`, `@react-native-async-storage/async-storage` and `expo-image` are installed. `mobile/.env` exists (git-ignored) with `EXPO_PUBLIC_API_URL=http://gelror.duckdns.org/api`. Template placeholder screens still in place.

Next: enter hero rows in phpMyAdmin, export them to `database/mobile_legends_heroes.sql`, then replace the template screens with the `(tabs)/` layout.
