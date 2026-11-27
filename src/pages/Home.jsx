import iconWhite from "../assets/icon-white.webp";
import { ABOUT_P1, FAQ_PAGE, FOOT_ABOUT, LOGOS, TRACE, TRACE_P } from "../data/site.js";
import HeroNet from "../components/home/HeroNet.jsx";
import { FeatureCarousel, StoriesCarousel, WhatWeDoTabs } from "../components/home/HomeWidgets.jsx";
import { FaqSection, FormSection, NumsSection, Offices, ProcessSection } from "../components/sections/Sections.jsx";
import { Arrow, Icon, Photo, SplitHeading, useTitle } from "../components/ui.jsx";
import { useState } from "react";
import { BLOG_TOPICS, blogCatHref } from "../data/blog.js";

const LOGO_FILES = import.meta.glob("../assets/clients/*.webp", { eager: true, import: "default" });
const logoSrc = (f) => LOGO_FILES[`../assets/clients/${f}.webp`];

function ClientLogo({ f, n, hidden }) {
  const [failed, setFailed] = useState(false);
  const src = logoSrc(f);
  if (failed || !src) return null;
  return (
    <span className="lg" aria-hidden={hidden || undefined} title={hidden ? undefined : n}>
      <img src={src} alt={hidden ? "" : n} loading="lazy" decoding="async" onError={() => setFailed(true)} />
    </span>
  );
}

export default function Home() {
  useTitle("Software Development Company in Ahmedabad | Padhya Software Technologies");
  return (
    <>
      <section className="hero">
        <HeroNet />
        <div className="wrap">
          <div>
            <span className="ov fu" style={{ animationDelay: ".1s" }}>
              Software and automation partner for manufacturers and growing businesses
            </span>
            <SplitHeading
              id="heroH"
              base={250}
              step={55}
              parts={[
                { text: "Custom software, ERP", className: "hl" },
                " ",
                { text: "and factory automation built", className: "hl" },
                " ",
                { text: "around how your business works", className: "hl bl" },
              ]}
            />
            <p className="lead fu" style={{ animationDelay: ".9s" }}>
              We design and build ERP, CRM, QR track-and-trace and mobile software that removes manual work from your operations. A founder-led team in Ahmedabad, with client support from Denmark – 7+ years and 150+ clients.
            </p>
            <div className="ctas fu" style={{ animationDelay: "1.05s" }}>
              <a className="btn btn-primary" href="#consultation">
                Book a free 20-minute call <Arrow />
              </a>
              <a className="lnk" href="/services">
                See our services <Arrow />
              </a>
            </div>
          </div>
          <FeatureCarousel />
        </div>
        <div className="wrap hero-strip fu" style={{ animationDelay: "1.3s" }}>
          <span>Trusted by 150+ clients</span>
          <div className="lgs" aria-label="Our clients">
            <div className="lg-track">
              {[...LOGOS, ...LOGOS].map(([f, n], i) => (
                <ClientLogo key={i} f={f} n={n} hidden={i >= LOGOS.length} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sec ice">
        <div className="wrap">
          <div className="head head-wide" data-rv="">
            <div>
              <span className="ov">What we do</span>
              <h2>Software that runs your operations</h2>
            </div>
            <p>{ABOUT_P1}</p>
          </div>
          <WhatWeDoTabs />
        </div>
      </section>

      <NumsSection />
      <StoriesCarousel />

      <section className="spot">
        <div className="img" data-rv="clip">
          <Photo k="trace" />
          <div className="badge">
            <i></i>
            <span>
              <b>Live on the factory floor</b>
              <span>QR · RFID · real-time dashboards</span>
            </span>
          </div>
        </div>
        <div className="tx">
          <span className="ov" style={{ color: "var(--sky3)" }}>
            Differentiator
          </span>
          <h2>QR Code &amp; Track-and-Trace Solutions</h2>
          <p>{TRACE_P}</p>
          <ul className="pts">
            {TRACE.map((t, i) => (
              <li data-rv={i * 100} key={t[0]}>
                <span className="pi">
                  <Icon d={t[2]} />
                </span>
                <span>
                  <b>{t[0]}</b>
                  <span>{t[1]}</span>
                </span>
              </li>
            ))}
          </ul>
          <a className="btn btn-white" href="/service/trackandtracesystem" style={{ width: "max-content" }}>
            Explore Track &amp; Trace <Arrow />
          </a>
        </div>
      </section>

      <ProcessSection />

      <section className="sec ice">
        <div className="wrap glob">
          <div data-rv="">
            <span className="ov">Global presence</span>
            <h2>Local teams. Global delivery.</h2>
            <p style={{ color: "var(--muted)", fontSize: "1.05rem", marginTop: "1rem" }}>{FOOT_ABOUT}</p>
            <div className="cty">
              {["🇮🇳 India", "🇦🇪 UAE", "🇩🇰 Denmark", "🇺🇸 USA", "🇨🇦 Canada"].map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            <a className="lnk" href="/contact">
              Contact our offices <Arrow />
            </a>
          </div>
          <Offices />
        </div>
      </section>

      <section className="sec" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <div className="ins" data-rv="">
            <img className="mk" src={iconWhite} alt="" />
            <div>
              <h2>Insights on ERP, automation and software</h2>
              <p>Practical articles from our team on building software that scales.</p>
            </div>
            <div className="topics">
              {BLOG_TOPICS.map(([t, cat]) => (
                <a href={blogCatHref(cat)} key={t}>
                  {t}
                </a>
              ))}
              <a href="/blogs" style={{ background: "#fff", color: "var(--blue)" }}>
                Read the blog →
              </a>
            </div>
          </div>
        </div>
      </section>
      <div style={{ height: "2rem" }}></div>
      <FaqSection list={FAQ_PAGE.home} faqKey="home" />
      <FormSection />
    </>
  );
}
