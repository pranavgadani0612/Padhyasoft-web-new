import { useParams } from "react-router-dom";
import { FAQ_SVC, IC, P, SERVICES, SVC_PHOTO, svcBy, svcFormName } from "../data/site.js";
import BallBand from "../components/bands/BallBand.jsx";
import QrBand from "../components/bands/QrBand.jsx";
import TraceBand from "../components/bands/TraceBand.jsx";
import { FaqSection, FormSection, PageHero, ServiceCard } from "../components/sections/Sections.jsx";
import { Arrow, Icon, WA_ICON, useTitle } from "../components/ui.jsx";
import { WhyList } from "./About.jsx";
import NotFound from "./NotFound.jsx";

const BANDS = { trackandtracesystem: TraceBand, qrcodesolution: QrBand, graphicdesignservices: BallBand };

// six technologies for the constellation on the hero band (padded with feature names when a service lists fewer)
const techNodes = (s) => [...new Set([...(s.tech || []).flatMap((g) => g[1] || []), ...(s.features || []).map((f) => f[0])])].filter((n) => n.length <= 16).slice(0, 6);

export default function Service() {
  const { slug } = useParams();
  const s = svcBy(slug);
  if (!s) return <NotFound />;
  return <ServicePage s={s} />;
}

function ServicePage({ s }) {
  useTitle(`${s.name} | Padhya Software Technologies`);
  const idx = SERVICES.indexOf(s);
  const rel = [1, 4, 7].map((k) => SERVICES[(idx + k) % SERVICES.length]);
  const Band = BANDS[s.slug];
  const nm = s.name2 || s.name;
  const techGroups = Array.isArray(s.tech[0]) ? s.tech : [["Technologies", s.tech]];

  return (
    <>
      <PageHero title={s.name} sub={s.intro} photoKey={SVC_PHOTO[s.slug]} heroView={s.slug} crumbs={[["Home", "/"], ["Services", "/services"], [s.name]]} bandSide={techNodes(s)} band={Band ? <Band /> : null} />

      <section className="sec">
        <div className="wrap two sv-intro">
          <div data-rv="">
            <span className="ov">Overview</span>
            <h2>{s.name} built around your business</h2>
            {(s.lead || [s.short]).map((p) => (
              <p className="sv-lead" key={p}>
                {p}
              </p>
            ))}
            <a className="btn btn-primary" href="#consultation">
              Get Free Consultation <Arrow />
            </a>
          </div>
          <div data-rv="120" className="sv-tech">
            <span className="ov">{s.techTitle || "Technology expertise"}</span>
            {techGroups.map((g) => (
              <div className="tg" key={g[0]}>
                <small>{g[0]}</small>
                <div className="chips">
                  {g[1].map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec ice">
        <div className="wrap">
          <div className="head" data-rv="">
            <div>
              <span className="ov">Our services</span>
              <h2>What we offer</h2>
            </div>
            <p>{s.short}</p>
          </div>
          <div className="ofr">
            {(s.offer || s.features).map((f, i) => (
              <div className="ofc" data-rv={(i % 3) * 90} key={f[0]}>
                <span className="oi">
                  <Icon d={s.icon} />
                </span>
                <h3>{f[0]}</h3>
                <p>{f[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {s.why && (
        <section className="sec">
          <div className="wrap two">
            <div data-rv="">
              <span className="ov">Why choose us</span>
              <h2>Why businesses choose Padhya Software Technologies for {nm}</h2>
            </div>
            <WhyList items={s.why} />
          </div>
        </section>
      )}

      {s.ind && (
        <section className="sec dk">
          <div className="wrap">
            <div className="head" data-rv="">
              <div>
                <span className="ov">Industries</span>
                <h2>Industries we serve</h2>
              </div>
              <p>Solutions tailored to each industry's workflows, compliance needs and operational challenges.</p>
            </div>
            <ul className="indl" data-rv="">
              {s.ind.map((n) => {
                const [a, b] = n.split(" – ");
                return (
                  <li key={n}>
                    <b>{a}</b>
                    {b && <span>{b}</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {s.extra && (
        <section className="sec ice">
          <div className="wrap">
            <div className="head" data-rv="">
              <div>
                <span className="ov">The Padhya Software Technologies advantage</span>
                <h2>{s.extra[0]}</h2>
              </div>
            </div>
            <div className="f4">
              {s.extra[1].map((f, i) => (
                <div data-rv={(i % 2) * 100} key={f[0]}>
                  <h3>{f[0]}</h3>
                  <p>{f[1]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="est">
        <div className="wrap est-in" data-rv="">
          <div>
            <h2>Get a fixed cost estimate for your {nm} project – within 24 hours</h2>
            <p>Tell us about your requirements and receive a customised project estimate, timeline and proposal. No commitment required.</p>
          </div>
          <div className="est-a">
            <a className="btn btn-white" href="#consultation">
              Get Free Estimate <Arrow />
            </a>
            <a className="est-l" href={`tel:${P.phone}`}>
              <Icon d={IC.phone} /> {P.phoneDisp}
            </a>
            <a className="est-l" href={`${P.wa}?text=${encodeURIComponent("Hi Padhya Software Technologies, I'm interested in your " + nm + " services")}`} target="_blank" rel="noopener noreferrer">
              <Icon d={WA_ICON} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <FaqSection list={FAQ_SVC[s.slug]} faqKey={s.slug} title={`${nm} – frequently asked questions`} />

      <section className="sec ice">
        <div className="wrap">
          <div className="head" data-rv="">
            <div>
              <span className="ov">Related services</span>
              <h2>You may also need</h2>
            </div>
          </div>
          <div className="sgrid rel3">
            {rel.map((r, i) => (
              <ServiceCard s={r} i={i} key={r.slug} />
            ))}
          </div>
        </div>
      </section>

      <FormSection pre={svcFormName(s)} cls="" />
    </>
  );
}
