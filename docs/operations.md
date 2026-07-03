# Kresh Operations & Deployment Guide

This document contains instructions for setting up, running, testing, building, and deploying the Kresh registry web application and CLI client.

---

## Workspace Setup

### 1. Web Application Setup
First, install the npm dependencies at the root directory:
```bash
npm install
```

#### Environment Configuration (`.env`)
Create a `.env` file at the root. Be sure to configure the following environment variables:
* `DATABASE_URL`: Connection string for PostgreSQL database (e.g. Neon serverless).
* `JWT_SECRET`: Secret key used for signing JWT tokens.
* `SKILLS_SYNC_SECRET` (optional): Secret key required to authorize admin cron jobs (`/api/admin/sync-skills-sh`).

```env
DATABASE_URL="postgresql://user:password@hostname/neondb?sslmode=require"
JWT_SECRET="your-secure-jwt-signing-secret"
SKILLS_SYNC_SECRET="admin-secret-for-cron-sync"
```

#### Database Migrations
Initialize the tables by running:
```bash
# Apply schema directly (if using raw sql)
psql $DATABASE_URL -f schema.sql
```
*(Or use Drizzle Kit commands if configured: `npx drizzle-kit push`)*

### 2. CLI Client Setup
Navigate to the `cli/` directory and install dependencies:
```bash
cd cli
npm install
```

To run the CLI locally:
```bash
node src/index.js --help
```

---

## Build & Run Commands

### Web Server (Development)
Starts the Next.js dev server with Turbopack enabled:
```bash
npm run dev
```

### Web Server (Production Build)
Builds the optimized production bundle and runs it:
```bash
npm run build
npm run start
```

### Running Tests
* **Next.js API & Unit Tests**: Runs custom tests on normalizers and frontmatter parsers.
  ```bash
  npm run test
  ```
* **Playwright E2E Integration Tests**: Runs user scenarios (signup, signin, publish, API checks).
  ```bash
  npx playwright test
  ```

---

## Known Constraints & System Limitations

### 1. Upstream Registry Search Limitation
The `skills.sh` API endpoint (`/api/v1/skills`) ignores the query search parameter `q` on the server and always returns the complete listing. Consequently, Kresh does in-memory filtering on the page entries returned, meaning users searching the catalog only search within the paginated pages fetched.

### 2. Drizzle Serverless Connection pool
Because transaction-pool modes on postgres serverless platforms (like Neon connection pooling) do not support SQL prepared statements, the Drizzle database initialization client disables prefetching (`prepare: false`):
```javascript
const client = postgres(connectionString, { prepare: false });
```

### 3. Metadata Sync Duration Limit
The admin sync endpoint `/api/admin/sync-skills-sh` is set with a Next.js `maxDuration = 60` runtime limit. Since the sync client queries the API details using concurrency chunk sizes of 10 requests followed by a 1-second delay (to prevent registry rate-limiting), a single sync invocation will time out before fetching all 9.6k skills. To address this, the system persists the `nextPage` cursor in the `external_skill_sync_state` table so subsequent cron runs pick up right where the last execution finished.

### 4. Skill Files Upload Limits
Server actions for uploading files (manual or directory zip uploads) are constrained to a body size limit of **10MB** inside `next.config.mjs`:
```javascript
serverActions: {
  bodySizeLimit: '10mb',
}
```
Any folder uploads exceeding 10MB in total size will be rejected by the server actions handler.
