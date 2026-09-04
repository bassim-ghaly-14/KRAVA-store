/* =========================
   KRAVA TOAST (SHARED)
========================= */

export function showToast(message, type = "error", duration = 3000) {
  const container = document.querySelector(".toast-container") || document.body;
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}