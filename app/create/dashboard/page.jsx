import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { query } from "@/lib/db";
import { FileText, Clock, Plus, Zap, Star, TrendingUp } from "lucide-react";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

// Color map for template cards
const templateColors = {
  classic:        { from: "#1e3a8a", to: "#2563eb", accent: "#3b82f6" },
  modern:         { from: "#334155", to: "#475569", accent: "#fbbf24" },
  glass_modern:   { from: "#6366f1", to: "#a855f7", accent: "#8b5cf6" },
  tech_innovator: { from: "#000000", to: "#18181b", accent: "#22c55e" },
  startup_vibe:   { from: "#1f2937", to: "#064e3b", accent: "#10b981" },
  clean_slate:    { from: "#18181b", to: "#3f3f46", accent: "#71717a" },
  creative_agency:{ from: "#ea580c", to: "#f97316", accent: "#fb923c" },
};

function ResumeCardPreview({ template }) {
  const colors = templateColors[template] || templateColors.classic;
  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
    >
      {/* Header bar */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex-shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-2 w-3/4 rounded-full bg-white/50" />
          <div className="h-1.5 w-1/2 rounded-full bg-white/30" />
        </div>
      </div>
      {/* Body lines */}
      <div className="px-4 space-y-2 pt-1">
        <div className="h-1.5 w-full rounded-full" style={{ background: `${colors.accent}50` }} />
        <div className="h-1.5 w-5/6 rounded-full" style={{ background: `${colors.accent}40` }} />
        <div className="h-1.5 w-4/6 rounded-full" style={{ background: `${colors.accent}30` }} />
      </div>
      {/* Skill chips */}
      <div className="px-4 pt-3 flex flex-wrap gap-1.5">
        {[40, 55, 35].map((w, i) => (
          <div key={i} className="h-3 rounded-full bg-white/20" style={{ width: `${w}px` }} />
        ))}
      </div>
    </div>
  );
}

