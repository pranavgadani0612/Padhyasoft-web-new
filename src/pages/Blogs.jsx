import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BLOGS, BLOG_CATEGORIES } from "../data/blog.js";
import BlogCard from "../components/BlogCard.jsx";
import { FormSection, PageHero } from "../components/sections/Sections.jsx";
import { useTitle } from "../components/ui.jsx";

const PER_PAGE = 9;

export default function Blogs() {
  useTitle("Software Development, Web Design & IT Blogs | Padhya Software Technologies");
  const [params, setParams] = useSearchParams();
  const cat = params.get("cat") || "All";
  const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return BLOGS.filter((b) => (cat === "All" || b.category === cat) && (!s || (b.title + " " + b.description).toLowerCase().includes(s)));
  }, [cat, q]);
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const cur = Math.min(page, pages);
  const shown = list.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);

  const go = (next) => {
    const p = {};
    const c = next.cat ?? cat;
    const pg = next.page ?? 1;
    if (c !== "All") p.cat = c;
    if (pg > 1) p.page = String(pg);
    setParams(p);
    if (next.page) document.getElementById("blogList")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <PageHero
        title="Insights & Blogs"
        sub="Practical articles from our team on software development, web design, mobile apps, automation, track & trace and digital marketing."
        band={false}
        aside={
          <div className="ph-feat">
            <span className="ov">Latest article</span>
            <BlogCard b={BLOGS[0]} eager />
          </div>
        }
      />
      <section className="sec" id="blogList">
        <div className="wrap">
          <div className="blog-tools">
            <div className="blog-cats" role="tablist" aria-label="Blog categories">
              {["All", ...BLOG_CATEGORIES].map((c) => (
                <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? "on" : undefined} onClick={() => go({ cat: c })}>
                  {c}
                  <small>{c === "All" ? BLOGS.length : BLOGS.filter((b) => b.category === c).length}</small>
                </button>
              ))}
            </div>
            <input
              className="blog-search"
              type="search"
              placeholder="Search articles..."
              aria-label="Search articles"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                if (cur !== 1) go({});
              }}
            />
          </div>

          {shown.length ? (
            <div className="bgrid">
              {shown.map((b, i) => (
                <BlogCard b={b} key={b.slug} eager={i < 3} />
              ))}
            </div>
          ) : (
            <p className="blog-empty">
              No articles found. Try another search or <a href="/contact">ask our team</a>.
            </p>
          )}

          {pages > 1 && (
            <nav className="bpager" aria-label="Blog pages">
              <button disabled={cur === 1} onClick={() => go({ page: cur - 1 })} aria-label="Previous page">
                ‹
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button key={n} className={n === cur ? "on" : undefined} aria-current={n === cur ? "page" : undefined} onClick={() => go({ page: n })}>
                  {n}
                </button>
              ))}
              <button disabled={cur === pages} onClick={() => go({ page: cur + 1 })} aria-label="Next page">
                ›
              </button>
            </nav>
          )}
        </div>
      </section>
      <FormSection />
    </>
  );
}
