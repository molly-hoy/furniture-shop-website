/* ==========================================================================
   Small helper functions used across the app.
   "Pure" functions like these take inputs and return outputs with no side
   effects, which makes them easy to reuse and to test.
   ========================================================================== */

// Formats a number as British pounds: 1290 → "£1,290", 42.5 → "£42.50".
// Intl.NumberFormat is built into every modern browser.
const poundsWhole = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});
const poundsPence = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function formatPrice(amount) {
  // Show pence only when there are some (e.g. delivery at £9.95).
  return Number.isInteger(amount) ? poundsWhole.format(amount) : poundsPence.format(amount);
}

// Makes a hex colour lighter (amount > 0) or darker (amount < 0).
// shade("#c9a27a", -0.2) → a 20% darker brown. Used to give the product
// illustrations light and shadow from a single colour.
export function shade(hex, amount) {
  const value = parseInt(hex.slice(1), 16);
  const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  const target = amount < 0 ? 0 : 255;
  const mixed = channels.map((c) => Math.round(c + (target - c) * Math.abs(amount)));
  return "#" + mixed.map((c) => c.toString(16).padStart(2, "0")).join("");
}

// "3" → "3 items", "1" → "1 item"
export function pluralise(count, word) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

// Shop-wide delivery rules, kept in one place so the basket, drawer and
// checkout always agree.
export const FREE_DELIVERY_THRESHOLD = 150;
export const STANDARD_DELIVERY = 9.95;
