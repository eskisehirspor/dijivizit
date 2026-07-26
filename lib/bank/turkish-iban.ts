/**
 * Turkish IBAN helpers.
 *
 * TR IBAN layout (26 chars, no spaces):
 * TR + 2 check digits + 5-digit bank code + remaining account digits.
 */

/** Major Turkish bank codes → display names (TCMB / EFT codes). */
const TURKISH_BANK_CODES: Record<string, string> = {
  "00001": "Türkiye Cumhuriyet Merkez Bankası",
  "00010": "Ziraat Bankası",
  "00012": "Halkbank",
  "00015": "VakıfBank",
  "00032": "TEB",
  "00046": "Akbank",
  "00059": "Şekerbank",
  "00062": "Garanti BBVA",
  "00064": "İş Bankası",
  "00067": "Yapı Kredi",
  "00099": "ING",
  "00103": "Fibabanka",
  "00111": "QNB Finansbank",
  "00123": "HSBC",
  "00134": "DenizBank",
  "00135": "Anadolubank",
  "00146": "Odeabank",
  "00203": "Albaraka Türk",
  "00205": "Kuveyt Türk",
  "00206": "Türkiye Finans",
  "00209": "Ziraat Katılım",
  "00210": "Vakıf Katılım",
  "00211": "Emlak Katılım",
};

/** Strip spaces and uppercase for storage / comparison. */
export function normalizeIban(raw: string): string {
  return raw.replace(/\s+/g, "").toUpperCase();
}

/** Formats a normalized IBAN into groups of 4 for display. */
export function formatIbanDisplay(iban: string): string {
  const normalized = normalizeIban(iban);
  return normalized.replace(/(.{4})/g, "$1 ").trim();
}

/** Extracts the 5-digit Turkish bank code, or null if not a TR IBAN. */
export function turkishBankCodeFromIban(iban: string): string | null {
  const normalized = normalizeIban(iban);
  if (!normalized.startsWith("TR") || normalized.length !== 26) {
    return null;
  }
  const code = normalized.slice(4, 9);
  return /^\d{5}$/.test(code) ? code : null;
}

/** Resolves a Turkish bank display name from IBAN, or null when unknown. */
export function detectTurkishBankName(iban: string): string | null {
  const code = turkishBankCodeFromIban(iban);
  if (!code) {
    return null;
  }
  return TURKISH_BANK_CODES[code] ?? null;
}

/** Sorted unique bank names for manual selection. */
export function turkishBankNames(): string[] {
  return [...new Set(Object.values(TURKISH_BANK_CODES))].sort((a, b) => a.localeCompare(b, "tr"));
}
