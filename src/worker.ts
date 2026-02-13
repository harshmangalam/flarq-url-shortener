import { createAuth } from "./lib/auth/auth.worker";
import authRoutes from "./routes/auth";
import urlsRoutes from "./routes/urls";
import urlRedirectRoutes from "./routes/urls-redirect";
import { createRouter } from "./utils/router";
export { ClickCounter } from "@/durable";
const app = createRouter();

// auth middleware
app.use("*", async (c, next) => {
  const auth = createAuth(c);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    c.set("user", null);
    c.set("session", null);
    await next();
    return;
  }
  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});

app
  .route("/api/v1/urls", urlsRoutes)
  .route("/api/v1/auth", authRoutes)
  .route("/", urlRedirectRoutes);

export default app;
