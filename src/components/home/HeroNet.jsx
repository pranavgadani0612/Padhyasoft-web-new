import { useEffect, useRef } from "react";
import { reduce } from "../../data/site.js";

/* Animated network of dots behind the home hero; lines reach towards the pointer */
export default function HeroNet() {
  const cvRef = useRef(null);

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv || reduce) return;
    const ctx = cv.getContext("2d");
    let W,
      H,
      pts,
      raf = 0,
      mouse = { x: -999, y: -999 };
    const size = () => {
      const r = cv.getBoundingClientRect(),
        d = Math.min(devicePixelRatio, 2);
      W = r.width;
      H = r.height;
      cv.width = W * d;
      cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.min(90, Math.floor((W * H) / 14000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35 }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      // Lines are batched into a few opacity buckets: one stroke() per bucket instead of one per line
      // (thousands of tiny strokes per frame was what kept the main thread busy on slower laptops).
      const B = 6;
      const net = Array.from({ length: B }, () => new Path2D());
      const toMouse = Array.from({ length: B }, () => new Path2D());
      const dots = new Path2D();
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j],
            dx = a.x - b.x,
            dy = a.y - b.y,
            d = dx * dx + dy * dy;
          if (d < 15000) {
            const path = net[Math.min(B - 1, Math.floor((1 - d / 15000) * B))];
            path.moveTo(a.x, a.y);
            path.lineTo(b.x, b.y);
          }
        }
        const mx = a.x - mouse.x,
          my = a.y - mouse.y,
          md = mx * mx + my * my;
        if (md < 26000) {
          const path = toMouse[Math.min(B - 1, Math.floor((1 - md / 26000) * B))];
          path.moveTo(a.x, a.y);
          path.lineTo(mouse.x, mouse.y);
        }
        dots.moveTo(a.x + 1.6, a.y);
        dots.arc(a.x, a.y, 1.6, 0, 6.3);
      }
      ctx.lineWidth = 1;
      for (let k = 0; k < B; k++) {
        const s = (k + 0.5) / B; // same fade as before, at bucket resolution
        ctx.strokeStyle = `rgba(120,170,255,${(0.22 * s).toFixed(3)})`;
        ctx.stroke(net[k]);
        ctx.strokeStyle = `rgba(76,141,255,${(0.5 * s).toFixed(3)})`;
        ctx.stroke(toMouse[k]);
      }
      ctx.fillStyle = "rgba(170,200,255,.7)";
      ctx.fill(dots);
      raf = requestAnimationFrame(draw);
    };
    size();
    draw();
    const hero = cv.parentElement;
    const mm = (e) => {
      const r = cv.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const ml = () => (mouse = { x: -999, y: -999 });
    const tm = (e) => {
      const t = e.touches[0];
      if (t) mm(t);
    };
    hero.addEventListener("pointermove", mm);
    hero.addEventListener("pointerleave", ml);
    hero.addEventListener("touchstart", tm, { passive: true });
    hero.addEventListener("touchmove", tm, { passive: true });
    hero.addEventListener("touchend", ml, { passive: true });
    let lastW = innerWidth;
    const rs = () => {
      if (innerWidth !== lastW) {
        lastW = innerWidth;
        size();
      }
    };
    addEventListener("resize", rs);
    const vis = new IntersectionObserver((es) => {
      if (es[0].isIntersecting) {
        if (!raf) draw();
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    vis.observe(hero);
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      removeEventListener("resize", rs);
      vis.disconnect();
      hero.removeEventListener("pointermove", mm);
      hero.removeEventListener("pointerleave", ml);
      hero.removeEventListener("touchstart", tm);
      hero.removeEventListener("touchmove", tm);
      hero.removeEventListener("touchend", ml);
    };
  }, []);

  return <canvas className="net" id="net" ref={cvRef} aria-hidden="true"></canvas>;
}
