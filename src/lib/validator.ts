import { HTTP_STATUS, STATUS_TEXT } from "@/utils/http-status";
import { sValidator } from "@hono/standard-validator";

export const formattedJsonValidator = (result: any) => {
  const formatted = result.error.map((err: any) => ({
    field: err.path?.map((p: any) => p.key).join(","),
    message: err.message,
    value: err?.input,
    type: err.type,
  }));

  return formatted;
};
