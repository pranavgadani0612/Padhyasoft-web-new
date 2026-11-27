/* Animated SVG illustrations (pure SVG strings, ported verbatim from the original site).
   Rendered by <Photo> via dangerouslySetInnerHTML – the content is static & trusted. */
import { SERVICES } from "../data/site.js";

/* =====================================================================
   ANIMATED ILLUSTRATIONS – used instead of stock photos where a picture
   should explain what the service does. Pure SVG (no external images).
   ===================================================================== */
export const SC=(()=>{
const L="rgba(141,187,242,.45)",S="#8DBBF2",N2="#12305F",N3="#163A72",W="#fff",G="#2FB36B",B="#2674B9",PALE="#EAF2FC";
const svg=(inner,vb="0 0 600 340")=>`<svg viewBox="${vb}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">${inner}</svg>`;
const t=(x,y,s,txt,fill=W,w=600,anchor="middle")=>`<text x="${x}" y="${y}" font-size="${s}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}">${txt}</text>`;
const blink=(dur,begin=0,vals="1;.25;1")=>`<animate attributeName="opacity" values="${vals}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>`;
const appear=(a,b,dur=6)=>`<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${a};${b};.92;1" dur="${dur}s" repeatCount="indefinite"/>`;
const spin=(cx,cy,dur,rev)=>`<animateTransform attributeName="transform" type="rotate" from="${rev?360:0} ${cx} ${cy}" to="${rev?0:360} ${cx} ${cy}" dur="${dur}s" repeatCount="indefinite"/>`;
const mover=(path,dur,begin=0,r=4,fill=S)=>`<circle r="${r}" fill="${fill}"><animateMotion path="${path}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></circle>`;
const ring=(cx,cy,r,pct,label,val,delay=0)=>{const C=2*Math.PI*r,v=C*pct;return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${N3}" stroke-width="7"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${G}" stroke-width="7" stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})" stroke-dasharray="0 ${C}"><animate attributeName="stroke-dasharray" values="0 ${C};0 ${C};${v} ${C};${v} ${C}" keyTimes="0;${.05+delay};${.45+delay};1" dur="6s" repeatCount="indefinite"/></circle>${t(cx,cy+5,15,val,W,800)}${t(cx+r+12,cy+5,13,label,"#A9BCDB",600,"start")}`};
const qrMods=(x,y,cell,seed)=>{let r=seed,o="";const rnd=()=>(r=(r*1103515245+12345)%2147483648)/2147483648,N=21;
  const fin=(fx,fy)=>`<rect x="${x+fx*cell}" y="${y+fy*cell}" width="${7*cell}" height="${7*cell}" fill="#0A1F44"/><rect x="${x+(fx+1)*cell}" y="${y+(fy+1)*cell}" width="${5*cell}" height="${5*cell}" fill="#fff"/><rect x="${x+(fx+2)*cell}" y="${y+(fy+2)*cell}" width="${3*cell}" height="${3*cell}" fill="#0A1F44"/>`;
  o+=fin(0,0)+fin(N-7,0)+fin(0,N-7);
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){if((i<8&&j<8)||(i>N-9&&j<8)||(i<8&&j>N-9))continue;if(rnd()>.52)o+=`<rect x="${x+i*cell}" y="${y+j*cell}" width="${cell}" height="${cell}" fill="#0A1F44"/>`}
  return o};
const S_={};

/* ERP / software: modules exchanging data with one core */
S_.erp=()=>{const mods=[[105,62,"Finance"],[300,38,"Sales"],[495,62,"CRM"],[105,278,"Inventory"],[300,302,"HR"],[495,278,"Purchase"]];
 return svg(mods.map(([x,y],i)=>`<line x1="300" y1="170" x2="${x}" y2="${y}" stroke="${L}" stroke-width="2" stroke-dasharray="4 6"/>${mover(`M300,170 L${x},${y}`,2.4,i*.4)}${mover(`M${x},${y} L300,170`,2.4,1.2+i*.4,3,G)}`).join("")+
 mods.map(([x,y,n],i)=>`<g><rect x="${x-62}" y="${y-21}" width="124" height="42" rx="9" fill="${N2}" stroke="${L}"/>${t(x+6,y+5,14,n)}<circle cx="${x-44}" cy="${y}" r="5" fill="${G}">${blink(2.4,i*.4)}</circle></g>`).join("")+
 `<circle cx="300" cy="170" r="72" fill="none" stroke="${S}" stroke-width="2" stroke-dasharray="6 10">${spin(300,170,18)}</circle><circle cx="300" cy="170" r="56" fill="${B}"/><circle cx="300" cy="170" r="56" fill="none" stroke="${S}" stroke-opacity=".6"><animate attributeName="r" values="56;80" dur="2.4s" repeatCount="indefinite"/><animate attributeName="stroke-opacity" values=".6;0" dur="2.4s" repeatCount="indefinite"/></circle>${t(300,168,24,"ERP",W,800)}${t(300,190,12,"one platform","#D3E1F8",600)}`)};

