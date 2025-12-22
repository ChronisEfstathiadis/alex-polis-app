import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull(),
  image_url: text("image_url"),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
