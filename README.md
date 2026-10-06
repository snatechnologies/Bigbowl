# Bigbowl — Corporate Gifts & Office Utilities

Official website for **Saiambro Bigbowl** — corporate onboarding gifts, festival gifts and
office utilities. Design follows the company visiting card: bright yellow and white surfaces,
deep red accents, bold clean typography, and the Bigbowl bowl logo (recreated as SVG in
`src/components/Logo.jsx`).

## Tech stack

- **Frontend:** React 18 + Vite + React Router (plain CSS design system in `src/index.css`)
- **Backend:** Supabase (Postgres + Auth + Storage) via `@supabase/supabase-js`
- **Back office:** protected `/admin` area for product CRUD, publish/feature toggles,
  image uploads and viewing customer enquiries

## Pages

| Route                    | Purpose                                                |
| ------------------------ | ------------------------------------------------------ |
| `/`                      | Home — hero, categories, featured products, brands, CTA |
| `/categories`            | The three catalogue categories                          |
| `/categories/:slug`      | Product listing per category                            |
| `/products/:slug`        | Product details + enquiry form                          |
| `/contact`               | Phone, address + enquiry form                           |
| `/admin/login`           | Back-office sign in (Supabase Auth)                     |
| `/admin`                 | Product management + enquiries (protected)              |
| `/admin/products/new`    | Add product (protected)                                 |
| `/admin/products/:id/edit` | Edit product (protected)                              |

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

> The site works immediately with bundled **sample data** so the design can be
> reviewed before Supabase is connected. The enquiry form will prompt visitors
> to call instead until Supabase is configured.

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **Supabase Dashboard → SQL Editor:** paste and run the whole of
   [`supabase/bootstrap.sql`](supabase/bootstrap.sql). This creates the
   `categories`, `products` and `enquiries` tables, row-level-security
   policies, and the public `product-images` storage bucket.
3. Copy `.env.example` to `.env` and fill in:
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
     (Dashboard → Project Settings → API) — used by the website.
   - `SUPABASE_SERVICE_ROLE_KEY` — used only by the bootstrap script.
     **Never expose it client-side.**
   - Optionally `ADMIN_EMAIL` / `ADMIN_PASSWORD` to create the first
     back-office login automatically.
4. Seed the catalogue and (optionally) create the admin user:

   ```bash
   npm run bootstrap:supabase
   ```

5. Restart `npm run dev` so Vite picks up `.env`, then sign in at
   `/admin/login`.

## How publishing works

- Products have `is_published` (visible on the site) and `is_featured`
  (shown on the homepage) flags, toggled inline from the dashboard.
- Anonymous visitors can only read **published** products (enforced by RLS).
- Enquiries can be submitted by anyone but read only by signed-in admins.
- Product images are uploaded to the public `product-images` storage bucket.

## Contact details (from the visiting card)

- **T Sai Aravind — COO**
- **Phone:** +91 77089 10007
- **Address:** 189, 6th Street, Saraswathi Nagar, Thirumullaivoyal, Chennai 600062
- **Email:** not printed on the card — `src/data/contact.js` keeps `email: null`
  until the business confirms one; set it there and it appears site-wide.

## Project structure

```
├── index.html
├── public/favicon.svg
├── scripts/bootstrap.mjs        # Supabase bootstrap/seed script
├── supabase/bootstrap.sql       # schema, RLS policies, storage bucket, seed categories
└── src
    ├── components/              # Header, Footer, Logo (SVG), ProductCard, EnquiryForm, …
    │   └── admin/               # ProductsTab, EnquiriesTab
    ├── data/                    # brands, contact, sample catalogue (fallback + seed)
    ├── lib/                     # supabase client, product/enquiry data access
    └── pages/                   # Home, Categories, CategoryPage, ProductDetail, Contact
        └── admin/               # AdminLogin, AdminDashboard, AdminProductForm
```
