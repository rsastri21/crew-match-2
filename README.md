This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Crew Match 2

Crew Match 2 is the next generation of Crew Match, hosted at [`crewmatch.app`](https://crewmatch.app).

## Tech Stack

The site is a full-stack application created with Next 14. The following services are used:

-   Frontend

    -   Tailwind CSS
    -   Shadcn UI components
    -   React

-   Backend
    -   Neon Serverless Postgres Database with Drizzle ORM.
    -   Resend for email delivery.
    -   Google, and Slack OAuth.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses Docker to setup a local postgres database for development. It needs to be run alongside the dev server and can be configured in the `docker-compose.yml` file.

Useful database targets:

```bash
# Generate migrations
npm run db:generate

# Apply migrations to local database
npm run db:migrate

# Push DB migrations
npm run db:push

# View local database in Drizzle Studio
npm run db:studio
```

_Migrations will automatically be applied to the production Neon database when Vercel runs the build target on deployment._
