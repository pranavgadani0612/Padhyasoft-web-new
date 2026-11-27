/* =====================================================================
   Padhya Assistant – free, offline "brain" (no AI service, no API key)
   ---------------------------------------------------------------------
   Understands a free-text message by:
     1. normalising it (lower case, repeated letters, punctuation, Gujarati/Hindi script)
     2. fuzzy keyword matching (tolerates typos: "pricng", "webiste", "kem che")
     3. small talk in English / Gujlish / Hinglish
     4. searching the website's own FAQ answers (home, about, services, contact + every service)
     5. suggesting matching blog articles
   It returns a decision object; Chatbot.jsx turns it into a reply.
   ===================================================================== */
import { FAQ_PAGE, FAQ_SVC, SERVICES, svcBy } from "../data/site.js";
import { BLOGS } from "../data/blog.js";

/* ---------------- text helpers ---------------- */
export const normalize = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[’'`´]/g, "")
    .replace(/[^\p{L}\p{M}\p{N}\s₹+#.]/gu, " ")
    .replace(/\.(?!net)/g, " ")
    .replace(/(\p{L})\1{2,}/gu, "$1$1") // "hiiiii" → "hii", "pleeeease" → "plee"
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (s) => normalize(s).split(" ").filter(Boolean);

function lev(a, b) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 9;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let last = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
      last = tmp;
    }
  }
  return prev[b.length];
}

/* does token t match keyword k? exact, plural/prefix, or a small typo */
function tokenMatch(t, k) {
  if (t === k) return 1;
  if (k.length >= 4 && t.startsWith(k) && t.length - k.length <= 3) return 0.85; // plurals: services, apps
  if (t.length >= 5 && k.startsWith(t) && k.length - t.length <= 2) return 0.8; // cut short: "develop"
  if (t.length < 4 || k.length < 4) return 0;
  const d = lev(t, k);
  if (d === 1) return 0.8;
  if (d === 2 && k.length >= 7) return 0.6;
  return 0;
}

/* a phrase found at word boundaries (Latin words must not continue: "see you" ≠ "see your") */
function phraseIn(text, k) {
  let from = 0;
  for (;;) {
    const i = text.indexOf(k, from);
    if (i < 0) return false;
    const before = i === 0 ? " " : text[i - 1];
    const after = text[i + k.length] || " ";
    const okBefore = before === " ";
    const okAfter = !/[a-z0-9]/.test(k[k.length - 1]) || !/[a-z0-9]/.test(after);
    if (okBefore && okAfter) return true;
    from = i + 1;
  }
}

/* score a message against a keyword list (single words fuzzy, phrases as substrings) */
function scoreKeys(text, tokens, keys) {
  let score = 0;
  // phrases ("how long", "kem che") count as strong evidence
  for (const k of keys) if (k.includes(" ") && phraseIn(text, k)) score += 1.6;
  // every word of the message counts at most once (its best keyword match)
  const words = keys.filter((k) => !k.includes(" "));
  for (const t of tokens) {
    let best = 0;
    for (const k of words) {
      const m = tokenMatch(t, k);
      if (m > best) best = m;
      if (best === 1) break;
    }
    score += best;
  }
  return score;
}

const STOP = new Set(
  "a an the is are am was be to of in on at for and or with by from it this that these those i me my we our you your he she they them do does did can could will would should shall may might have has had what which who whom whose how when where why please pls plz kindly hi hello hey ok okay yes no not also just about any some get got want need tell know there here than then so very much more most  che chhe cho chho hai hain ka ki ke ko nu ni no na ne ma mate thi pan ane ke je te tame tamari tamaro tamaru hu mane mara maro maru aap apka apki apke mujhe mera meri mere kya kaise kyu kab kaha kon kaun su shu kem kevi rite rite".split(
    /\s+/
  )
);
const contentTokens = (tokens) => tokens.filter((t) => t.length >= 3 && !STOP.has(t));

