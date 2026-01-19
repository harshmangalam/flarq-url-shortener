import { Hono } from "hono";
import { HTTP_STATUS, STATUS_TEXT } from "./utils/http-status";
import { drizzle } from "drizzle-orm/d1";
import { urlsTable } from "./db/schema/urls";
import { encodeBase62 } from "./utils/base62";
import { eq } from "drizzle-orm";
import { KVNamespace, D1Database } from "@cloudflare/workers-types";
type Bindings = {
  DB: D1Database;
  DOMAIN: string;
  KV: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const api = new Hono<{ Bindings: Bindings }>().basePath("/api/v1");

api.post("/urls", async (c) => {
  // parse the request json body
  const { longUrl } = await c.req.json();

  const db = drizzle(c.env.DB);
  const [{ id, createdAt }] = await db
    .insert(urlsTable)
    .values({
      longUrl,
    })
    .returning({ id: urlsTable.id, createdAt: urlsTable.createdAt });

  const shortCode = encodeBase62(id);
  await db.update(urlsTable).set({ shortCode }).where(eq(urlsTable.id, id));

  const domain = c.env.DOMAIN;
  return c.json({
    shortUrl: `${domain}/${shortCode}`,
    shortCode: shortCode,
    longUrl,
    createdAt,
  });
});

app.route("/", api);

app.get("/:shortCode", async (c) => {
  const shortCode = c.req.param("shortCode");

  // validate base62
  if (!/^[a-zA-Z0-9]+$/.test(shortCode)) {
    return c.text("Not found", 404);
  }

  const cacheKey = `short:${shortCode}`;
  const cached = await c.env.KV.get(cacheKey);

  if (cached) {
    return c.redirect(cached, HTTP_STATUS.FOUND);
  }

  const db = drizzle(c.env.DB);
  const result = await db
    .select({ longUrl: urlsTable.longUrl })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, shortCode))
    .limit(1);

  if (result.length === 0) {
    return c.text(STATUS_TEXT[HTTP_STATUS.NOT_FOUND], HTTP_STATUS.NOT_FOUND);
  }

  const longUrl = result[0].longUrl;

  // cache result in kv
  await c.env.KV.put(cacheKey, longUrl);
  return c.redirect(longUrl, HTTP_STATUS.FOUND);
});

export default app;
