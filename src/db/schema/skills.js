import { pgTable, uuid, varchar, text, timestamp, integer, unique, boolean, index } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const skills = pgTable("skills", {
  id: uuid("id").primaryKey(),
  ownerId: uuid("owner_id").notNull().references(() => users.id),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(),
  visibility: varchar("visibility", { length: 20 }).notNull().default("public"),
  currentVersion: varchar("current_version", { length: 30 }),
  installsCount: integer("installs_count").notNull().default(0),
  starsCount: integer("stars_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const skillVersions = pgTable("skill_versions", {
  id: uuid("id").primaryKey(),
  skillId: uuid("skill_id").notNull().references(() => skills.id),
  version: varchar("version", { length: 30 }).notNull(),
  changelog: text("changelog"),
  checksum: varchar("checksum", { length: 128 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow()
}, (t) => ({
  unq: unique().on(t.skillId, t.version)
}));

export const skillFiles = pgTable("skill_files", {
  id: uuid("id").primaryKey(),
  skillVersionId: uuid("skill_version_id").notNull().references(() => skillVersions.id),
  path: text("path").notNull(),
  content: text("content").notNull(),
  fileType: varchar("file_type", { length: 30 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (t) => ({
  unq: unique().on(t.skillVersionId, t.path)
}));

export const skillStars = pgTable("skill_stars", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  skillId: uuid("skill_id").notNull().references(() => skills.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (t) => ({
  unq: unique().on(t.userId, t.skillId)
}));

export const externalSkills = pgTable("external_skills", {
  id: uuid("id").primaryKey(),
  externalId: text("external_id").notNull().unique(),
  kreshSlug: text("kresh_slug").notNull().unique(),
  name: varchar("name", { length: 240 }).notNull(),
  description: text("description"),
  sourceOwner: varchar("source_owner", { length: 160 }),
  sourceRepository: varchar("source_repository", { length: 240 }),
  sourceUrl: text("source_url"),
  skillSelector: text("skill_selector").notNull(),
  upstreamUrl: text("upstream_url").notNull(),
  upstreamInstalls: integer("upstream_installs").notNull().default(0),
  upstreamRank: integer("upstream_rank"),
  isInstallable: boolean("is_installable").notNull().default(false),
  isAvailable: boolean("is_available").notNull().default(true),
  firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (t) => ({
  rankIdx: index("external_skills_rank_idx").on(t.isAvailable, t.upstreamRank),
  installsIdx: index("external_skills_installs_idx").on(t.upstreamInstalls)
}));

export const externalSkillSyncState = pgTable("external_skill_sync_state", {
  source: varchar("source", { length: 60 }).primaryKey(),
  nextPage: integer("next_page").notNull().default(0),
  runStartedAt: timestamp("run_started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  lastError: text("last_error")
});
