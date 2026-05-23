/* =========================
   KRAVA UI ENGINE
========================= */

import { PRODUCTS } from "../products.js";
import { addItemToCart, buyNow } from "../core/store.js";
import { openCheckout } from "./checkout.js";

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
    const first = product.colors[0];

    return `
      <article class="product-card" data-id="${product.id}">
        <div class="product-media">
          <div class="product-images">
            ${first.images.map((img, i) => `
              <img src="images/hoodie/${img}" class="${i === 0? "active" : ""}">
            `).join("")}
          </div>

          <div class="image-dots">
            ${first.images.map((_, i) => `
              <span class="dot ${i === 0? "active" : ""}" data-index="${i}"></span>
            `).join("")}
          </div>
        </div>

        <div class="product-body">
          <h3 class="product-title">${product.name}</h3>

          <p class="product-price">
            ${product.oldPrice? `<span class="discount">${product.oldPrice}</span>` : ""}
            ${product.price} EGP
          </p>

          <div class="colors">
            ${product.colors.map((c, i) => `
              <span class="color ${i === 0? "active" : ""}"
                data-color="${i}"
                style="--clr:${c.hex}">
              </span>
            `).join("")}
          </div>

          <div class="sizes">
            ${product.sizes.map((s, i) => `
              <span class="size ${i === 0? "active" : ""}">${s}</span>
            `).join("")}
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

    if (e.target.classList.contains("add-cart")) {
      const colorIndex = card.querySelector(".color.active")?.dataset.color || 0;
      const size = card.querySelector(".size.active")?.textContent || product.sizes[0];
      const color = product.colors[colorIndex];

      addItemToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        color: color.name,
        size,
        img: color.images[0]
      });

      feedback(e.target, "Added ✓");
    }

    if (e.target.classList.contains("buy-now")) {
      const colorIndex = card.querySelector(".color.active")?.dataset.color || 0;
      const size = card.querySelector(".size.active")?.textContent || product.sizes[0];
      const color = product.colors[colorIndex];

      buyNow({
        id: product.id,
        name: product.name,
        price: product.price,
        color: color.name,
        size,
        img: color.images[0]
      });

      openCheckout();
    }

    if (e.target.classList.contains("view-product")) {
      window.location.href = `product.html?id=${product.id}`;
    }

    if (e.target.classList.contains("color")) {
      const colorIndex = Number(e.target.dataset.color);
      const colors = card.querySelectorAll(".color");
      colors.forEach(c => c.classList.remove("active"));
      e.target.classList.add("active");

      const images = product.colors[colorIndex].images;
      const imgContainer = card.querySelector(".product-images");

      imgContainer.innerHTML = images.map((img, i) => `
        <img src="images/hoodie/${img}" class="${i === 0? "active" : ""}">
      `).join("");
    }

    if (e.target.classList.contains("size")) {
      const sizes = card.querySelectorAll(".size");
      sizes.forEach(s => s.classList.remove("active"));
      e.target.classList.add("active");
    }

    if (e.target.classList.contains("dot")) {
      const index = Number(e.target.dataset.index);
      const imgs = card.querySelectorAll(".product-images img");
      const dots = card.querySelectorAll(".dot");

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