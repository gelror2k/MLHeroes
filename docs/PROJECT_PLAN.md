# Mobile Legends Heroes App — Project Plan

**Project type:** Mobile application (Android / iOS) with a PHP + MySQL REST backend
**Topic:** Mobile Legends: Bang Bang hero reference
**Database:** `gabcas7_gelodb` → table `mobile_legends_heroes`
**Document version:** 2.0 — rewritten to match the live database

---

## 1. Project Overview

### 1.1 Goal
A mobile app that lets players browse Mobile Legends heroes, filter them by role, lane and difficulty, and open a detail screen for any hero. Data lives in an existing MySQL table and reaches the app through a plain PHP REST API.

### 1.2 Scope is set by the data you actually have
The table stores six fields per hero: `hero_id`, `name`, `role`, `lane`, `difficulty`, `picture`. Every MVP feature below is buildable from those six columns alone. Anything needing more (skills, builds, counters, items) requires new tables and is listed as an extension, not an MVP promise.

### 1.3 Core features (MVP)
| # | Feature | Columns used |
|---|---------|--------------|
| F1 | Hero list — scrollable grid with portrait, name, role | all |
| F2 | Filter by role | `role` |
| F3 | Filter by lane | `lane` |
| F4 | Filter/sort by difficulty | `difficulty` |
| F5 | Search by name | `name` |
| F6 | Hero detail screen | all |
| F7 | Favorites saved on the device (AsyncStorage) | `hero_id` |

Favorites are stored locally on purpose. Server-side favorites would need a `users` table, registration, login and token handling — a week of work for a feature nobody grades. Local favorites take an afternoon.

### 1.4 Extensions (each needs a new table first)
| Extension | New table required |
|-----------|-------------------|
| Skills (passive + 3 skills per hero) | `hero_skills` — SQL already drafted in `database/upgrade.sql` |
| Recommended item builds | `items`, `builds`, `build_items` |
| Counters (strong/weak against) | `hero_counters` |
| User accounts + synced favorites | `users`, `favorites` |

Do these in that order. Skills add the most value for the least work.

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Mobile App | Expo + React Native | Build the Android/iOS mobile application |
| Language | TypeScript | Main programming language |
| UI | React Native | Mobile interface/components |
| Navigation | Expo Router | Screen-to-screen navigation |
| API | REST API | Communication between app and backend |
| API Testing | Postman | Test API endpoints and requests |
| Backend | PHP (PDO, no framework) | Server-side API/business logic |
| Web Server/Hosting | Freehostia | Host the PHP API |
| Database | MySQL 8 (`gabcas7_gelodb`) | Store application data |
| Domain/DNS | DuckDNS | Domain name for the backend — see §5.1 |
| HTTP Client | Axios | Send API requests from Expo |
| Development Environment | VS Code | Code the application and backend |
| Version Control | Git/GitHub | Source-code management |

### 2.1 Supporting tools
| Tool | Why |
|------|-----|
| phpMyAdmin | Already in use — table creation, data entry, SQL |
| FileZilla or the host's file manager | Upload PHP files to `public_html/` |
| Expo Go | Test on a real phone with no APK build |
| AsyncStorage (`@react-native-async-storage/async-storage`) | Local favorites and response caching |
| expo-image | Hero portraits with proper caching |

No Composer, no Laravel. Free shared hosting usually blocks shell access, so the backend stays plain PHP with PDO.

---

## 3. Architecture

```
┌──────────────────────────────────┐
│  Expo + React Native (TypeScript)│
│  ─ Expo Router screens           │
│  ─ Axios client (EXPO_PUBLIC_... )│
│  ─ AsyncStorage: favorites, cache│
└────────────────┬─────────────────┘
                 │  HTTPS, JSON
                 ▼
┌──────────────────────────────────┐
│  PHP REST API (public_html/api/) │
│  ─ heroes.php   list + filters   │
│  ─ hero.php     one hero         │
│  ─ filters.php  distinct values  │
│  ─ PDO prepared statements       │
└────────────────┬─────────────────┘
                 │  SQL
                 ▼
┌──────────────────────────────────┐
│  MySQL — gabcas7_gelodb          │
│  └ mobile_legends_heroes         │
│  └ hero_skills   (optional)      │
│  └ students      (other project) │
└──────────────────────────────────┘
```

The `students` table belongs to a different project. The API never touches it — every query names `mobile_legends_heroes` explicitly.

---

## 4. Current Status

