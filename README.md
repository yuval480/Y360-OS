# New Project

Basic TypeScript backend scaffold with a PostgreSQL-ready database layer.

## Structure

- `src/config` - environment and app configuration
- `src/db` - database clients and connection helpers
- `src/modules` - feature modules
- `src/routes` - HTTP route definitions
- `src/services` - shared application services
- `src/utils` - shared helpers
- `infra` - local infrastructure such as Docker Compose
- `tests` - unit and integration tests

## Local Setup

```bash
cp .env.example .env
npm install
docker compose -f infra/docker-compose.yml up -d
npm run dev
```

