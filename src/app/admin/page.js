"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useZodiacData } from "@/hooks/useZodiacData";
import { zodiacData as defaultZodiacData } from "@/data/zodiacData";

export default function AdminPortal() {
  const zodiacData = useZodiacData();
  const [data, setData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedSignId, setSelectedSignId] = useState("aries");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Sync state data with custom hook data
  useEffect(() => {
    if (zodiacData && zodiacData.length > 0) {
      setData(JSON.parse(JSON.stringify(zodiacData))); // deep clone
    }
  }, [zodiacData]);

  // Check auth session storage on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem("astro_admin_authenticated");
    if (isAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === "admin123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("astro_admin_authenticated", "true");
      setErrorMsg("");
      showNotification("লগইন সফল হয়েছে!", "success");
    } else {
      setErrorMsg("ভুল পাসকোড! দয়া করে আবার চেষ্টা করুন।");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("astro_admin_authenticated");
    setPasscode("");
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000);
  };

  const getSelectedSign = () => {
    return data.find((sign) => sign.id === selectedSignId) || defaultZodiacData[0];
  };

  const handleInputChange = (field, value) => {
    setData((prevData) =>
      prevData.map((sign) => {
        if (sign.id === selectedSignId) {
          return { ...sign, [field]: value };
        }
        return sign;
      })
    );
  };

  const handleHoroscopeChange = (timeframe, value) => {
    setData((prevData) =>
      prevData.map((sign) => {
        if (sign.id === selectedSignId) {
          return {
            ...sign,
            horoscope: {
              ...sign.horoscope,
              [timeframe]: value,
            },
          };
        }
        return sign;
      })
    );
  };

  const handleSave = async () => {
    try {
      // 1. Always attempt saving to the backend API first
      const response = await fetch("/api/horoscope", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passcode: "admin123",
          data: data,
        }),
      });

      if (response.ok) {
        // Backend successfully written
        localStorage.setItem("astro_zodiac_data", JSON.stringify(data));
        showNotification("সার্ভার এবং ব্রাউজারে সফলভাবে ডেটা সংরক্ষণ করা হয়েছে!", "success");
      } else {
        const errorData = await response.json();
        if (errorData.isWriteProtected) {
          // File system is read-only (e.g. Vercel deployment)
          localStorage.setItem("astro_zodiac_data", JSON.stringify(data));
          showNotification("ব্রাউজারে সেভ হয়েছে (সার্ভার ফাইলসিস্টেমটি লক করা রয়েছে)।", "warning");
        } else {
          throw new Error(errorData.error || "Unknown server error");
        }
      }
    } catch (error) {
      console.warn("API write failed, falling back to local storage:", error);
      // Client-side backup fallback
      localStorage.setItem("astro_zodiac_data", JSON.stringify(data));
      showNotification("ব্রাউজারের লোকাল স্টোরেজে ডেটা সেভ হয়েছে।", "success");
    }
  };

  const handleResetToDefault = () => {
    setShowConfirmReset(true);
  };

  const confirmReset = () => {
    const freshData = JSON.parse(JSON.stringify(defaultZodiacData));
    setData(freshData);
    localStorage.removeItem("astro_zodiac_data");
    showNotification("ডিফল্ট ডেটা পুনরুদ্ধার করা হয়েছে। সংরক্ষণ করতে 'সেভ করুন' চাপুন।", "info");
    setShowConfirmReset(false);
  };

  const activeSign = getSelectedSign();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen max-w-full overflow-hidden bg-astro-deep text-astro-cream">
        {/* <Navbar /> */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-astro-orange/20 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-astro-orange/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-astro-orange/5 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-6">
              <span className="text-5xl block mb-3 animate-pulse">🔑</span>
              <h2 className="text-2xl font-bold text-astro-orange">অ্যাডমিন প্যানেল লগইন</h2>
              <p className="text-xs text-astro-cream/60 mt-1">রাশিফল ও রাশির অন্যান্য তথ্য হালনাগাদ করার পোর্টাল</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-astro-orange/80 mb-1" htmlFor="passcode">
                  অ্যাডমিন পাসকোড দিন
                </label>
                <input
                  type="password"
                  id="passcode"
                  placeholder="••••••••"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-astro-deep/50 border border-astro-orange/30 rounded-xl px-4 py-3 text-center text-astro-cream placeholder-astro-cream/30 focus:outline-none focus:border-astro-orange font-mono tracking-widest text-lg"
                  required
                />
              </div>

              {errorMsg && <p className="text-xs text-red-500 font-semibold text-center">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full bg-astro-orange hover:bg-astro-orange/90 text-astro-deep font-bold py-3 px-4 rounded-xl transition-all duration-300 transform active:scale-98 shadow-md hover:shadow-astro-orange/25"
              >
                প্রবেশ করুন
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-4xs text-astro-cream/40">ডিফল্ট পাসকোড: <span className="font-mono">admin123</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen max-w-full bg-astro-deep text-astro-cream">
      {/* <Navbar /> */}

      {/* Floating Notifications */}
      {notification.show && (
        <div
          className={`fixed top-20 right-4 z-50 flex items-center space-x-3 px-5 py-4 rounded-xl border shadow-xl animate-fade-in ${
            notification.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
              : notification.type === "warning"
              ? "bg-amber-950/90 border-amber-500/50 text-amber-200"
              : notification.type === "info"
              ? "bg-blue-950/90 border-blue-500/50 text-blue-200"
              : "bg-astro-dark/95 border-astro-orange/30 text-astro-orange"
          }`}
        >
          <span className="text-lg">
            {notification.type === "success" ? "✓" : notification.type === "warning" ? "⚠" : "ℹ"}
          </span>
          <span className="text-xs sm:text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-red-500/30 text-center animate-fade-in">
            <span className="text-4xl block mb-2">⚠️</span>
            <h3 className="text-lg font-bold text-red-400">রিসেট করতে চান?</h3>
            <p className="text-xs text-astro-cream/70 mt-2 mb-6">
              এটি আপনার বর্তমান সমস্ত পরিবর্তন মুছে ফেলবে এবং আদি রাশিফল ডেটা পুনরুদ্ধার করবে। এই সিদ্ধান্ত ফেরানো যাবে না।
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 bg-astro-cream/10 hover:bg-astro-cream/20 text-astro-cream font-medium rounded-lg text-xs transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={confirmReset}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-xs transition-colors"
              >
                হ্যাঁ, রিসেট করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title Dashboard Header */}
      <div className="bg-astro-dark/50 py-4 px-4 sm:px-6 lg:px-8 border-b border-astro-orange/15 flex flex-row justify-between items-center">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-astro-orange flex items-center space-x-2">
            <span>⚙️</span>
            <span>জ্যোতিষ রাশিফল নিয়ন্ত্রণ পোর্টাল</span>
          </h1>
          <p className="text-3xs sm:text-xxs text-astro-cream/60">এখানে যেকোনো রাশির প্রতিদিন, সপ্তাহ, মাস এবং বছরের পূর্বাভাস এডিট করা সম্ভব।</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-astro-cream/10 hover:bg-red-950/40 hover:text-red-400 border border-astro-cream/10 hover:border-red-500/25 px-3 py-1.5 rounded-lg text-xxs sm:text-xs font-semibold transition-all duration-300"
        >
          লগআউট
        </button>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left column: Zodiac selector sidebar */}
        <div className="w-full lg:w-1/4 shrink-0">
          <div className="glass-panel p-4 rounded-xl border border-astro-orange/15">
            <h3 className="text-xs font-bold text-astro-orange uppercase tracking-wider mb-3 pb-2 border-b border-astro-orange/10">
              ১২ রাশি তালিকা
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-1 gap-2">
              {data.map((sign) => {
                const isSelected = sign.id === selectedSignId;
                return (
                  <button
                    key={sign.id}
                    onClick={() => setSelectedSignId(sign.id)}
                    className={`flex items-center space-x-2.5 p-2 rounded-lg text-left transition-all duration-300 ${
                      isSelected
                        ? "bg-astro-orange/15 border border-astro-orange text-astro-orange font-bold scale-[1.02]"
                        : "text-astro-cream/70 hover:bg-astro-orange/5 hover:text-astro-orange border border-transparent"
                    }`}
                  >
                    <span className="text-lg sm:text-xl">{sign.symbol}</span>
                    <div className="overflow-hidden">
                      <p className="text-xs sm:text-sm font-semibold truncate leading-tight">{sign.name}</p>
                      <p className="text-5xs sm:text-4xs text-astro-cream/40 leading-none truncate hidden lg:block">
                        {sign.englishName}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Edit Form Panel */}
        <div className="flex-1">
          {data.length === 0 ? (
            <div className="glass-panel p-12 rounded-xl border border-astro-orange/15 text-center animate-pulse text-astro-orange">
              ডেটা লোড হচ্ছে...
            </div>
          ) : (
            <div className="glass-panel p-5 sm:p-6 rounded-xl border border-astro-orange/15 space-y-6">
              {/* Active Sign Summary */}
              <div className="flex items-center space-x-3 pb-4 border-b border-astro-orange/10">
                <span className="text-4xl bg-astro-orange/10 p-2 rounded-xl border border-astro-orange/20">
                  {activeSign.symbol}
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-astro-cream">
                    {activeSign.name} ({activeSign.englishName}) রাশির তথ্য এডিটর
                  </h2>
                  <p className="text-xxs text-astro-cream/60">
                    রাশির গুণাবলী এবং ৪টি সময়সীমার রাশিফল আপডেট করতে নিচের ফর্মটি ব্যবহার করুন।
                  </p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xxs font-semibold text-astro-orange/80 mb-1">বাংলা নাম</label>
                  <input
                    type="text"
                    value={activeSign.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full bg-astro-deep/50 border border-astro-orange/15 rounded-lg px-3 py-2 text-xs text-astro-cream focus:outline-none focus:border-astro-orange/60"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-semibold text-astro-orange/80 mb-1">ইংরেজি নাম</label>
                  <input
                    type="text"
                    value={activeSign.englishName}
                    onChange={(e) => handleInputChange("englishName", e.target.value)}
                    className="w-full bg-astro-deep/50 border border-astro-orange/15 rounded-lg px-3 py-2 text-xs text-astro-cream focus:outline-none focus:border-astro-orange/60"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-semibold text-astro-orange/80 mb-1">প্রতীক / রাশি চিহ্ন</label>
                  <input
                    type="text"
                    value={activeSign.symbol}
                    onChange={(e) => handleInputChange("symbol", e.target.value)}
                    className="w-full bg-astro-deep/50 border border-astro-orange/15 rounded-lg px-3 py-2 text-xs text-astro-cream focus:outline-none focus:border-astro-orange/60"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-semibold text-astro-orange/80 mb-1">জন্ম তারিখ সীমা (date range)</label>
                  <input
                    type="text"
                    value={activeSign.dateBengali}
                    onChange={(e) => handleInputChange("dateBengali", e.target.value)}
                    className="w-full bg-astro-deep/50 border border-astro-orange/15 rounded-lg px-3 py-2 text-xs text-astro-cream focus:outline-none focus:border-astro-orange/60"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-semibold text-astro-orange/80 mb-1">রাশির উপাদান (element)</label>
                  <input
                    type="text"
                    value={activeSign.element}
                    onChange={(e) => handleInputChange("element", e.target.value)}
                    className="w-full bg-astro-deep/50 border border-astro-orange/15 rounded-lg px-3 py-2 text-xs text-astro-cream focus:outline-none focus:border-astro-orange/60"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-semibold text-astro-orange/80 mb-1">অধিপতি গ্রহ (ruling planet)</label>
                  <input
                    type="text"
                    value={activeSign.ruler}
                    onChange={(e) => handleInputChange("ruler", e.target.value)}
                    className="w-full bg-astro-deep/50 border border-astro-orange/15 rounded-lg px-3 py-2 text-xs text-astro-cream focus:outline-none focus:border-astro-orange/60"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xxs font-semibold text-astro-orange/80 mb-1">শুভ রত্ন (lucky stone)</label>
                  <input
                    type="text"
                    value={activeSign.stone}
                    onChange={(e) => handleInputChange("stone", e.target.value)}
                    className="w-full bg-astro-deep/50 border border-astro-orange/15 rounded-lg px-3 py-2 text-xs text-astro-cream focus:outline-none focus:border-astro-orange/60"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xxs font-semibold text-astro-orange/80 mb-1">রাশির ছবি লিংক (Zodiac Image URL)</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <input
                      type="url"
                      placeholder="https://example.com/images/aries.png"
                      value={activeSign.image || ""}
                      onChange={(e) => handleInputChange("image", e.target.value)}
                      className="flex-1 bg-astro-deep/50 border border-astro-orange/15 rounded-lg px-3 py-2 text-xs text-astro-cream focus:outline-none focus:border-astro-orange/60"
                    />
                    {activeSign.image && (
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 border border-astro-orange/20 rounded-xl overflow-hidden bg-astro-deep/40 shrink-0 flex items-center justify-center">
                        <Image
                          src={activeSign.image}
                          alt={activeSign.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                          unoptimized={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Horoscope Textareas */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-astro-orange uppercase tracking-wider pb-1 border-b border-astro-orange/10">
                  রাশিফল পূর্বাভাস বিবরণী
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xxs font-semibold text-astro-orange/80 mb-1">আজকের রাশিফল (Daily)</label>
                    <textarea
                      value={activeSign.horoscope.daily}
                      onChange={(e) => handleHoroscopeChange("daily", e.target.value)}
                      rows={4}
                      className="w-full bg-astro-deep/50 border border-astro-orange/15 rounded-lg p-3 text-xs text-astro-cream focus:outline-none focus:border-astro-orange/60 leading-relaxed resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-semibold text-astro-orange/80 mb-1">সাপ্তাহিক রাশিফল (Weekly)</label>
                    <textarea
                      value={activeSign.horoscope.weekly}
                      onChange={(e) => handleHoroscopeChange("weekly", e.target.value)}
                      rows={4}
                      className="w-full bg-astro-deep/50 border border-astro-orange/15 rounded-lg p-3 text-xs text-astro-cream focus:outline-none focus:border-astro-orange/60 leading-relaxed resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-semibold text-astro-orange/80 mb-1">মাসিক রাশিফল (Monthly)</label>
                    <textarea
                      value={activeSign.horoscope.monthly}
                      onChange={(e) => handleHoroscopeChange("monthly", e.target.value)}
                      rows={4}
                      className="w-full bg-astro-deep/50 border border-astro-orange/15 rounded-lg p-3 text-xs text-astro-cream focus:outline-none focus:border-astro-orange/60 leading-relaxed resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-semibold text-astro-orange/80 mb-1">বার্ষিক রাশিফল (Yearly)</label>
                    <textarea
                      value={activeSign.horoscope.yearly}
                      onChange={(e) => handleHoroscopeChange("yearly", e.target.value)}
                      rows={4}
                      className="w-full bg-astro-deep/50 border border-astro-orange/15 rounded-lg p-3 text-xs text-astro-cream focus:outline-none focus:border-astro-orange/60 leading-relaxed resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Detailed Readings Textareas */}
              <div className="space-y-4 pt-4 border-t border-astro-orange/10">
                <h4 className="text-xs font-bold text-astro-orange uppercase tracking-wider pb-1 border-b border-astro-orange/10">
                  বিশদ তথ্য বিবরণী (Detailed Readings)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xxs font-semibold text-astro-orange/80 mb-1">❤️ প্রেম ও দাম্পত্য সম্পর্ক</label>
                    <textarea
                      value={activeSign.love || ""}
                      onChange={(e) => handleInputChange("love", e.target.value)}
                      rows={3}
                      className="w-full bg-astro-deep/50 border border-astro-orange/15 rounded-lg p-3 text-xs text-astro-cream focus:outline-none focus:border-astro-orange/60 leading-relaxed resize-y"
                      placeholder="প্রেম ও দাম্পত্য সম্পর্ক বিষয়ক তথ্য..."
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-semibold text-astro-orange/80 mb-1">🛠️ কর্মজীবন ও পেশা</label>
                    <textarea
                      value={activeSign.career || ""}
                      onChange={(e) => handleInputChange("career", e.target.value)}
                      rows={3}
                      className="w-full bg-astro-deep/50 border border-astro-orange/15 rounded-lg p-3 text-xs text-astro-cream focus:outline-none focus:border-astro-orange/60 leading-relaxed resize-y"
                      placeholder="কর্মজীবন ও পেশা বিষয়ক তথ্য..."
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-semibold text-astro-orange/80 mb-1">💰 ধনসম্পদ ও সঞ্চয়</label>
                    <textarea
                      value={activeSign.wealth || ""}
                      onChange={(e) => handleInputChange("wealth", e.target.value)}
                      rows={3}
                      className="w-full bg-astro-deep/50 border border-astro-orange/15 rounded-lg p-3 text-xs text-astro-cream focus:outline-none focus:border-astro-orange/60 leading-relaxed resize-y"
                      placeholder="ধনসম্পদ ও সঞ্চয় বিষয়ক তথ্য..."
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-semibold text-astro-orange/80 mb-1">📈 ব্যবসা ও আর্থিক চুক্তি</label>
                    <textarea
                      value={activeSign.business || ""}
                      onChange={(e) => handleInputChange("business", e.target.value)}
                      rows={3}
                      className="w-full bg-astro-deep/50 border border-astro-orange/15 rounded-lg p-3 text-xs text-astro-cream focus:outline-none focus:border-astro-orange/60 leading-relaxed resize-y"
                      placeholder="ব্যবসা ও আর্থিক চুক্তি বিষয়ক তথ্য..."
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-astro-orange/10">
                <button
                  onClick={handleResetToDefault}
                  className="w-full sm:w-auto px-4 py-2 border border-red-500/30 hover:bg-red-950/20 text-red-400 font-semibold rounded-lg text-xs transition-all duration-300"
                >
                  ডিফল্ট ডেটা রিসেট
                </button>
                <button
                  onClick={handleSave}
                  className="w-full sm:w-auto px-6 py-2.5 bg-astro-orange hover:bg-astro-orange/90 text-astro-deep font-bold rounded-lg text-xs sm:text-sm transition-all duration-300 shadow-md hover:shadow-astro-orange/10 transform active:scale-98"
                >
                  সংরক্ষণ করুন (Save Changes)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
