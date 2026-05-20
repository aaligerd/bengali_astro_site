"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

const astrologers = [
  {
    id: 1,
    name: "শ্রীমৎ ভাস্কর শাস্ত্রী",
    expertise: "বৈদিক জ্যোতিষ, কুন্ডলী বিচার ও বাস্তুবিদ",
    experience: "১৫+ বছর অভিজ্ঞতা",
    rating: "৪.৯ ★ (১৮০০+ কল)",
    rate: 15, // Rupee per minute
    status: "অনলাইন",
    avatar: "🔮"
  },
  {
    id: 2,
    name: "আচার্য দেবব্রত মুখোপাধ্যায়",
    expertise: "হস্তরেখা বিশেষজ্ঞ ও সংখ্যাবিজ্ঞানী",
    experience: "১২+ বছর অভিজ্ঞতা",
    rating: "৪.৮ ★ (১২০০+ কল)",
    rate: 18,
    status: "অনলাইন",
    avatar: "✋"
  },
  {
    id: 3,
    name: "ডঃ অনন্যা মুখার্জী",
    expertise: "কে পি পদ্ধতি জ্যোতিষ ও ট্যারোট রিডার",
    experience: "১০+ বছর অভিজ্ঞতা",
    rating: "৪.৭ ★ (৯৫০+ কল)",
    rate: 14,
    status: "ব্যস্ত",
    avatar: "🃏"
  },
  {
    id: 4,
    name: "পণ্ডিত শঙ্কর চক্রবর্তী",
    expertise: "কোষ্ঠী কুন্ডলী মেলা ও প্রতিকার বিশেষজ্ঞ",
    experience: "২০+ বছর অভিজ্ঞতা",
    rating: "৪.৯ ★ (২৫০০+ কল)",
    rate: 20,
    status: "অনলাইন",
    avatar: "☸️"
  }
];

