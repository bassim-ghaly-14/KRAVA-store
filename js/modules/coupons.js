/* =========================
   KRAVA COUPON ENGINE
========================= */

import { setCoupon, getState } from "../core/store.js";

/* =========================
   COUPON DATABASE
   (Easy to edit / extend)
========================= */

const COUPONS = {
  krava10: { type: "percent", value: 10 },
  krava20: { type: "percent", value: 20 },
  krava30: { type: "percent", value: 30 },

  vip: { type: "fixed", value: 200 }
};

/* =========================
   VALIDATE COUPON
========================= */

export function validateCoupon(code) {
  if (!code) return null;

  const normalized = code.trim().toLowerCase();

  return COUPONS[normalized] || null;
}

/* =========================
   APPLY COUPON
========================= */

export function applyCoupon(code) {
  const coupon = validateCoupon(code);

  if (!coupon) {
    setCoupon(null);

    return {
      success: false,
      message: "Invalid coupon"
    };
  }

  setCoupon({
    code,
    ...coupon
  });

  return {
    success: true,
    message:
      coupon.type === "percent"
        ? `${coupon.value}% discount applied`
        : `${coupon.value} EGP discount applied`
  };
}

/* =========================
   REMOVE COUPON
========================= */

export function removeCoupon() {
  setCoupon(null);
}

/* =========================
   CALCULATE DISCOUNT
========================= */

export function calculateDiscount(total) {
  const state = getState();
  const coupon = state.coupon;

  if (!coupon) return 0;

  if (coupon.type === "percent") {
    return (total * coupon.value) / 100;
  }

  if (coupon.type === "fixed") {
    return Math.min(coupon.value, total);
  }

  return 0;
}

/* =========================
   FINAL TOTAL AFTER DISCOUNT
========================= */

export function getFinalTotal(total) {
  const discount = calculateDiscount(total);

  return Math.max(total - discount, 0);
}