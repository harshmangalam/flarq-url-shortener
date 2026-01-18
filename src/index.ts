import { Hono } from "hono";
import { HTTP_STATUS } from "./utils/http-status";
import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { urlsTable } from "./db/schema/urls";
import { encodeBase62 } from "./utils/base62";
import { eq } from "drizzle-orm";

type Bindings = {
  DB: DrizzleD1Database;
  DOMAIN: string;
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
  const longUrl = "http://localhost:8787";
  return c.redirect(longUrl, HTTP_STATUS.FOUND);
});

export default app;
