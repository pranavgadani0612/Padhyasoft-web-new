import { FAQ_PAGE, P } from "../data/site.js";
import { FaqSection, FormSection, Offices, PageHero } from "../components/sections/Sections.jsx";
import { Arrow, useTitle } from "../components/ui.jsx";

export default function Contact() {
  useTitle("Contact Us | Padhya Software Technologies");
  return (
    <>
      <PageHero
        title="Contact Us"
        sub="Tell us about your project. We reply within 24 hours with a free consultation and a customised cost estimate."
        band={false}
        heroView="contact"
        cta={
          <a className="btn btn-primary ph-cta" href="#consultation">
            Fill in the form <Arrow />
          </a>
        }
      />
      <FormSection />
      <section className="sec">
        <div className="wrap">
          <div className="head" data-rv="">
            <div>
              <span className="ov">Global presence</span>
              <h2>Our offices</h2>
            </div>
            <p>{P.hours}</p>
          </div>
          <Offices />
          <div className="map" data-rv="">
            <iframe title="Padhya Software Technologies office map – Ahmedabad" src={P.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </section>
      <FaqSection list={FAQ_PAGE.contact} faqKey="contact" cls="ice" />
    </>
  );
}
