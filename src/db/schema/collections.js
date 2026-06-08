import { pgTable, uuid, varchar, text, timestamp, integer, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { skills } from "./skills.js";

export const collections = pgTable("collections", {
  id: uuid("id").primaryKey(),
  ownerId: uuid("owner_id").notNull().references(() => users.id),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description"),
  visibility: varchar("visibility", { length: 20 }).notNull().default("public"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const collectionSkills = pgTable("collection_skills", {
  collectionId: uuid("collection_id").notNull().references(() => collections.id),
  skillId: uuid("skill_id").notNull().references(() => skills.id),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (t) => ({
  pk: primaryKey({ columns: [t.collectionId, t.skillId] })
}));
