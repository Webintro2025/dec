"use client";

import React from "react";

const faqs = [
	{
		category: "General",
		items: [
			{
				q: "How to purchase an item from the website?",
				a: `To purchase an item on Ekotique. Deco:

1. Find an item you want to purchase on www.Ekotique. Deco.com
2. Choose the options you want for that item like colour, size, quantity etc.
3. Click 'Add to cart'.
4. Optionally, change the quantity from 0 to 1 or more as required. Shipping, taxes and discounts are calculated at checkout.
5. Click CHECKOUT.
6. If you're signed in, confirm your shipping address and payment details. If you're checking out as a guest, fill in your contact information, shipping and payment details.
7. Review your order to make sure all information is correct.
8. Click Continue to shipping, then Continue to payment.

If you have any questions about an item or order, you can message us or email us using the details in the Connect section at the bottom of the website.`,
			},
			{
				q: "Are your products available on any other website?",
				a: "We are a trusted e-commerce brand in partnership with India's leading online selling platforms like Amazon, Myntra, Ajio, Flipkart etc. However, beware of fake or fraud websites that offer our products at very low prices and never fulfil orders. Ekotique. Deco has not authorised any such portal to sell its products on its behalf.",
			},
		],
	},
	{
		category: "Products",
		items: [
			{
				q: "My basket was received in an uneven form, how can I fix it?",
				a: "While we ensure that you receive your product with perfect packaging, things can happen during shipping. To fix an uneven basket, simply submerge it in water for some time and then let it dry. It will regain its original shape.",
			},
			{
				q: "I received products with variations in them, is that ok?",
				a: "Yes. At Ekotique. Deco, we believe in handmade products. Every product is skillfully made by talented artisans and slight variations are expected. These small differences add to the handmade charm of each piece.",
			},
			{
				q: "My carpet is curved/bent after placing on the floor, how will it fit?",
				a: "Our carpets are rolled and shipped for easier delivery, so they might have some creases after unpacking. Just lay the carpet flat on the floor and give it some time to adjust to the new space. The creases will ease out.",
			},
			{
				q: "How to maintain my natural products?",
				a: "For baskets, simply dust them with a soft brush or wipe with a damp cloth. Do not scrub over prints as this may damage them. For carpets, dry-clean them, dust them regularly with a soft brush and spot clean only.",
			},
		],
	},
	{
		category: "Bulk Sellers",
		items: [
			{
				q: "Do you supply in bulk and give bulk offers?",
				a: "Yes. We supply all the products on the website in bulk. Larger quantities are eligible for special bulk deals.",
			},
		],
	},
	{
		category: "Shipping & Returns",
		items: [
			{
				q: "Do you ship all across India and internationally?",
				a: "Yes. We ship pan India and internationally through our courier partners.",
			},
			{
				q: "What are your shipping charges for international orders?",
				a: "Shipping charges depend on the buyer's location. Any customs or other duties charged by the destination country are to be borne by the buyer. Please contact us for detailed information.",
			},
			{
				q: "How are orders placed on the website delivered to me?",
				a: "All orders placed on the website are dispatched via trusted courier partners like Delhivery, BlueDart, DHL etc. Once an order is placed, you will usually receive it within 7–10 working days, excluding business holidays.",
			},
			{
				q: "What payment terms can you accept?",
				a: "We accept all major modes of payment including PayPal, Visa, Mastercard, Discover and American Express.",
			},
			{
				q: "How do I return a product?",
				a: "We offer 'No Questions Asked' returns. If you are not happy with your product, contact us via Email or Message Us and we will handle the return according to our return policy.",
			},
			{
				q: "Can I cancel my order?",
				a: "Orders can be cancelled (in whole or in part) only before they are dispatched. Once the order is dispatched, it cannot be cancelled and our regular return/exchange policies will apply.",
			},
			{
				q: "Is my purchase eligible for exchange, and how do I exchange my purchase?",
				a: `If you would like an exchange:

1. Contact us within 2 days of delivery to schedule a reverse pick-up. We will initiate an exchange request for you.
2. Please ensure that the product is unused and the original tags are intact.
3. Once the unused product is received at our warehouse, we will dispatch the exchanged product depending on its availability.
4. If the required product is not in stock, we will issue a full refund to the original source of payment.`,
			},
			{
				q: "When will I receive the exchanged item?",
				a: `A reverse pick-up is usually done in 2–3 business days after placing a request, and then the product is shipped back to us. The entire process of receiving it at our warehouse takes about 7–10 business days.

Once the product reaches us, an exchange is processed and the new product is delivered to the original address in about 3–5 business days.

In case of a broken or damaged product, we will ship a fresh item to the original address within 48 hours of receiving a complaint. Standard delivery time of 3–5 business days then applies.

If a product or package is lost or misplaced, we will investigate the issue internally and with our courier partners. Internal issues are usually resolved within 48 hours. Issues from our courier partner's side are typically resolved within 3–5 business days.`,
			},
			{
				q: "When will I receive my refund/credit note?",
				a: "After all verifications related to your order are complete, we issue a credit note within 7 working days. The credit note is usually valid for up to 6 months and can be used for future orders on the website.",
			},
		],
	},
];

const FAQPage = () => {
	return (
		<div className="max-w-4xl mx-auto px-4 py-10 mt-24 sm:py-12">
			<h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-[#AA7C4D]">Frequently Asked Questions</h1>
			<div className="space-y-8">
				{faqs.map((section) => (
					<div key={section.category}>
						<h2 className="text-xl font-semibold mb-3 text-[#AA7C4D]">CATEGORY: {section.category}</h2>
						<div className="space-y-4">
							{section.items.map((item, index) => (
								<div key={index} className="border border-gray-200 rounded-md p-4 bg-white">
									<p className="font-medium mb-2">{item.q}</p>
									<p className="text-sm whitespace-pre-line leading-relaxed">{item.a}</p>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default FAQPage;

