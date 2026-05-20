import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "সময়ের সময় | Somoyer somoy - বাংলা জ্যোতিষ ও রাশিফল",
  description: "সময়ের সময় - সঠিক ও নির্ভরযোগ্য বাংলা রাশিফল, ট্যারোট কার্ড রিডিং, পঞ্জিকা, সংখ্যাবিজ্ঞান এবং হস্তরেখাবিদ্যা। আমাদের অভিজ্ঞ জ্যোতিষী ও এআই জ্যোতিষীর সাথে কথা বলুন।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#0b0c10] text-[#fffce7] font-sans">
        {children}
      </body>
    </html>
  );
}
