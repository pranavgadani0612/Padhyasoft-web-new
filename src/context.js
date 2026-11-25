import { createContext, useContext } from "react";

/* Site-wide UI actions (open search, etc.) shared through context */
export const UIContext = createContext({ openSearch: () => {} });
export const useUI = () => useContext(UIContext);
