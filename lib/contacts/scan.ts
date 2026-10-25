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

export const SCAN_PROMPT = `Bu bir kartvizit fotoğrafı. Üzerindeki bilgileri oku ve YALNIZCA şu JSON nesnesini döndür, başka hiçbir şey yazma:
{"fullName":"","title":"","company":"","phones":[],"emails":[],"website":"","address":""}
Kurallar: Kartta olmayan alanı boş bırak, tahmin etme. Türkçe karakterleri (ç, ğ, ı, İ, ö, ş, ü) koru. Telefonları kartta yazdığı gibi, cep telefonu varsa önce onu yaz. Fotoğraf bir kartvizit değilse tüm alanları boş döndür.`;

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
