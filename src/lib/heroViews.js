/* "Web view" screens shown in the browser window at the top of every inner page.
   Each one is a small, on-brand mock-up of the software / page it describes (SVG, 600×340). */

const C = { navy: "#0D2350", blue: "#1B4999", blue2: "#2674B9", sky: "#EAF2FC", sky3: "#A7CBEE", line: "#E1E8F1", muted: "#8A97AD", text: "#101C36", green: "#16A37A", amber: "#F2A93B", red: "#E5484D", bg: "#F5F8FC", w: "#fff" };

const svg = (inner, bg = C.bg) => `<svg viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice" role="img" focusable="false"><rect width="600" height="340" fill="${bg}"/>${inner}</svg>`;
const r = (x, y, w, h, fill = C.w, rx = 6, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const card = (x, y, w, h) => r(x, y, w, h, C.w, 8, `stroke="${C.line}"`);
const t = (x, y, s, txt, fill = C.text, w = 700, anchor = "start") => `<text x="${x}" y="${y}" font-size="${s}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}">${txt}</text>`;
const bar = (x, y, w, fill = C.line, h = 6) => r(x, y, w, h, fill, h / 2);
const chip = (x, y, txt, col) => {
  const w = txt.length * 5.4 + 14;
  return `${r(x, y, w, 15, col, 7.5, 'fill-opacity=".14"')}${t(x + w / 2, y + 10.5, 8.5, txt, col, 700, "middle")}`;
};
const btn = (x, y, w, txt, fill = C.blue, col = C.w) => `${r(x, y, w, 24, fill, 5)}${t(x + w / 2, y + 15.5, 9.5, txt, col, 700, "middle")}`;
const pulse = (cx, cy, col = C.green) =>
  `<circle cx="${cx}" cy="${cy}" r="3.5" fill="${col}"/><circle cx="${cx}" cy="${cy}" r="3.5" fill="none" stroke="${col}"><animate attributeName="r" values="3.5;9" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.8s" repeatCount="indefinite"/></circle>`;
const side = (items, active = 0) =>
  `${r(0, 0, 118, 340, C.navy, 0)}<circle cx="22" cy="24" r="8" fill="${C.blue2}"/>${t(36, 28, 11, "Padhya", C.w, 800)}` +
  items.map((n, i) => `${i === active ? r(10, 52 + i * 30, 98, 24, C.blue, 5) : ""}${r(20, 60 + i * 30, 8, 8, i === active ? C.w : C.sky3, 2, i === active ? "" : 'fill-opacity=".5"')}${t(36, 68 + i * 30, 9.5, n, i === active ? C.w : C.sky3, 600)}`).join("");
const head = (x, title, sub) => `${t(x, 30, 15, title, C.navy, 800)}${sub ? t(x, 44, 9, sub, C.muted, 600) : ""}`;
const qr = (x, y, cell, seed = 7) => {
  let s = seed, o = "";
  const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  const N = 21, finder = (i, j) => (i < 7 && j < 7) || (i < 7 && j > 13) || (i > 13 && j < 7);
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (!finder(i, j) && rnd() > 0.52) o += `<rect x="${x + j * cell}" y="${y + i * cell}" width="${cell}" height="${cell}" fill="${C.navy}"/>`;
  const f = (fx, fy) => `${r(fx, fy, cell * 7, cell * 7, C.navy, 2)}${r(fx + cell, fy + cell, cell * 5, cell * 5, C.w, 1)}${r(fx + cell * 2, fy + cell * 2, cell * 3, cell * 3, C.navy, 1)}`;
  return o + f(x, y) + f(x + cell * 14, y) + f(x, y + cell * 14);
};
const lineChart = (x, y, w, h, pts, col = C.blue2, area = true) => {
  const step = w / (pts.length - 1), max = Math.max(...pts);
  const P = pts.map((v, i) => [x + i * step, y + h - (v / max) * h]);
  const d = "M" + P.map((p) => p.join(",")).join(" L");
  const id = "hvg" + Math.round(x + y + w);
  return `${area ? `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".28"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs><path d="${d} L${x + w},${y + h} L${x},${y + h}Z" fill="url(#${id})"/>` : ""}<path d="${d}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="900" stroke-dashoffset="900"><animate attributeName="stroke-dashoffset" from="900" to="0" dur="2s" fill="freeze"/></path><circle cx="${P[P.length - 1][0]}" cy="${P[P.length - 1][1]}" r="3.5" fill="${col}"/>`;
};
const bars = (x, y, w, h, vals, col = C.blue2, labels = []) => {
  const bw = w / vals.length, max = Math.max(...vals);
  return vals
    .map((v, i) => {
      const bh = (v / max) * h;
      return `${r(x + i * bw + bw * 0.2, y + h - bh, bw * 0.6, bh, i === vals.length - 1 ? C.blue : col, 3)}${labels[i] ? t(x + i * bw + bw / 2, y + h + 12, 8, labels[i], C.muted, 600, "middle") : ""}`;
    })
    .join("");
};
const kpi = (x, y, w, label, val, delta, col = C.green) => `${card(x, y, w, 56)}${t(x + 12, y + 18, 8.5, label, C.muted, 600)}${t(x + 12, y + 40, 16, val, C.navy, 800)}${delta ? t(x + w - 10, y + 40, 9, delta, col, 700, "end") : ""}`;

const V = {};

/* Track & Trace dashboard */
V.trackandtracesystem = () => {
  const stages = [["Production", "1,240", C.blue2], ["Quality", "1,198", C.blue], ["Warehouse", "1,150", C.amber], ["Dispatched", "1,082", C.green]];
  const rows = [["B-24081", "Urea 45 kg", "Dispatch", "Delivered", C.green], ["B-24082", "DAP 50 kg", "Warehouse", "In stock", C.blue2], ["B-24083", "NPK 25 kg", "Quality", "Checked", C.blue], ["B-24084", "Urea 45 kg", "Production", "Packing", C.amber], ["B-24085", "Zinc 10 kg", "Dispatch", "On route", C.green]];
  return svg(
    side(["Dashboard", "Batches", "Scans", "Reports", "Settings"], 0) +
      head(136, "Track &amp; Trace", "Live batch tracking · Plant 1") + pulse(560, 26) + t(550, 30, 9, "Live", C.green, 700, "end") +
      stages.map(([n, v, c], i) => `${card(136 + i * 113, 56, 103, 54)}${r(136 + i * 113, 56, 103, 4, c, 2)}${t(146 + i * 113, 76, 8.5, n, C.muted, 600)}${t(146 + i * 113, 99, 16, v, C.navy, 800)}${i < 3 ? t(244 + i * 113, 87, 10, "›", C.muted, 700, "middle") : ""}`).join("") +
      card(136, 122, 442, 204) + ["Batch ID", "Product", "Stage", "Status"].map((h, i) => t(150 + i * 108, 142, 8.5, h, C.muted, 700)).join("") + r(136, 150, 442, 1, C.line, 0) +
      rows.map(([a, b, c, d, col], i) => `${t(150, 172 + i * 31, 9.5, a, C.navy, 700)}${t(258, 172 + i * 31, 9.5, b, C.text, 600)}${t(366, 172 + i * 31, 9.5, c, C.text, 600)}${chip(474, 162 + i * 31, d, col)}${i < 4 ? r(146, 184 + i * 31, 422, 1, C.line, 0) : ""}`).join("")
  );
};

/* QR code generator */
V.qrcodesolution = () =>
  svg(
    `${r(0, 0, 600, 46, C.w, 0)}${r(0, 46, 600, 1, C.line, 0)}${head(24, "QR Code Generator")}${chip(500, 18, "Bulk · 10,000", C.blue2)}` +
      card(24, 62, 290, 262) +
      [["Product name", "Urea 45 kg Bag"], ["Batch number", "B-24081"], ["Link to", "padhyasoft.com/verify"]].map(([l, v], i) => `${t(40, 88 + i * 52, 8.5, l, C.muted, 700)}${r(40, 94 + i * 52, 258, 26, C.bg, 5, `stroke="${C.line}"`)}${t(50, 111 + i * 52, 10, v, C.navy, 600)}`).join("") +
      t(40, 250, 8.5, "QR type", C.muted, 700) + ["Product", "URL", "vCard"].map((n, i) => `${r(40 + i * 72, 257, 64, 22, i === 0 ? C.blue : C.w, 11, i ? `stroke="${C.line}"` : "")}${t(72 + i * 72, 271.5, 9, n, i === 0 ? C.w : C.text, 700, "middle")}`).join("") +
      btn(40, 290, 258, "Generate QR code") +
      card(330, 62, 246, 262) + r(366, 78, 174, 174, C.w, 6, `stroke="${C.line}"`) + qr(374, 86, 7.43, 11) +
      `<rect x="366" y="78" width="174" height="3" fill="${C.green}" opacity=".7"><animate attributeName="y" values="78;249;78" dur="3s" repeatCount="indefinite"/></rect>` +
      t(346, 278, 8.5, "Scans today", C.muted, 600) + t(346, 298, 15, "1,284", C.navy, 800) + btn(452, 278, 108, "Download PNG", C.sky, C.blue)
  );

/* ERP / custom business software */
V.softwaredevelopment = () => {
  const orders = [["Shah Traders", "Paid", C.green], ["Metro Agro", "Pending", C.amber], ["Riya Exports", "Paid", C.green], ["Kiran & Co.", "Shipped", C.blue2]];
  return svg(
    side(["Dashboard", "Sales", "Inventory", "HR", "Finance", "CRM"], 0) +
      head(136, "Business Dashboard", "All departments · this month") + chip(514, 22, "ERP · Live", C.green) +
      kpi(136, 56, 140, "Revenue", "₹48.2L", "+12%") + kpi(287, 56, 140, "Orders", "1,326", "+8%") + kpi(438, 56, 140, "Stock items", "8,410", "") +
      card(136, 124, 266, 202) + t(150, 145, 10, "Monthly sales", C.navy, 800) + bars(146, 160, 246, 132, [42, 55, 48, 66, 72, 61, 84], C.sky3, ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]) +
      card(412, 124, 166, 202) + t(426, 145, 10, "Recent orders", C.navy, 800) +
      orders.map(([n, s, c], i) => `${r(426, 160 + i * 40, 22, 22, C.sky, 11)}${t(437, 175 + i * 40, 9, n[0], C.blue, 800, "middle")}${t(454, 170 + i * 40, 9, n, C.text, 700)}${chip(454, 175 + i * 40, s, c)}`).join("")
  );
};

