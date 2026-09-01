import { useState, useEffect, useCallback } from "react";

const CART_KEY = "verno_cart_v1";
const WISHLIST_KEY = "verno_wishlist_v1";
const EVENT_NAME = "verno-store-sync";

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
  // Lets any other component/page mounted right now (or after a route change)
  // pick up the change without needing a shared React context.
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key } }));
}

function useSyncedState(key, fallback) {
  const [value, setValue] = useState(() => readStorage(key, fallback));

  useEffect(() => {
    const handler = (e) => {
      if (!e.detail || e.detail.key === key) setValue(readStorage(key, fallback));
    };
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener("storage", handler); // cross-tab sync
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener("storage", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (updater) => {
      setValue((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        writeStorage(key, next);
        return next;
      });
    },
    [key]
  );

  return [value, update];
}

/** Cart items: [{ id, name, price, img, size, qty }] */
export function useCart() {
  return useSyncedState(CART_KEY, []);
}

/** Wishlist: array of product ids */
export function useWishlist() {
  return useSyncedState(WISHLIST_KEY, []);
}
