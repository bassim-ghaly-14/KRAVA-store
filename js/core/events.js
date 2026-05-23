/* =========================
   KRAVA EVENT BUS
========================= */

const events = new Map();

/* =========================
   ON EVENT
========================= */
export function on(event, callback) {
  if (!events.has(event)) {
    events.set(event, new Set());
  }

  events.get(event).add(callback);
}

/* =========================
   OFF EVENT
========================= */
export function off(event, callback) {
  if (!events.has(event)) return;
  events.get(event).delete(callback);
}

/* =========================
   EMIT EVENT
========================= */
export function emit(event, data) {
  if (!events.has(event)) return;

  events.get(event).forEach(cb => {
    cb(data);
  });
}