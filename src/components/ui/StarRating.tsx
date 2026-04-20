"use client";

import React, { useState } from "react";

interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}

export function StarRating({
  value = 0,
  onChange,
  size = 16,
  readOnly = false,
}: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => !readOnly && onChange && onChange(i)}
          onMouseEnter={() => !readOnly && onChange && setHover(i)}
          onMouseLeave={() => !readOnly && onChange && setHover(0)}
          className={`transition-colors duration-100 ${
            !readOnly && onChange ? "cursor-pointer" : "cursor-default"
          }`}
          style={{
            fontSize: size,
            color: (hover || value) >= i ? "#F59E0B" : "#D1D5DB",
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}
