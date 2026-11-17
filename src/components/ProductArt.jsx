/* ==========================================================================
   ProductArt
   --------------------------------------------------------------------------
   Draws each product as a simple SVG illustration in the colour the
   customer has chosen. Picking a different colour swatch on the product
   page redraws the drawing instantly. That's React state at work.

   Why illustrations instead of photos? They give the whole shop one
   consistent visual style, load instantly, and recolour live. If you later
   add real photos, give a product an "image" field in products.json and
   this component will show the photo instead.

   Every drawing sits on the same 240 × 240 grid, so they line up neatly
   in the product grid. Each one receives three colours:
     c = the chosen colour, d = a darker shade, l = a lighter shade.
   ========================================================================== */
import { shade } from "../utils/format.js";

// Fixed colours used across drawings.
const WOOD = "#9b7650";
const METAL = "#2b2b2c";
const LEAF = "#5f7a4f";
const LEAF_LIGHT = "#86a06f";
const BOOKS = ["#2747d8", "#c8963e", "#6b7353", "#a65a3a", "#d8cfc0", "#2b2b2c"];

// A soft shadow on the "floor" under standing furniture.
const Shadow = ({ rx = 88 }) => <ellipse cx="120" cy="204" rx={rx} ry="7" fill="rgb(28 29 31 / 0.08)" />;

/* Each entry is a function: given the colours, it returns the SVG shapes.
   Exported so the home page can arrange several into a room scene. */
