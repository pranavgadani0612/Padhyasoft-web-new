import { P } from "../data/site.js";

export const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const validPhone = (v) => v.replace(/\D/g, "").length >= 8;

export function leadText(d, src) {
  return `Hi Padhya, I'd like a free consultation.${src ? ` (via ${src})` : ""}\nName: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nCompany: ${d.company || "-"}\nService: ${d.service}\nEngagement: ${d.engagement || "-"}\nBudget: ${d.budget || "-"}\nTimeline: ${d.timeline || "-"}\nDetails: ${d.message || "-"}`;
}

/* Saves an enquiry in the employee portal database. Returns true when it was stored. */
async function saveToPortal(body) {
  if (!P.FORM_ENDPOINT) return false;
  try {
    const r = await fetch(P.FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body });
    return r.ok;
  } catch (e) {
    return false;
  }
}

/* Emails the enquiry to info@padhyasoft.com (+ a thank-you to the visitor) through api/enquiry.php on the website's own server. */
async function emailEnquiry(body) {
  try {
    const r = await fetch(P.MAIL_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body });
    const j = await r.json().catch(() => null);
    return r.ok && j?.ok === true;
  } catch (e) {
    return false;
  }
}

/* Sends an enquiry: saved in the portal AND emailed. Counts as sent when either one worked. */
export async function sendLead(d) {
  const body = JSON.stringify({ ...d, page: location.pathname + location.search });
  // "elapsed" = milliseconds the visitor had the page open; the mail script treats instant submissions as bots
  const mailBody = JSON.stringify({ ...d, page: location.pathname + location.search, elapsed: Math.round(performance.now()) });
  const [saved, mailed] = await Promise.all([saveToPortal(body), emailEnquiry(mailBody)]);
  return saved || mailed;
}

/* Logs one chatbot message (visitor or bot) to the portal. Fire-and-forget: never blocks the chat. */
export function logChat(sessionId, sender, text) {
  if (!P.CHAT_LOG_ENDPOINT || !sessionId || !text) return;
  try {
    fetch(P.CHAT_LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, sender, text: String(text).slice(0, 4000), page: location.pathname + location.search }),
      keepalive: true,
    }).catch(() => {});
  } catch (e) {}
}

/* Logs a visitor question that the chatbot could not answer so an admin can turn it into a FAQ. */
export function logUnanswered(sessionId, question) {
  const q = String(question || "").trim();
  if (!P.UNANSWERED_ENDPOINT || q.length < 3) return;
  try {
    fetch(P.UNANSWERED_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, question: q.slice(0, 500), page: location.pathname + location.search }),
      keepalive: true,
    }).catch(() => {});
  } catch (e) {}
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
