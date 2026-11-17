// 404 page: shown for any address that doesn't match a route.
import { Link } from "react-router-dom";
import ProductArt from "../components/ProductArt.jsx";

export default function NotFound() {
  return (
    <div className="container page" style={{ display: "grid", justifyItems: "center", textAlign: "center", gap: "1.25rem" }}>
      <div style={{ width: 200 }}>
        <ProductArt type="stool" colour="#c9a27a" label="" />
      </div>
      <h1 style={{ fontSize: "var(--text-2xl)" }}>We couldn't find that page</h1>
      <p style={{ color: "var(--muted)", maxWidth: "40ch" }}>
        It may have moved, or the product may no longer be in our range.
      </p>
      <Link to="/shop" className="btn btn-dark">Browse the shop</Link>
    </div>
  );
}
