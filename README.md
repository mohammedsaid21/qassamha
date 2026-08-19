# Qassamha (قسّمها)

## Overview

When a group shares costs — trips, rent, dinners — it gets messy fast. I built Qassamha as a **Chingu Solo Project (Tier 3)** to solve that: a shared ledger per group where you track who paid what, who owes who, and the simplest way to settle up.

The UI is Arabic-first with an English toggle and RTL layout throughout.

## Features

- Register / login with JWT auth
- Create groups and invite members by email
- Add expenses (payer, amount, description, split between selected members)
- View each member's net balance in a group
- Settlement plan using a greedy min-transfers algorithm
- Arabic and English UI

## Running the project

**Live app:** https://qassamha.vercel.app

**Demo login:** `demo@qassamha.app` / `Demo1234!`

The demo account has a few groups and expenses already loaded so you can jump straight to balances and settlements.

### Prerequisites

- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech) works well)

### Local setup

Clone the repo and set up the server:

```bash
git clone https://github.com/mohammedsaid21/qassamha.git
cd qassamha/server
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

The API runs at `http://localhost:4000`.

In a second terminal, start the client:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. In dev the client talks to `http://localhost:4000/api` automatically.

### Deploy

The repo is set up for Vercel (client + API in one project). Set `DATABASE_URL` and `JWT_SECRET` in the Vercel environment variables.

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

## ToDo

- [ ] Custom split ratios (currently splits are equal)
- [ ] Expense categories and filters
- [ ] Export group balances as CSV
- [ ] Email notifications when invited to a group

## Contributors

- [mohammedsaid21](https://github.com/mohammedsaid21) — solo project

## Ways to contribute

1. Fork the repo
2. Create a branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Open a pull request against `main`

Bug reports and feature ideas are welcome via [GitHub Issues](https://github.com/mohammedsaid21/qassamha/issues).

## Visuals

Login page (Arabic UI):

![Qassamha login page — Arabic-first expense-splitting app](docs/screenshot-home.png)
