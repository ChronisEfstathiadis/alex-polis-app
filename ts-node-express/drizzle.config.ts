import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
import { resolve } from "path";

// Load .env from project root
dotenv.config({ path: resolve(process.cwd(), ".env") });

export default {
  schema: "./src/db/schema/user.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || "admin",
    password: process.env.DB_PASSWORD || "admin123",
    database: process.env.DB_NAME || "alex_poli_db",
    ssl: false,
  },
} satisfies Config;
