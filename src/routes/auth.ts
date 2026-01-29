import { createAuth } from "@/lib/auth/auth.worker";
import { createRouter } from "@/utils/router";

const authRoutes = createRouter({ strict: false });

authRoutes.on(["POST", "GET"], "*", (c) => {
  const auth = createAuth(c);
  return auth.handler(c.req.raw);
});

export default authRoutes;