| Item | State |
|------|-------|
| Database + table created | Done |
| Hero rows entered | In progress |
| `config/database.php` | Written — needs real DB user/password filled in |
| `includes/helpers.php` | Written |
| `api/heroes.php` | Written — untested against live data |
| `api/hero.php` | Written — untested |
| `api/filters.php` | Written — untested |
| API uploaded to host | Not yet |
| Postman collection | Not yet |
| Expo project | Not yet |

**Immediate next step:** fill in the DB credentials, upload `backend/` to `public_html/`, and open `/api/filters.php` in a browser. JSON on screen means the whole backend chain works.

---

## 5. Decisions to Settle Before Going Further

### 5.1 DuckDNS probably will not work with Freehostia
DuckDNS points a subdomain at an **IP address**. Freehostia is shared hosting: one IP serves many sites, and the server picks which site to return by reading the `Host` header. Traffic arriving via a DuckDNS A record will not be matched to your account. DuckDNS also has no proper CNAME support, which is what shared hosting normally needs.

| Option | How it works | Trade-off |
|--------|-------------|-----------|
| **A. Use the host's own subdomain** (recommended) | API lives at `yoursite.freehostia.com/api/...`; drop DuckDNS | Simplest, nothing to configure |
| **B. Self-host and keep DuckDNS** | XAMPP on your PC, DuckDNS → your home IP, port-forward 80/443 | DuckDNS becomes genuinely useful, but your PC must stay on and many PH ISPs use CGNAT, which blocks port forwarding entirely. Test before committing. |
| **C. DuckDNS URL-forwarding** | Redirects to the Freehostia URL | Breaks POST bodies on redirect. Not suitable for an API. |

**Decision: _______________**

### 5.2 Android blocks plain HTTP
Android 9 (API 28) and above reject `http://` traffic by default. The symptom is a vague "Network request failed" with no other clue.

1. Best fix: serve the API over `https://`. Confirm whether your plan includes SSL on the subdomain. If not, hosts like InfinityFree or 000webhost provide free HTTPS and will save you a day of debugging.
2. Fallback, HTTP only: set `"android": { "usesCleartextTraffic": true }` in `app.json`. This needs a development build or EAS build — it has no effect inside Expo Go.

### 5.3 Free-tier limits to design around
- Storage is small. Keep storing image **URLs** in `picture`, never image files in the database or on the host.
- Free hosts throttle, sleep, and occasionally suspend accounts. Export the table from phpMyAdmin weekly and commit the `.sql` to Git so you can rebuild in minutes.
- Design every screen to survive a slow or failed request: show a retry button, not a blank page.

---

## 6. Database

### 6.1 Live table — `mobile_legends_heroes`
| # | Column | Type | Null | Notes |
|---|--------|------|------|-------|
| 1 | `hero_id` | INT, AUTO_INCREMENT, PRIMARY KEY | No | Used as the route param in `/hero/[id]` |
| 2 | `name` | VARCHAR(255) | No | Hero name, e.g. Layla |
| 3 | `role` | VARCHAR(255) | No | One or two roles, e.g. `Mage/Tank` |
| 4 | `lane` | VARCHAR(255) | No | One or more lanes, e.g. `Mid` |
| 5 | `difficulty` | VARCHAR(255) | No | Currently free text |
| 6 | `picture` | VARCHAR(1000) | No | Full image URL |

Collation `utf8mb4_0900_ai_ci`, so special characters in hero names are safe.

### 6.2 Data entry conventions — agree with yourself now
| Field | Convention | Example |
|-------|-----------|---------|
| `role` | Separate multiple roles with `/`, no spaces | `Fighter/Marksman` |
| `lane` | Same separator | `Gold/EXP` |
| `difficulty` | One of exactly three words | `Easy`, `Medium`, `Hard` |
| `picture` | Full `https://` URL | `https://.../layla.png` |

The API splits `role` and `lane` on `/`, `,` and `|`, so it tolerates either separator — but mixing them makes your own data hard to check by eye. Consistency matters more than which symbol you pick.

### 6.3 Recommended changes (`database/upgrade.sql`)
| Change | Why | Priority |
|--------|-----|----------|
| `UNIQUE KEY` on `name` | Nothing currently stops a hero being entered twice; you'd only notice as duplicates in the app | High |
| Standardise `difficulty` | VARCHAR sorts as text, so "10" comes before "9". Use the three words, or switch the column to TINYINT 1–10 | High |
| `INDEX` on `role`, `lane` | Keeps filters fast past ~50 rows | Medium |
| Shrink `role`/`lane` to VARCHAR(60) | 255 is far more than needed | Low |
| Create `hero_skills` | Needed for a real hero detail screen | Medium |

