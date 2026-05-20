"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function NumerologyPage() {
  const [dob, setDob] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateNumbers = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split("-"); // [YYYY, MM, DD]
    const yearStr = parts[0];
    const monthStr = parts[1];
    const dayStr = parts[2];

    // 1. Mulaank (Sum of Day digits reduced to single digit 1-9)
    const sumDigits = (str) => {
      let sum = str.split("").reduce((acc, digit) => acc + parseInt(digit), 0);
      while (sum > 9) {
        sum = sum.toString().split("").reduce((acc, digit) => acc + parseInt(digit), 0);
      }
      return sum;
    };

    const mulaank = sumDigits(dayStr);

    // 2. Bhagyank (Sum of all digits: DD + MM + YYYY reduced to single digit 1-9)
    const fullStr = dayStr + monthStr + yearStr;
    const bhagyank = sumDigits(fullStr);

    const numerologyData = {
      1: {
        ruler: "সূর্য (Sun)",
        traits: "স্বাধীনচেতা, নেতৃত্ব দিতে ভালোবাসেন, আত্মবিশ্বাসী এবং উচ্চাকাঙ্ক্ষী। আপনি জন্মগতভাবেই একজন পথপ্রদর্শক ও দূরদর্শী নেতা।",
        career: "সরকারি চাকুরি, প্রশাসনিক পদ, ব্যবসা বা যেকোনো ম্যানেজমেন্ট রোল আপনার জন্য উপযোগী।",
        color: "হলুদ এবং সোনালী",
        stone: "চুনি (Ruby)"
      },
      2: {
        ruler: "চন্দ্র (Moon)",
        traits: "শান্ত স্বভাবের, সৃজনশীল, সংবেদনশীল এবং সহানুভূতিশীল। আপনি দারুণ শান্তিকামী এবং অন্যদের সাথে মিলেমিশে কাজ করতে ভালোবাসেন।",
        career: "কলা, লেখালেখি, পরামর্শদাতা, স্বাস্থ্য বা সেবাখাতে আপনি দারুণ উন্নতি করতে পারবেন।",
        color: "সাদা এবং রূপালী",
        stone: "মুক্তা (Pearl)"
      },
      3: {
        ruler: "বৃহস্পতি (Jupiter)",
        traits: "জ্ঞানী, আশাবাদী, মিশুকে এবং ভালো বক্তা। আপনি শিক্ষা দিতে এবং অন্যদের অনুপ্রাণিত করতে খুব ভালোবাসেন।",
        career: "শিক্ষকতা, আইন পেশা, সাহিত্যচর্চা, উপদেশক এবং ধর্মীয় প্রতিষ্ঠান সম্পর্কিত কাজ শুভ।",
        color: "হলুদ ও উজ্জ্বল বেগুনি",
        stone: "হলুদ পোখরাজ (Yellow Sapphire)"
      },
      4: {
        ruler: "রাহু (Rahu)",
        traits: "বাস্তববাদী, নিয়মতান্ত্রিক, পরিশ্রমী এবং বিপ্লবী। আপনি চটজলদি প্রথাগত চিন্তার বাইরে গিয়ে সমস্যার সমাধান করতে পারেন।",
        career: "আইটি ক্ষেত্র, প্রকৌশলবিদ্যা, গবেষণা এবং সাংগঠনিক কাজ আপনার জন্য আদর্শ।",
        color: "ধূসর ও নীল",
        stone: "গোমেদ (Hessonite)"
      },
      5: {
        ruler: "বুধ (Mercury)",
        traits: "বুদ্ধিদীপ্ত, চটপটে, ভ্রমণপ্রিয় এবং দারুণ কমিউনিকেটর। আপনি যেকোনো নতুন পরিবেশ বা কাজের সাথে খুব দ্রুত খাপ খাওয়াতে পারেন।",
        career: "সাংবাদিকতা, জনসংযোগ, মার্কেটিং, ট্রেডিং এবং বিনোদন জগতে দারুণ সাফল্য পাবেন।",
        color: "সবুজ ও হালকা রং",
        stone: "পান্না (Emerald)"
      },
      6: {
        ruler: "শুক্র (Venus)",
        traits: "প্রেমময়, শৈল্পিক, দায়িত্বশীল এবং সৌন্দর্যের পূজারী। আপনি ঘরবাড়ি ও পরিবার গোছাতে এবং সাজিয়ে রাখতে ভালোবাসেন।",
        career: "ফ্যাশন ডিজাইন, হোটেল ম্যানেজমেন্ট, সংগীত, অভিনয় এবং লাক্সারি পণ্যের ব্যবসা চমৎকার হবে।",
        color: "সাদা এবং হালকা নীল",
        stone: "হীরা (Diamond)"
      },
      7: {
        ruler: "কেতু (Ketu)",
        traits: "দার্শনিক, রহস্যপ্রিয়, আধ্যাত্মিক এবং গবেষক স্বভাবের। আপনি লোকচক্ষুর অন্তরালে থেকে গভীর চিন্তা করতে ভালোবাসেন।",
        career: "আধ্যাত্মিক বিদ্যা, মনোবিজ্ঞান, জ্যোতিষশাস্ত্র এবং বৈজ্ঞানিক গবেষণায় যুক্ত থাকলে উন্নতি নিশ্চিত।",
        color: "হালকা সবুজ এবং হালকা ধূসর",
        stone: "ক্যাটস আই (Cat's Eye)"
      },
      8: {
        ruler: "শনি (Saturn)",
        traits: "পরিশ্রমী, বাস্তববাদী, সুশৃঙ্খল এবং অত্যন্ত ধৈর্যশীল। আপনি জীবনের যেকোনো পরিস্থিতি সামলাতে প্রস্তুত থাকেন এবং বিলম্বে হলেও বড় সাফল্য লাভ করেন।",
        career: "আইন, রিয়েল এস্টেট, লোহার ব্যবসা, কয়লা বা খনি শিল্পে যুক্ত হলে লাভবান হবেন।",
        color: "কালো এবং গাঢ় নীল",
        stone: "নীলা (Blue Sapphire)"
      },
      9: {
        ruler: "মঙ্গল (Mars)",
        traits: "সাহসী, যোদ্ধা স্বভাবের, পরোপকারী এবং উগ্র মেজাজী। যেকোনো অন্যায়ের বিরুদ্ধে লড়াই করতে আপনি পিছপা হন না।",
        career: "সেনাবাহিনী, পুলিশ, খেলাধুলা, সার্জারি এবং লোহা-লক্কড়ের কারখানায় কাজ করা আপনার জন্য শুভ।",
        color: "লাল ও কমলা",
        stone: "রক্তমুখী প্রবাল (Coral)"
      }
    };

    return {
      mulaank,
      bhagyank,
      mulaankDetails: numerologyData[mulaank],
      bhagyankDetails: numerologyData[bhagyank]
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dob) return;

    setLoading(true);
    setReport(null);

    setTimeout(() => {
      const generated = calculateNumbers(dob);
      setReport(generated);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl">
        {/* Title */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-widest text-astro-orange uppercase border border-astro-orange/20 px-3 py-1 rounded-full bg-astro-orange/5">
            সংখ্যাবিজ্ঞান বিশ্লেষণ
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-astro-cream">
            আপনার মূলাঙ্ক ও ভাগ্যাঙ্ক জানুন
          </h1>
          <p className="mt-3 text-sm sm:text-base text-astro-cream/70 max-w-xl mx-auto">
            আপনার জন্মতারিখের সংখ্যার সাথে মহাজাগতিক স্পন্দনের গভীর যোগাযোগ রয়েছে। আপনার জন্মতারিখ বসিয়ে জেনে নিন আপনার জীবন পরিচালনাকারী মূল শক্তি।
          </p>
        </div>

        {/* Input Form Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-astro-orange/15 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label htmlFor="dob-input" className="block text-xs font-semibold text-astro-cream/70 mb-2">
                জন্ম তারিখ নির্বাচন করুন *
              </label>
              <input
                type="date"
                id="dob-input"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-astro-dark border border-astro-orange/20 focus:border-astro-orange rounded-xl px-4 py-2.5 text-sm text-astro-cream outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-astro-orange to-astro-gold text-astro-dark font-bold px-8 py-3 rounded-xl hover:brightness-110 shadow-lg shadow-astro-orange/10 transition-all duration-300 whitespace-nowrap"
            >
              {loading ? "গণনা করা হচ্ছে..." : "🔢 গণনা করুন"}
            </button>
          </form>
        </div>

        {/* Display Result Report */}
        {loading && (
          <div className="text-center py-12 text-astro-orange animate-pulse">
            <span className="text-4xl">🔢</span>
            <p className="mt-2 text-sm font-semibold">আপনার সংখ্যার সংমিশ্রণ গণনা করা হচ্ছে...</p>
          </div>
        )}

        {report && (
          <div className="space-y-6 animate-fade-in">
            {/* Numbers Summary Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mulaank Panel */}
              <div className="glass-panel p-6 rounded-2xl border border-astro-orange/25 text-center relative overflow-hidden bg-gradient-to-b from-astro-orange/5 to-transparent">
                <span className="text-xs text-astro-orange uppercase font-semibold">আপনার মূলাঙ্ক (Mulaank)</span>
                <span className="block text-6xl font-extrabold text-astro-cream my-3">{report.mulaank}</span>
                <p className="text-xs text-astro-cream/60">
                  (জন্মদিনের সংখ্যার একক যোগফল)
                </p>
                <div className="mt-4 pt-4 border-t border-astro-orange/10 text-left space-y-2 text-xs sm:text-sm">
                  <p><span className="text-astro-orange font-semibold">অধিপতি গ্রহ:</span> {report.mulaankDetails.ruler}</p>
                  <p><span className="text-astro-orange font-semibold">চরিত্র:</span> {report.mulaankDetails.traits}</p>
                </div>
              </div>

              {/* Bhagyank Panel */}
              <div className="glass-panel p-6 rounded-2xl border border-astro-orange/25 text-center relative overflow-hidden bg-gradient-to-b from-astro-gold/5 to-transparent">
                <span className="text-xs text-astro-gold uppercase font-semibold">আপনার ভাগ্যাঙ্ক (Bhagyank)</span>
                <span className="block text-6xl font-extrabold text-astro-cream my-3">{report.bhagyank}</span>
                <p className="text-xs text-astro-cream/60">
                  (সম্পূর্ণ জন্মতারিখের সংখ্যার একক যোগফল)
                </p>
                <div className="mt-4 pt-4 border-t border-astro-orange/10 text-left space-y-2 text-xs sm:text-sm">
                  <p><span className="text-astro-gold font-semibold">অধিপতি গ্রহ:</span> {report.bhagyankDetails.ruler}</p>
                  <p><span className="text-astro-gold font-semibold">চরিত্র:</span> {report.bhagyankDetails.traits}</p>
                </div>
              </div>
            </div>

            {/* Practical Guides */}
            <div className="glass-panel p-6 rounded-2xl border border-astro-orange/15 space-y-4">
              <h3 className="text-lg font-bold text-astro-orange border-b border-astro-orange/10 pb-2">
                সংখ্যাবিজ্ঞান অনুযায়ী আপনার দৈনন্দিন দিকনির্দেশ
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2.5">
                  <h4 className="font-semibold text-astro-cream">💼 আদর্শ ক্যারিয়ার বিকল্প:</h4>
                  <p className="text-astro-cream/70 leading-relaxed">{report.mulaankDetails.career}</p>
                  
                  <h4 className="font-semibold text-astro-cream mt-4">💎 শুভ রত্ন ধারণ:</h4>
                  <p className="text-astro-cream/70 leading-relaxed">{report.mulaankDetails.stone}</p>
                </div>
                
                <div className="space-y-2.5">
                  <h4 className="font-semibold text-astro-cream">🎨 শুভ রং ও কম্পন:</h4>
                  <p className="text-astro-cream/70 leading-relaxed">
                    আপনার জন্য শুভ রং হল <span className="text-astro-orange font-medium">{report.mulaankDetails.color}</span>। যেকোনো গুরুত্বপূর্ণ কাজে যাওয়ার আগে এই রঙের জামাকাপড় পরলে সফলতা আসার সম্ভাবনা বৃদ্ধি পায়।
                  </p>

                  <h4 className="font-semibold text-astro-cream mt-4">📅 সপ্তাহের শুভ দিন:</h4>
                  <p className="text-astro-cream/70 leading-relaxed">
                    সপ্তাহের যেকোনো রবিবার ও বৃহস্পতিবার আপনার জন্য অত্যন্ত শুভ কম্পন বহন করবে।
                  </p>
                </div>
              </div>
            </div>
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
