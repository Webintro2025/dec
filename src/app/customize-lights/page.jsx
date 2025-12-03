"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";



export default function Page() {
  const [images, setImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(`/api/gallery?page=${page}`);
        const data = await res.json();
        setImages(data.images || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setImages([]);
        setTotalPages(1);
      }
    }
    fetchImages();
  }, [page]);

  const openLightbox = (idx) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(-1);
  const showPrev = useCallback(() => setLightboxIndex((i) => (i > 0 ? i - 1 : images.length - 1)), [images.length]);
  const showNext = useCallback(() => setLightboxIndex((i) => (i < images.length - 1 ? i + 1 : 0)), [images.length]);

  useEffect(() => {
    if (lightboxIndex === -1) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, showNext, showPrev]);


  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-7xl mx-auto px-4 pt-28 pb-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Customize Lights</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((img, idx) => (
            <div key={img.id || img.url} className="relative rounded-xl overflow-hidden bg-white shadow-2xl group">
              <button
                onClick={() => openLightbox(idx)}
                className="w-full h-full block text-left"
                aria-label={`Open image ${idx + 1}`}>
                <div className="w-full h-[260px] sm:h-[320px] md:h-[400px] lg:h-[600px] flex items-center justify-center bg-gray-100">
                  <img
                    src={img.url}
                    alt={`Light ${idx + 1}`}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105 group-hover:brightness-90"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 flex items-end p-4 pointer-events-none">
                  <div className="w-full flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition">
                    <div>
                      <div className="text-sm font-semibold drop-shadow">Lights</div>
                      <div className="text-xs opacity-90 drop-shadow">Click to view</div>
                    </div>
                    <div className="hidden sm:block">
                      <ZoomIn className="w-6 h-6 drop-shadow" />
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 mx-2 rounded ${page === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Previous
          </button>
          <span className="px-4 py-2 mx-2">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 mx-2 rounded ${page === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Next
          </button>
        </div>
      </section>

      {lightboxIndex > -1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" onClick={closeLightbox} />
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <button
              onClick={closeLightbox}
              className="absolute top-3 right-3 z-20 rounded-full bg-white/10 hover:bg-white/20 p-2 text-white"
              aria-label="Close">
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={showPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 hover:bg-white/20 p-2 text-white"
              aria-label="Previous">
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={images[lightboxIndex]?.url}
              alt={`Light ${lightboxIndex + 1}`}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded"
            />

            <button
              onClick={showNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 hover:bg-white/20 p-2 text-white"
              aria-label="Next">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}