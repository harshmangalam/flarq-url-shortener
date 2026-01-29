import { defineConfig } from "drizzle-kit";

const LOCAL_DB_PATH = Bun.env.LOCAL_DB_PATH;
const CLOUDFLARE_ACCOUNT_ID = Bun.env.CLOUDFLARE_ACCOUNT_ID!;
const CLOUDFLARE_DATABASE_ID = Bun.env.CLOUDFLARE_DATABASE_ID!;
const CLOUDFLARE_D1_TOKEN = Bun.env.CLOUDFLARE_D1_TOKEN!;

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/lib/db/schema/*",
  out: "./migrations",
});
