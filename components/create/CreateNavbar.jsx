"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useResume } from "@/contexts/ResumeContext";

import UserMenu from "./UserMenu";

export default function CreateNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("");
  const [siteName, setSiteName] = useState("Smart Persona");
  const { resumeId } = useResume();

  useEffect(() => {
    // ดึงชื่อสดจาก DB (เหมือนกับ Dashboard) แทนการอ่านจาก JWT ที่อาจ stale
    fetch("/api/users/profile")
      .then((r) => r.json())
      .then((d) => setUserName(d.user?.name || ""))
      .catch(() => {});

    fetch("/api/settings/public")
      .then((r) => r.json())
      .then((d) => {
        if (d.site_name) setSiteName(d.site_name);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    router.push("/");
  };

  const navItems = [
    { href: "/create/dashboard", label: "📋 Dashboard", ignoreResumeId: true },
    { href: "/create/templates",     label: "🎨 เทมเพลต" },
    { href: "/create/personalInfo",  label: "✏️ กรอกข้อมูล" },
  ];

  return (
    <nav className="bg-white/85 backdrop-blur-[20px] sticky top-0 z-50 border-b border-[#6366f1]/10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-400">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
        
        {/* Logo (Styled like homepage Navbar) */}
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center text-white font-black text-[18px] shadow-[0_8px_16px_rgba(99,102,241,0.25)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            {siteName.charAt(0).toUpperCase()}
          </div>
          <span className="text-[#0f172a] font-black text-[20px] tracking-[-0.5px] hidden sm:block">{siteName}</span>
        </Link>

        {/* Center: Step Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-gray-50/80 px-2 py-1.5 rounded-xl border border-gray-100">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <div key={item.href} className="flex items-center">
                <Link
                  href={item.ignoreResumeId || !resumeId ? item.href : `${item.href}?resumeId=${resumeId}`}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-white text-[#0066cc] shadow-sm ring-1 ring-gray-100"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
                {idx < navItems.length - 1 && (
                  <svg className="w-4 h-4 mx-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center gap-4">
          <UserMenu userName={userName} onLogout={handleLogout} />
        </div>

      </div>
    </nav>
  );
}
