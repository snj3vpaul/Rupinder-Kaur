"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);
  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try { localStorage.setItem("rk-theme", next); } catch { /* Storage may be unavailable. */ }
  }
  return (
    <button type="button" className="theme-toggle" onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      aria-pressed={theme === "dark"} title="Switch colour theme">
      <span aria-hidden="true">{theme === "light" ? "◐" : "◑"}</span>
      <span className="theme-toggle-text">{theme === "light" ? "Dark" : "Light"}</span>
    </button>
  );
}
