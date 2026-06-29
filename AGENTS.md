# TaskFlow API — AGENTS.md

## Quick start
```bash
npm run dev       # ts-node-dev --respawn --transpile-only src/index.ts
npm run build     # tsc
npm run start     # node dist/index.js
```

## Setup
- `.env` is required (gitignored). Copy from `.env.example` (currently empty) with these vars:
  ```env
  PORT=3000
  DATABASE_URL=postgresql://user:pass@localhost:5432/taskflow_db
  NODE_ENV=development
  ```

## Architecture
- **Entrypoint**: `src/index.ts` — Express 5 app, CORS, JSON parsing
- **Routes**: `GET /` (project info), `GET /health` (DB connectivity check via `SELECT NOW()`)
- **Database**: `pg.Pool` with `connectionString` from `DATABASE_URL`. Connection tested at import time in `src/config/database.ts`
- `dotenv.config()` is called in both `src/index.ts` and `src/config/database.ts`

## Known gaps
- No test framework — `npm test` is a placeholder (`echo "Error: no test specified" && exit 1`)
- No linter or formatter configured
- No CI workflow
