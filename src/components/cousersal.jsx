"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const DEFAULT_SLIDES = [
	{
		id: 1,
		img: "/SRDECORE/slide1.jpg",
	},
	{
		id: 2,
		img: "/SRDECORE/slide2.jpg",
	},
	{
		id: 3,
		img: "/SRDECORE/slide3.jpg",
	},
];

export default function Cousersal({ slides = DEFAULT_SLIDES }) {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
		return () => clearInterval(t);
	}, [slides.length]);

	const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
	const next = () => setIndex((i) => (i + 1) % slides.length);

	return (
		<div className="w-full max-w-6xl mx-auto px-4">
			<div className="grid grid-cols-1 md:grid-cols-[72px_1fr_320px] gap-4 items-center">
				{/* thumbnails - left column on md+ */}
				<div className="hidden md:flex flex-col gap-3">
					{slides.map((s, i) => (
						<button
							key={s.id}
							onClick={() => setIndex(i)}
							className={`overflow-hidden rounded-md border ${i === index ? 'ring-2 ring-amber-400' : 'border-gray-200'}`}>
							<img src={s.img} alt={`thumb-${i}`} className="w-16 h-16 object-cover" />
						</button>
					))}
				</div>

				{/* main slide */}
				<div className="relative">
					<img src={slides[index].img} alt={`slide-${index}`} className="w-full h-[420px] md:h-[520px] lg:h-[600px] object-cover rounded-md" />

					{/* left arrow */}
					<button onClick={prev} aria-label="previous" className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow">
						<svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
					</button>
					{/* right arrow */}
					<button onClick={next} aria-label="next" className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow">
						<svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
					</button>
				</div>

				{/* promo card on right */}
				<div className="hidden md:flex flex-col items-center justify-center rounded-md bg-white p-6 border border-gray-100 shadow-sm">
					<div className="text-right w-full">
						<p className="text-sm text-gray-500">the</p>
						<h3 className="text-xl font-serif text-[#8b5e34]">NEW DROP</h3>
						<p className="mt-2 text-sm text-gray-600">Plant Pots | Aroma Essentials | Gift Sets</p>
						<div className="mt-4 inline-block border-2 border-[#e7c9aa] p-4">
							<p className="text-sm text-[#b33]">FLAT 50% + EXTRA 15% OFF</p>
							<Link href="/collections/new" className="inline-block mt-3 px-4 py-2 bg-[#e7c9aa] text-white text-sm">SHOP NOW</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