export default async function Dashboard() {
  const user = await getCurrentUser();
  let resumes = [];

  if (user) {
    try {
      resumes = await query(
        "SELECT id, title, template, status, created_at, views FROM resumes WHERE user_id = ? ORDER BY created_at DESC",
        [user.id]
      );
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    }
  }

  const totalViews = resumes.reduce((sum, r) => sum + (r.views || 0), 0);

  return (
    <div className="min-h-screen font-sans" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fafbff 50%, #f5f0ff 100%)" }}>
      
      {/* Ambient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #667eea, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-64 right-1/4 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #f093fb, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-32 left-1/3 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #4facfe, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8">

        {/* ===== LIGHT HERO SECTION ===== */}
        <div className="relative rounded-[2rem] overflow-hidden mb-12 shadow-sm border border-indigo-100 bg-white">
          
          {/* Subtle Accent Background */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full mix-blend-multiply opacity-50"
              style={{ background: "radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
            <div className="absolute -bottom-32 right-0 w-[600px] h-[600px] rounded-full mix-blend-multiply opacity-50"
              style={{ background: "radial-gradient(circle, rgba(147,51,234,0.1) 0%, transparent 70%)", filter: "blur(60px)" }} />
          </div>
          
          {/* Card Content */}
          <div className="relative z-10 p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex-1 space-y-4">

              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                ยินดีต้อนรับกลับ,{" "}
                <span className="text-indigo-600">
                  {user?.name || "Member"}
                </span>{" "}👋
              </h1>
              
              <p className="text-gray-500 text-base max-w-2xl leading-relaxed font-medium">
                จัดการและสร้างสรรค์โปรไฟล์ความเป็นมืออาชีพของคุณ 
                ด้วยเทมเพลตที่ออกแบบมาเพื่อดึงดูดความสนใจจาก HR
              </p>

              {/* Metrics */}
              <div className="flex flex-wrap gap-8 pt-6">
                {[
                  { label: "เรซูเม่ทั้งหมด", value: resumes.length, icon: FileText, color: "#4F46E5", bg: "#EEF2FF" },
                  { label: "ยอดเข้าชม", value: totalViews, icon: TrendingUp, color: "#9333EA", bg: "#F3E8FF" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: stat.bg, color: stat.color }}>
                      <stat.icon size={22} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-gray-900 leading-none">{stat.value}</div>
                      <div className="text-gray-500 text-[11px] font-bold uppercase tracking-wide mt-1">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== GRID HEADER ===== */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
              <Clock size={15} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">เรซูเม่ของคุณ</h2>
              <p className="text-xs text-gray-400">{resumes.length === 0 ? "ยังไม่มีเรซูเม่" : `${resumes.length} ใบ`}</p>
            </div>
          </div>
          {resumes.length > 0 && (
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-1.5 shadow-sm">
              <Zap size={13} className="text-yellow-500" />
              <span className="text-sm text-gray-600 font-medium">{resumes.length} ดีไซน์</span>
            </div>
          )}
        </div>

        {/* ===== RESUME GRID ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {/* ---- CREATE NEW CARD (only when user has resumes) ---- */}
          {resumes.length > 0 && <Link
            href="/create/templates?new=1"
            className="group relative rounded-3xl overflow-hidden h-[320px] flex flex-col items-center justify-center text-center p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,244,255,0.9))",
              border: "2px dashed #a5b4fc",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 20px rgba(102,126,234,0.1)"
            }}
          >
            <div className="relative">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg mx-auto"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
              >
                <Plus size={36} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                <Star size={10} className="text-white fill-white" />
              </div>
            </div>
            <p className="text-gray-800 font-black text-lg mb-1">สร้างเรซูเม่ใหม่</p>
            <p className="text-sm text-gray-400 leading-relaxed">เริ่มจากศูนย์ด้วยเทมเพลตที่ใช่สำหรับคุณ</p>

            {/* Hover glow */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, rgba(102,126,234,0.05), rgba(118,75,162,0.05))" }} />
          </Link>}

          {/* ---- RESUME CARDS ---- */}
          {resumes.map((resume) => {
            const colors = templateColors[resume.template] || templateColors.classic;
            return (
              <div
                key={resume.id}
                className="group relative rounded-3xl overflow-hidden h-[320px] flex flex-col bg-white transition-all duration-300 hover:-translate-y-2"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)" }}
              >
                {/* Preview Area */}
                <Link href={`/create/personalInfo?resumeId=${resume.id}`} className="relative flex-1 overflow-hidden block">
                  <ResumeCardPreview template={resume.template} />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
                    <div className="bg-white text-gray-900 font-bold text-sm py-2.5 px-6 rounded-2xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      ✏️ แก้ไขเรซูเม่
                    </div>
                  </div>

                  {/* Template badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[9px] text-white font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow"
                      style={{ background: colors.accent + "cc", backdropFilter: "blur(4px)" }}>
                      {resume.template}
                    </span>
                  </div>

                  {/* Views badge */}
                  {resume.views > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      <TrendingUp size={8} />
                      {resume.views}
                    </div>
                  )}
                </Link>

                {/* Info Footer */}
                <div className="p-4 bg-white border-t" style={{ borderColor: colors.accent + "20" }}>
                  <div className="mb-3">
                    <h3 className="font-black text-gray-900 text-sm truncate leading-tight">
                      {resume.title || "ไม่มีชื่อเรซูเม่"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(resume.created_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" })}
                    </p>
                  </div>
                  <DashboardClient resumeId={resume.id} accentColor={colors.accent} />
                </div>

                {/* Bottom accent bar */}
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${colors.from}, ${colors.accent})` }} />
              </div>
            );
          })}
        </div>

        {/* ===== EMPTY STATE ===== */}
        {resumes.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-xl"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
              <FileText size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">ยังไม่มีเรซูเม่</h3>
            <p className="text-gray-400 mb-8">เริ่มสร้างเรซูเม่ใบแรกของคุณได้เลย!</p>
            <Link
              href="/create/templates?new=1"
              className="inline-flex items-center gap-2 text-white font-bold py-3 px-8 rounded-2xl shadow-xl transition-all hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              <Plus size={18} />
              สร้างเรซูเม่แรกของคุณ
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}