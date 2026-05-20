import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: "সময়ের সময় | Somoyer somoy - বাংলা জ্যোতিষ ও রাশিফল",
    template: "%s | সময়ের সময়"
  },
  description: "সময়ের সময় - সঠিক ও নির্ভরযোগ্য বাংলা রাশিফল, ট্যারোট কার্ড রিডিং, পঞ্জিকা, সংখ্যাবিজ্ঞান এবং হস্তরেখাবিদ্যা। আমাদের অভিজ্ঞ জ্যোতিষী ও এআই জ্যোতিষীর সাথে কথা বলুন।",
  keywords: ["জ্যোতিষ", "রাশিফল", "ট্যারোট", "পঞ্জিকা", "সংখ্যাবিজ্ঞান", "হস্তরেখাবিদ্যা", "আজকের রাশিফল", "বাংলা রাশিফল", "Somoyer somoy", "bengali astrology", "rashifal"],
  authors: [{ name: "সময়ের সময়" }],
  creator: "সময়ের সময়",
  publisher: "সময়ের সময়",
  openGraph: {
    title: "সময়ের সময় | Somoyer somoy - বাংলা জ্যোতিষ ও রাশিফল",
    description: "সময়ের সময় - সঠিক ও নির্ভরযোগ্য বাংলা রাশিফল, ট্যারোট কার্ড রিডিং, পঞ্জিকা, সংখ্যাবিজ্ঞান এবং হস্তরেখাবিদ্যা।",
    url: "https://somoyersomoy.com",
    siteName: "সময়ের সময়",
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "সময়ের সময় - বাংলা জ্যোতিষ ও রাশিফল",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "সময়ের সময় | Somoyer somoy - বাংলা জ্যোতিষ ও রাশিফল",
    description: "সময়ের সময় - সঠিক ও নির্ভরযোগ্য বাংলা রাশিফল, ট্যারোট কার্ড রিডিং, পঞ্জিকা, সংখ্যাবিজ্ঞান এবং হস্তরেখাবিদ্যা।",
    images: ["/og-image.png"],
    creator: "@somoyersomoy",
    site: "@somoyersomoy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#0b0c10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
