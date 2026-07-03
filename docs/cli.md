# Kresh CLI Client Reference

The Kresh CLI client allows developers to manage, install, and execute intelligence skills directly in their local development environments.

## File & Configuration Structure

The CLI stores its local user settings under a hidden folder inside the user's home directory:
* **Directory**: `~/.kresh/`
* **Session Configuration** (`config.json`): Contains authorization tokens returned by browser login flows.
  ```json
  {
    "token": "eyJhbGciOi..."
  }
  ```
* **Trusted Repositories** (`trusted-sources.json`): Stores trusted URLs of upstream third-party developers to suppress warnings on external installation commands.
  ```json
  {
    "repositories": [
      "https://github.com/vercel-labs/skills"
    ]
  }
  ```

---

## Workspace Layout Integration

The CLI attempts to determine the root folder of the local development workspace by scanning upwards from the current working directory for `package.json` and `next.config.mjs` files. 

Skills are installed into subfolders under the workspace root based on the target agent selection. These locations are:
* **Antigravity**: `.agents/skills/<skill-name>/`
* **Claude Code**: `.claude/skills/<skill-name>/`
* **Codex**: `.codex/skills/<skill-name>/`
* **Cursor**: `.cursor/skills/<skill-name>/`
* **Standard/Other**: `skills/<skill-name>/`

Each folder contains:
* `SKILL.md` (the core instruction set)
* `metadata.json` (version, slug, repository, description, etc.)
* Any associated version helper files (scripts, code, stylesheets, templates, or media assets).

---

## CLI Command Reference

### `kresh install <skill>` (Alias: `kresh i`)
Downloads a skill by its registry slug (e.g. `@universe/git-helper`) and places it under the selected agent's skills folder.
* **Options**:
  * `--agy`: Install for Antigravity.
  * `--claude`: Install for Claude Code.
  * `--codex`: Install for Codex.
  * `--cursor`: Install for Cursor.
* **Agent.md & Design.md**: If the skill belongs to config categories (like `AGENT.md` or `Design.md`), it prompts to write the file directly to the workspace root directory (e.g., `AGENTS.md`, `CLAUDE.md`, or `<skill-name>.md`) rather than the agent subfolders.

### `kresh search <query>` (Alias: `kresh s`)
Queries the remote Kresh API registry `/api/skills` for public or private matching skills and lists the matches with versions, descriptions, publishers, and installation syntax.

### `kresh ls` (Alias: `kresh list`)
Lists all currently installed skills found inside the local workspace's agent folders.

### `kresh remove <skill>` (Alias: `kresh rm`)
Deletes the local skill folder and its associated files from the workspace.

### `kresh publish`
Prints the setup instructions and link to publish the local skill using the publisher UI.

### `kresh login [action]`
Launches local web-based CLI authentication.
* **Parameters**:
  * `kresh login flush`: Logs out of the CLI by clearing the local session token from `config.json`.
* **Flow**:
  1. Spawns a temporary HTTP server on localhost using a random available port.
  2. Opens the browser to the authenticated registry link `https://kresh.vercel.app/cli/auth?port=PORT`.
  3. The web portal issues a JWT callback back to `http://127.0.0.1:PORT/callback?token=JWT`.
  4. The local server saves the JWT to `config.json` and closes successfully.

### `kresh trust <action> [repository]`
Manages trusted upstream repositories running third-party installers.
* **Commands**:
  * `kresh trust list`: Lists canonical HTTPS URLs of all trusted repositories.
  * `kresh trust revoke <repository_url>`: Revokes trust from a repository.

### `kresh get <loopId>`
Downloads the YAML workflow or markdown instruction details of an automation loop and copies the content directly to the operating system clipboard (using `clipboardy`).
