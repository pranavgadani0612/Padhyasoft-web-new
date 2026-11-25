import { useEffect, useMemo, useState } from "react";
import { reduce } from "../../data/site.js";

const N = 29;
/* Draws a QR-looking 29×29 module grid from a seed (decorative only) */
function qrSvg(seed) {
  let r = seed;
  const rnd = () => (r = (r * 1103515245 + 12345) % 2147483648) / 2147483648;
  const fin = (x, y) => {
    const inF = (fx, fy) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7;
    return inF(0, 0) || inF(N - 7, 0) || inF(0, N - 7);
  };
  const sep = (x, y) => (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
  let out = "";
  [[0, 0], [N - 7, 0], [0, N - 7]].forEach(([x, y]) => {
    out += `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
  });
  out += `<rect x="${N - 9}" y="${N - 9}" width="5" height="5"/><rect x="${N - 8}" y="${N - 8}" width="3" height="3" fill="#fff"/><rect x="${N - 7}" y="${N - 7}" width="1" height="1"/>`;
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      if (sep(x, y) || fin(x, y)) continue;
      if (x >= N - 9 && x < N - 4 && y >= N - 9 && y < N - 4) continue;
      if (y === 6) {
        if (x % 2 === 0) out += `<rect x="${x}" y="6" width="1" height="1"/>`;
        continue;
      }
      if (x === 6) {
        if (y % 2 === 0) out += `<rect x="6" y="${y}" width="1" height="1"/>`;
        continue;
      }
      if (rnd() > 0.52) out += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
  return out;
}

const TYPES = [
  ["Products", "PX", "Product · verified genuine", ["Ahmedabad", "Pune", "Dubai", "Copenhagen", "Surat"]],
  ["Assets", "AS", "Asset · location updated", ["Plant 2", "Store room", "Line 4", "Yard B"]],
  ["Documents", "DC", "Document · opened by", ["QA team", "Accounts", "Auditor"]],
  ["Packaging", "PK", "Packaging · batch linked", ["B-2207", "B-2211", "B-2214"]],
];
const INITIAL_FEED = [
  { id: "PX-QR-204117", text: "Product · verified genuine · Ahmedabad", key: 1 },
  { id: "AS-QR-88120", text: "Asset · location updated · Plant 2", key: 2 },
  { id: "DC-QR-55031", text: "Document · opened by QA team", key: 3 },
];

/* QR code solution: live scan simulation */
export default function QrBand() {
  const [seed, setSeed] = useState(204118);
  const [serial, setSerial] = useState("PX-QR-204118");
  const [scans, setScans] = useState(8412);
  const [active, setActive] = useState(null);
  const [feed, setFeed] = useState(INITIAL_FEED);
  const [fresh, setFresh] = useState(null);
  const code = useMemo(() => qrSvg(seed), [seed]);

  useEffect(() => {
    if (reduce) return;
    let k = 0,
      key = 10,
      raf = 0;
    const tick = () => {
      const t = TYPES[k % 4];
      k++;
      const id = `${t[1]}-QR-${100000 + Math.floor(Math.random() * 899999)}`;
      const place = t[3][Math.floor(Math.random() * t[3].length)];
      const item = { id, text: `${t[2]}${t[0] === "Documents" ? " " : " · "}${place}`, key: ++key };
      setActive(t[0]);
      setSerial(id);
      setSeed(Math.floor(Math.random() * 1e9));
      setScans((n) => n + 1);
      setFeed((f) => [item, ...f].slice(0, 3));
      setFresh(item.key);
      raf = requestAnimationFrame(() => requestAnimationFrame(() => setFresh(null)));
    };
    tick();
    const iv = setInterval(tick, 2600);
    return () => {
      clearInterval(iv);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="qrband">
      <div className="wrap qb-in">
        <div className="qb-scan" aria-hidden="true">
          <div className="qb-vf">
            <svg id="qbCode" viewBox="0 0 29 29" shapeRendering="crispEdges" dangerouslySetInnerHTML={{ __html: code }} />
            <i className="c1"></i>
            <i className="c2"></i>
            <i className="c3"></i>
            <i className="c4"></i>
            <span className="qb-laser"></span>
          </div>
          <div className="qb-id">
            <small>Serial</small>
            <b>{serial}</b>
          </div>
        </div>
        <div className="qb-side">
          <div className="qb-kpi">
            <div>
              <b>{scans.toLocaleString("en-IN")}</b>
              <span>Scans today</span>
            </div>
            <div>
              <b>99.98%</b>
              <span>Read rate</span>
            </div>
            <div>
              <b>&lt;1s</b>
              <span>Validation</span>
            </div>
          </div>
          <ul className="qb-types">
            {TYPES.map(([t]) => (
              <li key={t} className={active === t ? "on" : undefined}>
                {t}
              </li>
            ))}
          </ul>
          <ul className="qb-feed" aria-live="off">
            {feed.map((f) => (
              <li key={f.key} className={fresh === f.key ? "new" : undefined}>
                <span className="ok"></span>
                <b>{f.id}</b>
                <em>{f.text}</em>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
