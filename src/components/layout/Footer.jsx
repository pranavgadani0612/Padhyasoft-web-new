import logoFooter from "../../assets/logo-footer.webp";
import { FOOT_ABOUT, INDUSTRIES, P, SERVICES } from "../../data/site.js";
import { SocialLinks } from "../ui.jsx";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="ftop">
          <h2>Let's build what's next for your business.</h2>
          <a className="btn btn-white" href="/contact">
            Get Free Consultation
          </a>
        </div>
        <div className="foot">
          <div>
            <a className="flogo" href="/">
              <img src={logoFooter} alt="Padhya Software Technologies" width="171" height="48" />
            </a>
            <p style={{ fontSize: ".9rem" }}>{FOOT_ABOUT}</p>
            <div className="social-slot">
              <SocialLinks />
            </div>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <a href={`/service/${s.slug}`}>{s.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Industries</h4>
            <ul>
              {INDUSTRIES.map((i) => (
                <li key={i.name}>
                  <a href={`/service/${i.svc}`}>{i.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="/blogs">Blogs</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/terms-and-conditions">Terms &amp; Conditions</a></li>
            </ul>
          </div>
          <div>
            <h4>Offices</h4>
            <ul>
              <li style={{ color: "#fff", fontWeight: 700 }}>India</li>
              <li><a href={`mailto:${P.email}`}>{P.email}</a></li>
              <li><a href={`tel:${P.phone}`}>{P.phoneDisp}</a></li>
              <li style={{ color: "#fff", fontWeight: 700, marginTop: ".6rem" }}>Denmark</li>
              <li><a href={`mailto:${P.dkEmail}`}>{P.dkEmail}</a></li>
              <li><a href={`tel:${P.dkPhone}`}>{P.dkPhoneDisp}</a></li>
            </ul>
          </div>
        </div>
        <div className="copy">
          <span>© 2026 Padhya Software Technologies Pvt. Ltd. All Rights Reserved.</span>
          <span>
            <a href="/privacy-policy">Privacy</a>
            <a href="/terms-and-conditions">Terms</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
