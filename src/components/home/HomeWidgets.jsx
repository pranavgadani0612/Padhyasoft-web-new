/* Interactive widgets used on the home page: featured card stack, services/industries tabs, stories carousel */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ENTERPRISE, FEATURED, IC, INDUSTRIES, reduce, svcBy } from "../../data/site.js";
import { ServiceGrid } from "../sections/Sections.jsx";

// useLayoutEffect in the browser, useEffect during build-time pre-rendering (avoids a server warning)
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
import { Arrow, Icon, Photo } from "../ui.jsx";

/* ---------- featured card stack (auto-advances every 5s, pauses on hover) ---------- */
export function FeatureCarousel() {
  const [cur, setCur] = useState(0);
  const [cycle, setCycle] = useState(0); // bumps on every change to restart the progress bar + timer
  const [paused, setPaused] = useState(false);
  const n = FEATURED.length;

  const go = useCallback((i) => {
    setCur(((i % n) + n) % n);
    setCycle((c) => c + 1);
  }, [n]);

  useEffect(() => {
    if (reduce || paused) return;
    const t = setTimeout(() => go(cur + 1), 5000);
    return () => clearTimeout(t);
  }, [cur, cycle, paused, go]);

  // only the front card's illustration animates; the two stacked behind it are paused
  const featRef = useRef(null);
  useEffect(() => {
    featRef.current?.querySelectorAll(".fcard").forEach((card, j) => {
      const svg = card.querySelector("svg");
      if (!svg || typeof svg.pauseAnimations !== "function") return;
      if ((j - cur + n) % n === 0) svg.unpauseAnimations();
      else svg.pauseAnimations();
    });
  }, [cur, n]);

  return (
    <div
      ref={featRef}
      className="feature fu"
      id="feature"
      style={{ animationDelay: ".4s" }}
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        go(cur);
      }}
    >
      {FEATURED.map((f, j) => {
        const pos = (j - cur + n) % n;
        return (
          <article className="fcard" data-pos={pos} aria-hidden={pos !== 0} key={f.h}>
            <Photo k={f.k} eager={j === 0} />
            <small>{f.s}</small>
            <h3>{f.h}</h3>
            <p>{f.p}</p>
            <a className="lnk" href={f.l} tabIndex={pos ? -1 : 0}>
              {f.t} <Arrow />
            </a>
          </article>
        );
      })}
      <div className="fctl">
        <button className="ar" aria-label="Previous feature" onClick={() => go(cur - 1)}>
          <Icon d={IC.l} />
        </button>
        <span className="ct">
          <span>0{cur + 1}</span> / 0{n}
        </span>
        <span className="pb">
          <i key={cycle} id="fBar" className={reduce ? undefined : "run"} style={paused ? { animationPlayState: "paused" } : undefined}></i>
        </span>
        <button className="ar" aria-label="Next feature" onClick={() => go(cur + 1)}>
          <Icon d={IC.r} />
        </button>
      </div>
    </div>
  );
}

