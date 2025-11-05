"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DEFAULT_SERVICES = [
	{
		id: 'hamper',
		title: 'Rattan Cafe Lamp',
		subtitle: 'Rattan cafe lamps — warm ambient lighting for cafes and homes',
		image: '/img5.2.png',
		cta: { label: 'SHOP NOW', href: '/collections/hamper-baskets' },
	},
	{
		id: 'bulk',
		title: 'Chandelier Light — Bamboo with Acrylic',
		subtitle: 'Elegant chandelier lights combining bamboo and acrylic accents',
		image: '/img3.1.png',
		cta: { label: 'LEARN MORE', href: '/contact' },
	},
	{
		id: 'gift-wrapping',
		title: 'Chandelier Lamp',
		subtitle: 'Statement chandelier lamps to elevate your interior',
		image: '/img1.png',
		cta: { label: 'ORDER NOW', href: '/services/gift-wrapping' },
	},
	{
		id: 'express',
		title: 'Hanging Light',
		subtitle: 'Versatile hanging lights — functional and decorative',
		image: '/img2.png',
		cta: { label: 'CHECK', href: '/shipping' },
	},
];

export default function AllServices({ services = DEFAULT_SERVICES }) {
	const router = useRouter();

	function handleServiceClick(e) {
		// always try to scroll to element with id 'products' if present on current page
		try {
			if (typeof window !== 'undefined' && window.location.pathname === '/') {
				e.preventDefault();
				const el = document.getElementById('products');
				if (el) {
					el.scrollIntoView({ behavior: 'smooth', block: 'start' });
					return;
				}
			}
		} catch (err) {
			// ignore and fall back to navigation
		}

		// otherwise navigate to home with hash so the page will jump/scroll there
		e.preventDefault();
		router.push('/#products');
	}

	return (
		<section className="py-12 bg-gray-50">
			<div className="max-w-6xl mx-auto px-4">
				<header className="text-center mb-10">
					<h2 className="text-3xl font-serif text-[#8b5e34]">OUR SERVICES</h2>
					<p className="mt-2 text-sm text-gray-600">A Basket for every special occasion</p>
				</header>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-start">
					{services.map((s) => (
						<article key={s.id} className="bg-transparent rounded-xl overflow-hidden relative">
							<div className="relative">
								<img
									src={s.image}
									alt={s.title}
									className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover"
								/>

								{/* Clickable overlay: clicking the card scrolls/jumps to #products */}
								<button
									onClick={handleServiceClick}
									aria-label={`View products for ${s.title}`}
									className="absolute inset-0 w-full h-full bg-transparent"
								/>

								{/* Title overlay only, transparent background */}
								<div className="absolute inset-0 flex items-end justify-center pointer-events-none">
									<div className="w-full bg-gradient-to-t from-black/60 to-transparent py-3 text-center">
										<h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white tracking-wider uppercase">{s.title}</h3>
									</div>
								</div>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

