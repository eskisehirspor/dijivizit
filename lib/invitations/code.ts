import { createHash, randomBytes } from "node:crypto";

export const INVITATION_CODE_PATTERN =
  /^DIJI-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const GROUP_LENGTH = 4;
const GROUP_COUNT = 3;

export function normalizeInvitationCode(value: string): string {
  return value.trim().toUpperCase();
}

export function normalizeInvitationEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function hashInvitationCode(code: string): string {
  return createHash("sha256").update(normalizeInvitationCode(code), "utf8").digest("hex");
}

function unbiasedChar(byte: number): string | null {
  const alphabetSize = ALPHABET.length;
  const maxUnbiased = Math.floor(256 / alphabetSize) * alphabetSize;

  if (byte >= maxUnbiased) {
    return null;
  }

  return ALPHABET[byte % alphabetSize] ?? null;
}

function randomGroup(): string {
  let result = "";

  while (result.length < GROUP_LENGTH) {
    const buffer = randomBytes(GROUP_LENGTH * 2);

    for (const byte of buffer) {
      if (result.length >= GROUP_LENGTH) {
        break;
      }

      const char = unbiasedChar(byte);
      if (char) {
        result += char;
      }
    }
  }

  return result;
}

export function generateInvitationCode(): string {
  const groups = Array.from({ length: GROUP_COUNT }, () => randomGroup());
  return `DIJI-${groups.join("-")}`;
}
