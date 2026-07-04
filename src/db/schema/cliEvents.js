import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const cliEvents = pgTable("cli_events", {
  id: uuid("id").primaryKey(),
  command: varchar("command", { length: 50 }).notNull(),
  skillSlug: varchar("skill_slug", { length: 100 }),
  agentType: varchar("agent_type", { length: 50 }),
  os: varchar("os", { length: 50 }),
  version: varchar("version", { length: 30 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
