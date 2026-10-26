// Builds the customer guide PDF from kilavuz.html.
//   node marketing/kilavuz/build.mjs [out.pdf]
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = process.argv[2] || path.join(HERE, "dijivizit-kullanim-kilavuzu.pdf");

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || undefined,
});
const page = await browser.newPage();
await page.goto(`file://${path.join(HERE, "kilavuz.html")}`);
await page.evaluate(() => document.fonts.ready);
await page.waitForLoadState("networkidle");
await page.pdf({
  path: OUT,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate: `<div style="width:100%;padding:0 18mm;font:8px Helvetica,Arial,sans-serif;color:#8a8984;display:flex;justify-content:space-between"><span>Dijivizit · Kullanım ve doldurma kılavuzu</span><span class="pageNumber"></span></div>`,
});
await browser.close();
console.log(OUT);