/* Mobile apps */
V.mobileappdevelopment = () => {
  const phone = (x, y, w, h, inner) => `${r(x, y, w, h, C.navy, 20)}${r(x + 6, y + 6, w - 12, h - 12, C.w, 15)}${r(x + w / 2 - 18, y + 10, 36, 7, C.navy, 3.5)}${inner}`;
  const p1 =
    `${r(176, 36, 128, 48, C.blue, 0)}${t(188, 72, 12, "My Orders", C.w, 800)}` +
    [0, 1, 2, 3].map((i) => `${card(184, 94 + i * 50, 112, 42)}${r(192, 102 + i * 50, 26, 26, [C.sky, "#E7F7F1", "#FFF4E3", C.sky][i], 6)}${bar(224, 104 + i * 50, 62, C.navy)}${bar(224, 116 + i * 50, 22)}${chip(248, 113 + i * 50, ["Paid", "Done", "New", "Paid"][i], [C.green, C.green, C.amber, C.green][i])}`).join("");
  const p2 =
    `${t(338, 70, 9, "Good morning,", C.muted, 600)}${t(338, 86, 13, "Aarav", C.navy, 800)}${r(338, 98, 112, 70, C.blue, 10)}${t(348, 118, 8.5, "Balance", C.sky3, 600)}${t(348, 140, 16, "₹24,560", C.w, 800)}${bar(348, 152, 40, C.sky3, 5)}` +
    lineChart(340, 186, 108, 50, [10, 18, 14, 26, 22, 34, 40], C.blue2) +
    [0, 1, 2].map((i) => `${r(342 + i * 38, 256, 28, 28, C.sky, 8)}${r(350 + i * 38, 264, 12, 12, C.blue2, 3)}`).join("");
  return svg(
    `<circle cx="300" cy="180" r="150" fill="${C.sky}"/>` + phone(170, 26, 140, 300, p1) + phone(326, 44, 136, 282, p2) +
      `${card(476, 70, 104, 54)}${t(488, 92, 15, "4.8 ★", C.navy, 800)}${t(488, 110, 8.5, "App rating", C.muted, 600)}` +
      `${card(28, 196, 128, 54)}${t(40, 218, 10, "iOS &amp; Android", C.navy, 800)}${t(40, 236, 8.5, "One codebase", C.muted, 600)}` +
      `${card(476, 236, 104, 54)}${t(488, 258, 15, "50K+", C.navy, 800)}${t(488, 276, 8.5, "Downloads", C.muted, 600)}`
  );
};