/* ---------------- language detection (for small-talk replies) ---------------- */
// words typical of Gujarati / Hindi written in English letters ("kya" and "bhai" appear in both, so we count, not just test)
const GUJLISH_W = new Set("che chhe cho chho kem majama maja su shu tame tamne tamaru tamari tamara tamaro mane mare maru mate joie joiye aapo apo karvu karvanu karvi banavvu banavvi banavvanu ketlu ketla ketlo kya kyare hu chu nathi haa ben saru saras aabhar abhar thase thashe jase jashe divas ane pan ama kai biju avjo".split(" "));
const HINGLISH_W = new Set("hai hain kya kaise kitna kitne kitni chahiye karna karte karta karti batao bataiye aap apka aapka apki aapki mujhe mera meri humein hum nahi haan accha achha theek thik bhi ho hoga hogi aayega lagega banwani banwana banana kijiye dijiye shukriya dhanyavad kab kahan yeh woh".split(" "));
export function detectLang(raw) {
  if (/[઀-૿]/.test(raw)) return "gu";
  if (/[ऀ-ॿ]/.test(raw)) return "hi";
  const words = normalize(raw).split(" ");
  let g = 0, h = 0;
  for (const w of words) {
    if (GUJLISH_W.has(w)) g++;
    if (HINGLISH_W.has(w)) h++;
  }
  if (!g && !h) return "en";
  if (g === h) return words.some((w) => ["hai", "hain", "aap", "aapka", "mujhe", "chahiye"].includes(w)) ? "hinglish" : "gujlish";
  return g > h ? "gujlish" : "hinglish";
}

