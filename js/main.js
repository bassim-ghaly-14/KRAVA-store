/* =========================
   KRAVA MAIN CONTROLLER
========================= */

import { initTheme, bindThemeToggle } from "./modules/theme.js";
import { initSlider } from "./modules/slider.js";
import { renderProducts, initProductInteractions } from "./modules/ui.js";

import { subscribe, getState } from "./core/store.js";

/* =========================
   INIT APP
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const page = document.body.dataset.page;

  /* =========================
     THEME
  ========================= */
  initTheme();
  bindThemeToggle(document.querySelector(".theme-toggle"));

  /* =========================
     CART COUNT (GLOBAL)
  ========================= */
  function updateCartCount(state = getState()) {
    const count = state.cart.reduce((s, i) => s + i.quantity, 0);

    document.querySelectorAll(".cart-count")
      .forEach(el => el.textContent = count);
  }

  updateCartCount();
  subscribe(updateCartCount);

  /* =========================
     PAGE ROUTER
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

    case "product":
    case "cart":
    default:
      // handled internally by page scripts
      break;
  }

});