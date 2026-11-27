/* =====================================================================
   Runs before "vite build" (see package.json).
   Downloads the website FAQs from the employee portal (TaskFlow → Padhya Enquiry → FAQ)
   and saves them to src/data/faqs.live.json. site.js uses that file for the pre-rendered
   pages and the Google FAQ schema.
   It never breaks the build: if the portal cannot be reached, the last saved copy is kept
   (or, without one, the fallback FAQs written in site.js are used).
   ===================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "src/data/faqs.live.json");

function portalApi() {
  if (process.env.VITE_PORTAL_API) return process.env.VITE_PORTAL_API;
  for (const f of [".env.production.local", ".env.production", ".env"]) {
    const p = path.join(root, f);
    if (!fs.existsSync(p)) continue;
    const m = fs.readFileSync(p, "utf8").match(/^\s*VITE_PORTAL_API\s*=\s*["']?([^"'\r\n#]+)/m);
    if (m) return m[1].trim();
  }
  return "";
}

const keep = (why) => {
  console.log(`FAQs: ${why} – ${fs.existsSync(out) ? "keeping the last saved copy" : "using the fallback FAQs in site.js"}`);
  process.exit(0);
};

const api = portalApi().replace(/\/+$/, "");
if (!/^https?:\/\//.test(api)) keep("no portal address (VITE_PORTAL_API)");

try {
  const res = await fetch(api + "/public/website-faqs", { signal: AbortSignal.timeout(10000), headers: { Accept: "application/json" } });
  if (!res.ok) keep(`portal answered ${res.status}`);
  const data = await res.json();
  const isList = (o) => o && typeof o === "object" && Object.values(o).every((l) => Array.isArray(l) && l.every((x) => Array.isArray(x) && typeof x[0] === "string" && typeof x[1] === "string"));
  if (!data?.ok || !isList(data.pages) || !isList(data.services)) keep("unexpected answer from the portal");
  const total = [...Object.values(data.pages), ...Object.values(data.services)].flat().length;
  if (!total) keep("the portal has no active FAQs");
  fs.writeFileSync(out, JSON.stringify({ updatedAt: data.updatedAt || null, pages: data.pages, services: data.services }));
  console.log(`FAQs: ${total} FAQs downloaded from the portal`);
} catch (e) {
  keep(`portal not reachable (${e.name === "TimeoutError" ? "timeout" : e.message})`);
}
