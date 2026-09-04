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
  const products = getSortedProducts(sortBy);

  container.innerHTML = products.map(product => {
    const firstColor = product.colors[0];
    const defaultAvailableSize =
      product.sizes.find(s => (firstColor.stock[s] || 0) > 0) ||
      product.sizes[0];

    return createProductCard(product, firstColor, defaultAvailableSize);
  }).join("");
}

function getSortedProducts(sortBy) {
  const products = [...PRODUCTS];

  if (sortBy === "price-low") {
    products.sort((a, b) => a.price - b.price);
  }

  if (sortBy === "price-high") {
    products.sort((a, b) => b.price - a.price);
  }

  if (sortBy === "name") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  }

  return products;
}

function createProductCard(product, firstColor, defaultAvailableSize) {
  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-media">
        <div class="product-images">
          ${renderImages(firstColor.images)}
        </div>

        <div class="image-dots">
          ${renderDots(firstColor.images)}
        </div>
      </div>

      <div class="product-body">
        <h3 class="product-title">${product.name}</h3>

        <p class="product-price">
          ${product.oldPrice ? `<span class="discount">${product.oldPrice}</span>` : ""}
          ${product.price} EGP
        </p>

        <div class="colors">
          ${renderColors(product.colors)}
        </div>

        <div class="sizes">
          ${renderSizes(product.sizes, firstColor.stock, defaultAvailableSize)}
        </div>

        <div class="actions">
          <button class="btn btn-primary add-cart">Add to Cart</button>
          <button class="btn btn-outline buy-now">Buy Now</button>
          <button class="btn btn-outline view-product">View</button>
        </div>
      </div>
    </article>
  `;
}

function renderImages(images) {
  return images.map((img, index) => `
    <img src="${img}" class="${index === 0 ? "active" : ""}">
  `).join("");
}

function renderDots(images) {
  return images.map((_, index) => `
    <span
      class="dot ${index === 0 ? "active" : ""}"
      data-index="${index}">
    </span>
  `).join("");
}

function renderColors(colors) {
  return colors.map((color, index) => `
    <span
      class="color ${index === 0 ? "active" : ""}"
      data-color="${index}"
      style="--clr:${color.hex}">
    </span>
  `).join("");
}

function renderSizes(sizes, stock, activeSize) {
  return sizes.map(size => {
    const isOut = (stock[size] || 0) === 0;
    const isActive = size === activeSize;

    return `
      <span
        class="size ${isActive ? "active" : ""} ${isOut ? "disabled-stock-out" : ""}"
        data-size="${size}">
        ${size}
      </span>
    `;
  }).join("");
}

/* =========================
   INTERACTIONS
========================= */

export function initProductInteractions(container) {
  container.addEventListener("click", handleProductClick);
}

function handleProductClick(e) {
  const card = e.target.closest(".product-card");

  if (!card) return;

  const product = PRODUCTS.find(p => p.id === card.dataset.id);

  if (!product) return;

  if (e.target.classList.contains("add-cart")) {
    handleAddToCart(e.target, card, product);
    return;
  }

  if (e.target.classList.contains("buy-now")) {
    handleBuyNow(card, product);
    return;
  }

  if (e.target.classList.contains("view-product")) {
    handleViewProduct(card, product);
    return;
  }

  if (e.target.classList.contains("color")) {
    handleColorChange(e.target, card, product);
    return;
  }

  if (e.target.classList.contains("size")) {
    handleSizeChange(e.target, card);
    return;
  }

  if (e.target.classList.contains("dot")) {
    handleGalleryChange(e.target, card);
  }
}

/* =========================
   PRODUCT SELECTION
========================= */

function getActiveSelection(card, product) {
  const colorIndex = Number(
    card.querySelector(".color.active")?.dataset.color || 0
  );

  const size =
    card.querySelector(".size.active")?.dataset.size ||
    product.sizes[0];

  const colorObj = product.colors[colorIndex];

  return {
    colorIndex,
    size,
    colorObj
  };
}

/* =========================
   CART ACTIONS
========================= */

function handleAddToCart(button, card, product) {
  const { size, colorObj } = getActiveSelection(card, product);

  if (!isVariationAvailable(colorObj, size)) {
    showToast("This variation is out of stock.");
    return;
  }

  addItemToCart(createCartItem(product, colorObj, size));

  feedback(button, "Added ✓");
}

function handleBuyNow(card, product) {
  const { size, colorObj } = getActiveSelection(card, product);

  if (!isVariationAvailable(colorObj, size)) {
    showToast("This variation is out of stock.");
    return;
  }

  buyNow(createCartItem(product, colorObj, size));
  openCheckout();
}

function createCartItem(product, colorObj, size) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    color: colorObj.name,
    size,
    img: colorObj.images[0]
  };
}

function isVariationAvailable(colorObj, size) {
  return (colorObj.stock[size] || 0) > 0;
}

/* =========================
   VIEW PRODUCT
========================= */

function handleViewProduct(card, product) {
  const { size, colorObj } = getActiveSelection(card, product);

  window.location.href =
    `product.html?id=${product.id}&color=${colorObj.name}&size=${size}`;
}

/* =========================
   COLOR SELECTOR
========================= */

function handleColorChange(target, card, product) {
  const colorIndex = Number(target.dataset.color);
  const targetColor = product.colors[colorIndex];

  updateActiveColor(card, target);
  updateProductImages(card, targetColor.images);
  updateGalleryDots(card, targetColor.images);
  updateProductSizes(card, product, targetColor);
}

function updateActiveColor(card, target) {
  const colors = card.querySelectorAll(".color");

  colors.forEach(color => color.classList.remove("active"));
  target.classList.add("active");
}

function updateProductImages(card, images) {
  const container = card.querySelector(".product-images");

  container.innerHTML = renderImages(images);
}

function updateGalleryDots(card, images) {
  const container = card.querySelector(".image-dots");

  if (!container) return;

  container.innerHTML = renderDots(images);
}

function updateProductSizes(card, product, colorObj) {
  const sizesContainer = card.querySelector(".sizes");
  let activeSize = card.querySelector(".size.active")?.dataset.size;

  activeSize = getAvailableSize(
    product.sizes,
    colorObj.stock,
    activeSize
  );

  sizesContainer.innerHTML = renderSizes(
    product.sizes,
    colorObj.stock,
    activeSize
  );
}

function getAvailableSize(sizes, stock, currentSize) {
  if ((stock[currentSize] || 0) > 0) {
    return currentSize;
  }

  return sizes.find(size => (stock[size] || 0) > 0) || sizes[0];
}

/* =========================
   SIZE SELECTOR
========================= */

function handleSizeChange(target, card) {
  if (target.classList.contains("disabled-stock-out")) {
    showToast(
      "Selected size variant is unavailable for this color option."
    );
    return;
  }

  const sizes = card.querySelectorAll(".size");

  sizes.forEach(size => size.classList.remove("active"));
  target.classList.add("active");
}

/* =========================
   GALLERY
========================= */

function handleGalleryChange(target, card) {
  const index = Number(target.dataset.index);
  const images = card.querySelectorAll(".product-images img");
  const dots = card.querySelectorAll(".dot");

  if (!images[index]) return;

  images.forEach(image => image.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));

  images[index].classList.add("active");
  target.classList.add("active");
}

/* =========================
   SMALL UI FEEDBACK
========================= */

function feedback(button, text) {
  const oldText = button.textContent;

  button.textContent = text;
  button.disabled = true;

  setTimeout(() => {
    button.textContent = oldText;
    button.disabled = false;
  }, 900);
}