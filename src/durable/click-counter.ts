import { urlsTable } from "@/lib/db/schema";
import { AppBindings } from "@/types/app";
import { DurableObject } from "cloudflare:workers";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

type State = {
  count: number;
  shortCode?: string;
  alarmScheduled: boolean;
};

const FLUSH_INTERVAL_MS = 60 * 1000; // 1 min
const STORAGE_KEY = "countState";
const PERSIST_EVERY_N = 10; // Persist state every N increments to minimize loss without perf hit

export class ClickCounter extends DurableObject<AppBindings> {
  private count = 0;
  private shortCode?: string;
  private alarmScheduled = false;

  constructor(ctx: DurableObjectState, env: AppBindings) {
    super(ctx, env);

    ctx.blockConcurrencyWhile(async () => {
      const stored = await ctx.storage.get<State>(STORAGE_KEY);
      if (stored) {
        this.count = stored.count;
        this.shortCode = stored.shortCode;
        this.alarmScheduled = stored.alarmScheduled;
      }
    });
  }

  private increment(amount = 1) {
    this.count += amount;
    console.log(`[Increment]`, {
      shortCode: this.shortCode,
      count: this.count,
    });

    // Persist periodically during bursts to reduce potential loss (async to not block)
    if (this.count % PERSIST_EVERY_N === 0) {
      this.persistState().catch((err) =>
        console.error("Failed to persist during increment:", err),
      );
    }
  }

  private async persistState() {
    await this.ctx.storage.put(STORAGE_KEY, {
      count: this.count,
      shortCode: this.shortCode,
      alarmScheduled: this.alarmScheduled,
    });
  }

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/incr") {
      if (!this.shortCode) {
        const code = req.headers.get("x-short-code");
        if (!code) return new Response("Missing short code", { status: 400 });
        this.shortCode = code;
      }

      this.increment();

      // Schedule alarm if not already scheduled
      if (!this.alarmScheduled) {
        this.alarmScheduled = true;

        // Persist state immediately when scheduling
        await this.persistState();

        // Schedule alarm
        await this.ctx.storage.setAlarm(Date.now() + FLUSH_INTERVAL_MS);
      }

      return Response.json({ success: true });
    }

    return new Response("Not found", { status: 404 });
  }

  async alarm() {
    const count = this.count;
    const shortCode = this.shortCode;

    // Nothing to flush
    if (count === 0 || !shortCode) {
      this.alarmScheduled = false;
      await this.persistState();
      return;
    }

    // Flush to DB
    try {
      const db = drizzle(this.env.DB);
      await db
        .update(urlsTable)
        .set({ clicks: sql`${urlsTable.clicks} + ${count}` })
        .where(eq(urlsTable.shortCode, shortCode));
    } catch (err) {
      console.error(`Failed to flush to DB for ${shortCode}:`, err);
      return; // Don't reset on failure to avoid loss
    }

    console.log(`[Alarm]`, {
      shortCode,
      count,
    });

    // Reset counter only on successful flush
    this.count = 0;
    this.alarmScheduled = false;

    // Persist cleared state
    await this.persistState();

    // No unconditional reschedule; next increment will handle if needed
  }
}

// Helper to increment clicks from outside (unchanged)
export function incrementClick(env: AppBindings, shortCode: string) {
  try {
    const id = env.CLICK_COUNTER.idFromName(shortCode);
    const counter = env.CLICK_COUNTER.get(id);

    counter
      .fetch("https://counter/incr", {
        method: "POST",
        headers: { "x-short-code": shortCode },
      })
      .catch((err) => console.warn("Fetch counter incr failed", err));
  } catch {
    // never let analytics break redirect
  }
}
