import urlsRoutes from "./routes/urls";
import urlRedirectRoutes from "./routes/urls-redirect";
import { createRouter } from "./utils/router";

const app = createRouter();

app.route("/api/v1", urlsRoutes);
app.route("/", urlRedirectRoutes);

export default app;
