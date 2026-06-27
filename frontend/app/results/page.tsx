"use client";

import React, { useState, useEffect } from "react";
import RestaurantCard from "@/components/RestaurantCard";

export default function Results() {
  const [results, setResults] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any>(null);

  useEffect(() => {
    try {
      const savedRecs = localStorage.getItem("zomato_recommendations");
      const savedPrefs = localStorage.getItem("zomato_preferences");
      if (savedRecs) {
        setResults(JSON.parse(savedRecs));
      }
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    } catch (err) {
      console.error("Failed to read localStorage", err);
    }
  }, []);

  return (
    <>
      {/* Top Navigation */}
      <header className="bg-surface dark:bg-surface-dim shadow-sm docked full-width top-0 flex justify-between items-center px-margin-desktop py-md w-full sticky z-50">
        <div className="flex items-center gap-sm">
          <img
            alt="Zomato AI Recommendations Logo"
            className="h-10 w-10 object-contain rounded-md"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnOlJ7FMzbMjQxQXdvRbJBhLHEv_McQLKDbkN649CRBwHGNZ-wZSU0tztoBz_T8OyCgGnnaEbdGD5-gh1KIQgiZ0nsJ6bnuKAv35rLeJRB4Ci3pfOVkccnuwImg7sc6VxSZEKjTs6PlHVjKWCiZFI88OaB1xie32EYxH6GKcAw3Tp58NwoRUWENKGiCLhC-6e7aPtjZOMdhNDMXwYrgN20m4KQKjiCBqZOgVf1gw8KBPtJUmPXmHVXyG06J4tAV32R5nUCn9QNQZ5dlPg"
          />
          <h1 className="font-display-lg text-display-lg font-black text-primary dark:text-primary-fixed-dim tracking-tighter">
            Savory<span>bites</span>
          </h1>
        </div>
        <nav className="hidden md:flex gap-lg">
          <a className="text-secondary dark:text-secondary-fixed-dim font-medium hover:text-primary hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors duration-200 px-2 rounded font-label-md text-label-md" href="/">
            Discover
          </a>
          <a className="text-primary dark:text-primary-fixed-dim font-bold border-b-2 border-primary dark:border-primary-fixed-dim pb-1 font-label-md text-label-md" href="/results">
            My Matches
          </a>
        </nav>
        <div className="flex items-center gap-md">
          <span className="hidden lg:block text-secondary font-label-md text-label-md">Find your perfect restaurant</span>
          <button aria-label="Account" className="text-primary hover:bg-surface-container-high dark:hover:bg-surface-variant p-2 rounded-full transition-colors duration-200">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
          </button>
          <button aria-label="Settings" className="text-primary hover:bg-surface-container-high dark:hover:bg-surface-variant p-2 rounded-full transition-colors duration-200">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
          </button>
          <button className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg font-bold transition-colors">
            Sign In
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-[800px] mx-auto px-margin-mobile md:px-margin-desktop py-xl md:py-2xl flex flex-col gap-md">
        <div className="flex items-center justify-between mb-sm">
          <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">Your AI Matches</h3>
          <a
            href="/"
            className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md font-bold transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">search</span> Search Again
          </a>
        </div>

        {preferences && (
          <div className="bg-surface-variant border-l-4 border-secondary px-4 py-3 rounded-r-lg flex items-start gap-3 mt-xs">
            <span className="material-symbols-outlined text-secondary mt-0.5">info</span>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">
              Showing matches for {preferences.cuisine || "any cuisine"} in {preferences.location} (Budget: {preferences.budget}, Rating: {preferences.min_rating}+).
            </p>
          </div>
        )}

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-8 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
            <span className="material-symbols-outlined text-5xl text-secondary mb-4">search_off</span>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">No recommendations found</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
              You haven't generated any recommendations yet, or your previous search yielded no results. Head back to the discover page to find your perfect match.
            </p>
            <a href="/" className="mt-6 bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-lg font-bold transition-colors">
              Go to Discover
            </a>
          </div>
        ) : (
          <>
            {/* AI Summary Header */}
            <div className="bg-surface border border-outline-variant/40 rounded-xl p-md flex items-start gap-4 mb-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
              <div className="bg-primary/10 p-2 rounded-full flex-shrink-0 z-10">
                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div className="z-10">
                <h4 className="font-title-lg text-title-lg font-bold text-on-surface mb-xs">AI thinks you'll love these because...</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  They perfectly match your preference for a {preferences?.budget || "medium"} budget in {preferences?.location || "your selected location"} while offering a {preferences?.min_rating || "4.0"}+ rating and an exceptional dining atmosphere based on thousands of recent user reviews.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-lg pb-xl">
              {results.map((rec: any, index: number) => (
                <RestaurantCard
                  key={index}
                  restaurant_name={rec.restaurant_name}
                  cuisine={rec.cuisine}
                  rating={rec.rating}
                  estimated_cost={rec.estimated_cost}
                  explanation={rec.explanation}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant/20 w-full py-xl px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-lg mt-auto text-on-surface-variant dark:text-inverse-on-surface">
        <div className="font-label-md text-label-md font-bold text-primary dark:text-primary-fixed-dim">
          <span className="material-symbols-outlined align-middle mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>&nbsp;Savory bites
        </div>
        <p className="font-body-md text-body-md text-center">© 2024 Savory Bites Culinary Discovery. Powered by Precision Intelligence.</p>
        <div className="flex gap-4 font-label-sm text-label-sm">
          <a className="text-secondary dark:text-secondary-fixed hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="text-secondary dark:text-secondary-fixed hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">
            Terms of Service
          </a>
          <a className="text-secondary dark:text-secondary-fixed hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">
            AI Safety
          </a>
        </div>
      </footer>
    </>
  );
}
