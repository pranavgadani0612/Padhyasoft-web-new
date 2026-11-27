/* Latest FAQs from the employee portal (Padhya Enquiry → FAQ), loaded once per visit in the browser.
   Resolves to { pages: { home: [[q, a], ...] }, services: { slug: [[q, a], ...] } } or null when the
   portal cannot be reached – callers then keep the FAQs that were built into the page. */
import { P } from "../data/site.js";

let pending = null;

export function loadLiveFaqs() {
  if (typeof window === "undefined" || !P.FAQ_ENDPOINT) return Promise.resolve(null);
  if (!pending) {
    pending = fetch(P.FAQ_ENDPOINT, { cache: "no-store", headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => (d && d.ok && d.pages && d.services ? { pages: d.pages, services: d.services, chatbotQa: Array.isArray(d.chatbotQa) ? d.chatbotQa : [] } : null))
      .catch(() => null)
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}

/* FAQs of one page: "home" | "about" | "services" | "contact" | a service slug */
export const faqsFor = (data, key) => (data ? data.pages[key] ?? data.services[key] ?? null : null);
