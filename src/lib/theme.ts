/**
 * Light / dark theme helpers.
 *
 * How it works:
 * 1. `themeInitScript` runs inline in <head> before the page paints. It reads
 *    the saved choice and puts `.dark` on <html>, so there's no flash of the
 *    wrong theme. With no saved choice the site starts in LIGHT theme (the
 *    OS preference is deliberately ignored).
 * 2. `ThemeToggle` (components/shared) flips the class and saves the choice.
 * 3. All colours come from CSS variables in globals.css that change under `.dark`.
 */
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "dagsis-theme";

/** Inline script — keep it tiny and dependency-free. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="dark"){t="light"}document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})()`;

export function getDocumentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  // Animate colours only for user-initiated switches.
  root.classList.add("theme-transition");
  root.classList.toggle("dark", theme === "dark");
  window.setTimeout(() => root.classList.remove("theme-transition"), 300);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode / storage disabled: the theme still applies for this visit.
  }
}
