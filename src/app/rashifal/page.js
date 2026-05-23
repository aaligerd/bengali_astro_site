import Navbar from "@/components/Navbar";
import { getZodiacs } from "@/lib/get-zodiacs";
import RashifalContent from "@/components/RashifalContent";
import { Suspense } from "react";

export const revalidate = 3600; // Revalidate static page every hour (or on-demand)

export default async function RashifalPage() {
  const zodiacData = await getZodiacs();

  return (
    <div className="flex flex-col min-h-screen max-w-full overflow-x-hidden">
      <Navbar />
      
      {/* Banner */}
      <div className="bg-astro-deep py-6 sm:py-8 border-b border-astro-orange/10 text-center px-4">
        <h1 className="text-xl sm:text-3xl font-extrabold text-astro-cream">দৈনিক ও দীর্ঘমেয়াদী রাশিফল</h1>
        <p className="text-3xs sm:text-sm text-astro-cream/50 mt-2">আপনার রাশি অনুযায়ী আজকের দিন, সপ্তাহ, মাস এবং বছরের পূর্বাভাস জেনে নিন</p>
      </div>

      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center py-20 text-astro-orange animate-pulse">
          লোডিং রাশিফল...
        </div>
      }>
        <RashifalContent initialData={zodiacData} />
      </Suspense>

      {/* Footer */}
      <footer className="border-t border-astro-orange/10 bg-astro-deep py-6 text-center text-xs text-astro-cream/50 mt-auto">
        <p>© {new Date().getFullYear()} সময়ের সময়। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
}
