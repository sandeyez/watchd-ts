import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("status", ["ACTIVE", "DELETED"]);

export const users = pgTable("users_table", {
  id: text("id").primaryKey(),
  status: userStatusEnum("status").notNull().default("ACTIVE"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const movieReviews = pgTable("movie_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  movieId: integer("movie_id").notNull(),
  rating: integer("rating").notNull(),
  review: text("review").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertMovieReview = typeof movieReviews.$inferInsert;
export type SelectMovieReview = typeof movieReviews.$inferSelect;
