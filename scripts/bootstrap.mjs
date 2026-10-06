/**
 * Bigbowl — Supabase bootstrap script
 * -----------------------------------
 * What it does (idempotent, safe to re-run):
 *   1. Creates the public "product-images" storage bucket if missing.
 *   2. Upserts the three catalogue categories.
 *   3. Seeds the sample products (only when the products table is empty).
 *   4. Optionally creates a back-office admin login when ADMIN_EMAIL and
 *      ADMIN_PASSWORD are present in .env.
 *
 * Prerequisites:
 *   - Run supabase/bootstrap.sql in the Supabase SQL Editor FIRST
 *     (tables and RLS policies cannot be created over the REST API).
 *   - Copy .env.example to .env and fill in:
 *       VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:  npm run bootstrap:supabase
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { sampleCategories, sampleProducts } from '../src/data/sampleData.js';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Minimal .env parser — avoids adding a dotenv dependency. */
function loadEnv() {
  const envPath = join(rootDir, '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || line.trim().startsWith('#')) continue;
    const [, key, rawValue] = match;
    if (!process.env[key]) {
      process.env[key] = rawValue.replace(/^["']|["']$/g, '');
    }
  }
}

loadEnv();

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey || url.includes('your-project-ref')) {
  console.error(
    '✖ Missing SUPABASE_URL (or VITE_SUPABASE_URL) / SUPABASE_SERVICE_ROLE_KEY.\n' +
      '  Copy .env.example to .env and fill in your Supabase project values.'
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ok = (msg) => console.log(`✔ ${msg}`);
const info = (msg) => console.log(`  ${msg}`);

async function ensureBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw new Error(`listBuckets: ${error.message}`);
  if (buckets.some((b) => b.id === 'product-images')) {
    ok('Storage bucket "product-images" already exists');
    return;
  }
  const { error: createError } = await supabase.storage.createBucket('product-images', {
    public: true,
  });
  if (createError) throw new Error(`createBucket: ${createError.message}`);
  ok('Created public storage bucket "product-images"');
}

async function seedCategories() {
  const rows = sampleCategories.map(({ id, ...rest }) => rest); // let Postgres assign uuids
  const { data, error } = await supabase
    .from('categories')
    .upsert(rows, { onConflict: 'slug' })
    .select();
  if (error) throw new Error(`categories upsert: ${error.message}`);
  ok(`Categories ready (${data.length})`);
  return data;
}

async function seedProducts(categories) {
  const { count, error: countError } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true });
  if (countError) throw new Error(`products count: ${countError.message}`);

  if (count > 0) {
    ok(`Products table already has ${count} row(s) — skipping seed`);
    return;
  }

  const rows = sampleProducts.map(({ id, category_slug, ...rest }) => ({
    ...rest,
    category_id: categories.find((c) => c.slug === category_slug)?.id ?? null,
  }));

  const { error } = await supabase.from('products').insert(rows);
  if (error) throw new Error(`products insert: ${error.message}`);
  ok(`Seeded ${rows.length} sample products`);
}

async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    info('Skipping admin user creation (set ADMIN_EMAIL and ADMIN_PASSWORD in .env to enable)');
    return;
  }
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    if (/already|exists|duplicate/i.test(error.message)) {
      ok(`Admin user ${email} already exists`);
      return;
    }
    throw new Error(`createUser: ${error.message}`);
  }
  ok(`Created back-office admin login: ${data.user.email}`);
}

async function main() {
  console.log('Bigbowl — Supabase bootstrap\n');
  await ensureBucket();
  const categories = await seedCategories();
  await seedProducts(categories);
  await ensureAdminUser();
  console.log('\nAll done! Next steps:');
  info('1. Make sure supabase/bootstrap.sql has been run in the SQL editor (tables + RLS).');
  info('2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env for the website.');
  info('3. npm run dev → visit /admin/login to manage products.');
}

main().catch((err) => {
  console.error(`\n✖ Bootstrap failed: ${err.message}`);
  console.error('  Hint: run supabase/bootstrap.sql in the Supabase SQL editor first.');
  process.exit(1);
});
