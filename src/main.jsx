import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import "./styles/theme.css";
import "./styles/behaviour.css";
import "./styles/blog.css";

// old links like /#/service/x (bookmarks, Google, shared links) -> /service/x
if (location.hash.startsWith("#/")) history.replaceState(null, "", location.hash.slice(1) || "/");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
