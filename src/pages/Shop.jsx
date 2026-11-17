/* ==========================================================================
   Shop page: search, filter and sort the catalogue
   --------------------------------------------------------------------------
   All the filter choices are stored in the page ADDRESS ("query string"):

     /shop?category=lighting&maxPrice=200&sort=price-asc

   Why not useState? Because then:
     • the Back button undoes a filter change
     • a filtered view can be bookmarked or sent to a friend
     • links elsewhere (header, home page) can open a ready-filtered shop
   React Router's useSearchParams() reads and writes these values.
   ========================================================================== */
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import products from "../data/products.json";
import { CATEGORIES, getCategoryLabel } from "../data/categories.js";
import ProductCard from "../components/ProductCard.jsx";
import Icon from "../components/Icon.jsx";
import { formatPrice } from "../utils/format.js";
import styles from "./Shop.module.css";

const PRICE_CEILING = Math.ceil(Math.max(...products.map((p) => p.price)) / 50) * 50;

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
];

// Each sort option is a "compare" function for Array.sort().
// It returns a negative number if a should come first, positive if b should.
const SORTERS = {
  featured: (a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating,
  newest: (a, b) => b.addedOn.localeCompare(a.addedOn),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
};

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile filter panel

  // Read the current filters from the address, with sensible defaults.
  const category = searchParams.get("category") ?? "all";
  const query = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "featured";
  const maxPrice = Number(searchParams.get("maxPrice") ?? PRICE_CEILING);
  const inStockOnly = searchParams.get("inStock") === "1";
  const saleOnly = searchParams.get("sale") === "1";

  // Change one filter in the address and keep the others.
  // Passing null (or the default value) removes it, keeping the URL tidy.
  function updateParam(key, value, defaultValue) {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === defaultValue || value === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    // replace: true means typing in search doesn't add a history entry per letter.
    setSearchParams(next, { replace: key === "q" });
  }

  function clearFilters() {
    // Keep only the sort order.
    setSearchParams(sort === "featured" ? {} : { sort });
  }

  /* useMemo: only re-filter when an input actually changes. With 21
     products it barely matters, but it's the habit you'd want with 2,000. */
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products
      .filter((p) => category === "all" || p.category === category)
      .filter((p) => p.price <= maxPrice)
      .filter((p) => !inStockOnly || p.stock > 0)
      .filter((p) => !saleOnly || p.wasPrice !== null)
      .filter((p) => {
        if (!term) return true;
        // Search the name, category, materials and colour names.
        const haystack = [p.name, p.category, p.material, ...p.colours.map((c) => c.name)]
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      })
      .sort(SORTERS[sort] ?? SORTERS.featured);
  }, [category, query, sort, maxPrice, inStockOnly, saleOnly]);

  // Count products per category for the filter list (ignoring the category
  // filter itself, so each count shows what you'd get by choosing it).
  const categoryCounts = useMemo(() => {
    const counts = { all: products.length };
    products.forEach((p) => (counts[p.category] = (counts[p.category] ?? 0) + 1));
    return counts;
  }, []);

  // The "chips" above the results showing which filters are on.
  const activeFilters = [
    category !== "all" && { key: "category", label: getCategoryLabel(category) },
    query && { key: "q", label: `"${query}"` },
    maxPrice < PRICE_CEILING && { key: "maxPrice", label: `Under ${formatPrice(maxPrice)}` },
    inStockOnly && { key: "inStock", label: "In stock" },
    saleOnly && { key: "sale", label: "On sale" },
  ].filter(Boolean); // removes the `false` entries

  // Lock page scrolling while the mobile filter panel is open.
  useEffect(() => {
    document.body.classList.toggle("no-scroll", filtersOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [filtersOpen]);

  const title = query
    ? `Results for "${query}"`
    : category === "all"
      ? "All products"
      : getCategoryLabel(category);

  return (
    <div className="container page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link to="/">Home</Link></li>
          <li aria-current="page">{category === "all" ? "Shop" : getCategoryLabel(category)}</li>
        </ol>
      </nav>

      <div className="page-title" style={{ marginTop: "1rem" }}>
        <h1>{title}</h1>
      </div>

      <div className={styles.layout}>
        {/* ---------- FILTER SIDEBAR ---------- */}
        <aside
          className={`${styles.filters} ${filtersOpen ? styles.filtersOpen : ""}`}
          aria-label="Filters"
        >
          <div className={styles.filtersHead}>
            <h2>Filters</h2>
            <button type="button" className={styles.closeFilters} onClick={() => setFiltersOpen(false)} aria-label="Close filters">
              <Icon name="close" />
            </button>
          </div>

          <div className={styles.group}>
            <label htmlFor="shop-search" className={styles.groupTitle}>Search</label>
            <div className={styles.searchBox}>
              <Icon name="search" size={18} />
              <input
                id="shop-search"
                type="search"
                placeholder="e.g. oak, lamp, wool"
                value={query}
                onChange={(e) => updateParam("q", e.target.value, "")}
              />
            </div>
          </div>

          <fieldset className={styles.group}>
            <legend className={styles.groupTitle}>Category</legend>
            {[{ id: "all", label: "All products" }, ...CATEGORIES].map((c) => (
              <label key={c.id} className={styles.option}>
                <input
                  type="radio"
                  name="category"
                  checked={category === c.id}
                  onChange={() => updateParam("category", c.id, "all")}
                />
                <span>{c.label}</span>
                <span className={styles.optionCount}>{categoryCounts[c.id]}</span>
              </label>
            ))}
          </fieldset>

          <div className={styles.group}>
            <label htmlFor="max-price" className={styles.groupTitle}>
              Maximum price <output htmlFor="max-price">{formatPrice(maxPrice)}</output>
            </label>
            <input
              id="max-price"
              className={styles.range}
              type="range"
              min="50"
              max={PRICE_CEILING}
              step="25"
              value={maxPrice}
              onChange={(e) => updateParam("maxPrice", e.target.value, String(PRICE_CEILING))}
              // Fills the track up to the thumb (see .range in the CSS).
              style={{ "--fill": `${((maxPrice - 50) / (PRICE_CEILING - 50)) * 100}%` }}
            />
            <div className={styles.rangeLabels} aria-hidden="true">
              <span>£50</span>
              <span>{formatPrice(PRICE_CEILING)}</span>
            </div>
          </div>

          <fieldset className={styles.group}>
            <legend className={styles.groupTitle}>Availability</legend>
            <label className={styles.option}>
              <input type="checkbox" checked={inStockOnly} onChange={(e) => updateParam("inStock", e.target.checked ? "1" : null)} />
              <span>In stock only</span>
            </label>
            <label className={styles.option}>
              <input type="checkbox" checked={saleOnly} onChange={(e) => updateParam("sale", e.target.checked ? "1" : null)} />
              <span>On sale</span>
            </label>
          </fieldset>

          {/* Only on mobile: closes the panel to show results. */}
          <button type="button" className={`btn btn-dark btn-block ${styles.showResults}`} onClick={() => setFiltersOpen(false)}>
            Show {results.length} results
          </button>
        </aside>

        {/* ---------- RESULTS ---------- */}
        <section aria-labelledby="results-count">
          <div className={styles.toolbar}>
            <button type="button" className={`btn btn-outline ${styles.filterButton}`} onClick={() => setFiltersOpen(true)}>
              <Icon name="filter" size={18} /> Filters
              {activeFilters.length > 0 && <span className={styles.filterCount}>{activeFilters.length}</span>}
            </button>

            <p id="results-count" className={styles.count} aria-live="polite">
              {results.length} {results.length === 1 ? "product" : "products"}
            </p>

            <div className={styles.sort}>
              <label htmlFor="sort">Sort by</label>
              <select id="sort" value={sort} onChange={(e) => updateParam("sort", e.target.value, "featured")}>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <ul className={styles.chips} aria-label="Active filters">
              {activeFilters.map((f) => (
                <li key={f.key}>
                  <button type="button" className={styles.chip} onClick={() => updateParam(f.key, null)}>
                    {f.label} <Icon name="close" size={14} />
                    <span className="visually-hidden">, remove filter</span>
                  </button>
                </li>
              ))}
              <li>
                <button type="button" className="link-button" onClick={clearFilters}>Clear all</button>
              </li>
            </ul>
          )}

          {results.length > 0 ? (
            <div className={styles.grid}>
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <h2>Nothing matches those filters</h2>
              <p>Try a different search term, or widen the price range.</p>
              <button type="button" className="btn btn-dark" onClick={clearFilters}>Clear all filters</button>
            </div>
          )}
        </section>
      </div>

      {/* Dark backdrop behind the mobile filter panel. */}
      {filtersOpen && <div className={styles.backdrop} onClick={() => setFiltersOpen(false)} />}
    </div>
  );
}