/* Mobile app: scrolling order list + notification */
S_.mobile=()=>{const rows=Array.from({length:8},(_,i)=>{const y=86+i*40;return `<rect x="238" y="${y}" width="124" height="34" rx="6" fill="#fff"/><circle cx="254" cy="${y+17}" r="8" fill="${i%3===0?G:i%3===1?B:S}"/><rect x="268" y="${y+9}" width="${60+(i*13)%30}" height="6" rx="3" fill="#C9D5E5"/><rect x="268" y="${y+20}" width="40" height="5" rx="2.5" fill="#E1E8F1"/>`}).join("");
 return svg(`<g opacity=".35" transform="rotate(10 420 170)"><rect x="370" y="40" width="120" height="250" rx="20" fill="${N2}" stroke="${L}"/><rect x="380" y="58" width="100" height="212" rx="10" fill="${N3}"/></g>
 <g opacity=".35" transform="rotate(-10 180 170)"><rect x="110" y="40" width="120" height="250" rx="20" fill="${N2}" stroke="${L}"/><rect x="120" y="58" width="100" height="212" rx="10" fill="${N3}"/></g>
 <defs><clipPath id="scM"><rect x="232" y="40" width="136" height="262" rx="12"/></clipPath></defs>
 <rect x="222" y="22" width="156" height="300" rx="26" fill="#0A1F44" stroke="${S}" stroke-width="2"/>
 <g clip-path="url(#scM)"><rect x="232" y="40" width="136" height="262" fill="${PALE}"/><g>${rows}<animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 -120;0 -120;0 0" keyTimes="0;.2;.5;.8;1" dur="7s" repeatCount="indefinite"/></g>
 <rect x="232" y="40" width="136" height="38" fill="${B}"/>${t(250,64,13,"Orders",W,700,"start")}<circle cx="352" cy="59" r="6" fill="#fff" opacity=".8"/>
 <g><rect x="240" y="48" width="120" height="36" rx="8" fill="#fff" stroke="${G}"/><circle cx="256" cy="66" r="6" fill="${G}"/>${t(268,70,11,"Order confirmed","#0A1F44",700,"start")}<animateTransform attributeName="transform" type="translate" values="0 -60;0 -60;0 0;0 0;0 -60" keyTimes="0;.55;.62;.85;.92" dur="7s" repeatCount="indefinite"/></g>
 <circle cx="342" cy="276" r="16" fill="${B}"/><path d="M335 270h5v5h-5zM344 270h5v5h-5zM335 279h5v5h-5zM344 279h3v3h-3z" fill="#fff"/></g>
 <circle cx="342" cy="276" r="16" fill="none" stroke="${S}"><animate attributeName="r" values="16;28" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.8s" repeatCount="indefinite"/></circle>
 <rect x="285" y="30" width="30" height="5" rx="2.5" fill="${N3}"/>
 <g><rect x="70" y="250" width="92" height="30" rx="15" fill="${N2}" stroke="${L}"/>${t(116,270,13,"Android")}</g><g><rect x="438" y="60" width="72" height="30" rx="15" fill="${N2}" stroke="${L}"/>${t(474,80,13,"iOS")}</g>`)};

/* Industry automation: machines, flow, OEE gauge */
S_.automation=()=>{const mach=[90,250,410].map((x,i)=>{const cx=x+55,cy=165;return `<rect x="${x}" y="110" width="110" height="110" rx="10" fill="${N2}" stroke="${L}"/><circle cx="${cx}" cy="${cy}" r="26" fill="none" stroke="${S}" stroke-width="10" stroke-dasharray="7 6">${spin(cx,cy,4+i,i%2)}</circle><circle cx="${cx}" cy="${cy}" r="9" fill="${S}"/><circle cx="${x+96}" cy="124" r="5" fill="${G}">${blink(1.2+i*.3,i*.3)}</circle>${t(cx,244,13,["Cutting","Assembly","Packing"][i],"#C9D7EC")}`}).join("");
 const C=2*Math.PI*34;
 return svg(`<line x1="40" y1="282" x2="560" y2="282" stroke="${N3}" stroke-width="10" stroke-linecap="round"/><line x1="40" y1="282" x2="560" y2="282" stroke="${S}" stroke-width="3" stroke-dasharray="10 14"><animate attributeName="stroke-dashoffset" from="0" to="-48" dur="1s" repeatCount="indefinite"/></line>
 ${[145,305,465].map(x=>`<line x1="${x}" y1="220" x2="${x}" y2="282" stroke="${L}" stroke-width="3"/>`).join("")}${mach}
 <g><rect x="60" y="30" width="150" height="56" rx="10" fill="${N2}" stroke="${L}"/>${t(76,52,12,"PLC · SCADA","#A9BCDB",600,"start")}${[0,1,2,3,4,5].map(i=>`<rect x="${76+i*20}" y="62" width="12" height="12" rx="2" fill="${i%2?B:G}">${blink(1+i*.2,i*.15)}</rect>`).join("")}</g>
 <circle cx="500" cy="60" r="34" fill="none" stroke="${N3}" stroke-width="8"/><circle cx="500" cy="60" r="34" fill="none" stroke="${G}" stroke-width="8" stroke-linecap="round" transform="rotate(-90 500 60)" stroke-dasharray="${C*.6} ${C}"><animate attributeName="stroke-dasharray" values="${C*.6} ${C};${C*.86} ${C};${C*.7} ${C};${C*.6} ${C}" dur="5s" repeatCount="indefinite"/></circle>${t(500,58,13,"OEE",W,800)}${t(500,74,10,"live","#A9BCDB")}`)};

