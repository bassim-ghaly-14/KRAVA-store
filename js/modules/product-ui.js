/* =========================
   PRODUCT PAGE LOGIC
========================= */

import { PRODUCTS } from "../products.js";
import { addItemToCart, buyNow } from "../core/store.js";
import { openCheckout } from "./checkout.js";
import { initTheme, bindThemeToggle } from "./theme.js";

export function initProductPage() {
  initTheme();
  bindThemeToggle(document.getElementById("themeToggle"));

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const product = PRODUCTS.find(p => p.id === id);
  const container = document.getElementById("productContainer");

  if (!product) {
    container.innerHTML = "<h2>Product not found</h2>";
    return;
  }

  let colorIndex = 0;
  let size = product.sizes[0];

  function render() {
    const c = product.colors[colorIndex];

    container.innerHTML = `
      <div class="product-detail">
        <img id="mainImage" src="images/hoodie/${c.images[0]}">
        <h1>${product.name}</h1>
        <p>${product.price} EGP</p>

        <div class="colors">
          ${product.colors.map((col, i) => `
            <span class="color ${i===0?'active':''}" data-i="${i}" style="--clr:${col.hex}"></span>
          `).join("")}
        </div>

        <div class="sizes">
          ${product.sizes.map(s => `<span class="size">${s}</span>`).join("")}
        </div>

        <button id="add">Add to Cart</button>
        <button id="buy">Buy Now</button>
      </div>
    `;
  }

  render();

  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("color")) {
      colorIndex = +e.target.dataset.i;
      render();
    }

    if (e.target.classList.contains("size")) {
      size = e.target.textContent;
    }

    if (e.target.id === "add") {
      const c = product.colors[colorIndex];
      addItemToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        color: c.name,
        size,
        img: c.images[0]
      });
    }

    if (e.target.id === "buy") {
      const c = product.colors[colorIndex];
      buyNow({
        id: product.id,
        name: product.name,
        price: product.price,
        color: c.name,
        size,
        img: c.images[0]
      });
      openCheckout();
    }
  });
}