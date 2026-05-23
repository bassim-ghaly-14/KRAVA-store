/* =========================
   KRAVA THEME MODULE
========================= */

const KEY = "krava-theme";

let toggleBtn = null;

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
  updateToggleIcon(theme);
}

/* =========================
   UPDATE ICON ONLY
========================= */
function updateToggleIcon(theme) {
  if (!toggleBtn) return;

  // change ONLY icon inside button
  toggleBtn.textContent = theme === "dark" ? "☀" : "☾";
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

  toggleBtn = btn;

  // set initial icon correctly
  const theme = localStorage.getItem(KEY) || "light";
  updateToggleIcon(theme);

  btn.addEventListener("click", () => {
    toggleTheme();
  });
}