/* =========================
   KRAVA APP BOOTSTRAP
========================= */

import { initTheme, bindThemeToggle } from "./modules/theme.js";
import { initSlider } from "./modules/slider.js";
import { renderProducts, initProductInteractions } from "./modules/ui.js";

import { subscribe, getState } from "./core/store.js";
import { initCheckout } from "./modules/checkout.js";

/* =========================
   DOM READY
========================= */
document.addEventListener("DOMContentLoaded", () => {

  const page = document.body.dataset.page;

  /* =========================
     THEME
  ========================= */
  initTheme();
  bindThemeToggle(document.querySelector(".theme-toggle"));

  /* =========================
     CART COUNT (GLOBAL SYNC)
  ========================= */
  function updateCartCount(state = getState()) {
    const count = state.cart.reduce((s, i) => s + i.quantity, 0);

    document.querySelectorAll(".cart-count")
      .forEach(el => el.textContent = count);
  }

  updateCartCount();
  subscribe(updateCartCount);

    document.getElementById("sortSelect").addEventListener("change", (e) => {
    renderProducts(document.getElementById("productsGrid"), e.target.value);
  });

  /* =========================
     PAGE LOGIC
  ========================= */

  switch (page) {

    case "home": {
      const grid = document.getElementById("productsGrid");

      if (grid) {
        renderProducts(grid);
        initProductInteractions(grid);
      }

      initSlider();
      break;
    }

    case "product": {
      // product page handles itself (inline script)
      break;
    }

    case "cart": {
      initCheckout();
      break;
    }

    default:
      break;
  }

});
