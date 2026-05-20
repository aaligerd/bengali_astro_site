"use client";

import { useState } from "react";

export default function PersonalReportForm() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    tob: "",
    pob: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [report, setReport] = useState(null);

  const loadingTexts = [
    "কুণ্ডলী বিন্যাস গণনা করা হচ্ছে...",
    "গ্রহ ও নক্ষত্রের অবস্থান বিশ্লেষণ করা হচ্ছে...",
    "লগ্ন এবং চন্দ্র রাশি নিরুপণ করা হচ্ছে...",
    "বৈদিক পঞ্চাঙ্গ ও শুভ যোগ তৈরি হচ্ছে...",
    "ব্যক্তিগত জ্যোতিষ রিপোর্ট চূড়ান্ত করা হচ্ছে..."
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateVedicReport = (data) => {
    // Deterministic mock calculation based on input string lengths, days, etc.
    const nameLen = data.name.trim().length || 5;
    const day = data.dob ? new Date(data.dob).getDate() : 15;
    const month = data.dob ? new Date(data.dob).getMonth() + 1 : 6;
    const hour = data.tob ? parseInt(data.tob.split(":")[0]) || 12 : 12;

    const lagnas = ["মেষ", "বৃষ", "মিথুন", "কর্কট", "সিংহ", "কন্যা", "তুলা", "বৃশ্চিক", "ধনু", "মকর", "কুম্ভ", "মীন"];
    const rashis = ["মেষ", "বৃষ", "মিথুন", "কর্কট", "সিংহ", "কন্যা", "তুলা", "বৃশ্চিক", "ধনু", "মকর", "কুম্ভ", "মীন"];
    const nakshatras = ["অশ্বিনী", "ভরনী", "কৃত্তিকা", "রোহিণী", "মৃগশিরা", "আর্দ্রা", "পুনর্বসু", "পুষ্যা", "অশ্লেষা", "মঘা", "পূর্বফল্গুনী", "উত্তরফল্গুনী", "হস্তা", "চিত্রা", "স্বাতী", "বিশাখা", "অনুরাধা", "জ্যেষ্ঠা", "মূল", "পূর্বাষাঢ়া", "উত্তরাষাঢ়া", "শ্রবণা", "ধনিষ্ঠা", "শতভিষা", "পূর্বভাদ্রপদ", "উত্তরভাদ্রপদ", "রেবতী"];
    const colors = ["লাল", "সোনালী", "হলুদ", "সাদা", "সবুজ", "নীল", "গোলাপী", "কমলা"];
    const numbers = [1, 3, 5, 7, 9, 11, 15, 24];

    const lagnaIndex = (nameLen + day) % lagnas.length;
    const rashiIndex = (day + month) % rashis.length;
    const nakshatraIndex = (day * month + hour) % nakshatras.length;
    const colorIndex = (nameLen * day) % colors.length;
    const numberIndex = (day + hour) % numbers.length;

    const lagna = lagnas[lagnaIndex];
    const rashi = rashis[rashiIndex];
    const nakshatra = nakshatras[nakshatraIndex];
    const favColor = colors[colorIndex];
    const favNumber = numbers[numberIndex];

    return {
      lagna,
      rashi,
      nakshatra,
      favColor,
      favNumber,
      general: `আপনার জন্ম কুণ্ডলী অনুযায়ী আপনার লগ্ন হল ${lagna} এবং চন্দ্র রাশি হল ${rashi}। আপনি অত্যন্ত সংবেদনশীল, বুদ্ধিমান এবং সমাজ সচেতন ব্যক্তি। ${nakshatra} নক্ষত্রের প্রভাবে আপনার মধ্যে সৎসাহস ও সততা থাকবে। তবে মাঝে মাঝে জেদ আপনার কাজের ক্ষতি করতে পারে।`,
      career: `আপনার লগ্নাধিপতি গ্রহের সুপ্রভাবে চাকরি বা ব্যবসায় বড় উন্নতির যোগ রয়েছে। যোগাযোগের মাধ্যমে আপনার আয় বাড়বে। এই বছর শেয়ার বাজার বা বড় কোনো বিনিয়োগের ক্ষেত্রে তাড়াহুড়ো করবেন না।`,
      health: `শরীর ভালো থাকবে, তবে রক্তের চাপ ও হজম সংক্রান্ত ছোটখাটো সমস্যা দেখা দিতে পারে। প্রতিদিন সকালে যোগব্যায়াম এবং পর্যাপ্ত পরিমাণে জল খাওয়া আপনার জন্য অত্যন্ত শুভ হবে।`,
      remedy: `প্রতিদিন সকালে তামা বা কাঁসার পাত্রে সূর্যদেবকে অর্ঘ্য নিবেদন করুন। গরিব দুঃখীকে মিষ্টি জাতীয় খাবার দান করলে গ্রহের কুপ্রভাব কেটে যাবে।`
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dob) return;

    setLoading(true);
    setReport(null);
    setLoadingStep(0);

    // Dynamic loading screen steps
    const timer1 = setTimeout(() => setLoadingStep(1), 800);
    const timer2 = setTimeout(() => setLoadingStep(2), 1600);
    const timer3 = setTimeout(() => setLoadingStep(3), 2400);
    const timer4 = setTimeout(() => setLoadingStep(4), 3200);

    const timer5 = setTimeout(() => {
      const generated = calculateVedicReport(formData);
      setReport(generated);
      setLoading(false);
    }, 4000);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl animate-fade-in" id="report-section">
      <div className="text-center mb-10">
        <span className="text-xs font-semibold tracking-widest text-astro-orange uppercase border border-astro-orange/20 px-3 py-1 rounded-full bg-astro-orange/5">
          ফ্রি কোষ্ঠী ও কুন্ডলী বিশ্লেষণ
        </span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-astro-cream">
          আপনার ফ্রি জন্ম কুণ্ডলী রিপোর্ট
        </h2>
        <p className="mt-3 text-sm sm:text-base text-astro-cream/70">
          আপনার সঠিক জন্ম তথ্য লিখে সাবমিট করুন। আমাদের বৈদিক গণনা অনুযায়ী কয়েক সেকেন্ডের মধ্যে আপনার কুন্ডলী বিশ্লেষণ রিপোর্ট পান।
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-astro-orange/15 relative overflow-hidden">
        {loading ? (
          /* Loading Animation State */
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-astro-orange/10 border-t-astro-orange animate-spin" />
              <div className="absolute inset-2 rounded-full border border-astro-orange/20 animate-pulse-slow flex items-center justify-center text-3xl">
                🔮
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-astro-orange animate-pulse">
                {loadingTexts[loadingStep]}
              </p>
              <p className="text-xs text-astro-cream/50">
                আমাদের বৈদিক অ্যালগরিদম পঞ্চাঙ্গ গণনা করছে। অনুগ্রহ করে অপেক্ষা করুন...
              </p>
            </div>
          </div>
        ) : report ? (
          /* Report Results State */
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-astro-orange/20 pb-4">
              <div>
                <h3 className="text-xl font-bold text-astro-orange">
                  বৈদিক জন্ম কুণ্ডলী বিশ্লেষণ
                </h3>
                <p className="text-xs text-astro-cream/60">
                  নাম: {formData.name} | জন্মস্থান: {formData.pob || "নির্দিষ্ট নয়"}
                </p>
              </div>
              <button
                onClick={() => setReport(null)}
                className="text-xs text-astro-cream/50 hover:text-astro-orange border border-astro-cream/20 hover:border-astro-orange/50 px-3 py-1 rounded"
              >
                আবার চেষ্টা করুন
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-astro-orange/5 border border-astro-orange/10 p-3 rounded-lg text-center">
                <span className="block text-3xs text-astro-orange/70">চন্দ্র রাশি</span>
                <span className="block text-lg font-bold text-astro-cream">{report.rashi}</span>
              </div>
              <div className="bg-astro-orange/5 border border-astro-orange/10 p-3 rounded-lg text-center">
                <span className="block text-3xs text-astro-orange/70">জন্ম লগ্ন</span>
                <span className="block text-lg font-bold text-astro-cream">{report.lagna}</span>
              </div>
              <div className="bg-astro-orange/5 border border-astro-orange/10 p-3 rounded-lg text-center">
                <span className="block text-3xs text-astro-orange/70">জন্ম নক্ষত্র</span>
                <span className="block text-base font-bold text-astro-cream truncate">{report.nakshatra}</span>
              </div>
              <div className="bg-astro-orange/5 border border-astro-orange/10 p-3 rounded-lg text-center">
                <span className="block text-3xs text-astro-orange/70">শুভ রং</span>
                <span className="block text-base font-bold text-astro-cream">{report.favColor}</span>
              </div>
              <div className="bg-astro-orange/5 border border-astro-orange/10 p-3 rounded-lg text-center col-span-2 sm:col-span-1">
                <span className="block text-3xs text-astro-orange/70">শুভ সংখ্যা</span>
                <span className="block text-base font-bold text-astro-cream">{report.favNumber}</span>
              </div>
            </div>

            {/* Detailed Readings */}
            <div className="space-y-4 pt-2">
              <div className="bg-astro-cream/3 p-4 rounded-xl border border-astro-orange/10">
                <h4 className="font-semibold text-astro-orange text-sm sm:text-base mb-1.5">🌟 সাধারণ ব্যক্তিত্ব ও স্বভাব</h4>
                <p className="text-sm text-astro-cream/80 leading-relaxed">{report.general}</p>
              </div>

              <div className="bg-astro-cream/3 p-4 rounded-xl border border-astro-orange/10">
                <h4 className="font-semibold text-astro-orange text-sm sm:text-base mb-1.5">💼 কর্মজীবন ও আর্থিক অবস্থা</h4>
                <p className="text-sm text-astro-cream/80 leading-relaxed">{report.career}</p>
              </div>

              <div className="bg-astro-cream/3 p-4 rounded-xl border border-astro-orange/10">
                <h4 className="font-semibold text-astro-orange text-sm sm:text-base mb-1.5">🩺 স্বাস্থ্য ও সুস্থতা</h4>
                <p className="text-sm text-astro-cream/80 leading-relaxed">{report.health}</p>
              </div>

              <div className="bg-astro-cream/3 p-4 rounded-xl border border-astro-orange/10">
                <h4 className="font-semibold text-astro-orange text-sm sm:text-base mb-1.5">🔑 কুপ্রভাব কাটানোর প্রতিকার</h4>
                <p className="text-sm text-astro-cream/80 leading-relaxed">{report.remedy}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Form Entry State */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-astro-cream/70 mb-1.5">
                  পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="যেমন: সুব্রত মুখোপাধ্যায়"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-astro-dark border border-astro-orange/20 focus:border-astro-orange rounded-xl px-4 py-2.5 text-sm text-astro-cream outline-none transition-colors"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dob" className="block text-xs font-semibold text-astro-cream/70 mb-1.5">
                  জন্ম তারিখ *
                </label>
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  required
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full bg-astro-dark border border-astro-orange/20 focus:border-astro-orange rounded-xl px-4 py-2.5 text-sm text-astro-cream outline-none transition-colors"
                />
              </div>

              {/* Time of Birth */}
              <div>
                <label htmlFor="tob" className="block text-xs font-semibold text-astro-cream/70 mb-1.5">
                  জন্ম সময় (ঐচ্ছিক)
                </label>
                <input
                  type="time"
                  name="tob"
                  id="tob"
                  value={formData.tob}
                  onChange={handleInputChange}
                  className="w-full bg-astro-dark border border-astro-orange/20 focus:border-astro-orange rounded-xl px-4 py-2.5 text-sm text-astro-cream outline-none transition-colors"
                />
              </div>

              {/* Place of Birth */}
              <div>
                <label htmlFor="pob" className="block text-xs font-semibold text-astro-cream/70 mb-1.5">
                  জন্মস্থান *
                </label>
                <input
                  type="text"
                  name="pob"
                  id="pob"
                  required
                  placeholder="যেমন: কলকাতা, পশ্চিমবঙ্গ"
                  value={formData.pob}
                  onChange={handleInputChange}
                  className="w-full bg-astro-dark border border-astro-orange/20 focus:border-astro-orange rounded-xl px-4 py-2.5 text-sm text-astro-cream outline-none transition-colors"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-astro-orange to-astro-gold text-astro-dark font-bold text-sm sm:text-base py-3 rounded-xl hover:brightness-110 shadow-lg shadow-astro-orange/15 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>🔮 কুন্ডলী তৈরি করুন</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
