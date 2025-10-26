import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const movieReview = pgTable("movie_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  movieId: integer("movie_id").notNull(),
  rating: integer("rating").notNull(),
  review: text("review").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertMovieReview = typeof movieReview.$inferInsert;
export type SelectMovieReview = typeof movieReview.$inferSelect;

export const userMetadata = pgTable("user_metadata", {
  userId: text("user_id")
    .references(() => user.id)
    .notNull()
    .primaryKey(),

  countryCode: text("country_code"),
  countryCodeLastUpdatedAt: timestamp("country_code_last_updated_at")
    // Default the timestamp to the origin of unix time
    .default(new Date(0))
    .notNull(),
});