Export the table before running any `ALTER`.

### 6.4 Optional `hero_skills` table
```sql
CREATE TABLE hero_skills (
  skill_id    INT AUTO_INCREMENT PRIMARY KEY,
  hero_id     INT NOT NULL,
  slot        ENUM('passive','skill1','skill2','ultimate') NOT NULL,
  name        VARCHAR(80) NOT NULL,
  description TEXT,
  cooldown    VARCHAR(40),
  mana_cost   VARCHAR(40),
  icon_url    VARCHAR(500),
  UNIQUE KEY uniq_hero_slot (hero_id, slot),
  CONSTRAINT fk_skill_hero FOREIGN KEY (hero_id)
    REFERENCES mobile_legends_heroes(hero_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
`cooldown` and `mana_cost` are text because the real values scale per level (`12.0 / 11.5 / 11.0`). `hero.php` already reads this table if it exists and returns an empty `skills` array if it doesn't, so the app needs no changes either way.

### 6.5 Seeding strategy
Enter **20 heroes covering all six roles** and fill them in completely before adding more. A complete 20 demos far better than a half-filled 120. Expand the roster only after the app works end to end.

---

## 7. REST API

**Base URL:** `https://<your-host>/api/`

### 7.1 Response envelope
Every endpoint returns the same shape, so the app needs one generic TypeScript type.
```json
{
  "success": true,
  "message": "OK",
  "data": [],
  "meta": { "page": 1, "per_page": 20, "total": 42, "total_pages": 3 }
}
```
Failures return `"success": false`, a plain-language `message`, and a matching HTTP status (400, 404, 405, 500).

### 7.2 Endpoints

| Method | Endpoint | Params | Returns |
|--------|----------|--------|---------|
| GET | `/api/heroes.php` | `search`, `role`, `lane`, `page`, `per_page` | Paginated hero list |
| GET | `/api/hero.php` | `id` (required) | One hero + `skills[]` |
| GET | `/api/filters.php` | — | Distinct roles, lanes, difficulties present in the table |

`filters.php` is what feeds the filter bar. Because it reads distinct values out of the table, the app's filter chips can never drift out of sync with the data.

**Planned later:** `/api/builds.php`, `/api/counters.php`, `/api/items.php` — each blocked on its table existing.

### 7.3 Example
`GET /api/heroes.php?role=Assassin&per_page=2`
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "hero_id": 12,
      "name": "Hayabusa",
      "role": "Assassin",
      "roles": ["Assassin"],
      "lane": "Jungle",
      "lanes": ["Jungle"],
      "difficulty": "Hard",
      "picture": "https://example.com/hayabusa.png"
    }
  ],
  "meta": { "page": 1, "per_page": 2, "total": 9, "total_pages": 5 }
}
```
Note both `role` (raw string) and `roles` (split array). The app renders one chip per entry in `roles` without doing any string parsing itself.

### 7.4 Server file layout
```
public_html/
├── api/
│   ├── heroes.php
│   ├── hero.php
│   └── filters.php
├── config/
│   ├── database.php        # real credentials — server only, never in Git
│   └── config.sample.php   # committed template
└── includes/
    └── helpers.php         # CORS, JSON envelope, row formatting
```

### 7.5 Backend rules
- Every query uses PDO prepared statements. No string concatenation of user input, ever.
- `hero.php` validates `id` with `ctype_digit` before it reaches SQL.
- `per_page` is capped at 50 so nobody can pull the whole table in one request.
- Errors are logged server-side with `error_log()`; the client only sees a generic message.
- `helpers.php` sets CORS headers and answers the `OPTIONS` preflight.
- `config/database.php` goes in `.gitignore`.

---

## 8. Mobile App

### 8.1 Screen structure (Expo Router)
```
app/
├── _layout.tsx                 # Root stack + theme
├── (tabs)/
│   ├── _layout.tsx             # Bottom tabs
│   ├── index.tsx               # Hero list + filter bar  (F1-F5)
│   ├── favorites.tsx           # Locally saved heroes     (F7)
│   └── about.tsx               # Credits, data source
└── hero/
    └── [id].tsx                # Hero detail              (F6)

src/
├── api/client.ts               # Axios instance
├── services/heroService.ts     # getHeroes, getHero, getFilters
├── types/hero.ts               # Hero, ApiResponse
├── hooks/
│   ├── useHeroes.ts
│   └── useFavorites.ts         # AsyncStorage wrapper
├── components/
│   ├── HeroCard.tsx
│   ├── FilterBar.tsx
│   ├── SearchInput.tsx
│   ├── LoadingState.tsx
│   └── ErrorState.tsx
└── constants/
    ├── theme.ts
    └── roleColors.ts
