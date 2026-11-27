/* Small always-on pieces of the page chrome: preloader, scroll progress bar, floating buttons, cookie consent */
import { useEffect, useRef, useState } from "react";
import icon from "../../assets/icon.webp";
import { P, SOCIAL, reduce } from "../../data/site.js";

export function Preloader() {
  const [phase, setPhase] = useState(reduce ? "gone" : "show");
  useEffect(() => {
    if (reduce) return;
    let t2;
    const t1 = setTimeout(() => {
      setPhase("done");
      t2 = setTimeout(() => setPhase("gone"), 700);
    }, 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  if (phase === "gone") return null;
  return (
    <div id="preloader" className={phase === "done" ? "done" : undefined} aria-hidden="true">
      <div className="pl-in">
        <img src={icon} alt="" />
        <div className="pl-bar">
          <i></i>
        </div>
      </div>
    </div>
  );
}

/* Reading-progress bar + back-to-top ring (updated directly for smooth 60fps) */
function useScrollProgress(onUpdate) {
  useEffect(() => {
    const fn = () => {
      const y = scrollY,
        h = document.documentElement.scrollHeight - innerHeight;
      onUpdate(y, h > 0 ? y / h : 0);
    };
    addEventListener("scroll", fn, { passive: true });
    fn();
    return () => removeEventListener("scroll", fn);
  }, [onUpdate]);
}

export function ProgressBar() {
  const ref = useRef(null);
  const update = useRef((y, p) => ref.current && (ref.current.style.transform = `scaleX(${p})`)).current;
  useScrollProgress(update);
  return <div id="pbar" ref={ref}></div>;
}

export function FloatButtons() {
  const [shown, setShown] = useState(reduce);
  const ttRef = useRef(null);
  const ringRef = useRef(null);
  const update = useRef((y, p) => {
    ttRef.current?.classList.toggle("show", y > 700);
    if (ringRef.current) ringRef.current.style.strokeDashoffset = 151 * (1 - p);
  }).current;
  useScrollProgress(update);
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setShown(true), 1500);
    return () => clearTimeout(t);
  }, []);
  const toTop = (e) => {
    e.preventDefault();
    scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };
  return (
    <div id="float" className={shown ? "in" : undefined}>
      <a className="tt" ref={ttRef} href="#" aria-label="Back to top" onClick={toTop}>
        <svg className="ring" viewBox="0 0 52 52" fill="none">
          <circle ref={ringRef} cx="26" cy="26" r="24" stroke="#1B4999" strokeWidth="2" strokeDasharray="151" strokeDashoffset="151" />
        </svg>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5l-7 7h4v7h6v-7h4z" />
        </svg>
        <span className="tip">Back to top</span>
      </a>
      <a className="cl" href={`tel:${P.phone}`} aria-label="Call Padhya Software Technologies">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.6a1 1 0 01-.25 1z" />
        </svg>
        <span className="tip">Call now</span>
      </a>
      <a className="wa" href={`${P.wa}?text=${encodeURIComponent("Hi Padhya Software Technologies, I'd like a quote")}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.1.1.7-.1 1.3z" />
        </svg>
        <span className="tip">WhatsApp us</span>
      </a>
    </div>
  );
}

/* Organization schema + GDPR cookie consent + optional Google Tag Manager */
const CONSENT_KEY = "padhya-consent";
function loadGTM() {
  if (!P.GTM_ID || window.__gtm) return;
  window.__gtm = 1;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const g = document.createElement("script");
  g.async = true;
  g.src = "https://www.googletagmanager.com/gtm.js?id=" + P.GTM_ID;
  document.head.appendChild(g);
}

export function CookieConsent() {
  const [state, setState] = useState("hidden"); // hidden | show | closing | gone

  useEffect(() => {
    let v = null;
    try {
      v = localStorage.getItem(CONSENT_KEY);
    } catch (e) {}
    if (v === "all") loadGTM();
    let t;
    if (v !== "all" && v !== "essential") t = setTimeout(() => setState("show"), reduce ? 0 : 1800);
    return () => clearTimeout(t);
  }, []);

  const choose = (val) => {
    try {
      localStorage.setItem(CONSENT_KEY, val);
    } catch (e) {}
    setState("closing");
    setTimeout(() => setState("gone"), 400);
    if (val === "all") loadGTM();
  };

  if (state === "gone") return null;
  return (
    <div className={`consent${state === "show" ? " show" : ""}`} role="dialog" aria-label="Cookie consent">
      <p>
        We use cookies to understand how visitors use our website and to improve it. You can accept all cookies or keep only the essential ones.{" "}
        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>
      </p>
      <div>
        <button className="c-ess" onClick={() => choose("essential")}>
          Essential only
        </button>
        <button className="c-all" onClick={() => choose("all")}>
          Accept all
        </button>
      </div>
    </div>
  );
}