/* Web development: page builds itself + quality scores */
S_.web=()=>svg(`<rect x="40" y="30" width="350" height="280" rx="12" fill="${PALE}"/><rect x="40" y="30" width="350" height="30" rx="12" fill="${N3}"/><rect x="40" y="48" width="350" height="12" fill="${N3}"/>${[58,72,86].map(x=>`<circle cx="${x}" cy="45" r="4" fill="${S}"/>`).join("")}<rect x="110" y="38" width="200" height="14" rx="7" fill="${N2}"/>
 <g>${appear(.04,.12)}<rect x="56" y="72" width="318" height="20" rx="4" fill="#fff"/><rect x="64" y="78" width="40" height="8" rx="4" fill="${B}"/></g>
 <g>${appear(.12,.22)}<rect x="56" y="102" width="318" height="88" rx="6" fill="${B}"/><rect x="70" y="122" width="150" height="12" rx="6" fill="#fff"/><rect x="70" y="142" width="110" height="8" rx="4" fill="#C9D7EC"/><rect x="70" y="162" width="64" height="16" rx="8" fill="#fff"/></g>
 ${[0,1,2].map(i=>`<g>${appear(.22+i*.08,.3+i*.08)}<rect x="${56+i*108}" y="202" width="102" height="92" rx="6" fill="#fff"/><rect x="${66+i*108}" y="212" width="82" height="40" rx="4" fill="${i===1?G:S}" opacity=".7"/><rect x="${66+i*108}" y="262" width="70" height="7" rx="3.5" fill="#C9D5E5"/><rect x="${66+i*108}" y="276" width="50" height="6" rx="3" fill="#E1E8F1"/></g>`).join("")}
 <path d="M380 150l10 10-10 10" fill="none" stroke="${S}" stroke-width="2"/>
 ${ring(440,90,26,.98,"Performance","98")}${ring(440,170,26,1,"SEO","100",.08)}${ring(440,250,26,1,"Accessibility","100",.16)}`);