```

### 8.2 Types — mirrored from the table
```ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface Hero {
  hero_id: number;
  name: string;
  role: string;        // raw column, e.g. "Mage/Tank"
  roles: string[];     // split by the API
  lane: string;
  lanes: string[];
  difficulty: string;
  picture: string;
  skills?: Skill[];    // only present from /api/hero.php
}

export interface Skill {
  skill_id: number;
  slot: 'passive' | 'skill1' | 'skill2' | 'ultimate';
  name: string;
  description: string | null;
  cooldown: string | null;
  mana_cost: string | null;
}

export interface Filters {
  roles: string[];
  lanes: string[];
  difficulties: string[];
}
```

### 8.3 API client
```ts
// src/api/client.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});
```
`.env` holds `EXPO_PUBLIC_API_URL=https://yoursite.freehostia.com/api` and is listed in `.gitignore`. When testing against XAMPP, use your PC's LAN address (`http://192.168.x.x/api`) — on a phone, `localhost` means the phone itself.

### 8.4 UI notes
- Use `FlatList`, never `ScrollView` + `.map()`. A 120-hero grid will stutter otherwise.
- Give each role a fixed colour so the list is scannable at a glance.
- Every screen needs three states: loading, error + retry, empty.
- `picture` URLs can be dead or hotlink-blocked. Always set a fallback image on load error.
- Use `expo-image` for portraits — better caching than the built-in `Image`.

---

## 9. Development Phases

| Phase | Focus | Deliverable | Est. |
|-------|-------|-------------|------|
| **1. Backend live** | Fill in DB credentials, upload `backend/`, hit `/api/filters.php` in a browser | Public API returning real JSON | 2 days |
| **2. Postman** | Build the collection, both environments, test scripts on all three endpoints | Saved + exported collection | 2 days |
| **3. Data entry** | 20 complete heroes, consistent separators and difficulty words | Usable dataset | 4 days |
| **4. Schema tightening** | Run `upgrade.sql` — unique name, indexes, difficulty standardised | Clean table | 1 day |
| **5. App shell** | `create-expo-app`, Expo Router tabs, theme, HeroCard with mock data | Navigable app | 4 days |
| **6. Integration** | Swap mocks for Axios, add loading/error/empty states | Live hero list | 5 days |
| **7. Detail + filters** | `/hero/[id]`, filter bar from `filters.php`, search | F1–F6 complete | 5 days |
| **8. Favorites + polish** | AsyncStorage favorites, icon, splash screen, device testing | MVP complete | 4 days |
| **9. Skills (optional)** | Create `hero_skills`, enter 20 heroes' skills, render on detail | Real detail screen | 4 days |
| **10. Build + docs** | EAS build APK, README, ERD, screenshots, user manual | Submission package | 3 days |

**Total: roughly 5–6 weeks**, and phases 3 and 5 overlap well — data entry is mindless enough to do while the app scaffolding compiles.

### 9.1 Milestones
- [ ] **M1** — `/api/filters.php` returns JSON from the public URL
- [ ] **M2** — All three endpoints pass Postman tests in the Production environment
- [ ] **M3** — Hero list renders live data on a physical phone
- [ ] **M4** — Filters, search and detail all working
- [ ] **M5** — Installable APK

---

## 10. Testing

### 10.1 Postman collection — **MLBB API**
Two environments:
- `Local` → `base_url = http://localhost/mlbb/api`
- `Production` → `base_url = https://yoursite.freehostia.com/api`

Attach to every request:
```js
pm.test("200 OK", () => pm.response.to.have.status(200));
pm.test("success true", () => pm.expect(pm.response.json().success).to.be.true);
```
Export the collection into `docs/postman/`. It doubles as your API documentation.

### 10.2 Cases to cover
| Type | Request | Expected |
|------|---------|----------|
| Happy path | `heroes.php` | 200, array of heroes, correct `meta.total` |
| Filter | `heroes.php?role=Mage` | Only heroes whose `role` contains Mage |
| Multi-role | `heroes.php?role=Tank` | Includes `Mage/Tank` heroes |
| Empty | `heroes.php?search=zzzzz` | 200 with `data: []`, not an error |
| Pagination | `heroes.php?page=2&per_page=5` | Different heroes, correct `total_pages` |
| Cap | `heroes.php?per_page=9999` | Silently capped at 50 |
| Detail | `hero.php?id=1` | 200, one object |
| Missing | `hero.php?id=99999` | 404 |
| Bad type | `hero.php?id=abc` | 400 |
| Injection | `hero.php?id=1 OR 1=1` | 400, no data leaked |
| Injection | `heroes.php?search=' OR 1=1--` | Empty result, no error |
| Method | POST to `heroes.php` | 405 |
| Device | Airplane mode | Error state with retry, no crash |
| Device | Low-end Android phone | List scrolls smoothly |