/* Web development: code + live preview */
V.webdevelopment = () => {
  const code = [[0, 70, C.sky3], [1, 110, "#7FD1AE"], [2, 90, C.sky3], [2, 60, "#F7C873"], [1, 130, "#9EB8FF"], [2, 80, C.sky3], [3, 100, "#7FD1AE"], [3, 70, "#F7C873"], [2, 50, C.sky3], [1, 120, "#9EB8FF"], [2, 90, "#7FD1AE"], [1, 40, C.sky3], [0, 60, C.sky3]];
  return svg(
    `${r(0, 0, 250, 340, "#0A1A3A", 0)}${t(16, 24, 9, "App.jsx", C.w, 700)}${t(70, 24, 9, "styles.css", C.muted, 600)}${r(10, 32, 54, 2, C.blue2, 1)}` +
      code.map(([ind, w, c], i) => `${t(18, 60 + i * 20, 8, i + 1, "#4A5D82", 600)}${bar(38 + ind * 14, 54 + i * 20, w, c, 6)}`).join("") +
      `<rect x="40" y="318" width="7" height="12" fill="${C.sky3}"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect>` +
      card(268, 18, 312, 304) + r(268, 18, 312, 30, C.w, 8) + `<circle cx="284" cy="33" r="5" fill="${C.blue}"/>` + [0, 1, 2, 3].map((i) => bar(420 + i * 38, 30, 28, C.line)).join("") + r(268, 48, 312, 1, C.line, 0) +
      r(280, 60, 288, 100, C.sky, 8) + bar(296, 80, 150, C.navy, 10) + bar(296, 98, 120, C.navy, 10) + bar(296, 120, 170, C.sky3) + btn(296, 132, 90, "Get started") +
      [0, 1, 2].map((i) => `${card(280 + i * 98, 172, 90, 94)}${r(290 + i * 98, 182, 24, 24, [C.blue2, C.green, C.amber][i], 6, 'fill-opacity=".18"')}${bar(290 + i * 98, 216, 60, C.navy)}${bar(290 + i * 98, 230, 70)}${bar(290 + i * 98, 242, 50)}`).join("") +
      `<circle cx="548" cy="296" r="15" fill="none" stroke="${C.line}" stroke-width="4"/><circle cx="548" cy="296" r="15" fill="none" stroke="${C.green}" stroke-width="4" stroke-dasharray="92 95" transform="rotate(-90 548 296)"/>${t(548, 299.5, 9, "98", C.navy, 800, "middle")}${t(526, 300, 8.5, "Performance", C.muted, 600, "end")}`
  );
};

