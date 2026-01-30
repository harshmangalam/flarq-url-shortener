export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,

  // Redirection
  FOUND: 302,

  // Client errors
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  GONE: 410,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 402,

  // Server errors
  INTERNAL_SERVER_ERROR: 500,
} as const;

// status phrases for logging
export const STATUS_TEXT: Record<number, string> = {
  200: "OK",
  201: "Created",
  302: "Found",
  400: "Bad Request",
  404: "Not Found",
  500: "Internal Server Error",
  410: "Gone",
  403: "Forbidden",
  401: "Unauthenticated",
};
