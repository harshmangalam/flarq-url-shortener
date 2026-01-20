import urlsRoutes from "./routes/urls";
import urlRedirectRoutes from "./routes/urls-redirect";
import { createRouter } from "./utils/router";

const app = createRouter();
const apiRoutes = createRouter().basePath("/api/v1");

apiRoutes.route("/", urlsRoutes);

app.route("/", apiRoutes);
app.route("/", urlRedirectRoutes);

export default app;
