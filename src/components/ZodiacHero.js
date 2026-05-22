"use client";

import { useState, useEffect } from "react";
import { useZodiacData } from "@/hooks/useZodiacData";
import Link from "next/link";
import Image from "next/image";

export default function ZodiacHero() {
  const zodiacData = useZodiacData();
  const [selectedSign, setSelectedSign] = useState(zodiacData[0]);
  const [activeTab, setActiveTab] = useState("daily"); // daily, weekly, monthly, yearly

  useEffect(() => {
    if (zodiacData && zodiacData.length > 0) {
      const match = zodiacData.find((s) => s.id === selectedSign?.id);
      setSelectedSign(match || zodiacData[0]);
    }
  }, [zodiacData]);

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
              className={`flex flex-col p-2.5 rounded-2xl cursor-pointer glass-panel transition-all duration-300 relative overflow-hidden group ${
                isSelected
                  ? "bg-astro-orange/10 border-astro-orange shadow-lg shadow-astro-orange/10 scale-105"
                  : "hover:bg-astro-orange/5 hover:border-astro-orange/30 hover:scale-102"
              }`}
            >
              {/* Glow Effect */}
              {isSelected && (
                <span className="absolute inset-0 bg-radial-gradient from-astro-orange/10 to-transparent pointer-events-none" />
              )}
              
              {/* Square Image/Symbol Container */}
              <div className={`w-full aspect-square relative rounded-xl overflow-hidden bg-astro-deep/50 border transition-all duration-300 flex items-center justify-center ${
                isSelected ? "border-astro-orange/50 shadow-inner" : "border-astro-orange/10 group-hover:border-astro-orange/30"
              }`}>
                {sign.image ? (
                  <Image
                    src={sign.image}
                    alt={sign.name}
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <span className={`text-4xl sm:text-5xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                    isSelected ? "text-astro-orange" : "text-astro-cream/60"
                  }`}>
                    {sign.symbol}
                  </span>
                )}
              </div>

              {/* Bengali Name Only */}
              <span className={`mt-2 font-bold text-sm sm:text-base transition-colors duration-300 text-center block w-full truncate ${
                isSelected ? "text-astro-orange" : "text-astro-cream group-hover:text-astro-orange"
              }`}>
                {sign.name}
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
            {selectedSign?.image ? (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-astro-orange/10 p-1.5 rounded-xl border border-astro-orange/20 shrink-0 flex items-center justify-center overflow-hidden">
                <Image
                  src={selectedSign.image}
                  alt={selectedSign.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            ) : (
              <span className="text-5xl sm:text-6xl text-astro-orange select-none bg-astro-orange/10 p-3 rounded-xl border border-astro-orange/20 shrink-0">
                {selectedSign?.symbol}
              </span>
            )}
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