/* Web design tool */
V.webdesign = () =>
  svg(
    `${r(0, 0, 600, 34, C.navy, 0)}${t(16, 21, 10, "Homepage · Desktop", C.w, 700)}` + [0, 1, 2, 3].map((i) => r(250 + i * 26, 10, 16, 14, i === 1 ? C.blue2 : "#24407A", 3)).join("") + btn(512, 6, 72, "Share", C.blue2) +
      r(0, 34, 120, 306, C.w, 0) + r(120, 34, 1, 306, C.line, 0) + t(14, 56, 8.5, "LAYERS", C.muted, 800) +
      ["Header", "Hero", "Features", "Testimonials", "Footer"].map((n, i) => `${i === 1 ? r(8, 66 + i * 26, 104, 22, C.sky, 4) : ""}${r(16, 73 + i * 26, 9, 9, i === 1 ? C.blue : C.sky3, 2)}${t(32, 81 + i * 26, 9.5, n, i === 1 ? C.blue : C.text, 600)}`).join("") +
      r(121, 34, 349, 306, "#E9EEF6", 0) + r(160, 54, 270, 268, C.w, 4, 'filter="url(#hvsh)"') + `<defs><filter id="hvsh" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#0D2350" flood-opacity=".12"/></filter></defs>` +
      bar(176, 70, 40, C.navy) + [0, 1, 2].map((i) => bar(330 + i * 28, 70, 20)).join("") +
      r(176, 92, 238, 96, C.sky, 6) + bar(192, 114, 120, C.navy, 10) + bar(192, 132, 90, C.navy, 10) + bar(192, 152, 140, C.sky3) + r(192, 164, 60, 16, C.blue, 4) + `<circle cx="360" cy="140" r="30" fill="${C.blue2}" fill-opacity=".25"/>` +
      `<rect x="172" y="88" width="246" height="104" fill="none" stroke="${C.blue2}" stroke-width="1.5" stroke-dasharray="4 3"/>` + [[172, 88], [418, 88], [172, 192], [418, 192]].map(([x, y]) => r(x - 3.5, y - 3.5, 7, 7, C.w, 1, `stroke="${C.blue2}"`)).join("") +
      [0, 1, 2].map((i) => `${r(176 + i * 82, 204, 74, 60, C.bg, 5)}${r(184 + i * 82, 212, 16, 16, C.blue2, 4, 'fill-opacity=".3"')}${bar(184 + i * 82, 236, 50, C.navy, 5)}${bar(184 + i * 82, 246, 40, C.line, 5)}`).join("") + bar(176, 284, 238, C.line, 22) +
      r(470, 34, 130, 306, C.w, 0) + r(470, 34, 1, 306, C.line, 0) + t(484, 56, 8.5, "COLOURS", C.muted, 800) +
      [C.navy, C.blue, C.blue2, C.sky3, C.green].map((c, i) => r(484 + i * 21, 64, 16, 16, c, 4)).join("") +
      t(484, 106, 8.5, "TYPOGRAPHY", C.muted, 800) + t(484, 146, 34, "Aa", C.navy, 800) + t(484, 164, 9, "Hanken Grotesk", C.text, 600) +
      t(484, 196, 8.5, "SPACING", C.muted, 800) + [0, 1, 2].map((i) => `${r(484, 206 + i * 22, 102, 16, C.bg, 4)}${t(492, 217.5 + i * 22, 8.5, ["Padding 24", "Gap 16", "Radius 8"][i], C.text, 600)}`).join("")
  );

/* Industry automation / SCADA */
V.industryautomationsolutions = () => {
  const m = [["CNC-01", "Running", C.green, "312"], ["Press-02", "Running", C.green, "288"], ["Pack-03", "Idle", C.amber, "0"], ["Robot-04", "Running", C.green, "354"]];
  const R = 38, Cc = 2 * Math.PI * R;
  return svg(
    side(["Overview", "Machines", "OEE", "Alarms", "Reports"], 0) +
      head(136, "Plant Overview · Line 1", "PLC connected · updated 2 s ago") + pulse(560, 26) +
      m.map(([n, s, c, u], i) => `${card(136 + i * 111, 56, 101, 70)}${t(148 + i * 111, 76, 10, n, C.navy, 800)}${chip(148 + i * 111, 84, s, c)}${t(148 + i * 111, 116, 8.5, "Units/hr", C.muted, 600)}${t(227 + i * 111, 116, 11, u, C.navy, 800, "end")}`).join("") +
      card(136, 138, 160, 188) + t(150, 158, 10, "OEE", C.navy, 800) +
      `<circle cx="216" cy="236" r="${R}" fill="none" stroke="${C.sky}" stroke-width="10"/><circle cx="216" cy="236" r="${R}" fill="none" stroke="${C.green}" stroke-width="10" stroke-linecap="round" stroke-dasharray="0 ${Cc}" transform="rotate(-90 216 236)"><animate attributeName="stroke-dasharray" from="0 ${Cc}" to="${Cc * 0.86} ${Cc}" dur="1.6s" fill="freeze"/></circle>${t(216, 242, 18, "86%", C.navy, 800, "middle")}${t(216, 304, 8.5, "Target 85%", C.muted, 600, "middle")}` +
      card(306, 138, 272, 188) + t(320, 158, 10, "Output per hour", C.navy, 800) + chip(500, 147, "+9% today", C.green) +
      lineChart(322, 178, 240, 120, [40, 52, 48, 61, 58, 70, 66, 78, 84], C.blue2) + ["6am", "9am", "12pm", "3pm", "6pm"].map((l, i) => t(322 + i * 60, 314, 8, l, C.muted, 600, "middle")).join("")
  );
};

