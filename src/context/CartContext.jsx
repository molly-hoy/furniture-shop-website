/* ==========================================================================
   CartContext: the shopping basket's "global state"
   --------------------------------------------------------------------------
   Many components need the basket: the header (item count), the drawer,
   the product page (add to basket), the basket page and checkout. Passing
   it down through props from component to component ("prop drilling")
   would get messy, so we use React Context instead:

     1. <CartProvider> wraps the whole app (see main.jsx) and holds the data.
     2. Any component calls useCart() to read it or change it.

   Changes go through a "reducer": one function that takes the current
   basket plus an "action" (like { type: "add", ... }) and returns the new
   basket. Every possible change is listed in one place, which makes bugs
   much easier to find. It's the same pattern Redux uses.
   ========================================================================== */
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import products from "../data/products.json";
import { FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY } from "../utils/format.js";

const CartContext = createContext(null);
const STORAGE_KEY = "hearth-and-grain-basket";

/* ---------- Saving and loading the basket ----------
   localStorage keeps the basket when the page is refreshed or closed.
   It can be unavailable (private browsing, some embedded viewers), so we
   wrap it in try/catch and carry on without it if needed. */
function loadBasket() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveBasket(lines) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* storage unavailable: the basket still works until the page closes */
  }
}

/* ---------- The reducer ----------
   The basket is an array of "lines". Each line stores only what can't be
   looked up: which product, which colour, how many.
     { key: "3-Stone", productId: 3, colour: "Stone", quantity: 1 }
   Prices and names are looked up from products.json when needed, so they
   are never out of date. */
function basketReducer(lines, action) {
  switch (action.type) {
    case "add": {
      const { product, colour, quantity } = action;
      const key = `${product.id}-${colour}`;
      const existing = lines.find((line) => line.key === key);

      if (existing) {
        // Same product in the same colour: increase the quantity,
        // but never above the number in stock.
        return lines.map((line) =>
          line.key === key
            ? { ...line, quantity: Math.min(line.quantity + quantity, product.stock) }
            : line
        );
      }
      // New line. Spread (...) copies the old array and adds to the end.
      // We never change the old array directly: React needs a NEW array
      // to notice that something changed.
      return [...lines, { key, productId: product.id, colour, quantity: Math.min(quantity, product.stock) }];
    }

    case "setQuantity":
      return lines.map((line) =>
        line.key === action.key ? { ...line, quantity: action.quantity } : line
      );

    case "remove":
      return lines.filter((line) => line.key !== action.key);

    case "clear":
      return [];

    default:
      throw new Error(`Unknown basket action: ${action.type}`);
  }
}

/* ---------- The provider component ---------- */
export function CartProvider({ children }) {
  // useReducer(reducer, initialValue, initialiser) — loadBasket runs once.
  const [lines, dispatch] = useReducer(basketReducer, [], loadBasket);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // useCallback keeps these functions the SAME between renders. The drawer
  // uses closeDrawer inside a useEffect, and a brand-new function on every
  // render would make that effect re-run each time the basket changed.
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // useEffect runs after React updates the page. This one saves the
  // basket every time `lines` changes.
  useEffect(() => {
    saveBasket(lines);
  }, [lines]);

  // useMemo only recalculates these values when `lines` changes,
  // instead of on every render.
  const value = useMemo(() => {
    // Join each line with its full product details.
    const items = lines
      .map((line) => {
        const product = products.find((p) => p.id === line.productId);
        if (!product) return null; // product removed from the catalogue
        const colour = product.colours.find((c) => c.name === line.colour) ?? product.colours[0];
        return { ...line, product, colour, lineTotal: product.price * line.quantity };
      })
      .filter(Boolean);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const qualifiesForFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;

    return {
      items,
      itemCount,
      subtotal,
      qualifiesForFreeDelivery,
      standardDelivery: qualifiesForFreeDelivery || subtotal === 0 ? 0 : STANDARD_DELIVERY,
      amountToFreeDelivery: Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0),

      // Actions. Components call these instead of using dispatch directly.
      addItem: (product, colour, quantity = 1) => {
        dispatch({ type: "add", product, colour, quantity });
        setDrawerOpen(true); // show the basket so the customer sees it worked
      },
      setQuantity: (key, quantity) => dispatch({ type: "setQuantity", key, quantity }),
      removeItem: (key) => dispatch({ type: "remove", key }),
      clearBasket: () => dispatch({ type: "clear" }),

      isDrawerOpen,
      openDrawer,
      closeDrawer,
    };
  }, [lines, isDrawerOpen, openDrawer, closeDrawer]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/* ---------- The hook components use ----------
   const { itemCount, addItem } = useCart(); */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}
