import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { PH, reduce, SOCIAL } from "../data/site.js";
import { SC } from "../lib/illustrations.js";

/* Outline icon from a single SVG path */
export function Icon({ d, className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export const CHECK = "M5 12l5 5L20 7";
export const WA_ICON = "M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3z";

/* Arrow used inside buttons and links */
export function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* Animated SVG scene (if one exists for the key) or a stock photo with graceful fallback */
/* Animated SVG illustration. Its SMIL animations are paused while it is off screen –
   otherwise every scene on the page keeps forcing style/layout/paint work and scrolling stutters. */
let sceneIO;
function Scene({ k, className, html }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const svg = el?.querySelector("svg");
    if (!svg || typeof svg.pauseAnimations !== "function") return;
    if (!sceneIO)
      sceneIO = new IntersectionObserver(
        (entries) =>
          entries.forEach((en) => {
            const s = en.target.querySelector("svg");
            if (!s) return;
            // cards stacked behind the visible one (aria-hidden) stay paused too
            if (en.isIntersecting && !document.hidden && !en.target.closest('[aria-hidden="true"]')) s.unpauseAnimations();
            else s.pauseAnimations();
          }),
        { rootMargin: "120px 0px" }
      );
    svg.pauseAnimations(); // start paused; the observer resumes it when visible
    sceneIO.observe(el);
    return () => sceneIO.unobserve(el);
  }, [html]);
  return <div ref={ref} className={`ph scn scn-${k} ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Photo({ k, className = "", eager = false, parallax }) {
  const [failed, setFailed] = useState(false);
  const scene = useMemo(() => (SC[k] ? SC[k]() : null), [k]);
  if (scene) return <Scene k={k} className={className} html={scene} />;
  const p = PH[k] || PH.office;
  const imgProps = eager ? { fetchpriority: "high" } : { loading: "lazy" };
  return (
    <div className={`ph ${className}`} data-parallax={parallax}>
      {!failed && <img src={p[0]} alt={p[1]} {...imgProps} decoding="async" onError={() => setFailed(true)} />}
    </div>
  );
}

export function SocialLinks() {
  return SOCIAL.map(([n, u, p]) => (
    <a key={n} href={u} target="_blank" rel="noopener noreferrer" aria-label={n}>
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d={p} />
      </svg>
    </a>
  ));
}

/* Number that counts up when it scrolls into view */
export function Counter({ end }) {
  const ref = useRef(null);
  const [v, setV] = useState(() => (typeof window === "undefined" ? end : 0)); // pre-rendered HTML shows the real number
  useEffect(() => {
    let raf = 0;
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now(),
          dur = reduce ? 0 : 1800;
        const tick = (t) => {
          const p = dur ? Math.min((t - t0) / dur, 1) : 1;
          setV(Math.round(end * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [end]);
  return <span ref={ref}>{v}</span>;
}

/* Heading whose words slide up one after another.
   parts: array of strings or { text, className } segments. */
export function SplitHeading({ as: Tag = "h1", id, className = "", parts, base = 0, step = 60 }) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (reduce) return;
    let r2;
    const r1 = requestAnimationFrame(() => (r2 = requestAnimationFrame(() => setGo(true))));
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, []);
  const segs = parts.map((p) => (typeof p === "string" ? { text: p } : p));
  if (reduce)
    return (
      <Tag id={id} className={className || undefined}>
        {segs.map((s, i) => (s.className ? <span key={i} className={s.className}>{s.text}</span> : s.text))}
      </Tag>
    );
  let n = 0;
  const words = (text) =>
    text
      .split(/(\s+)/)
      .filter(Boolean)
      .map((w, j) =>
        /^\s+$/.test(w) ? (
          w
        ) : (
          <span className="wd" key={j}>
            <span style={{ transitionDelay: base + step * n++ + "ms" }}>{w}</span>
          </span>
        )
      );
  return (
    <Tag id={id} className={`${className} split${go ? " go" : ""}`.trim()}>
      {segs.map((s, i) =>
        s.className ? (
          <span key={i} className={s.className}>
            {words(s.text)}
          </span>
        ) : (
          <Fragment key={i}>{words(s.text)}</Fragment>
        )
      )}
    </Tag>
  );
}

export function useTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
