import { drizzle } from "drizzle-orm/d1";
import { urlsTable } from "../lib/db/schema/urls";
import { eq } from "drizzle-orm";
import { CachedUrl } from "../types/cache";
import { HTTP_STATUS, STATUS_TEXT } from "../utils/http-status";
import { createRouter } from "@/utils/router";
import { incrementClick } from "@/durable/click-counter";

const urlRedirectRoutes = createRouter();

urlRedirectRoutes.get("/:shortCode", async (c) => {
  const shortCode = c.req.param("shortCode");

  // validate base62
  if (!/^[a-zA-Z0-9]+$/.test(shortCode)) {
    return c.text("Not found", 404);
  }

  // check in cache and fetch data as json
  const cacheKey = `short:${shortCode}`;
  const cached = await c.env.KV.get<CachedUrl>(cacheKey, "json");

  if (cached) {
    // stop inactive link to redirect at cache level
    if (!cached.isActive) {
      return c.text("Link disabled", HTTP_STATUS.GONE);
    }
    // check url expirations at cache level
    if (cached.expiresAt && cached.expiresAt < Date.now()) {
      return c.text("Link expired", HTTP_STATUS.GONE);
    }

    incrementClick(c.env, shortCode);

    return c.redirect(cached.longUrl, HTTP_STATUS.FOUND);
  }

  const db = drizzle(c.env.DB);
  const result = await db
    .select({
      longUrl: urlsTable.longUrl,
      isActive: urlsTable.isActive,
      expiresAt: urlsTable.expiresAt,
    })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, shortCode))
    .limit(1);

  if (result.length === 0) {
    return c.text(STATUS_TEXT[HTTP_STATUS.NOT_FOUND], HTTP_STATUS.NOT_FOUND);
  }

  const row = result[0];

  // stop inactive link to redirect at db level
  if (!row.isActive) {
    return c.text("Link disabled", HTTP_STATUS.GONE);
  }

  // check url expirations at db level
  if (row.expiresAt && row.expiresAt.getTime() < Date.now()) {
    return c.text("Link expired", HTTP_STATUS.GONE);
  }

  // by default use 24h expiration otherwise use user input
  const expirationTtl = row.expiresAt
    ? Math.max(0, Math.floor((row.expiresAt.getTime() - Date.now()) / 1000))
    : 60 * 60 * 24;

  const longUrl = row.longUrl;

  /**
   * cache result in kv
   * store some metadata like isActive and expiredAt
   * metadata will be helpful to check early expirations and active status while redirecting from cache
   *  */

  await c.env.KV.put(
    cacheKey,
    JSON.stringify({
      longUrl: row.longUrl,
      isActive: row.isActive,
      expiresAt: row.expiresAt?.getTime() ?? null,
    }),
    { expirationTtl },
  );

  incrementClick(c.env, shortCode);
  return c.redirect(longUrl, HTTP_STATUS.FOUND);
});

export default urlRedirectRoutes;
