import Navbar from "@/components/Navbar";
import ZodiacHero from "@/components/ZodiacHero";
import PersonalReportForm from "@/components/PersonalReportForm";
import Link from "next/link";

export default function Home() {
  const featureList = [
    {
      title: "ট্যারোট কার্ড রিডিং",
      description: "প্রেম, স্বাস্থ্য ও ক্যারিয়ার সম্পর্কে জানতে একটি কার্ড নির্বাচন করুন এবং তাত্ক্ষণিক সমাধান পান।",
      icon: "🃏",
      link: "/tarot"
    },
    {
      title: "বাঙালি পঞ্জিকা ২০২৬",
      description: "দৈনিক শুভ সময়, অমৃতযোগ, তিথি, নক্ষত্র এবং রাহুকাল জানার নির্ভরযোগ্য মাধ্যম।",
      icon: "📅",
      link: "/panjika"
    },
    {
      title: "সংখ্যাবিজ্ঞান গণনা",
      description: "আপনার জন্মতারিখের গণনা করে আপনার মূলাঙ্ক এবং ভাগ্য সংখ্যা সম্পর্কিত গূঢ় রহস্য উন্মোচন করুন।",
      icon: "🔢",
      link: "/numerology"
    },
    {
      title: "হস্তরেখাবিদ্যা গাইড",
      description: "আপনার হাতের জীবন রেখা, হৃদয় রেখা এবং মস্তিষ্ক রেখার মানে কী, তা সহজ চিত্রে বুঝে নিন।",
      icon: "✋",
      link: "/palmistry"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Welcome Banner */}
      <main className="flex-1">
        {/* Banner Section */}
        <div className="relative py-12 overflow-hidden text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-astro-orange/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-xl sm:text-2xl font-semibold text-astro-orange animate-float">
            সময়ের চক্রে জীবনের খোঁজ
          </h2>
          <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold text-astro-cream tracking-tight">
            সময়ের সময়
          </h1>
          <p className="mt-4 text-sm sm:text-base text-astro-cream/60 max-w-xl mx-auto">
            আপনার জীবনে গ্রহ, রাশি এবং নক্ষত্রের শুভ প্রভাবের সম্পূর্ণ বিশ্লেষণ। আমরা আপনার বর্তমান ও ভবিষ্যতের সঠিক পথপ্রদর্শক।
          </p>
        </div>

        {/* Zodiac Grid Section */}
        <ZodiacHero />

        {/* Interactive Feature Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-astro-cream">আমাদের অন্যান্য সেবাসমূহ</h2>
            <p className="mt-2 text-xs sm:text-sm text-astro-cream/60">বেদ ও বৈদিক বিজ্ঞানের ভিত্তিতে তৈরি আমাদের অন্যান্য দরকারী জ্যোতিষ টুলস</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureList.map((feat, index) => (
              <Link 
                key={index} 
                href={feat.link}
                className="glass-panel glass-panel-hover p-6 rounded-xl block cursor-pointer"
              >
                <span className="text-3xl mb-4 block">{feat.icon}</span>
                <h3 className="text-lg font-bold text-astro-orange mb-2">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-astro-cream/70 leading-relaxed">{feat.description}</p>
                <span className="text-xs text-astro-orange mt-4 inline-block font-semibold hover:underline">
                  শুরু করুন ➔
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* AI & Real Astrologer Double CTA */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AI Astrologer Card */}
            <div className="glass-panel p-8 rounded-2xl border border-astro-orange/20 relative overflow-hidden flex flex-col justify-between h-80">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-astro-orange/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <span className="text-4xl mb-4 block">🤖</span>
                <h3 className="text-2xl font-bold text-astro-cream">এআই জ্যোতিষীর সাথে চ্যাট</h3>
                <p className="mt-2 text-sm text-astro-cream/70 leading-relaxed">
                  আপনার যেকোনো প্রশ্ন যেমন ক্যারিয়ার, বিবাহ, শিক্ষা কিংবা পারিবারিক সমস্যা নিয়ে আমাদের অত্যাধুনিক এআই জ্যোতিষীর সাথে সম্পূর্ণ বিনামূল্যে চ্যাট করুন। তাত্ক্ষণিক উত্তর পান।
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/chat-ai"
                  className="inline-block bg-transparent border border-astro-orange text-astro-orange hover:bg-astro-orange hover:text-astro-dark px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300"
                >
                  চ্যাট শুরু করুন (ফ্রি)
                </Link>
              </div>
            </div>

            {/* Real Astrologer Card */}
            <div className="glass-panel p-8 rounded-2xl border border-astro-orange/20 relative overflow-hidden flex flex-col justify-between h-80 bg-gradient-to-br from-astro-orange/5 to-transparent">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-astro-gold/15 rounded-full blur-2xl pointer-events-none" />
              <div>
                <span className="text-4xl mb-4 block">📞</span>
                <h3 className="text-2xl font-bold text-astro-cream">অভিজ্ঞ জ্যোতিষীর সাথে পরামর্শ</h3>
                <p className="mt-2 text-sm text-astro-cream/70 leading-relaxed">
                  ভারতের স্বর্ণপদকপ্রাপ্ত অভিজ্ঞ জ্যোতিষীদের সাথে প্রতি মিনিটে ন্যূনতম মূল্যে লাইভ ফোন কল বা চ্যাটে কথা বলুন। নিশ্চিত গোপনীয়তা ও ১০০% সঠিক সমাধানের নিশ্চয়তা।
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/consult"
                  className="inline-block bg-gradient-to-r from-astro-orange to-astro-gold text-astro-dark hover:brightness-110 shadow-lg shadow-astro-orange/10 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300"
                >
                  লাইভ কথা বলুন (₹১৫/মিঃ)
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Personalized Vedic Report Section */}
        <PersonalReportForm />
      </main>

      {/* Footer */}
      <footer className="border-t border-astro-orange/10 bg-astro-deep py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left sm:flex sm:justify-between sm:items-center">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-lg font-bold text-astro-orange">সময়ের সময়</h2>
            <p className="text-xs text-astro-cream/50 mt-1">© {new Date().getFullYear()} সময়ের সময় জ্যোতিষ সেবাসমূহ। সর্বস্বত্ব সংরক্ষিত।</p>
          </div>
          <div className="flex justify-center space-x-6 text-xs text-astro-cream/60">
            <Link href="/rashifal" className="hover:text-astro-orange transition-colors">রাশিফল</Link>
            <Link href="/tarot" className="hover:text-astro-orange transition-colors">ট্যারোট</Link>
            <Link href="/panjika" className="hover:text-astro-orange transition-colors">পঞ্জিকা</Link>
            <Link href="/chat-ai" className="hover:text-astro-orange transition-colors">এআই চ্যাট</Link>
            <Link href="/consult" className="hover:text-astro-orange transition-colors">পরামর্শ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
