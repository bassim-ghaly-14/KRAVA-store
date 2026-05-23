/* =========================
   KRAVA CHECKOUT SYSTEM
========================= */

import { getState, getCartTotal, getCartCount, clearCart } from "../core/store.js";
import { calculateDiscount, getFinalTotal } from "./coupons.js";

function generateOrderId() {
  return "KRAVA-" + Math.random().toString(36).substr(2, 6).toUpperCase();
}

let modal, successModal, toastContainer;

export function initCheckout() {
  modal = createCheckoutModal();
  successModal = createSuccessModal();
  toastContainer = createToastContainer();
  document.body.appendChild(modal);
  document.body.appendChild(successModal);
  document.body.appendChild(toastContainer);
}

export function openCheckout() {
  const state = getState();

  if (!state.cart.length) return;

  updateCheckoutUI();
  modal.classList.add("active");
}

export function closeCheckout() {
  modal.classList.remove("active");
  clearErrors();
}

function validateForm() {
  const name = modal.querySelector("#name").value.trim();
  const phone = modal.querySelector("#phone").value.trim();
  const address = modal.querySelector("#address").value.trim();
  const errors = {};

  if (!name) {
    errors.name = "Full name is required";
  } else if (name.length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  const phoneRegex = /^01[0-2,5][0-9]{8}$/;

  if (!phone) {
    errors.phone = "Phone number is required";
  } else if (!phoneRegex.test(phone)) {
    errors.phone = "Enter a valid Egyptian phone number";
  }

  if (!address) {
    errors.address = "Address is required";
  } else if (address.length < 10) {
    errors.address = "Address must be at least 10 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

function displayErrors(errors) {
  clearErrors();

  Object.keys(errors).forEach(field => {
    const input = modal.querySelector(`#${field}`);

    const errorEl = document.createElement("span");

    errorEl.className = "input-error";
    errorEl.textContent = errors[field];

    input.classList.add("invalid");
    input.parentNode.insertBefore(errorEl, input.nextSibling);
  });
}

function clearErrors() {
  modal.querySelectorAll(".input-error").forEach(el => el.remove());

  modal.querySelectorAll(".invalid")
    .forEach(el => el.classList.remove("invalid"));
}

function showToast(message, type = "error") {
  const toast = document.createElement("div");

  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function placeOrder() {
  const { isValid, errors } = validateForm();

  if (!isValid) {
    displayErrors(errors);
    showToast("Please fill your information to complete the order", "error");
    return;
  }

  const name = modal.querySelector("#name").value.trim();
  const phone = modal.querySelector("#phone").value.trim();
  const address = modal.querySelector("#address").value.trim();

  const orderId = generateOrderId();
  const state = getState();

  const order = {
    id: orderId,
    items: state.cart,
    total: getFinalTotal(getCartTotal()),
    customer: { name, phone, address },
    date: new Date().toISOString()
  };

  clearCart();
  closeCheckout();
  showSuccess(order);

  showToast("Order placed successfully", "success");
}

function showSuccess(order) {
  const box = successModal.querySelector(".success-content");

  box.innerHTML = `
    <h2>🎉 Order Confirmed</h2>
    <p><strong>${order.id}</strong></p>
    <p>Total Paid: <b>${order.total} EGP</b></p>
    <p>Delivery in: <b id="countdown">48:00:00</b></p>
    <p>Thank you for choosing <strong>KRAVA</strong> ❤️</p>
  `;

  successModal.classList.add("active");

  startCountdown();
}

function startCountdown() {
  let hours = 48;
  let mins = 0;
  let secs = 0;

  const el = document.getElementById("countdown");

  const timer = setInterval(() => {

    if (hours <= 0 && mins <= 0 && secs <= 0) {
      clearInterval(timer);
      return;
    }

    secs--;

    if (secs < 0) {
      secs = 59;
      mins--;
    }

    if (mins < 0) {
      mins = 59;
      hours--;
    }

    if (el) {
      el.textContent =
        `${String(hours).padStart(2, "0")}:` +
        `${String(mins).padStart(2, "0")}:` +
        `${String(secs).padStart(2, "0")}`;
    }

  }, 1000);
}

function updateCheckoutUI() {
  const state = getState();

  const total = getCartTotal();
  const discount = calculateDiscount(total);
  const final = getFinalTotal(total);

  modal.querySelector(".summary").innerHTML = `
    <p>Items: ${getCartCount()}</p>
    <p>Subtotal: ${total} EGP</p>
    <p>Discount: -${discount} EGP</p>
    <h3>Total: ${final} EGP</h3>
  `;

  const couponBox = modal.querySelector("#appliedCoupon");

  if (state.coupon) {

    const discountLabel =
      state.coupon.type === "percent"
        ? `${state.coupon.value}% OFF`
        : `${state.coupon.value} EGP OFF`;

    couponBox.innerHTML = `
      <p>
        Coupon Applied:
        <b>${state.coupon.code.toUpperCase()}</b>
        - ${discountLabel}
      </p>
    `;

  } else {
    couponBox.innerHTML = "";
  }
}

function createCheckoutModal() {
  const div = document.createElement("div");

  div.className = "modal checkout-modal";

  div.innerHTML = `
    <div class="modal-content glass">

      <h2>Checkout</h2>

      <div class="summary"></div>

      <div id="appliedCoupon" class="applied-coupon"></div>

      <div class="form-group">
        <input id="name" type="text" placeholder="Full Name" />
      </div>

      <div class="form-group">
        <input id="phone" type="tel" placeholder="Phone Number" />
      </div>

      <div class="form-group">
        <input id="address" type="text" placeholder="Address" />
      </div>

      <select id="payment">
        <option value="cod">Cash on Delivery</option>
        <option value="visa">Visa (Demo)</option>
        <option value="vodafone">Vodafone Cash (Demo)</option>
      </select>

      <button class="btn btn-primary place-order">
        Place Order
      </button>

      <button class="btn btn-outline close-modal">
        Close
      </button>

    </div>
  `;

  div.querySelector(".close-modal")
    .addEventListener("click", closeCheckout);

  div.querySelector(".place-order")
    .addEventListener("click", placeOrder);

  return div;
}

function createSuccessModal() {
  const div = document.createElement("div");

  div.className = "modal success-modal";

  div.innerHTML = `
    <div class="success-content glass"></div>
  `;

  div.addEventListener("click", (e) => {
    if (e.target.classList.contains("success-modal")) {
      div.classList.remove("active");
    }
  });

  return div;
}

function createToastContainer() {
  const div = document.createElement("div");

  div.className = "toast-container";

  return div;
}