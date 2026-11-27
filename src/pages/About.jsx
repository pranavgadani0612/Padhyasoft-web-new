import { ABOUT_APPROACH, ABOUT_DO, ABOUT_IND, ABOUT_WHY, FAQ_PAGE, IC, P, SERVICES, svcBy } from "../data/site.js";
import { FaqSection, NumsSection, Offices, PageHero, StepsRow } from "../components/sections/Sections.jsx";
import { Arrow, CHECK, Icon, WA_ICON, useTitle } from "../components/ui.jsx";

export function WhyList({ items }) {
  return (
    <ul className="why" data-rv="120">
      {items.map((w) => (
        <li key={w[0]}>
          <i>
            <Icon d={CHECK} />
          </i>
          <div>
            <b>{w[0]}</b>
            <span>{w[1]}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function About() {
  useTitle("About Us | Padhya Software Technologies");
  return (
    <>
      <PageHero
        title="About Padhya Software Technologies"
        sub="An Ahmedabad-based, founder-led software company building custom software, websites, mobile apps and business automation for businesses across India and international markets."
        photoKey="about"
        heroView="about"
        bandSide={["Founder-led", "7+ years", "150+ clients", "50+ projects", "Ahmedabad", "Denmark"]}
      />
      <section className="sec">
        <div className="wrap two">
          <div data-rv="">
            <span className="ov">Who we are</span>
            <h2>We build software designed specifically for your business</h2>
            <blockquote className="quote">“We don’t build generic software. We build software designed specifically for your business.”</blockquote>
          </div>
          <div data-rv="120" className="ab-copy">
            <p>
              Padhya Software Technologies is an Ahmedabad-based software company building custom software, websites, mobile applications and business automation solutions for businesses across India and
              international markets.
            </p>
            <p>
              We are a <b>founder-led company</b>, so our clients work directly with the people designing and developing their software. That means clear communication, faster decisions and solutions
              that truly match business requirements.
            </p>
            <p>
              Every business operates differently, so software should be built around the business – not the other way around. Every project is planned and developed to improve efficiency, reduce
              manual work and support long-term growth.
            </p>
          </div>
        </div>
      </section>
      <NumsSection />
      <section className="sec">
        <div className="wrap">
          <div className="head" data-rv="">
            <div>
              <span className="ov">Our services</span>
              <h2>What we do</h2>
            </div>
            <p>From custom software development to digital marketing, we deliver end-to-end technology solutions tailored to your business needs.</p>
          </div>
          <div className="ofr">
            {ABOUT_DO.map((d, i) => (
              <a className="ofc lnkc" href={`/service/${d[2]}`} data-rv={(i % 3) * 90} key={d[0]}>
                <span className="oi">
                  <Icon d={(svcBy(d[2]) || SERVICES[0]).icon} />
                </span>
                <h3>{d[0]}</h3>
                <p>{d[1]}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="sec dk">
        <div className="wrap">
          <div className="head" data-rv="">
            <div>
              <span className="ov">Industry expertise</span>
              <h2>Industries we serve</h2>
            </div>
            <p>Every solution is tailored to the industry’s unique workflows, compliance needs and operational challenges.</p>
          </div>
          <ul className="indl" data-rv="">
            {ABOUT_IND.map((n) => (
              <li key={n}>
                <b>{n}</b>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="sec">
        <div className="wrap two">
          <div data-rv="">
            <span className="ov">Why choose us</span>
            <h2>Why businesses choose Padhya Software Technologies</h2>
          </div>
          <WhyList items={ABOUT_WHY} />
        </div>
      </section>
      <section className="sec ice">
        <div className="wrap">
          <div className="head" data-rv="">
            <div>
              <span className="ov">Our process</span>
              <h2>Our approach</h2>
            </div>
          </div>
          <StepsRow steps={ABOUT_APPROACH} delay={120} />
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <div className="head" data-rv="">
            <div>
              <span className="ov">Global reach</span>
              <h2>Serving businesses across India &amp; worldwide</h2>
            </div>
            <p>
              Headquartered in Ahmedabad, Gujarat, with an additional office in Denmark, we work with clients across India, the UAE, Europe and North America – with direct communication and ongoing
              support.
            </p>
          </div>
          <div className="regions" data-rv="">
            {["India", "UAE", "Europe", "North America"].map((r) => (
              <span key={r}>{r}</span>
            ))}
          </div>
          <Offices />
        </div>
      </section>
      <FaqSection list={FAQ_PAGE.about} faqKey="about" href="/contact" />
      <section className="est">
        <div className="wrap est-in" data-rv="">
          <div>
            <h2>Ready to build something better?</h2>
            <p>Whether you need a custom software solution, a modern website, a mobile application or business automation, our team is ready to help.</p>
          </div>
          <div className="est-a">
            <a className="btn btn-white" href="/contact">
              Get a free quote <Arrow />
            </a>
            <a className="est-l" href={`${P.wa}?text=${encodeURIComponent("Hi Padhya Software Technologies, I'd like to discuss a project")}`} target="_blank" rel="noopener noreferrer">
              <Icon d={WA_ICON} /> Contact our team
            </a>
            <a className="est-l" href={`tel:${P.phone}`}>
              <Icon d={IC.phone} /> {P.phoneDisp}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
