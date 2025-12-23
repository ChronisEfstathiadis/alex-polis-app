import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto"; // Use built-in crypto module
import { users } from "./users.js"; // Add this import

export const events = pgTable("events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  user_id: text("user_id").references(() => users.id),
  title: text("name").notNull(),
  description: text("description"),
  start_date: timestamp("start_date").notNull(),
  end_date: timestamp("end_date"),
  location: text("location").notNull(),
  image_url: text("image_url").notNull(),
  category: text("category").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
