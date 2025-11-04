"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import AddToCartButton from "./cart/AddToCartButton";
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

// Memoize product cards to reduce unnecessary re-renders when parent updates
const MemoProductCard = React.memo(ProductCard);

const Product = () => {
	const dispatch = useDispatch();
	const { items: products, loading, error, meta } = useSelector((state) => state.products || { items: [], loading: false, error: null, meta: {} });
	const [page, setPage] = useState(1);
	const PAGE_SIZE = 24;

	useEffect(() => {
		// load first page if store is empty
		if (!products || products.length === 0) {
			dispatch(fetchProducts({ page: 1, pageSize: PAGE_SIZE }));
			setPage(1);
		}
	}, [dispatch]);

	const loadMore = () => {
		const next = (page || 1) + 1;
		setPage(next);
		dispatch(fetchProducts({ page: next, pageSize: PAGE_SIZE }));
	};

		const resolvedProducts = useMemo(() => {
			if (!products || products.length === 0) {
				return [];
			}
			return products.map((product) => {
				// prefer explicit thumbnail, then images array, then single image field
				const imagesArr = Array.isArray(product?.images) && product.images.length > 0
					? product.images
					: product?.thumbnail
					? [product.thumbnail]
					: product?.image
					? [product.image]
					: [];
				const image = imagesArr.length > 0 ? imagesArr[0] : FALLBACK_IMAGE;
				return {
					// prefer Prisma "id" but fall back to legacy Mongo "_id" if present
					id: product?.id || product?._id,
					name: product?.name || "Untitled Product",
					image,
					images: imagesArr,
					description: product?.description || "Handcrafted lighting to elevate your space.",
					price: typeof product?.price === "number" ? product.price : Number(product?.price) || 0,
					materialCare: product?.materialCare || product?.material || product?.care || "Premium bamboo & textiles",
					categoryName: product?.category?.name || "Lighting",
				};
			});
		}, [products]);

	const productSkeletons = useMemo(() => Array.from({ length: 5 }), []);

	return (
		<section id="products" className="p-4 sm:p-6 lg:p-8 ">
       
			<div className="container mx-auto">
												 <h2
													 className="text-center text-2xl sm:text-3xl md:text-4xl mb-8 font-serif font-medium text-black drop-shadow-lg tracking-wide"
												 >
													 Trending Brands
												 </h2>
				<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
					{loading && (!products || products.length === 0) &&
						productSkeletons.map((_, idx) => (
							<div key={idx} className="animate-pulse">
								<div className="aspect-square w-full rounded-2xl bg-gray-200" />
								<div className="mt-4 space-y-2">
									<div className="h-3 w-3/4 rounded bg-gray-200" />
									<div className="h-3 w-1/2 rounded bg-gray-200" />
									<div className="h-3 w-1/3 rounded bg-gray-200" />
								</div>
							</div>
						))}

					{!loading && error && (
						<div className="col-span-full rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-sm text-red-600">
							{error}
						</div>
					)}

					{!loading && !error && resolvedProducts.length === 0 && (
						<div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">
							No products available yet. Add lighting pieces through the admin panel.
						</div>
					)}

										{!loading && !error &&
												resolvedProducts.map((product) => (
														<div key={product.id || product.name} className="group block p-0 sm:p-3 bg-transparent">
																<MemoProductCard product={product} />
														</div>
												))}
				</div>
								{/* Load more button */}
								<div className="mt-6 flex justify-center">
									{(!loading && (!meta || !meta.total || products.length < (meta.total || Infinity))) && (
										<button
											type="button"
											onClick={loadMore}
											disabled={loading}
											className="px-6 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
										>
											{loading ? 'Loading…' : 'Load more'}
										</button>
									)}
								</div>
			</div>
		</section>
	);
};

	function ProductCard({ product }) {
	  const [active, setActive] = useState(0);
	  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image || FALLBACK_IMAGE];

	  const price = Number.isFinite(product.price) ? product.price : Number(product.price) || 0;
	  const displayMRP = product.mrp || Math.round(price * 1.6);
	  const showDiscount = displayMRP > price;
	  const discountPercent = showDiscount ? Math.round(((displayMRP - price) / displayMRP) * 100) : 0;

		return (
			<div>
				<Link href={product.id ? `/products/${product.id}` : '#'} className="block">
					<div className="relative overflow-hidden bg-transparent">
						{showDiscount && (
							<span className="absolute left-3 top-3 z-10   px-3 py-1 text-[11px] font-semibold text-amber-700">Sale</span>
						)}
															{/* Maintain 2:3 aspect ratio for tall images (4000x6000) */}
															<div style={{ aspectRatio: '2 / 3' }} className="w-full">
																<img
																	src={images[active]}
																	alt={product.name}
																	loading="lazy"
																	decoding="async"
																	// fill the container while preserving the full image
																	className="w-full h-full object-contain transition duration-500 group-hover:scale-105"
																	onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
																/>
															</div>

						{/* mobile: overlay name at bottom of image */}
						<div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent px-3 py-3 sm:hidden">
							<h3 className="text-base font-semibold text-white truncate">{product.name}</h3>
						</div>

						{images.length > 1 && (
							<div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
								{images.map((_, idx) => (
									<button key={idx} type="button" onClick={() => setActive(idx)} className={`h-2 w-2 rounded-full ${idx === active ? 'bg-gray-900' : 'bg-white/70'}`} />
								))}
							</div>
						)}
					</div>
				</Link>

				{/* desktop & tablet: show name, price, discount below image; hidden on mobile */}
				<div className="mt-4 text-center px-2 hidden sm:block">
					<h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">{product.name}</h3>
					<div className="mt-2 flex items-center justify-center gap-3">
						<span className="text-base md:text-lg font-bold text-gray-900">{formatCurrency(price)}</span>
						{showDiscount && (
							<>
								<span className="text-xs md:text-sm text-gray-400 line-through">{formatCurrency(displayMRP)}</span>
								<span className="text-xs md:text-sm font-semibold text-red-500">({discountPercent}% Off)</span>
							</>
						)}
					</div>
				</div>

				<div className="mt-4">
					<div className="hidden lg:block">
						<AddToCartButton product={{ productId: product.id }} quantity={1} />
					</div>
				</div>
			</div>
		);
	}

export default Product;
