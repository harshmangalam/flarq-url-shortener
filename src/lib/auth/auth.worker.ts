import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Context } from "hono";
import { getDB } from "@/lib/db/db.worker";
import * as schema from "@/lib/db/schema";

export const createAuth = (c: Context) => {
  const db = getDB(c);
  const trustedOrigins =
    c.env.TRUSTED_ORIGINS?.split(",")
      .map((o: string) => o.trim())
      .filter(Boolean) ?? [];

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    // Allow requests from the frontend development server
    trustedOrigins,
    basePath: "/api/v1/auth",
  });
};

export type AuthInstance = ReturnType<typeof createAuth>;

export type AuthType = {
  user: AuthInstance["$Infer"]["Session"]["user"] | null;
  session: AuthInstance["$Infer"]["Session"]["session"] | null;
};
