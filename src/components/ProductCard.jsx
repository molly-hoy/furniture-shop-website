/* ==========================================================================
   ProductCard
   --------------------------------------------------------------------------
   One product tile in a grid. Used on the Home page, the Shop page and in
   "You might also like". Writing it once as a component means every tile
   looks and behaves the same, and a fix here fixes it everywhere.

   Props ("properties") are the inputs a component receives:
     <ProductCard product={someProduct} />
   ========================================================================== */
import { useState } from "react";
import { Link } from "react-router-dom";
import ProductArt from "./ProductArt.jsx";
import Price from "./Price.jsx";
import Rating from "./Rating.jsx";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  // Hovering a colour dot previews that colour on the card.
  const [previewColour, setPreviewColour] = useState(product.colours[0]);
  const isOutOfStock = product.stock === 0;
  const isOnSale = product.wasPrice !== null;

  return (
    <article className={styles.card}>
      <div className={styles.plinth}>
        <ProductArt
          type={product.art}
          colour={previewColour.hex}
          label={`${product.name} in ${previewColour.name}`}
          image={product.image}
        />

        {/* Badges: show at most one, in order of importance. */}
        <div className={styles.badges}>
          {isOutOfStock ? (
            <span className="badge badge-muted">Sold out</span>
          ) : isOnSale ? (
            <span className="badge badge-sale">Sale</span>
          ) : product.isNew ? (
            <span className="badge badge-new">New</span>
          ) : null}
        </div>
      </div>

      <div className={styles.body}>
        {/* The whole card is clickable because this link stretches over it
            (see .link::after in the CSS), but only the name is read out. */}
        <h3 className={styles.name}>
          <Link to={`/product/${product.slug}`} className={styles.link}>
            {product.name}
          </Link>
        </h3>
        <Price price={product.price} wasPrice={product.wasPrice} />

        <div className={styles.meta}>
          {/* Colour dots: .map() turns each colour into a <button>. */}
          <div className={styles.swatches} role="group" aria-label={`${product.colours.length} colours`}>
            {product.colours.map((colour) => (
              <button
                key={colour.name}
                type="button"
                className={styles.swatch}
                style={{ "--swatch": colour.hex }}
                aria-label={`Preview in ${colour.name}`}
                aria-pressed={colour.name === previewColour.name}
                onMouseEnter={() => setPreviewColour(colour)}
                onFocus={() => setPreviewColour(colour)}
                onClick={() => setPreviewColour(colour)}
              />
            ))}
          </div>
          <Rating value={product.rating} count={product.reviewCount} compact />
        </div>
      </div>
    </article>
  );
}
