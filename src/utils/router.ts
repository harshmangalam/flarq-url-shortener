import { Hono } from "hono";
import type { Bindings } from "@/types/app";
import { HonoOptions } from "hono/hono-base";

export const createRouter = (
  options?: HonoOptions<{
    Bindings: Bindings;
  }>,
) =>
  new Hono<{ Bindings: Bindings }>({
    ...options,
  });
