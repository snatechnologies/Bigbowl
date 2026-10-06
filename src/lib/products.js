import { supabase, isSupabaseConfigured } from './supabaseClient';
import { sampleCategories, sampleProducts } from '../data/sampleData';

/** Attach category info to sample products so they match the Supabase shape. */
function withCategory(product) {
  const category = sampleCategories.find((c) => c.slug === product.category_slug);
  return { ...product, categories: category ? { name: category.name, slug: category.slug } : null };
}

function logError(context, error) {
  // eslint-disable-next-line no-console
  console.error(`[Bigbowl] ${context}:`, error.message || error);
}

export async function getCategories() {
  if (!isSupabaseConfigured) return sampleCategories;
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    logError('getCategories', error);
    return sampleCategories;
  }
  return data;
}

export async function getCategoryBySlug(slug) {
  if (!isSupabaseConfigured) {
    return sampleCategories.find((c) => c.slug === slug) || null;
  }
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) {
    logError('getCategoryBySlug', error);
    return null;
  }
  return data;
}

export async function getFeaturedProducts() {
  if (!isSupabaseConfigured) {
    return sampleProducts.filter((p) => p.is_featured && p.is_published).map(withCategory);
  }
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false });
  if (error) {
    logError('getFeaturedProducts', error);
    return [];
  }
  return data;
}

export async function getProductsByCategory(categorySlug) {
  if (!isSupabaseConfigured) {
    return sampleProducts
      .filter((p) => p.category_slug === categorySlug && p.is_published)
      .map(withCategory);
  }
  const { data, error } = await supabase
    .from('products')
    .select('*, categories!inner(name, slug)')
    .eq('is_published', true)
    .eq('categories.slug', categorySlug)
    .order('created_at', { ascending: false });
  if (error) {
    logError('getProductsByCategory', error);
    return [];
  }
  return data;
}

export async function getProductBySlug(slug) {
  if (!isSupabaseConfigured) {
    const product = sampleProducts.find((p) => p.slug === slug && p.is_published);
    return product ? withCategory(product) : null;
  }
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  if (error) {
    logError('getProductBySlug', error);
    return null;
  }
  return data;
}

export async function submitEnquiry(enquiry) {
  if (!isSupabaseConfigured) {
    return { ok: false, reason: 'unconfigured' };
  }
  const { error } = await supabase.from('enquiries').insert({
    name: enquiry.name,
    company: enquiry.company || null,
    email: enquiry.email || null,
    phone: enquiry.phone || null,
    product_id: enquiry.productId || null,
    message: enquiry.message,
  });
  if (error) {
    logError('submitEnquiry', error);
    return { ok: false, reason: 'error' };
  }
  return { ok: true };
}

export function formatPrice(value) {
  const number = Number(value || 0);
  return number.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}
