import React from 'react';
import prisma from '../../../../src/app/utils/prisma';
import Link from 'next/link';

export default async function CategoryPage({ params, searchParams }) {
  const { id } = params || {};
  // keyset pagination: use a cursor (base64 JSON { createdAt, id }) instead of page numbers
  const cursorParam = searchParams?.cursor || null;
  const prevParam = searchParams?.prev || null;
  const PAGE_SIZE = 48; // modest page size for faster responses

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <p className="mt-4 text-gray-600">The category you are looking for does not exist.</p>
          <div className="mt-6">
            <Link href="/" className="text-amber-600 underline">Back to home</Link>
          </div>
        </div>
      </main>
    );
  }

  // Simple per-instance cache to reduce repeated DB work for hot category pages.
  if (!global.__categoryCache) global.__categoryCache = new Map();
  const CACHE_TTL_MS = 30 * 1000; // 30s cache
  const cacheKey = `cat:${id}:cursor:${cursorParam || 'first'}:s:${PAGE_SIZE}`;
  const cached = global.__categoryCache.get(cacheKey);
  let rawProducts;

  const encodeCursor = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64');
  const decodeCursor = (str) => {
    try {
      return JSON.parse(Buffer.from(str, 'base64').toString('utf8'));
    } catch (e) {
      return null;
    }
  };

  if (cached && cached.expires > Date.now()) {
    rawProducts = cached.data;
    console.log(`[category] cache HIT ${cacheKey} (expires in ${Math.round((cached.expires - Date.now())/1000)}s)`);
  } else {
    const qStart = Date.now();

    // Build keyset filter when cursorParam provided (descending order)
    const where = { categoryId: category.id };
    if (cursorParam) {
      const c = decodeCursor(cursorParam);
      if (c && c.createdAt && c.id) {
        Object.assign(where, {
          OR: [
            { createdAt: { lt: new Date(c.createdAt) } },
            { createdAt: new Date(c.createdAt), id: { lt: c.id } },
          ],
        });
      }
    }

    rawProducts = await prisma.product.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: PAGE_SIZE + 1,
      select: { id: true, name: true, images: true, price: true, materialCare: true, createdAt: true, category: true },
    });
    const qDur = Date.now() - qStart;
    try {
      global.__categoryCache.set(cacheKey, { expires: Date.now() + CACHE_TTL_MS, data: rawProducts });
      if (global.__categoryCache.size > 200) {
        const k = global.__categoryCache.keys().next().value;
        global.__categoryCache.delete(k);
      }
    } catch (err) {
      // ignore cache errors
    }
    console.log(`[category] query for ${cacheKey} took ${qDur}ms, returned ${Array.isArray(rawProducts) ? rawProducts.length : 0}`);
  }

  const hasNext = rawProducts.length > PAGE_SIZE;
  const products = hasNext ? rawProducts.slice(0, PAGE_SIZE) : rawProducts;

  return (
    <main className="mt-20 lg:mt-28">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold">{category.name}</h1>
          {category.description && <p className="mt-2 text-gray-600">{category.description}</p>}
        </header>

        {(!products || products.length === 0) ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">
            No products found for this category.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => {
              const src = Array.isArray(product.images) && product.images[0] ? product.images[0] : '/fallback.jpg';
              return (
                <Link
                  key={product.id || product._id}
                  href={`/products/${product.id || product._id}`}
                  className="block bg-transparent p-0 sm:p-3 focus:outline-none"
                >
                  <div className="relative w-full overflow-hidden bg-transparent">
                    {/* Use src attribute only in this server component to avoid passing event handlers */}
                    {/* Use aspect-ratio matching 4000x6000 (2:3) so tall images render proportionally */}
                    <div style={{ aspectRatio: '2 / 3' }} className="w-full">
                      <img
                        src={src}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-contain object-center"
                      />
                    </div>

                    {/* Mobile: overlay product name at bottom of the square image */}
                    <div className="absolute left-0 right-0 bottom-0 sm:hidden bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                      <h3 className="text-sm font-semibold text-white truncate">{product.name}</h3>
                    </div>
                  </div>

                  {/* Desktop/tablet: show details below image; hidden on mobile */}
                  <div className="mt-0 sm:mt-4 hidden sm:block">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400">{product.category?.name || 'Category'}</p>
                    <h3 className="mt-1 text-sm font-medium text-gray-800 truncate">{product.name}</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-base font-bold text-gray-900">₹{Math.round(product.price || 0)}</span>
                      <span className="text-xs text-gray-500">{product.materialCare || ''}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {(hasNext || cursorParam) && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href={cursorParam ? `/categories/${id}?cursor=${encodeURIComponent(prevParam || '')}` : '#'}
              className={`px-4 py-2 rounded-md border ${!cursorParam ? 'opacity-50 pointer-events-none' : ''}`}
            >
              Previous
            </Link>
            <span className="text-sm text-gray-600">{cursorParam ? 'Older items' : 'Latest items'}</span>
            {hasNext ? (
              (() => {
                const last = products[products.length - 1];
                const nextCursor = encodeCursor({ createdAt: last.createdAt, id: last.id || last._id });
                const prevForNext = cursorParam || '';
                const href = `/categories/${id}?cursor=${encodeURIComponent(nextCursor)}${prevForNext ? `&prev=${encodeURIComponent(prevForNext)}` : ''}`;
                return (
                  <Link href={href} className="px-4 py-2 rounded-md border">Next</Link>
                );
              })()
            ) : (
              <button className="px-4 py-2 rounded-md border opacity-50 pointer-events-none">Next</button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
