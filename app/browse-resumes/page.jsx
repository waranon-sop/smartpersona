"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Navbar from "@/components/navbar/page";
import { Search, Filter, Eye, Calendar, Briefcase, Sparkles, ChevronLeft, ChevronRight, Users, X } from "lucide-react";

const templateColors = {
  classic:         { bg: "#eff6ff", text: "#1e3a8a", border: "#bfdbfe" },
  modern:          { bg: "#fefce8", text: "#92400e", border: "#fde68a" },
  glass_modern:    { bg: "#f5f3ff", text: "#5b21b6", border: "#ddd6fe" },
  tech_innovator:  { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
  startup_vibe:    { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" },
  clean_slate:     { bg: "#f4f4f5", text: "#3f3f46", border: "#d4d4d8" },
  creative_agency: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
};

const templateLabels = {
  classic: "Classic",
  modern: "Modern",
  glass_modern: "Glass Modern",
  tech_innovator: "Tech Innovator",
  startup_vibe: "Startup Vibe",
  clean_slate: "Clean Slate",
  creative_agency: "Creative Agency",
};

export default function BrowsePublicResumes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [templateFilter, setTemplateFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("");
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const debounceTimerRef = useRef(null);
  const isMountedRef = useRef(false);
  const abortControllerRef = useRef(null);

  const fetchResults = useCallback(async (currentPage = 1, query = searchQuery, template = templateFilter, role = roleFilter) => {
    // Abort previous request if still pending
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      const params = new URLSearchParams({
        query,
        page: currentPage,
        limit: 12,
        template,
        role,
      });
      const res = await fetch(`/api/resume/search-public?${params.toString()}`, {
        signal: abortControllerRef.current.signal,
      });
      const data = await res.json();

      if (res.ok) {
        setResults(data.results || []);
        setTotalPages(data.totalPages || 1);
        setTotalRecords(data.total || 0);
        setSearched(true);
      } else {
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
    } catch (error) {
      if (error.name === "AbortError") return; // Silently ignore aborted requests
      console.error("Search error:", error);
      toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, templateFilter, roleFilter]);

  // Initial fetch on mount (single time only)
  useEffect(() => {
    fetchResults(1, "", "all", "");
    // Delay flag so the debounce effect skips this initial render cycle
    const t = setTimeout(() => { isMountedRef.current = true; }, 600);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced auto-search when any filter changes (after mount)
  useEffect(() => {
    if (!isMountedRef.current) return;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setPage(1);
      fetchResults(1);
    }, 500);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, roleFilter, templateFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setPage(1);
    fetchResults(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchResults(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("");
    setTemplateFilter("all");
  };

  const hasActiveFilters = searchQuery || roleFilter || templateFilter !== "all";

  return (
    <div className="min-h-screen font-sans" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fafbff 50%, #f5f0ff 100%)" }}>
      <Navbar />

      {/* Ambient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-40 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #667eea, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-80 right-1/4 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #f093fb, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8" style={{ zIndex: 1 }}>

        {/* Hero header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/40 rounded-full px-5 py-2 mb-5 shadow-sm">
            <Users size={14} className="text-indigo-500" />
            <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Community Resumes</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-3">
            ค้นหา{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Resume
            </span>{" "}
            ของคนอื่น
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            ค้นหา Resume เพื่อเป็นแรงบันดาลใจด้วยชื่อ ทักษะ ตำแหน่งงาน หรือเทมเพลต
          </p>
        </div>

        {/* Search card */}
        <form onSubmit={handleSearchSubmit}
          className="mb-8 rounded-3xl overflow-hidden shadow-lg border border-white/50"
          style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)" }}>
          
          {/* Main search row */}
          <div className="p-5 pb-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่อ-นามสกุล หรือ ทักษะ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm transition-all"
              />
            </div>
            <div className="relative flex-1">
              <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="กรองด้วยตำแหน่งงาน (Role)..."
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm transition-all"
              />
            </div>
          </div>

          {/* Filter row */}
          <div className="px-5 pb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <Filter size={13} />
                เทมเพลต:
              </div>
              <select
                value={templateFilter}
                onChange={(e) => setTemplateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
              >
                <option value="all">ทั้งหมด</option>
                {Object.entries(templateLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              {hasActiveFilters && (
                <button type="button" onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors">
                  <X size={12} />
                  ล้างตัวกรอง
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              <Sparkles size={14} />
              {loading ? "กำลังค้นหา..." : "ค้นหา Resume"}
            </button>
          </div>
        </form>

        {/* Results area */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="h-5 bg-gray-200 rounded w-36 mb-2" />
                        <div className="h-3.5 bg-gray-100 rounded w-24" />
                      </div>
                      <div className="h-6 bg-gray-100 rounded-full w-20" />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-4/5" />
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-gray-50 flex justify-between items-center">
                    <div className="h-3 bg-gray-100 rounded w-20" />
                    <div className="h-8 bg-gray-200 rounded-lg w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : searched && results.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-5 rounded-3xl flex items-center justify-center bg-gray-100">
                <Search size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-black text-gray-700 mb-2">ไม่พบ Resume ที่ตรงกับการค้นหา</h3>
              <p className="text-sm text-gray-400">ลองเปลี่ยนคำค้นหาหรือตัวกรองแล้วลองอีกครั้ง</p>
            </div>
          ) : searched && results.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-gray-500 font-medium">
                  พบทั้งหมด <span className="text-indigo-600 font-black">{totalRecords}</span> รายการ
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.map((resume) => {
                  const colors = templateColors[resume.template] || templateColors.classic;
                  return (
                    <div key={resume.resumeId}
                      className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-200">
                      
                      {/* Card body */}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0 mr-3">
                            <h3 className="font-black text-gray-900 text-[15px] truncate leading-tight">
                              {resume.firstName} {resume.lastName}
                            </h3>
                            {resume.jobTitle && (
                              <p className="text-xs font-bold text-indigo-600 mt-1 truncate">{resume.jobTitle}</p>
                            )}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0"
                            style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                            {templateLabels[resume.template] || resume.template}
                          </span>
                        </div>

                        {resume.skills && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {resume.skills.split(",").slice(0, 4).map((skill, i) => (
                              <span key={i} className="text-[10px] font-semibold text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
                                {skill.trim()}
                              </span>
                            ))}
                            {resume.skills.split(",").length > 4 && (
                              <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 rounded-full px-2.5 py-1">
                                +{resume.skills.split(",").length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card footer */}
                      <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <span className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                          <Calendar size={11} />
                          {new Date(resume.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" })}
                        </span>
                        <Link
                          href={`/resume/${resume.resumeId}`}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95"
                          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                        >
                          <Eye size={12} />
                          ดู Resume
                        </Link>
                      </div>

                      {/* Bottom accent */}
                      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${colors.text}40, ${colors.text}10)` }} />
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-10">
                  <button
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white font-bold text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronLeft size={14} />
                    ก่อนหน้า
                  </button>
                  <span className="px-5 py-2 text-sm font-black text-indigo-600 bg-indigo-50 rounded-xl border border-indigo-100">
                    {page} / {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white font-bold text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    ถัดไป
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
