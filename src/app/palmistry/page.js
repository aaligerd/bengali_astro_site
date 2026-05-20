"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

const handLines = [
  {
    id: "heart",
    name: "হৃদয় রেখা (Heart Line)",
    description: "হৃদয় রেখা হাতের তালুর উপরিভাগে আঙুলগুলোর নিচে আড়াআড়িভাবে অবস্থান করে। এটি আপনার আবেগ, ভালোবাসা, দাম্পত্য সুখ এবং মানসিক সম্পর্কের গভীরতা নির্দেশ করে। রেখাটি স্পষ্ট ও গভীর হলে ব্যক্তি কোমল হৃদয়ের অধিকারী এবং দীর্ঘস্থায়ী সম্পর্কের সমাদরকারী হন।",
    symbol: "❤️",
    location: "কনিষ্ঠা আঙুলের নিচ থেকে শুরু হয়ে তর্জনী বা মধ্যমার দিকে ধাবিত রেখা।"
  },
  {
    id: "head",
    name: "মস্তিষ্ক রেখা (Head Line)",
    description: "তর্জনী ও বুড়ো আঙুলের মাঝখান থেকে শুরু হয়ে হাতের তালুর দিকে প্রসারিত রেখাটিকে মস্তিষ্ক রেখা বলে। এটি বুদ্ধিমত্তা, মানসিক শক্তি, চিন্তা করার ক্ষমতা, মনোযোগ ও সিদ্ধান্ত নেওয়ার গতি নির্দেশ করে। সোজা ও লম্বা মস্তিষ্ক রেখা বাস্তববাদী ও যুক্তিপূর্ণ চিন্তাধারার প্রতীক।",
    symbol: "🧠",
    location: "তর্জনী ও বুড়ো আঙুলের সংযোগস্থল থেকে তালুর মাঝখান দিয়ে যাওয়া রেখা।"
  },
  {
    id: "life",
    name: "জীবন রেখা (Life Line)",
    description: "তর্জনী ও বুড়ো আঙুলের মাঝখান থেকে শুরু হয়ে নিচের দিকে নেমে মণিবন্ধের কাছে শেষ হওয়া রেখাকে জীবন রেখা বলা হয়। এটি ব্যক্তির জীবনীশক্তি, স্বাস্থ্য, দীর্ঘায়ু এবং জীবনের প্রধান রূপান্তর বা ঘটনাকে নির্দেশ করে। রেখাটি অবিচ্ছিন্ন হওয়া সুস্বাস্থ্যের ইঙ্গিত দেয়।",
    symbol: "🌱",
    location: "বৃদ্ধাঙ্গুলকে ঘেরা গোলাকার রেখা।"
  },
  {
    id: "fate",
    name: "ভাগ্য রেখা (Fate Line)",
    description: "হাতের তালুর গোড়া থেকে শুরু হয়ে সোজা মধ্যমা আঙুলের দিকে উঠে যাওয়া রেখাটিকে ভাগ্য রেখা বলে। এটি ক্যারিয়ারের গতিপথ, আর্থিক ভাগ্য, চাকরি ও ব্যবসায় সাফল্য এবং জীবনে ভাগ্যের আনুকূল্য নির্দেশ করে। সকল মানুষের হাতে এই রেখা থাকে না, তবে এর উপস্থিতি কর্মজীবনে গতি নিয়ে আসে।",
    symbol: "⭐",
    location: "তালুর গোড়া থেকে মধ্যমা আঙুল পর্যন্ত বিস্তৃত উল্লম্ব রেখা।"
  }
];

