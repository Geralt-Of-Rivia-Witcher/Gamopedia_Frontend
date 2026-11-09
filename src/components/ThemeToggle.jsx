"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "gamopedia-theme";
const THEME_EVENT = "gamopedia-theme-change";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "dark" || stored === "light" ? stored : null;
  } catch {
    return null;
  }
}

function getThemeSnapshot() {
  return document.documentElement.dataset.theme || getSystemTheme();
}

function getServerSnapshot() {
  return "light";
}

function setTheme(theme, persist = false) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#18201b" : "#f1eee5");
  if (persist) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // The theme still applies for the current page if storage is unavailable.
    }
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

function subscribe(onChange) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = (event) => {
    if (!getStoredTheme()) setTheme(event.matches ? "dark" : "light");
  };
  const onStorageChange = (event) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    setTheme(getStoredTheme() || getSystemTheme());
  };

  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onStorageChange);
  mediaQuery.addEventListener?.("change", onSystemChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onStorageChange);
    mediaQuery.removeEventListener?.("change", onSystemChange);
  };
}

export default function ThemeToggle({ compact = false }) {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerSnapshot);

  return (
    <button
      className={`theme-toggle${compact ? " theme-toggle-compact" : ""}`}
      type="button"
      role="switch"
      aria-label="Toggle color theme"
      aria-checked={theme === "dark"}
      title="Toggle color theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark", true)}
    >
      <span className="theme-toggle-icons" aria-hidden="true">
        <span className="theme-icon-moon">☾</span>
        <span className="theme-icon-sun">☼</span>
      </span>
    </button>
  );
}
