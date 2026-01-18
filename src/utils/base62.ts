const BASE62_CHARS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = 62;

/**
 * Encode a numeric ID to Base62 string
 */
export function encodeBase62(num: number): string {
  if (num === 0) return BASE62_CHARS[0];

  let str = "";
  while (num > 0) {
    const remainder = num % BASE;
    str = BASE62_CHARS[remainder] + str;
    num = Math.floor(num / BASE);
  }

  return str;
}

/**
 * Decode a Base62 string back to numeric ID
 */
export function decodeBase62(str: string): number {
  let num = 0;

  for (const char of str) {
    const index = BASE62_CHARS.indexOf(char);
    if (index === -1) throw new Error(`Invalid Base62 character: ${char}`);
    num = num * BASE + index;
  }

  return num;
}
