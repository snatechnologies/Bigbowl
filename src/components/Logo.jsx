/**
 * Bigbowl logo recreated as inline SVG from the visiting card:
 * arched "SAIAMBRO", basket handles, "BIG" in brand red, white "bowl"
 * on the red bowl, and the "BIG DEALS BIG SAVINGS" tagline.
 */
export default function Logo({ width = 280, showTagline = true, className = '' }) {
  const height = showTagline ? 300 : 272;
  return (
    <svg
      className={`bigbowl-logo ${className}`}
      viewBox={`0 0 320 ${height}`}
      width={width}
      height={(width * height) / 320}
      role="img"
      aria-label="Saiambro Bigbowl — Big Deals Big Savings"
    >
      <defs>
        <path id="bb-arch" d="M 58 132 A 102 102 0 0 1 262 132" fill="none" />
      </defs>

      {/* arched SAIAMBRO */}
      <text
        fontFamily="Archivo, Arial, sans-serif"
        fontSize="19"
        fontWeight="800"
        fill="#A61E22"
        letterSpacing="7"
      >
        <textPath href="#bb-arch" startOffset="50%" textAnchor="middle">
          SAIAMBRO
        </textPath>
      </text>

      {/* basket handles */}
      <path
        d="M 76 134 A 84 84 0 0 1 244 134"
        fill="none"
        stroke="#A61E22"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* BIG */}
      <text
        x="160"
        y="126"
        textAnchor="middle"
        fontFamily="Archivo, Arial, sans-serif"
        fontSize="56"
        fontWeight="900"
        fill="#A61E22"
        letterSpacing="2"
      >
        BIG
      </text>

      {/* red bowl */}
      <path d="M 40 140 A 120 120 0 0 0 280 140 Z" fill="#A61E22" />

      {/* bowl */}
      <text
        x="160"
        y="206"
        textAnchor="middle"
        fontFamily="Archivo, Arial, sans-serif"
        fontSize="62"
        fontWeight="900"
        fill="#FFFFFF"
      >
        bowl
      </text>

      {showTagline && (
        <text
          x="160"
          y="238"
          textAnchor="middle"
          fontFamily="Archivo, Arial, sans-serif"
          fontSize="12.5"
          fontWeight="700"
          fill="#FFD100"
          letterSpacing="3.5"
        >
          — BIG DEALS BIG SAVINGS —
        </text>
      )}

      {/* TM mark */}
      <circle cx="290" cy="66" r="12" fill="none" stroke="#A61E22" strokeWidth="1.6" />
      <text
        x="290"
        y="70.5"
        textAnchor="middle"
        fontFamily="Archivo, Arial, sans-serif"
        fontSize="11"
        fontWeight="800"
        fill="#A61E22"
      >
        TM
      </text>
    </svg>
  );
}

/** Small bowl mark used in the header, placeholders and footer. */
export function BowlMark({ size = 40 }) {
  return (
    <svg
      viewBox="0 0 64 60"
      width={size}
      height={(size * 60) / 64}
      role="img"
      aria-label="Bigbowl"
      className="bowl-mark"
    >
      <path
        d="M 19 28 A 13 13 0 0 1 45 28"
        fill="none"
        stroke="#A61E22"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <text
        x="32"
        y="26.5"
        textAnchor="middle"
        fontFamily="Archivo, Arial, sans-serif"
        fontSize="13"
        fontWeight="900"
        fill="#A61E22"
      >
        BIG
      </text>
      <path d="M 8 31 A 24 24 0 0 0 56 31 Z" fill="#A61E22" />
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontFamily="Archivo, Arial, sans-serif"
        fontSize="12"
        fontWeight="900"
        fill="#FFFFFF"
      >
        bowl
      </text>
    </svg>
  );
}
