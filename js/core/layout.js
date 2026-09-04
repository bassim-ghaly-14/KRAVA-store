/* =========================
   KRAVA SHARED LAYOUT
   (header / footer / page bootstrap)
========================= */

import { initTheme, bindThemeToggle } from "../modules/theme.js";
import { initCheckout } from "../modules/checkout.js";
import { subscribe, getState } from "./store.js";

const BRAND_LOGO = "https://res.cloudinary.com/paihc5qx/image/upload/v1788553216/krava_bwejhh.png";

function headerTemplate(page) {
  return `
  <header class="site-header">
    <div class="container header-inner">

      <a class="brand" href="index.html">
        <img src="${BRAND_LOGO}" alt="KRAVA Logo" class="brand-logo" />
      </a>

      ${page === "home" ? `
      <nav class="main-nav" aria-label="Main navigation">
        <a href="#hoodies">Hoodies</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>` : ""}

      <div class="options">
        <div class="header-actions">
          <button id="themeToggle" class="theme-toggle" aria-pressed="false" aria-label="Toggle dark mode">☾</button>
          ${page !== "cart" ? `
          <a href="cart.html" class="cart-btn" aria-label="View cart">🛒 <span class="cart-count">0</span></a>` : ""}
        </div>
      </div>

    </div>
  </header>`;
}

function footerTemplate() {
  return `
  <footer class="site-footer">
    <p>© <span id="year"></span> KRAVA — All Rights Reserved.</p>
  </footer>`;
}

function syncCartCount(state = getState()) {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach(el => (el.textContent = count));
}

/* Injects shared UI and boots global subsystems for any page */
export function initLayout(page) {
  document.body.insertAdjacentHTML("afterbegin", headerTemplate(page));
  document.body.insertAdjacentHTML("beforeend", footerTemplate());

  initTheme();
  bindThemeToggle(document.getElementById("themeToggle"));
  initCheckout();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  syncCartCount();
  subscribe(syncCartCount);
}