/* Web design: wireframe turns into finished UI under the cursor */
S_.design=()=>{const boxes=[[70,50,310,34,B],[70,96,190,96,"#6E8FCB"],[272,96,108,96,S],[70,204,96,86,G],[178,204,96,86,B],[286,204,94,86,"#E85D9E"]];
 const pth="M120,70 L170,150 L320,140 L120,250 L230,250 L330,250 L120,70";
 return svg(`<rect x="56" y="34" width="338" height="270" rx="10" fill="#fff"/>${boxes.map(([x,y,w,h,c],i)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#DCE6F5"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${c}">${appear(.08+i*.11,.14+i*.11,8)}</rect>`).join("")}
 <g><path d="M0 0l0 18 5-5 4 9 3-1.5-4-9 7 0z" fill="#0A1F44" stroke="#fff" stroke-width="1.2"/><animateMotion path="${pth}" dur="8s" repeatCount="indefinite"/></g>
 <rect x="420" y="34" width="130" height="270" rx="10" fill="${N2}" stroke="${L}"/>${t(436,58,12,"Colours","#A9BCDB",700,"start")}${[B,S,G,"#E85D9E"].map((c,i)=>`<circle cx="${448+i*28}" cy="80" r="10" fill="${c}"/>`).join("")}
 ${t(436,120,12,"Layers","#A9BCDB",700,"start")}<rect x="430" y="130" width="110" height="24" rx="5" fill="${B}" opacity=".55"><animate attributeName="y" values="130;160;190;220;130" dur="8s" repeatCount="indefinite"/></rect>${["Header","Hero","Cards","Footer"].map((n,i)=>`${t(442,147+i*30,12,n,"#DCE6F5",600,"start")}`).join("")}`)};

/* Video editing: preview, timeline, playhead, waveform */
S_.video=()=>svg(`<rect x="60" y="20" width="480" height="180" rx="10" fill="#071733" stroke="${L}"/><defs><clipPath id="scV"><rect x="60" y="20" width="480" height="180" rx="10"/></clipPath></defs>
 <g clip-path="url(#scV)"><g><path d="M40 200 L160 110 L250 170 L360 90 L480 160 L600 100 L700 200Z" fill="${N3}"/><path d="M40 200 L200 140 L320 185 L440 130 L620 200Z" fill="${B}" opacity=".6"/><animateTransform attributeName="transform" type="translate" values="0 0;-80 0;0 0" dur="12s" repeatCount="indefinite"/></g><circle cx="470" cy="60" r="18" fill="${S}" opacity=".7"/></g>
 <circle cx="300" cy="110" r="26" fill="rgba(255,255,255,.18)" stroke="#fff"/><path d="M292 97l20 13-20 13z" fill="#fff"/>
 <rect x="60" y="214" width="480" height="108" rx="10" fill="${N2}" stroke="${L}"/>
 ${[[80,150,B],[236,120,"#6E8FCB"],[362,160,B]].map(([x,w,c])=>`<rect x="${x}" y="226" width="${w}" height="24" rx="4" fill="${c}"/>`).join("")}
 ${[[80,90,G],[178,180,S],[366,150,G]].map(([x,w,c])=>`<rect x="${x}" y="256" width="${w}" height="20" rx="4" fill="${c}" opacity=".75"/>`).join("")}
 ${Array.from({length:44},(_,i)=>{const h=6+((i*37)%14);return `<rect x="${82+i*10.4}" y="${299-h/2}" width="5" height="${h}" rx="2" fill="${S}"><animate attributeName="height" values="${h};${18-h/2};${h}" dur="${.8+(i%5)*.15}s" repeatCount="indefinite"/><animate attributeName="y" values="${299-h/2};${299-(18-h/2)/2};${299-h/2}" dur="${.8+(i%5)*.15}s" repeatCount="indefinite"/></rect>`}).join("")}
 <g><line x1="80" y1="216" x2="80" y2="320" stroke="#fff" stroke-width="2"/><path d="M73 212h14l-7 9z" fill="#fff"/><animateTransform attributeName="transform" type="translate" values="0 0;440 0" dur="6s" repeatCount="indefinite"/></g>`);

/* Digital marketing: growth line + funnel */
S_.marketing=()=>{const pts="60,270 110,250 160,256 210,220 260,226 310,180 360,188 410,130 460,120";
 return svg(`${[0,1,2,3].map(i=>`<line x1="50" y1="${110+i*55}" x2="470" y2="${110+i*55}" stroke="${N3}"/>`).join("")}
 <polygon points="${pts} 460,290 60,290" fill="${B}" opacity=".25"/>
 <polyline points="${pts}" fill="none" stroke="${S}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="560" stroke-dashoffset="560"><animate attributeName="stroke-dashoffset" values="560;0;0;560" keyTimes="0;.45;.9;1" dur="6s" repeatCount="indefinite"/></polyline>
 <circle cx="460" cy="120" r="7" fill="${G}">${appear(.4,.46)}</circle>
 <g>${appear(.42,.5)}<rect x="360" y="64" width="110" height="34" rx="17" fill="${G}"/>${t(415,86,13,"Leads ▲",W,800)}</g>
 <g transform="translate(0,0)"><rect x="70" y="40" width="96" height="30" rx="15" fill="${N2}" stroke="${L}"/>${t(118,60,12,"SEO · SEM")}<animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="3s" repeatCount="indefinite"/></g>
 <path d="M490 60h80l-14 60h-52z" fill="${N3}" stroke="${L}"/><path d="M504 130h52l-10 60h-32z" fill="${B}" opacity=".8"/><path d="M508 200h44l-8 60h-28z" fill="${G}"/>
 ${t(530,96,11,"Visitors","#DCE6F5",700)}${t(530,166,11,"Leads",W,700)}${t(530,236,10,"Clients",W,800)}
 ${[0,1,2,3].map(i=>`<circle r="4" fill="#fff">${appear(0,.02,3)}<animateMotion path="M${512+i*12},50 L530,280" dur="3s" begin="${i*.7}s" repeatCount="indefinite"/></circle>`).join("")}`)};

/* E-commerce: store, add to cart, order pipeline */
S_.shop=()=>svg(`<rect x="30" y="30" width="360" height="280" rx="12" fill="${PALE}"/><rect x="30" y="30" width="360" height="40" rx="12" fill="${N3}"/><rect x="30" y="58" width="360" height="12" fill="${N3}"/>${t(50,56,14,"Shop",W,800,"start")}
 <path d="M342 42h4l3 13h12l3-9h-16" fill="none" stroke="#fff" stroke-width="2"/><circle cx="352" cy="60" r="1.8" fill="#fff"/><circle cx="360" cy="60" r="1.8" fill="#fff"/>
 <circle cx="368" cy="42" r="8" fill="${G}"><animate attributeName="r" values="8;8;11;8;8" keyTimes="0;.5;.56;.62;1" dur="4s" repeatCount="indefinite"/></circle>${t(368,46,10,"+1",W,800)}
 ${[0,1,2].map(i=>{const x=46+i*112;return `<rect x="${x}" y="86" width="104" height="206" rx="8" fill="#fff"/><rect x="${x+8}" y="94" width="88" height="88" rx="6" fill="${[S,B,"#6E8FCB"][i]}" opacity=".75"/><rect x="${x+8}" y="194" width="70" height="8" rx="4" fill="#C9D5E5"/><rect x="${x+8}" y="210" width="40" height="10" rx="5" fill="#0A1F44" opacity=".8"/><rect x="${x+8}" y="250" width="88" height="28" rx="6" fill="${B}">${i===1?`<animate attributeName="fill" values="${B};${B};${G};${B};${B}" keyTimes="0;.3;.36;.5;1" dur="4s" repeatCount="indefinite"/>`:""}</rect>${t(x+52,269,12,"Add to cart",W,700)}`}).join("")}
 <circle r="6" fill="${G}" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.34;.36;.5;.52;1" dur="4s" repeatCount="indefinite"/><animateMotion path="M214,262 Q300,120 368,46" keyPoints="0;0;1;1" keyTimes="0;.36;.52;1" calcMode="linear" dur="4s" repeatCount="indefinite"/></circle>
 <rect x="420" y="30" width="150" height="280" rx="12" fill="${N2}" stroke="${L}"/>${t(440,58,13,"Order #2291","#DCE6F5",700,"start")}
 <line x1="452" y1="92" x2="452" y2="272" stroke="${N3}" stroke-width="4"/><line x1="452" y1="92" x2="452" y2="92" stroke="${G}" stroke-width="4"><animate attributeName="y2" values="92;272;272;92" keyTimes="0;.7;.95;1" dur="6s" repeatCount="indefinite"/></line>
 ${["Paid","Packed","Shipped","Delivered"].map((n,i)=>`<circle cx="452" cy="${92+i*60}" r="10" fill="${N3}" stroke="${L}"><animate attributeName="fill" values="${N3};${N3};${G};${G};${N3}" keyTimes="0;${(i*.233).toFixed(3)};${(i*.233+.02).toFixed(3)};.95;1" dur="6s" repeatCount="indefinite"/></circle>${t(474,97+i*60,13,n,W,600,"start")}`).join("")}`);

/* Offices & clients worldwide */
S_.globe=()=>{const pin=(x,y,n,d,anchor="start",dx=12)=>`<circle cx="${x}" cy="${y}" r="5" fill="${G}"/><circle cx="${x}" cy="${y}" r="5" fill="none" stroke="${G}"><animate attributeName="r" values="5;16" dur="2s" begin="${d}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="2s" begin="${d}s" repeatCount="indefinite"/></circle>${t(x+(anchor==="start"?dx:-dx),y+4,13,n,W,700,anchor)}`;
 const IN=[372,196],DK=[300,98],AE=[330,184],NA=[118,128],EU=[262,118];
 const arc=(a,b,h)=>`M${a[0]},${a[1]} Q${(a[0]+b[0])/2},${Math.min(a[1],b[1])-h} ${b[0]},${b[1]}`;
 const arcs=[arc(IN,DK,60),arc(IN,AE,26),arc(IN,EU,60)];
 return svg(`<circle cx="300" cy="170" r="150" fill="${N2}" stroke="${L}"/>${[0,1,2].map(i=>`<ellipse cx="300" cy="170" rx="${50+i*50}" ry="150" fill="none" stroke="${N3}"/>`).join("")}${[-100,-50,0,50,100].map(dy=>`<line x1="${300-Math.sqrt(150*150-dy*dy)}" y1="${170+dy}" x2="${300+Math.sqrt(150*150-dy*dy)}" y2="${170+dy}" stroke="${N3}"/>`).join("")}
 <ellipse cx="300" cy="170" rx="150" ry="150" fill="none" stroke="${S}" stroke-opacity=".5"><animate attributeName="rx" values="150;0;150" dur="10s" repeatCount="indefinite"/></ellipse>
 ${arcs.map((p,i)=>`<path d="${p}" fill="none" stroke="${S}" stroke-width="1.6" stroke-dasharray="4 5"/>${mover(p,3,i*.6,4,"#fff")}`).join("")}
 ${pin(...IN,"Ahmedabad",0)}${pin(...DK,"Copenhagen",.5)}${pin(...AE,"UAE",1,"end")}${pin(...EU,"Europe",.8,"end")}`)};