/* ---------------- intents (map to the chatbot's reply handlers) ---------------- */
const INTENTS = [
  { id: "pricing", keys: ["price", "pricing", "cost", "costing", "budget", "charge", "charges", "rate", "rates", "fee", "fees", "quote", "quotation", "estimate", "kimat", "kimmat", "ketlu", "ketla", "kitna", "kitne", "kharch", "kharcho", "paisa", "rupees", "rupiya", "₹", "bhav", "affordable", "cheap", "package", "packages", "how much", "ketla rupiya", "કિંમત", "ભાવ", "ખર્ચ", "કેટલા", "कीमत", "कितना", "खर्च", "दाम"] },
  { id: "book", keys: ["book", "booking", "consult", "consultation", "meeting", "demo", "appointment", "callback", "call back", "get started", "start a project", "schedule", "discuss my project", "talk about my project", "મીટિંગ", "मीटिंग"] },
  { id: "trace", keys: ["track", "trace", "tracking", "traceability", "rfid", "barcode", "qr", "qrcode", "serialisation", "serialization", "anti counterfeit", "counterfeit", "track production", "production tracking", "production", "warehouse", "dispatch", "shipment"] },
  { id: "portfolio", keys: ["portfolio", "previous work", "past work", "your work", "past projects", "previous projects", "case study", "case studies", "work samples", "sample work", "examples of your work", "projects done", "kaam batavo", "kaam dikhao", "pehle ka kaam", "agal nu kaam", "તમારું કામ", "પહેલાનું કામ", "पिछला काम", "आपका काम"] },
  { id: "hosting", keys: ["hosting", "host", "server", "domain", "ssl", "cpanel", "deploy", "deployment", "go live", "હોસ્ટિંગ", "ડોમેન", "होस्टिंग", "डोमेन"] },
  { id: "erp", keys: ["erp", "crm", "automation", "automate", "industry 4.0", "factory", "manufacturing", "manufacturer", "plant", "iot", "plc", "scada", "inventory", "bitrix", "bitrix24", "workflow"] },
  { id: "timeline", keys: ["how long", "how much time", "timeline", "duration", "deadline", "kitne din", "kitne dino", "ketla divas", "ketla divas ma", "ketlo time", "ketlo samay", "kitna time", "kitna samay", "time lagse", "time lagega", "kab tak", "kyare thase", "delivery time", "weeks", "months", "કેટલા દિવસ", "કેટલો સમય", "કેટલો ટાઇમ", "ક્યારે", "દિવસ", "અઠવાડિયા", "મહિના", "સમય", "कितने दिन", "कितना समय", "कितना टाइम", "कब तक", "दिन", "हफ्ते", "महीने", "समय"] },
  { id: "location", keys: ["where", "address", "location", "located", "office", "offices", "denmark", "ahmedabad", "map", "directions", "visit", "kya che", "kya chhe", "kaha hai", "saranamu", "સરનામું", "ઓફિસ", "पता", "ऑफिस"] },
  { id: "contact", keys: ["contact", "phone", "number", "mobile number", "email", "mail", "reach", "reach you", "contact details", "સંપર્ક", "નંબર", "संपर्क", "नंबर"] },
  { id: "hours", keys: ["hours", "timing", "timings", "open", "opening", "working days", "working hours", "samay", "sunday", "saturday", "holiday", "closed"] },
  { id: "whatsapp", keys: ["whatsapp", "human", "agent", "person", "representative", "real person", "talk to someone", "talk to team", "talk to a human", "manager", "sales team"] },
  { id: "call", keys: ["call", "calling", "ring", "phone call", "call me"] },
  { id: "hire", keys: ["hire", "hiring developer", "dedicated", "developer", "developers", "resource", "resources", "team for", "outsource", "outsourcing", "staff augmentation"] },
  { id: "support", keys: ["support", "maintenance", "amc", "bug", "bugs", "issue", "fix", "update", "updates", "after launch", "post launch"] },
  { id: "career", keys: ["job", "jobs", "career", "careers", "vacancy", "vacancies", "intern", "internship", "hiring", "cv", "resume", "fresher", "naukri", "nokri", "નોકરી", "नौकरी"] },
  { id: "process", keys: ["process", "how do you work", "steps", "methodology", "approach", "workflow of project", "how you work"] },
  { id: "tech", keys: ["which technologies", "what technologies", "which technology", "tech stack", "tech", "technology", "technologies", "stack", ".net", "dotnet", "php", "c#", "azure", "aws", "cloud", "language", "react", "angular", "node", "laravel", "flutter", "python", "java", "database", "sql"] },
  { id: "about", keys: ["about", "company", "experience", "clients", "who are you", "countries", "iffco", "portfolio", "founder", "team size", "how old", "established", "padhya"] },
  { id: "services", keys: ["service", "services", "what do you do", "offer", "offering", "solutions", "seva", "kaam", "work you do", "સર્વિસ", "सेवा"] },
  { id: "thanks", keys: ["thank", "thanks", "thx", "thanku", "ty", "dhanyavad", "aabhar", "abhar", "shukriya", "great", "awesome", "nice", "perfect", "helpful", "આભાર", "धन्यवाद", "शुक्रिया"] },
  { id: "bye", keys: ["bye", "goodbye", "see you", "alvida", "tata", "good night", "avjo", "aavjo", "chalo bye"] },
];

const SERVICE_KEYS = [
  ["mobileappdevelopment", ["mobile", "android", "ios", "iphone", "app", "apps", "application", "flutter", "react native", "play store", "app store", "એપ", "ऐप"]],
  ["webdesign", ["web design", "ui", "ux", "redesign", "figma", "wireframe", "landing page design", "website design"]],
  ["ecommercesystem", ["ecommerce", "e commerce", "online store", "shop", "shopping", "store", "woocommerce", "shopify", "magento", "cart", "payment gateway", "sell online"]],
  ["webdevelopment", ["website", "webiste", "site", "web development", "web app", "portal", "wordpress", "cms", "web", "વેબસાઇટ", "वेबसाइट"]],
  ["digitalmarketing", ["seo", "marketing", "ads", "google ads", "facebook ads", "meta ads", "social media", "instagram", "leads", "ranking", "ppc", "sem"]],
  ["videoeditingservices", ["video", "videos", "reel", "reels", "editing", "youtube", "shorts", "motion graphics"]],
  ["graphicdesignservices", ["graphic", "graphics", "logo", "brand", "branding", "brochure", "poster", "banner", "visiting card", "business card", "creative"]],
  ["industryautomationsolutions", ["industrial automation", "industry automation", "plc", "scada", "robotic", "rpa", "machine", "machines"]],
  ["qrcodesolution", ["qr code", "qr", "qrcode", "excel to qr", "dynamic qr", "static qr"]],
  ["trackandtracesystem", ["track and trace", "track & trace", "traceability", "shipment tracking", "gps tracking"]],
  ["softwaredevelopment", ["software", "custom software", "erp", "crm", "billing software", "management system", "સોફ્ટવેર", "सॉफ्टवेयर"]],
];