/* Digital marketing analytics */
V.digitalmarketing = () => {
  const ch = [["SEO", 42, C.blue], ["Google Ads", 28, C.blue2], ["Social", 18, C.green], ["Email", 12, C.amber]];
  return svg(
    head(24, "Marketing Analytics", "Last 30 days · all channels") + btn(492, 16, 84, "Export report", C.sky, C.blue) +
      kpi(24, 56, 130, "Visitors", "48.2K", "+24%") + kpi(164, 56, 130, "Leads", "1,240", "+18%") + kpi(304, 56, 130, "CTR", "4.8%", "+0.6") + kpi(444, 56, 132, "ROAS", "5.2x", "+1.1") +
      card(24, 124, 346, 202) + t(38, 145, 10, "Website traffic", C.navy, 800) + chip(300, 134, "Organic ↑", C.green) +
      lineChart(40, 162, 314, 130, [20, 26, 24, 34, 31, 42, 46, 44, 58, 63, 70, 82], C.blue2) + ["W1", "W2", "W3", "W4"].map((l, i) => t(40 + i * 104.7, 312, 8, l, C.muted, 600, "middle")).join("") +
      card(380, 124, 196, 202) + t(394, 145, 10, "Top channels", C.navy, 800) +
      ch.map(([n, v, c], i) => `${t(394, 172 + i * 38, 9, n, C.text, 700)}${t(562, 172 + i * 38, 9, v + "%", C.navy, 800, "end")}${bar(394, 179 + i * 38, 168, C.sky, 7)}${r(394, 179 + i * 38, 168 * (v / 42), 7, c, 3.5)}`).join("")
  );
};

/* E-commerce store */
V.ecommercesystem = () => {
  const p = [["Running Shoes", "₹2,499", C.sky], ["Smart Watch", "₹3,999", "#E7F7F1"], ["Backpack", "₹1,299", "#FFF4E3"], ["Headphones", "₹1,899", C.sky]];
  const icon = (x, y, i) => [`<path d="M${x - 22},${y + 8} q8,-22 26,-14 l18,8 v8 h-44z" fill="${C.blue2}"/>`, `<rect x="${x - 12}" y="${y - 16}" width="24" height="30" rx="7" fill="${C.green}"/><rect x="${x - 6}" y="${y - 22}" width="12" height="42" rx="3" fill="${C.green}" opacity=".5"/>`, `<rect x="${x - 16}" y="${y - 16}" width="32" height="34" rx="8" fill="${C.amber}"/><rect x="${x - 8}" y="${y - 22}" width="16" height="8" rx="4" fill="none" stroke="${C.amber}" stroke-width="3"/>`, `<path d="M${x - 16},${y + 6} v-6 a16,16 0 0 1 32,0 v6" fill="none" stroke="${C.blue}" stroke-width="5"/><rect x="${x - 20}" y="${y + 2}" width="10" height="16" rx="4" fill="${C.blue}"/><rect x="${x + 10}" y="${y + 2}" width="10" height="16" rx="4" fill="${C.blue}"/>`][i];
  return svg(
    `${r(0, 0, 600, 48, C.w, 0)}${r(0, 48, 600, 1, C.line, 0)}${t(24, 30, 14, "Your Store", C.navy, 800)}${r(170, 13, 250, 24, C.bg, 12, `stroke="${C.line}"`)}${t(186, 29, 9, "Search products…", C.muted, 600)}` +
      `<path d="M540,18 h4 l4,14 h14 l3,-10 h-19" fill="none" stroke="${C.navy}" stroke-width="2" stroke-linejoin="round"/><circle cx="550" cy="36" r="2" fill="${C.navy}"/><circle cx="560" cy="36" r="2" fill="${C.navy}"/><circle cx="566" cy="16" r="7" fill="${C.red}"/>${t(566, 19.5, 8.5, "3", C.w, 800, "middle")}` +
      ["All", "Footwear", "Electronics", "Bags", "Offers"].map((n, i) => `${r(24 + i * 78, 62, 70, 22, i === 0 ? C.navy : C.w, 11, i ? `stroke="${C.line}"` : "")}${t(59 + i * 78, 76.5, 9, n, i === 0 ? C.w : C.text, 700, "middle")}`).join("") +
      p.map(([n, pr, bg], i) => `${card(24 + i * 140, 98, 130, 228)}${r(32 + i * 140, 106, 114, 100, bg, 6)}${icon(89 + i * 140, 156, i)}${t(34 + i * 140, 226, 10, n, C.navy, 800)}${t(34 + i * 140, 244, 9, "★★★★★", C.amber, 700)}${t(34 + i * 140, 268, 13, pr, C.navy, 800)}${btn(34 + i * 140, 284, 110, "Add to cart")}`).join("") +
      `<g><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.15;.25;.85;1" dur="6s" repeatCount="indefinite"/>${r(386, 58, 190, 30, C.navy, 6)}<circle cx="402" cy="73" r="7" fill="${C.green}"/>${t(402, 76.5, 9, "✓", C.w, 800, "middle")}${t(416, 77, 9.5, "Payment successful", C.w, 700)}</g>`
  );
};

