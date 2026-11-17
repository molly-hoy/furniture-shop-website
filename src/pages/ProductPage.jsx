/* ==========================================================================
   Product page: /product/:slug
   --------------------------------------------------------------------------
   useParams() reads the ":slug" part of the address, e.g. for
   /product/fell-lounge-chair it returns { slug: "fell-lounge-chair" }.
   We use it to find the product in products.json.
   ========================================================================== */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import products from "../data/products.json";
import { getCategoryLabel } from "../data/categories.js";
import { useCart } from "../context/CartContext.jsx";
import ProductArt from "../components/ProductArt.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Price from "../components/Price.jsx";
import Rating from "../components/Rating.jsx";
import QuantityControl from "../components/QuantityControl.jsx";
import Icon from "../components/Icon.jsx";
import NotFound from "./NotFound.jsx";
import { formatPrice, FREE_DELIVERY_THRESHOLD } from "../utils/format.js";
import styles from "./ProductPage.module.css";

export default function ProductPage() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);

  // Unknown product? Show the 404 page instead.
  if (!product) return <NotFound />;

  /* `key={product.id}` gives each product its own fresh copy of the details
     component. Without it, moving from one product to another (via "You
     might also like") would keep the old colour and quantity selected. */
  return <ProductDetails key={product.id} product={product} />;
}

function ProductDetails({ product }) {
  const { addItem } = useCart();
  const [colour, setColour] = useState(product.colours[0]);
  const [quantity, setQuantity] = useState(1);

  // Set the browser tab title for this product.
  useEffect(() => {
    document.title = `${product.name} | Hearth & Grain`;
    return () => (document.title = "Hearth & Grain: Furniture & Homeware");
  }, [product.name]);

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  // Up to four other products from the same category, topped up with
  // featured products if the category is small.
  const related = [
    ...products.filter((p) => p.category === product.category && p.id !== product.id),
    ...products.filter((p) => p.featured && p.category !== product.category),
  ].slice(0, 4);

  return (
    <div className="container page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link to="/">Home</Link></li>
          <li><Link to={`/shop?category=${product.category}`}>{getCategoryLabel(product.category)}</Link></li>
          <li aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className={styles.layout}>
        {/* ---------- LARGE ILLUSTRATION ---------- */}
        <div className={styles.gallery}>
          <div className={styles.stage}>
            <ProductArt type={product.art} colour={colour.hex} label={`${product.name} in ${colour.name}`} image={product.image} />
          </div>
          {/* Small previews of every colour. Clicking one selects it. */}
          <div className={styles.thumbs}>
            {product.colours.map((c) => (
              <button
                key={c.name}
                type="button"
                className={styles.thumb}
                aria-label={`View in ${c.name}`}
                aria-pressed={c.name === colour.name}
                onClick={() => setColour(c)}
              >
                <ProductArt type={product.art} colour={c.hex} label="" />
              </button>
            ))}
          </div>
        </div>

        {/* ---------- PRODUCT INFO ---------- */}
        <div className={styles.info}>
          <div className={styles.badges}>
            {product.isNew && <span className="badge badge-new">New</span>}
            {product.wasPrice && (
              <span className="badge badge-sale">Save {formatPrice(product.wasPrice - product.price)}</span>
            )}
          </div>

          <h1>{product.name}</h1>
          <Rating value={product.rating} count={product.reviewCount} />
          <Price price={product.price} wasPrice={product.wasPrice} large />
          <p className={styles.description}>{product.description}</p>

          {/* Colour picker: radio buttons styled as swatches. Radios are the
              right element because exactly one colour can be chosen. */}
          <fieldset className={styles.colours}>
            <legend>
              Colour: <strong>{colour.name}</strong>
            </legend>
            <div className={styles.swatchRow}>
              {product.colours.map((c) => (
                <label key={c.name} className={styles.swatch} style={{ "--swatch": c.hex }}>
                  <input
                    type="radio"
                    name="colour"
                    value={c.name}
                    checked={c.name === colour.name}
                    onChange={() => setColour(c)}
                  />
                  <span className="visually-hidden">{c.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Stock message changes colour and wording with the stock level. */}
          <p className={`${styles.stock} ${isOutOfStock ? styles.stockOut : isLowStock ? styles.stockLow : ""}`}>
            <span className={styles.dot} aria-hidden="true" />
            {isOutOfStock
              ? "Sold out. Back in stock in about 4 weeks."
              : isLowStock
                ? `Only ${product.stock} left`
                : "In stock, ships in 3–5 working days"}
          </p>

          <div className={styles.buy}>
            <QuantityControl
              value={quantity}
              onChange={setQuantity}
              max={Math.max(product.stock, 1)}
              label={`Quantity of ${product.name}`}
            />
            <button
              type="button"
              className="btn btn-primary"
              disabled={isOutOfStock}
              onClick={() => addItem(product, colour.name, quantity)}
            >
              <Icon name="bag" size={18} />
              {isOutOfStock ? "Sold out" : `Add to basket · ${formatPrice(product.price * quantity)}`}
            </button>
          </div>

          <ul className={styles.perks}>
            <li><Icon name="truck" /> Free UK delivery over {formatPrice(FREE_DELIVERY_THRESHOLD)}</li>
            <li><Icon name="returns" /> 100-night returns, collected free</li>
            <li><Icon name="shield" /> 10-year guarantee on frames</li>
          </ul>

          {/* <details> is a built-in HTML accordion: no JavaScript needed. */}
          <div className={styles.accordion}>
            <details open>
              <summary>Dimensions</summary>
              <p>{product.dimensions}</p>
            </details>
            <details>
              <summary>Materials &amp; care</summary>
              <p>{product.material}. Wipe with a soft, damp cloth. Keep out of direct sunlight to avoid fading.</p>
            </details>
            <details>
              <summary>Delivery &amp; returns</summary>
              <p>
                Standard delivery is free over {formatPrice(FREE_DELIVERY_THRESHOLD)}. Large furniture
                is delivered by a two-person team to the room of your choice. Returns are free for 100 nights.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* ---------- RELATED PRODUCTS ---------- */}
      <section className={styles.related} aria-labelledby="related-title">
        <h2 id="related-title">You might also like</h2>
        <div className={styles.relatedGrid}>
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
