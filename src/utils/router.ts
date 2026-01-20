import { Hono } from "hono";
import type { Bindings } from "@/types/app";

export const createRouter = () => new Hono<{ Bindings: Bindings }>();