/* QR scan */
S_.qr=()=>svg(`<rect x="200" y="30" width="200" height="200" rx="12" fill="#fff"/>${qrMods(214,44,8.2,77)}
 ${[[188,18,1,1],[412,18,-1,1],[188,242,1,-1],[412,242,-1,-1]].map(([x,y,sx,sy])=>`<path d="M${x} ${y+sy*30}V${y}H${x+sx*30}" fill="none" stroke="${S}" stroke-width="4"/>`).join("")}
 <rect x="194" y="40" width="212" height="3" fill="${G}" opacity=".9"><animate attributeName="y" values="40;222;40" dur="2.6s" repeatCount="indefinite"/></rect>
 <g>${appear(.4,.46,2.6)}<circle cx="402" cy="36" r="16" fill="${G}"/><path d="M394 36l6 6 10-11" fill="none" stroke="#fff" stroke-width="3"/></g>`);

/* Government / secure platforms */
S_.gov=()=>svg(`${[0,1,2].map(i=>`<rect x="70" y="${70+i*64}" width="140" height="50" rx="8" fill="${N2}" stroke="${L}"/>${[0,1,2].map(j=>`<circle cx="${92+j*16}" cy="${95+i*64}" r="4" fill="${j===0?G:B}">${blink(.8+j*.4+i*.2,i*.2)}</circle>`).join("")}<rect x="146" y="${90+i*64}" width="48" height="8" rx="4" fill="${N3}"/>`).join("")}
 <circle cx="330" cy="170" r="104" fill="none" stroke="${S}" stroke-dasharray="3 9" stroke-width="2">${spin(330,170,30)}</circle>
 <path d="M330 80l70 26v52c0 46-30 78-70 92-40-14-70-46-70-92v-52z" fill="${B}" stroke="${S}" stroke-width="2"/>
 <rect x="308" y="160" width="44" height="36" rx="6" fill="#fff"/><path d="M316 160v-12a14 14 0 0128 0v12" fill="none" stroke="#fff" stroke-width="6"/><circle cx="330" cy="176" r="5" fill="${B}"/>
 <rect x="450" y="70" width="110" height="200" rx="10" fill="${N2}" stroke="${L}"/>${t(466,96,12,"Compliance","#A9BCDB",700,"start")}
 ${[0,1,2,3].map(i=>`<rect x="466" y="${114+i*36}" width="58" height="8" rx="4" fill="${N3}"/><g>${appear(.1+i*.15,.16+i*.15)}<circle cx="540" cy="${118+i*36}" r="9" fill="${G}"/><path d="M535 ${118+i*36}l4 4 6-7" fill="none" stroke="#fff" stroke-width="2"/></g>`).join("")}
 ${mover("M210,95 L270,150",1.6,0)}${mover("M210,223 L270,190",1.6,.8)}`);

