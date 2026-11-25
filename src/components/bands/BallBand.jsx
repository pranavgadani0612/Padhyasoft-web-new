import { useEffect, useRef } from "react";
import { Photo } from "../ui.jsx";

/* Graphic design: a glowing ball that chases the pointer at full speed, then keeps bouncing on its own */
export default function BallBand() {
  const bandRef = useRef(null);
  const cvRef = useRef(null);
  const hintRef = useRef(null);

  useEffect(() => {
    const cv = cvRef.current,
      band = bandRef.current,
      ctx = cv.getContext("2d"),
      hint = hintRef.current;
    let W,
      H,
      R,
      raf = 0,
      on = true;
    const t0 = performance.now();
    const size = () => {
      const r = band.getBoundingClientRect(),
        d = Math.min(devicePixelRatio, 2);
      W = r.width;
      H = r.height;
      cv.width = W * d;
      cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      R = W < 640 ? 28 : 44;
    };
    size();
    const b = { x: W * 0.5, y: H * 0.5, vx: 6, vy: -4.5 },
      trail = [];
    let ptr = null,
      lastPtr = 0;
    const setP = (cx, cy) => {
      const r = band.getBoundingClientRect();
      ptr = { x: cx - r.left, y: cy - r.top };
      lastPtr = performance.now();
      hint && hint.classList.add("gone");
    };
    const pm = (e) => setP(e.clientX, e.clientY);
    const tm = (e) => {
      const t = e.touches[0];
      if (t) setP(t.clientX, t.clientY);
    };
    const pl = () => {
      lastPtr = 0;
    };
    band.addEventListener("pointermove", pm);
    band.addEventListener("pointerdown", pm);
    band.addEventListener("touchstart", tm, { passive: true });
    band.addEventListener("touchmove", tm, { passive: true });
    band.addEventListener("pointerleave", pl);

    const frame = (t) => {
      const chasing = ptr && t - lastPtr < 1200;
      if (chasing) {
        const nx = b.x + (ptr.x - b.x) * 0.55,
          ny = b.y + (ptr.y - b.y) * 0.55;
        b.vx = nx - b.x;
        b.vy = ny - b.y;
        b.x = nx;
        b.y = ny;
      } else {
        const sp = Math.hypot(b.vx, b.vy);
        if (sp < 5) {
          const k = 5 / (sp || 1);
          b.vx = (b.vx || 1) * k;
          b.vy = (b.vy || 1) * k;
        } else if (sp > 22) {
          b.vx *= 0.97;
          b.vy *= 0.97;
        }
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < R) { b.x = R; b.vx = Math.abs(b.vx); }
        if (b.x > W - R) { b.x = W - R; b.vx = -Math.abs(b.vx); }
        if (b.y < R) { b.y = R; b.vy = Math.abs(b.vy); }
        if (b.y > H - R) { b.y = H - R; b.vy = -Math.abs(b.vy); }
      }
      trail.push({ x: b.x, y: b.y });
      if (trail.length > 18) trail.shift();
      const hue = 215 + Math.sin((t - t0) / 1400) * 55;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      trail.forEach((p, i) => {
        const k = i / trail.length;
        ctx.fillStyle = `hsla(${hue + (1 - k) * 60},90%,62%,${k * 0.28})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, R * (0.35 + k * 0.6), 0, 6.3);
        ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over";
      const sp = Math.hypot(b.vx, b.vy),
        st = Math.min(sp / 45, 0.35),
        ang = Math.atan2(b.vy, b.vx);
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(ang);
      ctx.scale(1 + st, 1 - st * 0.6);
      const g0 = ctx.createRadialGradient(0, 0, R * 0.6, 0, 0, R * 2.2);
      g0.addColorStop(0, `hsla(${hue},95%,65%,.45)`);
      g0.addColorStop(1, "hsla(0,0%,100%,0)");
      ctx.fillStyle = g0;
      ctx.beginPath();
      ctx.arc(0, 0, R * 2.2, 0, 6.3);
      ctx.fill();
      const g = ctx.createRadialGradient(-R * 0.35, -R * 0.4, R * 0.1, 0, 0, R);
      g.addColorStop(0, "#fff");
      g.addColorStop(0.25, `hsl(${hue},95%,72%)`);
      g.addColorStop(1, `hsl(${hue + 40},80%,38%)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, 6.3);
      ctx.fill();
      ctx.restore();
      if (on) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

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
        if (!on) {
          on = true;
          raf = requestAnimationFrame(frame);
        }
      } else {
        on = false;
        cancelAnimationFrame(raf);
      }
    });
    vis.observe(band);
    return () => {
      on = false;
      cancelAnimationFrame(raf);
      removeEventListener("resize", rs);
      vis.disconnect();
      band.removeEventListener("pointermove", pm);
      band.removeEventListener("pointerdown", pm);
      band.removeEventListener("touchstart", tm);
      band.removeEventListener("touchmove", tm);
      band.removeEventListener("pointerleave", pl);
    };
  }, []);

  return (
    <div className="band ballband" ref={bandRef}>
      <Photo k="brand" />
      <canvas ref={cvRef} aria-hidden="true"></canvas>
      <span className="bb-hint" ref={hintRef}>
        Move your cursor – or tap – to play
      </span>
    </div>
  );
}
