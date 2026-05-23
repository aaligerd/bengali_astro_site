"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useZodiacData } from "@/hooks/useZodiacData";

export default function RashifalContent({ initialData }) {
  const searchParams = useSearchParams();
  const clientZodiacData = useZodiacData();
  const [zodiacData, setZodiacData] = useState(initialData || []);
  const [selectedSign, setSelectedSign] = useState(zodiacData[0] || null);
  const [activeTab, setActiveTab] = useState("daily");

  useEffect(() => {
    if (clientZodiacData && clientZodiacData.length > 0) {
      setZodiacData(clientZodiacData);
    }
  }, [clientZodiacData]);

  useEffect(() => {
    if (!zodiacData || zodiacData.length === 0) return;
    const signParam = searchParams.get("sign");
    if (signParam) {
      const match = zodiacData.find((s) => s.id === signParam.toLowerCase());
      if (match) {
        setSelectedSign(match);
        return;
      }
    }
    const currentMatch = zodiacData.find((s) => s.id === selectedSign?.id);
    setSelectedSign(currentMatch || zodiacData[0]);
  }, [searchParams, zodiacData]);

  const tabs = [
    { id: "daily", name: "আজকের রাশিফল" },
    { id: "weekly", name: "সাপ্তাহিক রাশিফল" },
    { id: "monthly", name: "মাসিক রাশিফল" },
    { id: "yearly", name: "বার্ষিক রাশিফল" },
  ];

  if (!selectedSign) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-astro-orange animate-pulse">
        লোডিং রাশিফল...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex flex-col md:flex-row gap-6 md:gap-8 max-w-full overflow-hidden">
      {/* Sidebar - Zodiac Picker */}
      <div className="w-full md:w-1/4 shrink-0 max-w-full overflow-hidden">
        <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-astro-orange/15 md:sticky md:top-24 max-w-full overflow-hidden">
          <h3 className="text-sm md:text-lg font-bold text-astro-orange mb-3 md:mb-4 border-b border-astro-orange/10 pb-2 hidden md:block">
            রাশি তালিকা
          </h3>
          
          {/* Horizontal scroll on mobile, vertical list on desktop */}
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-thin scrollbar-thumb-astro-orange/20 whitespace-nowrap max-w-full">
            {zodiacData.map((sign) => {
              const isSelected = selectedSign?.id === sign.id;
              return (
                <button
                  key={sign.id}
                  onClick={() => setSelectedSign(sign)}
                  className={`flex flex-row items-center space-x-2 p-2 rounded-xl text-left transition-all duration-300 shrink-0 md:w-full ${
                    isSelected
                      ? "bg-astro-orange/15 border border-astro-orange text-astro-orange font-bold"
                      : "text-astro-cream/80 hover:bg-astro-orange/5 hover:text-astro-orange border border-transparent"
                  }`}
                >
                  {sign.image ? (
                    <div className="relative w-6 h-6 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center overflow-hidden rounded-md bg-astro-deep/50 border border-astro-orange/15">
                      <Image
                        src={sign.image}
                        alt={sign.name}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <span className="text-lg sm:text-xl md:text-2xl">{sign.symbol}</span>
                  )}
                  <span className="text-xs sm:text-sm md:text-base">
                    {sign.name} <span className="hidden md:inline-block">({sign.englishName})</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-full overflow-hidden">
        <div className="glass-panel p-5 sm:p-8 rounded-2xl border border-astro-orange/15 relative overflow-hidden max-w-full">
          <div className="absolute right-0 top-0 w-64 h-64 bg-astro-orange/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-4 border-b border-astro-orange/15 pb-6 mb-6">
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
              <span className="text-4xl sm:text-6xl text-astro-orange select-none bg-astro-orange/10 p-2.5 sm:p-3 rounded-xl border border-astro-orange/20 shrink-0">
                {selectedSign?.symbol}
              </span>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-astro-cream">
                {selectedSign?.name} রাশিফল
              </h1>
              <p className="text-xs sm:text-sm text-astro-cream/70 mt-1">
                মেষ থেকে মীন রাশির সম্পূর্ণ ও নির্ভুল রাশিফল। রাশিফল প্রস্তুতকারক: সময়ে সময় জ্যোতিষ পরিষদ।
              </p>
            </div>
          </div>

          {/* Quick Vedic Table Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-astro-cream/3 p-3 rounded-lg border border-astro-orange/5">
              <span className="text-3xs text-astro-orange/70 block uppercase">অধিপতি গ্রহ</span>
              <span className="text-xs sm:text-sm font-semibold text-astro-cream truncate block">{selectedSign?.ruler}</span>
            </div>
            <div className="bg-astro-cream/3 p-3 rounded-lg border border-astro-orange/5">
              <span className="text-3xs text-astro-orange/70 block uppercase">রাশির উপাদান</span>
              <span className="text-xs sm:text-sm font-semibold text-astro-cream truncate block">{selectedSign?.element}</span>
            </div>
            <div className="bg-astro-cream/3 p-3 rounded-lg border border-astro-orange/5">
              <span className="text-3xs text-astro-orange/70 block uppercase">শুভ রত্ন</span>
              <span className="text-xs sm:text-sm font-semibold text-astro-cream truncate block">{selectedSign?.stone}</span>
            </div>
            <div className="bg-astro-cream/3 p-3 rounded-lg border border-astro-orange/5">
              <span className="text-3xs text-astro-orange/70 block uppercase">তারিখ সীমা</span>
              <span className="text-xs sm:text-sm font-semibold text-astro-cream truncate block">{selectedSign?.dateBengali}</span>
            </div>
          </div>

          {/* Forecast Type Tabs */}
          <div className="flex border-b border-astro-orange/10 mb-6 overflow-x-auto whitespace-nowrap scrollbar-thin max-w-full">
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

          {/* Reading Description */}
          <div className="space-y-6">
            <div className="p-5 bg-astro-cream/2 rounded-xl border border-astro-orange/5 leading-relaxed">
              <p className="text-base sm:text-lg text-astro-cream/90">
                {selectedSign?.horoscope?.[activeTab]}
              </p>
            </div>

            {/* Custom additional detailed readings to make it feel premium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedSign?.love && (
                <div className="bg-astro-deep p-4 rounded-xl border border-astro-orange/10">
                  <h4 className="font-semibold text-astro-orange text-sm mb-1">❤️ প্রেম ও দাম্পত্য সম্পর্ক</h4>
                  <p className="text-xs sm:text-sm text-astro-cream/70 leading-relaxed">
                    {selectedSign.love}
                  </p>
                </div>
              )}
              {selectedSign?.career && (
                <div className="bg-astro-deep p-4 rounded-xl border border-astro-orange/10">
                  <h4 className="font-semibold text-astro-orange text-sm mb-1">🛠️ কর্মজীবন ও পেশা</h4>
                  <p className="text-xs sm:text-sm text-astro-cream/70 leading-relaxed">
                    {selectedSign.career}
                  </p>
                </div>
              )}
              {selectedSign?.wealth && (
                <div className="bg-astro-deep p-4 rounded-xl border border-astro-orange/10">
                  <h4 className="font-semibold text-astro-orange text-sm mb-1">💰 ধনসম্পদ ও সঞ্চয়</h4>
                  <p className="text-xs sm:text-sm text-astro-cream/70 leading-relaxed">
                    {selectedSign.wealth}
                  </p>
                </div>
              )}
              {selectedSign?.business && (
                <div className="bg-astro-deep p-4 rounded-xl border border-astro-orange/10">
                  <h4 className="font-semibold text-astro-orange text-sm mb-1">📈 ব্যবসা ও আর্থিক চুক্তি</h4>
                  <p className="text-xs sm:text-sm text-astro-cream/70 leading-relaxed">
                    {selectedSign.business}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-astro-orange/10 flex flex-col sm:flex-row justify-between items-center text-xs text-astro-cream/40 gap-2">
              <span>*রাশিফল কেবল জ্যোতিষীয় সম্ভাবনার পথ দেখায়, কোনো সুনির্দিষ্ট সিদ্ধান্তের বিকল্প নয়।</span>
              <span className="font-medium text-astro-orange/70 whitespace-nowrap">হালনাগাদ সময়: আজ, ভোর ৫:৩০ মিনিট</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