/* Mini track & trace line */
S_.trace=()=>{const gates=[110,240,370,500];
 return svg(`${gates.map((x,i)=>`<rect x="${x-46}" y="120" width="92" height="96" rx="8" fill="rgba(141,187,242,.06)" stroke="${L}" stroke-width="2"/>${t(x,104,15,["Production","Inventory","Quality","Dispatch"][i])}<circle cx="${x}" cy="120" r="9" fill="${N3}" stroke="${L}"><animate attributeName="fill" values="${N3};${G};${N3};${N3}" keyTimes="0;.05;.12;1" dur="2s" begin="${i*.5}s" repeatCount="indefinite"/></circle>`).join("")}
 <rect x="20" y="216" width="560" height="26" fill="${N3}" stroke="${L}"/><line x1="20" y1="229" x2="580" y2="229" stroke="${S}" stroke-opacity=".5" stroke-width="20" stroke-dasharray="14 14"><animate attributeName="stroke-dashoffset" from="0" to="-28" dur=".6s" repeatCount="indefinite"/></line>
 ${[0,1,2,3].map(i=>`<g><rect x="-60" y="174" width="50" height="42" rx="4" fill="${PALE}" stroke="${S}" stroke-width="2"/><rect x="-44" y="186" width="18" height="18" fill="#0A1F44"/><rect x="-40" y="190" width="4" height="4" fill="#fff"/><rect x="-32" y="196" width="4" height="4" fill="#fff"/><animateTransform attributeName="transform" type="translate" from="0 0" to="680 0" dur="8s" begin="${-i*2}s" repeatCount="indefinite"/></g>`).join("")}
 ${Array.from({length:14},(_,i)=>`<circle cx="${34+i*41}" cy="258" r="6" fill="${N3}" stroke="${L}"/>`).join("")}`)};

/* All services around one team */
S_.hub=()=>{const list=SERVICES;const n=list.length;
 return svg(`<circle cx="300" cy="170" r="128" fill="none" stroke="${L}" stroke-dasharray="4 8">${spin(300,170,40)}</circle><circle cx="300" cy="170" r="58" fill="${B}"/>${t(300,152,18,"Padhya",W,800)}${t(300,169,11,"Software",W,700)}${t(300,183,11,"Technologies",W,700)}${t(300,199,9,"one team","#D3E1F8",600)}
 ${list.map((s,i)=>{const a=-Math.PI/2+i*2*Math.PI/n,x=300+128*Math.cos(a),y=170+128*Math.sin(a);return `<g><circle cx="${x}" cy="${y}" r="24" fill="${N2}" stroke="${L}"><animate attributeName="fill" values="${N2};${B};${N2};${N2}" keyTimes="0;.06;.16;1" dur="${n*.6}s" begin="${i*.6}s" repeatCount="indefinite"/></circle><g transform="translate(${x-11} ${y-11}) scale(.92)"><path d="${s.icon}" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></g></g>`}).join("")}`)};

