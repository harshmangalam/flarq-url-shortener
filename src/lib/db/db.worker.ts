import { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import { env } from "hono/adapter";
import * as schema from "./schema";

export const getDB = (c: Context) => {
  const { DB } = env<{ DB: D1Database }>(c);
  return drizzle(DB, {
    schema,
  });
};
