/** Copy for the indexable sections of dijivizit.com, shared by the page and
 * its JSON-LD so the structured data always matches what is on screen. */

export const USE_CASES = [
  {
    title: "Kurumsal ekipler",
    body: "Tüm ekibe aynı tasarımda kurumsal NFC kartvizit. Biri ayrıldığında ya da unvanı değiştiğinde kart değil, profil güncellenir.",
  },
  {
    title: "Satış ve emlak",
    body: "Müşteriyle tanıştığın anda telefon, WhatsApp ve konum tek dokunuşla onun rehberinde. Takip edilmeyen kartvizit kalmaz.",
  },
  {
    title: "Serbest çalışanlar",
    body: "Portfolyo, sosyal hesaplar, IBAN ve belgeler tek bir akıllı kartvizitte. Kağıt kartvizit bastırmana gerek kalmaz.",
  },
  {
    title: "Fuar ve etkinlikler",
    body: "Kalabalıkta kartvizit dağıtmak yerine dokun ya da QR kodu okut. Temassız kartvizit, gün sonunda tükenmez.",
  },
] as const;

export const COMPARISON = [
  ["Bilgi değişince", "Yeniden baskı", "Panelden anında güncelleme"],
  ["Paylaşım", "Elden ele, kaybolur", "NFC dokunuş veya QR kod"],
  ["İçerik", "Ad, telefon, e-posta", "Telefon, WhatsApp, sosyal, IBAN, belgeler"],
  ["Rehbere kayıt", "Elle yazılır", "Tek dokunuşla"],
  ["Ömür", "Bir baskı dönemi", "Yıllarca aynı kart"],
] as const;

export const FAQ = [
  {
    q: "NFC kartvizit nedir?",
    a: "NFC kartvizit, içinde NFC çip bulunan bir akıllı kartvizittir. Kartı bir telefonun arkasına dokundurduğunda dijital kartvizit profilin telefonda açılır; karşı taraf bilgilerini tek dokunuşla rehberine kaydeder.",
  },
  {
    q: "Karşı tarafın uygulama indirmesi gerekir mi?",
    a: "Hayır. Dijivizit profili telefonun tarayıcısında açılır. NFC desteklemeyen telefonlar kartın üzerindeki QR kodu kamerayla okutarak aynı profile ulaşır.",
  },
  {
    q: "Hangi telefonlarla çalışır?",
    a: "iPhone XS ve sonrası tüm iPhone modelleri ile NFC özelliği olan Android telefonlar kartı doğrudan okur. NFC kapalıysa veya yoksa QR kod her telefonda çalışır.",
  },
  {
    q: "Bilgilerim değişince kartı yeniden bastırmam gerekir mi?",
    a: "Hayır. Kart her zaman aynı profile yönlendirir. Telefonunu, unvanını ya da sosyal hesaplarını Dijivizit panelinden değiştirdiğin anda kartın da güncellenmiş olur.",
  },
  {
    q: "Akıllı kartvizitte hangi bilgileri paylaşabilirim?",
    a: "Telefon, WhatsApp, e-posta, web sitesi, LinkedIn ve diğer sosyal hesaplar, IBAN, adres ve paylaşmak istediğin belgeler. Hangisinin görüneceğine sen karar verirsin.",
  },
  {
    q: "Kartın pili ya da şarjı var mı?",
    a: "Yok. NFC çip enerjisini dokunulan telefondan alır; kart yıllarca şarjsız çalışır.",
  },
  {
    q: "Hangi kaplama seçenekleri var?",
    a: "Siyah metal, mat fırçalanmış gümüş, mat fırçalanmış gold, koyu ceviz ve açık meşe ahşap. Hepsinde adın ve logon lazerle kazınır, NFC ve QR aynı şekilde çalışır.",
  },
  {
    q: "Ekibim için toplu kartvizit alabilir miyim?",
    a: "Evet. Kurumsal NFC kartvizit siparişleri için merhaba@dijivizit.com adresine yaz; ekibinin sayısına ve kaplama tercihine göre dönüş yapalım.",
  },
] as const;

export const KEYWORDS = [
  "NFC kartvizit",
  "akıllı kartvizit",
  "dijital kartvizit",
  "temassız kartvizit",
  "dokunmatik kartvizit",
  "QR kod kartvizit",
  "QR kartvizit",
  "metal kartvizit",
  "gold kartvizit",
  "ahşap kartvizit",
  "kurumsal kartvizit",
  "NFC kart",
  "elektronik kartvizit",
  "online kartvizit",
  "kartvizit yerine NFC",
] as const;