/* ---------------- small talk ---------------- */
const SMALL = [
  {
    id: "greet",
    keys: ["hi", "hii", "hello", "helo", "hey", "hy", "namaste", "namaskar", "jai shree krishna", "jay shree krishna", "jsk", "good morning", "good afternoon", "good evening", "kem cho", "kem che", "kem chho", "kem chhe", "kaise ho", "kaise hai", "kya haal", "sup", "yo", "નમસ્તે", "કેમ છો", "કેમ છે", "नमस्ते", "कैसे हो"],
    reply: {
      en: "Hello! 👋 I'm Padhya Assistant. We build custom software, ERP & CRM, websites, mobile apps and automation. What are you looking for today?",
      gujlish: "Kem cho! 😊 Hu Padhya Assistant chu. Ame custom software, ERP/CRM, website, mobile app ane automation banaviye chiye. Tamne shu joie che?",
      hinglish: "Namaste! 😊 Main Padhya Assistant hoon. Hum custom software, ERP/CRM, website, mobile app aur automation banate hain. Aapko kya chahiye?",
      gu: "નમસ્તે! 😊 હું Padhya Assistant છું. અમે custom software, ERP/CRM, વેબસાઇટ, મોબાઇલ એપ અને automation બનાવીએ છીએ. તમને શું જોઈએ છે?",
      hi: "नमस्ते! 😊 मैं Padhya Assistant हूँ। हम custom software, ERP/CRM, वेबसाइट, मोबाइल ऐप और automation बनाते हैं। आपको क्या चाहिए?",
    },
  },
  {
    id: "howareyou",
    keys: ["how are you", "how are u", "how r you", "how r u", "how ru", "hows it going", "how is it going", "majama", "maja ma", "su chale", "shu chale", "su chalu", "kya chal raha", "sab badhiya", "sab thik", "kem cho tame", "kevu che"],
    reply: {
      en: "I'm doing great, thanks for asking! 😊 How can I help you – a new software, website or app idea?",
      gujlish: "Majama, aabhar! 😊 Tame kaho – navo software, website ke app banavvano vichar che?",
      hinglish: "Main badhiya hoon, shukriya! 😊 Batayiye – koi software, website ya app banwana hai?",
      gu: "મજામાં, આભાર! 😊 કહો – નવું software, વેબસાઇટ કે એપ બનાવવાનો વિચાર છે?",
      hi: "मैं बढ़िया हूँ, शुक्रिया! 😊 बताइए – कोई software, वेबसाइट या ऐप बनवाना है?",
    },
  },
  {
    id: "whoareyou",
    keys: ["who are you", "your name", "what is your name", "are you a bot", "are you human", "are you robot", "tame kon cho", "tamaru naam", "aap kaun ho", "tum kaun ho", "bot"],
    reply: {
      en: "I'm Padhya Assistant 🤖 – the virtual helper of Padhya Software Technologies. I can answer questions about our services, process and offices, or book a free consultation with our team.",
      gujlish: "Hu Padhya Assistant chu 🤖 – Padhya Software Technologies no virtual helper. Services, process, offices vishe puchho, ke free consultation book karo.",
      hinglish: "Main Padhya Assistant hoon 🤖 – Padhya Software Technologies ka virtual helper. Services, process ya offices ke baare mein poochiye, ya free consultation book kijiye.",
      gu: "હું Padhya Assistant છું 🤖 – Padhya Software Technologies નો virtual helper. Services, process કે offices વિશે પૂછો, અથવા free consultation બુક કરો.",
      hi: "मैं Padhya Assistant हूँ 🤖 – Padhya Software Technologies का virtual helper। Services, process या offices के बारे में पूछिए, या free consultation बुक कीजिए।",
    },
  },
  {
    id: "ack",
    keys: ["ok", "okay", "okk", "k", "fine", "sure", "alright", "hmm", "hm", "acha", "achha", "accha", "saru", "barabar", "thik che", "theek hai", "done", "got it"],
    reply: {
      en: "Great! 👍 Anything else you'd like to know?",
      gujlish: "Saru! 👍 Biju kai janvu che?",
      hinglish: "Badhiya! 👍 Aur kuch jaanna hai?",
      gu: "સરસ! 👍 બીજું કંઈ જાણવું છે?",
      hi: "बढ़िया! 👍 और कुछ जानना है?",
    },
  },
];

