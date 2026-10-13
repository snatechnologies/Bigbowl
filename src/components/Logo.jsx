/**
 * Bigbowl logo, recreated as inline SVG from the visiting card:
 * arched "SAIAMBRO" riding the basket handle, "BIG" in brand red,
 * a red bowl with white "bowl" letters, the yellow "BIG DEALS BIG
 * SAVINGS" tagline inside the bowl, and the TM mark.
 *
 * The geometry mirrors the card artwork so the tagline always stays
 * inside the bowl: `textLength` pins every line of text to a fixed
 * width, so font fallbacks can never push the tagline outside.
 */
export default function Logo({ width = 280, showTagline = true, className = '' }) {
  // viewBox 34 52 252 216 — matches the card artwork's proportions
  return (
    <svg
      className={`bigbowl-logo ${className}`}
      viewBox="34 52 252 216"
      width={width}
      height={(width * 216) / 252}
      role="img"
      aria-label="Saiambro Bigbowl — Big Deals Big Savings"
    >
      <defs>
        <path id="bb-arch" d="M 88 150 A 72 72 0 0 1 232 150" fill="none" />
      </defs>

      {/* basket handle — yellow keyline under the brand-red stroke */}
      <path
        d="M 90 170 L 90 150 A 70 70 0 0 1 230 150 L 230 170"
        fill="none"
        stroke="#FFD100"
        strokeWidth="15"
      />
      <path
        d="M 90 170 L 90 150 A 70 70 0 0 1 230 150 L 230 170"
        fill="none"
        stroke="#A61E22"
        strokeWidth="10"
      />

      {/* arched SAIAMBRO overlapping the top of the handle */}
      <text
        fontFamily="Archivo, Arial, sans-serif"
        fontSize="15"
        fontWeight="800"
        fill="#A61E22"
        stroke="#FFD100"
        strokeWidth="0.6"
        paintOrder="stroke"
        letterSpacing="2.5"
      >
        <textPath href="#bb-arch" startOffset="50%" textAnchor="middle">
          SAIAMBRO
        </textPath>
      </text>

      {/* BIG */}
      <text
        x="160"
        y="138"
        textAnchor="middle"
        fontFamily="Archivo, Arial, sans-serif"
        fontSize="48"
        fontWeight="900"
        fill="#A61E22"
        stroke="#FFD100"
        strokeWidth="1.4"
        paintOrder="stroke"
        textLength="72"
        lengthAdjust="spacingAndGlyphs"
      >
        BIG
      </text>

      {/* TM mark */}
      <circle cx="254" cy="130" r="9.3" fill="none" stroke="#A61E22" strokeWidth="1.5" />
      <text
        x="254"
        y="133"
        textAnchor="middle"
        fontFamily="Archivo, Arial, sans-serif"
        fontSize="7.5"
        fontWeight="800"
        fill="#A61E22"
      >
        TM
      </text>

      {/* red bowl — steep sides and a slightly flattened bottom, as on the card */}
      <path
        d="M 42 150 C 42 214, 66 252, 112 260 L 208 260 C 254 252, 278 214, 278 150 Z"
        fill="#A61E22"
        stroke="#FFD100"
        strokeWidth="2.5"
      />

      {/* bowl */}
      <text
        x="160"
        y="227"
        textAnchor="middle"
        fontFamily="Archivo, Arial, sans-serif"
        fontSize="84"
        fontWeight="900"
        fill="#FFFFFF"
        textLength="170"
        lengthAdjust="spacingAndGlyphs"
      >
        bowl
      </text>

      {/* tagline — pinned to a fixed width so it always fits inside the bowl */}
      {showTagline && (
        <>
          <line x1="76" y1="239" x2="92" y2="239" stroke="#FFD100" strokeWidth="1.6" />
          <text
            x="160"
            y="242.5"
            textAnchor="middle"
            fontFamily="Archivo, Arial, sans-serif"
            fontSize="9.5"
            fontWeight="700"
            fill="#FFD100"
            textLength="130"
            lengthAdjust="spacingAndGlyphs"
          >
            BIG DEALS BIG SAVINGS
          </text>
          <line x1="228" y1="239" x2="244" y2="239" stroke="#FFD100" strokeWidth="1.6" />
        </>
      )}
    </svg>
  );
}

/**
 * The authentic Bigbowl logo extracted from the visiting card artwork
 * (scripts/extract-logo.py → public/assets/bigbowl-logo.png), with a
 * transparent background so it works on any surface.
 *
 * Pass either `width` or `height` — the other dimension follows the
 * artwork's aspect ratio. Use `variant="light"` on dark backgrounds
 * (e.g. the footer): brand red becomes brand yellow.
 */
export function LogoImage({ width, height, variant = 'default', className = '' }) {
  const w = width ?? Math.round(((height ?? 242) * 438) / 354);
  const h = height ?? Math.round((width * 354) / 438);
  const src =
    variant === 'light' ? '/assets/bigbowl-logo-light.png' : '/assets/bigbowl-logo.png';
  return (
    <img
      src={src}
      width={w}
      height={h}
      className={`bigbowl-logo-image ${className}`}
      alt="Saiambro Bigbowl — Big Deals Big Savings"
      loading="lazy"
      decoding="async"
    />
  );
}
