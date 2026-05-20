"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navLinks = [
    { name: "রাশিফল", href: "/rashifal" },
    { name: "ট্যারোট", href: "/tarot" },
    { name: "পঞ্জিকা", href: "/panjika" },
    { name: "সংখ্যাবিজ্ঞান", href: "/numerology" },
    { name: "হস্তরেখাবিদ্যা", href: "/palmistry" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-astro-orange/15 bg-astro-dark backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl animate-pulse-slow">✨</span>
              <span className="text-lg sm:text-xl font-bold tracking-wider text-astro-orange transition-colors duration-300 group-hover:text-astro-cream">
                সময়ের সময়
              </span>
              <span className="text-3xs text-astro-cream/60 hidden xs:inline-block border border-astro-orange/30 px-1.5 py-0.5 rounded-sm">
                Astrology
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-6 flex items-baseline space-x-2 lg:space-x-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-2.5 py-2 rounded-md text-xs lg:text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-astro-dark bg-astro-orange shadow-md shadow-astro-orange/20"
                        : "text-astro-cream/85 hover:text-astro-orange hover:bg-astro-orange/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Action Buttons & Theme Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-astro-orange/25 text-astro-orange hover:bg-astro-orange/10 transition-all duration-300"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            )}

            {/* Desktop-only action links */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link
                href="/chat-ai"
                className="px-3 py-1.5 rounded-full text-xxs lg:text-xs font-semibold border border-astro-orange/30 text-astro-cream hover:bg-astro-orange/10 transition-all duration-300 whitespace-nowrap"
              >
                🤖 এআই জ্যোতিষী
              </Link>
              <Link
                href="/consult"
                className="px-3 py-1.5 rounded-full text-xxs lg:text-xs font-semibold bg-gradient-to-r from-astro-orange to-astro-gold text-astro-dark hover:brightness-110 shadow-lg shadow-astro-orange/10 transition-all duration-300 whitespace-nowrap"
              >
                📞 জ্যোতিষী পরামর্শ
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-astro-cream hover:bg-astro-orange/10 hover:text-astro-orange focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <svg
                    className="block h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    className="block h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100 border-t border-astro-orange/10" : "max-h-0 opacity-0 overflow-hidden"
        }`}
        id="mobile-menu"
      >
        <div className="space-y-1 px-2 pb-3 pt-2 bg-astro-dark/95 backdrop-blur-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-md px-3 py-2.5 text-sm sm:text-base font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-astro-orange text-astro-dark font-semibold"
                    : "text-astro-cream hover:bg-astro-orange/5 hover:text-astro-orange"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="mt-4 pt-4 border-t border-astro-orange/10 flex flex-col space-y-2 px-3">
            <Link
              href="/chat-ai"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 rounded-md text-xs sm:text-sm font-semibold border border-astro-orange/30 text-astro-cream hover:bg-astro-orange/10"
            >
              🤖 এআই জ্যোতিষী চ্যাট
            </Link>
            <Link
              href="/consult"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 rounded-md text-xs sm:text-sm font-semibold bg-astro-orange text-astro-dark hover:brightness-110"
            >
              📞 জ্যোতিষী লাইভ পরামর্শ
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
