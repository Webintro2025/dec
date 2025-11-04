"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/productsSlice";

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

const CategoryWiseDist = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products || { items: [], loading: false, error: null });
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    if (!products || products.length === 0) {
      // lazy-load products via redux thunk
      // request a modest page to avoid loading the entire collection into the client
      dispatch(fetchProducts({ page: 1, pageSize: 48 }));
    }
  }, [dispatch, products]);

  useEffect(() => {
    let ignore = false;
    const loadCategories = async () => {
      setCategoryLoading(true);
      setCategoryError("");
      try {
        const response = await fetch("/api/categories");
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.message || "Unable to fetch categories");
        }
        if (!ignore) {
          setCategories(Array.isArray(payload?.categories) ? payload.categories : []);
        }
      } catch (err) {
        if (!ignore) {
          setCategoryError(err.message || "Something went wrong");
        }
      } finally {
        if (!ignore) {
          setCategoryLoading(false);
        }
      }
    };

    loadCategories();
    return () => {
      ignore = true;
    };
  }, []);

  const filters = useMemo(() => {
    const base = [{ key: "all", label: "All" }];
    const mapped = categories.map((category) => ({
      // prefer Prisma id but accept legacy Mongo _id for compatibility
      key: String(category?.id || category?._id || ""),
      label: category?.name || "Untitled",
    }));
    return base.concat(mapped);
  }, [categories]);

  useEffect(() => {
    if (activeFilter !== "all" && !filters.some((filter) => filter.key === activeFilter)) {
      setActiveFilter("all");
    }
  }, [filters, activeFilter]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") {
      return products;
    }
    return products.filter((product) => {
      const productCategoryId =
        product?.category?.id ||
        product?.category?._id ||
        (typeof product?.category === "string" ? product.category : null);
      return String(productCategoryId || "").toLowerCase() === activeFilter.toLowerCase();
    });
  }, [activeFilter, products]);

  const selectedCategory = useMemo(() => {
    if (activeFilter === "all") {
      return null;
    }
    return categories.find((category) => String(category?.id || category?._id) === activeFilter);
  }, [categories, activeFilter]);

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-amber-50/30 py-20 sm:py-28"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-yellow-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full border border-amber-200 px-4 py-1 text-xs font-semibold tracking-widest text-amber-600">
            » CURATED BY APPLICATION
          </span>
          <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Discover By <span className="text-amber-600">Category</span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Browse lighting concepts tailored for residential, commercial, and landscape environments. Pick a category to see pieces designed for that space.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            // Keep 'All' as a client-side filter button; other categories should navigate to their category page
            if (filter.key === 'all') {
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-amber-600 text-white shadow-md"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-amber-400 hover:text-amber-600"
                  }`}
                >
                  {filter.label.toUpperCase()}
                </button>
              );
            }

            return (
              <Link
                key={filter.key}
                href={`/categories/${filter.key}`}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-all inline-block ${
                  isActive
                    ? "bg-amber-600 text-white shadow-md"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-amber-400 hover:text-amber-600"
                }`}
              >
                {filter.label.toUpperCase()}
              </Link>
            );
          })}
          {categoryLoading && (
            <span className="text-xs text-gray-400">Loading categories…</span>
          )}
          {!categoryLoading && categoryError && (
            <span className="text-xs text-red-500">{categoryError}</span>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-2xl bg-white p-4 shadow-sm lg:border lg:border-gray-100">
                <div className="aspect-square w-full rounded-xl bg-gray-200" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                  <div className="h-3 w-2/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">
            {selectedCategory
              ? `No products available in ${selectedCategory?.name || "this category"} yet. Check back soon!`
              : "No products available yet. Check back soon!"}
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              const productId = product?.id || product?._id;
              const categoryName = product?.category?.name || "Lighting";
              // prefer thumbnail, then single image field, then images[0], otherwise fallback
              const imagesArr = Array.isArray(product?.images) && product.images.length > 0
                ? product.images
                : product?.thumbnail
                ? [product.thumbnail]
                : product?.image
                ? [product.image]
                : [];
              const image = imagesArr.length > 0 ? imagesArr[0] : FALLBACK_IMAGE;
              const price = typeof product?.price === "number" ? product.price : Number(product?.price) || 0;
              const description = product?.description || "Thoughtfully crafted lighting accent.";

              return (
                <Link
                  key={productId || product.name}
                  href={productId ? `/products/${productId}` : "#"}
                  className="group block bg-transparent p-0 sm:p-3 transition focus:outline-none"
                  aria-disabled={!productId}
                  tabIndex={productId ? 0 : -1}
                >
                  <div className="relative w-full overflow-hidden bg-transparent">
                    <img
                      src={image}
                      alt={product?.name || "Product image"}
                      loading="lazy"
                      decoding="async"
                      // show full image without cropping
                      className="w-full h-auto object-contain transition duration-500 group-hover:scale-105"
                    />
                    {(() => {
                      const showBadge = !/ceiling\s*lights/i.test((categoryName || "").toString());
                      return showBadge ? (
                        <span className="hidden sm:inline-block absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-gray-700">
                          {categoryName.toUpperCase()}
                        </span>
                      ) : null;
                    })()}

                    {/* Mobile: overlay name at bottom of image */}
                    <div className="absolute left-0 right-0 bottom-0 sm:hidden bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                      <h3 className="text-sm font-semibold text-white truncate">{product?.name || "Untitled Product"}</h3>
                    </div>
                  </div>

                  {/* Details: visible on sm+ only */}
                  <div className="hidden sm:block mt-4 space-y-2">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">{product?.name || "Untitled Product"}</h3>
                    <p className="line-clamp-2 text-xs sm:text-xs md:text-sm text-gray-500">{description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base md:text-lg font-bold text-gray-900">{formatCurrency(price)}</span>
                      <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-amber-600">Explore</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryWiseDist;
