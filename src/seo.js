/* SEO for every page – one source used twice:
   1. at build time (scripts/prerender.mjs) to write each page's <head> into its pre-rendered HTML file
   2. in the browser (App.jsx) to update the <head> when the visitor moves between pages
   Titles and descriptions of existing pages are kept from the old padhyasoft.com site so Google rankings carry over. */
import { FAQ_PAGE, FAQ_SVC, P, SERVICES, SOCIAL } from "./data/site.js";
import { BLOGS } from "./data/blog.js";

export const SITE = "https://www.padhyasoft.com";
const BRAND = "Padhya Software Technologies";
const OG_IMAGE = SITE + "/og-image.png";
const LOGO = SITE + "/logo.webp";

const PAGES = {
  "/": ["Software Development Company in Ahmedabad | Padhya Software", "Custom software, web & mobile apps for growing businesses. Ahmedabad software team serving India & abroad. Free quote.", "Home"],
  "/about": ["About Us | Padhya Software Technologies, Ahmedabad", "Learn about Padhya Software Technologies — a trusted software development company in Ahmedabad delivering custom ERP, CRM, web and mobile solutions.", "About"],
  "/services": ["Software, Web & Mobile App Services | Padhya", "Explore our full range of services: custom software development, web design, mobile apps, ERP, CRM, digital marketing and more.", "Services"],
  "/blogs": ["Software, Web & IT Blogs | Padhya Software Technologies", "Read the latest articles, insights and updates from Padhya Software Technologies on software development, web technology and business solutions.", "Blogs"],
  "/contact": ["Contact Us | Padhya Software Technologies, Ahmedabad", "Get in touch with Padhya Software Technologies for custom software, ERP, CRM, and web development solutions. Located in Ahmedabad, Gujarat.", "Contact"],
  "/privacy-policy": ["Privacy Policy | Padhya Software Technologies", "Privacy Policy for Padhya Software Technologies. Learn how we collect, use, and protect your personal information.", "Privacy Policy"],
  "/terms-and-conditions": ["Terms & Conditions | Padhya Software Technologies", "Terms and Conditions for using Padhya Software Technologies' website and services.", "Terms & Conditions"],
};
const SVC = {
  softwaredevelopment: ["Custom Software Development in Ahmedabad | Padhya", "Custom software development services in Ahmedabad — ERP, CRM, inventory management and enterprise solutions by Padhya Software Technologies."],
  mobileappdevelopment: ["Mobile App Development Company in Ahmedabad | Padhya", "Android and iOS mobile app development services in Ahmedabad — native and cross-platform apps by Padhya Software Technologies."],
  webdevelopment: ["Web Development Company in Ahmedabad | Padhya", "Padhya Software Technologies offers professional web development services in Ahmedabad — responsive websites, web apps and e-commerce solutions."],
  webdesign: ["Web Design Company in Ahmedabad | Padhya", "Professional web design and development services in Ahmedabad — modern, responsive and user-friendly websites by Padhya Software Technologies."],
  industryautomationsolutions: ["Industry Automation Solutions in Ahmedabad | Padhya", "Industrial automation solutions in Ahmedabad — process automation, SCADA, PLC programming and IoT integration by Padhya Software Technologies."],
  digitalmarketing: ["Digital Marketing Company in Ahmedabad | Padhya", "Digital marketing services in Ahmedabad — SEO, SEM, social media marketing, PPC and content marketing by Padhya Software Technologies."],
  qrcodesolution: ["Custom QR Code Solutions for Business | Padhya", "Custom QR code solutions for business — generate, scan and manage QR codes for payments, inventory and marketing by Padhya Software Technologies."],
  trackandtracesystem: ["Track and Trace Software: Asset & Shipment Tracking | Padhya", "Real-time track and trace solutions for asset and shipment tracking — GPS, RFID and IoT powered systems by Padhya Software Technologies."],
  videoeditingservices: ["Professional Video Editing Services | Padhya", "Professional video editing services — post-production, motion graphics, colour grading and promotional video creation by Padhya Software Technologies."],
  graphicdesignservices: ["Professional Graphic Design Services | Padhya", "Professional graphic design services — logo design, branding, UI/UX, print and digital creative solutions by Padhya Software Technologies."],
  ecommercesystem: ["E-commerce Website Development in Ahmedabad | Padhya", "E-commerce website development in Ahmedabad — WooCommerce, Shopify, Magento and custom online stores with secure payments by Padhya Software Technologies."],
};

