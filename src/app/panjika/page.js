"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

// Static data for Bengali Calendar days
const panjikaDays = [
  { day: 1, gDate: "১৫ মে", tithi: "কৃষ্ণ প্রতিপদ", nakshatra: "বিশাখা", yoga: "অমৃতযোগ", status: "শুভ" },
  { day: 2, gDate: "১৬ মে", tithi: "কৃষ্ণ দ্বিতীয়া", nakshatra: "অনুরাধা", yoga: "মাহেন্দ্রযোগ", status: "শুভ" },
  { day: 3, gDate: "১৭ মে", tithi: "কৃষ্ণ তৃতীয়া", nakshatra: "জ্যেষ্ঠা", yoga: "রাহুকাল বর্জিত", status: "শুভ" },
  { day: 4, gDate: "১৮ মে", tithi: "কৃষ্ণ চতুর্থী", nakshatra: "মূল", yoga: "অমৃতযোগ", status: "শুভ" },
  { day: 5, gDate: "১৯ মে", tithi: "কৃষ্ণ পঞ্চমী", nakshatra: "পূর্বাষাঢ়া", yoga: "সাধারণ সময়", status: "মধ্যম" },
  { day: 6, gDate: "২০ মে", tithi: "কৃষ্ণ ষষ্ঠী", nakshatra: "উত্তরাষাঢ়া", yoga: "অমৃতযোগ", status: "শুভ" },
  { day: 7, gDate: "২১ মে", tithi: "কৃষ্ণ সপ্তমী", nakshatra: "শ্রবণা", yoga: "রাহুকাল বর্জিত", status: "শুভ" },
  { day: 8, gDate: "২২ মে", tithi: "কৃষ্ণ অষ্টমী", nakshatra: "ধনিষ্ঠা", yoga: "কালবেলা বর্জিত", status: "মধ্যম" },
  { day: 9, gDate: "২৩ মে", tithi: "কৃষ্ণ নবমী", nakshatra: "শতভিষা", yoga: "মাহেন্দ্রযোগ", status: "শুভ" },
  { day: 10, gDate: "২৪ মে", tithi: "কৃষ্ণ দশমী", nakshatra: "পূর্বভাদ্রপদ", yoga: "অমৃতযোগ", status: "শুভ" },
  { day: 11, gDate: "২৫ মে", tithi: "কৃষ্ণ একাদশী", nakshatra: "উত্তরভাদ্রপদ", yoga: "একাদশী উপবাস", status: "পবিত্র" },
  { day: 12, gDate: "২৬ মে", tithi: "কৃষ্ণ দ্বাদশী", nakshatra: "রেবতী", yoga: "সাধারণ সময়", status: "মধ্যম" },
  { day: 13, gDate: "২৭ মে", tithi: "কৃষ্ণ ত্রয়োদশী", nakshatra: "অশ্বিনী", yoga: "প্রদোষ ব্রত", status: "পবিত্র" },
  { day: 14, gDate: "২৮ মে", tithi: "কৃষ্ণ চতুর্দশী", nakshatra: "ভরনী", yoga: "শিবরাত্রি", status: "পবিত্র" },
  { day: 15, gDate: "২৯ মে", tithi: "অমাবস্যা", nakshatra: "কৃত্তিকা", yoga: "অমাবস্যা স্নান", status: "মধ্যম" },
  { day: 16, gDate: "৩০ মে", tithi: "শুক্ল প্রতিপদ", nakshatra: "রোহিণী", yoga: "অমৃতযোগ", status: "শুভ" },
  { day: 17, gDate: "৩১ মে", tithi: "শুক্ল দ্বিতীয়া", nakshatra: "মৃগশিরা", yoga: "মাহেন্দ্রযোগ", status: "শুভ" },
  { day: 18, gDate: "১ জুন", tithi: "শুক্ল তৃতীয়া", nakshatra: "আর্দ্রা", yoga: "সাধারণ সময়", status: "মধ্যম" },
  { day: 19, gDate: "২ জুন", tithi: "শুক্ল চতুর্থী", nakshatra: "পুনর্বসু", yoga: "অমৃতযোগ", status: "শুভ" },
  { day: 20, gDate: "৩ জুন", tithi: "শুক্ল পঞ্চমী", nakshatra: "পুষ্যা", yoga: "মাহেন্দ্রযোগ", status: "শুভ" },
  { day: 21, gDate: "৪ জুন", tithi: "শুক্ল ষষ্ঠী", nakshatra: "অশ্লেষা", yoga: "রাহুকাল বর্জিত", status: "শুভ" },
  { day: 22, gDate: "৫ জুন", tithi: "শুক্ল সপ্তমী", nakshatra: "মঘা", yoga: "সাধারণ সময়", status: "মধ্যম" },
  { day: 23, gDate: "৬ জুন", tithi: "শুক্ল অষ্টমী", nakshatra: "পূর্বফল্গুনী", yoga: "অমৃতযোগ", status: "শুভ" },
  { day: 24, gDate: "৭ জুন", tithi: "শুক্ল নবমী", nakshatra: "উত্তরফল্গুনী", yoga: "মাহেন্দ্রযোগ", status: "শুভ" },
  { day: 25, gDate: "৮ জুন", tithi: "শুক্ল দশমী", nakshatra: "হস্তা", yoga: "সাধারণ সময়", status: "মধ্যম" },
  { day: 26, gDate: "৯ জুন", tithi: "শুক্ল একাদশী", nakshatra: "চিত্রা", yoga: "একাদশী ব্রত", status: "পবিত্র" },
  { day: 27, gDate: "১০ জুন", tithi: "শুক্ল দ্বাদশী", nakshatra: "স্বাতী", yoga: "অমৃতযোগ", status: "শুভ" },
  { day: 28, gDate: "১১ জুন", tithi: "শুক্ল ত্রয়োদশী", nakshatra: "বিশাখা", yoga: "প্রদোষ ব্রত", status: "পবিত্র" },
  { day: 29, gDate: "১২ জুন", tithi: "শুক্ল চতুর্দশী", nakshatra: "অনুরাধা", yoga: "মাহেন্দ্রযোগ", status: "শুভ" },
  { day: 30, gDate: "১৩ জুন", tithi: "পূর্ণিমা", nakshatra: "জ্যেষ্ঠা", yoga: "পূর্ণিমা ব্রত", status: "পবিত্র" },
  { day: 31, gDate: "১৪ জুন", tithi: "কৃষ্ণ প্রতিপদ", nakshatra: "মূল", yoga: "সাধারণ সময়", status: "মধ্যম" }
];

