"use client";

import { useEffect } from "react";

type Theme = "dark" | "light";

const storageKey = "shalom-portfolio-theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export default function ThemeToggle() {
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      const nextTheme = event.newValue === "light" ? "light" : "dark";
      applyTheme(nextTheme);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleTheme = () => {
    const currentTheme =
      document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
    try {
      window.localStorage.setItem(storageKey, nextTheme);
    } catch {
      // The selected theme still applies when storage is unavailable.
    }
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Toggle light and dark mode"
      onClick={toggleTheme}
    >
      <span className="theme-icon theme-icon-light" aria-hidden="true">
        ☀
      </span>
      <span className="theme-icon theme-icon-dark" aria-hidden="true">
        ◐
      </span>
      <span className="theme-label theme-label-light">Light</span>
      <span className="theme-label theme-label-dark">Dark</span>
    </button>
  );
}