/* every URL that gets its own pre-rendered HTML file */
export const ROUTES = [...Object.keys(PAGES), ...SERVICES.map((s) => "/service/" + s.slug), ...BLOGS.map((b) => "/blog/" + b.slug)];
export const lastmod = (path) => {
  const b = path.startsWith("/blog/") && BLOGS.find((x) => "/blog/" + x.slug === path);
  return b ? b.date : null;
};

/* meta descriptions: Google shows about 155–160 characters */
const clip = (t, n = 158) => (t.length <= n ? t : t.slice(0, t.lastIndexOf(" ", n - 1)).replace(/[s,;:–—-]+$/, "") + "…");
const blogTitle = (t) => (t.length + 9 <= 65 ? `${t} | Padhya` : t);

/* ---------- structured data (schema.org) ---------- */
const ORG = {
  "@type": "Organization",
  "@id": SITE + "/#org",
  name: "Padhya Software Technologies Pvt. Ltd.",
  alternateName: BRAND,
  url: SITE + "/",
  logo: LOGO,
  email: P.email,
  telephone: P.phone,
  sameAs: SOCIAL.map((s) => s[1]),
  knowsAbout: SERVICES.map((s) => s.name),
  contactPoint: [{ "@type": "ContactPoint", contactType: "sales", telephone: P.phone, email: P.email, hoursAvailable: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "19:00" } }],
  hasOfferCatalog: { "@type": "OfferCatalog", name: "Services", itemListElement: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, url: SITE + "/service/" + s.slug } })) },
};
const OFFICES = [
  { "@type": "LocalBusiness", "@id": SITE + "/#ahmedabad", name: BRAND + " – Ahmedabad", parentOrganization: { "@id": SITE + "/#org" }, url: SITE + "/", image: LOGO, telephone: P.phone, email: P.email, address: { "@type": "PostalAddress", streetAddress: "303, APM Mall Complex, Near Bharat Petrol Pump, Sattadhar Cross Road, Ghatlodiya", addressLocality: "Ahmedabad", addressRegion: "Gujarat", postalCode: "380061", addressCountry: "IN" }, openingHours: "Mo-Sa 10:00-19:00" },
  { "@type": "LocalBusiness", "@id": SITE + "/#denmark", name: BRAND + " – Denmark", parentOrganization: { "@id": SITE + "/#org" }, url: SITE + "/", image: LOGO, telephone: P.dkPhone, email: P.dkEmail, address: { "@type": "PostalAddress", streetAddress: "54 Glentehusene", addressLocality: "Albertslund", postalCode: "2620", addressCountry: "DK" } },
];
const crumbs = (list) => ({
  "@type": "BreadcrumbList",
  itemListElement: list.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE + path })),
});
const faq = (list) =>
  list && list.length ? { "@type": "FAQPage", mainEntity: list.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) } : null;

