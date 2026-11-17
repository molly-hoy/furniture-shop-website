// The shop's categories. `id` matches the "category" field in products.json.
// `art` and `colour` choose the illustration shown on the home page tiles.
export const CATEGORIES = [
  { id: "seating", label: "Seating", art: "armchair", colour: "#d8cfc0" },
  { id: "tables", label: "Tables", art: "coffeeTable", colour: "#c9a27a" },
  { id: "lighting", label: "Lighting", art: "tableLamp", colour: "#c8963e" },
  { id: "storage", label: "Storage", art: "shelf", colour: "#c9a27a" },
  { id: "textiles", label: "Textiles", art: "throw", colour: "#2747d8" },
  { id: "decor", label: "Decor", art: "vase", colour: "#6b7353" },
];

// Look up a category's label from its id: getCategoryLabel("decor") → "Decor"
export function getCategoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
