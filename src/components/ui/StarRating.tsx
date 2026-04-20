"use client";

import React from "react";

interface StarRatingProps {
  rating?: number;
  maxRating?: number;
  size?: string;
}

export function StarRating({
  rating = 0,
  maxRating = 5,
  size = "20px",
}: StarRatingProps) {
  return (
    <div className="flex gap-0.5 text-[#F59E0B]">
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = rating >= starValue;
        const isHalf = !isFilled && rating >= starValue - 0.5;

        return (
          <span 
            key={i} 
            className="material-symbols-outlined select-none" 
            style={{ 
              fontSize: size, 
              fontVariationSettings: isFilled || isHalf ? "'FILL' 1" : "'FILL' 0" 
            }}
          >
            {isFilled ? "star" : isHalf ? "star_half" : "star"}
          </span>
        );
      })}
    </div>
  );
}