/* Video editing: finished videos delivered in every social format (16:9, 1:1, 9:16) */
V.videoeditingservices = () => {
  const grad = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const play = (cx, cy, s = 1) => `<circle cx="${cx}" cy="${cy}" r="${13 * s}" fill="#fff" fill-opacity=".92"/><path d="M${cx - 4 * s},${cy - 6 * s} L${cx + 7 * s},${cy} L${cx - 4 * s},${cy + 6 * s}z" fill="${C.navy}"/>`;
  const label = (x, y, n, f, stat, col) => `${t(x, y, 10, n, C.navy, 800)}${t(x, y + 14, 8.5, f, C.muted, 600)}${chip(x, y + 22, stat, col)}`;
  // 16:9 – presenter with a lower-third title
  const yt =
    `${r(24, 104, 256, 144, "url(#hvv1)", 8)}<circle cx="152" cy="150" r="20" fill="#fff" fill-opacity=".85"/><path d="M118,212 a34,30 0 0 1 68,0z" fill="#fff" fill-opacity=".85"/>` +
    `${r(36, 206, 120, 28, C.navy, 4, 'fill-opacity=".85"')}${r(36, 206, 4, 28, C.green, 2)}${t(46, 218, 8.5, "Rahul Mehta", C.w, 800)}${t(46, 229, 7, "Founder, Nova Agro", C.sky3, 600)}` +
    `${r(36, 240, 232, 3, "#ffffff", 1.5, 'fill-opacity=".35"')}${r(36, 240, 140, 3, C.red, 1.5)}${play(152, 150, 0)}`;
  // 1:1 – product launch post
  const sq =
    `${r(296, 104, 144, 144, "url(#hvv2)", 8)}<rect x="350" y="128" width="36" height="62" rx="10" fill="#fff" fill-opacity=".92"/><rect x="360" y="120" width="16" height="12" rx="3" fill="#fff" fill-opacity=".92"/><rect x="356" y="150" width="24" height="16" rx="3" fill="${C.green}"/>` +
    `${t(368, 214, 13, "NEW LAUNCH", C.w, 800, "middle")}${t(368, 230, 8, "Shop now →", C.sky3, 700, "middle")}${play(420, 124, 0.7)}`;
  // 9:16 – reel with captions and side icons
  const reel =
    `${r(456, 50, 120, 198, "url(#hvv3)", 10)}<circle cx="516" cy="112" r="18" fill="#fff" fill-opacity=".85"/><path d="M486,168 a30,26 0 0 1 60,0z" fill="#fff" fill-opacity=".85"/>` +
    `${r(470, 180, 92, 14, C.w, 3)}${t(516, 190.5, 8, "5 tips in 30 sec", C.navy, 800, "middle")}${bar(470, 204, 70, "#ffffff", 5)}${bar(470, 214, 50, "#ffffff", 5)}` +
    [0, 1, 2].map((i) => `<circle cx="562" cy="${116 + i * 22}" r="7" fill="#fff" fill-opacity=".9"/>`).join("") + `<path d="M558.5,115.5 a2.2,2.2 0 0 1 3.5,-2.2 a2.2,2.2 0 0 1 3.5,2.2 l-3.5,3.8z" fill="${C.red}"/>` +
    `${r(470, 232, 92, 3, "#ffffff", 1.5, 'fill-opacity=".35"')}<rect x="470" y="232" width="0" height="3" rx="1.5" fill="#fff"><animate attributeName="width" values="0;92" dur="5s" repeatCount="indefinite"/></rect>`;
  return svg(
    `<defs>${grad("hvv1", C.blue2, C.navy)}${grad("hvv2", C.green, C.blue)}${grad("hvv3", "#5B4BC4", C.blue2)}</defs>` +
      head(24, "Ready-to-publish videos", "One edit · every platform") + chip(478, 22, "4K · colour graded", C.blue2) +
      yt + sq + reel +
      label(24, 270, "YouTube", "16:9 · Full HD / 4K", "12.4K views", C.red) + label(296, 270, "Instagram post", "1:1 · square", "+38% reach", C.green) + label(456, 270, "Reels / Shorts", "9:16 · vertical", "86K plays", "#5B4BC4")
  );
};

/* Graphic design / brand board */
V.graphicdesignservices = () =>
  svg(
    card(24, 22, 200, 170) + `<circle cx="124" cy="88" r="34" fill="${C.blue}"/><path d="M110,104 v-34 h18 a12,12 0 0 1 0,24 h-18" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>` + t(124, 150, 15, "NOVA", C.navy, 800, "middle") + t(124, 168, 8, "BRAND IDENTITY", C.muted, 700, "middle") +
      card(236, 22, 340, 82) + t(250, 42, 8.5, "COLOUR PALETTE", C.muted, 800) + [[C.navy, "#0D2350"], [C.blue, "#1B4999"], [C.blue2, "#2674B9"], [C.sky3, "#A7CBEE"], [C.green, "#16A37A"]].map(([c, h], i) => `${r(250 + i * 64, 50, 56, 30, c, 5)}${t(250 + i * 64, 94, 7.5, h, C.text, 600)}`).join("") +
      card(236, 114, 160, 78) + t(250, 134, 8.5, "TYPOGRAPHY", C.muted, 800) + t(250, 174, 34, "Aa", C.navy, 800) + t(306, 160, 9, "Hanken", C.text, 700) + t(306, 174, 9, "Grotesk", C.text, 700) +
      card(406, 114, 170, 78) + t(420, 134, 8.5, "ICONS", C.muted, 800) + [0, 1, 2, 3].map((i) => `${r(420 + i * 38, 144, 30, 30, C.sky, 8)}<circle cx="${435 + i * 38}" cy="159" r="7" fill="none" stroke="${C.blue}" stroke-width="2.5"/>`).join("") +
      `<g transform="rotate(-6 130 268)">${r(40, 222, 180, 100, C.navy, 8)}<circle cx="70" cy="252" r="12" fill="${C.blue2}"/>${t(90, 256, 11, "NOVA", C.w, 800)}${bar(56, 286, 90, C.sky3, 5)}${bar(56, 298, 60, "#3D5A92", 5)}</g>` +
      card(246, 206, 150, 120) + r(254, 214, 134, 70, C.blue, 6) + t(266, 244, 13, "Big Sale", C.w, 800) + t(266, 262, 9, "Up to 50% off", C.sky3, 600) + `<circle cx="360" cy="240" r="16" fill="${C.green}"/>` + bar(254, 296, 90, C.navy) + bar(254, 308, 60) +
      card(406, 206, 170, 120) + r(414, 214, 154, 104, C.sky, 6) + `<circle cx="491" cy="256" r="26" fill="${C.blue2}" fill-opacity=".3"/>` + t(491, 262, 16, "LOGO", C.blue, 800, "middle") + t(491, 302, 8, "Packaging &amp; labels", C.muted, 700, "middle")
  );

