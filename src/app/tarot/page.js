"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

const tarotCards = [
  {
    id: 1,
    name: "দ্য ফুল (The Fool)",
    meaning: "নতুন সূচনা, স্বতঃস্ফূর্ততা, বিশ্বাস এবং এক নতুন রোমাঞ্চকর যাত্রা। এটি আপনাকে ভয় দূর করে নতুন পথে এগিয়ে যেতে অনুপ্রাণিত করে।",
    symbol: "🃏",
    type: "ইতিবাচক"
  },
  {
    id: 2,
    name: "দ্য ম্যাজিশিয়ান (The Magician)",
    meaning: "দক্ষতা, ইচ্ছাশক্তি, সৃজনশীলতা এবং সম্পদ। আপনার কাছে সফল হওয়ার সমস্ত হাতিয়ার রয়েছে, শুধু সঠিক দিকে মনোযোগ দিন।",
    symbol: "🧙‍♂️",
    type: "ইতিবাচক"
  },
  {
    id: 3,
    name: "দ্য হাই প্রিস্টেস (The High Priestess)",
    meaning: "অন্তর্দৃষ্টি, অবচেতন মন, রহস্য এবং অভ্যন্তরীণ জ্ঞান। আপনার মনের অবচেতন আওয়াজ শুনুন, এটি আপনাকে সঠিক দিকনির্দেশ করবে।",
    symbol: "🌙",
    type: "আধ্যাত্মিক"
  },
  {
    id: 4,
    name: "দ্য এম্প্রেস (The Empress)",
    meaning: "প্রাচুর্য, মাতৃত্ব, সৃষ্টিশীলতা এবং উর্বরতা। আপনার জীবনে সুখ, সচ্ছলতা এবং যেকোনো সৃজনশীল কাজে প্রভূত সাফল্যের যোগ রয়েছে।",
    symbol: "👑",
    type: "ইতিবাচক"
  },
  {
    id: 5,
    name: "দ্য এম্পেরর (The Emperor)",
    meaning: "কর্তৃত্ব, শৃঙ্খলা, নিয়ন্ত্রণ এবং স্থায়িত্ব। আপনার পরিকল্পনা বাস্তবায়ন করতে নিয়ম এবং নিয়মানুবর্তিতার ওপর গুরুত্ব দিন।",
    symbol: "🏛️",
    type: "শাসন"
  },
  {
    id: 6,
    name: "দ্য লাভার্স (The Lovers)",
    meaning: "সম্পর্ক, পছন্দ, আকর্ষণ এবং সম্প্রীতি। এটি কেবল প্রেমের সম্পর্কই নয়, বরং জীবনের যেকোনো ক্ষেত্রে গুরুত্বপূর্ণ সিদ্ধান্তের মুখোমুখি হওয়াকেও বোঝায়।",
    symbol: "❤️",
    type: "প্রেম"
  },
  {
    id: 7,
    name: "দ্য হুইল অফ ফরচুন (Wheel of Fortune)",
    meaning: "পরিবর্তন, ভাগ্য, নতুন সুযোগ এবং চক্রাকার বিবর্তন। মনে রাখবেন, জীবনের চাকা সদা ঘূর্ণায়মান। খারাপ সময় দ্রুত কেটে যাবে।",
    symbol: "☸️",
    type: "পরিবর্তন"
  },
  {
    id: 8,
    name: "দ্য স্টার (The Star)",
    meaning: "আশা, বিশ্বাস, পুনর্যৌবন এবং আধ্যাত্মিক আরোগ্য। কঠিন সময়ের পর আপনার মনে শান্তি ফিরবে। লক্ষ্য ও স্বপ্ন পূরণ আসন্ন।",
    symbol: "⭐",
    type: "ইতিবাচক"
  }
];