/* ---------------- knowledge: FAQ + blogs ---------------- */
let FAQ_DOCS = [];
let CHATBOT_EXACT = new Map();
/* inverse document frequency so rare words ("shopify", "rfid") count more than common ones ("software") */
let DF = new Map();

function indexFaqs(pages, services, chatbotQa = []) {
  CHATBOT_EXACT = new Map();
  const custom = (Array.isArray(chatbotQa) ? chatbotQa : []).map(([q, a]) => {
    CHATBOT_EXACT.set(normalize(q), { q, a });
    return { q, a, slug: null };
  });
  FAQ_DOCS = [
    ...custom,
    ...Object.values(pages).flat().map(([q, a]) => ({ q, a, slug: null })),
    ...Object.entries(services).flatMap(([slug, list]) => list.map(([q, a]) => ({ q, a, slug }))),
  ].map((d) => ({ ...d, qT: new Set(contentTokens(tokenize(d.q))), aT: new Set(contentTokens(tokenize(d.a))) }));
  DF = new Map();
  FAQ_DOCS.forEach((d) => new Set([...d.qT, ...d.aT]).forEach((t) => DF.set(t, (DF.get(t) || 0) + 1)));
}
indexFaqs(FAQ_PAGE, FAQ_SVC);

/* called by the chatbot with the latest FAQs + chatbot-only Q&A from the portal */
export function setFaqData(pages, services, chatbotQa = []) {
  if (pages && services) indexFaqs(pages, services, chatbotQa);
}

const BLOG_DOCS = BLOGS.map((b) => ({ b, tT: new Set(contentTokens(tokenize(b.title + " " + b.category))) }));

const idf = (t) => Math.log(1 + FAQ_DOCS.length / (1 + (DF.get(t) || 0)));

function bestOverlap(qTokens, set) {
  let sum = 0;
  let hits = 0;
  for (const t of qTokens) {
    let m = 0;
    for (const k of set) {
      const s = tokenMatch(t, k);
      if (s > m) m = s;
      if (m === 1) break;
    }
    if (m) {
      sum += m * idf(t);
      hits++;
    }
  }
  return { sum, hits };
}

function searchFaq(tokens, onlySlug) {
  const q = contentTokens(tokens);
  if (!q.length) return null;
  const total = q.reduce((s, t) => s + idf(t), 0) || 1;
  let best = null;
  for (const d of FAQ_DOCS) {
    if (onlySlug !== undefined && d.slug && d.slug !== onlySlug) continue;
    const inQ = bestOverlap(q, d.qT);
    const inA = bestOverlap(q, d.aT);
    const score = (inQ.sum * 1.4 + inA.sum * 0.6) / total;
    const hits = Math.max(inQ.hits, inA.hits);
    if (!best || score > best.score) best = { d, score, hits };
  }
  return best;
}

function searchBlogs(tokens) {
  const q = contentTokens(tokens);
  if (q.length < 2) return [];
  return BLOG_DOCS.map((x) => ({ b: x.b, ...bestOverlap(q, x.tT) }))
    .filter((x) => x.hits >= 2)
    .sort((a, b) => b.sum - a.sum)
    .slice(0, 2);
}

