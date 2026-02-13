import { drizzle } from "drizzle-orm/d1";
import { urlsTable } from "../lib/db/schema/urls";
import { encodeBase62 } from "../utils/base62";
import { eq } from "drizzle-orm";
import { createRouter } from "@/utils/router";
import { sValidator } from "@hono/standard-validator";
import * as v from "valibot";
import { HTTP_STATUS, STATUS_TEXT } from "@/utils/http-status";
import { requireAuth } from "@/middleware/require-auth";
import { formattedJsonValidator } from "@/lib/validator";

const schema = v.object({
  longUrl: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your url."),
    v.url("The url is badly formatted."),
  ),
});

const urlsRoutes = createRouter();

urlsRoutes.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const urls = await db.select().from(urlsTable);
  const results = urls.map((url) => ({
    ...url,
    shortUrl: c.env.DOMAIN + "/" + url.shortCode,
  }));
  return c.json({
    success: true,
    data: {
      urls: results,
    },
  });
});
urlsRoutes.post(
  "/",
  sValidator("json", schema, (result, c) => {
    if (!result.success) {
      const formatted = formattedJsonValidator(result);
      return c.json(
        {
          success: false,
          message: STATUS_TEXT[HTTP_STATUS.BAD_REQUEST],
          errors: formatted,
        },
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }),
  requireAuth,
  async (c) => {
    const { longUrl } = c.req.valid("json");
    const user = c.get("user")!;

    const db = drizzle(c.env.DB);
    const [{ id, createdAt }] = await db
      .insert(urlsTable)
      .values({
        longUrl,
        userId: user.id,
      })
      .returning({ id: urlsTable.id, createdAt: urlsTable.createdAt });

    const shortCode = encodeBase62(id);
    await db.update(urlsTable).set({ shortCode }).where(eq(urlsTable.id, id));

    const domain = c.env.DOMAIN;
    return c.json(
      {
        success: true,
        data: {
          shortUrl: `${domain}/${shortCode}`,
          shortCode: shortCode,
          longUrl,
          createdAt,
        },
      },
      HTTP_STATUS.CREATED,
    );
  },
);

export default urlsRoutes;
