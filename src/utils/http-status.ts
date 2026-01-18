export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,

  // Redirection
  FOUND: 302,

  // Client errors
  BAD_REQUEST: 400,

  // Server errors
  INTERNAL_SERVER_ERROR: 500,
} as const;

// status phrases for logging
export const STATUS_TEXT: Record<number, string> = {
  200: "OK",
  201: "Created",
  302: "Found",
  400: "Bad Request",
  500: "Internal Server Error",
};
