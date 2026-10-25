import { unzipSync, strFromU8 } from "fflate";
import forge from "node-forge";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/env/server", () => ({ serverEnv: {} }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: () => ({}) }));

const { buildPkpass } = await import("@/lib/wallet/apple");

function selfSigned(cn: string) {
  const keys = forge.pki.rsa.generateKeyPair(1024);
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = "01";
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date(Date.now() + 86400000);
  cert.setSubject([{ name: "commonName", value: cn }]);
  cert.setIssuer([{ name: "commonName", value: cn }]);
  cert.sign(keys.privateKey, forge.md.sha256.create());
  return {
    cert: forge.pki.certificateToPem(cert),
    key: forge.pki.privateKeyToPem(keys.privateKey),
  };
}

describe("apple wallet pass", () => {
  it("builds a zip with manifest hashes and a detached signature", () => {
    const signer = selfSigned("Pass Type ID: pass.test");
    const wwdr = selfSigned("WWDR");
    const pkpass = buildPkpass(
      {
        slug: "abcDEF12345",
        url: "https://app.dijivizit.com/p/abcDEF12345",
        fullName: "Ayşe Yılmaz",
        title: "Satış Müdürü",
        company: "Acme",
        phone: null,
        email: null,
      },
      {
        passTypeId: "pass.test",
        teamId: "TEAM123456",
        certPem: signer.cert,
        keyPem: signer.key,
        wwdrPem: wwdr.cert,
      },
    );
    const files = unzipSync(pkpass);
    expect(Object.keys(files)).toEqual(
      expect.arrayContaining(["pass.json", "manifest.json", "signature", "icon.png", "logo.png"]),
    );
    const pass = JSON.parse(strFromU8(files["pass.json"]!));
    expect(pass.barcodes[0].message).toBe("https://app.dijivizit.com/p/abcDEF12345");
    expect(pass.generic.primaryFields[0].value).toBe("Ayşe Yılmaz");
    const manifest = JSON.parse(strFromU8(files["manifest.json"]!));
    const md = forge.md.sha1.create();
    md.update(forge.util.binary.raw.encode(files["pass.json"]!));
    expect(manifest["pass.json"]).toBe(md.digest().toHex());
    const p7 = forge.pkcs7.messageFromAsn1(
      forge.asn1.fromDer(forge.util.binary.raw.encode(files.signature!)),
    ) as forge.pkcs7.PkcsSignedData;
    expect(p7.certificates).toHaveLength(2);
  });
});
