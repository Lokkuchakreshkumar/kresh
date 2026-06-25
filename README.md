# Kresh - Install Intelligence

Kresh is the open registry where developers package, share, and compose intelligence modules for AI systems. 
It provides an ecosystem for sharing skills, prompts, workflows, and documentation designed specifically to enhance AI assistants and agent capabilities.

## Tech Stack

This project is a modern web application built with:

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4, GSAP, and Framer Motion for microinteractions
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Custom JWT with `jose` and `bcryptjs`

## Getting Started

First, clone the repository and install the dependencies:

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root of your project. You will need to provide the following environment variables (especially for the database and authentication):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/kresh"
JWT_SECRET="your_super_secret_key"
```

> **Note**: Whenever updating the database schema or making code edits that require new environment variables, be sure to update your local `.env` file accordingly.

### Running the Development Server

Start the development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## CLI Setup

The Kresh ecosystem includes a CLI for installing skills.
(If there are CLI packages, remember not to use `npm link` in production and to publish the package).

## Development Rules

- **Database**: Any operations on the Database must be highlighted and explicit permission taken before execution.
- **Security**: Security is a top priority. Use try-catch blocks to prevent production crashes. Ensure no important info/secrets leak into code (put them in `.env`).
- **Code Quality**: Keep files organized and clean. Split code into multiple files rather than bloating single files with hundreds of lines.
- **Design**: Never use letter spacing arbitrarily; follow the established design tokens. 

For full AI agent instructions, see `AGENTS.md`.

## License

© 2026 Kresh Inc. All rights reserved.