/* ---------- services / industries tabs with sliding indicator ---------- */
const TABS = [
  ["s", "Services"],
  ["i", "Industries"],
];
export function WhatWeDoTabs() {
  const [tab, setTab] = useState("s");
  const [indStyle, setIndStyle] = useState({});
  const btnRefs = useRef({});

  const measure = useCallback(() => {
    const a = btnRefs.current[tab];
    if (a) setIndStyle({ left: a.offsetLeft + "px", width: a.offsetWidth + "px" });
  }, [tab]);
  useIsoLayoutEffect(() => {
    measure();
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, [measure]);

  const onKey = (e, i) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next = TABS[(i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length][0];
      btnRefs.current[next].focus();
      setTab(next);
    }
  };

  return (
    <>
      <div className="tabs" role="tablist" id="wtabs">
        {TABS.map(([k, label], i) => (
          <button key={k} role="tab" aria-selected={tab === k} ref={(el) => (btnRefs.current[k] = el)} onClick={() => setTab(k)} onKeyDown={(e) => onKey(e, i)}>
            {label}
          </button>
        ))}
        <span className="ind" style={indStyle}></span>
      </div>
      <div id="tpanel">
        <div className="tpanel" key={tab}>
          {tab === "s" ? (
            <ServiceGrid revealed />
          ) : (
            <div className="igrid">
              {INDUSTRIES.map((x) => (
                <a className="ind-c" href={`/service/${x.svc}`} key={x.name}>
                  <Photo k={x.key} />
                  <h3>{x.name}</h3>
                  <p>{x.text}</p>
                  <div className="tags">
                    {x.tags.map((g) => (
                      <span key={g}>{g}</span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ---------- enterprise stories carousel: arrows + mouse drag + auto-advance + progress bar ---------- */
export function StoriesCarousel() {
  const carRef = useRef(null);
  const barRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const car = carRef.current,
      cb = barRef.current,
      pv = prevRef.current,
      nx = nextRef.current;
    const n = ENTERPRISE.length;
    // the list is rendered 3 times; we stay inside the middle copy and silently jump by one copy at the edges = endless loop
    const cards = () => car.querySelectorAll(".story");
    const stepW = () => {
      const c = cards();
      return c[1].offsetLeft - c[0].offsetLeft;
    };
    const setW = () => {
      const c = cards();
      return c[n].offsetLeft - c[0].offsetLeft;
    };
    const jump = (x) => {
      car.style.scrollSnapType = "none";
      car.style.scrollBehavior = "auto";
      car.scrollLeft = x;
      requestAnimationFrame(() => {
        car.style.scrollSnapType = "";
        car.style.scrollBehavior = "";
      });
    };
    const wrap = () => {
      const w = setW();
      if (car.scrollLeft >= 2 * w - 5) jump(car.scrollLeft - w);
      else if (car.scrollLeft < w - stepW() + 5) jump(car.scrollLeft + w);
    };
    const upd = () => {
      const w = setW();
      const p = ((((car.scrollLeft - w) % w) + w) % w) / w;
      const bw = 100 / n;
      cb.style.width = bw + "%";
      cb.style.marginLeft = Math.min(p * 100, 100 - bw) + "%";
    };
    let idle = 0;
    const onScroll = () => {
      upd();
      clearTimeout(idle);
      idle = setTimeout(() => !down && wrap(), 140);
    };
    const go = (dir) => car.scrollBy({ left: dir * stepW(), behavior: reduce ? "auto" : "smooth" });
    const onPrev = () => go(-1);
    const onNext = () => go(1);
    const onResize = () => {
      jump(setW());
      upd();
    };
    pv.addEventListener("click", onPrev);
    nx.addEventListener("click", onNext);
    car.addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    jump(setW()); // start on the first card of the middle copy
    upd();
    let down = false,
      touching = false,
      sx = 0,
      sl = 0,
      moved = false;
    const pd = (e) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      moved = false;
      sx = e.clientX;
      sl = car.scrollLeft;
      car.classList.add("drag");
    };
    const pm = (e) => {
      if (!down) return;
      const d = e.clientX - sx;
      if (Math.abs(d) > 5) moved = true;
      car.scrollLeft = sl - d;
    };
    const pu = () => {
      if (!down) return;
      down = false;
      car.classList.remove("drag");
      wrap();
    };
    const clk = (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    const tOn = () => (touching = true),
      tOff = () => (touching = false);
    car.addEventListener("pointerdown", pd);
    addEventListener("pointermove", pm);
    addEventListener("pointerup", pu);
    car.addEventListener("click", clk, true);
    car.addEventListener("touchstart", tOn, { passive: true });
    car.addEventListener("touchend", tOff, { passive: true });

    // keeps sliding one card every 3.5s, forever (pauses only while the user drags / touches it)
    const auto = reduce
      ? 0
      : setInterval(() => {
          if (down || touching || document.hidden) return;
          go(1);
        }, 3500);

    return () => {
      clearInterval(auto);
      clearTimeout(idle);
      pv.removeEventListener("click", onPrev);
      nx.removeEventListener("click", onNext);
      car.removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      car.removeEventListener("pointerdown", pd);
      removeEventListener("pointermove", pm);
      removeEventListener("pointerup", pu);
      car.removeEventListener("click", clk, true);
      car.removeEventListener("touchstart", tOn);
      car.removeEventListener("touchend", tOff);
    };
  }, []);

  return (
    <section className="sec">
      <div className="head wrap" data-rv="">
        <div>
          <span className="ov">Trusted at Scale</span>
          <h2>Enterprise Experience</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1.2rem" }}>
          <p style={{ color: "var(--muted)", maxWidth: "48ch" }}>
            We've built business-critical software for enterprises, manufacturers and growth-stage companies.
          </p>
          <div className="carctl">
            <button ref={prevRef} aria-label="Previous story">
              <Icon d={IC.l} />
            </button>
            <button ref={nextRef} aria-label="Next story">
              <Icon d={IC.r} />
            </button>
          </div>
        </div>
      </div>
      <div className="car" id="car" ref={carRef}>
        {[0, 1, 2].flatMap((copy) => ENTERPRISE.map((e, i) => (
          <article className="story" key={copy + e[0]} aria-hidden={copy !== 1 || undefined}>
            <Photo k={["erp", "web", "automation"][i]} />
            <div className="tx">
              <small>Client story · 0{i + 1}</small>
              <h3>{e[0]}</h3>
              <p>{e[1]}</p>
              <div className="tags">
                {e[2].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <a className="lnk" href={`/service/${e[3]}`} draggable="false" tabIndex={copy !== 1 ? -1 : undefined}>
                View {svcBy(e[3])?.name || "service"} <Arrow />
              </a>
            </div>
          </article>
        )))}
      </div>
      <div className="carbar">
        <i ref={barRef}></i>
      </div>
      <div className="wrap" style={{ marginTop: "2.4rem" }} data-rv="">
        <a className="btn btn-primary" href="#consultation">
          Discuss Your Enterprise Project <Arrow />
        </a>
      </div>
    </section>
  );
}
