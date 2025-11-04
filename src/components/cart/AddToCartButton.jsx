"use client";

import React, { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useCart } from "./CartProvider";

const sanitizeProductPayload = (product) => {
  if (!product || typeof product !== "object") {
    return null;
  }

  const productId = product.productId || product.id || product._id;
  if (!productId) {
    return null;
  }

  return {
    productId,
  };
};

const normalizeQuantity = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 1;
  }
  return Math.floor(parsed);
};

const AddToCartButton = ({ product, quantity = 1, className = "" }) => {
  const { addItem } = useCart();
  const payload = useMemo(() => sanitizeProductPayload(product), [product]);
  const resolvedQuantity = useMemo(() => normalizeQuantity(quantity), [quantity]);
  const [localLoading, setLocalLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!payload?.productId) {
      console.warn("Missing product data for cart payload");
      return;
    }
    setLocalLoading(true);
    try {
      await addItem({ productId: payload.productId, quantity: resolvedQuantity });
    } catch (err) {
      // addItem already handles errors and sets lastError; swallow here
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={!payload || localLoading}
      className={`flex w-full items-center justify-center gap-2 rounded-md bg-amber-600 px-4 py-2 sm:px-8 sm:py-4 text-sm font-semibold text-white shadow-sm sm:shadow-md transition-colors duration-200 hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-300 ${className}`}
      aria-label="Add to cart"
    >
      {localLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="sr-only">Adding…</span>
          <span className="ml-2 hidden sm:inline">Adding…</span>
        </>
      ) : (
        <span className="text-sm sm:text-sm">Add to Cart</span>
      )}
    </button>
  );
};

export default AddToCartButton;
