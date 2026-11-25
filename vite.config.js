import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  // 5173 is used by the employee portal (TaskFlow) frontend, so the website runs on 5174
  server: { port: 5174 },
  preview: { port: 4174 },
});
