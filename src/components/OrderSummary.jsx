/* OrderSummary: the totals box used on the Basket, Checkout and
   Order confirmed pages. `children` lets each page add its own buttons
   underneath, e.g. <OrderSummary ...><Link>Checkout</Link></OrderSummary> */
import ProductArt from "./ProductArt.jsx";
import { formatPrice } from "../utils/format.js";
import styles from "./OrderSummary.module.css";

export default function OrderSummary({ title = "Order summary", items, subtotal, delivery, deliveryLabel = "Delivery", showItems = false, children }) {
  const total = subtotal + delivery;

  return (
    <aside className={styles.summary} aria-labelledby="summary-title">
      <h2 id="summary-title">{title}</h2>

      {showItems && (
        <ul className={styles.items}>
          {items.map((item) => (
            <li key={item.key}>
              <span className={styles.thumb}>
                <ProductArt type={item.product.art} colour={item.colour.hex} label="" image={item.product.image} />
                <span className={styles.qty} aria-label={`Quantity ${item.quantity}`}>{item.quantity}</span>
              </span>
              <span>
                <strong>{item.product.name}</strong>
                <span className={styles.muted}>{item.colour.name}</span>
              </span>
              <span className="price-now">{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
      )}

      <dl className={styles.totals}>
        <div>
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div>
          <dt>{deliveryLabel}</dt>
          <dd>{delivery === 0 ? "Free" : formatPrice(delivery)}</dd>
        </div>
        <div className={styles.total}>
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      <p className={styles.muted}>Prices include VAT.</p>

      {children}
    </aside>
  );
}
