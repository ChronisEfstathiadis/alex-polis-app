import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Add this error handler!
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Test the connection immediately
pool
  .connect()
  .then(() => {
    console.log("Connected to Database successfully");
  })
  .catch((err) => {
    console.error("Failed to connect to Database:", err.message);
  });

export const db = drizzle(pool);
