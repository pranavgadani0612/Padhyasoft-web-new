import { useEffect, useMemo, useRef, useState } from "react";
import { INDUSTRIES, PAGES, SERVICES } from "../../data/site.js";
import { BLOGS } from "../../data/blog.js";

const ITEMS = [
  ...SERVICES.map((s) => [s.name, "/service/" + s.slug, "Service", s.short + " " + s.intro + " " + s.features.map((f) => f[0]).join(" ") + " " + s.tech.flat(2).join(" ")]),
  ...INDUSTRIES.map((i) => [i.name, "/service/" + i.svc, "Industry", i.short]),
  ...PAGES.map((p) => [p[0], p[1], p[2], ""]),
  ...BLOGS.map((b) => [b.title, "/blog/" + b.slug, "Blog", b.description]),
];
const SUGGEST = ["ERP", "Mobile app", "QR code", "Automation", "Website"];

/* Full-screen site search (open with the header button or the "/" key) */
export default function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("search-open", open);
    if (!open) return;
    setQ("");
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? ITEMS.filter((i) => (i[0] + " " + i[3]).toLowerCase().includes(s)) : ITEMS.slice(0, 6);
  }, [q]);

  const onKeyDown = (e) => {
    if (e.key === "Enter") listRef.current?.querySelector("a")?.click();
  };

  return (
    <div className={`search${open ? " open" : ""}`} id="search" data-native-scroll="" role="dialog" aria-modal="true" aria-label="Search">
      <button className="iconbtn x" aria-label="Close search" onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <div className="wrap">
        <label htmlFor="sq">Search Padhya</label>
        <input id="sq" ref={inputRef} placeholder="ERP, mobile app, QR code..." autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKeyDown} />
        <div className="sugg">
          {SUGGEST.map((s) => (
            <button key={s} onClick={() => setQ(s)}>
              {s}
            </button>
          ))}
        </div>
        <ul className="sres" ref={listRef} onClick={(e) => e.target.closest("a") && onClose()}>
          {results.length ? (
            results.map((i) => (
              <li key={i[2] + i[0]}>
                <a href={i[1]}>
                  <span>
                    <b>{i[0]}</b>
                    {i[3] && <small>{i[3].slice(0, 90)}…</small>}
                  </span>
                  <em>{i[2]}</em>
                </a>
              </li>
            ))
          ) : (
            <li style={{ padding: "1rem 0", color: "var(--muted)" }}>
              No results for “{q.trim().toLowerCase()}”. Try “ERP” or{" "}
              <a href="/contact" style={{ color: "var(--blue)", fontWeight: 700 }}>
                ask our team
              </a>
              .
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
