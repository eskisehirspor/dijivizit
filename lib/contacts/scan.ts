/** Turns the model's JSON answer about a business card photo into form values. */

export type ScannedCard = {
  fullName: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
};

const EMPTY: ScannedCard = {
  fullName: "",
  title: "",
  company: "",
  phone: "",
  email: "",
  website: "",
  address: "",
};

export const SCAN_PROMPT = `This is a phone photo of a paper business card (it may be small in the frame, slightly tilted, or in low contrast). Read every line of printed text on the card carefully, including small print.
Return ONLY this JSON object, nothing else:
{"fullName":"","title":"","company":"","phones":[],"emails":[],"website":"","address":""}
Rules:
- fullName is the person's name (not the company). title is their job title. company is the company or brand name (a logo wordmark counts).
- phones: every number on the card as printed, mobile ("M", "GSM", "Cep", +90 5xx) first.
- Keep Turkish characters exactly (ç, ğ, ı, İ, ö, ş, ü); keep the person's capitalisation sensible ("Ayşe Demir", not "AYŞE DEMİR").
- Leave a field empty only if it is truly not on the card. Do not invent anything.
- If the photo shows no business card at all, return all fields empty.`;

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function parseScanResponse(text: string): ScannedCard {
  const match = /\{[\s\S]*\}/.exec(text);
  if (!match) return EMPTY;
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(match[0]) as Record<string, unknown>;
  } catch {
    return EMPTY;
  }
  const first = (v: unknown, max: number) =>
    Array.isArray(v)
      ? str(
          v.find((x) => typeof x === "string" && x.trim()),
          max,
        )
      : str(v, max);
  return {
    fullName: str(data.fullName, 120),
    title: str(data.title, 120),
    company: str(data.company, 120),
    phone: first(data.phones ?? data.phone, 40),
    email: first(data.emails ?? data.email, 254).toLowerCase(),
    website: str(data.website, 200),
    address: str(data.address, 300),
  };
}
