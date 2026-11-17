/* ==========================================================================
   Home page
   Sections: hero with a room illustration · categories · new in ·
   feature banner · bestsellers · our promises
   ========================================================================== */
import { Link } from "react-router-dom";
import products from "../data/products.json";
import { CATEGORIES } from "../data/categories.js";
import ProductArt, { ART } from "../components/ProductArt.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Icon from "../components/Icon.jsx";
import { shade } from "../utils/format.js";
import styles from "./Home.module.css";

// Work these lists out once, when the file loads. The product data never
// changes while the app runs, so there's no need to recalculate on render.
const newIn = [...products]                       // copy, so sort() doesn't change the original
  .sort((a, b) => b.addedOn.localeCompare(a.addedOn))
  .slice(0, 4);

const bestsellers = products.filter((p) => p.featured).slice(0, 4);

// How many products are in each category, e.g. { seating: 4, tables: 3 }
const categoryCounts = products.reduce((counts, p) => {
  counts[p.category] = (counts[p.category] ?? 0) + 1;
  return counts;
}, {});

const sofa = products.find((p) => p.slug === "holloway-three-seat-sofa");

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroText}>
            <p className={styles.kicker}>Autumn collection, 2026</p>
            <h1>Furniture made to be lived with</h1>
            <p className={styles.lead}>
              Solid oak, British wool and hand-glazed stoneware. Designed in Bristol,
              built to be used every day, and guaranteed for ten years.
            </p>
            <div className={styles.heroActions}>
              <Link to="/shop" className="btn btn-primary">
                Shop the collection <Icon name="arrow" size={18} />
              </Link>
              <Link to="/shop?sort=newest" className="btn btn-outline">New in</Link>
            </div>
          </div>
          <RoomScene />
        </div>
      </section>

      {/* ---------- CATEGORIES ---------- */}
      <section className="container" aria-labelledby="categories-title">
        <div className={styles.sectionHead}>
          <h2 id="categories-title">Shop by category</h2>
          <Link to="/shop" className="text-link">View all products</Link>
        </div>
        <ul className={styles.categories}>
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <Link to={`/shop?category=${category.id}`} className={styles.categoryTile}>
                <span className={styles.categoryArt}>
                  <ProductArt type={category.art} colour={category.colour} label="" />
                </span>
                <span className={styles.categoryName}>{category.label}</span>
                <span className={styles.categoryCount}>{categoryCounts[category.id]} pieces</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- NEW IN ---------- */}
      <section className="container" aria-labelledby="new-title">
        <div className={styles.sectionHead}>
          <h2 id="new-title">New in</h2>
          <Link to="/shop?sort=newest" className="text-link">See everything new</Link>
        </div>
        <div className={styles.productGrid}>
          {newIn.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ---------- FEATURE BANNER ---------- */}
      <section className="container">
        <div className={styles.feature}>
          <div className={styles.featureText}>
            <p className={styles.kicker}>Just updated</p>
            <h2>The Holloway sofa, now 6 cm deeper</h2>
            <p>
              Our best-loved sofa has deeper seats and feather-free cushions that keep
              their shape. The legs unscrew, so it fits through narrow doorways.
            </p>
            <Link to={`/product/${sofa.slug}`} className="btn btn-dark">
              See the Holloway
            </Link>
          </div>
          <div className={styles.featureArt}>
            <ProductArt type="sofa" colour="#9aa58c" label="Holloway three-seat sofa in Sage" />
          </div>
        </div>
      </section>

      {/* ---------- BESTSELLERS ---------- */}
      <section className="container" aria-labelledby="best-title">
        <div className={styles.sectionHead}>
          <h2 id="best-title">Bestsellers</h2>
          <Link to="/shop?sort=rating" className="text-link">Top rated</Link>
        </div>
        <div className={styles.productGrid}>
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ---------- PROMISES ---------- */}
      <section className="container" aria-label="Our promises">
        <ul className={styles.promises}>
          <li>
            <Icon name="leaf" size={26} />
            <h3>FSC-certified timber</h3>
            <p>Every piece of wood comes from forests managed to replace what's cut.</p>
          </li>
          <li>
            <Icon name="shield" size={26} />
            <h3>10-year frame guarantee</h3>
            <p>If a sofa or chair frame fails in normal use, we'll repair or replace it.</p>
          </li>
          <li>
            <Icon name="returns" size={26} />
            <h3>100-night returns</h3>
            <p>Live with it first. If it isn't right, we'll collect it for free.</p>
          </li>
        </ul>
      </section>
    </>
  );
}

/* --------------------------------------------------------------------------
   RoomScene: the hero illustration.
   It reuses the ART drawings from ProductArt, moved and resized into one
   room with SVG "transform". translate(x, y) moves a drawing; scale(n)
   resizes it.
   -------------------------------------------------------------------------- */
function RoomScene() {
  // Helper: draw one product in a colour at a position and size.
  const place = (type, colour, transform) => (
    <g transform={transform}>
      {ART[type]({ c: colour, d: shade(colour, -0.22), l: shade(colour, 0.18) })}
    </g>
  );

  return (
    <div className={styles.scene}>
      <svg viewBox="0 0 640 520" role="img" aria-label="A living room with a navy sofa, a cobalt cushion, a brass floor lamp, a round mirror and a side table with a vase">
        <rect width="640" height="520" fill="#e6e2d9" />
        <rect y="400" width="640" height="120" fill="#d8d2c5" />
        {place("rug", "#d9cdb6", "translate(40 330) scale(2.3 1.05)")}
        {place("mirror", "#c9a27a", "translate(300 10) scale(0.72)")}
        {place("floorLamp", "#b08d57", "translate(-6 160) scale(1.5)")}
        {place("sideTable", "#e4e0d6", "translate(470 284) scale(0.85)")}
        {place("vase", "#2747d8", "translate(523 222) scale(0.42)")}
        {place("sofa", "#2e3a55", "translate(150 192) scale(1.45)")}
        {place("cushion", "#2747d8", "translate(206 300) scale(0.36)")}
        {place("cushion", "#c8963e", "translate(268 304) scale(0.33)")}
      </svg>
    </div>
  );
}