/* About */
V.about = () =>
  svg(
    r(0, 0, 600, 150, C.navy, 0) + `<circle cx="520" cy="40" r="90" fill="${C.blue}" opacity=".35"/>` + t(28, 44, 9, "ABOUT PADHYA", C.sky3, 800) + t(28, 74, 20, "Founder-led software team", C.w, 800) + t(28, 98, 20, "building custom software", C.w, 800) + t(28, 124, 9.5, "Ahmedabad · India  |  Albertslund · Denmark", C.sky3, 600) +
      [["7+", "Years"], ["150+", "Clients"], ["50+", "Enterprise projects"], ["5+", "Countries"]].map(([v, l], i) => `${card(28 + i * 138, 132, 128, 62)}${t(42 + i * 138, 160, 18, v, C.navy, 800)}${t(42 + i * 138, 180, 8.5, l, C.muted, 600)}`).join("") +
      card(28, 210, 266, 116) + t(42, 232, 10, "Our team", C.navy, 800) + [0, 1, 2, 3, 4].map((i) => `<circle cx="${62 + i * 48}" cy="272" r="18" fill="${[C.blue, C.blue2, C.green, C.amber, C.navy][i]}" fill-opacity=".2"/><circle cx="${62 + i * 48}" cy="266" r="6" fill="${[C.blue, C.blue2, C.green, C.amber, C.navy][i]}"/><path d="M${52 + i * 48},282 a10,8 0 0 1 20,0z" fill="${[C.blue, C.blue2, C.green, C.amber, C.navy][i]}"/>`).join("") + t(42, 312, 8.5, "Developers · designers · marketers", C.muted, 600) +
      card(306, 210, 266, 116) + t(320, 232, 10, "Where we work", C.navy, 800) + Array.from({ length: 70 }, (_, i) => `<circle cx="${330 + (i % 14) * 16}" cy="${248 + Math.floor(i / 14) * 14}" r="2" fill="${C.sky3}"/>`).join("") + pulse(498, 290, C.blue) + t(506, 294, 8, "Ahmedabad", C.navy, 700) + pulse(424, 262, C.green) + t(432, 266, 8, "Denmark", C.navy, 700)
  );

/* Services overview */
V.services = () => {
  const s = [["Software &amp; ERP", C.blue], ["Mobile Apps", C.blue2], ["Web Development", C.green], ["Industry Automation", C.amber], ["QR &amp; Track-Trace", C.blue], ["Digital Marketing", C.blue2]];
  return svg(
    head(24, "Our Services", "11 services · one accountable team") + btn(476, 16, 100, "Free consultation") +
      s.map(([n, c], i) => {
        const x = 24 + (i % 3) * 186, y = 60 + Math.floor(i / 3) * 136;
        return `${card(x, y, 176, 124)}${r(x + 14, y + 14, 34, 34, c, 9, 'fill-opacity=".14"')}${r(x + 24, y + 24, 14, 14, c, 3)}${t(x + 14, y + 70, 11, n, C.navy, 800)}${bar(x + 14, y + 82, 140)}${bar(x + 14, y + 94, 110)}${t(x + 14, y + 114, 9, "Learn more →", C.blue, 700)}`;
      }).join("")
  );
};

