"use client";

import React from "react";
import GetInTouch from "@/components/GetInTouch";
import Maps from "@/components/Map";

export default function ContactPage() {
	return (
		<div className="bg-white mt-22 min-h-screen">
			{/* Banner / Heading */}
			<div className="w-full bg-gradient-to-r from-[#8c6239] via-[#AA7C4D] to-[#c89158] text-white py-10 md:py-14 mb-6 shadow-md">
				<div className="max-w-5xl mx-auto px-4 flex flex-col items-center text-center">
					<h1 className="text-3xl md:text-4xl font-bold tracking-wide mb-3">
						Contact Us
					</h1>
					
				</div>
			</div>

			{/* Main Contact Section */}
			<div className="max-w-6xl mx-auto px-4 pb-10 space-y-10 md:space-y-12">
				<GetInTouch />

				<div className="mt-6 md:mt-10">
					<h2 className="text-xl md:text-2xl font-semibold mb-4 text-center text-[#b07f52]">
						Find Us on Map
					</h2>
					<Maps />
				</div>
			</div>
		</div>
	);
}

