/* Reusable page sections (hero band, FAQ, stats, process, consultation form, offices, service grid) */
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { IC, P, PROCESS, SERVICES, STATS } from "../../data/site.js";
import { HERO_VIEWS } from "../../lib/heroViews.js";
import LeadForm from "../LeadForm.jsx";
import { Arrow, Counter, Icon, Photo, SplitHeading } from "../ui.jsx";

/* ---------- image on the right of every inner-page hero: a browser window showing a mock-up screen of the page's topic ---------- */
export function HeroAside({ view = "services", label }) {
  const { pathname } = useLocation();
  const html = useMemo(() => (HERO_VIEWS[view] || HERO_VIEWS.services)(), [view]);
  return (
    <div className="ph-view fu" style={{ animationDelay: ".35s" }}>
      <div className="ph-view-bar" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
        <span>padhyasoft.com{pathname === "/" ? "" : pathname}</span>
      </div>
      <div className="hv" role="img" aria-label={label || "Preview of the solution"} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

/* ---------- inner-page hero (title + intro + card, then image band) ---------- */
/* ---------- tech constellation on both sides of the hero band: glowing nodes wired to the illustration ---------- */
const NODES = [
  [11, 22, "L"], [19, 52, "L"], [9, 80, "L"],
  [89, 22, "R"], [81, 52, "R"], [91, 80, "R"],
];
function BandSide({ items }) {
  const list = items.slice(0, 6);
  const path = ([x, y, side], i) => {
    const ex = side === "L" ? 31 : 69, ey = 50 + (i % 3 - 1) * 12;
    const cx = (x * 10 + ex * 10) / 2, cy = Math.min(y, ey) * 4 - 40;
    return `M${x * 10},${y * 4} Q${cx},${cy} ${ex * 10},${ey * 4}`;
  };
  return (
    <div className="band-side" aria-hidden="true">
      <svg className="bt-lines" viewBox="0 0 1000 400" preserveAspectRatio="none">
        {list.map((_, i) => {
          const d = path(NODES[i], i);
          return (
            <g key={i}>
              <path d={d} className="bt-line" vectorEffect="non-scaling-stroke" />
              <circle r="3" className="bt-dot">
                <animateMotion dur={`${3 + (i % 3) * 0.7}s`} begin={`${i * 0.45}s`} repeatCount="indefinite" path={d} />
              </circle>
            </g>
          );
        })}
      </svg>
      {list.map((n, i) => (
        <span key={n} className={`bt-node bt-${NODES[i][2]}`} style={{ left: NODES[i][0] + "%", top: NODES[i][1] + "%", animationDelay: `${-i * 0.9}s` }}>
          <i></i>
          {n}
        </span>
      ))}
    </div>
  );
}

/* ---------- visible breadcrumb trail (matches the BreadcrumbList schema in seo.js) ----------
   Hidden on every page at the owner's request. The BreadcrumbList schema in seo.js stays, so Google
   still shows "padhyasoft.com › Services › …" in search results. Set SHOW_CRUMBS = true to bring the trail back. */
const SHOW_CRUMBS = false;
export function Crumbs({ items }) {
  if (!SHOW_CRUMBS) return null;
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map(([name, href], i) => (
          <li key={i}>{href && i < items.length - 1 ? <a href={href}>{name}</a> : <span aria-current="page">{name}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

/* band={false} hides the image band; aside replaces the browser-window image (null = none); cta adds a button under the text */
export function PageHero({ title, sub, photoKey, heroView, band, bandSide, aside, cta, crumbs }) {
  return (
    <section className={`phero${band === false ? " no-band" : ""}`}>
      <div className={`wrap ph-grid${aside === null ? " solo" : ""}`}>
        <div className="ph-text">
          {crumbs && <Crumbs items={crumbs} />}
          <SplitHeading className="ph-title" parts={[title]} base={80} step={45} />
          {sub && <p>{sub}</p>}
          {cta}
        </div>
        {aside === undefined ? <HeroAside view={heroView} label={title} /> : aside}
      </div>
      {band === false ? null : band || (
        <div className="band">
          <Photo k={photoKey || "office"} parallax="0.12" eager />
          {bandSide?.length >= 6 && <BandSide items={bandSide} />}
        </div>
      )}
    </section>
  );
}

/* ---------- FAQ accordion (+ FAQPage schema for Google) ---------- */
export function FaqSection({ list, title = "Frequently asked questions", cls = "", href = "#consultation" }) {

  if (!list || !list.length) return null;
  return (
    <section className={`sec faq ${cls}`}>
      <div className="wrap faq-in">
        <div data-rv="">
          <span className="ov">FAQ</span>
          <h2>{title}</h2>
          <p>Can’t find your answer? Talk to our team – we reply within 24 hours.</p>
          <div className="faq-cta">
            <a className="btn btn-primary" href={href}>
              Ask a question <Arrow />
            </a>
            <a className="lnk" href={P.wa} target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp <Arrow />
            </a>
          </div>
        </div>
        <div className="faq-list" data-rv="120">
          {list.map(([q, a], i) => (
            <details key={q} open={i === 0}>
              <summary>
                {q}
                <i aria-hidden="true"></i>
              </summary>
              <div className="faq-a">
                <p>{a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- achievement numbers ---------- */
export function NumsSection() {
  return (
    <section className="sec dk">
      <div className="wrap">
        <div className="head" data-rv="">
          <div>
            <span className="ov">Achievement</span>
            <h2>Seven years of delivery, in numbers</h2>
          </div>
          <p>Seven years of building software for enterprises and growing companies.</p>
        </div>
        <div className="nums">
          {STATS.map(([n, l], i) => (
            <div className="nm" data-rv={i * 100} key={l}>
              <b>
                <Counter end={n} />
                <sup>+</sup>
              </b>
              <span className="lb">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- process steps ---------- */
export function StepsRow({ steps, delay = 140, extraClass = "" }) {
  return (
    <div className={`prow${extraClass ? " " + extraClass : ""}`}>
      {steps.map((p, i) => (
        <div className="pst" data-rv={i * delay} key={p[0]}>
          <div className="n">0{i + 1}</div>
          <h3>{p[0]}</h3>
          <p>{p[1]}</p>
        </div>
      ))}
    </div>
  );
}

export function ProcessSection({ cls = "" }) {
  return (
    <section className={`sec${cls ? " " + cls : ""}`}>
      <div className="wrap">
        <div className="head" data-rv="">
          <div>
            <span className="ov">How It Works</span>
            <h2>Standard Work Process</h2>
          </div>
          <p>A clear, four-stage engagement model.</p>
        </div>
        <StepsRow steps={PROCESS} />
      </div>
    </section>
  );
}

/* ---------- consultation form section ---------- */
export function FormSection({ pre = "", cls = "ice" }) {
  return (
    <section className={`sec${cls ? " " + cls : ""}`} id="consultation">
      <div className="wrap fsec">
        <div className="side" data-rv="">
          <span className="ov">Free consultation</span>
          <h2>Book a Free 20-Minute Consultation</h2>
          <p>Tell us about your project and receive a free consultation with a customised cost estimate within 24 hours.</p>
          <div className="cl">
            <a href={`tel:${P.phone}`}>
              <span className="ci">
                <Icon d={IC.phone} />
              </span>
              <span>
                <small>Call us · Mon–Sat, 10 AM–7 PM IST</small>
                <b>{P.phoneDisp}</b>
              </span>
            </a>
            <a href={`mailto:${P.email}`}>
              <span className="ci">
                <Icon d={IC.mail} />
              </span>
              <span>
                <small>Email us</small>
                <b>{P.email}</b>
              </span>
            </a>
            <a href={P.map} target="_blank" rel="noopener noreferrer">
              <span className="ci">
                <Icon d={IC.pin} />
              </span>
              <span>
                <small>Location</small>
                <b>303, APM Mall Complex, Ghatlodiya, Ahmedabad 380061</b>
              </span>
            </a>
          </div>
        </div>
        <div className="fbox" data-rv="120">
          <h3>Tell us about your project</h3>
          <LeadForm pre={pre} />
        </div>
      </div>
    </section>
  );
}

/* ---------- office cards with live local time + open/closed status ---------- */
function useOfficeClock() {
  const calc = () => {
    const fmt = (tz) => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(new Date());
    const loc = (tz) => new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
    const a = loc("Asia/Kolkata"),
      b = loc("Europe/Copenhagen");
    return {
      inTime: fmt("Asia/Kolkata"),
      dkTime: fmt("Europe/Copenhagen"),
      inOpen: a.getDay() !== 0 && a.getHours() >= 10 && a.getHours() < 19,
      dkOpen: b.getDay() > 0 && b.getDay() < 6 && b.getHours() >= 9 && b.getHours() < 17,
    };
  };
  const [c, setC] = useState(calc);
  useEffect(() => {
    const iv = setInterval(() => setC(calc()), 15000);
    return () => clearInterval(iv);
  }, []);
  return c;
}

const Status = ({ open }) => <span className={`st ${open ? "op" : "cl"}`}>{open ? "● Open now" : "Closed now"}</span>;

export function Offices() {
  const c = useOfficeClock();
  return (
    <div className="offs">
      <div className="off" data-rv="">
        <Photo k="mapIN" />
        <div className="t">
          <div className="tm">
            <h3>Ahmedabad</h3>
            <span>
              <span className="clock">{c.inTime}</span>
            </span>
          </div>
          <Status open={c.inOpen} />
          <p>{P.addrIN}</p>
          <a href={`tel:${P.phone}`}>{P.phoneDisp}</a>
          <a href={`mailto:${P.email}`}>{P.email}</a>
        </div>
      </div>
      <div className="off" data-rv="120">
        <Photo k="mapDK" />
        <div className="t">
          <div className="tm">
            <h3>Albertslund</h3>
            <span className="clock">{c.dkTime}</span>
          </div>
          <Status open={c.dkOpen} />
          <p>{P.addrDK}</p>
          <a href={`tel:${P.dkPhone}`}>{P.dkPhoneDisp}</a>
          <a href={`mailto:${P.dkEmail}`}>{P.dkEmail}</a>
        </div>
      </div>
    </div>
  );
}

/* ---------- service cards ---------- */
export function ServiceCard({ s, i, wide, revealed }) {
  return (
    <a className={`sv${wide ? " wide" : ""}${revealed ? " in" : ""}`} href={`/service/${s.slug}`} data-rv={(i % 4) * 70}>
      <span className="si">
        <Icon d={s.icon} />
      </span>
      <span className="go">
        <Arrow />
      </span>
      <h3>{s.name}</h3>
      <p>{wide ? s.intro : s.short}</p>
    </a>
  );
}

export function ServiceGrid({ revealed }) {
  const tt = SERVICES.find((s) => s.slug === "trackandtracesystem");
  return (
    <div className="sgrid">
      <ServiceCard s={tt} i={0} wide revealed={revealed} />
      {SERVICES.filter((s) => s !== tt).map((s, i) => (
        <ServiceCard s={s} i={i + 1} key={s.slug} revealed={revealed} />
      ))}
      <a className="sv sv-cta" href="/contact" style={{ background: "var(--sky)" }}>
        <span className="si">
          <Icon d="M12 5v14M5 12h14" />
        </span>
        <h3>Custom requirement?</h3>
        <p>Talk to an expert – free consultation.</p>
      </a>
    </div>
  );
}
