import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

pool
  .connect()
  .then((client) => {
    console.log("Connected to Database successfully");
    client.release();
  })
  .catch((err) => {
    console.error("Failed to connect to Database:", err.message);
  });

export const db = drizzle(pool);
