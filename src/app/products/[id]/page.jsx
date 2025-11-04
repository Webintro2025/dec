import React from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/products/ProductGallery";
import Link from "next/link";
import ProductPurchaseActions from "@/components/products/ProductPurchaseActions";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80";

const formatCurrency = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Rs. 0";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

async function fetchProduct(id) {
  // Make a server-side fetch using configured NEXT_PUBLIC_SITE_URL or localhost
  // In production (Vercel) avoid hard-coding localhost. If NEXT_PUBLIC_SITE_URL is provided use it,
  // otherwise use a relative path so the request is made to the current host (works on Vercel).
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const url = `${baseUrl}/api/products?id=${encodeURIComponent(id)}`;
  const response = await fetch(url, { cache: 'no-store' });

  // Temporary debug logging to help diagnose production vs local differences.
  // This will appear in server logs on Vercel for the page request.
  try {
    // avoid logging large bodies; log URL and status only
    // eslint-disable-next-line no-console
    console.log('[product-page] fetchProduct url=', url, ' status=', response.status);
  } catch (e) {
    // ignore logging errors
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load product");
  }

  const payload = await response.json();
  return payload?.product || null;
}

const ProductDetailPage = async ({ params }) => {
  // await params for compatibility with Next.js dynamic APIs
  const resolvedParams = await params;
  const productId = resolvedParams?.id;

  if (!productId) {
    notFound();
  }

  let product;
  try {
    product = await fetchProduct(productId);
  } catch (err) {
    console.error("Unable to fetch product", err);
    product = null;
  }

  if (!product) {
    notFound();
  }

  // Build image URLs using the image proxy endpoint so the browser fetches
  // images separately (better for caching and avoids huge JSON payloads)
  const headerList = await headers();
  const protocol = headerList.get('x-forwarded-proto') || 'http';
  const host = headerList.get('x-forwarded-host') || headerList.get('host') || 'localhost:3000';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;

  const images = (Array.isArray(product?.images) && product.images.length > 0)
    ? product.images.map((_, i) => `${baseUrl}/api/products/image?productId=${productId}&index=${i}`)
    : [FALLBACK_IMAGE];
  const categoryName = product?.category?.name || "Lighting";
  const description = product?.description || "";
  const materialCare =
    product?.materialCare ||
    product?.material ||
    product?.care ||
    "Premium bamboo & textiles";
  const dimension = product?.dimension || "Standard dimensions available on request.";
  const price = typeof product?.price === "number" ? product.price : Number(product?.price) || 0;
  const quantity = typeof product?.quantity === "number" ? product.quantity : Number(product?.quantity) || 0;
  const productName = product?.name || "Decorative Lighting";
  const breadcrumbs = ["Home", categoryName, productName];
  const cartProductPayload = {
    productId,
    name: productName,
    price,
    images,
  };

  return (
  <section className="px-4 py-12 sm:px-6 mt-10 sm:mt-12 lg:mt-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.4em] text-gray-400">
          {breadcrumbs.map((item, index) => (
            <span key={item}>
              {index > 0 && <span className="px-2 text-gray-300">/</span>}
              {index === 0 ? (
                <Link href="/" className={index === breadcrumbs.length - 1 ? "text-gray-500" : "text-gray-400"}>
                  {item}
                </Link>
              ) : (
                <span className={index === breadcrumbs.length - 1 ? "text-gray-500" : "text-gray-400"}>{item}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="mt-6 grid gap-12 md:grid-cols-[1fr_0.9fr] lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <ProductGallery images={images} productName={productName} />

            
          </div>

          <div className="space-y-8 md:sticky md:top-20">
            <header className=" bg-white pt-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">{productName}</h1>
                  <p className="mt-2 text-sm text-gray-500">Handwoven lighting accent crafted by local artisans.</p>
                </div>
                {/* wishlist removed: UI simplified */}
              </div>
              <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1 text-amber-600">★★★★★</span>
                <span>4.8 · 32 reviews</span>
              </div>
              <div className="mt-6 flex items-baseline gap-3">
                <p className="text-3xl font-semibold text-gray-900">{formatCurrency(price)}</p>
                <span className="text-xs text-gray-500">Inclusive of all taxes</span>
              </div>
           
            </header>

            <div className=" bg-white ">
              <p className="text-sm font-semibold text-gray-900">Place Your Order</p>
                <div className="mt-4">
                  <ProductPurchaseActions product={cartProductPayload} stock={quantity} />
                </div>
            </div>

     
            <div className="space-y-3">
              {/* Hide native markers and style custom disclosure icon */}
              <style>{`
                /* hide default disclosure marker in WebKit/Blink/Firefox */
                details summary::-webkit-details-marker { display: none; }
                details summary::marker { display: none; }
                /* animate our inline svg when details open */
                details[open] summary .chev { transform: rotate(180deg); }
              `}</style>

              <details className="group">
                <summary className="cursor-pointer text-sm font-semibold text-gray-900 flex items-center justify-between">
                  <span>Specifications</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="chev ml-2 h-4 w-4 text-gray-500 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-gray-600">Handwoven bamboo weave, powder coated frame, warm LED compatible fittings.</p>
              </details>

              {description && (
                <details className="group">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-900 flex items-center justify-between">
                    <span>Description</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="chev ml-2 h-4 w-4 text-gray-500 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 whitespace-pre-line">{description}</p>
                </details>
              )}

              <details className="group">
                <summary className="cursor-pointer text-sm font-semibold text-gray-900 flex items-center justify-between">
                  <span>Material & Care</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="chev ml-2 h-4 w-4 text-gray-500 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-gray-600">{materialCare}</p>
              </details>

              <details className="group">
                <summary className="cursor-pointer text-sm font-semibold text-gray-900 flex items-center justify-between">
                  <span>Shipping & Returns</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="chev ml-2 h-4 w-4 text-gray-500 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-gray-600">Dispatched within 48 hours. Eligible for complementary installation and 10-day easy return on manufacturing defects.</p>
              </details>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="">
                <p className="text-xs uppercase text-gray-500">Material & Care</p>
                <p className="mt-2 text-sm text-gray-700">{materialCare}</p>
              </div>
              <div className="">
                <p className="text-xs uppercase text-gray-500">Dimensions</p>
                <p className="mt-2 text-sm text-gray-700">{dimension}</p>
              </div>
              <div className=" sm:col-span-1">
                <p className="text-xs uppercase text-gray-500">Category</p>
                <p className="mt-2 text-sm text-gray-700">{categoryName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
