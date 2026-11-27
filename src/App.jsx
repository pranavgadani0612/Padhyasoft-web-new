import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { reduce } from "./data/site.js";
import { UIContext } from "./context.js";
import { initParallax, initReveal, runParallax } from "./lib/fx.js";
import { applySeo } from "./seo.js";
import Chatbot from "./components/Chatbot.jsx";
import Header, { UtilBar } from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import SearchOverlay from "./components/layout/SearchOverlay.jsx";
import { CookieConsent, FloatButtons, Preloader, ProgressBar } from "./components/layout/Chrome.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Service from "./pages/Service.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";
import Blogs from "./pages/Blogs.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import { PrivacyPolicy, TermsConditions } from "./pages/Legal.jsx";

if (reduce) document.documentElement.classList.add("rm");

/* Page area with the original fade-out / fade-in transition between routes */
function AnimatedRoutes() {
  const location = useLocation();
  const [shown, setShown] = useState(location);
  const [phase, setPhase] = useState("");
  const mainRef = useRef(null);

  useEffect(() => {
    if (location.pathname === shown.pathname) {
      // same page, only ?query changed (e.g. blog filters) – update without a transition
      if (location.search !== shown.search) setShown(location);
      return;
    }
    let t, r1, r2;
    const swap = () => {
      setShown(location);
      window.scrollTo(0, 0);
      if (reduce) return setPhase("");
      setPhase("entering");
      r1 = requestAnimationFrame(() => (r2 = requestAnimationFrame(() => setPhase(""))));
    };
    if (reduce) swap();
    else {
      setPhase("leaving");
      t = setTimeout(swap, 220);
    }
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  // title, description, canonical, Open Graph and schema of the page now on screen
  useEffect(() => {
    applySeo(shown.pathname);
  }, [shown.pathname]);

  // after every page render: wire up scroll reveals + parallax
  useEffect(() => {
    initReveal(mainRef.current);
    runParallax();
  }, [shown.pathname]);

  return (
    <main id="app" tabIndex={-1} ref={mainRef} className={phase || undefined}>
      <Routes location={shown} key={shown.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service/:slug" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/consultation" element={<Navigate to="/contact" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchBtnRef = useRef(null);
  const navigate = useNavigate();

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    searchBtnRef.current?.focus({ preventScroll: true }); // the button is in the sticky header: don't jump the page
  }, []);
  const ui = useMemo(() => ({ openSearch, searchBtnRef }), [openSearch]);

  // global effects: parallax.
  // Scrolling is left to the browser (native scrolling runs off the main thread, so it never sticks
  // on busy sections or touchpads). The old JS wheel-smoothing (initSmooth) is kept in lib/fx.js but no longer used.
  useEffect(() => initParallax(), []);

  // internal links like href="/service/x" change the route without reloading the page,
  // and in-page links like href="#consultation" scroll smoothly instead of changing the route
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const route = e.target.closest("a[href^='/']");
      if (route) {
        const h = route.getAttribute("href");
        if (h.startsWith("//") || route.target === "_blank" || route.hasAttribute("download")) return;
        e.preventDefault();
        // link to the page we're already on (e.g. "Back to Home" in the form on the home page):
        // the route can't change, so scroll to the top instead of doing nothing
        if (h === location.pathname + location.search) {
          window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
          return;
        }
        navigate(h);
        return;
      }
      const a = e.target.closest("a[href^='#']");
      if (!a) return;
      const h = a.getAttribute("href");
      if (h === "#") return;
      const t = document.getElementById(h.slice(1));
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      } else if (h === "#consultation") {
        e.preventDefault();
        navigate("/contact");
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate]);

  // keyboard: "/" opens search, Escape closes it
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && searchOpen) closeSearch();
      if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) {
        e.preventDefault();
        openSearch();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [searchOpen, openSearch, closeSearch]);

  return (
    <UIContext.Provider value={ui}>
      <Preloader />
      <ProgressBar />
      <UtilBar />
      <Header />
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
      <AnimatedRoutes />
      <Footer />
      <FloatButtons />
      <Chatbot />
      <CookieConsent />
    </UIContext.Provider>
  );
}
