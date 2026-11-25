import { useUI } from "../context.js";
import { useTitle } from "../components/ui.jsx";

export default function NotFound() {
  useTitle("Page not found | Padhya Software Technologies");
  const { openSearch } = useUI();
  return (
    <section className="nf">
      <div className="wrap">
        <b>404</b>
        <h1 className="nf-h">This page doesn't exist</h1>
        <p>Try searching, or go back to the homepage. Popular pages: <a href="/services">Services</a> · <a href="/service/trackandtracesystem">Track &amp; Trace</a> · <a href="/blogs">Blogs</a> · <a href="/contact">Contact</a></p>
        <div style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
          <a className="btn btn-primary" href="/">
            Go to Home
          </a>
          <button className="btn btn-ghost" onClick={openSearch}>
            Search the site
          </button>
        </div>
      </div>
    </section>
  );
}
