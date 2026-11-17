/* ==========================================================================
   Header
   --------------------------------------------------------------------------
   Announcement bar, logo, category links, search and the basket button.
   On small screens the links and search move into a slide-down panel.

   React ideas used here:
     • useState    – remembers whether the mobile menu is open, and the
                     text typed into the search box ("controlled input")
     • useCart     – our own hook (CartContext.jsx) for the basket count
     • useNavigate – changes page from code (after a search)
     • useEffect   – closes the mobile menu whenever the page changes
   ========================================================================== */
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { CATEGORIES } from "../data/categories.js";
import { formatPrice, FREE_DELIVERY_THRESHOLD } from "../utils/format.js";
import Icon from "./Icon.jsx";
import styles from "./Header.module.css";

export default function Header() {
  const { itemCount, openDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Which category is showing right now? Used to underline the active link.
  const activeCategory = location.pathname === "/shop" ? searchParams.get("category") ?? "all" : null;

  // Close the mobile menu after moving to another page.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  // Stop the page behind scrolling while the mobile menu is open.
  useEffect(() => {
    document.body.classList.toggle("no-scroll", menuOpen);
  }, [menuOpen]);

  function handleSearch(event) {
    event.preventDefault(); // stop the browser reloading the page
    const term = query.trim();
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : "/shop");
    setQuery("");
  }

  // The search form appears twice (desktop bar + mobile panel), so it's
  // written once here as a small piece of JSX and reused.
  const searchForm = (id) => (
    <form className={styles.search} role="search" onSubmit={handleSearch}>
      <label htmlFor={id} className="visually-hidden">Search products</label>
      <Icon name="search" size={18} />
      <input
        id={id}
        type="search"
        placeholder="Search lamps, chairs, throws…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );

  return (
    <header className={styles.header}>
      <p className={styles.announce}>
        Free UK delivery on orders over {formatPrice(FREE_DELIVERY_THRESHOLD)} · 100-night returns
      </p>

      <div className={`container ${styles.bar}`}>
        <button
          className={styles.iconButton + " " + styles.menuButton}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? "close" : "menu"} size={22} />
        </button>

        <Link to="/" className={styles.logo} aria-label="Hearth & Grain home">
          Hearth <span>&amp;</span> Grain
        </Link>

        {/* The same list of links serves desktop and mobile; CSS decides
            how it looks. On mobile it's hidden until menuOpen is true. */}
        <nav
          id="mobile-nav"
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}
          aria-label="Shop categories"
        >
          <div className={styles.mobileSearch}>{searchForm("search-mobile")}</div>
          <ul className={styles.navList}>
            <li>
              <Link to="/shop" aria-current={activeCategory === "all" ? "page" : undefined}>Shop all</Link>
            </li>
            {CATEGORIES.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/shop?category=${category.id}`}
                  aria-current={activeCategory === category.id ? "page" : undefined}
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <div className={styles.desktopSearch}>{searchForm("search-desktop")}</div>
          <Link to="/shop" className={`${styles.iconButton} ${styles.searchLink}`} aria-label="Search products">
            <Icon name="search" size={21} />
          </Link>

          <button className={styles.basketButton} type="button" onClick={openDrawer}>
            <Icon name="bag" size={22} />
            <span className="visually-hidden">Basket, </span>
            {/* The count bubble only renders when there's something in it. */}
            {itemCount > 0 && <span className={styles.count}>{itemCount}</span>}
            <span className="visually-hidden">{itemCount === 1 ? "item" : "items"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
