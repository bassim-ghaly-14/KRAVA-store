/* =========================
   KRAVA STORE (CORE STATE MANAGER)
========================= */

const STORAGE_KEY = "krava-store";

/* =========================
   INITIAL STATE
========================= */
const defaultState = {
  cart: [],
  coupon: null,
  theme: "light"
};

let state = loadState();

/* =========================
   SUBSCRIBERS SYSTEM (REACTIVE)
========================= */
const listeners = new Set();

export function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notify() {
  saveState();
  listeners.forEach(cb => cb(state));
}

/* =========================
   STATE ACCESS
========================= */
export function getState() {
  return state;
}

export function setState(updater) {
  state = updater(state);
  notify();
}

/* =========================
   CART HELPERS
========================= */

export function addItemToCart(item) {
  setState(prev => {
    const key = `${item.id}-${item.color}-${item.size}`;
    const existing = prev.cart.find(i => i.key === key);

    if (existing) {
      existing.quantity += 1;
    } else {
      prev.cart.push({
        key,
       ...item,
        quantity: 1
      });
    }

    return {...prev };
  });
}

export function buyNow(item) {
  setState(prev => ({
   ...prev,
    cart: [{
      key: `${item.id}-${item.color}-${item.size}`,
     ...item,
      quantity: 1
    }]
  }));
}

export function removeItem(key) {
  setState(prev => ({
   ...prev,
    cart: prev.cart.filter(i => i.key!== key)
  }));
}

export function updateQty(key, delta) {
  setState(prev => {
    const item = prev.cart.find(i => i.key === key);
    if (!item) return prev;

    item.quantity += delta;

    if (item.quantity <= 0) {
      prev.cart = prev.cart.filter(i => i.key!== key);
    }

    return {...prev };
  });
}

export function clearCart() {
  setState(prev => ({
   ...prev,
    cart: []
  }));
}

/* =========================
   COUPON
========================= */

export function setCoupon(coupon) {
  setState(prev => ({
   ...prev,
    coupon
  }));
}

/* =========================
   THEME
========================= */

export function setTheme(theme) {
  setState(prev => ({
   ...prev,
    theme
  }));
}

/* =========================
   COMPUTED VALUES
========================= */

export function getCartTotal() {
  return state.cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}

export function getCartCount() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

/* =========================
   PERSISTENCE
========================= */

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved? JSON.parse(saved) : defaultState;
}