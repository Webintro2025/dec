"use client";

import React, { useEffect, useState } from "react";

const HomeBanner = () => {
	// Desktop slider images
	const images = ["/banner1.jpg"];
	const [index, setIndex] = useState(0);
	const [mode, setMode] = useState("desktop"); // 'mobile' | 'tablet' | 'desktop'

	useEffect(() => {
		const t = setInterval(() => setIndex((i) => (i + 1) % images.length), 5000);
		return () => clearInterval(t);
	}, [images.length]);

	// detect breakpoint client-side to render correct image per range
	useEffect(() => {
		function updateMode() {
			const w = window.innerWidth;
			// mobile: <768
			if (w < 768) setMode("mobile");
			// tablet ranges: 768-900 AND 1024-1200 (user requested tab.png for these sizes)
			else if ((w >= 768 && w <= 900) || (w >= 1024 && w <= 1200)) setMode("tablet");
			// everything else: desktop
			else setMode("desktop");
		}
		updateMode();
		window.addEventListener("resize", updateMode);
		return () => window.removeEventListener("resize", updateMode);
	}, []);

	return (
		<section className="relative overflow-hidden">

			{mode === "mobile" && (
				<img
					src="/mobilebanner.jpg"
					alt="mobile banner"
					className="w-full h-[75vh] object-cover block z-0"
				/>
			)}

			{mode === "tablet" && (
				<img
					src="/tabview.png"
					alt="tablet banner"
					className="w-full h-[70vh] object-cover block z-0"
				/>
			)}

			{mode === "desktop" && (
				<div className="relative w-full min-h-[90vh]">
					{images.map((src, i) => (
						<div
							key={src}
							aria-hidden={i !== index}
							className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${
								i === index ? "opacity-100 z-10" : "opacity-0 z-0"
							}`}
							style={{ backgroundImage: `url('${src}')` }}
						/>
					))}
				</div>
			)}


			{mode === "desktop" && (
			<div className="desktop-indicators absolute bottom-6 left-1/2 -translate-x-1/2 gap-2 z-20">
				{images.map((_, i) => (
					<button
						key={i}
						type="button"
						aria-label={`Go to slide ${i + 1}`}
						onClick={() => setIndex(i)}
						className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-amber-400" : "w-4 bg-white/60"}`}
					/>
				))}
			</div>
			)}

		</section>
	);
};

export default HomeBanner;

