# DD Foods

A food delivery marketplace built with Next.js, featuring restaurant search, a product catalog, a shopping cart, and order tracking. The responsive interface supports mobile, tablet, and desktop screens while keeping the main content within a 1280 px width.

## Preview

<!-- Add mobile and desktop screenshots or a link to the live demo here. -->

## Features

- Search for restaurants by name and browse by category.
- Explore a product catalog with offers, discounts, and delivery information.
- Shop from one restaurant at a time, with subtotal, discount, and delivery fee calculations.
- Place orders with prices recalculated and validated on the server.
- Sign in with Google or use a mock login available only during local development.
- View order history, reorder previous purchases, and manage favorite restaurants.
- Use a responsive layout with navigation adapted to small and large screens.

## Technology Stack

| Technology                | Version / Usage                                                   |
| ------------------------- | ----------------------------------------------------------------- |
| Next.js                   | 16.4.1, App Router, and Server Actions                            |
| React / React DOM         | 19.3.1                                                            |
| TypeScript                | 5.x                                                               |
| Tailwind CSS              | 3.4.19                                                            |
| Prisma / Prisma Client    | 5.22.0                                                            |
| PostgreSQL                | 16, via Docker Compose for local development                      |
| NextAuth                  | 4.24.15, Google OAuth, and local development authentication       |
| Radix UI, Lucide, Sonner   | Accessible components, icons, and notifications                   |

## Architecture and Technical Decisions

- The App Router organizes dynamic pages and server and client components.
- Prisma connects to PostgreSQL; migrations version the schema, and the seed script creates demo data.
- Server Actions derive user identity from the session. Before saving an order, the server fetches product prices, quantities, discounts, and delivery fees from the database and recalculates the total.
- The shopping cart is managed with React context and supports products from one restaurant at a time.
- The PostgreSQL container is intended for local development. For a serverless deployment, use a managed database accessible to the hosted application.

## Run Locally

### Requirements

- Node.js 20.9 or later and npm.
- Docker Desktop running.

### Install and Configure

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file to `.env`:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Replace `NEXTAUTH_SECRET` with a random secret. Generate one with:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   Keep `NEXT_PUBLIC_LOCAL_AUTH_ENABLED` set to `true` locally to enable mock authentication during development. This mechanism is automatically disabled in production. Google credentials can be left empty in the local environment.

### Database

1. Start the local PostgreSQL database:

   ```bash
   docker compose up -d
   ```

2. Apply migrations and load the demo data:

   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

Docker Compose makes the `dd_foods` database available at `localhost:5432`. The local credentials and connection URL are provided in `.env.example`.

### Start the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The login button uses the local development user when `NEXT_PUBLIC_LOCAL_AUTH_ENABLED=true`.

### Validation

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Deployment

The project is configured for Next.js builds and serverless hosting on Vercel. In the production environment, configure `DATABASE_URL` to point to a managed PostgreSQL database, along with `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`. Local authentication is disabled in production. No deployment or remote database has been configured.