/* ---------------- main entry ---------------- */
export function understand(raw) {
  const text = normalize(raw);
  const tokens = tokenize(raw);
  const lang = detectLang(raw);
  if (!text) return { kind: "fallback", lang };

  // 0. exact match from admin-answered chatbot Q&A in DB
  const exact = CHATBOT_EXACT.get(text);
  if (exact) return { kind: "faq", q: exact.q, a: exact.a, svc: null, lang };

  // 1. small talk – only when the message is short (a greeting inside a long question is ignored)
  if (tokens.length <= 6) {
    let bestSmall = null;
    for (const s of SMALL) {
      const sc = scoreKeys(text, tokens, s.keys);
      if (sc >= 0.8 && (!bestSmall || sc > bestSmall.sc)) bestSmall = { s, sc };
    }
    if (bestSmall) {
      const words = bestSmall.s.keys.flatMap((k) => k.split(" "));
      const rest = contentTokens(tokens).filter((t) => !words.some((k) => tokenMatch(t, k)));
      if (!rest.length) {
        if (bestSmall.s.id === "greet") return { kind: "small", id: "greet", text: bestSmall.s.reply.en, lang };
        return { kind: "small", id: bestSmall.s.id, text: bestSmall.s.reply.en, lang };
      }
    }
  }

  // 2. intents
  const scored = INTENTS.map((i) => ({ id: i.id, sc: scoreKeys(text, tokens, i.keys) })).sort((a, b) => b.sc - a.sc);
  const top = scored[0];

  // 3. a specific service mentioned?
  let svc = null;
  for (const [slug, keys] of SERVICE_KEYS) {
    const sc = scoreKeys(text, tokens, keys);
    if (sc >= 0.8 && (!svc || sc > svc.sc)) svc = { slug, sc };
  }

  // 4. FAQ search (the website's own answers) – when a service is named, search that service's FAQs first
  let faq = svc ? searchFaq(tokens, svc.slug) : null;
  if (!faq || faq.score < 0.55) faq = searchFaq(tokens);
  if (svc && faq?.d.slug && faq.d.slug !== svc.slug) faq = searchFaq(tokens, svc.slug);
  const faqGood = faq && faq.score >= 0.55 && faq.hits >= 1;

  // 5. blog articles ("latest trends", "guide", "tips"...)
  const blogs = searchBlogs(tokens);
  const blogStrong = blogs.length > 0 && (blogs[0].hits >= 3 || /\b(blog|blogs|article|articles|guide|tips|trend|trends|latest|news)\b/.test(text));

  // clear action requests (pricing, booking, contact...) always win
  const actionIntents = ["pricing", "book", "contact", "location", "hours", "whatsapp", "call", "career", "thanks", "bye", "portfolio", "hosting", "timeline"];
  if (top.sc >= 0.8 && actionIntents.includes(top.id)) return { kind: "intent", id: top.id, lang, svc: svc && svcBy(svc.slug) };
  // a strong topic intent (two keywords, or a phrase like "how long") beats loose FAQ text
  if (top.sc >= 1.5 && !blogStrong) return { kind: "intent", id: top.id, lang };
  if (blogStrong) return { kind: "blogs", blogs: blogs.map((x) => x.b), lang };

  if (faqGood && (!top.sc || faq.score >= 0.75 || faq.hits >= 2)) {
    return { kind: "faq", q: faq.d.q, a: faq.d.a, svc: faq.d.slug ? svcBy(faq.d.slug) : svc && svcBy(svc.slug), lang };
  }
  if (svc && (!top.sc || ["services", "about", "erp", "trace"].includes(top.id) || svc.sc >= top.sc)) {
    return { kind: "service", svc: svcBy(svc.slug), lang };
  }
  if (top.sc >= 0.8) return { kind: "intent", id: top.id, lang };
  if (faq && faq.score >= 0.4) return { kind: "faq", q: faq.d.q, a: faq.d.a, svc: faq.d.slug ? svcBy(faq.d.slug) : null, lang, weak: true };
  if (blogs.length) return { kind: "blogs", blogs: blogs.map((x) => x.b), lang };

  return { kind: "fallback", lang, guess: top.sc > 0.3 ? top.id : null };
}

export const SERVICE_COUNT = SERVICES.length;
