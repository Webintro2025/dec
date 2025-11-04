"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const DEFAULT_SLIDES = [
	{ id: 1, img: "/slide1.png" },
	
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
		<div className="w-full mx-auto px-0 overflow-hidden">
			<div className="grid grid-cols-1 gap-0 items-center">
				{/* main slide (full-bleed) */}
				<div className="relative overflow-hidden ">
					<img src={slides[index].img} alt={`slide-${index}`} className="block w-screen max-w-none  object-contain" />

					{/* left arrow */}
					<button onClick={prev} aria-label="previous" className="flex absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow">
						<svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
					</button>
					{/* right arrow */}
					<button onClick={next} aria-label="next" className="flex absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow">
						<svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
					</button>
				</div>

			</div>
		</div>
	);
}

