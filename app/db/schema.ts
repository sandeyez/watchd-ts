import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("status", ["ACTIVE", "DELETED"]);

export const users = pgTable("users_table", {
  id: text("id").primaryKey(),
  status: userStatusEnum("status").notNull().default("ACTIVE"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
