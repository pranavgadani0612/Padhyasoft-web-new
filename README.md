# Padhya Software – React website

React (Vite) version of `padhya-global-it (10).html`.

## Run

```bash
npm install
npm run dev       # local dev server → http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the dist/ build locally
```

`dist/` is static, so you can upload it to any host. Routes use hash URLs (`#/about`, `#/service/webdesign`), the same as the original page, so the host needs no server-side rewrites.

## Structure

```
src/
  main.jsx                 entry (HashRouter + CSS)
  App.jsx                  layout, page transitions, global keyboard/anchor handling
  data/site.js             ALL content: contact info, services, FAQs, industries, photos
  lib/illustrations.js     animated SVG scenes (ported verbatim as SVG strings)
  lib/fx.js                scroll reveal, parallax, smooth wheel scrolling
  lib/lead.js              form validation + lead sending
  components/
    layout/                Header (mega menu), Footer, Search, preloader, float buttons, cookie banner
    sections/Sections.jsx  PageHero, FAQ, stats, process, consultation form section, offices, service grid
    home/                  hero network canvas, featured carousel, tabs, stories carousel
    bands/                 Track&Trace conveyor, QR live scan, graphic-design ball
    Chatbot.jsx            "Padhya Assistant" chatbot
    LeadForm.jsx           consultation form
  pages/                   Home, About, Services, Service (detail), Contact, NotFound
  styles/                  original CSS, unchanged
  assets/                  logos/icons extracted from the base64 images in the HTML
```

## Enquiries & chatbot → employee portal

Every consultation form, chatbot booking and chatbot message is saved in the **Padhya employee portal (TaskFlow)** database.
The Super Admin sees and manages them in the portal under **Website Enquiries**.

- Portal API address: `.env.development` (local portal on port 5000) and `.env.production` (live portal on Hostinger), key `VITE_PORTAL_API`
- Endpoints (in the portal backend, `routes/websiteEnquiryRoutes.js`): `POST /api/public/website-enquiry`, `POST /api/public/website-chat`

## Configuration (`src/data/site.js` → `P`)

- `AI_ENDPOINT` – optional AI backend for the chatbot (POST `{messages}` → `{reply}`).
- `GTM_ID` – Google Tag Manager ID. It loads only after the visitor accepts cookies.
- `RESPECT_REDUCED_MOTION` – set to `true` to turn animations off for visitors who ask for reduced motion.
