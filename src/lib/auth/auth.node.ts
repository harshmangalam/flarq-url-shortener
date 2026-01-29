import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/better-sqlite3";

const db = drizzle();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
});

export default auth;
