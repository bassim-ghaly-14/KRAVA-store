/* =========================
   KRAVA UTILITIES
========================= */

/* format price */
export function formatPrice(value) {
  return `${Number(value).toFixed(0)} EGP`;
}

/* debounce */
export function debounce(fn, delay = 300) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* generate random id */
export function uid() {
  return Math.random().toString(36).substring(2, 10);
}

/* query helper */
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function qsa(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}