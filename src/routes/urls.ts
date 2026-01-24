import { drizzle } from "drizzle-orm/d1";
import { urlsTable } from "../db/schema/urls";
import { encodeBase62 } from "../utils/base62";
import { eq } from "drizzle-orm";
import { createRouter } from "@/utils/router";

const urlsRoutes = createRouter().basePath("/urls");

urlsRoutes.post("/", async (c) => {
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

export default urlsRoutes;
