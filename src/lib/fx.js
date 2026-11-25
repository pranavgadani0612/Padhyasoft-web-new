/* Scroll-driven effects shared by every page (reveal-on-scroll, parallax, smooth wheel scrolling). */
import { reduce, finePointer } from "../data/site.js";

/* ---------- reveal: any element with data-rv fades/slides in when it scrolls into view ---------- */
let revealIO;
export function initReveal(root = document) {
  if (!root) return;
  if (!revealIO)
    revealIO = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (en.isIntersecting) {
            const t = en.target;
            (t.__rv || []).forEach((x) => x.classList.add("in"));
            if (t.hasAttribute("data-rv")) t.classList.add("in");
            revealIO.unobserve(t);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
  root.querySelectorAll("[data-rv]").forEach((el) => {
    if (reduce) {
      el.classList.add("in");
      return;
    }
    const d = el.dataset.rv;
    if (d && isFinite(d)) el.style.transitionDelay = d + "ms";
    if (d === "clip") {
      const t = el.parentElement;
      t.__rv = (t.__rv || []).concat(el);
      revealIO.observe(t);
    } else revealIO.observe(el);
  });
}

/* ---------- parallax: any element with data-parallax="0.15" moves while scrolling ---------- */
export function runParallax() {
  if (reduce) return;
  const vh = innerHeight;
  document.querySelectorAll("[data-parallax]").forEach((el) => {
    const r = el.parentElement.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) return;
    const f = +el.dataset.parallax || 0.15;
    const c = r.top + r.height / 2 - vh / 2;
    el.style.transform = `translate3d(0,${(-c * f).toFixed(1)}px,0) scale(${el.dataset.scale || 1.15})`;
  });
}

export function initParallax() {
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        runParallax();
      });
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", runParallax);
  return () => {
    removeEventListener("scroll", onScroll);
    removeEventListener("resize", runParallax);
  };
}

/* ---------- smooth inertial wheel scrolling (desktop only; native scroll stays in control) ---------- */
export function initSmooth() {
  if (reduce || !finePointer) return () => {};
  document.documentElement.style.scrollBehavior = "auto";
  let target = scrollY,
    cur = scrollY,
    active = false;
  const max = () => document.documentElement.scrollHeight - innerHeight;
  const loop = () => {
    cur += (target - cur) * 0.11;
    if (Math.abs(target - cur) < 0.5) {
      cur = target;
      active = false;
      scrollTo(0, cur);
      return;
    }
    scrollTo(0, cur);
    requestAnimationFrame(loop);
  };
  const onWheel = (e) => {
    if (e.ctrlKey || e.defaultPrevented) return;
    if (e.target.closest(".cb-win,.mega,#menu,iframe,textarea,select,.modal,[data-native-scroll]")) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    e.preventDefault();
    if (!active) {
      cur = scrollY;
      target = scrollY;
    }
    target = Math.max(0, Math.min(target + e.deltaY * (e.deltaMode === 1 ? 40 : 1), max()));
    if (!active) {
      active = true;
      requestAnimationFrame(loop);
    }
  };
  const onScroll = () => {
    if (!active) {
      target = scrollY;
      cur = scrollY;
    }
  };
  const onHash = () => {
    active = false;
    target = 0;
    cur = 0;
  };
  addEventListener("wheel", onWheel, { passive: false });
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("hashchange", onHash);
  return () => {
    removeEventListener("wheel", onWheel);
    removeEventListener("scroll", onScroll);
    removeEventListener("hashchange", onHash);
  };
}
