/* Blog posts imported from the existing padhyasoft.com blog (54 posts).
   index.json holds the list data; each post's HTML body is a separate JSON file that loads on demand. */
import POSTS from "./blog/index.json";

/* newest first */
export const BLOGS = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
export const BLOG_CATEGORIES = [...new Set(BLOGS.map((b) => b.category))];
export const blogBy = (slug) => BLOGS.find((b) => b.slug === slug);
export const blogImg = (b) => import.meta.env.BASE_URL + b.image;
export const fmtDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

/* post bodies handed in at build time, so pre-rendered pages contain the full article */
export const preloaded = {};

const loaders = import.meta.glob("./blog/posts/*.json");
export const loadBlogContent = async (slug) => {
  const load = loaders[`./blog/posts/${slug}.json`];
  if (!load) return "";
  const mod = await load();
  return (mod.default || mod).content;
};

/* Home-page topic chips → blog categories */
export const BLOG_TOPICS = [
  ["ERP", "Software"],
  ["CRM", "Software"],
  ["Industry 4.0", "Automation"],
  ["Track & Trace", "Track & Trace"],
  ["Mobile apps", "Mobile Apps"],
  ["Web development", "Web Development"],
];
export const blogCatHref = (cat) => `/blogs?cat=${encodeURIComponent(cat)}`;