export default function TarotPage() {
  const [selectedCards, setSelectedCards] = useState([]); // Array of 3 cards
  const [isReading, setIsReading] = useState(false);

  const handleSelectCard = (cardIndex) => {
    if (selectedCards.length >= 3) return;
    
    // Check if card is already selected
    if (selectedCards.find((c) => c.originalIndex === cardIndex)) return;

    // Pick a random tarot card
    const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    
    // Position type based on current selection length
    const positions = ["অতীত (Past)", "বর্তমান (Present)", "ভবিষ্যৎ (Future)"];
    const position = positions[selectedCards.length];

    setSelectedCards((prev) => [
      ...prev,
      { ...randomCard, position, originalIndex: cardIndex }
    ]);
  };

  const handleReset = () => {
    setSelectedCards([]);
    setIsReading(false);
  };

  // Mock deck size of 8 card buttons back-down
  const deckSize = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl">
        {/* Title */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-widest text-astro-orange uppercase border border-astro-orange/20 px-3 py-1 rounded-full bg-astro-orange/5">
            ৩-কার্ড রিডিং স্প্রেড
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-astro-cream">
            মহাজাগতিক ট্যারোট রিডিং
          </h1>
          <p className="mt-3 text-sm sm:text-base text-astro-cream/70 max-w-xl mx-auto">
            আপনার মনের একটি প্রশ্ন বা ইচ্ছা কল্পনা করুন। তারপর নিচে থাকা কার্ডের ডেক থেকে যেকোনো ৩টি কার্ড একের পর এক সিলেক্ট করে আপনার অতীত, বর্তমান ও ভবিষ্যৎ জেনে নিন।
          </p>
        </div>

        {/* Deck area */}
        {selectedCards.length < 3 ? (
          <div className="glass-panel p-8 rounded-2xl border border-astro-orange/15 text-center mb-10">
            <h3 className="text-lg font-semibold text-astro-orange mb-6">
              কার্ড সিলেক্ট করুন ({selectedCards.length}/৩)
            </h3>
            
            {/* Card deck display */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 max-w-3xl mx-auto justify-center">
              {deckSize.map((item, idx) => {
                const isSelected = selectedCards.some((c) => c.originalIndex === idx);
                return (
                  <button
                    key={idx}
                    disabled={isSelected}
                    onClick={() => handleSelectCard(idx)}
                    className={`h-36 sm:h-44 rounded-xl border border-astro-orange/30 bg-[#050508] flex items-center justify-center cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                      isSelected
                        ? "opacity-30 pointer-events-none"
                        : "hover:-translate-y-4 hover:border-astro-orange shadow-md hover:shadow-astro-orange/20"
                    }`}
                  >
                    {/* Tarot back design */}
                    <div className="absolute inset-1.5 border border-astro-orange/15 rounded-lg flex flex-col items-center justify-center text-astro-orange/40 group-hover:text-astro-orange/80 transition-colors">
                      <span className="text-3xs uppercase font-light tracking-widest">TAROT</span>
                      <span className="text-xl my-1">✨</span>
                      <span className="text-3xs uppercase font-light tracking-widest">SOMOY</span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <p className="text-xs text-astro-cream/40 mt-6 italic">
              *কার্ডে হাত দিয়ে শান্ত মনে চোখ বুজে প্রশ্নটি চিন্তা করুন।
            </p>
          </div>
        ) : (
          <div className="text-center mb-6">
            <button
              onClick={handleReset}
              className="bg-astro-orange text-astro-dark hover:brightness-110 font-bold px-6 py-2.5 rounded-xl transition-all"
            >
              🔄 আবার কার্ড বাছুন
            </button>
          </div>
        )}

        {/* Display selected spread */}
        {selectedCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {selectedCards.map((card, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-astro-orange/20 flex flex-col items-center text-center animate-fade-in"
              >
                <span className="text-xs font-semibold text-astro-orange uppercase tracking-wider bg-astro-orange/15 px-3 py-1 rounded-full mb-4">
                  {card.position}
                </span>

                {/* Card visual face-up */}
                <div className="w-24 h-36 rounded-xl bg-gradient-to-b from-[#181922] to-[#0d0e15] border-2 border-astro-orange/50 flex flex-col items-center justify-center relative shadow-lg shadow-astro-orange/5 mb-4">
                  <div className="absolute inset-1 border border-astro-orange/10 rounded-lg" />
                  <span className="text-4xl z-10">{card.symbol}</span>
                  <span className="text-4xs text-astro-orange/60 absolute bottom-2 tracking-widest">🔮</span>
                </div>

                <h3 className="text-lg font-bold text-astro-cream mb-2">{card.name}</h3>
                <span className="text-xxs border border-astro-orange/20 px-2 py-0.5 rounded text-astro-orange bg-astro-orange/5 mb-3">
                  {card.type} শক্তি
                </span>
                <p className="text-xs sm:text-sm text-astro-cream/80 leading-relaxed">
                  {card.meaning}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Spread Meaning summary */}
        {selectedCards.length === 3 && (
          <div className="glass-panel p-6 rounded-2xl border border-astro-orange/25 bg-astro-orange/3 max-w-3xl mx-auto animate-fade-in">
            <h3 className="text-lg font-bold text-astro-orange mb-3 flex items-center justify-center space-x-2">
              <span>🌟 সামগ্রিক জ্যোতিষীয় মূল্যায়ন</span>
            </h3>
            <p className="text-sm text-astro-cream/85 leading-relaxed text-center">
              আপনার কার্ডের সংমিশ্রণ নির্দেশ করে যে আপনি বর্তমানে একটি রূপান্তরের মধ্য দিয়ে যাচ্ছেন। অতীতে ঘটে যাওয়া ঘটনাগুলো আপনাকে বর্তমানে সিদ্ধান্ত নিতে সাহায্য করছে। ভবিষ্যৎ কার্ডটি শুভ লক্ষণ ইঙ্গিত দিচ্ছে, যা ধৈর্য ও একাগ্রতার সাথে প্রচেষ্টা চালালে সফলতা নিশ্চিত করবে।
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-astro-orange/10 bg-astro-deep py-6 text-center text-xs text-astro-cream/50 mt-auto">
        <p>© {new Date().getFullYear()} সময়ের সময়। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
}
