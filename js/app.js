/* =========================
   KRAVA APP BOOTSTRAP
   (single entry point for all pages)
========================= */

import { initLayout } from "./core/layout.js";
import { initSlider } from "./modules/slider.js";
import { renderProducts, initProductInteractions } from "./modules/ui.js";
import { initProductPage } from "./modules/product-page.js";
import { initCartPage } from "./modules/cart-page.js";

const page = document.body.dataset.page || "home";

/* Shared header / footer / theme / cart badge / checkout bootstrapping */
initLayout(page);

/* PAGE LOGIC */
switch (page) {

  case "home": {
    const grid = document.getElementById("productsGrid");

    if (grid) {
      renderProducts(grid);
      initProductInteractions(grid);

      const sortSelect = document.getElementById("sortSelect");
      sortSelect?.addEventListener("change", (e) => {
        renderProducts(grid, e.target.value);
      });
    }

    initSlider();
    break;
  }

  case "product":
    initProductPage();
    break;

  case "cart":
    initCartPage();
    break;
}
