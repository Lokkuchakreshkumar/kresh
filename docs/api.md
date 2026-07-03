# Kresh Registry API Reference

The Kresh registry backend exposes several REST API endpoints used by the Web UI and the Kresh CLI client.

---

## 1. Skills Search & Catalog

### `GET /api/skills`
Fetches a list of local public skills combined with external popular skills.
* **Access**: Public
* **Query Parameters**:
  * `q` (optional): Filter results by keyword (name, description, or slug).
* **Response**: A JSON array of up to 50 skills:
  ```json
  [
    {
      "id": "vercel-labs/skills/find-skills",
      "slug": "external/vercel-labs/skills/find-skills",
      "name": "find-skills",
      "description": "Helps discover and install skills...",
      "category": "Imported skill",
      "currentVersion": "upstream",
      "installsCount": 2273377,
      "starsCount": 0,
      "ownerUsername": "vercel-labs",
      "external": true
    }
  ]
  ```

---

## 2. Skill Installation & Details

### `GET /api/skills/[...slug]`
Retrieves full details (including package file content) for a specific skill. Used by the CLI client on installation.
* **Access**: Public (or Authenticated for private skills)
* **Headers**:
  * `Authorization` (optional): `Bearer <CLI_Session_Token>` (needed if the skill is private).
* **Response (Success)**:
  ```json
  {
    "name": "example-skill",
    "slug": "@user/example-skill",
    "description": "A demo skill description",
    "category": "Skills",
    "currentVersion": "1.0.0",
    "ownerUsername": "user",
    "createdAt": "2026-06-30T12:00:00.000Z",
    "starsCount": 3,
    "installsCount": 42,
    "skillContent": "# Example Skill\n...",
    "files": [
      {
        "path": "SKILL.md",
        "content": "# Example Skill\n...",
        "fileType": "markdown"
      }
    ]
  }
  ```

### `GET /api/skills/download/[...slug]`
Directly downloads the `SKILL.md` markdown file.
* **Access**: Public
* **Response**: Raw file transfer containing the markdown text with attachment disposition `filename="@owner-skillname-SKILL.md"`.

---

## 3. External Skills Catalog Proxy

### `GET /api/external-skills`
Proxies lists of popular skills live from `skills.sh` with token resolution.
* **Access**: Public
* **Query Parameters**:
  * `cursor` (optional): Current page index (defaults to 0).
  * `limit` (optional): Maximum items per page (defaults to 20, max 50).
  * `q` (optional): Filter keyword.
* **Response**:
  ```json
  {
    "items": [...],
    "total": 9639,
    "nextCursor": 1
  }
  ```

---

## 4. Loops & Static Assets

### `GET /api/loops/[...slug]`
Retrieves loop detail configurations from database.
* **Access**: Public
* **Response**: Returns the loop name and loop file content (checking `loop.yaml` first, then `SKILL.md`).

### `GET /api/scroll-logos`
Dynamically scans `public/scroll` on the filesystem and returns list of image locations.
* **Access**: Public
* **Response**: List of logo source paths and humanized names.

---

## 5. Synchronization Daemon (Admin-only)

### `POST /api/admin/sync-skills-sh`
Trigger route to paginate and cache skills metadata from `skills.sh` into `external_skills` table.
* **Access**: Authenticated (Requires Admin Secret)
* **Headers**:
  * `Authorization`: `Bearer <SKILLS_SYNC_SECRET | CRON_SECRET>`
* **Response**:
  ```json
  {
    "page": 0,
    "imported": 100,
    "nextPage": 1
  }
  ```
