/* =====================================================================
   Free, offline "smart" brain for the website chatbot.
   Searches the site's own content (FAQs, services, policies, blog articles) with
   - synonym mapping (English + Gujarati/Hindi in roman and native script),
   - typo tolerance (1–2 letter mistakes),
   - word-importance weighting (rare words count more than common ones).
   No API key, no server, no cost – it runs in the visitor's browser.
   ===================================================================== */

const STOP = new Set(
  ("a an the is are am was were be been do does did can could would should will shall may might i me my mine we our us you your yours " +
    "it its this that these those to of in on at for from with by about as and or but if so than then there here what which who whom " +
    "how when where why please tell know want need like get give some any just also very much more most have has had take takes " +
    "su shu che chhe cho chho hai hain ho kya kaise kai koi mane mare maru tame tamaru tamari aap apna apne mujhe mera meri hum ame " +
    "ne nu na ni no ma thi pan to ke ki ka ko se hi bhi ane ya thay thase thashe hoy").split(" ")
);

/* every word on the right is mapped to the canonical word on the left */
const SYN = {
  price: "price prices pricing cost costs costing charge charges charged fee fees rate rates quote quotation quotations estimate estimates budget kimat kimmat kitna kitne kitni ketla ketlu ketli kharch kharcho paisa paise rupees rupee rupiya rupiye rs inr dollar usd expensive cheap affordable કિંમત ખર્ચ કેટલા કેટલું कीमत खर्च कितना",
  build: "build building built create creating develop developing developed development make making banavvu banavu banavvanu banavavu banavo banavi banavvi banavva banavvani banavdavu karavvu karavvi banana banao banwana banwani bana banane બનાવવું બનાવવાનું बनाना बनवाना",
  website: "website websites site sites web webpage webpages portal portals landing વેબસાઇટ वेबसाइट",
  app: "app apps application applications mobile android ios iphone ipad playstore appstore એપ ऐप",
  software: "software softwares program programs system systems solution solutions સોફ્ટવેર सॉफ्टवेयर",
  erp: "erp crm bitrix bitrix24 inventory billing accounting hrms",
  trace: "track tracking trace tracing traceability tracker shipment shipments logistics rfid gps",
  qr: "qr qrcode qrcodes barcode barcodes",
  automation: "automation automate automated automatic plc scada iot factory industry industrial manufacturing machine machines",
  ecommerce: "ecommerce commerce shop shopping store stores woocommerce shopify magento cart",
  seo: "seo sem ranking rank google",
  marketing: "marketing advertising ads promotion promote social instagram facebook linkedin leads",
  graphic: "logo branding brand graphic graphics brochure",
  video: "video videos reel reels editing edit youtube shorts",
  time: "time timeline timelines duration long days din divas mahina months weeks deadline samay સમય समय",
  support: "support maintenance maintain amc bug bugs fix update updates",
  location: "location address office offices located kyan kyaa where branch ઓફિસ ऑफिस",
  contact: "contact phone number call email mail reach",
  hire: "hire hiring dedicated developer developers resource resources freelancer",
  job: "job jobs career careers vacancy vacancies intern internship cv resume naukri nokri",
  refund: "refund refunds refundable cancel cancellation cancelled money back",
  payment: "payment payments pay advance installment milestone milestones invoice invoices gst",
  privacy: "privacy data personal confidential confidentiality nda gdpr",
  owner: "ownership owner own copyright ip intellectual source",
};
const CANON = {};
for (const [canon, words] of Object.entries(SYN)) for (const w of words.split(/\s+/)) CANON[w] = canon;
const CANON_VALUES = new Set(Object.keys(SYN));

const stem = (w) => {
  if (CANON[w]) return CANON[w];
  let s = w;
  if (s.length > 5 && s.endsWith("ing")) s = s.slice(0, -3);
  else if (s.length > 4 && s.endsWith("ed")) s = s.slice(0, -2);
  else if (s.length > 3 && s.endsWith("s") && !s.endsWith("ss")) s = s.slice(0, -1);
  return CANON[s] || s;
};

const rawWords = (text) =>
  String(text)
    .toLowerCase()
    .replace(/e-commerce/g, "ecommerce")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .split(" ")
    .filter((w) => w && !STOP.has(w) && (w.length > 1 || /\d/.test(w)));

