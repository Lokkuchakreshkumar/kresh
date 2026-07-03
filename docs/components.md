# Kresh Frontend Components & Pages

Kresh is styled with premium custom CSS and Tailwind CSS v4, utilizing animations from GSAP and Motion (Framer Motion) to provide a premium user interface.

## Pages & Routings

### 1. Landing Page (`src/app/page.js`)
* **URL**: `/`
* **Purpose**: Serves as the primary marketing home. Integrates key visual showcases like:
  * Dynamic animated hero section with `TextRotator` and `BlurText`.
  * `InteractiveDemo` (a terminal sandbox demonstrating CLI installation).
  * `MagicBento` (a detailed bento-grid feature showcase).
  * Dynamic scrolling customer logo board via `/api/scroll-logos`.

### 2. User Profiles (`src/app/[username]/page.js`)
* **URL**: `/@<username>`
* **Purpose**: Developer portfolio page. Calculates total developer stats (combined installs count) and lists all public modules authored by that developer.

### 3. Registry Catalog (`src/app/skills/page.js`)
* **URL**: `/skills`
* **Purpose**: Browse the registry. Contains:
  * Local public skills (retrieved from `skills` table).
  * Live external registry feed via `ImportedSkillsFeed` proxying `skills.sh`.

### 4. Skill Details (`src/app/skills/[...slug]/page.js`)
* **URL**: `/skills/<slug>` (e.g. `/skills/@user/git-helper`)
* **Purpose**: Details view for local published skills. Renders:
  * SemVer version history.
  * Interactive markdown viewer for `SKILL.md`.
  * Files explorer showing code, instructions, or images in the version package.
  * Sidebar listing owner details, download buttons, metadata, and install instructions.

### 5. External Skill Details (`src/app/skills/external/[...slug]/page.js`)
* **URL**: `/skills/external/<slug>` (e.g. `/skills/external/vercel-labs/skills/find-skills`)
* **Purpose**: Detail view for imported `skills.sh` modules, with support for live markdown parsing, ranks, and custom install syntax.

### 6. Developer Dashboard (`src/app/dashboard/page.js`)
* **URL**: `/dashboard`
* **Purpose**: Authenticated dashboard. Lists all of the user's private and public skills, showing install counts, visibility levels, and version counts.

### 7. Skill Publishing (`src/app/dashboard/publish/page.js`)
* **URL**: `/dashboard/publish` or `/dashboard/edit?id=<skillId>`
* **Purpose**: Form to publish new modules or edit existing ones. Allows:
  * Inputting Name, Description, SemVer version, Category, and Visibility.
  * Uploading files via three distinct methods: **Editor** (manual markdown input), **Markdown File** (single file upload), or **Folder Directory** (webkitdirectory recursive folder upload).

### 8. Authentication Forms (`src/app/(auth)/signin/page.js` & `signup/page.js`)
* **URL**: `/signin`, `/signup`
* **Purpose**: Standard forms for creating developer profiles or logging in.

### 9. Loops Listing (`src/app/loops/page.js`)
* **URL**: `/loops`
* **Purpose**: Displays specific AI loop automations.

---

## Layout & Common Components

### 1. `Header.jsx` (`src/components/layout/Header.jsx`)
* **Responsibility**: Global navigation bar. Dynamically reads session states to display either Sign In/Up links or Dashboard and Logout controls. Features submenus, smooth hover underlines, and mobile-friendly hamburger transitions.

### 2. `Footer.jsx` (`src/components/layout/Footer.jsx`)
* **Responsibility**: Standard footer links and copyright block.

---

## Reusable UI Elements

* **`Button.jsx`**: Core button component supporting premium styling, hover expansions, custom colors, and outline designs.
* **`Badge.jsx`**: Renders standard labels (e.g. Loop, Skill, Private, Public) with matching colors.
* **`BlurText.jsx`**: Typographic text-entry effect utilizing Framer Motion to slide and blur text elements on load.
* **`TextRotator.jsx`**: Fades and rotates phrases (e.g., "Developer-first", "Agentic", "Versioned") in the hero header.
* **`ThemeToggle.jsx`**: Renders dynamic sun/moon switches to toggle the dark-mode active theme class.
* **`Glass.jsx` / `GlassCard.jsx`**: Reusable frosted-glass card containers for glassmorphism styling.
* **`CircleStack.jsx`**: Aesthetic abstract layout showing circular overlapping databases.
* **`InteractiveDemo.jsx`**: Simulates terminal commands on key inputs, printing install steps and mock files.