export const ART = {
  chair: ({ c, d, l }) => (
    <>
      <Shadow rx={60} />
      <rect x="82" y="50" width="8" height="152" rx="3" fill={d} />
      <rect x="150" y="50" width="8" height="152" rx="3" fill={d} />
      <rect x="106" y="56" width="6" height="64" fill={d} />
      <rect x="128" y="56" width="6" height="64" fill={d} />
      <rect x="76" y="40" width="88" height="18" rx="9" fill={c} />
      <rect x="68" y="116" width="104" height="16" rx="5" fill={c} />
      <rect x="68" y="116" width="104" height="5" rx="2.5" fill={l} />
      <rect x="74" y="130" width="10" height="72" rx="3" fill={c} />
      <rect x="156" y="130" width="10" height="72" rx="3" fill={c} />
    </>
  ),

  armchair: ({ c, d, l }) => (
    <>
      <Shadow rx={84} />
      <rect x="58" y="172" width="8" height="30" rx="2" fill={WOOD} />
      <rect x="174" y="172" width="8" height="30" rx="2" fill={WOOD} />
      <rect x="56" y="58" width="128" height="92" rx="34" fill={d} />
      <rect x="50" y="124" width="140" height="44" rx="16" fill={l} />
      <rect x="36" y="100" width="34" height="76" rx="15" fill={c} />
      <rect x="170" y="100" width="34" height="76" rx="15" fill={c} />
    </>
  ),

  sofa: ({ c, d, l }) => (
    <>
      <Shadow rx={104} />
      <rect x="30" y="172" width="8" height="26" rx="2" fill={WOOD} />
      <rect x="202" y="172" width="8" height="26" rx="2" fill={WOOD} />
      <rect x="26" y="76" width="188" height="74" rx="22" fill={d} />
      <line x1="120" y1="84" x2="120" y2="132" stroke={shade(d, -0.2)} strokeWidth="2" />
      <rect x="30" y="128" width="180" height="40" rx="12" fill={l} />
      <line x1="120" y1="132" x2="120" y2="166" stroke={c} strokeWidth="2" />
      <rect x="12" y="110" width="32" height="66" rx="13" fill={c} />
      <rect x="196" y="110" width="32" height="66" rx="13" fill={c} />
    </>
  ),

  stool: ({ c, d, l }) => (
    <>
      <Shadow rx={56} />
      <line x1="86" y1="112" x2="72" y2="200" stroke={c} strokeWidth="9" strokeLinecap="round" />
      <line x1="154" y1="112" x2="168" y2="200" stroke={c} strokeWidth="9" strokeLinecap="round" />
      <line x1="120" y1="116" x2="120" y2="204" stroke={d} strokeWidth="9" strokeLinecap="round" />
      <line x1="80" y1="168" x2="160" y2="168" stroke={d} strokeWidth="5" />
      <ellipse cx="120" cy="110" rx="56" ry="14" fill={c} />
      <ellipse cx="120" cy="104" rx="56" ry="14" fill={l} />
    </>
  ),

  coffeeTable: ({ c, d, l }) => (
    <>
      <Shadow rx={100} />
      <rect x="40" y="122" width="6" height="78" fill={METAL} />
      <rect x="194" y="122" width="6" height="78" fill={METAL} />
      <rect x="40" y="166" width="160" height="8" rx="2" fill={d} />
      <rect x="26" y="112" width="188" height="14" rx="6" fill={c} />
      <rect x="26" y="106" width="188" height="10" rx="5" fill={l} />
    </>
  ),

  diningTable: ({ c, d, l }) => (
    <>
      <Shadow rx={106} />
      <line x1="62" y1="104" x2="52" y2="196" stroke={d} strokeWidth="9" strokeLinecap="round" />
      <line x1="178" y1="104" x2="188" y2="196" stroke={d} strokeWidth="9" strokeLinecap="round" />
      <line x1="42" y1="104" x2="26" y2="200" stroke={c} strokeWidth="10" strokeLinecap="round" />
      <line x1="198" y1="104" x2="214" y2="200" stroke={c} strokeWidth="10" strokeLinecap="round" />
      <rect x="14" y="92" width="212" height="16" rx="4" fill={c} />
      <rect x="14" y="92" width="212" height="5" rx="2.5" fill={l} />
    </>
  ),

  sideTable: ({ c, d, l }) => (
    <>
      <Shadow rx={60} />
      <ellipse cx="120" cy="196" rx="32" ry="8" fill={d} />
      <polygon points="104,104 136,104 130,150 148,196 92,196 110,150" fill={c} />
      <ellipse cx="120" cy="102" rx="64" ry="15" fill={d} />
      <ellipse cx="120" cy="94" rx="64" ry="15" fill={l} />
    </>
  ),

  tableLamp: ({ c, d, l }) => (
    <>
      <Shadow rx={56} />
      <ellipse cx="120" cy="130" rx="70" ry="20" fill="rgb(255 226 160 / 0.25)" />
      <path d="M96 198 C78 198 74 168 90 150 C98 140 100 132 110 128 L130 128 C140 132 142 140 150 150 C166 168 162 198 144 198 Z" fill={c} />
      <path d="M100 150 C96 160 96 176 102 186" stroke={l} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
      <rect x="116" y="120" width="8" height="10" fill={d} />
      <polygon points="84,58 156,58 178,122 62,122" fill="#f1ebde" />
      <g stroke="#ddd3c0" strokeWidth="1.5">
        <line x1="98" y1="58" x2="84" y2="122" />
        <line x1="112" y1="58" x2="106" y2="122" />
        <line x1="128" y1="58" x2="134" y2="122" />
        <line x1="142" y1="58" x2="156" y2="122" />
      </g>
    </>
  ),

  floorLamp: ({ c, d }) => (
    <>
      <Shadow rx={70} />
      <polygon points="152,86 208,86 232,200 128,200" fill="rgb(255 226 160 / 0.22)" />
      <ellipse cx="70" cy="198" rx="30" ry="8" fill="#d9d4cc" />
      <ellipse cx="70" cy="194" rx="30" ry="8" fill="#e8e4dd" />
      <path d="M70 194 L70 70 Q70 30 122 30 Q172 30 180 64" stroke={c} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M152 86 Q156 58 180 58 Q204 58 208 86 Z" fill={c} />
      <ellipse cx="180" cy="86" rx="28" ry="5" fill={d} />
    </>
  ),

  pendant: ({ c, d }) => (
    <>
      <polygon points="62,146 178,146 226,226 14,226" fill="rgb(255 226 160 / 0.25)" />
      <line x1="120" y1="0" x2="120" y2="88" stroke={METAL} strokeWidth="3" />
      <rect x="112" y="80" width="16" height="12" rx="3" fill={d} />
      <path d="M46 142 Q50 88 120 88 Q190 88 194 142 Z" fill={c} />
      <ellipse cx="120" cy="142" rx="74" ry="10" fill={d} />
      <ellipse cx="120" cy="143" rx="18" ry="6" fill="#fff3d6" />
    </>
  ),

  shelf: ({ c, d }) => {
    // Books on each shelf: [x, width, height] — drawn in a loop below.
    const rows = [
      [[74, 10, 30], [86, 8, 26], [96, 12, 31], [110, 9, 22], [146, 18, 14]],
      [[74, 22, 12], [124, 9, 31], [135, 11, 28], [148, 8, 25], [158, 10, 30]],
      [[74, 9, 28], [85, 9, 31], [96, 11, 24], [140, 20, 20]],
      [[100, 10, 30], [112, 8, 27], [122, 12, 31], [136, 9, 24], [147, 10, 29]],
    ];
    const shelfTops = [66, 108, 150, 194];
    return (
      <>
        <Shadow rx={70} />
        <rect x="64" y="24" width="112" height="178" fill={shade(c, 0.35)} />
        {rows.map((books, row) =>
          books.map(([x, w, h], i) => (
            <rect key={`${row}-${i}`} x={x} y={shelfTops[row] - h} width={w} height={h} rx="1.5" fill={BOOKS[(row + i) % BOOKS.length]} />
          ))
        )}
        <rect x="58" y="22" width="8" height="182" fill={d} />
        <rect x="174" y="22" width="8" height="182" fill={d} />
        {[22, ...shelfTops].map((y) => (
          <rect key={y} x="58" y={y} width="124" height="7" fill={c} />
        ))}
      </>
    );
  },

  wallShelf: ({ c, d, l }) => (
    <>
      <rect x="34" y="142" width="172" height="8" fill="rgb(28 29 31 / 0.07)" />
      <rect x="60" y="94" width="14" height="34" rx="1.5" fill={BOOKS[0]} />
      <rect x="76" y="100" width="12" height="28" rx="1.5" fill={BOOKS[1]} />
      <rect x="90" y="96" width="10" height="32" rx="1.5" fill={BOOKS[4]} />
      <path d="M150 128 L146 104 L176 104 L172 128 Z" fill="#b8694a" />
      <ellipse cx="152" cy="94" rx="8" ry="14" fill={LEAF} transform="rotate(-25 152 94)" />
      <ellipse cx="170" cy="92" rx="8" ry="15" fill={LEAF_LIGHT} transform="rotate(22 170 92)" />
      <ellipse cx="161" cy="86" rx="7" ry="16" fill={LEAF} />
      <circle cx="122" cy="118" r="10" fill={shade(c, 0.4)} />
      <rect x="30" y="128" width="180" height="14" rx="2" fill={c} />
      <rect x="30" y="128" width="180" height="4" rx="2" fill={l} />
      <rect x="30" y="138" width="180" height="4" rx="2" fill={d} />
    </>
  ),

  basket: ({ c, d }) => (
    <>
      <Shadow rx={66} />
      <path d="M56 94 L184 94 L172 196 Q120 204 68 196 Z" fill={c} />
      <g stroke={d} strokeWidth="2" opacity="0.55">
        {[110, 124, 138, 152, 166, 180].map((y) => (
          <line key={y} x1={58 + (y - 94) * 0.11} y1={y} x2={182 - (y - 94) * 0.11} y2={y} />
        ))}
      </g>
      <ellipse cx="120" cy="94" rx="64" ry="11" fill={d} />
      <rect x="102" y="104" width="36" height="9" rx="4.5" fill={d} />
    </>
  ),

  throw: ({ c, d }) => (
    <>
      <Shadow rx={92} />
      <rect x="40" y="168" width="160" height="32" rx="12" fill={c} />
      <rect x="46" y="138" width="150" height="34" rx="12" fill={d} />
      <rect x="40" y="106" width="160" height="36" rx="12" fill={c} />
      <rect x="40" y="118" width="160" height="7" fill="rgb(255 255 255 / 0.5)" />
      <rect x="40" y="180" width="160" height="7" fill="rgb(255 255 255 / 0.5)" />
      <g stroke={c} strokeWidth="2" strokeLinecap="round">
        {[110, 116, 122, 128, 134].map((y) => (
          <line key={y} x1="200" y1={y} x2="208" y2={y + 1} />
        ))}
      </g>
    </>
  ),

  cushion: ({ c, d, l }) => (
    <>
      <Shadow rx={74} />
      <path d="M48 64 Q120 50 192 64 Q204 130 192 194 Q120 208 48 194 Q36 130 48 64 Z" fill={c} />
      <path d="M62 78 Q120 68 178 78" stroke={l} strokeWidth="3" fill="none" opacity="0.7" />
      <path d="M48 64 Q120 50 192 64 Q204 130 192 194 Q120 208 48 194 Q36 130 48 64 Z" fill="none" stroke={d} strokeWidth="3" />
      <path d="M120 70 Q114 130 120 190" stroke={d} strokeWidth="1.5" fill="none" opacity="0.4" />
    </>
  ),

  rug: ({ c, d }) => (
    <>
      <polygon points="40,118 200,118 232,194 8,194" fill={c} />
      <g stroke={d} strokeWidth="2.5" opacity="0.35">
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={40 + i * 16} y1="118" x2={8 + i * 22.4} y2="194" />
        ))}
      </g>
      <g stroke={shade(c, 0.3)} strokeWidth="2" strokeLinecap="round">
        {Array.from({ length: 23 }, (_, i) => (
          <line key={i} x1={12 + i * 9.8} y1="195" x2={12 + i * 9.8} y2="203" />
        ))}
      </g>
    </>
  ),

  vase: ({ c, d, l }) => (
    <>
      <Shadow rx={48} />
      <path d="M118 42 Q110 20 96 8" stroke="#8a7a5c" strokeWidth="2.5" fill="none" />
      <path d="M122 42 Q130 16 148 6" stroke="#8a7a5c" strokeWidth="2.5" fill="none" />
      <circle cx="96" cy="8" r="5" fill="#c8a96b" />
      <circle cx="148" cy="6" r="5" fill="#c8a96b" />
      <circle cx="106" cy="20" r="4" fill="#c8a96b" />
      <path d="M104 40 L136 40 L134 62 C172 84 178 152 150 196 L90 196 C62 152 68 84 106 62 Z" fill={c} />
      <path d="M92 100 C84 126 86 156 96 178" stroke={l} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.5" />
      <ellipse cx="120" cy="40" rx="16" ry="4" fill={d} />
    </>
  ),

  mug: ({ c, d, l }) => (
    <>
      <Shadow rx={78} />
      {/* back mug */}
      <path d="M180 120 q20 0 20 18 q0 18 -20 18" stroke={d} strokeWidth="8" fill="none" />
      <rect x="122" y="102" width="60" height="80" rx="10" fill={d} />
      <ellipse cx="152" cy="102" rx="30" ry="6" fill={shade(d, -0.25)} />
      {/* front mug */}
      <path d="M120 136 q24 0 24 22 q0 22 -24 22" stroke={c} strokeWidth="10" fill="none" />
      <rect x="54" y="118" width="68" height="86" rx="11" fill={c} />
      <ellipse cx="88" cy="118" rx="34" ry="7" fill={d} />
      <rect x="64" y="132" width="6" height="56" rx="3" fill={l} opacity="0.6" />
    </>
  ),

  mirror: ({ c, d }) => (
    <>
      <line x1="120" y1="0" x2="120" y2="30" stroke={METAL} strokeWidth="2" />
      <circle cx="122" cy="122" r="86" fill="rgb(28 29 31 / 0.06)" />
      <circle cx="120" cy="118" r="86" fill={c} />
      <circle cx="120" cy="118" r="76" fill="#dfe5e9" />
      <path d="M70 70 L170 170" stroke="#fff" strokeWidth="22" opacity="0.6" />
      <path d="M98 56 L184 142" stroke="#fff" strokeWidth="8" opacity="0.5" />
      <circle cx="120" cy="118" r="76" fill="none" stroke={d} strokeWidth="3" />
    </>
  ),

  planter: ({ c, d, l }) => (
    <>
      <Shadow rx={62} />
      <ellipse cx="96" cy="66" rx="12" ry="34" fill={LEAF} transform="rotate(-28 96 66)" />
      <ellipse cx="146" cy="62" rx="12" ry="36" fill={LEAF} transform="rotate(26 146 62)" />
      <ellipse cx="120" cy="52" rx="11" ry="40" fill={LEAF_LIGHT} />
      <ellipse cx="76" cy="92" rx="10" ry="26" fill={LEAF_LIGHT} transform="rotate(-58 76 92)" />
      <ellipse cx="166" cy="90" rx="10" ry="26" fill={LEAF_LIGHT} transform="rotate(58 166 90)" />
      <ellipse cx="120" cy="196" rx="54" ry="9" fill={d} />
      <polygon points="72,112 168,112 158,192 82,192" fill={c} />
      <rect x="64" y="100" width="112" height="18" rx="3" fill={l} />
    </>
  ),

  bowl: ({ c, d, l }) => (
    <>
      <Shadow rx={86} />
      <circle cx="98" cy="108" r="17" fill="#e2b93b" />
      <circle cx="132" cy="104" r="19" fill="#c96b3a" />
      <circle cx="158" cy="112" r="14" fill="#e2b93b" />
      <ellipse cx="120" cy="120" rx="82" ry="17" fill={d} />
      <path d="M38 120 Q120 128 202 120 Q198 188 120 194 Q42 188 38 120 Z" fill={c} />
      <path d="M38 120 Q120 128 202 120" stroke={l} strokeWidth="3" fill="none" />
      <path d="M60 140 Q70 170 100 182" stroke={l} strokeWidth="4" fill="none" opacity="0.4" strokeLinecap="round" />
    </>
  ),
};

/* --------------------------------------------------------------------------
   The component itself.
   Props:
     type   – which drawing, e.g. "chair" (from product.art)
     colour – hex colour to draw it in
     label  – text read by screen readers, e.g. "Rowan dining chair in Black"
     image  – optional photo URL; if given, shows the photo instead
   -------------------------------------------------------------------------- */
export default function ProductArt({ type, colour, label, image }) {
  if (image) {
    return <img src={image} alt={label} />;
  }

  const draw = ART[type];
  if (!draw) return null;

  const colours = { c: colour, d: shade(colour, -0.22), l: shade(colour, 0.18) };

  return (
    // role="img" + aria-label makes the whole drawing read as one image.
    <svg viewBox="0 0 240 240" role="img" aria-label={label}>
      {draw(colours)}
    </svg>
  );
}
