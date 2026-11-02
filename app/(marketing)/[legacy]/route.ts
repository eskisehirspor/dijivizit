/**
 * dijivizit.com used to belong to another business-card service, whose
 * customer pages lived at /<name> (e.g. /diyetbenimle, /suleymanoz/). Those
 * pages are gone for good, so any unknown single-segment path answers 410 Gone:
 * Google drops them from its index faster than with a 404, and someone who taps
 * an old card gets a clear page instead of an error.
 *
 * Every real route (/, /siparis, /kartvizit, /rehber, /yasal, /p, auth and
 * dashboard pages, files in /public) is a static segment and wins over this one.
 */
const PAGE = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Bu kartvizit artık burada değil — Dijivizit</title>
<link rel="icon" href="/favicon.ico">
<style>
*{box-sizing:border-box;margin:0}
body{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#fff;color:#121213;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:440px}
h1{font-size:28px;line-height:1.15;letter-spacing:-.02em;margin:20px 0 12px}
p{color:#5e5d59;line-height:1.55;font-size:16px}
.mark{width:40px;height:40px}
.links{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
a{display:inline-flex;align-items:center;height:44px;padding:0 20px;border-radius:999px;font-weight:600;font-size:15px;text-decoration:none}
.primary{background:#121213;color:#fff}
.secondary{border:1px solid #deddd9;color:#121213}
</style>
</head>
<body>
<main>
<svg class="mark" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="6" fill="#121213"/><circle cx="8.6" cy="12" r="1.35" fill="#fff"/><g fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"><path d="M12.1 8.3a4.6 4.6 0 0 1 0 7.4"/><path d="M15.4 5.9a8.6 8.6 0 0 1 0 12.2"/></g></svg>
<h1>Bu kartvizit artık bu adreste değil.</h1>
<p>Bu bağlantı, dijivizit.com adresini daha önce kullanan başka bir hizmete aitti ve kaldırıldı. Aradığınız kişiye başka bir kanaldan ulaşmanız gerekiyor.</p>
<p style="margin-top:12px">Kendi NFC kartvizitinizi isterseniz Dijivizit'e göz atın.</p>
<div class="links">
<a class="primary" href="/">Dijivizit'i tanıyın</a>
<a class="secondary" href="/siparis">Kartvizit sipariş et</a>
</div>
</main>
</body>
</html>`;

export function GET() {
  return new Response(PAGE, {
    status: 410,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex",
      "cache-control": "public, max-age=3600",
    },
  });
}

export function HEAD() {
  return new Response(null, { status: 410, headers: { "x-robots-tag": "noindex" } });
}
