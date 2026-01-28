# BetterAuth Protected NestJS API (Backend)

This backend is a NestJS API protected using **Better Auth**.
It exposes a protected endpoint:

- `GET /secret` → returns `{ "message": "This is a protected message for [User Name]" }`

Authentication and session validation are handled by Better Auth, and the API uses a custom NestJS Guard to verify sessions.

---

## Tech Stack

- NestJS
- Better Auth
- SQLite (local/dev) via `better-sqlite3`
- Cookie-based sessions

---

## Requirements Implemented

### BetterAuthGuard
- Intercepts incoming requests
- Calls `auth.api.getSession({ headers: request.headers })`
- Throws `401 Unauthorized` if no session exists
- Attaches `request.user` when authenticated

### Protected Route
- `GET /secret` is guarded by `BetterAuthGuard`
- Returns a message containing the authenticated user name/email

---

## Environment Variables

Create a `.env` file in `backend/`:

```env
PORT=3001
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
BETTER_AUTH_SECRET=SUPER_SECRET_KEY
```

> `BETTER_AUTH_SECRET` can be any strong random string.

---

## Install & Run Locally

```bash
cd backend
npm install
```

### Generate Better Auth Schema (SQLite)

```bash
npx @better-auth/cli generate --config src/auth/better-auth.ts
```

Apply the generated SQL file to your SQLite database (e.g. `auth.db`).

### Start Server

```bash
npm run start:dev
```

The API will be available at:

- http://localhost:3001

---

## API Endpoints

### Auth (Better Auth)
Mounted under:

- `/api/auth/*`

Examples:
- `GET /api/auth/get-session`
- `POST /api/auth/sign-in/email`
- `POST /api/auth/sign-up/email`

### Protected Endpoint

- `GET /secret`
  - Requires a valid Better Auth session cookie
  - Returns a protected message

---

## Deployment (Railway)

### Port Handling
In production, the application listens on the port provided by Railway:

```ts
await app.listen(process.env.PORT || 3001, "0.0.0.0");
```

### Database Persistence
The project uses SQLite for local development.

- Data is stored in a local auth.db file

- No external database setup is required

- This keeps the project easy to run and review locally

This setup is enough for demonstrating authentication, session handling, and protected routes.

---

## More infos

- The backend **does not** handle signup or login logic directly.
- User creation, password hashing, session handling, and cookies are managed entirely by Better Auth.
- The backend only verifies sessions and protects routes.
