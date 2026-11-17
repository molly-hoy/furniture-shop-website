// Price: shows the current price, plus the old price crossed out when on sale.
// <Price price={520} wasPrice={620} />  →  £520  £̶6̶2̶0̶
import { formatPrice } from "../utils/format.js";

export default function Price({ price, wasPrice, large = false }) {
  const style = large ? { fontSize: "1.5rem" } : undefined;

  if (!wasPrice) {
    return <p className="price-now" style={style}>{formatPrice(price)}</p>;
  }

  return (
    <p style={{ display: "flex", gap: "0.6rem", alignItems: "baseline", ...style }}>
      <span className="price-now price-sale">
        <span className="visually-hidden">Sale price </span>
        {formatPrice(price)}
      </span>
      {/* <s> is the HTML element for "no longer accurate", e.g. an old price. */}
      <s className="price-was">
        <span className="visually-hidden">was </span>
        {formatPrice(wasPrice)}
      </s>
    </p>
  );
}