export const tokenize = (text) => rawWords(text).map(stem);

/* Levenshtein distance with early exit */
function editDistance(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (cur[j] < best) best = cur[j];
    }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/* Extra answers taken from the site's Terms & Conditions / Privacy Policy pages */
const POLICY_FAQ = [
  ["What is your refund and cancellation policy?", "Advance payments are non-refundable once work has started. If a project is cancelled mid-way, completed work is billed pro-rata. Recurring services (marketing, SEO, maintenance) are non-refundable for a billing period that has already started. Approved refunds are processed within 15–30 business days.", "/terms-and-conditions", "Terms & Conditions"],
  ["What are your payment terms?", "Payment schedules and milestones are set in your project agreement. Usually an advance is paid before work starts and the balance follows agreed milestones. Prices exclude taxes (GST / VAT), and third-party costs such as domain, hosting, licences and ad budgets are separate.", "/terms-and-conditions", "Terms & Conditions"],
  ["Who owns the source code and the software you build?", "After full and final payment, ownership of the custom deliverables built for you transfers to you, unless your project agreement says otherwise. We keep ownership of our reusable tools and frameworks and give you a licence to use them inside your software.", "/terms-and-conditions", "Terms & Conditions"],
  ["Is my project information kept confidential? Do you sign an NDA?", "Yes. Both sides keep any non-public business, technical or financial information confidential and use it only for the project, and this continues after the project ends. Ask our team if you need a separate NDA.", "/terms-and-conditions", "Terms & Conditions"],
  ["How do you use and protect my personal data?", "We use your details only to answer your enquiry, prepare quotes and deliver our services, and we never sell personal information. You can ask to access, correct or delete your data by emailing info@padhyasoft.com.", "/privacy-policy", "Privacy Policy"],
  ["Do you guarantee SEO rankings or a number of leads?", "No agency can honestly guarantee exact rankings, traffic or leads, because Google and social platforms keep changing. We follow best practices, measure everything and share clear reports on progress.", "/service/digitalmarketing", "Digital Marketing"],
];

/* ---------------------------------------------------------------------
   Build the index once from the site data.
   Entry: { id, kind: 'faq'|'service'|'blog', q, a, href, linkText }
   --------------------------------------------------------------------- */
export function buildKB({ faqPage = {}, faqSvc = {}, services = [], blogs = [] }) {
  const entries = [];
  const svcBy = (slug) => services.find((s) => s.slug === slug);

  const pageLink = { home: ["/about", "About Padhya Software Technologies"], about: ["/about", "About Padhya Software Technologies"], services: ["/services", "All services"], contact: ["/contact", "Contact us"] };
  for (const [page, list] of Object.entries(faqPage))
    list.forEach(([q, a], i) => entries.push({ id: `fp-${page}-${i}`, kind: "faq", q, a, href: pageLink[page]?.[0], linkText: pageLink[page]?.[1], extra: "" }));

  for (const [slug, list] of Object.entries(faqSvc)) {
    const s = svcBy(slug);
    list.forEach(([q, a], i) =>
      entries.push({ id: `fs-${slug}-${i}`, kind: "faq", q, a, href: `/service/${slug}`, linkText: s ? `View ${s.name}` : "View service", extra: s ? `${s.name} ${s.name2 || ""}` : "" })
    );
  }

  POLICY_FAQ.forEach(([q, a, href, linkText], i) => entries.push({ id: `pol-${i}`, kind: "faq", q, a, href, linkText, extra: "" }));

  for (const s of services) {
    const offer = (s.offer || s.features || []).map((f) => f[0]).join(", ");
    const techs = (Array.isArray(s.tech?.[0]) ? s.tech.flatMap((g) => g[1]) : s.tech || []).join(" ");
    entries.push({
      id: `sv-${s.slug}`,
      kind: "service",
      q: `${s.name} ${s.name2 || ""}`,
      a: `**${s.name}** – ${s.intro}${offer ? `\n\nWhat we deliver: ${offer}.` : ""}`,
      href: `/service/${s.slug}`,
      linkText: `View ${s.name}`,
      extra: `${s.short} ${offer} ${techs} ${(s.ind || []).join(" ")}`,
      slug: s.slug,
    });
  }

  for (const b of blogs)
    entries.push({ id: `bl-${b.slug}`, kind: "blog", q: b.title, a: b.description, href: `/blog/${b.slug}`, linkText: "Read the article", extra: `${b.category} ${b.keywords || ""}` });

  // token sets + document frequency
  const df = {};
  for (const e of entries) {
    e.qTok = new Set(tokenize(e.q));
    e.allTok = new Set([...e.qTok, ...tokenize(e.extra), ...tokenize(e.a)]);
    e.allTok.forEach((t) => (df[t] = (df[t] || 0) + 1));
  }
  const N = entries.length;
  const idf = (t) => Math.log(1 + N / (1 + (df[t] || 0)));

  // dictionary for spelling correction: every raw word in the content + every synonym
  const dict = new Set(Object.keys(CANON));
  for (const e of entries) rawWords(`${e.q} ${e.extra} ${e.a}`).forEach((w) => dict.add(w));

  return { entries, idf, df, dict: [...dict], byId: Object.fromEntries(entries.map((e) => [e.id, e])) };
}

