This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Deploy notes for this repository

- This project uses Prisma. Do not deploy the local SQLite file (`prisma/dev.db`) to Vercel — the platform filesystem is ephemeral and local SQLite is not suitable for production.
- Provision a managed database (Postgres, MySQL, or a serverless PostgreSQL like Neon/Supabase). Get a connection string.
- Add a Vercel Environment Variable or Secret named `DATABASE_URL` with your connection string. You can reference it as a project secret named `database_url` and `vercel.json` maps it to `DATABASE_URL`.

Example steps:

1. Create a managed database (e.g., Supabase/Neon/PlanetScale) and obtain the JDBC/connection string.
2. In the Vercel dashboard for your project go to Settings → Environment Variables and add `DATABASE_URL` (or create a secret and name it `database_url`).
3. Deploy the project (via Git or Vercel CLI). Vercel will run the Next build and your app will read `DATABASE_URL` at runtime.

Local development:

- Keep using `file:./prisma/dev.db` locally — the project falls back to this when `DATABASE_URL` is not set.
- To run migrations against your production database, run locally with `DATABASE_URL` set, e.g.:

```powershell
setx DATABASE_URL "postgresql://user:pass@host:5432/dbname"
npx prisma migrate deploy
npx prisma generate
```