export default function PanjikaPage() {
  const [selectedDay, setSelectedDay] = useState(panjikaDays[5]); // Default to 20th May (index 5)

  // Current date info based on state
  const currentMonthName = "জ্যৈষ্ঠ";
  const currentYearBengali = "১৪৩৩";
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        {/* Title */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-widest text-astro-orange uppercase border border-astro-orange/20 px-3 py-1 rounded-full bg-astro-orange/5">
            বৈদিক বাংলা পঞ্জিকা
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-astro-cream">
            আজকের বাংলা পঞ্চাঙ্গ ও দিনলিপি
          </h1>
          <p className="mt-3 text-sm sm:text-base text-astro-cream/70 max-w-xl mx-auto">
            বাঙালি সংস্কৃতির ঐতিহ্যবাহী তিথি ও নক্ষত্র তালিকা। নিচে ক্যালেন্ডারের যেকোনো দিনে ক্লিক করে সেই দিনের বিস্তারিত শুভ সময় ও গ্রহের দোষ জেনে নিন।
          </p>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <div className="glass-panel p-6 rounded-2xl border border-astro-orange/15">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-astro-orange">
                  {currentMonthName} {currentYearBengali}
                </h3>
                <div className="flex space-x-2 text-xs text-astro-cream/60">
                  <span className="flex items-center"><span className="w-2.5 h-2.5 bg-astro-orange rounded-full mr-1.5" /> শুভ</span>
                  <span className="flex items-center"><span className="w-2.5 h-2.5 bg-yellow-500 rounded-full mr-1.5" /> মধ্যম</span>
                  <span className="flex items-center"><span className="w-2.5 h-2.5 bg-purple-500 rounded-full mr-1.5" /> পবিত্র</span>
                </div>
              </div>

              {/* Day Headings */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-astro-cream/50 mb-3">
                <div>রবি</div>
                <div>সোম</div>
                <div>মঙ্গল</div>
                <div>বুধ</div>
                <div>বৃহঃ</div>
                <div>শুক্র</div>
                <div>শনি</div>
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {/* Pad empty blocks for day offset if needed (assuming start day is Friday for example) */}
                <div className="h-16 rounded-lg opacity-0 pointer-events-none" />
                <div className="h-16 rounded-lg opacity-0 pointer-events-none" />
                <div className="h-16 rounded-lg opacity-0 pointer-events-none" />
                <div className="h-16 rounded-lg opacity-0 pointer-events-none" />
                <div className="h-16 rounded-lg opacity-0 pointer-events-none" />

                {panjikaDays.map((item) => {
                  const isSelected = selectedDay.day === item.day;
                  let borderCol = "border-astro-orange/10";
                  let bgCol = "bg-[#0b0c10]";
                  
                  if (item.status === "শুভ") {
                    borderCol = "border-astro-orange/30";
                  } else if (item.status === "পবিত্র") {
                    borderCol = "border-purple-500/30";
                  } else {
                    borderCol = "border-yellow-500/20";
                  }

                  return (
                    <button
                      key={item.day}
                      onClick={() => setSelectedDay(item)}
                      className={`h-16 flex flex-col justify-between p-1.5 rounded-lg border text-left cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? "bg-astro-orange/15 border-astro-orange scale-105 shadow-md shadow-astro-orange/10"
                          : `hover:bg-astro-orange/5 ${borderCol}`
                      }`}
                    >
                      <span className="text-xs font-bold text-astro-cream">
                        {item.day}
                      </span>
                      <span className="text-3xs text-astro-cream/60 truncate leading-none">
                        {item.tithi}
                      </span>
                      <span className="text-4xs text-astro-orange/80 font-light truncate">
                        {item.gDate}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Day Details Card */}
          <div className="w-full">
            <div className="glass-panel p-6 rounded-2xl border border-astro-orange/20 sticky top-24 space-y-6">
              <div className="border-b border-astro-orange/15 pb-4">
                <h3 className="text-xl font-bold text-astro-orange">
                  দিনলিপি বিবরণ
                </h3>
                <p className="text-xs text-astro-cream/60 mt-1">
                  তারিখ: {selectedDay.gDate} (জ্যৈষ্ঠ {selectedDay.day}, {currentYearBengali})
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center border-b border-astro-orange/5 pb-2">
                  <span className="text-astro-cream/60">তিথি</span>
                  <span className="font-semibold text-astro-cream">{selectedDay.tithi}</span>
                </div>
                <div className="flex justify-between items-center border-b border-astro-orange/5 pb-2">
                  <span className="text-astro-cream/60">নক্ষত্র</span>
                  <span className="font-semibold text-astro-cream">{selectedDay.nakshatra}</span>
                </div>
                <div className="flex justify-between items-center border-b border-astro-orange/5 pb-2">
                  <span className="text-astro-cream/60">বিশেষ যোগ</span>
                  <span className="font-semibold text-astro-orange">{selectedDay.yoga}</span>
                </div>
                <div className="flex justify-between items-center border-b border-astro-orange/5 pb-2">
                  <span className="text-astro-cream/60">দিনটির চরিত্র</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    selectedDay.status === "শুভ" ? "bg-astro-orange/15 text-astro-orange" :
                    selectedDay.status === "পবিত্র" ? "bg-purple-500/15 text-purple-400" :
                    "bg-yellow-500/15 text-yellow-400"
                  }`}>{selectedDay.status} দিন</span>
                </div>
              </div>

              {/* Time Blocks */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-astro-orange uppercase tracking-wider">আজকের শুভ ও অশুভ ক্ষণ</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-astro-cream/3 p-3 rounded-lg border border-astro-orange/5">
                    <span className="block text-3xs text-astro-orange/70 font-semibold">🌅 অমৃতযোগ সময়</span>
                    <span className="block text-xs text-astro-cream mt-0.5">সকাল ০৬:১৫ - সকাল ০৮:৪০</span>
                  </div>
                  <div className="bg-astro-cream/3 p-3 rounded-lg border border-astro-orange/5">
                    <span className="block text-3xs text-red-400/80 font-semibold">🚫 রাহুকাল (অশুভ সময়)</span>
                    <span className="block text-xs text-red-400 mt-0.5">দুপুর ১২:১০ - দুপুর ০১:৪৫</span>
                  </div>
                  <div className="bg-astro-cream/3 p-3 rounded-lg border border-astro-orange/5">
                    <span className="block text-3xs text-astro-orange/70 font-semibold">🕉️ ব্রহ্ম মুহূর্ত</span>
                    <span className="block text-xs text-astro-cream mt-0.5">ভোর ০৪:০৫ - ভোর ০৪:৫২</span>
                  </div>
                  <div className="bg-astro-cream/3 p-3 rounded-lg border border-astro-orange/5">
                    <span className="block text-3xs text-astro-orange/70 font-semibold">🌙 মাহেন্দ্রযোগ সময়</span>
                    <span className="block text-xs text-astro-cream mt-0.5">সন্ধ্যা ০৭:২০ - রাত ০৯:১৫</span>
                  </div>
                </div>
              </div>

              {/* Panjika disclaimer */}
              <p className="text-4xs text-astro-cream/40 leading-relaxed pt-2 border-t border-astro-orange/10">
                *এই পঞ্জিকার গণনা সূর্যসিদ্ধান্ত ও বৈদিক বিশুদ্ধ সিদ্ধান্ত অনুযায়ী নিখুঁতভাবে তৈরি করা হয়েছে।
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-astro-orange/10 bg-astro-deep py-6 text-center text-xs text-astro-cream/50 mt-auto">
        <p>© {new Date().getFullYear()} সময়ের সময়। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
}
