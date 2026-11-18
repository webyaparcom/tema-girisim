/* menu-ada — Yüzen kapsül (ada) menü + mobil alt çekmece (15 Kas 2026, G3 · mcp:webmaker/20261115-202336-i5p2).
   Yer tutucular (koşulsuz): adasinif adaogeler adasayfa adacta. {{langbar}} motor çözer; @anahtar@ lang.json'dan (24 dil).
   Öğeler: @home@ + pagesetting sayfaları (status play, category "") + json.data[] ek bağlantıları ({name{dil…}, url}).
   Metin varsayılanı yok: CTA yalnız desing.cta_ad (dil sözlüğü) + cta_url doluysa basılır — dil listesi ezberi yok (D18). */
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return String(v[json.lang] ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const href = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|data):/i.test(s)) return "";
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s)) return s;
  return wxLangInternalHref(s);
};
const dogru = (v, d) => (v === undefined || v === null || v === "") ? d : !(v === false || v === "false" || v === 0 || v === "0");

const { desing: des = {}, data: ek = [] } = json;
const sayfa = page || {};
const stil = ["cam", "dolu", "cizgi"].includes(String(des.stil || "").trim()) ? String(des.stil).trim() : "cam";

const ogeler = [{ ad: "@home@", href: wxLangInternalHref(""), aktif: !sayfa.path }];
const ps = Array.isArray(webmakerdata?.pagesetting?.data)
  ? webmakerdata.pagesetting.data.find((it) => it?.modulestatus?.page)
  : null;
const satirlar = ps && Array.isArray(webmakerdata?.[ps.path]?.data) ? webmakerdata[ps.path].data : [];
for (const r of satirlar) {
  if (!r || r.status !== "play" || (r.category || "") !== "") continue;
  const ad = pick(r.name).trim();
  if (!ad) continue;
  ogeler.push({ ad: esc(ad), href: wxLangInternalHref(r.pathnext || r.path || ""), aktif: !!sayfa.path && sayfa.path === r.path });
}
for (const e of Array.isArray(ek) ? ek : []) {
  const ad = pick(e?.name ?? e?.text).trim();
  const url = href(e?.url ?? e?.href);
  if (ad && url) ogeler.push({ ad: esc(ad), href: url, aktif: false });
}

const li = (o, sinif) => `<li><a class="${sinif}" href="${esc(o.href)}"${o.aktif ? ' aria-current="page"' : ""}>${o.ad}</a></li>`;
const adaOgeler = ogeler.map((o) => li(o, "modulex-ada-oge")).join("");
const adaSayfa = ogeler.map((o) => li(o, "modulex-ada-sayfa-oge")).join("");

const ctaAd = pick(des.cta_ad).trim();
const ctaUrl = href(des.cta_url);
const adaCta = ctaAd && ctaUrl ? `<a class="modulex-ada-cta" href="${esc(ctaUrl)}">${esc(ctaAd)}</a>` : "";

const adaSinif = [
  ` modulex-ada--${stil}`,
  dogru(des.sticky, true) ? " modulex-ada--sticky" : "",
  adaCta ? " modulex-ada--ctali" : "",
].join("");

html = html
  .replaceAll("{{adasinif}}", () => adaSinif)
  .replaceAll("{{adaogeler}}", () => adaOgeler)
  .replaceAll("{{adasayfa}}", () => adaSayfa)
  .replaceAll("{{adacta}}", () => adaCta);

/* 16 Kas 2026 (mcp:webmaker/20261116-113333-ovs8): desing.logoimg / logoimgs {dil: dosya} — header'a özel logo (ust-* · menu-2 ile aynı anahtar).
   Boşsa desing.logo / {{logo}} aynen (geriye uyumlu); setting.logo değişmez → footer/SEO/og logosu aynı kalır. */
(function () {
  var d = (json && json.desing) || {};
  var l = d.logoimgs;
  var v = l && typeof l === "object" && l[json.lang] ? l[json.lang] : d.logoimg;
  var s = typeof v === "string" ? v.trim() : "";
  if (!s || !/^[^"'<>\s]+$/.test(s) || /^(javascript|vbscript|file|data):/i.test(s)) return;
  var src = s.charAt(0) === "/" || /^https?:\/\//i.test(s) ? s : "/img/" + s;
  html = html.replace(/\/img\/\{\{logo\}\}/g, function () { return src; });
})();