/* About: founder-led journey timeline + team building software on a laptop */
S_.about=()=>{const ms=[[62,"Founder-led team","since day one"],[132,"7+ years","building software"],[202,"150+ clients","across 5 countries"],[272,"India · Denmark","offices"]];
 const lines=[[372,86,70,S],[372,102,110,G],[386,118,90,S],[386,134,60,B],[372,150,120,S],[386,166,80,G],[372,182,96,S]];
 const people=[[392,292],[460,300],[528,292]];
 return svg(`<line x1="70" y1="62" x2="70" y2="272" stroke="${N3}" stroke-width="4" stroke-linecap="round"/>
 <line x1="70" y1="62" x2="70" y2="272" stroke="${G}" stroke-width="4" stroke-linecap="round" stroke-dasharray="210" stroke-dashoffset="210"><animate attributeName="stroke-dashoffset" values="210;210;0;0;210" keyTimes="0;.05;.7;.92;1" dur="8s" repeatCount="indefinite"/></line>
 ${ms.map(([y,h,s],i)=>`<circle cx="70" cy="${y}" r="11" fill="${N2}" stroke="${L}" stroke-width="2"/><circle cx="70" cy="${y}" r="6" fill="${G}">${appear(.05+i*.2,.1+i*.2,8)}</circle><g>${appear(.05+i*.2,.12+i*.2,8)}<rect x="96" y="${y-22}" width="190" height="44" rx="10" fill="${N2}" stroke="${L}"/>${t(112,y-3,15,h,W,800,"start")}${t(112,y+14,11,s,"#A9BCDB",600,"start")}</g>`).join("")}
 <rect x="350" y="58" width="220" height="150" rx="10" fill="#0A1F44" stroke="${S}" stroke-width="2"/>
 <rect x="350" y="58" width="220" height="20" rx="10" fill="${N3}"/><rect x="350" y="68" width="220" height="10" fill="${N3}"/>${[364,376,388].map(x=>`<circle cx="${x}" cy="68" r="3.5" fill="${S}"/>`).join("")}
 ${lines.map(([x,y,w,c],i)=>`<rect x="${x}" y="${y}" width="${w}" height="7" rx="3.5" fill="${c}" opacity=".85">${appear(.04+i*.09,.08+i*.09,8)}</rect>`).join("")}
 <rect x="372" y="196" width="2" height="10" fill="#fff">${blink(.9,0,"1;0;1")}</rect>
 <path d="M330 208h260l-16 16H346z" fill="${N3}" stroke="${L}"/>
 ${people.map(([x,y],i)=>`<line x1="${x}" y1="${y-22}" x2="460" y2="224" stroke="${L}" stroke-width="1.5" stroke-dasharray="3 5"/>${mover(`M${x},${y-22} L460,224`,2.2,i*.7,3.5,i===1?G:S)}<circle cx="${x}" cy="${y-8}" r="10" fill="${i===1?B:"#6E8FCB"}"/><path d="M${x-17} ${y+22}a17 15 0 0 1 34 0z" fill="${i===1?B:"#6E8FCB"}"/>`).join("")}
 <g>${appear(.72,.78,8)}<rect x="470" y="34" width="112" height="30" rx="15" fill="${G}"/>${t(526,54,12,"Delivered ✓",W,800)}</g>`)};

/* Blogs: an article writing itself, topics lighting up, new-post notification */
S_.blog=()=>{const tl=[[118,150,10,"#0A1F44"],[118,166,190,10,"#0A1F44"]];
 const body=[[198,250],[214,236],[230,252],[246,210],[262,244],[278,180]];
 const topics=["ERP & CRM","Mobile apps","SEO & marketing","Automation","Track & Trace"];
 return svg(`<rect x="40" y="26" width="300" height="290" rx="12" fill="${PALE}"/>
 <rect x="40" y="26" width="300" height="6" rx="3" fill="${N3}" opacity=".25"/>
 <rect x="40" y="26" width="0" height="6" rx="3" fill="${G}"><animate attributeName="width" values="0;0;300;300;0" keyTimes="0;.1;.85;.95;1" dur="8s" repeatCount="indefinite"/></rect>
 <g>${appear(.04,.1,8)}<defs><clipPath id="scBlogImg"><rect x="58" y="46" width="264" height="92" rx="8"/></clipPath></defs><g clip-path="url(#scBlogImg)"><rect x="58" y="46" width="264" height="92" fill="${B}"/><path d="M58 138 L130 86 L180 116 L240 70 L322 124 L322 138Z" fill="${N3}"/><circle cx="290" cy="70" r="13" fill="${S}" opacity=".8"/></g></g>
 <g>${appear(.12,.18,8)}<rect x="58" y="${tl[0][0]+28}" width="230" height="12" rx="6" fill="#0A1F44"/><rect x="58" y="${tl[0][0]+46}" width="160" height="12" rx="6" fill="#0A1F44"/></g>
 <g>${appear(.16,.22,8)}<rect x="58" y="${tl[0][0]+68}" width="58" height="16" rx="8" fill="${G}" opacity=".85"/>${t(87,tl[0][0]+80,9.5,"Software",W,800)}<rect x="124" y="${tl[0][0]+72}" width="70" height="8" rx="4" fill="#C9D5E5"/></g>
 ${body.map(([y,w],i)=>`<rect x="58" y="${y+8}" width="${w}" height="6" rx="3" fill="#B9C7DA">${appear(.24+i*.07,.28+i*.07,8)}</rect>`).join("")}
 <g><path d="M0 0l16 -16 6 6 -16 16h-6z" fill="${B}" stroke="#fff" stroke-width="1.2"/><animateMotion path="M70,206 L300,206 L70,222 L300,238 L70,254 L300,270 L70,286" dur="8s" repeatCount="indefinite"/></g>
 <rect x="372" y="78" width="200" height="238" rx="12" fill="${N2}" stroke="${L}"/>${t(390,104,12,"Topics","#A9BCDB",700,"start")}
 ${topics.map((n,i)=>`<rect x="388" y="${118+i*38}" width="168" height="28" rx="14" fill="${N3}" stroke="${L}"><animate attributeName="fill" values="${N3};${N3};${B};${N3};${N3}" keyTimes="0;${(i*.18).toFixed(2)};${(i*.18+.06).toFixed(2)};${(i*.18+.16).toFixed(2)};1" dur="8s" repeatCount="indefinite"/></rect>${t(472,137+i*38,12,n,W,700)}`).join("")}
 <g><rect x="372" y="20" width="200" height="44" rx="10" fill="#fff" stroke="${G}"/><circle cx="394" cy="42" r="8" fill="${G}"/>${t(410,39,12,"New article",'#0A1F44',800,"start")}${t(410,54,10,"Insights · 4 min read","#58677F",600,"start")}<animateTransform attributeName="transform" type="translate" values="0 -60;0 -60;0 0;0 0;0 -60" keyTimes="0;.6;.66;.9;.96" dur="8s" repeatCount="indefinite"/></g>`)};

return S_;})();

/* office location maps */
const mapScene=(city,sub)=>()=>{const L="rgba(141,187,242,.35)",N3="#163A72";
 const roads=`<path d="M0 230 C150 200 260 260 600 190" stroke="${N3}" stroke-width="22" fill="none"/><path d="M0 230 C150 200 260 260 600 190" stroke="${L}" stroke-width="2" stroke-dasharray="10 10" fill="none"/><path d="M180 0 C210 120 160 220 230 340" stroke="${N3}" stroke-width="16" fill="none"/><path d="M430 0 L380 340" stroke="${N3}" stroke-width="12" fill="none"/>`;
 const blocks=[[30,40,110,120],[250,30,150,90],[460,60,110,100],[40,280,120,50],[260,270,90,60],[440,250,130,80]].map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#12305F" stroke="${L}"/>`).join("");
 return `<svg viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${roads}${blocks}<circle cx="300" cy="160" r="10" fill="#2FB36B"/><circle cx="300" cy="160" r="10" fill="none" stroke="#2FB36B" stroke-width="2"><animate attributeName="r" values="10;40" dur="2.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="2.2s" repeatCount="indefinite"/></circle><path d="M300 150c-16 0-28-12-28-28s12-28 28-28 28 12 28 28c0 18-28 52-28 52z" fill="#2674B9" stroke="#fff" stroke-width="2" transform="translate(0 -2)"/><circle cx="300" cy="120" r="9" fill="#fff"/><g><rect x="340" y="96" width="${city.length*11+40}" height="48" rx="10" fill="#fff"/><text x="356" y="118" font-size="16" font-weight="800" fill="#0A1F44">${city}</text><text x="356" y="135" font-size="11" font-weight="600" fill="#58677F">${sub}</text></g></svg>`};
