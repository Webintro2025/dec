"use client";

import React, { useMemo, useState } from "react";
import AddToCartButton from "@/components/cart/AddToCartButton";

const clampQuantity = (value, max) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 1;
  }
  const floored = Math.floor(parsed);
  if (!Number.isFinite(max) || max === null || max <= 0) {
    return Math.max(1, floored);
  }
  return Math.max(1, Math.min(floored, max));
};

const ProductPurchaseActions = ({ product, stock }) => {
  const [quantity, setQuantity] = useState(1);

  const maxStock = useMemo(() => {
    const parsed = Number(stock);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return null;
    }
    return Math.floor(parsed);
  }, [stock]);

  const displayQuantity = useMemo(() => clampQuantity(quantity, maxStock), [quantity, maxStock]);

  const handleIncrease = () => {
    setQuantity((prev) => clampQuantity(prev + 1, maxStock));
  };

  const handleDecrease = () => {
    setQuantity((prev) => clampQuantity(prev - 1, maxStock));
  };

  const isDecreaseDisabled = displayQuantity <= 1;
  const isIncreaseDisabled = maxStock !== null && displayQuantity >= maxStock;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
        <span>Quantity</span>
      </div>
      {/* default: horizontal on mobile so quantity + add-to-cart sit side-by-side */}
      <div className="flex flex-row items-center gap-3">
        {/* On small screens keep quantity compact; on md+ make both controls equal width */}
        <div className="flex h-10 items-center justify-between border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 w-[110px] md:flex-1 md:w-auto">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={isDecreaseDisabled}
            className="px-2 text-lg disabled:cursor-not-allowed disabled:text-gray-400"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span>{displayQuantity}</span>
          <button
            type="button"
            onClick={handleIncrease}
            disabled={isIncreaseDisabled}
            className="px-2 text-lg disabled:cursor-not-allowed disabled:text-gray-400"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <div className="flex-1 md:flex-1">
          <AddToCartButton product={product} quantity={displayQuantity} className="w-full" />
        </div>
      </div>
      {maxStock !== null && (
        <p className="text-xs text-gray-500">Maximum available: {maxStock}</p>
      )}
      <p className="text-xs text-gray-500">Ships in 6-7 business days. Complimentary installation support included.</p>
    </div>
  );
};

export default ProductPurchaseActions;
