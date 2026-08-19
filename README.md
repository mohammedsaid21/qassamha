# Qassamha (قسّمها)

Split group expenses with friends — who paid what, who owes who, and the simplest way to settle up.

Built as a Chingu Solo Project (Tier 3).

## Live app

https://qassamha.vercel.app

**Demo login:** `demo@qassamha.app` / `Demo1234!`

The demo account has a few groups and expenses already loaded so you can jump straight to balances and settlements.

## Overview

When a group shares costs — trips, rent, dinners — it gets messy fast. Qassamha keeps a shared ledger per group: add expenses, split them between members, see running balances, and get a minimal list of who should pay whom to clear everything.

The UI is Arabic-first with an English toggle. RTL layout throughout.

## Features

- Register / login with JWT auth
- Create groups and invite members by email
- Add expenses (payer, amount, description, split between selected members)
- View each member's net balance in a group
- Settlement plan using a greedy min-transfers algorithm
- Arabic and English UI

## Running locally

You need Node 18+ and a Postgres database (I used [Neon](https://neon.tech)).

### 1. Server

```bash
cd server
npm install
cp .env.example .env
```

Fill in `.env`:

```
DATABASE_URL=postgresql://...
JWT_SECRET=some-long-random-string
PORT=4000
```

Run migrations and optional seed data:

```bash
npx prisma migrate dev
npm run seed
npm run dev
```

API runs at `http://localhost:4000`.

### 2. Client

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. In dev the client talks to `http://localhost:4000/api` automatically.

### Deploy

The repo is set up for Vercel (client + API in one project). Set `DATABASE_URL` and `JWT_SECRET` in the Vercel environment variables.

## Repo structure

```
client/   React + Vite + Tailwind frontend
server/   Express + Prisma API
api/      Vercel serverless entry point
```

## Dependencies

**Frontend**
- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)

**Backend**
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/) + PostgreSQL
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

## API endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/groups
GET    /api/groups
GET    /api/groups/:id
POST   /api/groups/:id/members
DELETE /api/groups/:id/members/:memberId
POST   /api/groups/:id/expenses
DELETE /api/expenses/:id
GET    /api/groups/:id/balances
GET    /api/groups/:id/settlements
```
