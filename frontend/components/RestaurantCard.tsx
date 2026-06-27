"use client";

import React from "react";

interface RestaurantCardProps {
  restaurant_name: string;
  cuisine: string;
  rating: number;
  estimated_cost: string;
  explanation: string;
}

export default function RestaurantCard({
  restaurant_name,
  cuisine,
  rating,
  estimated_cost,
  explanation,
}: RestaurantCardProps) {
  return (
    <article className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/20 overflow-hidden hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300 relative group cursor-pointer p-lg">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">{restaurant_name}</h3>
        <div className="bg-surface/90 backdrop-blur-sm text-on-surface font-label-md text-label-md px-2 py-1 rounded-md shadow-sm font-bold flex items-center gap-1 border border-outline-variant/30">
          {Number(rating).toFixed(1)} <span className="material-symbols-outlined text-sm text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-2 py-1 rounded-md">{cuisine}</span>
        <span className="text-secondary font-label-sm text-label-sm px-2 py-1">• {estimated_cost}</span>
      </div>
      {/* AI Explanation */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 relative">
        <p className="font-body-md text-body-md text-on-surface-variant text-sm relative z-10 leading-relaxed">
          <span className="font-bold text-primary mr-1">AI Note:</span> {explanation}
        </p>
      </div>
    </article>
  );
}
