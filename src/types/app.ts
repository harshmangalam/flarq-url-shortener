import { D1Database, KVNamespace } from "@cloudflare/workers-types";

export type Bindings = {
  DB: D1Database;
  DOMAIN: string;
  KV: KVNamespace;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
};
