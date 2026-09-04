/* =========================
   KRAVA CHECKOUT SYSTEM
========================= */

import { getState, getCartTotal, getCartCount, clearCart } from "../core/store.js";
import { calculateDiscount, getFinalTotal, applyCoupon } from "./coupons.js";
import { showToast } from "../core/toast.js";

function generateOrderId() {
  const randomValues = new Uint32Array(2);
  window.crypto.getRandomValues(randomValues);

  const randomPart = Array.from(randomValues, value =>
    value.toString(36).padStart(7, "0")
  ).join("").slice(0, 8).toUpperCase();

  return `KRAVA-${randomPart}`;
}

let modal, successModal;
let couponDebounceTimeout = null;
let countdownTimer = null;

export function initCheckout() {
  modal = createCheckoutModal();
  successModal = createSuccessModal();
  const toastContainer = createToastContainer();

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

  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
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

  const phoneRegex = /^[0-9]{11}$/;

  if (!phone) {
    errors.phone = "Phone number is required";
  } else if (!phoneRegex.test(phone)) {
    errors.phone = "Phone number must be exactly 11 digits";
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

    if (!input) return;

    const errorEl = document.createElement("span");
    errorEl.className = "input-error";
    errorEl.textContent = errors[field];

    input.classList.add("invalid");
    input.parentNode.insertBefore(errorEl, input.nextSibling);
  });
}

function clearErrors() {
  modal.querySelectorAll(".input-error").forEach(el => el.remove());
  modal.querySelectorAll(".invalid").forEach(el => {
    el.classList.remove("invalid");
  });
}

function placeOrder() {
  const { isValid, errors } = validateForm();

  if (!isValid) {
    displayErrors(errors);

    if (errors.phone) {
      showToast(errors.phone, "error", 2000);
    } else {
      showToast(
        "Please fill your information to complete the order",
        "error",
        3000
      );
    }

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
    customer: {
      name,
      phone,
      address
    },
    date: new Date().toISOString()
  };

  clearCart();
  closeCheckout();
  showSuccess(order);
  showToast("Order placed successfully", "success", 3000);
}

function showSuccess(order) {
  const box = successModal.querySelector(".success-content");

  box.innerHTML = `
    <h2>🎉 Order Confirmed</h2>
    <p><strong>${order.id}</strong></p>
    <p>Total Paid: <b>${order.total} EGP</b></p>
    <p>Delivery in: <b id="countdown">48:00:00</b></p>
    <p>Thank you for choosing <strong>KRAVA</strong> ❤️</p>
    <a href="index.html#hoodies" class="btn btn-primary">
      Go Shopping
    </a>
  `;

  successModal.classList.add("active");
  startCountdown();
}

function startCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }

  let hours = 48;
  let mins = 0;
  let secs = 0;

  const el = document.getElementById("countdown");

  const render = () => {
    if (!el) return;

    el.textContent =
      `${String(hours).padStart(2, "0")}:` +
      `${String(mins).padStart(2, "0")}:` +
      `${String(secs).padStart(2, "0")}`;
  };

  render();

  countdownTimer = setInterval(() => {
    if (hours <= 0 && mins <= 0 && secs <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
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

    render();
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
    ${discount > 0 ? `<p>Discount: -${discount} EGP</p>` : ""}
    <h3>Total: ${final} EGP</h3>
  `;

  const couponFeedbackBox = modal.querySelector("#couponFeedbackDisplay");

  if (state.coupon) {
    const discountLabel =
      state.coupon.type === "percent"
        ? `${state.coupon.value}% OFF`
        : `${state.coupon.value} EGP OFF`;

    couponFeedbackBox.style.color = "green";
    couponFeedbackBox.innerHTML = `
      <p>
        Coupon Applied:
        <b>${state.coupon.code.toUpperCase()}</b>
        (-${discountLabel})
      </p>
    `;
  } else if (
    modal.querySelector("#checkoutCouponInput").value.trim() !== ""
  ) {
    couponFeedbackBox.style.color = "red";
    couponFeedbackBox.innerHTML = `
      <p>Invalid coupon code identification.</p>
    `;
  } else {
    couponFeedbackBox.innerHTML = "";
  }
}

function createCheckoutModal() {
  const div = document.createElement("div");

  div.className = "modal checkout-modal";

  div.innerHTML = `
    <div class="modal-content glass">
      <h2>Checkout</h2>

      <div class="summary"></div>

      <div
        class="checkout-coupon-section"
        style="margin: 15px 0; padding: 10px; border: 1px dashed #ccc; border-radius: 4px;"
      >
        <input
          id="checkoutCouponInput"
          type="text"
          placeholder="Enter Coupon Code"
          aria-label="Coupon code"
          style="width: 100%; padding: 8px; box-sizing: border-box;"
        />

        <div
          id="couponFeedbackDisplay"
          style="margin-top: 5px; font-size: 13px; font-weight: bold;"
        ></div>
      </div>

      <div class="form-group">
        <input
          id="name"
          type="text"
          placeholder="Full Name"
          aria-label="Full name"
          maxlength="35"
        />
      </div>

      <div class="form-group">
        <input
          id="phone"
          type="tel"
          placeholder="01X XXXX XXXX"
          aria-label="Phone number"
          inputmode="numeric"
          maxlength="11"
        />
      </div>

      <div class="form-group">
        <input
          id="address"
          type="text"
          placeholder="Address"
          aria-label="Delivery address"
          maxlength="60"
        />
      </div>

      <select id="payment" aria-label="Payment method">
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

  div
    .querySelector(".close-modal")
    .addEventListener("click", closeCheckout);

  div
    .querySelector(".place-order")
    .addEventListener("click", placeOrder);

  const couponInput = div.querySelector("#checkoutCouponInput");

  couponInput.addEventListener("input", event => {
    clearTimeout(couponDebounceTimeout);

    const code = event.target.value.trim();

    couponDebounceTimeout = setTimeout(() => {
      applyCoupon(code);
      updateCheckoutUI();
    }, 400);
  });

  return div;
}

function createSuccessModal() {
  const div = document.createElement("div");

  div.className = "modal success-modal";

  div.innerHTML = `
    <div class="success-content glass"></div>
  `;

  div.addEventListener("click", event => {
    if (event.target.classList.contains("success-modal")) {
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