---

## 11. Git Workflow

```
main        ← working code only
└── dev     ← integration
    ├── feature/hero-list
    ├── feature/filters
    └── fix/broken-images
```

**Repo layout**
```
mlbb-hero-app/
├── mobile/            # Expo project
├── backend/           # PHP API, mirrors public_html
│   ├── api/
│   ├── config/        # config.sample.php only
│   └── includes/
├── database/
│   ├── mobile_legends_heroes.sql   # phpMyAdmin export
│   └── upgrade.sql
├── docs/              # Postman collection, ERD, screenshots
└── README.md
```

`.gitignore` must include `node_modules/`, `.expo/`, `.env`, `backend/config/database.php`, `android/`, `ios/`, `*.log`.

Commit in small described units (`feat: add role filter chips`). Push daily — a dead laptop should cost hours, not weeks. Tag `v0.1-mvp` and `v1.0`.

---

## 12. Deployment Checklist

- [ ] Copy the DB username and password from the hosting control panel
- [ ] Fill them into `backend/config/database.php` (that file stays off GitHub)
- [ ] Upload `api/`, `config/`, `includes/` into `public_html/`
- [ ] Open `https://yoursite/api/filters.php` — expect JSON, not a PHP error page
- [ ] If connection fails, try the DB host shown in phpMyAdmin instead of `localhost`
- [ ] Confirm the host's PHP version supports PDO (any PHP 7+ does)
- [ ] Run the full Postman collection against Production
- [ ] Set `EXPO_PUBLIC_API_URL` in the app and test **over mobile data, not Wi-Fi** — that proves the API is genuinely public
- [ ] Verify HTTPS works before building the APK (§5.2)
- [ ] Export the table from phpMyAdmin and commit the `.sql`

---

## 13. Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| R1 | DuckDNS can't point at shared hosting | High | Medium | Decide §5.1 this week; default to the host subdomain |
| R2 | Android blocks HTTP; app can't reach API | High | High | Secure an HTTPS endpoint before Phase 5 |
| R3 | Free host suspends account or hits quota | Medium | High | Weekly SQL export in Git; backup host identified |
| R4 | `picture` URLs dead or hotlink-blocked | Medium | Medium | Fallback image in `HeroCard`; spot-check URLs during data entry |
| R5 | Inconsistent `role`/`difficulty` values break filters | High | Medium | Fix the convention in §6.2; add the UNIQUE key and ENUM |
| R6 | Data entry for 120+ heroes consumes the schedule | High | Medium | Ship 20 complete heroes; expand after the app works |
| R7 | "Network request failed" with no clear cause | High | Medium | Always reproduce in Postman first — that separates app bugs from API bugs |
| R8 | Expo/RN version mismatches | Medium | Medium | Use `npx expo install`, never plain `npm install`, for Expo packages |

---

## 14. Definition of Done

1. All 7 MVP features work on a physical Android device.
2. The app pulls live data from the public API over HTTPS.
3. All three endpoints pass their Postman tests against Production.
4. Every query uses prepared statements; injection tests return no data.
5. At least 20 heroes are complete and consistent.
6. The repo has a README with setup steps, the table structure, and API docs.
7. A signed APK installs and runs cleanly.

---

## 15. Note on Game Content

Mobile Legends: Bang Bang hero names, artwork and skill text are Moonton's intellectual property. For a school or portfolio project this is normally fine, but:
- Credit Moonton on the About screen and in the README.
- Write your own difficulty ratings and skill summaries rather than copying wiki text word for word.
- Don't publish to the Play Store or monetise the app with copied artwork.
- Check the license on any fan-wiki images you link in `picture`.

---

## 16. Next Actions

1. Fill in the real DB user and password in `config/database.php`.
2. Upload `backend/` to `public_html/` and open `/api/filters.php` in a browser.
3. If JSON appears, build the Postman collection and run every test in §10.2.
4. Decide the DuckDNS question in §5.1 and confirm whether you get HTTPS.
5. Enter 20 heroes using the conventions in §6.2, then run `upgrade.sql`.
