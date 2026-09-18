# MLHeroes

Mobile Legends: Bang Bang hero reference app.
Expo + React Native front end, plain PHP + MySQL REST API on the back.

## Folder layout

```
MLHeroes/
├── mobile/        # Expo app (TypeScript, Expo Router)
│   ├── src/app/          screens — index.tsx, _layout.tsx, hero/[id].tsx
│   ├── src/components/   HeroCard, FilterBar, …
│   ├── src/constants/    theme, role colours
│   └── src/hooks/        useHeroes, useFavorites
├── backend/       # PHP API — mirrors public_html/ on the host
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

```bash
# Backend: copy the template, fill in credentials, upload backend/ to public_html/
cp backend/config/config.sample.php backend/config/database.php

# Mobile
cd mobile
npx expo install axios @react-native-async-storage/async-storage expo-image
npx expo start
```

Full plan, phases and API contract: [docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md)

---
Mobile Legends: Bang Bang and all hero names/artwork are © Moonton. Educational project.