/* map an unknown (probably misspelled) word to the closest known word */
const fixCache = new Map();
function correct(word, kb) {
  if (word.length < 4 || CANON[word] || kb.df[stem(word)] || CANON_VALUES.has(word)) return word;
  if (fixCache.has(word)) return fixCache.get(word);
  const max = word.length >= 8 ? 2 : 1;
  let best = word,
    bestD = max + 1,
    bestDf = -1;
  for (const v of kb.dict) {
    if (v[0] !== word[0] || Math.abs(v.length - word.length) > max) continue;
    const d = editDistance(word, v, max);
    const f = kb.df[stem(v)] || 0;
    if (d < bestD || (d === bestD && f > bestDf)) {
      best = v;
      bestD = d;
      bestDf = f;
    }
  }
  const out = bestD <= max ? best : word;
  fixCache.set(word, out);
  return out;
}

/* words of the visitor's message after spelling correction + synonyms */
export const queryTokens = (kb, text) => [...new Set(rawWords(text).map((w) => stem(correct(w, kb))))];

/* Returns entries ranked by relevance: [{ entry, score, recall }] (0..1) */
export function searchKB(kb, text, limit = 4) {
  const q = queryTokens(kb, text);
  if (!q.length) return [];
  const qWeight = q.reduce((s, t) => s + kb.idf(t), 0);

  const results = [];
  for (const e of kb.entries) {
    let hit = 0,
      titleHit = 0;
    for (const t of q) {
      if (e.qTok.has(t)) {
        hit += kb.idf(t);
        titleHit += kb.idf(t);
      } else if (e.allTok.has(t)) hit += kb.idf(t) * 0.5;
    }
    if (!hit) continue;
    const recall = hit / qWeight; // how much of the visitor's message this entry covers
    let titleWeight = 0;
    e.qTok.forEach((t) => (titleWeight += kb.idf(t)));
    const precision = titleWeight ? titleHit / titleWeight : 0; // how focused the entry's title is on the message
    let score = 0.75 * recall + 0.25 * precision;
    if (e.kind === "blog") score *= 0.88; // prefer direct answers over articles
    results.push({ entry: e, score, recall });
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

/* language of a greeting, so the bot can reply in kind */
export function greetingLanguage(text) {
  const t = String(text).toLowerCase();
  if (/[઀-૿]/.test(t) || /\b(kem (che|cho|chho|chhe)|kemcho|kemche|majama|maja ma|majama ne|su che|shu che|su chale|su navin|jai shree krishna|jay shree krishna|jsk|jai swaminarayan|jay swaminarayan)\b/.test(t)) return "gu";
  if (/[ऀ-ॿ]/.test(t) || /\b(kaise ho|kaisa hai|kya haal|kya hal|namaste|namaskar|ram ram)\b/.test(t)) return "hi";
  if (/^\s*(hi+|hello+|hey+|hola|good (morning|afternoon|evening)|greetings|yo)\b/.test(t)) return "en";
  return null;
}

/* canonical words of a message as text – lets the keyword rules understand synonyms too */
export const canonicalText = (kb, text) => queryTokens(kb, text).join(" ");