/* Contact: the two offices, connected – India (head office) and Denmark (client support) */
V.contact = () => {
  const dots = Array.from({ length: 22 * 12 }, (_, i) => `<circle cx="${20 + (i % 22) * 27}" cy="${18 + Math.floor(i / 22) * 27}" r="1.6" fill="${C.sky3}" opacity=".55"/>`).join("");
  const pinAt = (x, y, col) => `<circle cx="${x}" cy="${y}" r="7" fill="${col}"/><circle cx="${x}" cy="${y}" r="7" fill="none" stroke="${col}"><animate attributeName="r" values="7;20" dur="2.2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0" dur="2.2s" repeatCount="indefinite"/></circle><circle cx="${x}" cy="${y}" r="2.6" fill="#fff"/>`;
  const office = (x, y, flag, city, role, hours) =>
    `${card(x, y, 214, 96)}${r(x + 14, y + 16, 34, 24, C.sky, 4)}${flag}${t(x + 58, y + 30, 12, city, C.navy, 800)}${t(x + 58, y + 46, 9, role, C.muted, 600)}${r(x + 14, y + 60, 186, 1, C.line, 0)}<circle cx="${x + 22}" cy="${y + 78}" r="4" fill="${C.green}"/>${t(x + 32, y + 81.5, 9, hours, C.text, 700)}`;
  const flagIN = (x, y) => `${r(x, y, 34, 8, "#FF9933", 0)}${r(x, y + 8, 34, 8, "#fff", 0)}${r(x, y + 16, 34, 8, "#138808", 0)}<circle cx="${x + 17}" cy="${y + 12}" r="3" fill="none" stroke="#000080" stroke-width="1"/>`;
  const flagDK = (x, y) => `${r(x, y, 34, 24, "#C8102E", 0)}${r(x + 10, y, 5, 24, "#fff", 0)}${r(x, y + 9.5, 34, 5, "#fff", 0)}`;
  const arc = "M150,206 Q300,30 452,120";
  return svg(
    dots +
      `<path d="${arc}" fill="none" stroke="${C.blue2}" stroke-width="2" stroke-dasharray="6 6"><animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.2s" repeatCount="indefinite"/></path>` +
      `<circle r="5" fill="${C.blue}"><animateMotion dur="3s" repeatCount="indefinite" path="${arc}"/></circle>` +
      pinAt(150, 206, C.blue) + pinAt(452, 120, C.red) +
      office(28, 234, flagIN(42, 250), "Ahmedabad, India", "Head office · Development", "Mon–Sat · 10 AM – 7 PM IST") +
      office(358, 10, flagDK(372, 26), "Albertslund, Denmark", "Client support", "Local support for Europe") +
      `${r(28, 20, 168, 30, C.navy, 15)}<circle cx="46" cy="35" r="7" fill="${C.green}"/><path d="M42.5,35 l2.5,2.5 l4.5,-5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>${t(60, 39, 10, "Reply within 24 hours", C.w, 700)}` +
      `${card(400, 250, 176, 56)}${r(414, 264, 28, 28, "#E7F7F1", 14)}<path d="M422,278 a6,6 0 1 1 3,5.2 l-4,1.2 1.2,-3.8z" fill="none" stroke="${C.green}" stroke-width="1.8"/>${t(452, 274, 9, "Free consultation", C.muted, 600)}${t(452, 290, 11, "Call · WhatsApp · Email", C.navy, 800)}`
  );
};

/* Blogs */
V.blogs = () =>
  svg(
    head(24, "Insights &amp; Blogs") + ["All", "Software", "Mobile", "Marketing", "Automation"].map((n, i) => `${r(190 + i * 78, 16, 70, 22, i === 0 ? C.navy : C.w, 11, i ? `stroke="${C.line}"` : "")}${t(225 + i * 78, 30.5, 9, n, i === 0 ? C.w : C.text, 700, "middle")}`).join("") +
      card(24, 54, 300, 272) + r(32, 62, 284, 140, C.blue, 6) + `<circle cx="260" cy="110" r="44" fill="${C.blue2}" opacity=".6"/><circle cx="90" cy="170" r="28" fill="${C.sky3}" opacity=".35"/>` + chip(40, 214, "Software", C.blue2) + bar(40, 240, 250, C.navy, 10) + bar(40, 256, 200, C.navy, 10) + bar(40, 280, 260) + bar(40, 292, 220) + t(40, 314, 8.5, "Padhya Team · 6 min read", C.muted, 600) +
      [0, 1, 2].map((i) => `${card(336, 54 + i * 92, 240, 82)}${r(344, 62 + i * 92, 74, 66, [C.sky, "#E7F7F1", "#FFF4E3"][i], 5)}${r(368, 84 + i * 92, 26, 22, [C.blue2, C.green, C.amber][i], 5, 'fill-opacity=".5"')}${chip(428, 64 + i * 92, ["Mobile Apps", "Automation", "Marketing"][i], [C.blue2, C.green, C.amber][i])}${bar(428, 88 + i * 92, 130, C.navy)}${bar(428, 100 + i * 92, 100, C.navy)}${bar(428, 116 + i * 92, 80)}`).join("")
  );

/* Privacy / terms */
V.legal = () =>
  svg(
    card(24, 22, 380, 304) + t(44, 54, 15, "Policies &amp; Terms", C.navy, 800) + t(44, 70, 8.5, "Last updated · 2026", C.muted, 600) +
      [0, 1, 2].map((i) => `${t(44, 102 + i * 76, 10.5, ["1. Information we collect", "2. How we use it", "3. Your rights"][i], C.navy, 800)}${bar(44, 112 + i * 76, 330)}${bar(44, 124 + i * 76, 300)}${bar(44, 136 + i * 76, 320)}${bar(44, 148 + i * 76, 200)}`).join("") +
      card(416, 22, 160, 160) + `<path d="M496,52 l42,16 v30 c0,26 -18,42 -42,50 c-24,-8 -42,-24 -42,-50 v-30z" fill="${C.blue}"/><path d="M478,98 l12,12 l22,-24" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` + t(496, 170, 9, "Your data is protected", C.navy, 700, "middle") +
      card(416, 194, 160, 132) + ["No data selling", "Secure storage", "Delete on request"].map((n, i) => `<circle cx="434" cy="${222 + i * 34}" r="8" fill="${C.green}" fill-opacity=".18"/><path d="M430,${222 + i * 34} l3,3 l5,-6" fill="none" stroke="${C.green}" stroke-width="2" stroke-linecap="round"/>${t(450, 226 + i * 34, 9.5, n, C.text, 700)}`).join("")
  );

export const HERO_VIEWS = V;
