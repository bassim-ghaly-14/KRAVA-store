/* =========================
   CART PAGE LOGIC
========================= */

import { PRODUCTS } from "../products.js";
import {
  getState, subscribe, updateQty, removeItem,
  getCartTotal, getCartCount, clearCart
} from "../core/store.js";
import { calculateDiscount, getFinalTotal } from "./coupons.js";
import { openCheckout } from "./checkout.js";
import { showToast } from "../core/toast.js";

export function initCartPage() {
  const cartItems = document.getElementById("cartItems");
  const summary = document.getElementById("summary");
  const emptyBtn = document.getElementById("EmptyBtn");
  const cartSummary = document.querySelector(".cart-summary");

  function render() {
    const state = getState();

    emptyBtn.style.display = state.cart.length ? "block" : "none";
    cartSummary.style.display = state.cart.length ? "block" : "none";

    if (!state.cart.length) {
      cartItems.innerHTML = `
        <div class="cart-empty" style="text-align: center; padding: 40px 0;">
          <h2 style="margin-block-end: 10px; color: var(--brand-red)">Empty Cart</h2>
          <p style="color: var(--muted)">You have no items in your cart</p>
          <img style="width:350px; margin-top:20px;" alt="Empty cart illustration" src="https://res.cloudinary.com/paihc5qx/image/upload/v1788553213/cart_xfsxn4.png">
          <div><a href="index.html#hoodies" class="btn btn-primary">Go Shopping</a></div>
        </div>`;
      summary.innerHTML = "";
      return;
    }

    cartItems.innerHTML = state.cart.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name} — ${item.color}" />

        <div class="cart-info">
          <h3>${item.name}</h3>
          <p>${item.color} | ${item.size}</p>
          <p>${item.price} EGP</p>
        </div>

        <div class="qty-controls">
          <div class="qty">
            <button data-action="minus" data-key="${item.key}" aria-label="Decrease quantity">-</button>
            <span>${item.quantity}</span>
            <button data-action="plus" data-key="${item.key}" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn-remove" data-key="${item.key}" data-action="remove" aria-label="Remove item">
            <img src="https://www.svgrepo.com/show/494009/delete.svg" alt="" style="width:20px; height:20px;" />
          </button>
        </div>
      </div>
    `).join("");

    const total = getCartTotal();
    const discount = calculateDiscount(total);
    const final = getFinalTotal(total);

    summary.innerHTML = `
      <p>Items Count: ${getCartCount()}</p>
      <p>Subtotal: ${total} EGP</p>
      ${discount > 0 ? `<p>Discount: -${discount} EGP</p>` : ""}
      <h2>Total: ${final} EGP</h2>
    `;
  }

  render();
  subscribe(render);

  /* EVENTS WITH LIVE STOCK CHECKS */
  cartItems.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const key = button.dataset.key;
    const action = button.dataset.action;
    const currentItem = getState().cart.find(i => i.key === key);

    if (!currentItem) return;

    if (action === "plus") {
      const targetProduct = PRODUCTS.find(p => p.id === currentItem.id);
      const targetColorObj = targetProduct?.colors.find(c => c.name === currentItem.color);
      const maxStockAvailable = targetColorObj?.stock[currentItem.size] || 0;

      if (currentItem.quantity >= maxStockAvailable) {
        showToast(`Sorry, only ${maxStockAvailable} pieces are available in stock for this variant.`);
        return;
      }
      updateQty(key, 1);
    }

    if (action === "minus") {
      updateQty(key, -1);
    }

    if (action === "remove") {
      removeItem(key);
    }
  });

  emptyBtn.addEventListener("click", () => clearCart());

  document.getElementById("checkoutBtn").addEventListener("click", () => openCheckout());
}