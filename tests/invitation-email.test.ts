import { describe, expect, it } from "vitest";

import { buildInvitationEmail } from "@/lib/email/invitation";

const base = {
  code: "DIJI-ABCD-EFGH-JKMN",
  registerUrl: "https://app.dijivizit.com/register?invite=DIJI-ABCD-EFGH-JKMN",
  expiresAt: null,
  assetOrigin: "https://app.dijivizit.com/",
};

describe("buildInvitationEmail", () => {
  it("includes the code, the prefilled register link and the hosted logo", () => {
    const email = buildInvitationEmail(base);

    expect(email.subject).toBe("Dijivizit'e davetlisin");
    expect(email.html).toContain("DIJI-ABCD-EFGH-JKMN");
    expect(email.html).toContain(
      'href="https://app.dijivizit.com/register?invite=DIJI-ABCD-EFGH-JKMN"',
    );
    expect(email.html).toContain('src="https://app.dijivizit.com/email/logomark.png"');
    expect(email.html).toContain("Son kullanım tarihi yok");
    expect(email.text).toContain("Davet kodun: DIJI-ABCD-EFGH-JKMN");
  });

  it("shows the expiry and escapes interpolated values", () => {
    const email = buildInvitationEmail({
      ...base,
      expiresAt: "1 Kasım 2026 <b>23:59</b>",
      registerUrl: 'https://x.test/register?a="b"&c=1',
    });

    expect(email.html).toContain("Son kullanım: 1 Kasım 2026 &lt;b&gt;23:59&lt;/b&gt;");
    expect(email.html).toContain("https://x.test/register?a=&quot;b&quot;&amp;c=1");
    expect(email.html).not.toContain("<b>23:59</b>");
  });
});

describe("buildInvitationEmail markup", () => {
  it("never puts a double quote inside a style attribute", () => {
    const { html } = buildInvitationEmail(base);
    for (const match of html.matchAll(/style="([^"]*)"/g)) {
      expect(match[1]).not.toMatch(/[<>]/);
    }
    // Every style attribute must end with a declaration, not mid-font-stack.
    expect(html).not.toMatch(/style="[^"]*font-family:[^;"]*"\s*[A-Za-z]/);
  });
});
