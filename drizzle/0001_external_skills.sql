CREATE TABLE IF NOT EXISTS "external_skills" (
  "id" uuid PRIMARY KEY,
  "external_id" text NOT NULL UNIQUE,
  "kresh_slug" text NOT NULL UNIQUE,
  "name" varchar(240) NOT NULL,
  "description" text,
  "source_owner" varchar(160),
  "source_repository" varchar(240),
  "source_url" text,
  "skill_selector" text NOT NULL,
  "upstream_url" text NOT NULL,
  "upstream_installs" integer NOT NULL DEFAULT 0,
  "upstream_rank" integer,
  "is_installable" boolean NOT NULL DEFAULT false,
  "is_available" boolean NOT NULL DEFAULT true,
  "first_seen_at" timestamptz NOT NULL DEFAULT now(),
  "last_seen_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "external_skills_rank_idx"
  ON "external_skills" ("is_available", "upstream_rank");
CREATE INDEX IF NOT EXISTS "external_skills_installs_idx"
  ON "external_skills" ("upstream_installs");

CREATE TABLE IF NOT EXISTS "external_skill_sync_state" (
  "source" varchar(60) PRIMARY KEY,
  "next_page" integer NOT NULL DEFAULT 0,
  "run_started_at" timestamptz,
  "completed_at" timestamptz,
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "last_error" text
);
