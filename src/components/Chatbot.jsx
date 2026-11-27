/* =====================================================================
   CHATBOT – "Padhya Assistant"
   Works without any server (smart FAQ + lead capture). Set P.AI_ENDPOINT to use AI.
   ===================================================================== */
import { Fragment, useEffect, useRef, useState } from "react";
import iconBlue from "../assets/icon-blue.webp";
import { P, SERVICES, finePointer, reduce, svcBy, svcFormName } from "../data/site.js";
import { leadText, logChat, logUnanswered, sendLead, sleep, validEmail, validPhone } from "../lib/lead.js";
import { setFaqData, understand } from "../lib/botBrain.js";
import { loadLiveFaqs } from "../lib/liveFaqs.js";
import { T } from "../lib/botText.js";

const newSessionId = () => "wc_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);

const KEY = "padhya-chat-v1";
const MAIN = [["Our services", "services"], ["ERP & automation", "erp"], ["QR & track and trace", "trace"], ["Pricing", "pricing"], ["Book free consultation", "book"], ["WhatsApp us", "whatsapp"], ["Call us", "call"]];
const CANCEL = [["Cancel", "cancel"]];

function ChipIcon({ id }) {
  const k = String(id || "").split(":")[0];
  const p = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: { flex: "none" } };
  if (k === "services" || k === "svc" || k === "pick") return <svg {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>;
  if (k === "erp") return <svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>;
  if (k === "trace") return <svg {...p}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h3v3h-3zM20 14v3h-3M14 20h7" /></svg>;
  if (k === "pricing") return <svg {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>;
  if (k === "book") return <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
  if (k === "whatsapp") return <svg {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>;
  if (k === "call") return <svg {...p}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>;
  if (k === "menu") return <svg {...p}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>;
  if (k === "cancel") return <svg {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
  if (k === "confirm") return <svg {...p}><polyline points="20 6 9 17 4 12" /></svg>;
  return null;
}

const time = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const istNow = () => new Date(Date.now() + (330 + new Date().getTimezoneOffset()) * 60000);
const isOpenHours = () => {
  const d = istNow(),
    day = d.getDay(),
    h = d.getHours();
  return day !== 0 && h >= 10 && h < 19;
};


function loadSaved() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "null");
  } catch (e) {
    return null;
  }
}

/* **bold** and line breaks inside bot messages */
function MsgText({ text }) {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line.split(/\*\*(.+?)\*\*/g).map((part, j) => (j % 2 ? <b key={j}>{part}</b> : part))}
    </Fragment>
  ));
}

