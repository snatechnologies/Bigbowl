/**
 * Sample catalogue used in two places:
 *  1. As a frontend fallback so the site renders before Supabase is configured.
 *  2. As seed data by scripts/bootstrap.mjs (category_slug is resolved to the
 *     real category id at insert time).
 *
 * Prices are indicative per-unit prices in INR for bulk corporate orders.
 */
export const sampleCategories = [
  {
    id: 'sample-cat-onboarding',
    slug: 'onboarding-gifts',
    name: 'Onboarding Gifts',
    tagline: 'Welcome kits new joinees love',
    description:
      'Curated welcome kits and joining hampers that make day one memorable — drinkware, stationery, apparel and treats, branded for your company.',
    sort_order: 1,
  },
  {
    id: 'sample-cat-festival',
    slug: 'festival-gifts',
    name: 'Festival Gifts',
    tagline: 'Hampers for every celebration',
    description:
      'Diwali, New Year, Pongal and every occasion in between — festive hampers with sweets, snacks and premium merchandise at bulk prices.',
    sort_order: 2,
  },
  {
    id: 'sample-cat-office',
    slug: 'office-utilities',
    name: 'Office Utilities',
    tagline: 'Everyday essentials for your workplace',
    description:
      'Pantry supplies, beverages, stationery and housekeeping essentials from trusted brands — delivered to your office on schedule.',
    sort_order: 3,
  },
];

export const sampleProducts = [
  // ── Onboarding Gifts ────────────────────────────────────────────────
  {
    id: 'sample-prod-1',
    slug: 'welcome-starter-kit',
    name: 'Welcome Starter Kit',
    description:
      'A compact onboarding kit with a branded notebook, pen, sipper bottle and a welcome card — packed in a ready-to-hand-over gift box.',
    price: 499,
    category_slug: 'onboarding-gifts',
    image_url: null,
    is_published: true,
    is_featured: true,
  },
  {
    id: 'sample-prod-2',
    slug: 'premium-joinee-hamper',
    name: 'Premium Joinee Hamper',
    description:
      'Insulated flask, hardbound diary, metal pen, custom t-shirt and chocolates in a magnetic keepsake box with your company branding.',
    price: 1299,
    category_slug: 'onboarding-gifts',
    image_url: null,
    is_published: true,
    is_featured: true,
  },
  {
    id: 'sample-prod-3',
    slug: 'desk-essentials-combo',
    name: 'Desk Essentials Combo',
    description:
      'Everything a new desk needs: mouse pad, desk organizer, sticky notes, premium pen set and a ceramic coffee mug.',
    price: 749,
    category_slug: 'onboarding-gifts',
    image_url: null,
    is_published: true,
    is_featured: false,
  },
  // ── Festival Gifts ──────────────────────────────────────────────────
  {
    id: 'sample-prod-4',
    slug: 'diwali-delight-hamper',
    name: 'Diwali Delight Hamper',
    description:
      'Assorted sweets, dry fruits, 4700BC gourmet popcorn and a pair of decorative diyas in a festive gift box.',
    price: 899,
    category_slug: 'festival-gifts',
    image_url: null,
    is_published: true,
    is_featured: true,
  },
  {
    id: 'sample-prod-5',
    slug: 'gourmet-snack-box',
    name: 'Gourmet Snack Box',
    description:
      'A crowd-pleasing assortment of Hershey’s chocolates, Mondelez cookies and gourmet popcorn — perfect for team celebrations.',
    price: 649,
    category_slug: 'festival-gifts',
    image_url: null,
    is_published: true,
    is_featured: true,
  },
  {
    id: 'sample-prod-6',
    slug: 'festive-premium-crate',
    name: 'Festive Premium Crate',
    description:
      'A wooden crate loaded with premium dry fruits, imported chocolates, scented candles and a personalized greeting card.',
    price: 1799,
    category_slug: 'festival-gifts',
    image_url: null,
    is_published: true,
    is_featured: false,
  },
  // ── Office Utilities ────────────────────────────────────────────────
  {
    id: 'sample-prod-7',
    slug: 'pantry-beverage-pack',
    name: 'Pantry Beverage Pack',
    description:
      'Monthly pantry pack with Coca-Cola beverages, Campa, Sure water bottles and assorted juices for your office pantry.',
    price: 2499,
    category_slug: 'office-utilities',
    image_url: null,
    is_published: true,
    is_featured: false,
  },
  {
    id: 'sample-prod-8',
    slug: 'housekeeping-essentials-kit',
    name: 'Housekeeping Essentials Kit',
    description:
      'P&G cleaning and hygiene essentials — surface cleaners, handwash, tissue rolls and dishwash supplies for office upkeep.',
    price: 1999,
    category_slug: 'office-utilities',
    image_url: null,
    is_published: true,
    is_featured: false,
  },
  {
    id: 'sample-prod-9',
    slug: 'office-stationery-bundle',
    name: 'Office Stationery Bundle',
    description:
      'Bulk stationery bundle: A4 notebooks, pens, markers, staplers, sticky notes and file folders for a 25-member team.',
    price: 1499,
    category_slug: 'office-utilities',
    image_url: null,
    is_published: true,
    is_featured: false,
  },
];
