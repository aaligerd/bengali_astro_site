"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function AIChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "প্রণাম! আমি আপনার সময়ের সময় এআই জ্যোতিষী (AI Astrologer)। গ্রহ ও নক্ষত্রের আলোয় আপনার যেকোনো প্রশ্নের উত্তর দিতে আমি প্রস্তুত। আপনার নাম এবং জিজ্ঞাসাটি লিখুন (যেমন: ক্যারিয়ার, বিয়ে, স্বাস্থ্য বা ব্যবসার বিষয়ে)।",
      time: "এখন"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Pre-programmed responses for Bengali keyword matches
  const getAIResponse = (userText) => {
    const text = userText.toLowerCase();
    
    if (text.includes("বিয়ে") || text.includes("বিবাহ") || text.includes("প্রেম") || text.includes("বিয়ে")) {
      return "আপনার কুন্ডলী অনুযায়ী শুক্র ও বৃহস্পতি গ্রহের অবস্থান মাঝারিভাবে অনুকূল। বিবাহের যোগ আগামী দেড় বছরের মধ্যে খুব জোরালো। তবে দাম্পত্য সুখ বজায় রাখতে একে অপরের প্রতি বিশ্বাস ও ধৈর্য বাড়ানো প্রয়োজন। কোনো সিদ্ধান্ত নেওয়ার আগে কুন্ডলী মিলিয়ে নেওয়া ভালো।";
    }
    if (text.includes("চাকরি") || text.includes("চাকুরী") || text.includes("ক্যারিয়ার") || text.includes("কর্ম") || text.includes("চাকরী")) {
      return "কর্মক্ষেত্রে আপনার রাশির অধিপতি গ্রহ মঙ্গলের প্রভাব স্পষ্ট। আগামী কয়েক মাস আপনার কঠোর পরিশ্রমের ফল পেতে শুরু করবেন। উচ্চপদস্থ কর্মকর্তাদের সাথে সুসম্পর্ক বজায় রাখুন। নতুন চাকরির সন্ধান করতে চাইলে এই মাসের ১৫ তারিখের পর শুভ সময়।";
    }
    if (text.includes("ব্যবসা") || text.includes("বানিজ্য") || text.includes("ব্যবসায়")) {
      return "ব্যবসায়ীদের জন্য বুধ গ্রহের প্রভাব ইতিবাচক হতে চলেছে। অংশীদারি ব্যবসায় লাভ হবে, তবে নতুন কোনো বড় চুক্তি করার আগে শর্তাবলী ভালো করে পড়ে নিন। উত্তর দিকে মুখ করে টাকা গোছানো বা ব্যবসার প্রধান বসার জায়গা স্থাপন করা শুভ।";
    }
    if (text.includes("স্বাস্থ্য") || text.includes("শরীর") || text.includes("অসুখ")) {
      return "আপনার শরীর নিয়ে খুব বড় কোনো আশঙ্কার যোগ নেই, তবে জল ও হজমজনিত ছোটখাটো সমস্যা দেখা দিতে পারে। আপনার রাশির দ্বাদশ ভাবে রাহু থাকার কারণে কিছুটা মানসিক উদ্বেগ থাকতে পারে। নিয়মিত প্রাণায়াম করার চেষ্টা করুন।";
    }
    if (text.includes("রত্ন") || text.includes("পাথর") || text.includes("উপায়") || text.includes("শুভ")) {
      return "আপনার জন্য শুভ রত্ন ও শুভ সংখ্যা আপনার লগ্ন সাপেক্ষে নির্ধারিত হয়। মেষ রাশির জন্য প্রবাল, বৃষের জন্য ওপাল বা হীরা এবং মিথুনের জন্য পান্না অতি শুভ। আপনার জন্ম তারিখ উল্লেখ করলে আমি আরও সঠিক শুভ রত্ন বলতে পারব।";
    }
    
    return "আপনার প্রশ্নটি আমার গোচরে এসেছে। মহাবিশ্বের নক্ষত্ররাজি নির্দেশ করছে যে আপনি এখন একটি সিদ্ধান্ত নেওয়ার সন্ধিক্ষণে দাঁড়িয়ে আছেন। আপনার জন্মতারিখ এবং জন্মস্থানটি অনুগ্রহ করে বলুন, অথবা প্রশ্নটি আরও একটু বিস্তারিতভাবে লিখুন (যেমন: ক্যারিয়ার উন্নতি কবে হবে?)।";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responseText = getAIResponse(currentInput);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: responseText,
          time: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0c10]">
      {/* Mini Chat Navbar */}
      <nav className="border-b border-astro-orange/15 bg-[#050508]/90 py-3 px-4 sm:px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-3">
          <Link href="/" className="text-astro-cream hover:text-astro-orange transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-2xl animate-pulse-slow">🤖</span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-astro-orange leading-tight">এআই জ্যোতিষী (AI Astrologer)</h2>
              <span className="text-4xs text-green-400 flex items-center font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-ping" /> অনলাইন পরামর্শ
              </span>
            </div>
          </div>
        </div>
        <Link
          href="/consult"
          className="text-xxs sm:text-xs bg-astro-orange hover:brightness-110 text-astro-dark font-bold px-3 py-1.5 rounded-full transition-all"
        >
          📞 লাইভ কল করুন
        </Link>
      </nav>

      {/* Messages Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full scrollbar-thin">
        {messages.map((msg) => {
          const isAI = msg.sender === "ai";
          return (
            <div
              key={msg.id}
              className={`flex ${isAI ? "justify-start" : "justify-end"} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm sm:text-base leading-relaxed ${
                  isAI
                    ? "bg-astro-cream/5 border border-astro-orange/15 text-astro-cream rounded-tl-none"
                    : "bg-astro-orange text-astro-dark font-medium rounded-tr-none shadow-md shadow-astro-orange/5"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className={`block text-5xs text-right mt-1.5 ${
                  isAI ? "text-astro-cream/45" : "text-astro-dark/50"
                }`}>
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-astro-cream/5 border border-astro-orange/10 rounded-2xl rounded-tl-none p-4 flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-astro-orange rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-astro-orange rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-astro-orange rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input panel */}
      <div className="border-t border-astro-orange/10 bg-[#050508]/85 p-3 sm:p-4 shrink-0">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex items-center space-x-2">
          <input
            type="text"
            required
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="আপনার প্রশ্নটি এখানে লিখুন (যেমন: চাকরি কবে হবে?)..."
            className="flex-1 bg-[#0b0c10] border border-astro-orange/20 focus:border-astro-orange rounded-xl px-4 py-3 text-xs sm:text-sm text-astro-cream outline-none transition-colors"
          />
          <button
            type="submit"
            className="bg-astro-orange text-astro-dark hover:brightness-110 p-3 rounded-xl shadow-md transition-all shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
