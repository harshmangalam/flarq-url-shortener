import { HTTP_STATUS, STATUS_TEXT } from "@/utils/http-status";
import { createMiddleware } from "hono/factory";

export const requireAuth = createMiddleware(async (c, next) => {
  const user = c.get("user");

  if (!user) {
    return c.json(
      {
        success: false,
        message: STATUS_TEXT[HTTP_STATUS.UNAUTHENTICATED],
      },
      HTTP_STATUS.UNAUTHENTICATED,
    );
  }

  await next();
});
