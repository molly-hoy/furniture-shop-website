// Basket page: the full list of what's in the basket, with totals.
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import ProductArt from "../components/ProductArt.jsx";
import QuantityControl from "../components/QuantityControl.jsx";
import OrderSummary from "../components/OrderSummary.jsx";
import Icon from "../components/Icon.jsx";
import { formatPrice, pluralise } from "../utils/format.js";
import styles from "./Basket.module.css";

export default function Basket() {
  const cart = useCart();
  const { items, itemCount, subtotal, standardDelivery } = cart;

  if (items.length === 0) {
    return (
      <div className="container page">
        <div className="page-title">
          <h1>Your basket</h1>
        </div>
        <div className={styles.empty}>
          <p>There's nothing in your basket yet.</p>
          <Link to="/shop" className="btn btn-dark">Start shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="page-title">
        <h1>Your basket</h1>
        <p>{pluralise(itemCount, "item")}</p>
      </div>

      <div className={styles.layout}>
        <ul className={styles.lines}>
          {items.map((item) => (
            <li key={item.key} className={styles.line}>
              <Link to={`/product/${item.product.slug}`} className={styles.thumb} tabIndex={-1} aria-hidden="true">
                <ProductArt type={item.product.art} colour={item.colour.hex} label="" image={item.product.image} />
              </Link>

              <div className={styles.info}>
                <Link to={`/product/${item.product.slug}`} className={styles.name}>{item.product.name}</Link>
                <p className={styles.muted}>{item.colour.name} · {formatPrice(item.product.price)} each</p>
                {item.quantity >= item.product.stock && (
                  <p className={styles.note}>That's all we have in stock.</p>
                )}
              </div>

              <QuantityControl
                value={item.quantity}
                max={item.product.stock}
                label={`Quantity of ${item.product.name}`}
                onChange={(quantity) => cart.setQuantity(item.key, quantity)}
              />

              <p className={`price-now ${styles.lineTotal}`}>{formatPrice(item.lineTotal)}</p>

              <button
                type="button"
                className={styles.remove}
                onClick={() => cart.removeItem(item.key)}
                aria-label={`Remove ${item.product.name} from basket`}
              >
                <Icon name="close" size={18} />
              </button>
            </li>
          ))}
        </ul>

        <OrderSummary items={items} subtotal={subtotal} delivery={standardDelivery} deliveryLabel="Standard delivery">
          {!cart.qualifiesForFreeDelivery && (
            <p className={styles.muted}>
              Add {formatPrice(cart.amountToFreeDelivery)} more for free delivery.
            </p>
          )}
          <Link to="/checkout" className="btn btn-primary btn-block">
            Go to checkout <Icon name="arrow" size={18} />
          </Link>
          <Link to="/shop" className="btn btn-outline btn-block">Continue shopping</Link>
        </OrderSummary>
      </div>
    </div>
  );
}
