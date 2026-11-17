// Order confirmed page. Reads the order passed from Checkout via
// navigate("/order-confirmed", { state: { order } }).
import { Link, useLocation } from "react-router-dom";
import OrderSummary from "../components/OrderSummary.jsx";
import Icon from "../components/Icon.jsx";
import styles from "./Checkout.module.css";

export default function OrderConfirmed() {
  const { state } = useLocation();
  const order = state?.order;

  // Someone opened this page directly, without placing an order.
  if (!order) {
    return (
      <div className="container page">
        <div className="page-title">
          <h1>No recent order</h1>
          <p>Once you place an order, its confirmation will appear here.</p>
        </div>
        <Link to="/shop" className="btn btn-dark">Browse the shop</Link>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className={styles.layout}>
        <div style={{ display: "grid", gap: "1.5rem", alignContent: "start" }}>
          <span style={{ display: "grid", placeItems: "center", width: 56, height: 56, borderRadius: "50%", background: "var(--success)", color: "#fff" }}>
            <Icon name="check" size={28} />
          </span>
          <div className="page-title" style={{ marginBottom: 0 }}>
            <p>Order {order.number}</p>
            <h1>Thank you, {order.name.split(" ")[0]}</h1>
          </div>
          <p style={{ maxWidth: "52ch" }}>
            On a live shop we'd email a confirmation to <strong>{order.email}</strong>. This is a
            demo, so no order was placed, no payment was taken and nothing was sent.
          </p>

          <dl style={{ display: "grid", gap: "1rem" }}>
            <div>
              <dt className="field-hint">Delivering to</dt>
              <dd>{order.name}<br />{order.address.map((line) => <span key={line}>{line}<br /></span>)}</dd>
            </div>
            <div>
              <dt className="field-hint">Delivery</dt>
              <dd>{order.delivery}</dd>
            </div>
          </dl>

          <p><Link to="/shop" className="btn btn-outline">Continue shopping</Link></p>
        </div>

        <OrderSummary
          title="Your order"
          items={order.items}
          subtotal={order.subtotal}
          delivery={order.deliveryCost}
          showItems
        />
      </div>
    </div>
  );
}