SC.mapIN=mapScene("Ahmedabad","India · head office");SC.mapDK=mapScene("Albertslund","Denmark · client support");

/* graphic design: logo drawn with the pen tool, type, palette, collateral */
SC.brand=()=>{const L="rgba(141,187,242,.45)",S="#8DBBF2",N2="#12305F",B="#2674B9",G="#2FB36B",PK="#E85D9E";
 const logo="M90 170 C90 110 130 80 170 80 C210 80 230 110 230 140 C230 175 200 195 165 195 L130 195 L130 240";
 return `<svg viewBox="0 0 600 340" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
 <rect x="50" y="50" width="220" height="240" rx="12" fill="#fff"/><text x="66" y="74" font-size="11" font-weight="700" fill="#58677F">Logo · artboard</text>
 <path d="${logo}" fill="none" stroke="#DCE6F5" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
 <path d="${logo}" fill="none" stroke="${B}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="520" stroke-dashoffset="520"><animate attributeName="stroke-dashoffset" values="520;0;0;520" keyTimes="0;.5;.9;1" dur="6s" repeatCount="indefinite"/></path>
 ${[[90,170],[170,80],[230,140],[130,195],[130,240]].map(([x,y])=>`<rect x="${x-5}" y="${y-5}" width="10" height="10" fill="#fff" stroke="${PK}" stroke-width="2"/>`).join("")}
 <g><path d="M0 0l10 26 6-10 10 2z" fill="#0A1F44" stroke="#fff" stroke-width="1.5"/><animateMotion path="${logo}" dur="6s" keyPoints="0;1;1;0" keyTimes="0;.5;.9;1" calcMode="linear" repeatCount="indefinite"/></g>
 <rect x="296" y="50" width="130" height="150" rx="12" fill="${N2}" stroke="${L}"/><text x="361" y="140" font-size="70" font-weight="800" fill="#fff" text-anchor="middle">Aa</text><text x="361" y="176" font-size="11" font-weight="600" fill="#A9BCDB" text-anchor="middle">Brand typeface</text>
 <rect x="296" y="214" width="130" height="76" rx="12" fill="${N2}" stroke="${L}"/>${[B,S,G,PK,"#fff"].map((c,i)=>`<circle cx="${318+i*22}" cy="252" r="9" fill="${c}"><animate attributeName="r" values="9;12;9" dur="3s" begin="${i*.3}s" repeatCount="indefinite"/></circle>`).join("")}
 <g transform="rotate(-8 505 110)"><rect x="452" y="60" width="110" height="110" rx="10" fill="${B}"/><circle cx="478" cy="86" r="10" fill="#fff" opacity=".9"/><rect x="466" y="132" width="70" height="8" rx="4" fill="#fff"/><rect x="466" y="146" width="44" height="6" rx="3" fill="#C9D7EC"/><animateTransform attributeName="transform" type="rotate" values="-8 505 110;-4 505 110;-8 505 110" dur="5s" repeatCount="indefinite"/></g>
 <g transform="rotate(6 505 250)"><rect x="448" y="214" width="120" height="70" rx="8" fill="#fff"/><rect x="460" y="228" width="16" height="16" rx="4" fill="${B}"/><rect x="460" y="256" width="60" height="6" rx="3" fill="#0A1F44"/><rect x="460" y="268" width="40" height="5" rx="2.5" fill="#C9D5E5"/><animateTransform attributeName="transform" type="rotate" values="6 505 250;2 505 250;6 505 250" dur="6s" repeatCount="indefinite"/></g>
 </svg>`};
