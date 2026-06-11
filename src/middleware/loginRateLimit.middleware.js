import { ApiError } from "../utils/ApiError.js";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 3;
const attempts = new Map();
let lastCleanupAt = 0;

function cleanupExpired(now) {
  if (now - lastCleanupAt < WINDOW_MS) return;

  for (const [key, entry] of attempts.entries()) {
    if (entry.windowExpiresAt <= now) attempts.delete(key);
  }

  lastCleanupAt = now;
}

function getLoginKey(req) {
  const email = typeof req.body?.email === "string" ? req.body.email.toLowerCase().trim() : "unknown";
  return `${req.ip}:${email}`;
}

function getRetryAfterSeconds(entry, now) {
  if (!entry?.blockedUntil) return WINDOW_MS / 1000;
  return Math.max(1, Math.ceil((entry.blockedUntil - now) / 1000));
}

export function limitAdminLogin(req, res, next) {
  const now = Date.now();
  cleanupExpired(now);

  const key = getLoginKey(req);
  const current = attempts.get(key);

  if (current?.blockedUntil && current.blockedUntil > now) {
    res.set("Retry-After", String(getRetryAfterSeconds(current, now)));
    throw new ApiError(429, "Too many login attempts. Please try again later.");
  }

  res.on("finish", () => {
    if (res.statusCode < 400) {
      attempts.delete(key);
      return;
    }

    const latest = attempts.get(key);
    const windowStart = latest && latest.windowExpiresAt > now ? latest.windowStart : now;
    const windowExpiresAt = latest && latest.windowExpiresAt > now ? latest.windowExpiresAt : now + WINDOW_MS;
    const count = latest && latest.windowExpiresAt > now ? latest.count + 1 : 1;

    attempts.set(key, {
      count,
      windowStart,
      windowExpiresAt,
      blockedUntil: count >= MAX_ATTEMPTS ? windowExpiresAt : null,
    });
  });

  next();
}
