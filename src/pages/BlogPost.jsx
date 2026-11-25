import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BLOGS, BLOG_CATEGORIES, blogBy, blogCatHref, blogImg, fmtDate, loadBlogContent, preloaded } from "../data/blog.js";
import { P } from "../data/site.js";
import BlogCard from "../components/BlogCard.jsx";
import { Crumbs, FormSection, HeroAside } from "../components/sections/Sections.jsx";
import { Arrow, Icon, SplitHeading, WA_ICON, useTitle } from "../components/ui.jsx";
import NotFound from "./NotFound.jsx";

// photo at the top of a blog post, picked by its category
const BLOG_HERO = { Automation: "industryautomationsolutions", "Digital Marketing": "digitalmarketing", "E-commerce": "ecommercesystem", "Mobile Apps": "mobileappdevelopment", Software: "softwaredevelopment", "Track & Trace": "trackandtracesystem", "Web Design": "webdesign", "Web Development": "webdevelopment" };

export default function BlogPost() {
  const { slug } = useParams();
  const b = blogBy(slug);
  if (!b) return <NotFound />;
  return <Post b={b} />;
}

function Post({ b }) {
  useTitle(`${b.title} | Padhya Software Technologies`);
  const [content, setContent] = useState(() => preloaded[b.slug] ?? null);

  useEffect(() => {
    let alive = true;
    loadBlogContent(b.slug).then((c) => alive && setContent(c));
    return () => {
      alive = false;
    };
  }, [b.slug]);

  const pageUrl = P.base + "/blog/" + b.slug;
  const recent = BLOGS.filter((x) => x.slug !== b.slug).slice(0, 4);
  const sameCat = BLOGS.filter((x) => x.slug !== b.slug && x.category === b.category);
  const related = [...sameCat, ...BLOGS.filter((x) => x.slug !== b.slug && x.category !== b.category)].slice(0, 3);

  return (
    <>
      <section className="phero bphero">
        <div className="wrap ph-grid">
          <div className="ph-text">
            <Crumbs items={[["Home", "/"], ["Blogs", "/blogs"], [b.category, blogCatHref(b.category)], [b.title]]} />
            <SplitHeading className="ph-title" parts={[b.title]} base={80} step={30} />
            <div className="bp-meta">
              <a className="bc-cat" href={blogCatHref(b.category)}>
                {b.category}
              </a>
              <span>By Padhya Team</span>
              <span>{fmtDate(b.date)}</span>
              <span>{b.minutes} min read</span>
            </div>
          </div>
          <HeroAside view={BLOG_HERO[b.category] || "blogs"} label={b.category} />
        </div>
      </section>

      <section className="sec bpost-sec">
        <div className="wrap bpost">
          <article className="bp-main">
            <figure className="bp-cover">
              <img src={blogImg(b)} alt={b.imageAlt} fetchpriority="high" />
            </figure>
            {content === null ? (
              <div className="bp-loading" aria-busy="true">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
            ) : (
              <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
            )}
            <div className="bp-share">
              <span>Share this article</span>
              <a href={`https://wa.me/?text=${encodeURIComponent(b.title + " – " + pageUrl)}`} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href={`https://x.com/intent/tweet?text=${encodeURIComponent(b.title)}&url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer">
                X
              </a>
            </div>
          </article>

          <aside className="bp-side">
            <div className="bp-cta">
              <h3>Have a project in mind?</h3>
              <p>Book a free 20-minute consultation and get a customised cost estimate within 24 hours.</p>
              <a className="btn btn-white" href="#consultation">
                Get Free Consultation <Arrow />
              </a>
              <a className="bp-wa" href={`${P.wa}?text=${encodeURIComponent("Hi Padhya, I read your article: " + b.title)}`} target="_blank" rel="noopener noreferrer">
                <Icon d={WA_ICON} /> Chat on WhatsApp
              </a>
            </div>
            <div className="bp-box">
              <h4>Recent articles</h4>
              <ul className="bp-recent">
                {recent.map((r) => (
                  <li key={r.slug}>
                    <a href={`/blog/${r.slug}`}>
                      <img src={blogImg(r)} alt="" loading="lazy" />
                      <span>
                        <b>{r.title}</b>
                        <small>{fmtDate(r.date)}</small>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bp-box">
              <h4>Categories</h4>
              <ul className="bp-cats">
                {BLOG_CATEGORIES.map((c) => (
                  <li key={c}>
                    <a href={blogCatHref(c)}>
                      {c}
                      <small>{BLOGS.filter((x) => x.category === c).length}</small>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="sec ice">
        <div className="wrap">
          <div className="head" data-rv="">
            <div>
              <span className="ov">Keep reading</span>
              <h2>Related articles</h2>
            </div>
            <a className="lnk" href="/blogs">
              All articles <Arrow />
            </a>
          </div>
          <div className="bgrid">
            {related.map((r) => (
              <BlogCard b={r} key={r.slug} />
            ))}
          </div>
        </div>
      </section>
      <FormSection cls="" />
    </>
  );
}