/* ---------- SEO data for one path ---------- */
export function seoFor(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const url = SITE + (path === "/" ? "/" : path);
  const base = { url, image: OG_IMAGE, type: "website", noindex: false };
  const graph = [ORG, ...OFFICES];

  if (PAGES[path]) {
    const [title, description, name] = PAGES[path];
    const key = { "/": "home", "/about": "about", "/services": "services", "/contact": "contact" }[path];
    if (path === "/") graph.push({ "@type": "WebSite", "@id": SITE + "/#website", url: SITE + "/", name: BRAND, publisher: { "@id": SITE + "/#org" } });
    graph.push({ "@type": path === "/about" ? "AboutPage" : path === "/contact" ? "ContactPage" : "WebPage", url, name: title, description, isPartOf: { "@id": SITE + "/#website" } });
    if (path !== "/") graph.push(crumbs([["Home", "/"], [name, path]]));
    if (key) graph.push(faq(FAQ_PAGE[key]));
    if (path === "/services") graph.push({ "@type": "ItemList", name: "Services", itemListElement: SERVICES.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: SITE + "/service/" + s.slug })) });
    if (path === "/blogs") graph.push({ "@type": "Blog", name: "Padhya Software Technologies Blog", url, publisher: { "@id": SITE + "/#org" }, blogPost: BLOGS.slice(0, 20).map((b) => ({ "@type": "BlogPosting", headline: b.title, url: SITE + "/blog/" + b.slug, datePublished: b.date })) });
    return { ...base, title, description, graph: graph.filter(Boolean) };
  }

  const svc = path.match(/^\/service\/([a-z]+)$/);
  if (svc) {
    const s = SERVICES.find((x) => x.slug === svc[1]);
    if (s) {
      const [title, description] = SVC[s.slug] || [`${s.name} | ${BRAND}`, s.intro];
      graph.push(
        { "@type": "Service", "@id": url + "#service", name: s.name, serviceType: s.name, description: s.intro, url, provider: { "@id": SITE + "/#org" } },
        crumbs([["Home", "/"], ["Services", "/services"], [s.name, path]]),
        faq(FAQ_SVC[s.slug])
      );
      return { ...base, title, description, graph: graph.filter(Boolean) };
    }
  }

  const post = path.match(/^\/blog\/([a-z0-9-]+)$/);
  if (post) {
    const b = BLOGS.find((x) => x.slug === post[1]);
    if (b) {
      const image = SITE + "/" + b.image;
      graph.push(
        { "@type": "BlogPosting", headline: b.title, description: b.description, datePublished: b.date, dateModified: b.date, image, url, mainEntityOfPage: url, articleSection: b.category, inLanguage: "en", ...(b.keywords ? { keywords: b.keywords } : {}), author: { "@id": SITE + "/#org" }, publisher: { "@id": SITE + "/#org" } },
        crumbs([["Home", "/"], ["Blogs", "/blogs"], [b.category, "/blogs?cat=" + encodeURIComponent(b.category)], [b.title, path]])
      );
      return { ...base, title: blogTitle(b.title), description: clip(b.description), image, type: "article", graph };
    }
  }

  return { ...base, title: `Page not found | ${BRAND}`, description: "This page doesn't exist.", noindex: true, graph: [] };
}

/* the managed <head> tags for a path, as plain objects */
export function seoTags(pathname) {
  const s = seoFor(pathname);
  const m = (attr, key, content) => ({ tag: "meta", attrs: { [attr]: key, content } });
  const tags = [
    m("name", "description", clip(s.description)),
    m("name", "robots", s.noindex ? "noindex, follow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"),
    m("property", "og:type", s.type),
    m("property", "og:site_name", BRAND),
    m("property", "og:locale", "en_IN"),
    m("property", "og:title", s.title),
    m("property", "og:description", clip(s.description, 200)),
    m("property", "og:url", s.url),
    m("property", "og:image", s.image),
    m("name", "twitter:card", "summary_large_image"),
    m("name", "twitter:title", s.title),
    m("name", "twitter:description", clip(s.description, 200)),
    m("name", "twitter:image", s.image),
  ];
  if (!s.noindex) tags.push({ tag: "link", attrs: { rel: "canonical", href: s.url } });
  if (s.graph.length) tags.push({ tag: "script", attrs: { type: "application/ld+json" }, text: JSON.stringify({ "@context": "https://schema.org", "@graph": s.graph }) });
  return { title: s.title, tags };
}

/* build time: the tags as an HTML string */
const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export function seoHead(pathname) {
  const { title, tags } = seoTags(pathname);
  return (
    `<title>${esc(title)}</title>\n` +
    tags
      .map(({ tag, attrs, text }) => {
        const a = Object.entries(attrs).map(([k, v]) => ` ${k}="${esc(v)}"`).join("");
        return tag === "script" ? `<script data-seo${a}>${text.replace(/</g, "\\u003c")}</script>` : `<${tag} data-seo${a}>`;
      })
      .join("\n")
  );
}

/* browser: swap the managed tags when the page changes */
export function applySeo(pathname) {
  const { title, tags } = seoTags(pathname);
  document.title = title;
  document.head.querySelectorAll("[data-seo]").forEach((el) => el.remove());
  for (const { tag, attrs, text } of tags) {
    const el = document.createElement(tag);
    el.setAttribute("data-seo", "");
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (text) el.textContent = text;
    document.head.appendChild(el);
  }
}
