/* Server entry used only at build time: renders one route to HTML for pre-rendering (scripts/prerender.mjs). */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App.jsx";
import { preloaded } from "./data/blog.js";

export { ROUTES, lastmod, seoHead, SITE } from "./seo.js";
export { SERVICES, STATS, P, ABOUT_IND, FAQ_PAGE, FAQ_SVC } from "./data/site.js";
export { BLOGS } from "./data/blog.js";

export function render(url, blogContent) {
  if (blogContent) preloaded[url.replace("/blog/", "")] = blogContent;
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
