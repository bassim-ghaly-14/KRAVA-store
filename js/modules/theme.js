/* =========================
   KRAVA THEME MODULE
========================= */

const KEY = "krava-theme";

/* =========================
   INIT THEME
========================= */
export function initTheme() {
  const theme = localStorage.getItem(KEY) || "light";
  apply(theme);
}

/* =========================
   APPLY THEME
========================= */
function apply(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

/* =========================
   TOGGLE
========================= */
export function toggleTheme() {
  const current = localStorage.getItem(KEY) || "light";
  const next = current === "dark" ? "light" : "dark";

  localStorage.setItem(KEY, next);
  apply(next);
}

/* =========================
   BIND BUTTON
========================= */
export function bindThemeToggle(btn) {
  if (!btn) return;

  btn.addEventListener("click", () => {
    toggleTheme();
  });
}