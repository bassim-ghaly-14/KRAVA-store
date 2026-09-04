/* =========================
   KRAVA UI ENGINE (PRODUCTS GRID MGR)
========================= */

import { PRODUCTS } from "../products.js";
import { addItemToCart, buyNow } from "../core/store.js";
import { openCheckout } from "./checkout.js";
import { showToast } from "../core/toast.js";

/* =========================
   RENDER PRODUCTS
========================= */

export function renderProducts(container, sortBy = "default") {
  let products = [...PRODUCTS];

  if (sortBy === "price-low") {
    products.sort((a, b) => a.price - b.price);
  }
  if (sortBy === "price-high") {
    products.sort((a, b) => b.price - a.price);
  }
  if (sortBy === "name") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  }

  container.innerHTML = products.map(product => {
    const firstColor = product.colors[0];
    
    // Find first available size in stock for the default color, fallback to first index
    const defaultAvailableSize = product.sizes.find(s => (firstColor.stock[s] || 0) > 0) || product.sizes[0];

    return `
      <article class="product-card" data-id="${product.id}">
        <div class="product-media">
          <div class="product-images">
            ${firstColor.images.map((img, i) => `
              <img src="${img}" class="${i === 0 ? "active" : ""}">
            `).join("")}
          </div>

          <div class="image-dots">
            ${firstColor.images.map((_, i) => `
              <span class="dot ${i === 0 ? "active" : ""}" data-index="${i}"></span>
            `).join("")}
          </div>
        </div>

        <div class="product-body">
          <h3 class="product-title">${product.name}</h3>

          <p class="product-price">
            ${product.oldPrice ? `<span class="discount">${product.oldPrice}</span>` : ""}
            ${product.price} EGP
          </p>

          <div class="colors">
            ${product.colors.map((c, i) => `
              <span class="color ${i === 0 ? "active" : ""}"
                data-color="${i}"
                style="--clr:${c.hex}">
              </span>
            `).join("")}
          </div>

          <div class="sizes">
            ${product.sizes.map(s => {
              const isOut = (firstColor.stock[s] || 0) === 0;
              const isActive = s === defaultAvailableSize;
              return `
                <span class="size ${isActive ? "active" : ""} ${isOut ? "disabled-stock-out" : ""}"
                      data-size="${s}">
                  ${s}
                </span>
              `;
            }).join("")}
          </div>

          <div class="actions">
            <button class="btn btn-primary add-cart">Add to Cart</button>
            <button class="btn btn-outline buy-now">Buy Now</button>
            <button class="btn btn-outline view-product">View</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

/* =========================
   INTERACTIONS
========================= */

export function initProductInteractions(container) {
  container.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    if (!card) return;

    const id = card.dataset.id;
    const product = PRODUCTS.find(p => p.id === id);

    // Helper closure to obtain selected state variables live from the current DOM element card
    const getActiveSelection = () => {
      const colorIndex = Number(card.querySelector(".color.active")?.dataset.color || 0);
      const size = card.querySelector(".size.active")?.dataset.size || product.sizes[0];
      const colorObj = product.colors[colorIndex];
      return { colorIndex, size, colorObj };
    };

    /* ADD TO CART */
    if (e.target.classList.contains("add-cart")) {
      const { size, colorObj } = getActiveSelection();

      if ((colorObj.stock[size] || 0) === 0) {
        showToast("This variation is out of stock.");
        return;
      }

      addItemToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        color: colorObj.name,
        size,
        img: colorObj.images[0]
      });

      feedback(e.target, "Added ✓");
    }

    /* BUY NOW (DIRECT ROUTE) */
    if (e.target.classList.contains("buy-now")) {
      const { size, colorObj } = getActiveSelection();

      if ((colorObj.stock[size] || 0) === 0) {
        showToast("This variation is out of stock.");
        return;
      }

      buyNow({
        id: product.id,
        name: product.name,
        price: product.price,
        color: colorObj.name,
        size,
        img: colorObj.images[0]
      });

      openCheckout();
    }

    /* VIEW DETAILS (WITH PERSISTED STATE PARAMS) */
    if (e.target.classList.contains("view-product")) {
      const { size, colorObj } = getActiveSelection();
      window.location.href = `product.html?id=${product.id}&color=${colorObj.name}&size=${size}`;
    }

    /* COLOR SELECTOR CHANGES WITH SIZE STOCK CONSTRAINTS MAPS */
    if (e.target.classList.contains("color")) {
      const colorIndex = Number(e.target.dataset.color);
      const colors = card.querySelectorAll(".color");
      colors.forEach(c => c.classList.remove("active"));
      e.target.classList.add("active");

      const targetColorObj = product.colors[colorIndex];
      
      // Update Images viewports node
      const imgContainer = card.querySelector(".product-images");
      imgContainer.innerHTML = targetColorObj.images.map((img, i) => `
        <img src="${img}" class="${i === 0 ? "active" : ""}">
      `).join("");

      // Re-render dots
      const dotsContainer = card.querySelector(".image-dots");
      if (dotsContainer) {
        dotsContainer.innerHTML = targetColorObj.images.map((_, i) => `
          <span class="dot ${i === 0 ? "active" : ""}" data-index="${i}"></span>
        `).join("");
      }

      // Readjust sizes stock presentation for this color dynamically
      let currentActiveSize = card.querySelector(".size.active")?.dataset.size;
      const sizesContainer = card.querySelector(".sizes");
      
      // Fallback if current active size becomes invalid on new color variant bounds
      if ((targetColorObj.stock[currentActiveSize] || 0) === 0) {
        currentActiveSize = product.sizes.find(s => (targetColorObj.stock[s] || 0) > 0) || product.sizes[0];
      }

      sizesContainer.innerHTML = product.sizes.map(s => {
        const isOut = (targetColorObj.stock[s] || 0) === 0;
        const isActive = s === currentActiveSize;
        return `
          <span class="size ${isActive ? "active" : ""} ${isOut ? "disabled-stock-out" : ""}"
                data-size="${s}">
            ${s}
          </span>
        `;
      }).join("");
    }

    /* SIZE SELECTOR TOGGLES WITH BLOCKERS */
    if (e.target.classList.contains("size")) {
      if (e.target.classList.contains("disabled-stock-out")) {
        showToast("Selected size variant is unavailable for this color option.");
        return;
      }
      const sizes = card.querySelectorAll(".size");
      sizes.forEach(s => s.classList.remove("active"));
      e.target.classList.add("active");
    }

    /* GALLERY DOT SLIDER MAPS */
    if (e.target.classList.contains("dot")) {
      const index = Number(e.target.dataset.index);
      const imgs = card.querySelectorAll(".product-images img");
      const dots = card.querySelectorAll(".dot");

      if (!imgs[index]) return;

      imgs.forEach(i => i.classList.remove("active"));
      dots.forEach(d => d.classList.remove("active"));

      imgs[index].classList.add("active");
      e.target.classList.add("active");
    }
  });
}

/* =========================
   SMALL UI FEEDBACK
========================= */

function feedback(btn, text) {
  const old = btn.textContent;
  btn.textContent = text;
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = old;
    btn.disabled = false;
  }, 900);
}
