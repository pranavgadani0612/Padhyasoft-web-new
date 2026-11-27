import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../assets/logo.webp";
import { IC, INDUSTRIES, P, SERVICES } from "../../data/site.js";
import { useUI } from "../../context.js";
import { Icon, Photo, SocialLinks } from "../ui.jsx";

const isDesktop = () => matchMedia("(min-width:1001px)").matches;
const Chevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);
const SmallArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* Thin bar above the header */
export function UtilBar() {
  return (
    <div className="util">
      <div className="wrap">
        <div className="l">
          <span className="reg">
            Offices: <b>India</b> · <b>Denmark</b>
          </span>
          <span>{P.hours}</span>
        </div>
        <div className="r">
          <a href={`mailto:${P.email}`}>{P.email}</a>
          <a href={`tel:${P.phone}`}>{P.phoneDisp}</a>
          <span className="social-slot">
            <SocialLinks />
          </span>
        </div>
      </div>
    </div>
  );
}

/* Sticky header: mega menus, mobile burger menu, hide-on-scroll */
export default function Header() {
  const { openSearch, searchBtnRef } = useUI();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTop, setMenuTop] = useState("");
  const [drops, setDrops] = useState({}); // which mega menus are open
  const [hoverOff, setHoverOff] = useState(false); // after clicking a link inside a mega menu, keep it closed until the mouse leaves
  const [hovered, setHovered] = useState(null); // "svc" | "ind" while the mouse is over that menu
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const navRef = useRef(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    if (isDesktop()) setMenuTop("");
    setDrops({});
  }, []);

  // close everything when the route changes
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
  }, [menuOpen]);

  // mobile menu open: the page behind must not scroll (CSS locks <html>; this also covers older iPhones,
  // where touch scrolling ignores overflow:hidden). The menu list itself still scrolls, but never past its ends.
  useEffect(() => {
    if (!menuOpen) return;
    const menu = document.getElementById("menu");
    let startY = 0;
    const onStart = (e) => { startY = e.touches[0]?.clientY ?? 0; };
    const blocks = (e, dy) => {
      if (!menu || !menu.contains(e.target)) return true;              // outside the menu
      if (menu.scrollHeight <= menu.clientHeight + 1) return true;     // menu has nothing to scroll
      const atTop = menu.scrollTop <= 0;
      const atEnd = menu.scrollTop + menu.clientHeight >= menu.scrollHeight - 1;
      return (atTop && dy > 0) || (atEnd && dy < 0);                   // would scroll past an end
    };
    const onMove = (e) => {
      const dy = (e.touches[0]?.clientY ?? 0) - startY;                 // > 0: finger moves down
      if (blocks(e, dy)) e.preventDefault();
    };
    const onWheel = (e) => { if (blocks(e, -e.deltaY)) e.preventDefault(); };
    addEventListener("touchstart", onStart, { passive: true });
    addEventListener("touchmove", onMove, { passive: false });
    addEventListener("wheel", onWheel, { passive: false });
    return () => {
      removeEventListener("touchstart", onStart);
      removeEventListener("touchmove", onMove);
      removeEventListener("wheel", onWheel);
    };
  }, [menuOpen]);

  // desktop mega menu (Services / Industries) open – by hover or by click – keeps the page from scrolling,
  // so the menu stays in place while the visitor reads it. No overflow:hidden (that would make the page jump).
  const megaShown = !!drops.svc || !!drops.ind || (!!hovered && !hoverOff);
  useEffect(() => {
    if (!megaShown || !isDesktop()) return; // effects run only in the browser (safe for pre-rendering)
    const stop = (e) => e.preventDefault();
    const SCROLL_KEYS = [" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"];
    const onKey = (e) => {
      if (/input|textarea|select/i.test(document.activeElement?.tagName || "")) return;
      if (SCROLL_KEYS.includes(e.key)) e.preventDefault();
    };
    addEventListener("wheel", stop, { passive: false });
    addEventListener("touchmove", stop, { passive: false });
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("wheel", stop);
      removeEventListener("touchmove", stop);
      removeEventListener("keydown", onKey);
    };
  }, [megaShown]);

  // hide header when scrolling down, show when scrolling up
  useEffect(() => {
    let lastY = scrollY;
    const onScroll = () => {
      const y = scrollY;
      setScrolled(y > 20);
      const b = document.body.classList;
      if (y > 500 && y > lastY + 2 && !b.contains("menu-open") && !b.contains("no-hide")) setHidden(true);
      if (y < lastY - 2) setHidden(false);
      lastY = y;
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  // click outside closes the desktop mega menus; Escape closes the menu
  useEffect(() => {
    const onClick = (e) => {
      if (!e.target.closest(".has-drop") && isDesktop()) setDrops({});
    };
    const onKey = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [closeMenu]);

  const toggleBurger = () => {
    if (navRef.current) setMenuTop(Math.max(navRef.current.getBoundingClientRect().bottom, 0) + "px");
    setMenuOpen((o) => !o);
  };
  const toggleDrop = (k) => setDrops((d) => ({ ...d, [k]: !d[k] }));
  const closeMega = (e) => {
    if (!e.target.closest("a")) return;
    setDrops({});
    if (isDesktop()) setHoverOff(true);
    document.activeElement?.blur?.();
  };

  const navLink = (match, label, to = match) => {
    const on = pathname.startsWith(match);
    return (
      <a href={to} className={on ? "active" : undefined} aria-current={on ? "page" : undefined}>
        {label}
      </a>
    );
  };

  return (
    <header id="nav" ref={navRef} className={[scrolled && "scrolled", hidden && "hidden"].filter(Boolean).join(" ") || undefined}>
      <div className="wrap">
        <a className="logo" href="/" aria-label="Padhya Software Technologies – home">
          <img src={logo} alt="Padhya Software Technologies" width="157" height="44" />
        </a>
        <ul id="menu" className={menuOpen ? "open" : undefined} style={menuTop ? { top: menuTop } : undefined}>
          <li className={`has-drop${drops.svc ? " open" : ""}${hoverOff ? " no-hover" : ""}`} onMouseEnter={() => setHovered("svc")} onMouseLeave={() => { setHoverOff(false); setHovered(null); }}>
            <button className="drop-btn" aria-expanded={!!drops.svc} aria-haspopup="true" onClick={() => toggleDrop("svc")}>
              Services
              <Chevron />
            </button>
            <div className="mega" onClick={closeMega}>
              <div className="in">
                <div className="intro">
                  <h4>Services</h4>
                  <p>Eleven services delivered by one accountable team – from first idea to long-term support.</p>
                  <a className="lnk" href="/services">
                    All services <SmallArrow />
                  </a>
                </div>
                <ul className="drop-slot">
                  {SERVICES.map((s) => (
                    <li key={s.slug}>
                      <a href={`/service/${s.slug}`}>
                        <span className="di">
                          <Icon d={s.icon} />
                        </span>
                        <span>
                          <b>{s.name}</b>
                          <small>{s.short}</small>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="feat" id="megaFeat">
                  <Photo k="trace" />
                  <div>
                    <b>Our specialty: Track &amp; Trace</b>
                    <a href="/service/trackandtracesystem">Explore the solution →</a>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className={`has-drop${drops.ind ? " open" : ""}${hoverOff ? " no-hover" : ""}`} onMouseEnter={() => setHovered("ind")} onMouseLeave={() => { setHoverOff(false); setHovered(null); }}>
            <button className="drop-btn" aria-expanded={!!drops.ind} aria-haspopup="true" onClick={() => toggleDrop("ind")}>
              Industries
              <Chevron />
            </button>
            <div className="mega" onClick={closeMega}>
              <div className="in in-ind">
                <div className="intro">
                  <h4>Industries</h4>
                  <p>Software engineered for the sectors we know best.</p>
                </div>
                <ul className="inds" id="megaInd">
                  {INDUSTRIES.map((i) => (
                    <li key={i.name}>
                      <a href={`/service/${i.svc}`}>
                        <b>{i.name}</b>
                        <span>{i.short}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
          <li>{navLink("/about", "About")}</li>
          <li>{navLink("/blog", "Blogs", "/blogs")}</li>
          <li>{navLink("/contact", "Contact")}</li>
          <li className="menu-cta">
            <a className="btn btn-primary" href="/contact" style={{ width: "100%", justifyContent: "center" }}>
              Get a quote
            </a>
          </li>
        </ul>
        <div className="navr">
          <button className="iconbtn" id="openSearch" ref={searchBtnRef} aria-label="Search the website" onClick={openSearch}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </button>
          <a className="iconbtn hdr-call" href={`tel:${P.phone}`} aria-label={`Call Padhya Software Technologies: ${P.phoneDisp}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={IC.phone} />
            </svg>
          </a>
          <a className="btn btn-primary" href="/contact">
            Get a quote
          </a>
          <button id="burger" aria-label="Open menu" aria-expanded={menuOpen} aria-controls="menu" onClick={toggleBurger}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
