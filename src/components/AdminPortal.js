"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { zodiacData as defaultZodiacData } from "@/data/zodiacData";

export default function AdminPortal({ initialData }) {
  const [data, setData] = useState(initialData || []);
  
  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Navigation states
  const [activeTab, setActiveTab] = useState("edit_horoscope"); // edit_horoscope, create_admin, activity_logs, bulk_update

  // Forms & Logs states
  const [selectedSignId, setSelectedSignId] = useState("1001");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // New admin form states
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [createAdminError, setCreateAdminError] = useState("");
  const [createAdminSuccess, setCreateAdminSuccess] = useState("");
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);

  // Activity logs states
  const [logs, setLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [logsPage, setLogsPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogsCount, setTotalLogsCount] = useState(0);

  // CSV Bulk update states
  const [csvFile, setCsvFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);
  const [csvError, setCsvError] = useState("");
  const [csvSuccess, setCsvSuccess] = useState("");
  const [isUploadingCsv, setIsUploadingCsv] = useState(false);

  // Check auth session cookie on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/admin/session");
        if (response.ok) {
          const session = await response.json();
          if (session.authenticated) {
            setIsAuthenticated(true);
            setAdminUser(session.username);
          }
        }
      } catch (err) {
        console.error("Session verification failed:", err);
      } finally {
        setIsLoading(false);
      }
    }
    checkSession();
  }, []);

  // Fetch activity logs
  useEffect(() => {
    if (activeTab === "activity_logs" && isAuthenticated) {
      fetchLogs(logsPage);
    }
  }, [activeTab, isAuthenticated, logsPage]);

  const fetchLogs = async (page = 1) => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch(`/api/admin/logs?page=${page}&limit=10`);
      if (res.ok) {
        const logData = await res.json();
        setLogs(logData.logs || []);
        setTotalPages(logData.totalPages || 1);
        setTotalLogsCount(logData.totalCount || 0);
      } else {
        showNotification("অ্যাক্টিভিটি লগ লোড করতে ব্যর্থ হয়েছে", "warning");
      }
    } catch (e) {
      console.error(e);
      showNotification("লগ লোড করার সময় সার্ভার ত্রুটি হয়েছে", "error");
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });

      if (response.ok) {
        const result = await response.json();
        setIsAuthenticated(true);
        setAdminUser(result.username);
        showNotification("লগইন সফল হয়েছে!", "success");
        setLoginUsername("");
        setLoginPassword("");
      } else {
        const errorResult = await response.json();
        setErrorMsg(errorResult.error || "ইউজারনেম বা পাসওয়ার্ড ভুল!");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("সার্ভারে কানেক্ট করতে ব্যর্থ হয়েছে!");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });
      if (response.ok) {
        setIsAuthenticated(false);
        setAdminUser("");
        setActiveTab("edit_horoscope");
        showNotification("লগআউট সফল হয়েছে!", "success");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setIsAuthenticated(false);
      setAdminUser("");
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreateAdminError("");
    setCreateAdminSuccess("");

    if (newPassword !== newPasswordConfirm) {
      setCreateAdminError("পাসওয়ার্ড দুটি মেলেনি!");
      return;
    }

    setIsSubmittingAdmin(true);
    try {
      const response = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });

      const result = await response.json();
      if (response.ok) {
        setCreateAdminSuccess(result.message || "নতুন অ্যাডমিন সফলভাবে তৈরি করা হয়েছে।");
        setNewUsername("");
        setNewPassword("");
        setNewPasswordConfirm("");
        showNotification("নতুন অ্যাডমিন তৈরি সফল হয়েছে!", "success");
      } else {
        setCreateAdminError(result.error || "অ্যাডমিন তৈরি করতে ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      console.error(err);
      setCreateAdminError("সার্ভার ত্রুটি, অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmittingAdmin(false);
    }
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
      const response = await fetch("/api/horoscope", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: data,
        }),
      });

      if (response.ok) {
        localStorage.setItem("astro_zodiac_data", JSON.stringify(data));
        showNotification("সার্ভার এবং ব্রাউজারে সফলভাবে ডেটা সংরক্ষণ করা হয়েছে!", "success");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown server error");
      }
    } catch (error) {
      console.warn("API write failed, falling back to local storage:", error);
      localStorage.setItem("astro_zodiac_data", JSON.stringify(data));
      showNotification("লোকাল ব্রাউজারে সেভ হয়েছে (ডেটাবেজে সেভ হয়নি)।", "warning");
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

  // Client-side CSV Parser supporting RFC-4180 rules
  const parseCSVClient = (text) => {
    const lines = [];
    let row = [""];
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i + 1];
      if (c === '"') {
        if (inQuotes && next === '"') {
          row[row.length - 1] += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push("");
      } else if ((c === '\r' || c === '\n') && !inQuotes) {
        if (c === '\r' && next === '\n') i++;
        lines.push(row);
        row = [""];
      } else {
        row[row.length - 1] += c;
      }
    }
    if (row.length > 1 || row[0] !== "") {
      lines.push(row);
    }
    return lines;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
    setCsvError("");
    setCsvSuccess("");
    setCsvPreview([]);

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsed = parseCSVClient(text);
        if (parsed.length < 2) {
          setCsvError("সিএসভি ফাইলে কোনো ডেটা পাওয়া যায়নি!");
          return;
        }

        // Validate required headers
        const headers = parsed[0].map(h => h.trim().toLowerCase());
        const requiredColumns = ["id", "name", "englishname", "daily", "weekly", "monthly", "yearly"];
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
          setCsvError(`সিএসভি ফাইলে প্রয়োজনীয় কলাম অনুপস্থিত: ${missingColumns.join(", ")}`);
          return;
        }

        // Preview header + first 5 rows
        setCsvPreview(parsed.slice(0, 6)); 
      } catch (err) {
        setCsvError("ফাইলটি পার্স করতে সমস্যা হয়েছে!");
      }
    };
    reader.readAsText(file);
  };

  const handleUploadCsv = async () => {
    if (!csvFile) return;
    setIsUploadingCsv(true);
    setCsvError("");
    setCsvSuccess("");

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const csvText = event.target.result;
          const response = await fetch("/api/admin/bulk-update", {
            method: "POST",
            headers: { "Content-Type": "text/csv" },
            body: csvText,
          });

          const result = await response.json();
          if (response.ok) {
            setCsvSuccess(result.message);
            setCsvFile(null);
            setCsvPreview([]);
            showNotification("বাল্ক আপডেট সফল হয়েছে!", "success");
            // Force reload to let custom hooks get fresh data
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            setCsvError(result.error || "সিএসভি ফাইল আপলোড ব্যর্থ হয়েছে।");
          }
        } catch (err) {
          setCsvError("সার্ভার কানেকশন ত্রুটি হয়েছে।");
        } finally {
          setIsUploadingCsv(false);
        }
      };
      reader.readAsText(csvFile);
    } catch (err) {
      setCsvError("ফাইল পড়তে সমস্যা হয়েছে।");
      setIsUploadingCsv(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = ["id", "name", "englishName", "symbol", "dateBengali", "element", "ruler", "stone", "image", "daily", "weekly", "monthly", "yearly", "love", "career", "wealth", "business"];
    const csvRows = [headers.join(",")];
    
    for (const sign of data) {
      const row = [
        sign.id,
        sign.name,
        sign.englishName,
        sign.symbol || "",
        sign.dateBengali || "",
        sign.element || "",
        sign.ruler || "",
        sign.stone || "",
        sign.image || "",
        sign.horoscope?.daily || "",
        sign.horoscope?.weekly || "",
        sign.horoscope?.monthly || "",
        sign.horoscope?.yearly || "",
        sign.love || "",
        sign.career || "",
        sign.wealth || "",
        sign.business || ""
      ].map(val => `"${val.replace(/"/g, '""')}"`); // escape double quotes
      csvRows.push(row.join(","));
    }
    
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "zodiac_data_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeSign = getSelectedSign();

  // Full screen loading indicator while checking session
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-astro-deep text-astro-cream">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-astro-orange border-astro-orange/10 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-astro-cream/60">অ্যাডমিন সেশন চেক করা হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // Not authenticated login portal
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen max-w-full overflow-hidden bg-astro-deep text-astro-cream">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-astro-orange/20 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-astro-orange/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-astro-orange/5 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-6">
              <span className="text-5xl block mb-3 animate-pulse">🔒</span>
              <h2 className="text-2xl font-bold text-astro-orange">অ্যাডমিন পোর্টাল লগইন</h2>
              <p className="text-xs text-astro-cream/60 mt-1">রাশিফল ও রাশির অন্যান্য তথ্য নিয়ন্ত্রণ ব্যবস্থা</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-astro-orange/80 mb-1" htmlFor="username">
                  ইউজারনেম
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="admin"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-astro-deep/50 border border-astro-orange/30 rounded-xl px-4 py-2.5 text-center text-astro-cream placeholder-astro-cream/30 focus:outline-none focus:border-astro-orange text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-astro-orange/80 mb-1" htmlFor="password">
                  পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-astro-deep/50 border border-astro-orange/30 rounded-xl px-4 py-2.5 text-center text-astro-cream placeholder-astro-cream/30 focus:outline-none focus:border-astro-orange text-sm font-mono tracking-widest"
                  required
                />
              </div>

              {errorMsg && <p className="text-xs text-red-500 font-semibold text-center mt-2">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full bg-astro-orange hover:bg-astro-orange/90 text-astro-dark font-bold py-3 px-4 rounded-xl transition-all duration-300 transform active:scale-98 shadow-md hover:shadow-astro-orange/25 mt-2"
              >
                প্রবেশ করুন
              </button>
            </form>
            <div className="mt-6 text-center border-t border-astro-orange/10 pt-4">
              <p className="text-5xs text-astro-cream/40">ডিফল্ট অ্যাডমিন: <span className="font-mono text-astro-orange">admin</span> / <span className="font-mono text-astro-orange">admin123</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen max-w-full bg-astro-deep text-astro-cream">
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
            <span>নিয়ন্ত্রণ পোর্টাল</span>
          </h1>
          <p className="text-3xs sm:text-xxs text-astro-cream/60">
            অ্যাডমিন: <span className="text-astro-orange font-bold font-mono">{adminUser}</span> | রাশিফল ও লগ পর্যবেক্ষণ ব্যবস্থা।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-astro-cream/10 hover:bg-red-950/40 hover:text-red-400 border border-astro-cream/10 hover:border-red-500/25 px-3 py-1.5 rounded-lg text-xxs sm:text-xs font-semibold transition-all duration-300"
        >
          লগআউট
        </button>
      </div>

      {/* Sub-navigation tabs */}
      <div className="bg-astro-dark/30 border-b border-astro-orange/10 px-4 sm:px-6 lg:px-8 py-2.5 flex space-x-4 overflow-x-auto whitespace-nowrap scrollbar-thin">
        <button
          onClick={() => setActiveTab("edit_horoscope")}
          className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "edit_horoscope"
              ? "bg-astro-orange text-astro-dark font-bold"
              : "text-astro-cream/60 hover:text-astro-cream hover:bg-astro-cream/5"
          }`}
        >
          🔮 রাশিফল এডিটর
        </button>
        <button
          onClick={() => setActiveTab("create_admin")}
          className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "create_admin"
              ? "bg-astro-orange text-astro-dark font-bold"
              : "text-astro-cream/60 hover:text-astro-cream hover:bg-astro-cream/5"
          }`}
        >
          ➕ নতুন অ্যাডমিন তৈরি
        </button>
        <button
          onClick={() => { setActiveTab("activity_logs"); setLogsPage(1); }}
          className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "activity_logs"
              ? "bg-astro-orange text-astro-dark font-bold"
              : "text-astro-cream/60 hover:text-astro-cream hover:bg-astro-cream/5"
          }`}
        >
          📜 অ্যাক্টিভিটি লগস
        </button>
        <button
          onClick={() => { setActiveTab("bulk_update"); setCsvFile(null); setCsvPreview([]); setCsvError(""); setCsvSuccess(""); }}
          className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "bulk_update"
              ? "bg-astro-orange text-astro-dark font-bold"
              : "text-astro-cream/60 hover:text-astro-cream hover:bg-astro-cream/5"
          }`}
        >
          📥 সিএসভি বাল্ক আপডেট
        </button>
      </div>

      {/* Main Tabbed Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Edit Horoscope */}
        {activeTab === "edit_horoscope" && (
          <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
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
        )}

        {/* Tab 2: Create Admin */}
        {activeTab === "create_admin" && (
          <div className="max-w-md mx-auto glass-panel p-6 sm:p-8 rounded-2xl border border-astro-orange/20 relative overflow-hidden animate-fade-in">
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-astro-orange/5 rounded-full blur-3xl pointer-events-none" />
            <div className="mb-6 border-b border-astro-orange/15 pb-4">
              <h2 className="text-xl font-bold text-astro-orange flex items-center space-x-2">
                <span>➕</span>
                <span>নতুন অ্যাডমিন অ্যাকাউন্ট তৈরি করুন</span>
              </h2>
              <p className="text-xs text-astro-cream/60 mt-1">সিস্টেমে লগইন করার জন্য অন্য একজন ব্যক্তির আইডি তৈরি করুন।</p>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-astro-orange/80 mb-1" htmlFor="newUsername">
                  ইউজারনেম (Username)
                </label>
                <input
                  type="text"
                  id="newUsername"
                  placeholder="যেমন: rony_astro"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-astro-deep/50 border border-astro-orange/25 rounded-xl px-4 py-2.5 text-astro-cream focus:outline-none focus:border-astro-orange text-xs font-semibold"
                  required
                  minLength={3}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-astro-orange/80 mb-1" htmlFor="newPassword">
                  পাসওয়ার্ড (Password)
                </label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="কমপক্ষে ৬টি অক্ষর"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-astro-deep/50 border border-astro-orange/25 rounded-xl px-4 py-2.5 text-astro-cream focus:outline-none focus:border-astro-orange text-xs font-mono tracking-wide"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-astro-orange/80 mb-1" htmlFor="newPasswordConfirm">
                  পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)
                </label>
                <input
                  type="text"
                  id="newPasswordConfirm"
                  placeholder="পাসওয়ার্ডটি আবার টাইপ করুন"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  className="w-full bg-astro-deep/50 border border-astro-orange/25 rounded-xl px-4 py-2.5 text-astro-cream focus:outline-none focus:border-astro-orange text-xs font-mono tracking-wide"
                  required
                />
              </div>

              {createAdminError && <p className="text-xs text-red-500 font-semibold mt-2">{createAdminError}</p>}
              {createAdminSuccess && <p className="text-xs text-emerald-400 font-semibold mt-2">{createAdminSuccess}</p>}

              <button
                type="submit"
                disabled={isSubmittingAdmin}
                className="w-full bg-astro-orange hover:bg-astro-orange/90 disabled:bg-astro-orange/40 text-astro-dark font-bold py-2.5 px-4 rounded-xl transition-all duration-300 transform active:scale-98 shadow-md hover:shadow-astro-orange/25 mt-2 text-xs flex items-center justify-center"
              >
                {isSubmittingAdmin ? (
                  <span className="w-4 h-4 border-2 border-astro-dark border-t-transparent rounded-full animate-spin" />
                ) : (
                  "অ্যাডমিন তৈরি করুন"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Activity Logs */}
        {activeTab === "activity_logs" && (
          <div className="glass-panel p-5 sm:p-6 rounded-xl border border-astro-orange/15 animate-fade-in">
            <div className="flex flex-row justify-between items-center mb-6 border-b border-astro-orange/15 pb-4">
              <div>
                <h2 className="text-xl font-bold text-astro-orange flex items-center space-x-2">
                  <span>📜</span>
                  <span>অ্যাক্টিভিটি লগস</span>
                </h2>
                <p className="text-xs text-astro-cream/60 mt-1">সিস্টেমে অ্যাডমিনদের দ্বারা সম্পন্ন হওয়া কাজের তালিকা।</p>
              </div>
              <button
                onClick={() => fetchLogs(logsPage)}
                disabled={isLoadingLogs}
                className="bg-astro-cream/5 hover:bg-astro-cream/10 border border-astro-orange/20 text-astro-orange px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center space-x-1"
              >
                {isLoadingLogs ? (
                  <span className="w-3.5 h-3.5 border-2 border-astro-orange border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>🔄 রিফ্রেশ</span>
                )}
              </button>
            </div>

            {isLoadingLogs && logs.length === 0 ? (
              <div className="text-center py-16 text-astro-orange animate-pulse">
                লগ লোড হচ্ছে...
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-16 text-astro-cream/40 text-sm">
                কোনো অ্যাক্টিভিটি লগ পাওয়া যায়নি।
              </div>
            ) : (
              <>
                <div className="overflow-x-auto whitespace-nowrap scrollbar-thin">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-astro-orange/20 text-astro-orange font-bold">
                        <th className="py-3 px-4 w-1/4">তারিখ ও সময়</th>
                        <th className="py-3 px-4 w-1/6">অ্যাডমিন</th>
                        <th className="py-3 px-4 w-1/6">অ্যাকশন</th>
                        <th className="py-3 px-4">বিবরণ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => {
                        let actionColor = "text-astro-cream/70";
                        if (log.action === "LOGIN") actionColor = "text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded";
                        else if (log.action === "LOGOUT") actionColor = "text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded";
                        else if (log.action === "CREATE_ADMIN") actionColor = "text-sky-400 font-bold bg-sky-950/40 px-2 py-0.5 rounded";
                        else if (log.action === "UPDATE_HOROSCOPE") actionColor = "text-astro-orange font-bold bg-astro-orange/10 px-2 py-0.5 rounded";

                        return (
                          <tr key={log.id} className="border-b border-astro-orange/5 hover:bg-astro-cream/2 transition-colors">
                            <td className="py-3.5 px-4 text-astro-cream/60">
                              {new Date(log.createdAt).toLocaleString("bn-BD")}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-astro-cream/90">
                              {log.adminUsername}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={actionColor}>{log.action}</span>
                            </td>
                            <td className="py-3.5 px-4 text-astro-cream/80 max-w-xs sm:max-w-md truncate">
                              {log.details}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-astro-orange/10">
                  <span className="text-xxs text-astro-cream/60">
                    সর্বমোট <strong>{totalLogsCount}</strong> টি লগ এন্ট্রি পাওয়া গেছে
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setLogsPage((prev) => Math.max(1, prev - 1))}
                      disabled={logsPage === 1 || isLoadingLogs}
                      className="px-3 py-1 bg-astro-cream/5 hover:bg-astro-cream/10 disabled:opacity-30 border border-astro-orange/20 rounded-lg text-xxs font-semibold text-astro-orange transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                    >
                      ◀ পূর্ববর্তী
                    </button>
                    
                    <span className="text-xxs text-astro-cream/80 font-bold px-2">
                      পৃষ্ঠা {logsPage} / {totalPages}
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => setLogsPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={logsPage === totalPages || isLoadingLogs}
                      className="px-3 py-1 bg-astro-cream/5 hover:bg-astro-cream/10 disabled:opacity-30 border border-astro-orange/20 rounded-lg text-xxs font-semibold text-astro-orange transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                    >
                      পরবর্তী ▶
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 4: Bulk CSV Update */}
        {activeTab === "bulk_update" && (
          <div className="max-w-4xl mx-auto glass-panel p-6 sm:p-8 rounded-2xl border border-astro-orange/20 relative overflow-hidden animate-fade-in">
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-astro-orange/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-astro-orange/15 pb-4">
              <div>
                <h2 className="text-xl font-bold text-astro-orange flex items-center space-x-2">
                  <span>📥</span>
                  <span>সিএসভি (CSV) বাল্ক আপডেট</span>
                </h2>
                <p className="text-xs text-astro-cream/60 mt-1">সিএসভি ফাইলের মাধ্যমে একযোগে সবকটি রাশির তথ্য আপডেট করুন।</p>
              </div>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="bg-astro-cream/5 hover:bg-astro-cream/10 border border-astro-orange/20 text-astro-orange px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center space-x-1"
              >
                <span>💾 টেমপ্লেট ডাউনলোড (CSV)</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-astro-cream/2 p-4 rounded-xl border border-astro-orange/10 text-xs text-astro-cream/80 leading-relaxed">
                <h4 className="font-bold text-astro-orange text-sm mb-2">📌 সিএসভি ফাইল ব্যবহারের নির্দেশাবলী:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>প্রথমে বর্তমান ডেটা সংবলিত <strong>টেমপ্লেট ডাউনলোড</strong> করে এডিট করুন।</li>
                  <li>প্রয়োজনীয় কলামসমূহ: <code className="text-astro-orange font-mono">id</code>, <code className="text-astro-orange font-mono">name</code>, <code className="text-astro-orange font-mono">englishName</code>, <code className="text-astro-orange font-mono">daily</code>, <code className="text-astro-orange font-mono">weekly</code>, <code className="text-astro-orange font-mono">monthly</code>, <code className="text-astro-orange font-mono">yearly</code>।</li>
                  <li><code className="text-astro-orange font-mono">id</code> কলামে রাশির আইডি নম্বর (যেমন: <code className="font-mono">1001</code>, <code className="font-mono">1002</code>) সঠিকভাবে লিখুন।</li>
                  <li>যেকোনো কলামে কমা বা ডাবল কোট থাকলে টেক্সটটিকে অবশ্যই ডাবল কোট (<code className="font-mono">"..."</code>) দিয়ে ঘেরাও করুন।</li>
                </ul>
              </div>

              {/* Upload Input */}
              <div className="border-2 border-dashed border-astro-orange/20 rounded-2xl p-6 text-center hover:border-astro-orange/40 transition-colors">
                <input
                  type="file"
                  id="csvFileInput"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="csvFileInput"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <span className="text-4xl">📁</span>
                  <span className="text-xs font-semibold text-astro-orange">সিএসভি ফাইল নির্বাচন করুন</span>
                  <span className="text-4xs text-astro-cream/40">কেবল .csv ফরম্যাট গ্রহণযোগ্য</span>
                </label>
                {csvFile && (
                  <p className="mt-3 text-xs text-emerald-400 font-semibold font-mono">
                    নির্বাচিত ফাইল: {csvFile.name} ({(csvFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {/* Errors & Success */}
              {csvError && <p className="text-xs text-red-500 font-semibold text-center mt-2">{csvError}</p>}
              {csvSuccess && <p className="text-xs text-emerald-400 font-semibold text-center mt-2">{csvSuccess}</p>}

              {/* Preview Table */}
              {csvPreview.length > 0 && (
                <div className="glass-panel p-4 rounded-xl border border-astro-orange/10">
                  <h3 className="text-xs font-bold text-astro-orange uppercase tracking-wider mb-3">
                    👀 ডেটা প্রাকদর্শন (Preview - First 5 rows)
                  </h3>
                  <div className="overflow-x-auto whitespace-nowrap scrollbar-thin text-4xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-astro-orange/20 text-astro-orange font-bold">
                          {csvPreview[0].slice(0, 8).map((header, idx) => (
                            <th key={idx} className="py-2 px-3">{header}</th>
                          ))}
                          {csvPreview[0].length > 8 && <th className="py-2 px-3">...</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreview.slice(1).map((row, rowIdx) => (
                          <tr key={rowIdx} className="border-b border-astro-orange/5 text-astro-cream/70 hover:bg-astro-cream/2">
                            {row.slice(0, 8).map((val, colIdx) => (
                              <td key={colIdx} className="py-2 px-3 max-w-[120px] truncate">{val}</td>
                            ))}
                            {row.length > 8 && <td className="py-2 px-3 text-astro-cream/40">...</td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {csvFile && !csvError && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleUploadCsv}
                    disabled={isUploadingCsv}
                    className="bg-astro-orange hover:bg-astro-orange/90 disabled:bg-astro-orange/40 text-astro-dark font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-md hover:shadow-astro-orange/10 transform active:scale-98 flex items-center space-x-2"
                  >
                    {isUploadingCsv ? (
                      <span className="w-4 h-4 border-2 border-astro-dark border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>🚀 আপলোড নিশ্চিত করুন</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
