"use client";
import React from "react";
import { Star } from "lucide-react";
import Link from "next/link";

export default function Testimonial() {
  const reviews = [
    {
      name: "Dr Bush",
      title: "LOVE at installation",
      text: "It is by far the most beautiful piece of furniture at my home and the team so seamlessly assisted an urgent purchase and delivered it sooner than expected",
      img: "/mobile.jpg",
      rating: 5,
    },
    {
      name: "Anita Sharma",
      title: "Stunning finish",
      text: "The fixture exceeded our expectations — excellent craftsmanship and fast delivery. Highly recommended!",
      img: "/user.png",
      rating: 5,
    },
    {
      name: "Ravi Kumar",
      title: "Perfect fit",
      text: "Custom measurements were handled professionally and the end result is beautiful. Great communication throughout.",
      img: "/img1.png",
      rating: 5,
    },
  ];

  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 4000);
    return () => clearInterval(t);
  }, [paused]);

  const prev = () => setIndex((i) => (i - 1 + reviews.length) % reviews.length);
  const next = () => setIndex((i) => (i + 1) % reviews.length);

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-center text-xl tracking-widest text-gray-600 mb-6">CUSTOMER'S <span className="text-amber-600">LOVE</span></h3>

        <div
          className="relative bg-rose-50 rounded-2xl p-6 sm:p-8 md:p-12 overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* slides */}
          <div className="relative min-h-[220px]">
            {reviews.map((r, i) => (
              <article
                key={r.name}
                aria-hidden={i !== index}
                className={`transition-opacity duration-700 ease-in-out absolute inset-0 p-4 sm:p-6 md:p-8 ${i === index ? "opacity-100 relative" : "opacity-0 pointer-events-none"}`}
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg mx-auto md:mx-0">
                      <img src={r.img} alt={r.name} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center md:justify-start gap-3 sm:gap-4">
                      <h4 className="text-lg font-semibold">{r.name}</h4>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: r.rating }).map((_, j) => (
                          <Star key={j} className="w-4 h-4 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <h5 className="mt-4 text-base font-semibold">{r.title}</h5>
                    <p className="mt-2 text-gray-700">{r.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* controls */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <button onClick={prev} aria-label="Previous" className="bg-white/80 hover:bg-white p-2 rounded-full shadow">
              ‹
            </button>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <button onClick={next} aria-label="Next" className="bg-white/80 hover:bg-white p-2 rounded-full shadow">
              ›
            </button>
          </div>

          {/* dots */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to review ${i + 1}`}
                className={`w-3 h-3 rounded-full ${i === index ? "bg-amber-600" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
