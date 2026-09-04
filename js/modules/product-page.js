/* =========================
   PRODUCT PAGE LOGIC
========================= */

import { PRODUCTS } from "../products.js";
import { addItemToCart, buyNow } from "../core/store.js";
import { openCheckout } from "./checkout.js";
import { showToast } from "../core/toast.js";

export function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const product = PRODUCTS.find(p => p.id === productId);
  const container = document.getElementById("productContainer");

  if (!product) {
    container.innerHTML = "<h2>Product not found</h2>";
    return;
  }

  /* Preload all color variants so switching colors feels instant */
  product.colors.forEach(color => {
    color.images.forEach(src => { new Image().src = src; });
  });

  const urlColor = params.get("color");
  const urlSize = params.get("size");

  /* STATE INITIALIZATION */
  let selectedColor = 0;
  if (urlColor) {
    const foundColorIdx = product.colors.findIndex(c => c.name.toLowerCase() === urlColor.toLowerCase());
    if (foundColorIdx !== -1) selectedColor = foundColorIdx;
  }

  const firstAvailableSize = () => product.sizes.find(s => (product.colors[selectedColor].stock[s] || 0) > 0) || product.sizes[0];
  let selectedSize = product.colors[selectedColor].stock[urlSize] > 0 ? urlSize : firstAvailableSize();

  /* URL SYNC HELPER */
  function updateProductUrlState() {
    const newUrl = `${window.location.pathname}?id=${product.id}&color=${product.colors[selectedColor].name}&size=${selectedSize}`;
    window.history.replaceState({}, "", newUrl);
  }

  /* RENDER PRODUCT PAGE */
  function render() {
    const activeColorObj = product.colors[selectedColor];

    container.innerHTML = `
      <div class="product-detail">

        <div class="gallery">
          <img id="mainImage" src="${activeColorObj.images[0]}" alt="${product.name} — ${activeColorObj.name}" />
        </div>

        <div class="info">

          <h1>${product.name}</h1>

          <p class="price">${product.price} EGP</p>

          <span class="muted">COLORS:</span>
          <div class="colors">
            ${product.colors.map((c, i) => `
              <span class="color ${i === selectedColor ? "active" : ""}"
                data-index="${i}"
                style="--clr:${c.hex}"
                role="button"
                aria-label="Color: ${c.name}"></span>
            `).join("")}
          </div>

          <span class="muted">SIZES:</span>
          <div class="sizes">
            ${product.sizes.map(s => {
              const isOut = (activeColorObj.stock[s] || 0) === 0;
              return `
                <span class="size ${s === selectedSize ? "active" : ""} ${isOut ? "disabled-out" : ""}"
                      role="button"
                      aria-label="Size: ${s}${isOut ? " (out of stock)" : ""}">
                  ${s} ${isOut ? "(Out)" : ""}
                </span>
              `;
            }).join("")}
          </div>

          <div class="actions">
            <button id="addToCart" class="btn btn-primary" ${activeColorObj.stock[selectedSize] === 0 ? "disabled" : ""}>
              Add to Cart
            </button>
            <button id="buyNow" class="btn btn-outline" ${activeColorObj.stock[selectedSize] === 0 ? "disabled" : ""}>
              Buy Now
            </button>
          </div>

        </div>

      </div>
    `;
    updateProductUrlState();
  }

  render();

  /* EVENTS */
  container.addEventListener("click", (e) => {

    /* COLORS */
    if (e.target.classList.contains("color")) {
      selectedColor = Number(e.target.dataset.index);

      // Auto-fallback to an available size if current selection is out of stock in the newly picked color
      const nextColorObj = product.colors[selectedColor];
      if ((nextColorObj.stock[selectedSize] || 0) === 0) {
        selectedSize = product.sizes.find(s => nextColorObj.stock[s] > 0) || product.sizes[0];
      }

      render();
      return;
    }

    /* SIZE */
    if (e.target.classList.contains("size")) {
      if (e.target.classList.contains("disabled-out")) {
        showToast("Selected size is out of stock for this color.");
        return;
      }
      selectedSize = e.target.textContent.split(" ")[0].trim();

      container.querySelectorAll(".size").forEach(s => s.classList.remove("active"));
      e.target.classList.add("active");
      updateProductUrlState();
      return;
    }

    /* ADD TO CART */
    if (e.target.id === "addToCart") {
      const color = product.colors[selectedColor];

      addItemToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        color: color.name,
        size: selectedSize,
        img: color.images[0]
      });

      e.target.textContent = "Added ✓";
      setTimeout(() => { e.target.textContent = "Add to Cart"; }, 1000);
      return;
    }

    /* BUY NOW - DIRECT CHECKOUT ROUTINE */
    if (e.target.id === "buyNow") {
      const color = product.colors[selectedColor];

      buyNow({
        id: product.id,
        name: product.name,
        price: product.price,
        color: color.name,
        size: selectedSize,
        img: color.images[0]
      });

      openCheckout();
    }
  });
}