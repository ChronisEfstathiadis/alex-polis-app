import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";

export const PointsOfInterest = pgTable("points_of_interest", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image_url: text("image_url").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
