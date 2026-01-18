# 📍 Flarq URL Shortener

A simple, scalable, and cloud‑native URL shortening service built with
**Cloudflare Workers**, **D1 (SQLite)**, **Cloudflare KV**, and **Drizzle ORM**.  
Designed for performance, low latency, and future extensibility.

---

## 🚀 Features

✔ Shorten long URLs into compact Base62 codes  
✔ Redirect short URLs to original destinations  
✔ Stored in SQL (D1) for consistency  
✔ Hot reads cached in Cloudflare KV  
✔ Edge‑first architecture for low latency  
✔ TypeScript + Drizzle ORM for readability and type safety

---

## 🧠 Tech Stack

| Layer      | Technology             |
| ---------- | ---------------------- |
| Runtime    | Cloudflare Workers     |
| Database   | Cloudflare D1 (SQLite) |
| Cache      | Cloudflare KV          |
| ORM        | Drizzle ORM            |
| Utils      | TypeScript             |
| Deployment | Wrangler               |

---

## 📦 Architecture

```
Client
↓
POST /api/v1/urls → Cloudflare Worker (API)
↳ D1 (CRUD)
↳ KV (Cache)
GET /{shortCode} → Cloudflare Worker (Redirect)
↳ KV first → fallback to D1

```

```txt
pnpm install
pnpm run dev
```

```txt
pnpm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
pnpm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>();
```
