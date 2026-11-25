import { FAQ_PAGE } from "../data/site.js";
import { FaqSection, PageHero, ProcessSection, ServiceGrid } from "../components/sections/Sections.jsx";
import { useTitle } from "../components/ui.jsx";

export default function Services() {
  useTitle("Services | Padhya Software Technologies");
  return (
    <>
      <PageHero
        title="Services"
        sub="Comprehensive IT solutions for the modern business – from custom ERP and mobile apps to QR code and track-and-trace systems."
        photoKey="hub"
        heroView="services"
        bandSide={["Software & ERP", "Mobile Apps", "Web", "Automation", "Track & Trace", "Marketing"]}
      />
      <section className="sec">
        <div className="wrap">
          <ServiceGrid />
        </div>
      </section>
      <ProcessSection cls="ice" />
      <FaqSection list={FAQ_PAGE.services} href="/contact" />
    </>
  );
}
