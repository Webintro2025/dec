"use client";

import React from "react";

export default function TrackingDeliveryPage() {
	return (
		<div className="max-w-4xl mx-auto px-4 mt-24 py-10 sm:py-12">
			<h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 sm:mb-8 text-[#AA7C4D]">
				Tracking &amp; Delivery
			</h1>

			<div className="space-y-4 text-sm sm:text-base leading-relaxed text-gray-800">
				<p>
					Post shipping, the details of the order like tracking number and
					information of the shipping agency will be shared via email.
				</p>
				<p>
					Orders can be tracked using the Order ID on the shipping partner&apos;s
					website.
				</p>
				<p>
					Our delivery partners will attempt to deliver the package three (3)
					times before it is returned to us. Please refer to our Return &amp;
					Exchange Policy for more details.
				</p>
				<p>
					Please provide the complete shipping address including zip code and
					mobile number to ensure hassle free delivery.
				</p>
			</div>
		</div>
	);
}

