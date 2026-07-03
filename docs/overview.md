# Kresh Project Overview

Kresh is a modern, open-source registry where developers package, share, and compose intelligence modules (known as **skills**) for AI systems. It provides an ecosystem for sharing prompts, agent configurations, workflows, and documentation designed specifically to enhance AI assistants and agent capabilities.

## Tech Stack

### Web Application (Registry Server & UI)
* **Framework**: Next.js 16 (App Router)
* **Styling**: Tailwind CSS v4, Vanilla CSS
* **Database**: PostgreSQL (Neon Serverless)
* **ORM**: Drizzle ORM
* **Authentication**: Custom JSON Web Token (JWT) using `jose` and `bcryptjs`
* **Animations**: GSAP & Motion (Framer Motion) for premium microinteractions and transitions

### CLI Tool
* **Runtime**: Node.js
* **Framework**: Commander.js
* **User Prompts**: Inquirer.js
* **HTTP Client**: Axios (configured with default timeout of 10s and custom headers)

---

## Folder Structure

Below is the recursive map of the Kresh project repository:

```
Kresh/
├── .agents/                    # Agent-level skill configuration files
│   └── skills/                 # Locally installed agent skills
├── cli/                        # Node.js CLI codebase
│   ├── src/
│   │   ├── commands/           # CLI Command implementations (install, search, login, etc.)
│   │   ├── services/           # Underlying CLI services (api, auth, filesystem, trust)
│   │   └── utils/              # Utility files (logger)
│   ├── test/                   # CLI unit tests
│   └── package.json            # CLI npm package configuration
├── drizzle/                    # Drizzle migrations and schema snapshots
├── docs/                       # Comprehensive documentation suite
├── public/                     # Static assets (images, logos, fonts, SVGs)
├── src/                        # Main web application codebase
│   ├── app/                    # Next.js App Router pages and API routes
│   │   ├── (auth)/             # Authentication routes (signin, signup)
│   │   ├── [username]/         # User profile pages
│   │   ├── api/                # Next.js backend API routes
│   │   │   ├── admin/          # Admin/Cron utility endpoints
│   │   │   ├── external-skills/# live external catalog proxy
│   │   │   ├── loops/          # loops API route
│   │   │   ├── scroll-logos/   # dynamic scroll images endpoint
│   │   │   └── skills/         # local skills endpoints
│   │   ├── dashboard/          # authenticated user dashboard (edit/publish)
│   │   ├── docs/               # internal documentation pages
│   │   ├── loops/              # loops listing UI
│   │   ├── skills/             # skills registry browser
│   │   ├── globals.css         # global styles and CSS variables
│   │   ├── layout.js           # root next.js layout
│   │   └── page.js             # landing page (home)
│   ├── components/             # Reusable UI & Layout components
│   │   ├── docs/               # documentation pages layout components
│   │   ├── layout/             # global header, footer, bento, etc.
│   │   └── ui/                 # generic design elements (badge, button, rotators)
│   ├── db/                     # Drizzle initialization
│   │   ├── schema/             # Drizzle database tables (skills, users, collections)
│   │   └── index.js            # DB connection client
│   ├── lib/                    # Shared client/server libraries
│   │   ├── auth.js             # Session cookies management
│   │   ├── externalSkills.js   # Skills.sh API normalizers and utility helpers
│   │   ├── jwt.js              # Token signing and verification (jose wrapper)
│   │   ├── memoryCache.js      # Simple in-memory cache for speed optimization
│   │   ├── skillFrontmatter.js # YAML frontmatter parser for markdown files
│   │   └── skillsShClient.js   # Live HTTP client for skills.sh API calls
│   └── middleware.js           # Protected route middleware
├── tests/                      # Frontend and API route integration/e2e tests
├── drizzle.config.js           # Drizzle schema path and database URL config
├── next.config.mjs             # Next.js compiler, server actions, and Turbopack setup
├── package.json                # Main application dependency manifest
├── README.md                   # Main quickstart guide
└── schema.sql                  # Raw SQL table initialization scripts
```
