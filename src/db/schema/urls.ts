import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const urlsTable = sqliteTable("urls", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  longUrl: text("long_url").notNull(),
  shortCode: text("short_code").unique(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),

  expiresAt: integer("expires_at", { mode: "timestamp_ms" }),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});
