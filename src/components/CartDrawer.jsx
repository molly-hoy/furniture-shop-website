/* ==========================================================================
   CartDrawer
   --------------------------------------------------------------------------
   The basket panel that slides in from the right after "Add to basket"
   or when the basket icon is clicked.

   Like the lightbox in Project 1, it behaves as an accessible "modal":
     • focus moves into it when it opens and returns afterwards
     • Tab cycles inside it ("focus trap")
     • Escape or clicking the dark overlay closes it

   React ideas:
     • useRef    – a reference to a real DOM element (here, the panel), so
                   we can move focus into it
     • useEffect – runs setup code when `isDrawerOpen` changes, and returns
                   a "cleanup" function that removes the listeners again
   ========================================================================== */
import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice, FREE_DELIVERY_THRESHOLD, pluralise } from "../utils/format.js";
import Icon from "./Icon.jsx";
import ProductArt from "./ProductArt.jsx";
import QuantityControl from "./QuantityControl.jsx";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const cart = useCart();
  const { isDrawerOpen, closeDrawer, items, itemCount, subtotal } = cart;
  const panelRef = useRef(null);
  const location = useLocation();

  // Close the drawer when the page changes (e.g. after clicking "Checkout").
  useEffect(() => {
    closeDrawer();
  }, [location.pathname, closeDrawer]);

  // Focus management, Escape key and focus trap while open.
  useEffect(() => {
    if (!isDrawerOpen) return;

    const previouslyFocused = document.activeElement;
    const panel = panelRef.current;
    panel.querySelector("button")?.focus();
    document.body.classList.add("no-scroll");

    function handleKeyDown(event) {
      if (event.key === "Escape") closeDrawer();

      if (event.key === "Tab") {
        const focusable = panel.querySelectorAll("a[href], button:not(:disabled)");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup: runs when the drawer closes.
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("no-scroll");
      previouslyFocused?.focus?.();
    };
  }, [isDrawerOpen, closeDrawer]);

  // Progress towards free delivery, as a percentage for the bar.
  const progress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  return (
    <div className={`${styles.root} ${isDrawerOpen ? styles.open : ""}`} aria-hidden={!isDrawerOpen}>
      {/* The dark overlay behind the panel. Clicking it closes the drawer. */}
      <div className={styles.overlay} onClick={closeDrawer} />

      <aside
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        // `inert` stops anything inside being focused while it's closed.
        inert={!isDrawerOpen}
      >
        <header className={styles.head}>
          <h2 id="drawer-title">
            Your basket <span>({pluralise(itemCount, "item")})</span>
          </h2>
          <button className={styles.close} type="button" onClick={closeDrawer} aria-label="Close basket">
            <Icon name="close" size={22} />
          </button>
        </header>

        {items.length > 0 && (
          <div className={styles.delivery}>
            <p>
              {cart.qualifiesForFreeDelivery
                ? "You've got free UK delivery."
                : `Spend ${formatPrice(cart.amountToFreeDelivery)} more for free delivery.`}
            </p>
            {/* role="progressbar" makes the bar meaningful to screen readers. */}
            <div
              className={styles.bar}
              role="progressbar"
              aria-label="Progress towards free delivery"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
            >
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Conditional rendering: show the list OR the empty message. */}
        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Your basket is empty.</p>
            <Link to="/shop" className="btn btn-dark" onClick={closeDrawer}>
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className={styles.items}>
            {items.map((item) => (
              <li key={item.key} className={styles.item}>
                <div className={styles.thumb}>
                  <ProductArt type={item.product.art} colour={item.colour.hex} label={item.product.name} image={item.product.image} />
                </div>
                <div className={styles.details}>
                  <div className={styles.row}>
                    <Link to={`/product/${item.product.slug}`} className={styles.name}>
                      {item.product.name}
                    </Link>
                    <span className="price-now">{formatPrice(item.lineTotal)}</span>
                  </div>
                  <p className={styles.colour}>{item.colour.name}</p>
                  <div className={styles.row}>
                    <QuantityControl
                      small
                      value={item.quantity}
                      max={item.product.stock}
                      label={`Quantity of ${item.product.name}`}
                      onChange={(quantity) => cart.setQuantity(item.key, quantity)}
                    />
                    <button type="button" className="link-button" onClick={() => cart.removeItem(item.key)}>
                      Remove<span className="visually-hidden"> {item.product.name}</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <footer className={styles.foot}>
            <div className={styles.row}>
              <span>Subtotal</span>
              <strong className="price-now">{formatPrice(subtotal)}</strong>
            </div>
            <p className="field-hint">Delivery options are shown at checkout.</p>
            <Link to="/checkout" className="btn btn-primary btn-block">
              Go to checkout <Icon name="arrow" size={18} />
            </Link>
            <Link to="/basket" className="btn btn-outline btn-block">
              View basket
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}
