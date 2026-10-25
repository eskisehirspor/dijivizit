import "server-only";

import { strToU8, zipSync } from "fflate";
import forge from "node-forge";

import { serverEnv } from "@/lib/env/server";
import { createAdminClient } from "@/lib/supabase/admin";

import { PASS_IMAGES } from "./assets";

export type AppleWalletConfig = {
  passTypeId: string;
  teamId: string;
  certPem: string;
  keyPem: string;
  wwdrPem: string;
};

/**
 * Signing material comes from Worker secrets when set, otherwise from the
 * service-role-only integration_tokens table (filled by the wallet-setup workflow).
 */
export async function getAppleWalletConfig(): Promise<AppleWalletConfig | null> {
  const env = {
    passTypeId: serverEnv.APPLE_PASS_TYPE_ID,
    teamId: serverEnv.APPLE_TEAM_ID,
    certPem: serverEnv.APPLE_PASS_CERT,
    keyPem: serverEnv.APPLE_PASS_KEY,
    wwdrPem: serverEnv.APPLE_WWDR_CERT,
  };
  if (Object.values(env).every(Boolean)) return env as AppleWalletConfig;

  const { data } = await createAdminClient()
    .from("integration_tokens")
    .select("name, token")
    .in("name", [
      "apple_pass_type_id",
      "apple_team_id",
      "apple_pass_cert",
      "apple_pass_key",
      "apple_wwdr_cert",
    ]);
  const get = (n: string) => data?.find((r) => r.name === n)?.token;
  const config = {
    passTypeId: env.passTypeId ?? get("apple_pass_type_id"),
    teamId: env.teamId ?? get("apple_team_id"),
    certPem: env.certPem ?? get("apple_pass_cert"),
    keyPem: env.keyPem ?? get("apple_pass_key"),
    wwdrPem: env.wwdrPem ?? get("apple_wwdr_cert"),
  };
  return Object.values(config).every(Boolean) ? (config as AppleWalletConfig) : null;
}

export type PassCard = {
  slug: string;
  url: string;
  fullName: string;
  title: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
};

function b64ToU8(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

function sha1Hex(bytes: Uint8Array): string {
  const md = forge.md.sha1.create();
  md.update(forge.util.binary.raw.encode(bytes));
  return md.digest().toHex();
}

export function buildPassJson(
  card: PassCard,
  config: Pick<AppleWalletConfig, "passTypeId" | "teamId">,
) {
  const secondary = [
    card.title ? { key: "title", label: "UNVAN", value: card.title } : null,
    card.company ? { key: "company", label: "ŞİRKET", value: card.company } : null,
  ].filter(Boolean);
  const back = [
    card.phone ? { key: "phone", label: "Telefon", value: card.phone } : null,
    card.email ? { key: "email", label: "E-posta", value: card.email } : null,
    { key: "url", label: "Dijital kartvizit", value: card.url },
  ].filter(Boolean);

  return {
    formatVersion: 1,
    passTypeIdentifier: config.passTypeId,
    teamIdentifier: config.teamId,
    serialNumber: `dijivizit-${card.slug}`,
    organizationName: "Dijivizit",
    description: `${card.fullName} — dijital kartvizit`,
    logoText: "Dijivizit",
    backgroundColor: "rgb(17, 17, 17)",
    foregroundColor: "rgb(255, 255, 255)",
    labelColor: "rgb(170, 170, 170)",
    sharingProhibited: false,
    generic: {
      primaryFields: [{ key: "name", label: "", value: card.fullName }],
      secondaryFields: secondary,
      backFields: back,
    },
    barcodes: [
      {
        format: "PKBarcodeFormatQR",
        message: card.url,
        messageEncoding: "iso-8859-1",
        altText: "Okutun, kartım açılsın",
      },
    ],
  };
}

/** Builds a signed .pkpass (a zip with pass.json, images, manifest and a PKCS#7 signature). */
export function buildPkpass(card: PassCard, config: AppleWalletConfig): Uint8Array {
  const files: Record<string, Uint8Array> = {
    "pass.json": strToU8(JSON.stringify(buildPassJson(card, config))),
  };
  for (const [name, b64] of Object.entries(PASS_IMAGES)) files[name] = b64ToU8(b64);

  const manifest: Record<string, string> = {};
  for (const [name, bytes] of Object.entries(files)) manifest[name] = sha1Hex(bytes);
  const manifestJson = JSON.stringify(manifest);

  const p7 = forge.pkcs7.createSignedData();
  p7.content = forge.util.createBuffer(manifestJson, "utf8");
  const cert = forge.pki.certificateFromPem(config.certPem);
  p7.addCertificate(cert);
  p7.addCertificate(forge.pki.certificateFromPem(config.wwdrPem));
  p7.addSigner({
    key: forge.pki.privateKeyFromPem(config.keyPem),
    certificate: cert,
    digestAlgorithm: forge.pki.oids.sha256!,
    authenticatedAttributes: [
      { type: forge.pki.oids.contentType!, value: forge.pki.oids.data! },
      { type: forge.pki.oids.messageDigest! },
      { type: forge.pki.oids.signingTime!, value: new Date() as unknown as string },
    ],
  });
  p7.sign({ detached: true });
  const der = forge.asn1.toDer(p7.toAsn1()).getBytes();

  return zipSync({
    ...files,
    "manifest.json": strToU8(manifestJson),
    signature: Uint8Array.from(der, (c) => c.charCodeAt(0)),
  });
}
