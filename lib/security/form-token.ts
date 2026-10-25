import "server-only";

import { serverEnv } from "@/lib/env/server";

/**
 * A server-signed "form opened at" stamp. Bots that post straight to the
 * action without loading the page have no valid token; humans need at least
 * MIN_MS on the page and the token expires after MAX_MS.
 */
const MIN_MS = 3_000;
const MAX_MS = 6 * 60 * 60 * 1000;

async function hmac(value: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(`form-token:${serverEnv.SUPABASE_SECRET_KEY}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function issueFormToken(purpose: string, now = Date.now()): Promise<string> {
  const payload = `${purpose}.${now}`;
  return `${payload}.${await hmac(payload)}`;
}

export async function verifyFormToken(
  token: string,
  purpose: string,
  now = Date.now(),
): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [p, ts, sig] = parts as [string, string, string];
  if (p !== purpose) return false;
  const issued = Number(ts);
  if (!Number.isFinite(issued)) return false;
  const age = now - issued;
  if (age < MIN_MS || age > MAX_MS) return false;
  const expected = await hmac(`${p}.${ts}`);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}