export default function ConsultPage() {
  const [activeCall, setActiveCall] = useState(null); // Selected Astrologer
  const [callState, setCallState] = useState("idle"); // idle, calling, active, finished
  const [callSeconds, setCallSeconds] = useState(0);
  const [cost, setCost] = useState(0);

  const startCall = (astro) => {
    if (astro.status === "ব্যস্ত") return;
    setActiveCall(astro);
    setCallState("calling");
    setCallSeconds(0);
    setCost(0);
  };

  const endCall = () => {
    setCallState("finished");
    setTimeout(() => {
      setCallState("idle");
      setActiveCall(null);
    }, 3000);
  };

  // Handle call timer logic
  useEffect(() => {
    let timer;
    if (callState === "calling") {
      // Simulate ring for 2 seconds then connect
      timer = setTimeout(() => {
        setCallState("active");
      }, 2000);
    } else if (callState === "active" && activeCall) {
      timer = setInterval(() => {
        setCallSeconds((prev) => {
          const nextSec = prev + 1;
          // Calculate cost based on per-minute charge (rate / 60) per second
          const currentCost = (nextSec * (activeCall.rate / 60)).toFixed(2);
          setCost(currentCost);
          return nextSec;
        });
      }, 1000);
    }
    return () => {
      clearInterval(timer);
      clearTimeout(timer);
    };
  }, [callState, activeCall]);

  const formatTime = (secs) => {
    const min = Math.floor(secs / 60).toString().padStart(2, "0");
    const sec = (secs % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl">
        {/* Title */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-widest text-astro-orange uppercase border border-astro-orange/20 px-3 py-1 rounded-full bg-astro-orange/5">
            জ্যোতিষী পরামর্শ বোর্ড
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-astro-cream">
            অভিজ্ঞ জ্যোতিষীদের সাথে কথা বলুন
          </h1>
          <p className="mt-3 text-sm sm:text-base text-astro-cream/70 max-w-xl mx-auto">
            আপনার জটিল ব্যক্তিগত বা প্রফেশনাল সমস্যা নিয়ে সরাসরি আমাদের স্বর্ণপদকপ্রাপ্ত লাইভ বিশেষজ্ঞদের সাথে ফোন কলে কথা বলুন। কথা বলুন মাত্র ₹১৪ - ₹২০ প্রতি মিনিটে।
          </p>
        </div>

        {/* Astrologers List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {astrologers.map((astro) => (
            <div
              key={astro.id}
              className="glass-panel p-6 rounded-2xl border border-astro-orange/15 flex justify-between items-center relative overflow-hidden"
            >
              <div className="flex items-center space-x-4">
                <span className="text-4xl bg-astro-orange/10 p-3 rounded-full border border-astro-orange/25 w-16 h-16 flex items-center justify-center select-none">
                  {astro.avatar}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base sm:text-lg font-bold text-astro-cream">{astro.name}</h3>
                    <span className={`text-5xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      astro.status === "অনলাইন" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"
                    }`}>
                      {astro.status}
                    </span>
                  </div>
                  <p className="text-xs text-astro-orange font-medium mt-0.5">{astro.expertise}</p>
                  <p className="text-xxs text-astro-cream/50 mt-1">{astro.experience} | {astro.rating}</p>
                  <p className="text-xs text-astro-cream mt-1">ফি: <span className="text-astro-orange font-bold">₹{astro.rate}/মিনিট</span></p>
                </div>
              </div>

              <div>
                <button
                  onClick={() => startCall(astro)}
                  disabled={astro.status === "ব্যস্ত"}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 ${
                    astro.status === "ব্যস্ত"
                      ? "bg-astro-cream/5 border border-astro-cream/10 text-astro-cream/40 cursor-not-allowed"
                      : "bg-gradient-to-r from-astro-orange to-astro-gold text-astro-dark hover:brightness-110 shadow-md shadow-astro-orange/10"
                  }`}
                >
                  📞 কল করুন
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Call Simulator Overlay Screen */}
      {activeCall && (
        <div className="fixed inset-0 z-50 bg-astro-deep/95 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-3xl border border-astro-orange/30 w-full max-w-sm text-center relative overflow-hidden flex flex-col items-center justify-center space-y-6">
            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-5xs text-astro-orange font-bold uppercase tracking-widest">
              সময়ের সময় লাইভ কল সার্ভিস
            </span>

            {/* Avatar & Calling Info */}
            <div className="relative">
              <span className="text-6xl bg-astro-orange/10 p-5 rounded-full border border-astro-orange/30 w-24 h-24 flex items-center justify-center select-none animate-pulse-slow">
                {activeCall.avatar}
              </span>
              {callState === "calling" && (
                <div className="absolute inset-0 rounded-full border-2 border-astro-orange animate-ping" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-astro-cream">{activeCall.name}</h2>
              <p className="text-xs text-astro-orange font-medium mt-1">{activeCall.expertise}</p>
            </div>

            {/* Calling states display */}
            <div className="w-full">
              {callState === "calling" && (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-astro-cream animate-pulse">কল জোড়া হচ্ছে...</p>
                  <p className="text-xxs text-astro-cream/50">আপনার ব্যালেন্স থেকে প্রতি মিনিটে ₹{activeCall.rate} কাটা হবে।</p>
                </div>
              )}
              {callState === "active" && (
                <div className="space-y-3">
                  <div className="text-3xl font-extrabold text-astro-orange font-mono tracking-wider">
                    {formatTime(callSeconds)}
                  </div>
                  <div className="bg-astro-orange/5 border border-astro-orange/10 rounded-xl p-3 inline-block">
                    <span className="text-4xs text-astro-cream/60 block">Accrued Charge (জ্যোতিষী ফি)</span>
                    <span className="text-sm font-bold text-astro-cream">₹ {cost}</span>
                  </div>
                </div>
              )}
              {callState === "finished" && (
                <div className="space-y-1 text-green-400">
                  <p className="text-sm font-bold">কল সমাপ্ত হয়েছে।</p>
                  <p className="text-xs text-astro-cream/70">মোট চার্জ কেটে নেওয়া হয়েছে: ₹ {cost}</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            {callState !== "finished" && (
              <div>
                <button
                  onClick={endCall}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 transition-all duration-300 shadow-lg shadow-red-500/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12m0 0l2.25 2.25M16.5 12l2.25-2.25M16.5 12l-2.25 2.25M10.5 2.25A18.522 18.522 0 003 7.5c0 3.284 1.25 6.278 3.334 8.52L6 18c-.461.462-.716 1.075-.75 1.725-.033.65.176 1.295.626 1.745l.176.176a1.125 1.125 0 001.59 0l2.25-2.25a1.125 1.125 0 000-1.59l-.916-.916A14.28 14.28 0 0110.5 15.75c1.472 0 2.87-.417 4.06-1.139l-.917-.917a1.125 1.125 0 00-1.59 0l-2.25 2.25a1.125 1.125 0 000 1.59l.176.176c.45.45.659 1.095.626 1.745-.034.65-.289 1.263-.75 1.725l-.917.917A18.522 18.522 0 013 7.5a1.125 1.125 0 011.59-1.59l2.25 2.25a1.125 1.125 0 001.59 0l.916-.916" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-astro-orange/10 bg-astro-deep py-6 text-center text-xs text-astro-cream/50 mt-auto">
        <p>© {new Date().getFullYear()} সময়ের সময়। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
}
