# Patient Tracker

[![CI](https://github.com/Cachi1997/administrador-pacientes/actions/workflows/ci.yml/badge.svg)](https://github.com/Cachi1997/administrador-pacientes/actions/workflows/ci.yml)

Full-stack app to register and track veterinary patients: a React client and an
Express API backed by PostgreSQL, sharing a single set of Zod schemas.

## Features

- Create, edit and delete patients, with validation on both client and server
- Server-side validation errors shown on the matching form fields
- Data persisted in PostgreSQL and cached on the client with TanStack Query
- Integration tests and CI on every push

## Tech stack

| Layer   | Tools                                                                  |
| ------- | ---------------------------------------------------------------------- |
| Client  | React 19, Vite, Tailwind CSS, TanStack Query, Zustand, React Hook Form |
| Server  | Express 5, Prisma 7, PostgreSQL 17                                     |
| Shared  | Zod 4 schemas and the types derived from them                          |
| Tooling | TypeScript, ESLint, Vitest, Supertest, Docker Compose, GitHub Actions  |

## Architecture

```
├── client/   React app (Vite)
├── server/   Express API + Prisma
└── shared/   Zod schemas used by both
```

The patient schema lives in `shared/` and is the single source of truth. The form
validates with it through `zodResolver`, the API validates request bodies with it,
and the `Patient` type is inferred from it — so the type, the client validation and
the server validation cannot drift apart.

On the client, patients are server state managed by TanStack Query. Zustand only
holds UI state: which patient is being edited.

## Getting started

### Prerequisites

- Node.js 22.9 or later and npm 11
- Docker Desktop

### Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Create the environment files from the examples and fill in the credentials:
   - `.env.example` → `.env` (database credentials used by Docker Compose)
   - `server/.env.example` → `server/.env` (connection string used by Prisma)

   The user, password and database must match in both files.

3. Start PostgreSQL (exposed on port **5434**):

   ```bash
   docker compose up -d
   ```

4. Apply the migrations and generate the Prisma client:

   ```bash
   npm run db:migrate --workspace server
   npm run db:generate --workspace server
   ```

5. Run the API and the client, each in its own terminal:

   ```bash
   npm run dev:server
   npm run dev
   ```

The client runs on http://localhost:5173 and the API on http://localhost:4000.

## Scripts

| Command                                | Description                 |
| -------------------------------------- | --------------------------- |
| `npm run dev`                          | Start the client            |
| `npm run dev:server`                   | Start the API in watch mode |
| `npm run build`                        | Build the client            |
| `npm run lint`                         | Lint every workspace        |
| `npm test`                             | Run the test suites         |
| `npm run db:studio --workspace server` | Open Prisma Studio          |

## Testing

The tests hit the real API against a dedicated database, so your development data is
never touched.

1. Create the test database:

   ```bash
   docker compose exec db psql -U <user> -d <database> -c "CREATE DATABASE pacientes_test;"
   ```

2. Create `server/.env.test` with a `DATABASE_URL` pointing to `pacientes_test`.

3. Apply the migrations to it and run the tests:

   ```bash
   npm run db:migrate:test --workspace server
   npm test
   ```

## Continuous integration

GitHub Actions runs lint, typecheck, build and the test suite on every push, against a
PostgreSQL service container. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).
