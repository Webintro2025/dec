"use client";
import React from "react";

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
  {/* stack on mobile, side-by-side on md+ with flexible text and narrower image */}
  <div className="grid grid-cols-1 gap-8 items-center md:flex md:items-center md:gap-12">

          {/* Left: points (no numbers) */}
          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-serif font-semibold text-gray-900">Authentic Bamboo & Rattan Lighting</h3>
            <p className="text-gray-600 max-w-xl">Handcrafted, sustainable, and designed to create a warm, inviting atmosphere — our lighting pieces blend natural beauty with modern styling.</p>

            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <span className="mt-1 text-amber-500">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                </span>
                <p className="text-gray-700">Authentic handcrafted elegance — each bamboo and rattan light is made by skilled artisans, combining tradition and modern aesthetics.</p>
              </li>

              <li className="flex items-start gap-4">
                <span className="mt-1 text-amber-500">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                </span>
                <p className="text-gray-700">Eco-friendly & sustainable materials sourced responsibly — light your space and care for the planet.</p>
              </li>

              <li className="flex items-start gap-4">
                <span className="mt-1 text-amber-500">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                </span>
                <p className="text-gray-700">Warm & inviting ambiance — perfect for cafés, homes, and studios, creating a soft, comfortable glow.</p>
              </li>

              <li className="flex items-start gap-4">
                <span className="mt-1 text-amber-500">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                </span>
                <p className="text-gray-700">Custom designs & sizes available — choose finish, dimensions, and style to match your interior.</p>
              </li>

              <li className="flex items-start gap-4">
                <span className="mt-1 text-amber-500">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                </span>
                <p className="text-gray-700">Durable quality with premium fittings and high-grade bamboo for long-lasting performance.</p>
              </li>

              <li className="flex items-start gap-4">
                <span className="mt-1 text-amber-500">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                </span>
                <p className="text-gray-700">Fast & reliable delivery with careful packaging to ensure safe arrival.</p>
              </li>

              <li className="flex items-start gap-4">
                <span className="mt-1 text-amber-500">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                </span>
                <p className="text-gray-700">Trusted by interior designers & architects for elegance, functionality, and sustainability.</p>
              </li>
            </ul>
          </div>

          {/* Right: image */}
          <div className="w-full md:flex-shrink-0 md:w-[480px] rounded-xl overflow-hidden shadow-lg bg-gray-50 h-96 md:h-[720px]">
            <img src="/IMG_8335.jpg" alt="Bamboo light" className="w-full h-full object-cover" />
          </div>

        </div>
      </div>
    </section>
  );
}
