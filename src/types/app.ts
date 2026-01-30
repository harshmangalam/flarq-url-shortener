import { AuthType } from "@/lib/auth/auth.worker";
import { D1Database, KVNamespace } from "@cloudflare/workers-types";

export type AppBindings = {
  DB: D1Database;
  DOMAIN: string;
  KV: KVNamespace;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
};

export type AppVariables = {
  user: AuthType["user"] | null;
  session: AuthType["session"] | null;
};

export type AppEnv = {
  Bindings: AppBindings;
  Variables: AppVariables;
};
