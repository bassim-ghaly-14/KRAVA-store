/* =========================
   LEGACY CART BRIDGE
   (wraps new store system)
========================= */

import {
  addItemToCart,
  removeItem,
  updateQty,
  getState,
  clearCart
} from "../core/store.js";

/* =========================
   GET CART
========================= */
export function getCart() {
  return getState().cart;
}

/* =========================
   ADD ITEM
========================= */
export function addToCart(item) {
  addItemToCart(item);
}

/* =========================
   REMOVE
========================= */
export function removeFromCart(key) {
  removeItem(key);
}

/* =========================
   UPDATE QTY
========================= */
export function updateQuantity(key, delta) {
  updateQty(key, delta);
}

/* =========================
   CLEAR
========================= */
export function clear() {
  clearCart();
}