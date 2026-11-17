// Rating: five stars filled to the product's rating, e.g. 4.7 out of 5.
// `compact` shows a single star and the number, for small product cards.
import Icon from "./Icon.jsx";

export default function Rating({ value, count, compact = false }) {
  const label = `Rated ${value} out of 5 from ${count} reviews`;

  if (compact) {
    return (
      <p style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.85rem", color: "var(--muted)" }} aria-label={label}>
        <span style={{ color: "var(--ink)" }}><Icon name="star" size={14} filled /></span>
        <span aria-hidden="true">{value.toFixed(1)}</span>
      </p>
    );
  }

  // Full version: 5 star outlines, with filled stars clipped to the rating.
  // A rating of 4.7 → the filled row is 94% wide (4.7 / 5).
  const percent = (value / 5) * 100;
  const stars = Array.from({ length: 5 }, (_, i) => <Icon key={i} name="star" size={18} filled />);

  return (
    <p style={{ display: "flex", alignItems: "center", gap: 10 }} aria-label={label}>
      <span style={{ position: "relative", display: "inline-flex", color: "var(--line)" }} aria-hidden="true">
        {stars}
        <span style={{ position: "absolute", inset: 0, width: `${percent}%`, overflow: "hidden", display: "inline-flex", color: "var(--ink)" }}>
          {stars}
        </span>
      </span>
      <span aria-hidden="true" style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
        {value.toFixed(1)} · {count} reviews
      </span>
    </p>
  );
}
