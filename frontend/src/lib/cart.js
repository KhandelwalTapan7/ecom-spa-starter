// frontend/src/lib/cart.js

/** LocalStorage key and event name */
export const KEY = "cart";
export const CART_EVENT = "cart:updated";

/** Safe JSON parse */
const parse = (str, fallback) => {
  try { return JSON.parse(str); } catch { return fallback; }
};

/** Read entire cart (array) */
export const getCart = () => parse(localStorage.getItem(KEY), []);

/** Persist entire cart and notify listeners */
export const setCart = (items) => {
  localStorage.setItem(KEY, JSON.stringify(items));
  // notify current tab listeners immediately
  window.dispatchEvent(new Event(CART_EVENT));
  // also trigger cross-tab listeners
  window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: JSON.stringify(items) }));
  return items;
};

/** Add a product (API item has _id) */
export const addToCart = (item, qty = 1) => {
  const cart = getCart();
  const idx = cart.findIndex((x) => x.itemId === item._id);
  if (idx >= 0) {
    cart[idx].qty += qty;
  } else {
    cart.push({
      itemId: item._id,
      title: item.title,
      price: item.price,
      imageUrl: item.imageUrl,
      qty,
    });
  }
  return setCart(cart);
};

/** Update quantity (min 1) */
export const updateQty = (itemId, qty) => {
  const nextQty = Math.max(1, Number(qty) || 1);
  const cart = getCart().map((x) =>
    x.itemId === itemId ? { ...x, qty: nextQty } : x
  );
  return setCart(cart);
};

/** Increment/decrement by delta (can be negative) */
export const bumpQty = (itemId, delta = 1) => {
  const cart = getCart().map((x) =>
    x.itemId === itemId ? { ...x, qty: Math.max(1, (x.qty || 1) + delta) } : x
  );
  return setCart(cart);
};

/** Remove a line item */
export const removeFromCart = (itemId) => {
  const cart = getCart().filter((x) => x.itemId !== itemId);
  return setCart(cart);
};

/** Clear all items */
export const clearCart = () => setCart([]);

/** Total line count (sum of qty) */
export const cartCount = () =>
  getCart().reduce((n, i) => n + (Number(i.qty) || 0), 0);

/** Money total (sum price * qty) */
export const cartTotal = () =>
  getCart().reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.qty) || 0), 0);

/**
 * Subscribe to cart changes in the current tab (returns unsubscribe).
 * You can use this from components like Navbar for instant updates.
 */
export const onCartUpdated = (handler) => {
  const fn = () => handler(getCart());
  window.addEventListener(CART_EVENT, fn);
  // also react to cross-tab/localStorage updates
  const storageFn = (e) => { if (e.key === KEY) fn(); };
  window.addEventListener("storage", storageFn);
  return () => {
    window.removeEventListener(CART_EVENT, fn);
    window.removeEventListener("storage", storageFn);
  };
};
