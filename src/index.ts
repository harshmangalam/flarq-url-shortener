import authRoutes from "./routes/auth";
import urlsRoutes from "./routes/urls";
import urlRedirectRoutes from "./routes/urls-redirect";
import { createRouter } from "./utils/router";

const app = createRouter();

app
  .route("/api/v1/urls", urlsRoutes)
  .route("/api/v1/auth", authRoutes)
  .route("/", urlRedirectRoutes);

export default app;
