/* Pre-rendering: after `vite build`, write a full HTML file for every page so Google and AI crawlers
   (ChatGPT, Perplexity, Claude…) get the real content and the right <head> without running JavaScript.
   Output: dist/index.html, dist/about.html, dist/service/<slug>.html, dist/blog/<slug>.html, dist/404.html, dist/sitemap.xml */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");
const entry = fs.readdirSync(ssrDir).find((f) => /^entry-server\.m?js$/.test(f));
const { render, ROUTES, lastmod, seoHead, SITE, SERVICES, STATS, P, ABOUT_IND, FAQ_PAGE, FAQ_SVC, BLOGS } = await import(pathToFileURL(path.join(ssrDir, entry)).href);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (!template.includes("<!--seo-start-->")) throw new Error("index.html is missing the <!--seo-start--> marker");

const page = (url, body) =>
  template.replace(/<!--seo-start-->[\s\S]*?<!--seo-end-->/, seoHead(url)).replace('<div id="root"></div>', `<div id="root">${body}</div>`);

const postBody = (slug) => {
  const f = path.join(root, "src/data/blog/posts", slug + ".json");
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")).content : "";
};

let n = 0;
for (const url of ROUTES) {
  const html = page(url, render(url, url.startsWith("/blog/") ? postBody(url.slice(6)) : undefined));
  const out = url === "/" ? path.join(dist, "index.html") : path.join(dist, url.slice(1) + ".html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  n++;
}
fs.writeFileSync(path.join(dist, "404.html"), page("/404", render("/404")));

const today = new Date().toISOString().slice(0, 10);
const prio = (u) => (u === "/" ? "1.0" : u.startsWith("/service/") || u === "/services" ? "0.9" : u.startsWith("/blog/") ? "0.6" : "0.7");
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
  ROUTES.map((u) => {
    const b = u.startsWith("/blog/") && BLOGS.find((x) => "/blog/" + x.slug === u);
    const img = b ? `<image:image><image:loc>${SITE}/${b.image}</image:loc></image:image>` : "";
    return `  <url><loc>${SITE}${u === "/" ? "/" : u}</loc><lastmod>${lastmod(u) || today}</lastmod><priority>${prio(u)}</priority>${img}</url>`;
  }).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
/* llms.txt – a plain-text summary of the company for AI assistants (https://llmstxt.org) */
const llms = [
  "# Padhya Software Technologies",
  "",
  "> Founder-led software development company headquartered in Ahmedabad, Gujarat, India, with an office in Albertslund (Copenhagen), Denmark. We build custom software, ERP and CRM systems, web and mobile apps, e-commerce stores, Industry 4.0 automation, QR code systems and track & trace software, and offer web design, graphic design, video editing and digital marketing.",
  "",
  "## Key facts",
  ...STATS.map(([n, l]) => `- ${n}+ ${l}`),
  `- Industries: ${ABOUT_IND.join(", ")}`,
  `- Engagement models: fixed-price projects, monthly retainers, dedicated development teams`,
  `- India office: ${P.addrIN} · ${P.phoneDisp} · ${P.email}`,
  `- Denmark office: ${P.addrDK} · ${P.dkPhoneDisp} · ${P.dkEmail}`,
  `- Hours: Monday–Saturday, 10 AM – 7 PM IST`,
  "",
  "## Services",
  ...SERVICES.map((s) => `- [${s.name}](${SITE}/service/${s.slug}): ${s.intro}`),
  "",
  "## Company",
  `- [About](${SITE}/about): who we are, how we work and the industries we serve`,
  `- [All services](${SITE}/services)`,
  `- [Contact](${SITE}/contact): free consultation and a customised estimate within 24 hours`,
  "",
  "## Frequently asked questions",
  ...FAQ_PAGE.home.map(([q, a]) => `- **${q}** ${a}`),
  "",
  "## Blog",
  ...BLOGS.map((b) => `- [${b.title}](${SITE}/blog/${b.slug}): ${b.description}`),
  "",
].join("\n");
fs.writeFileSync(path.join(dist, "llms.txt"), llms);

/* llms-full.txt – the same, plus every service in detail and all FAQs (one file an AI assistant can read in full) */
const full = [
  llms.split("## Blog")[0].trim(),
  "",
  "## Services in detail",
  ...SERVICES.flatMap((s) => [
    "",
    `### ${s.name}`,
    `URL: ${SITE}/service/${s.slug}`,
    s.intro,
    ...(s.features || []).map(([h, d]) => `- ${h}: ${d}`),
    ...(FAQ_SVC[s.slug] || []).map(([q, a]) => `- Q: ${q} A: ${a}`),
  ]),
  "",
  "## More questions",
  ...["about", "services", "contact"].flatMap((k) => (FAQ_PAGE[k] || []).map(([q, a]) => `- **${q}** ${a}`)),
  "",
  "## Blog",
  ...BLOGS.map((b) => `- [${b.title}](${SITE}/blog/${b.slug}) (${b.date}, ${b.category}): ${b.description}`),
  "",
].join("\n");
fs.writeFileSync(path.join(dist, "llms-full.txt"), full);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${n} pages + 404.html, sitemap.xml with ${ROUTES.length} URLs, llms.txt, llms-full.txt`);
