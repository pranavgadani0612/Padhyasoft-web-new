import { useEffect, useRef } from "react";
import { reduce } from "../../data/site.js";

const NAMES = ["Production", "Inventory", "Quality", "Dispatch"];
const ST_POS = [0.14, 0.38, 0.62, 0.86];

/* Track & trace conveyor: boxes move along the belt and get scanned at each station */
export default function TraceBand() {
  const stRef = useRef(null);
  const unitsRef = useRef(null);
  const logRef = useRef(null);

  useEffect(() => {
    const st = stRef.current,
      logEl = logRef.current,
      unitsEl = unitsRef.current,
      stations = [...st.querySelectorAll(".tl-station")];
    let units = 1280,
      boxes = [],
      last = performance.now(),
      spawnT = 0,
      raf = 0,
      on = true;
    const spawn = () => {
      const b = document.createElement("div");
      b.className = "tl-box";
      b.innerHTML = "<i></i>";
      st.appendChild(b);
      boxes.push({ el: b, x: -80, hit: [0, 0, 0, 0], id: "PX-" + (4000 + Math.floor(Math.random() * 5999)) });
    };
    const flash = (i) => {
      stations[i].classList.add("hit");
      setTimeout(() => stations[i].classList.remove("hit"), 260);
    };
    const frame = (t) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const W = st.clientWidth;
      spawnT -= dt;
      if (spawnT <= 0) {
        spawn();
        spawnT = W < 600 ? 2.4 : 1.6;
      }
      boxes.forEach((b) => {
        b.x += W * 0.085 * dt;
        b.el.style.transform = `translateX(${b.x}px)`;
        ST_POS.forEach((p, i) => {
          if (!b.hit[i] && b.x + 28 >= W * p) {
            b.hit[i] = 1;
            flash(i);
            if (i === 0) b.el.classList.add("ok");
            logEl.textContent = `${b.id} scanned at ${NAMES[i]}`;
            if (i === 3) {
              units++;
              unitsEl.textContent = units.toLocaleString("en-IN");
            }
          }
        });
      });
      boxes = boxes.filter((b) => {
        if (b.x > W + 40) {
          b.el.remove();
          return false;
        }
        return true;
      });
      if (on) raf = requestAnimationFrame(frame);
    };

    if (reduce) {
      [0.1, 0.3, 0.5, 0.75].forEach((p, i) => {
        spawn();
        const b = boxes[i];
        b.x = st.clientWidth * p;
        b.el.style.transform = `translateX(${b.x}px)`;
        b.el.classList.add("ok");
      });
      return () => boxes.forEach((b) => b.el.remove());
    }
    raf = requestAnimationFrame(frame);
    const vis = new IntersectionObserver((es) => {
      if (es[0].isIntersecting) {
        if (!on) {
          on = true;
          last = performance.now();
          raf = requestAnimationFrame(frame);
        }
      } else {
        on = false;
        cancelAnimationFrame(raf);
      }
    });
    vis.observe(st);
    return () => {
      on = false;
      cancelAnimationFrame(raf);
      vis.disconnect();
      boxes.forEach((b) => b.el.remove());
    };
  }, []);

  return (
    <>
      <div className="tline" role="img" aria-label="Animation: products moving on a conveyor and being scanned at production, inventory, quality and dispatch">
        <div className="tl-st" id="tlStations" ref={stRef}>
          {NAMES.map((n, i) => (
            <div className="tl-station" style={{ left: [14, 38, 62, 86][i] + "%" }} key={n}>
              <h4>{n}</h4>
              <div className="gate">
                <span className="lamp"></span>
                <span className="beam"></span>
              </div>
            </div>
          ))}
          <div className="tl-belt"></div>
          <div className="tl-rollers"></div>
        </div>
        <div className="tl-ticker">
          <span>
            Units traced today: <b ref={unitsRef}>1,280</b>
          </span>
          <span ref={logRef} aria-live="off">
            Line started
          </span>
          <span>Live QR &amp; RFID tracking</span>
        </div>
      </div>
      <div className="tl-hazard"></div>
    </>
  );
}
