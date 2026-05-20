"use client";

import { useState } from "react";
import { zodiacData } from "@/data/zodiacData";
import Link from "next/link";

export default function ZodiacHero() {
  const [selectedSign, setSelectedSign] = useState(zodiacData[0]);
  const [activeTab, setActiveTab] = useState("daily"); // daily, weekly, monthly, yearly

  const handleSignClick = (sign) => {
    setSelectedSign(sign);
    // Keep active tab same or default
  };

  const tabs = [
    { id: "daily", name: "আজকের রাশিফল" },
    { id: "weekly", name: "সাপ্তাহিক" },
    { id: "monthly", name: "মাসিক" },
    { id: "yearly", name: "বার্ষিক" },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
      {/* Title */}
      {/* <div className="text-center mb-12 animate-fade-in">
        <span className="text-xs font-semibold tracking-widest text-astro-orange uppercase border border-astro-orange/20 px-3 py-1 rounded-full bg-astro-orange/5">
          ১২ রাশি ও নক্ষত্রের খেলা
        </span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-astro-cream">
          আপনার রাশিফল নির্বাচন করুন
        </h1>
        <p className="mt-4 text-base sm:text-lg text-astro-cream/70 max-w-2xl mx-auto">
          মহাবিশ্বের গ্রহ ও নক্ষত্রের অবস্থান আপনার আজকের দিনটিকে কেমন করে প্রভাবিত করছে তা জানতে নিচের ১২টি রাশির যেকোনো একটিতে ক্লিক করুন।
        </p>
      </div> */}

      {/* Grid Layout of Zodiac Signs */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 mb-10">
        {zodiacData.map((sign) => {
          const isSelected = selectedSign.id === sign.id;
          return (
            <button
              key={sign.id}
              onClick={() => handleSignClick(sign)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer glass-panel transition-all duration-300 text-center relative overflow-hidden group ${
                isSelected
                  ? "bg-astro-orange/15 border-astro-orange shadow-lg shadow-astro-orange/10 scale-105"
                  : "hover:bg-astro-orange/5 hover:border-astro-orange/40 hover:scale-102"
              }`}
            >
              {/* Glow Effect */}
              {isSelected && (
                <span className="absolute inset-0 bg-radial-gradient from-astro-orange/10 to-transparent pointer-events-none" />
              )}
              {/* Symbol */}
              <span className={`text-3xl sm:text-4xl mb-2 transition-transform duration-500 group-hover:rotate-12 ${
                isSelected ? "text-astro-orange scale-110" : "text-astro-cream/80"
              }`}>
                {sign.symbol}
              </span>
              {/* Bengali Name */}
              <span className="font-semibold text-sm sm:text-base text-astro-cream">
                {sign.name}
              </span>
              {/* English Name */}
              <span className="text-xxs sm:text-xs text-astro-cream/50">
                {sign.englishName}
              </span>
              {/* Date */}
              <span className="text-3xs sm:text-xxs text-astro-orange/70 mt-1 font-light leading-none">
                {sign.dateBengali}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Horoscope Display Container */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-astro-orange/20 relative animate-fade-in">
        {/* Background Aura */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-astro-orange/5 rounded-full blur-3xl pointer-events-none" />

        {/* Selected Sign Details Header */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between border-b border-astro-orange/15 pb-6 mb-6">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <span className="text-5xl sm:text-6xl text-astro-orange select-none bg-astro-orange/10 p-3 rounded-full border border-astro-orange/20">
              {selectedSign.symbol}
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-astro-cream">
                  {selectedSign.name} রাশিফল
                </h2>
                <span className="text-sm font-medium text-astro-cream/50">
                  ({selectedSign.englishName})
                </span>
              </div>
              <p className="text-xs sm:text-sm text-astro-cream/70 mt-1">
                তারিখ সীমা: <span className="text-astro-orange">{selectedSign.dateBengali}</span> | উপাদান: {selectedSign.element} | অধিপতি গ্রহ: {selectedSign.ruler}
              </p>
            </div>
          </div>
          <div>
            <Link
              href={`/rashifal?sign=${selectedSign.id}`}
              className="text-xs sm:text-sm text-astro-orange hover:underline font-semibold flex items-center space-x-1"
            >
              <span>বিস্তারিত পড়ুন ➔</span>
            </Link>
          </div>
        </div>

        {/* Tabs for Horoscope types */}
        <div className="flex border-b border-astro-orange/10 mb-6 overflow-x-auto whitespace-nowrap scrollbar-thin">
          {tabs.map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 px-4 font-semibold text-sm sm:text-base border-b-2 mr-4 transition-all duration-300 ${
                  isTabActive
                    ? "border-astro-orange text-astro-orange"
                    : "border-transparent text-astro-cream/60 hover:text-astro-cream"
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="min-h-[120px] flex flex-col justify-between">
          <p className="text-base sm:text-lg leading-relaxed text-astro-cream/90 bg-astro-cream/2 p-4 rounded-xl border border-astro-orange/5">
            {selectedSign.horoscope[activeTab]}
          </p>
          
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-astro-cream/50 pt-4 border-t border-astro-orange/5">
            <div>
              লাকি স্টোন: <span className="text-astro-orange font-medium">{selectedSign.stone}</span>
            </div>
            <div className="mt-2 sm:mt-0">
              *সময়ের সময় জ্যোতিষশাস্ত্রীয় মতামত অনুযায়ী তৈরি।
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
