// Tells Bing, Yandex and other IndexNow engines about every URL in the live
// sitemap. The key is public by design: it is served at /<key>.txt.
const HOST = "dijivizit.com";
const KEY = "cb31d79c09e52dc106819dcf47b29948";

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) throw new Error("sitemap has no URLs");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  }),
});
console.log(`IndexNow: ${urlList.length} URLs → HTTP ${res.status}`);
if (res.status >= 400 && res.status !== 429) process.exit(1);
