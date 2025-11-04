"use client";

import React, { useEffect, useMemo, useState } from "react";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80";

const ProductGallery = ({ images = [], productName = "Product" }) => {
  const galleryImages = useMemo(() => {
    if (!Array.isArray(images)) {
      return [FALLBACK_IMAGE];
    }
    const cleaned = images.filter((item) => typeof item === "string" && item.trim().length > 0);
    return cleaned.length > 0 ? cleaned : [FALLBACK_IMAGE];
  }, [images]);

  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const [modalImage, setModalImage] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);

  useEffect(() => {
    setActiveImage(galleryImages[0]);
  }, [galleryImages]);

  const handleThumbnailHover = (image) => {
    setActiveImage(image);
  };

  const handleOpenModal = (image) => {
    const idx = galleryImages.indexOf(image);
    setModalIndex(idx >= 0 ? idx : 0);
    setModalImage(galleryImages[idx >= 0 ? idx : 0]);
  };

  const handleCloseModal = () => {
    setModalImage(null);
  };

  const showPrev = () => {
    if (!galleryImages || galleryImages.length === 0) return;
    const nextIdx = (modalIndex - 1 + galleryImages.length) % galleryImages.length;
    setModalIndex(nextIdx);
    setModalImage(galleryImages[nextIdx]);
  };

  const showNext = () => {
    if (!galleryImages || galleryImages.length === 0) return;
    const nextIdx = (modalIndex + 1) % galleryImages.length;
    setModalIndex(nextIdx);
    setModalImage(galleryImages[nextIdx]);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (!modalImage) return;
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") handleCloseModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalImage, modalIndex, galleryImages]);

  return (
    <div className="space-y-4">
      <div className="bg-white">
        {/* Use aspect-ratio matching 4000x6000 (2:3) so tall images are displayed proportionally */}
  <div style={{ aspectRatio: '2 / 3' }} className="w-full lg:aspect-auto lg:h-[720px]">
          <img
            src={activeImage}
            alt={productName}
            className="w-full h-full cursor-zoom-in object-contain"
            onClick={() => handleOpenModal(activeImage)}
          />
        </div>
      </div>

      {galleryImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {galleryImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onMouseEnter={() => handleThumbnailHover(image)}
              onClick={() => handleOpenModal(image)}
              className="aspect-square w-full overflow-hidden bg-white"
            >
              <img src={image} alt={`${productName} view ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          onClick={handleCloseModal}
        >
          <div className="relative w-full max-w-3xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute right-3 pl-2 top-3 flex h-10 w-10 items-center justify-center text-sm font-semibold text-white"
            >
              Close
            </button>

            {/* Left arrow */}
            {galleryImages.length > 1 && (
              <button
                type="button"
                onClick={showPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <img src={modalImage} alt={`${productName} enlarged`} className="h-full w-full max-h-[85vh] object-contain" />

            {/* Right arrow */}
            {galleryImages.length > 1 && (
              <button
                type="button"
                onClick={showNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Counter */}
            {galleryImages.length > 1 && (
              <div className="absolute left-1/2 bottom-3 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-sm text-white">
                {modalIndex + 1} / {galleryImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
