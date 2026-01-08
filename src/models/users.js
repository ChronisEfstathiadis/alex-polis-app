import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull(),
  image_url: text("image_url"),
  role: text("role").default("user").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  theme: text("theme").default("light").notNull(),
  language: text("language").default("en").notNull(),
  user_type: text("user_type").default("local").notNull(),
  opt_in_events_push: boolean("opt_in_events_push").default(false).notNull(),
  opt_in_events_email: boolean("opt_in_events_email").default(false).notNull(),
  onboarding_step: integer("onboarding_step").default(0).notNull(),
  onboarding_completed: boolean("onboarding_completed ")
    .default(false)
    .notNull(),
});
