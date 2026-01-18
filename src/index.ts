import { Hono } from "hono";
import { HTTP_STATUS } from "./utils/http-status";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const api = new Hono().basePath("/api/v1");

api.post("/urls", async (c) => {
  return c.json({
    shortUrl: "https://yourdomain.com/abc123",
    shortCode: "abc123",
    longUrl: "https://example.com/very/long/path",
  });
});

app.route("/", api);
app.get("/:shortCode", async (c) => {
  const longUrl = "http://localhost:8787";
  return c.redirect(longUrl, HTTP_STATUS.FOUND);
});

export default app;
