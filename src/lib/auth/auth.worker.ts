import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Context } from "hono";
import { getDB } from "@/lib/db/db.worker";

export const createAuth = (c: Context) => {
  const db = getDB(c);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
  });
};

export type AuthInstance = ReturnType<typeof createAuth>;
export type AuthType = {
  user: AuthInstance["$Infer"]["Session"]["user"] | null;
  session: AuthInstance["$Infer"]["Session"]["session"] | null;
};
