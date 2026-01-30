import { Hono } from "hono";
import type { AppEnv } from "@/types/app";
import { HonoOptions } from "hono/hono-base";

export const createRouter = (options?: HonoOptions<AppEnv>) =>
  new Hono<AppEnv>({
    ...options,
  });
