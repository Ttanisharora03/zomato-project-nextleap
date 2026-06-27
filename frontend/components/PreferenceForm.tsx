"use client";

import React, { useState } from "react";

interface PreferenceFormProps {
  onLoading: (loading: boolean) => void;
  onResults: (results: any[], error: string | null) => void;
  onPreferences?: (prefs: any) => void;
}

export default function PreferenceForm({ onLoading, onResults, onPreferences }: PreferenceFormProps) {
  const [location, setLocation] = useState("Indiranagar");
  const [budget, setBudget] = useState("medium");
  const [cuisine, setCuisine] = useState("Italian");
  const [minRating, setMinRating] = useState(4.0);
  const [additionalPreferences, setAdditionalPreferences] = useState("");
  const [errorState, setErrorState] = useState("");

  const locationsList = [
    "Indiranagar",
    "Koramangala",
    "Jayanagar",
    "Whitefield",
    "Marathahalli",
    "BTM",
    "HSR",
    "JP Nagar",
    "MG Road",
    "New Delhi",
    "Mumbai",
    "Pune",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Bangalore"
  ];

  const cuisinesList = [
    "Italian",
    "Chinese",
    "North Indian",
    "South Indian",
    "Continental",
    "Mexican",
    "Thai",
    "Japanese",
    "American",
    "Cafe",
    "Biryani",
    "Desserts",
    "Fast Food",
    "Any"
  ];

  const handleAutoFill = () => {
    setLocation("Indiranagar");
    setBudget("medium");
    setCuisine("Italian");
    setMinRating(4.2);
    setAdditionalPreferences("Romantic dinner, outdoor seating, good wine selection");
    setErrorState("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      setErrorState("Please select a valid location to continue.");
      return;
    }
    setErrorState("");
    onLoading(true);

    const payload = {
      location,
      cuisine: cuisine === "Any" ? "" : cuisine,
      budget,
      min_rating: minRating,
      additional_preferences: additionalPreferences
    };

    if (onPreferences) {
      onPreferences(payload);
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/recommend";
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 404) {
          onResults([], "No results found matching your exact filters. Try relaxing your constraints.");
        } else {
          onResults([], `Server error (${res.status}). Please try again later.`);
        }
        onLoading(false);
        return;
      }

      const data = await res.json();
      const recs = data.recommendations || [];
      if (recs.length === 0) {
        onResults([], "No results found matching your exact filters. Try relaxing your constraints.");
      } else {
        onResults(recs, null);
        try {
          localStorage.setItem("zomato_recommendations", JSON.stringify(recs));
          localStorage.setItem("zomato_preferences", JSON.stringify(payload));
        } catch (err) {
          console.error("Failed to save to localStorage", err);
        }
      }
    } catch (err) {
      console.error("API Fetch Error:", err);
      onResults([], "Failed to connect to the backend server. Please ensure the FastAPI server is running.");
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-xl p-lg border border-outline-variant/30">
      <div className="mb-lg flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">tune</span>
            Your preferences
          </h2>
          <button
            type="button"
            onClick={handleAutoFill}
            className="text-primary bg-primary/10 hover:bg-primary/20 text-xs font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
            title="Auto-fill with sample preferences"
          >
            ✨ Demo Sample
          </button>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Tell us what you're craving, and AI will find it.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-md">
        {/* Location Dropdown */}
        <div className="flex flex-col gap-xs relative group">
          <label className="font-label-md text-label-md text-on-surface" htmlFor="location">Location</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">location_on</span>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-surface-bright border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-body-md text-on-surface appearance-none"
            >
              {locationsList.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Budget */}
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface" htmlFor="budget">Budget (for two)</label>
          <select
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-3 py-2 bg-surface-bright border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-body-md text-on-surface appearance-none"
          >
            <option value="low">Low &lt; ₹300</option>
            <option value="medium">Medium ₹301–800</option>
            <option value="high">High &gt; ₹800</option>
          </select>
        </div>
        {/* Cuisine */}
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface" htmlFor="cuisine">Cuisine</label>
          <select
            id="cuisine"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="w-full px-3 py-2 bg-surface-bright border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-body-md text-on-surface appearance-none"
          >
            {cuisinesList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        {/* Rating Slider */}
        <div className="flex flex-col gap-xs mt-sm">
          <div className="flex justify-between items-center">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="rating">Minimum Rating</label>
            <span className="font-label-md text-label-md font-bold text-primary bg-primary-container/20 px-2 py-0.5 rounded" id="rating-val">
              {minRating.toFixed(1)}+
            </span>
          </div>
          <input
            id="rating"
            type="range"
            min="1.0"
            max="5.0"
            step="0.1"
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="w-full accent-primary h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer"
          />
        </div>
        {/* Free Text Prefs */}
        <div className="flex flex-col gap-xs mt-sm">
          <label className="font-label-md text-label-md text-on-surface flex items-center gap-xs" htmlFor="additional">
            Additional Context <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
          </label>
          <textarea
            id="additional"
            value={additionalPreferences}
            onChange={(e) => setAdditionalPreferences(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-surface-bright border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-body-md text-on-surface resize-none transition-all"
            placeholder="e.g., romantic dinner, vegan options, rooftop seating..."
          ></textarea>
        </div>
        {/* Error State */}
        {errorState && (
          <div className="text-error font-label-sm text-label-sm flex items-center gap-xs mt-xs">
            <span className="material-symbols-outlined text-[16px]">error</span> {errorState}
          </div>
        )}
        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-lg bg-primary hover:bg-primary-container text-on-primary font-title-lg text-title-lg py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-sm active:scale-95"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
          Get Recommendations
        </button>
      </form>
    </div>
  );
}