export default function PalmistryPage() {
  const [selectedLine, setSelectedLine] = useState(handLines[0]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        {/* Title */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-widest text-astro-orange uppercase border border-astro-orange/20 px-3 py-1 rounded-full bg-astro-orange/5">
            হস্তরেখাবিদ্যা গাইড
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-astro-cream">
            আপনার হাতের রেখার অর্থ কী?
          </h1>
          <p className="mt-3 text-sm sm:text-base text-astro-cream/70 max-w-xl mx-auto">
            হাতের তালুর রেখাগুলোর মধ্যে লুকিয়ে রয়েছে আপনার জীবনের দিকনির্দেশ। আমাদের ইন্টারেক্টিভ গাইড থেকে প্রধান রেখাগুলির বিবরণ জেনে নিন।
          </p>
        </div>

        {/* Dynamic Display Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          
          {/* Interactive SVG Hand Visual Panel */}
          <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-astro-orange/15 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-astro-dark/50 to-astro-deep/50 h-[450px]">
            <span className="absolute top-4 left-4 text-xs text-astro-cream/40 uppercase">তালুর নকশা</span>
            
            {/* SVG Hand Drawing with highlighted lines */}
            <svg
              viewBox="0 0 200 240"
              className="w-64 sm:w-72 h-auto text-astro-orange/20 filter drop-shadow-[0_0_8px_rgba(248,156,28,0.15)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Hand Outline */}
              <path
                d="M 50,220 C 45,200 40,160 40,140 C 40,120 45,90 42,75 C 38,60 45,45 50,45 C 55,45 58,60 58,80 C 60,95 62,80 62,60 C 62,40 68,25 74,25 C 80,25 82,40 82,75 C 84,95 86,95 88,70 C 88,40 94,30 100,30 C 106,30 108,50 108,80 C 110,95 112,95 114,80 C 114,50 118,40 124,40 C 130,40 132,60 130,95 C 128,120 135,130 145,135 C 160,140 170,150 175,170 C 180,185 170,215 155,225 C 145,230 120,235 100,235 C 80,235 55,235 50,220 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Heart Line (Red/Pink overlay when selected) */}
              <path
                d="M 45,120 C 70,125 110,120 128,95"
                fill="none"
                stroke={selectedLine.id === "heart" ? "#F89C1C" : "rgba(248,156,28,0.25)"}
                strokeWidth={selectedLine.id === "heart" ? "5" : "2.5"}
                className="cursor-pointer transition-all duration-300 hover:stroke-astro-orange"
                onClick={() => setSelectedLine(handLines[0])}
              />

              {/* Head Line (Yellow/Orange overlay when selected) */}
              <path
                d="M 45,140 C 80,140 105,150 125,170"
                fill="none"
                stroke={selectedLine.id === "head" ? "#F89C1C" : "rgba(248,156,28,0.25)"}
                strokeWidth={selectedLine.id === "head" ? "5" : "2.5"}
                className="cursor-pointer transition-all duration-300 hover:stroke-astro-orange"
                onClick={() => setSelectedLine(handLines[1])}
              />

              {/* Life Line (Green overlay when selected) */}
              <path
                d="M 45,140 C 75,150 85,185 70,225"
                fill="none"
                stroke={selectedLine.id === "life" ? "#F89C1C" : "rgba(248,156,28,0.25)"}
                strokeWidth={selectedLine.id === "life" ? "5" : "2.5"}
                className="cursor-pointer transition-all duration-300 hover:stroke-astro-orange"
                onClick={() => setSelectedLine(handLines[2])}
              />

              {/* Fate Line (Blue overlay when selected) */}
              <path
                d="M 100,225 L 94,115"
                fill="none"
                stroke={selectedLine.id === "fate" ? "#F89C1C" : "rgba(248,156,28,0.25)"}
                strokeWidth={selectedLine.id === "fate" ? "5" : "2.5"}
                className="cursor-pointer transition-all duration-300 hover:stroke-astro-orange"
                onClick={() => setSelectedLine(handLines[3])}
              />
            </svg>
            <p className="text-4xs text-astro-cream/40 mt-4 text-center">
              *হাতের রেখার ওপর ক্লিক করে বা পাশের বাটনগুলো দিয়ে নির্বাচন করুন।
            </p>
          </div>

          {/* Interactive Info Panel */}
          <div className="space-y-6 flex flex-col justify-center h-full">
            {/* Quick buttons */}
            <div className="grid grid-cols-2 gap-2">
              {handLines.map((line) => (
                <button
                  key={line.id}
                  onClick={() => setSelectedLine(line)}
                  className={`py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-300 text-left flex items-center space-x-2 ${
                    selectedLine.id === line.id
                      ? "bg-astro-orange border-astro-orange text-[#0b0c10]"
                      : "bg-astro-dark border-astro-orange/20 text-astro-cream hover:bg-astro-orange/5"
                  }`}
                >
                  <span>{line.symbol}</span>
                  <span className="truncate">{line.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>

            {/* Line description box */}
            <div className="glass-panel p-6 rounded-2xl border border-astro-orange/25 bg-astro-orange/3 space-y-4 animate-fade-in">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{selectedLine.symbol}</span>
                <h3 className="text-xl font-bold text-astro-orange">{selectedLine.name}</h3>
              </div>
              
              <div className="space-y-2 text-sm leading-relaxed text-astro-cream/80">
                <p><span className="text-astro-orange font-semibold">অবস্থান:</span> {selectedLine.location}</p>
                <p className="pt-2 text-astro-cream border-t border-astro-orange/5">{selectedLine.description}</p>
              </div>
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