export default function Chatbot() {
  const [saved] = useState(loadSaved);
  const S = useRef({ open: false, msgs: saved?.msgs || [], flow: saved?.flow || null, lead: saved?.lead || {}, greeted: !!saved?.greeted, sid: saved?.sid || newSessionId(), lang: saved?.lang || "en" });
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState(S.current.msgs);
  const [chips, setChipsState] = useState([]);
  const [typing, setTyping] = useState(false);
  const [badge, setBadge] = useState(false);
  const [bubble, setBubble] = useState(false);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const fabRef = useRef(null);

  const save = () => {
    const s = S.current;
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ msgs: s.msgs.slice(-60), flow: s.flow, lead: s.lead, greeted: s.greeted, sid: s.sid, lang: s.lang }));
    } catch (e) {}
  };
  const push = (who, text, btns) => {
    S.current.msgs = [...S.current.msgs, { who, text, btns, t: time() }];
    setMsgs(S.current.msgs);
    save();
    logChat(S.current.sid, who === "user" ? "user" : "bot", text); // saved in the employee portal
  };
  const setChips = (list) => setChipsState(list || []);
  const bot = async (text, btns, chipList, delay) => {
    setTyping(true);
    await sleep(reduce ? 0 : delay ?? Math.min(400 + text.length * 8, 1300));
    setTyping(false);
    push("bot", text, btns);
    setChips(chipList === undefined ? MAIN : chipList);
    if (!S.current.open) setBadge(true);
  };

  /* ---- knowledge (replies come in the visitor's language – see lib/botText.js) ---- */
  // Replies are always in English. The bot still UNDERSTANDS Gujarati, Hindi, Gujlish and Hinglish (lib/botBrain.js).
  const lg = () => "en";
  const svcList = SERVICES.map((s) => [s.name, "svc:" + s.slug]);
  const R = {
    greet: () => bot("Hello! 👋 Welcome to Padhya Software Technologies. We build custom ERP, CRM, automation, web and mobile software. How can I help you today?"),
    services: () => bot(T("servicesIntro", lg()), null, svcList.concat([["Main menu", "menu"]])),
    erp: () => bot(T("erp", lg()), [{ t: "View Software Development", href: "/service/softwaredevelopment" }, { t: "Industry Automation", href: "/service/industryautomationsolutions" }], [["Book free consultation", "book"], ["Pricing", "pricing"], ["Main menu", "menu"]]),
    trace: () => bot(T("trace", lg()), [{ t: "Track & Trace System", href: "/service/trackandtracesystem" }, { t: "QR Code Solutions", href: "/service/qrcodesolution" }], [["Book a demo call", "book"], ["Main menu", "menu"]]),
    pricing: () => bot(T("pricing", lg()), null, [["Get my free estimate", "book"], ["WhatsApp us", "whatsapp"], ["Main menu", "menu"]]),
    timeline: () => bot(T("timeline", lg()), null, [["Book free consultation", "book"], ["Main menu", "menu"]]),
    contact: () => bot(`${T("contactHead", lg())}📞 India: ${P.phoneDisp}\n✉️ ${P.email}\n📞 Denmark: ${P.dkPhoneDisp}\n✉️ ${P.dkEmail}\n🕙 ${P.hours}`, [{ t: "Call India office", href: "tel:" + P.phone }, { t: "Email us", href: "mailto:" + P.email }, { t: "Contact page", href: "/contact" }]),
    location: () => bot(`🇮🇳 **${T("locIN", lg())}:** ${P.addrIN}\n\n🇩🇰 **${T("locDK", lg())}:** ${P.addrDK}`, [{ t: "Open in Google Maps", href: P.map }, { t: "Contact page", href: "/contact" }]),
    hours: () => bot(T(isOpenHours() ? "hoursOpen" : "hoursClosed", lg()), null, [["Leave my details", "book"], ["Main menu", "menu"]]),
    about: () => bot(T("about", lg()), [{ t: "About us", href: "/about" }]),
    portfolio: () => bot(T("portfolio", lg()), [{ t: "About us", href: "/about" }, { t: "Industries we serve", href: "/services" }], [["Book free consultation", "book"], ["Talk to a human", "whatsapp"], ["Main menu", "menu"]]),
    hosting: () => bot(T("hosting", lg()), [{ t: "Web Development", href: "/service/webdevelopment" }], [["Book free consultation", "book"], ["Pricing", "pricing"], ["Main menu", "menu"]]),
    process: () => bot(T("process", lg())),
    tech: () => bot("Our main technologies: .NET, C#, PHP, Android, iOS, cloud (Azure/AWS), SQL databases, QR/RFID/barcode and IoT integrations. We also do security testing and automation testing.", null, [["Our services", "services"], ["Main menu", "menu"]]),
    hire: () => bot(T("hire", lg()), null, [["Discuss my team", "book"], ["Main menu", "menu"]]),
    support: () => bot(T("support", lg())),
    career: () => bot(`Thanks for your interest in joining Padhya! Please send your CV to ${P.email} with the role you're applying for in the subject line.`, [{ t: "Email your CV", href: `mailto:${P.email}?subject=Job%20application` }]),
    thanks: () => bot(T("thanks", lg())),
    bye: () => bot(T("bye", lg())),
    whatsapp: () => {
      const L = S.current.lead;
      const sum = L.name ? `Hi Padhya, I'm ${L.name}. I was chatting on your website.` : "Hi Padhya, I was chatting on your website and would like to talk to your team.";
      return bot(T("whatsapp", lg()), [{ t: "Open WhatsApp", href: `${P.wa}?text=${encodeURIComponent(sum)}` }]);
    },
    call: () => bot(T("call", lg()), [{ t: "Call now", href: "tel:" + P.phone }]),
    menu: () => bot(T("menu", lg()), null, MAIN, 250),
    fallback: (lang = lg(), guess = null) => {
      const txt = {
        gujlish: "Maaf karjo, aa hu barabar samji na shakyo 🙏 Tame services, pricing, ERP, website, app ke track & trace vishe puchhi shako – athva amari team sathe seedhi vaat karo.",
        hinglish: "Maaf kijiye, yeh main theek se samajh nahi paaya 🙏 Aap services, pricing, ERP, website, app ya track & trace ke baare mein pooch sakte hain – ya hamari team se seedhe baat kijiye.",
        gu: "માફ કરજો, આ હું બરાબર સમજી ન શક્યો 🙏 તમે services, pricing, ERP, વેબસાઇટ, એપ કે track & trace વિશે પૂછી શકો – અથવા અમારી ટીમ સાથે સીધી વાત કરો.",
        hi: "माफ़ कीजिए, यह मैं ठीक से समझ नहीं पाया 🙏 आप services, pricing, ERP, वेबसाइट, ऐप या track & trace के बारे में पूछ सकते हैं – या हमारी टीम से सीधे बात कीजिए।",
      }[lang] || "Sorry, I didn't quite catch that 🙏 You can ask me about our services, pricing, ERP, websites, apps or track & trace – or talk to our team directly.";
      const GUESS = { pricing: "Pricing", erp: "ERP & automation", trace: "QR & track and trace", services: "Our services", contact: "Contact details", location: "Office address", tech: "Technologies", hire: "Hire developers", support: "Support", about: "About Padhya", timeline: "Project timelines", process: "Our process", portfolio: "Our work", hosting: "Hosting & domain" };
      const chips = [["Our services", "services"], ["Book free consultation", "book"], ["Talk to a human", "whatsapp"]];
      if (guess && GUESS[guess] && guess !== "services") chips.unshift([`Did you mean: ${GUESS[guess]}?`, guess]);
      return bot(txt, null, chips);
    },
  };
  const svcAnswer = (s) => {
    const items = (s.features && s.features.length ? s.features : s.offer || []).slice(0, 4).map((f) => f[0]);
    const lead = T("svcLead", lg(), { service: s.name });
    return bot(`${lead}**${s.name}** – ${s.intro}${items.length ? `\n\nWhat we deliver: ${items.join(", ")}.` : ""}`, [{ t: `View ${s.name}`, href: "/service/" + s.slug }], [["Book free consultation", "book:" + s.slug], ["Other services", "services"], ["Main menu", "menu"]]);
  };

  /* ---- lead capture flow ---- */
  const startBook = async (pre) => {
    S.current.flow = "name";
    S.current.lead = pre ? { service: svcFormName(svcBy(pre)) } : {};
    save();
    await bot(T("bookStart", lg()), null, CANCEL);
    inputRef.current?.focus();
  };
  const flowStep = async (text) => {
    const st = S.current,
      L = st.lead,
      f = st.flow,
      v = text.trim(),
      l = lg();
    const next = (flow) => {
      st.flow = flow;
      save();
    };
    if (/^cancel$/i.test(v) || v === "✖ Cancel") {
      next(null);
      return bot(T("cancelled", l));
    }
    if (f === "name") {
      if (v.length < 2) return bot(T("askNameAgain", l), null, CANCEL);
      L.name = v;
      next("email");
      return bot(T("askEmail", l, { name: v }), null, CANCEL);
    }
    if (f === "email") {
      if (!validEmail(v)) return bot(T("badEmail", l), null, CANCEL);
      L.email = v;
      next("phone");
      return bot(T("askPhone", l), null, CANCEL);
    }
    if (f === "phone") {
      if (!validPhone(v)) return bot(T("badPhone", l), null, CANCEL);
      L.phone = v;
      if (L.service) {
        next("message");
        return bot(T("askServiceKnown", l, { service: L.service }), null, [["Skip", "skip"], ...CANCEL]);
      }
      next("service");
      return bot(T("askService", l), null, SERVICES.map((s) => [s.name, "pick:" + s.slug]).concat([["Not sure yet", "pick:"]]));
    }
    if (f === "service") {
      const s = SERVICES.find((s) => v === "pick:" + s.slug || s.name.toLowerCase() === v.toLowerCase());
      L.service = s ? svcFormName(s) : "Not sure – need guidance";
      next("message");
      return bot(T("askMessage", l), null, [["Skip", "skip"], ...CANCEL]);
    }
    if (f === "message") {
      L.message = /^skip$/i.test(v) ? "" : v;
      next("confirm");
      return bot(`${T("confirm", l)}\n\n**Name:** ${L.name}\n**Email:** ${L.email}\n**Phone:** ${L.phone}\n**Service:** ${L.service}${L.message ? `\n**Project:** ${L.message}` : ""}`, null, [["Confirm & send", "confirm"], ["Start again", "book"], ...CANCEL]);
    }
    if (f === "confirm") {
      if (v === "confirm") {
        next(null);
        const d = Object.assign({ source: "Chatbot", engagement: "", budget: "", timeline: "", company: "", chatSession: st.sid }, L);
        const saved = P.FORM_ENDPOINT ? await sendLead(d) : false;
        return bot(
          T(saved ? "sent" : "ready", l, { name: L.name }),
          saved
            ? null
            : [
                { t: "Send on WhatsApp", href: `${P.wa}?text=${encodeURIComponent(leadText(d, "website chat"))}` },
                { t: "Send by email", href: `mailto:${P.email}?subject=${encodeURIComponent("Free consultation request – " + L.name)}&body=${encodeURIComponent(leadText(d, "website chat"))}` },
              ]
        );
      }
      return bot("Please tap **Confirm & send**, or start again.", null, [["Confirm & send", "confirm"], ["Start again", "book"]]);
    }
  };

  /* ---- AI (optional) ---- */
  const askAI = async () => {
    try {
      setTyping(true);
      const history = S.current.msgs.slice(-12).map((m) => ({ role: m.who === "user" ? "user" : "assistant", content: m.text }));
      const r = await fetch(P.AI_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) });
      const j = await r.json();
      setTyping(false);
      if (j && j.reply) {
        push("bot", j.reply);
        setChips([["Book free consultation", "book"], ["WhatsApp us", "whatsapp"], ["Main menu", "menu"]]);
        return true;
      }
    } catch (e) {
      setTyping(false);
    }
    return false;
  };

  const handle = async (raw, label) => {
    const v = String(raw).trim();
    if (!v) return;
    push("user", label || v);
    setChips([]);
    if (S.current.flow && !/^(book|menu)$/.test(v)) return flowStep(v);
    if (v === "cancel") {
      S.current.flow = null;
      save();
      return R.menu();
    }
    if (v === "book") return startBook();
    if (v.startsWith("book:")) return startBook(v.slice(5));
    if (v.startsWith("svc:")) return svcAnswer(svcBy(v.slice(4)));
    if (R[v]) return R[v]();
    // free text
    for (const s of SERVICES) if (v.toLowerCase().includes(s.name.toLowerCase())) return svcAnswer(s);
    if (P.AI_ENDPOINT && (await askAI(v))) return;
    return smartReply(v);
  };

  /* ---- free "brain": fuzzy intents, small talk, FAQ + blog search (see lib/botBrain.js) ---- */
  const AFTER = [["Book free consultation", "book"], ["Talk to a human", "whatsapp"], ["Main menu", "menu"]];
  const smartReply = (v) => {
    const r = understand(v);
    if (r.kind === "small") return bot(r.text, null, MAIN);
    if (r.kind === "intent") {
      if (r.id === "book") return startBook(r.svc?.slug);
      return R[r.id] ? R[r.id]() : R.fallback("en");
    }
    if (r.kind === "service") return svcAnswer(r.svc);
    if (r.kind === "faq") {
      const lead = r.weak && lg() === "en" ? "I think this answers your question:\n\n" : T("faqLead", lg());
      const btns = r.svc ? [{ t: `View ${r.svc.name}`, href: "/service/" + r.svc.slug }] : null;
      return bot(`${lead}**${r.q}**\n${r.a}`, btns, r.svc ? [["Book free consultation", "book:" + r.svc.slug], ["Talk to a human", "whatsapp"], ["Main menu", "menu"]] : AFTER);
    }
    if (r.kind === "blogs") {
      return bot(T("blogsLead", lg()), r.blogs.map((b) => ({ t: b.title, href: "/blog/" + b.slug })), AFTER);
    }
    logUnanswered(S.current.sid, v);
    return R.fallback("en", r.guess);
  };

  const openChat = () => {
    S.current.open = true;
    setOpen(true);
    setBadge(false);
    setBubble(false);
    if (!S.current.msgs.length) R.greet();
    else setChips(S.current.flow ? CANCEL : MAIN);
    setTimeout(() => finePointer && inputRef.current?.focus(), 300);
  };
  const closeChat = () => {
    if (!S.current.open) return;
    S.current.open = false;
    setOpen(false);
    fabRef.current?.focus();
  };
  const reset = () => {
    S.current.msgs = [];
    S.current.flow = null;
    S.current.lead = {};
    S.current.sid = newSessionId(); // a new conversation in the portal
    setMsgs([]);
    save();
    R.greet();
  };

  // answer from the latest FAQs + chatbot Q&A in the portal once the chat is opened
  useEffect(() => {
    if (open) loadLiveFaqs().then((d) => d && setFaqData(d.pages, d.services, d.chatbotQa));
  }, [open]);

  // keep the latest messages in view
  useEffect(() => {
    const b = bodyRef.current;
    if (b) b.scrollTop = b.scrollHeight;
  }, [msgs, typing, open]);

  // Escape closes; greeting bubble after a few seconds (once per session)
  const closeRef = useRef(closeChat);
  closeRef.current = closeChat;
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    let t;
    if (!S.current.greeted)
      t = setTimeout(() => {
        if (!S.current.open) {
          setBubble(true);
          setBadge(true);
          S.current.greeted = true;
          save();
        }
      }, 30000); // greeting bubble only after 30 s, so it never covers content right away
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const v = inputRef.current.value;
    inputRef.current.value = "";
    handle(v);
  };
  const onBtnLink = (href) => {
    if (href.startsWith("/") && matchMedia("(max-width:600px)").matches) closeChat();
  };

  return (
    <div className={`cb${open ? " open" : ""}`}>
      <div className={`cb-bubble${bubble ? " show" : ""}`} role="status" onClick={openChat}>
        <button
          className="cb-bubble-x"
          aria-label="Dismiss"
          onClick={(e) => {
            e.stopPropagation();
            setBubble(false);
            S.current.greeted = true;
            save();
          }}
        >
          ×
        </button>
        Hi 👋 Looking for software, ERP or automation? I can help!
      </div>
      <button className="cb-fab" ref={fabRef} aria-label="Open chat with Padhya Assistant" aria-expanded={open} aria-controls="cbWin" onClick={() => (S.current.open ? closeChat() : openChat())}>
        <svg className="i-chat" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 4h16a2 2 0 012 2v10a2 2 0 01-2 2H9l-5 4v-4a2 2 0 01-2-2V6a2 2 0 012-2zm3 6.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm5 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm5 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
        </svg>
        <svg className="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
        <span className={`cb-badge${badge ? " show" : ""}`}>1</span>
      </button>
      <section className="cb-win" id="cbWin" role="dialog" aria-label="Padhya Assistant chat" aria-modal="false">
        <header className="cb-head">
          <div className="cb-av">
            <img src={iconBlue} alt="" />
          </div>
          <div className="cb-ttl">
            <b>Padhya Assistant</b>
            <small>
              <i className="cb-dot"></i>
              <span>Online · replies instantly</span>
            </small>
          </div>
          <button className="cb-hbtn" aria-label="Start a new conversation" title="New conversation" onClick={reset}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4v6h6M20 20v-6h-6M5.5 15a7 7 0 0011.9 2.5M18.5 9A7 7 0 006.6 6.5" />
            </svg>
          </button>
          <button className="cb-hbtn" aria-label="Close chat" onClick={closeChat}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>
        <div className="cb-body" ref={bodyRef} aria-live="polite">
          {msgs.map((m, i) => (
            <div className={`cb-msg ${m.who}`} key={i}>
              <div className="cb-b">
                <MsgText text={m.text} />
                {m.btns && m.btns.length > 0 && (
                  <div className="cb-btns">
                    {m.btns.map((b) =>
                      b.href ? (
                        <a key={b.t} className="cb-btn" href={b.href} onClick={() => onBtnLink(b.href)} {...(/^https?:/.test(b.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                          {b.t}
                        </a>
                      ) : (
                        <button key={b.t} className="cb-btn" onClick={() => handle(b.v, b.t)}>
                          {b.t}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
              <time>{m.t}</time>
            </div>
          ))}
          {typing && (
            <div className="cb-msg bot cb-typing">
              <div className="cb-b">
                <i></i>
                <i></i>
                <i></i>
              </div>
            </div>
          )}
        </div>
        <div
          className={`cb-chips${chips.length ? "" : " empty"}`}
          onWheel={(e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
              e.currentTarget.scrollLeft += e.deltaY;
              e.preventDefault();
            }
          }}
        >
          {chips.map(([t, v]) => (
            <button key={v + t} className="cb-chip" onClick={() => handle(v, t)}>
              <ChipIcon id={v} />
              <span>{t}</span>
            </button>
          ))}
        </div>
        <form className="cb-input" autoComplete="off" onSubmit={onSubmit}>
          <input ref={inputRef} placeholder="Type your message..." aria-label="Message" maxLength={500} />
          <button type="submit" aria-label="Send">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 20l18-8L3 4v6l12 2-12 2z" />
            </svg>
          </button>
        </form>
        <div className="cb-foot">
          Powered by Padhya Software ·{" "}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            Privacy
          </a>
        </div>
      </section>
    </div>
  );
}
