
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

const services = [
	{
		title: "Bamboo Lighting Design",
		description: "Handcraft warm, organic glows tailored to your space with custom bamboo pendants, chandeliers, and wall pieces made by our artisans.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
				<path d="M42 20C42 30.4934 33.0457 39 22.5 39C11.9543 39 3 30.4934 3 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M45 13C45 23.4934 36.0457 32 25.5 32C14.9543 32 6 23.4934 6 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	{
		title: "Ambient Lighting Concepts",
		description: "Layer mood lighting that elevates living rooms, cafes, and resorts with curated lamp combinations, dimming plans, and accent highlights.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
				<path d="M42 20C42 30.4934 33.0457 39 22.5 39C11.9543 39 3 30.4934 3 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M45 13C45 23.4934 36.0457 32 25.5 32C14.9543 32 6 23.4934 6 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M39 27C39 37.4934 30.0457 46 19.5 46C8.9543 46 0 37.4934 0 27" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform="translate(3 -2)"/>
			</svg>
		)
	},
	{
		title: "Lighting Consultation",
		description: "Get expert guidance on choosing the perfect lamp styles, lumen outputs, and eco-friendly materials for every zone in your project.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
				<path d="M42 20C42 30.4934 33.0457 39 22.5 39C11.9543 39 3 30.4934 3 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M45 13C45 23.4934 36.0457 32 25.5 32C14.9543 32 6 23.4934 6 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	{
		title: "Installation & Aftercare",
		description: "From precise onsite fitting to maintenance plans and quick replacements, we keep your decorative lighting glowing beautifully year-round.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
				<path d="M42 20C42 30.4934 33.0457 39 22.5 39C11.9543 39 3 30.4934 3 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M45 13C45 23.4934 36.0457 32 25.5 32C14.9543 32 6 23.4934 6 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M39 27C39 37.4934 30.0457 46 19.5 46C8.9543 46 0 37.4934 0 27" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform="translate(3 -2)"/>
			</svg>
		)
	}
];

const FALLBACK_IMAGES = [
	"https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
];

const Section1 = () => {
	const [categories, setCategories] = useState([]);
	const [categoriesLoading, setCategoriesLoading] = useState(false);
	const [categoriesError, setCategoriesError] = useState("");
	const carouselRef = useRef(null);

	useEffect(() => {
		let ignore = false;
		const loadCategories = async () => {
			setCategoriesLoading(true);
			setCategoriesError("");
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
					setCategoriesError(err.message || "Something went wrong");
				}
			} finally {
				if (!ignore) {
					setCategoriesLoading(false);
				}
			}
		};

		loadCategories();
		return () => {
			ignore = true;
		};
	}, []);

	const resolvedCategories = useMemo(() => {
		if (!categories || categories.length === 0) {
			return [];
		}
		return categories.map((category, index) => {
			const fallbackImage = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
			const safeImage = Array.isArray(category?.images) && category.images.length > 0
				? category.images[0]
				: fallbackImage;
			return {
				// prefer Prisma id but accept legacy Mongo _id for compatibility
				id: category?.id || category?._id || String(index),
				name: category?.name || "Untitled Category",
				description: category?.description || "Beautiful lighting curated just for you.",
				image: safeImage,
			};
		});
	}, [categories]);

	const scrollCarousel = (direction) => {
		const node = carouselRef.current;
		if (!node) return;
		const amount = node.clientWidth * 0.8;
		node.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
	};

	return (
		<section className="py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-50" style={{fontFamily: 'Poppins, sans-serif'}}>
			<div className="max-w-7xl mx-auto text-center relative z-10">
				<a href="#" className="inline-block text-xs font-semibold tracking-widest text-gray-500 border border-gray-300 rounded-full px-4 py-1 mb-8">
					» WHO WE ARE
				</a>
				
				<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
					Experience <span className="text-amber-600">The Art Of Interior</span> Design
				</h1>
				
				<p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg text-gray-600">
					We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.
				</p>
			</div>

			<div className="max-w-7xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
				{services.map((service, idx) => (
					<div key={idx} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
						<div className="flex justify-between items-start mb-6">
							<h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
							<div className="text-amber-600">
								{service.icon}
							</div>
						</div>
						<p className="text-gray-600 leading-relaxed">
							{service.description}
						</p>
					</div>
				))}
			</div>

			
					
		</section>
	);
};

export default Section1;
