"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResume } from "@/contexts/ResumeContext";
import { Layers, CheckCircle2 } from "lucide-react";

// ─────────────────────────────────────────────
// Template metadata
// ─────────────────────────────────────────────
const templates = [
  {
    id: "classic",
    name: "Classic Professional",
    tag: "Traditional",
    desc: "เรียบหรู เป็นทางการ เหมาะกับองค์กร ราชการ และบริษัทใหญ่",
    suitable: ["ราชการ / รัฐวิสาหกิจ", "บริษัทแบบ Corporate", "งานอาวุโส"],
    accent: "#1e3a8a",
    bg: "#f8fafc",
  },
  {
    id: "modern",
    name: "Modern",
    tag: "Most Popular",
    tagColor: "#f97316",
    desc: "Two-column สะอาด มีความน่าเชื่อถือ ใช้ได้กับแทบทุกสาย",
    suitable: ["Marketing / Sales", "Finance / Consulting", "งานทั่วไป"],
    accent: "#334155",
    bg: "#fff",
  },
  {
    id: "glass_modern",
    name: "Glass Modern",
    tag: "Premium",
    tagColor: "#7c3aed",
    desc: "ดูทันสมัย มีน้ำหนัก เหมาะกับงาน Creative ระดับกลาง-สูง",
    suitable: ["UX/UI Designer", "Product Manager", "Brand Manager"],
    accent: "#6366f1",
    bg: "#f0f5ff",
  },
  {
    id: "tech_innovator",
    name: "Tech Innovator",
    tag: "Trending",
    tagColor: "#0891b2",
    desc: "Dark header สุดเท่ เน้น Tech Stack เหมาะกับสายไอที",
    suitable: ["Software Engineer", "DevOps / Cloud", "Data Engineer"],
    accent: "#22c55e",
    bg: "#fff",
  },
  {
    id: "startup_vibe",
    name: "Startup Vibe",
    tag: "Friendly",
    tagColor: "#059669",
    desc: "สไตล์อบอุ่น ผ่อนคลาย เหมาะกับ Startup และ SME",
    suitable: ["Startup / SME", "Community / NGO", "Freelancer"],
    accent: "#10b981",
    bg: "#f0fff4",
  },
  {
    id: "clean_slate",
    name: "Clean Slate",
    tag: "Minimal",
    desc: "Minimalist สุด พื้นที่ขาวอ่านง่าย เน้นเนื้อหา 100%",
    suitable: ["Academia / Research", "Legal / Law", "Operations"],
    accent: "#18181b",
    bg: "#fff",
  },
  {
    id: "creative_agency",
    name: "Creative Agency",
    tag: "Bold",
    tagColor: "#db2777",
    desc: "กล้า โดดเด่น ใช้ Typography หนัก เหมาะงานสร้างสรรค์",
    suitable: ["Graphic / Motion Design", "Art Director", "Creative Copywriter"],
    accent: "#f97316",
    bg: "#fff0f6",
  },
];

// ─────────────────────────────────────────────
// Mini resume preview — realistic layout per template
// ─────────────────────────────────────────────
function MiniResume({ id, accent }) {
  const name =   <div className="h-3 w-32 rounded-sm" style={{ background: accent }} />;
  const title =  <div className="h-1.5 w-24 rounded-sm bg-gray-300 mt-1" />;
  const line =   (w) => <div className={`h-1.5 rounded-sm bg-gray-200`} style={{ width: w }} />;
  const dotline =(w) => <div className={`h-1.5 rounded-sm`} style={{ width: w, background: `${accent}50` }} />;
  const section = (label) => (
    <div className="flex items-center gap-1.5 mt-2 mb-1">
      <div className="h-1.5 w-8 rounded-sm" style={{ background: accent }} />
      <div className="h-1 w-12 rounded-sm bg-gray-300" />
    </div>
  );

  if (id === "classic") return (
    <div className="bg-white w-full h-full p-3 flex flex-col font-serif text-gray-700">
      <div className="text-center border-b-2 pb-2 mb-2" style={{ borderColor: accent }}>
        {name}
        <div className="h-1.5 w-20 rounded-sm bg-gray-300 mx-auto mt-0.5" />
        <div className="h-1.5 w-28 rounded-sm bg-gray-200 mx-auto mt-0.5" />
      </div>
      {["SUMMARY","EDUCATION","EXPERIENCE","SKILLS"].map((s) => (
        <div key={s}>
          <div className="h-1.5 w-full rounded-sm mt-2 mb-1" style={{ background: `${accent}80` }} />
          <div className="text-[5px] font-bold tracking-widest uppercase mb-1" style={{ color: accent }}>{s}</div>
          <div className="space-y-1">{[100,85,70].map((w,i)=><div key={i} className="h-1 rounded-sm bg-gray-200" style={{width:`${w}%`}}/>)}</div>
        </div>
      ))}
    </div>
  );

  if (id === "modern") return (
    <div className="bg-white w-full h-full flex">
      {/* Left sidebar */}
      <div className="w-[38%] h-full p-2 flex flex-col gap-1.5" style={{ background: "#1e3a8a" }}>
        <div className="w-10 h-10 rounded-full bg-white/20 mx-auto mt-1 mb-1" />
        {[60,80,50,70].map((w,i)=><div key={i} className="h-1.5 rounded-sm bg-white/30" style={{width:`${w}%`}}/>)}
        <div className="h-px bg-white/20 my-1" />
        {[70,55,65].map((w,i)=><div key={i} className="h-1.5 rounded-sm bg-white/20" style={{width:`${w}%`}}/>)}
      </div>
      {/* Right content */}
      <div className="flex-1 p-2">
        <div className="h-2.5 w-24 rounded-sm mb-0.5" style={{ background: "#1e3a8a" }} />
        <div className="h-1.5 w-16 rounded-sm bg-gray-300 mb-2" />
        {["EXPERIENCE","EDUCATION"].map((s)=>(
          <div key={s}>
            <div className="h-1.5 rounded-sm mb-1 mt-1.5" style={{background:`#1e3a8a`}}/>
            <div className="space-y-1">{[90,75,60].map((w,i)=><div key={i} className="h-1 rounded-sm bg-gray-200" style={{width:`${w}%`}}/>)}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (id === "glass_modern") return (
    <div className="w-full h-full p-2" style={{ background: "linear-gradient(135deg, #eff6ff, #f5f3ff)" }}>
      <div className="bg-white/80 rounded-lg h-full p-2">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500" />
          <div>
            <div className="h-2 w-20 rounded-sm bg-gray-800 mb-0.5" />
            <div className="h-1.5 w-14 rounded-sm bg-gradient-to-r from-blue-400 to-purple-400" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 h-[calc(100%-48px)]">
          <div className="col-span-2 space-y-1.5">
            {["ABOUT","EXPERIENCE"].map(s=>(
              <div key={s}>
                <div className="h-1.5 w-14 rounded-sm mb-1" style={{background: "#3b82f6"}} />
                {[100,85,70].map((w,i)=><div key={i} className="h-1 rounded-sm bg-gray-200 mb-0.5" style={{width:`${w}%`}}/>)}
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {["SKILLS","EDUCATION"].map(s=>(
              <div key={s}>
                <div className="h-1.5 w-10 rounded-sm mb-1" style={{background:"#7c3aed"}} />
                {[3,4,3].map((n,i)=><div key={i} className="h-3 w-full rounded-full bg-blue-50 border border-blue-100 mb-0.5"/>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (id === "tech_innovator") return (
    <div className="w-full h-full flex flex-col">
      <div className="h-[35%] p-2 flex items-end" style={{ background: "linear-gradient(135deg, #111827, #1e1b4b)" }}>
        <div>
          <div className="h-2.5 w-20 rounded-sm bg-white mb-0.5" />
          <div className="h-1.5 w-14 rounded-sm bg-purple-400 mb-1" />
          <div className="flex gap-1">{[40,35,45].map((w,i)=><div key={i} className="h-3 rounded-md bg-white/10 border border-white/20" style={{width:`${w}px`}}/>)}</div>
        </div>
      </div>
      <div className="flex-1 bg-white p-2 grid grid-cols-3 gap-2">
        <div className="col-span-2 space-y-1">
          <div className="h-1.5 w-16 rounded-sm mb-1 flex items-center gap-1"><span className="text-[6px] text-purple-600 font-bold">{"</>"}</span><div className="h-1.5 w-10 rounded-sm bg-gray-200"/></div>
          {[100,85,70,55].map((w,i)=><div key={i} className="h-1 rounded-sm bg-gray-100" style={{width:`${w}%`}}/>)}
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-10 rounded-sm bg-gray-300 mb-1"/>
          {["","","",""].map((_,i)=><div key={i} className="h-3 w-full rounded-md bg-gray-50 border border-gray-200 mb-0.5"/>)}
        </div>
      </div>
    </div>
  );

  if (id === "startup_vibe") return (
    <div className="bg-white w-full h-full p-2">
      <div className="text-center mb-2">
        <div className="w-8 h-8 rounded-full bg-green-100 mx-auto mb-1" />
        <div className="h-2 w-20 rounded-sm bg-gray-800 mx-auto mb-0.5" />
        <div className="h-1.5 w-14 rounded-sm bg-green-500 mx-auto mb-1" />
        <div className="flex justify-center gap-1 mt-1">{[50,40,55].map((w,i)=><div key={i} className="h-3 rounded-full bg-gray-100 border border-gray-200" style={{width:`${w}px`}}/>)}</div>
      </div>
      <div className="rounded-2xl p-2 mb-1.5" style={{background:"#f0fdf4",border:"1px solid #bbf7d0"}}>
        <div className="h-1.5 w-12 rounded-sm bg-green-600 mb-1" />
        {[100,85,70].map((w,i)=><div key={i} className="h-1 rounded-sm bg-gray-200 mb-0.5" style={{width:`${w}%`}}/>)}
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {[["#eff6ff","#3b82f6"],["#faf5ff","#7c3aed"]].map(([bg,clr],i)=>(
          <div key={i} className="rounded-xl p-1.5" style={{background:bg}}>
            <div className="h-1.5 w-8 rounded-sm mb-1" style={{background:clr}}/>
            {[90,70,80].map((w,j)=><div key={j} className="h-1 rounded-sm bg-white mb-0.5" style={{width:`${w}%`}}/>)}
          </div>
        ))}
      </div>
    </div>
  );

  if (id === "clean_slate") return (
    <div className="bg-white w-full h-full px-3 py-4 font-sans">
      <div className="border-b border-gray-300 pb-2 mb-2">
        <div className="h-3 w-28 rounded-sm bg-gray-900 mb-0.5" />
        <div className="flex gap-2 mt-1">{[55,45,50].map((w,i)=><div key={i} className="h-1 rounded-sm bg-gray-400" style={{width:`${w}px`}}/>)}</div>
      </div>
      {["PROFILE","EXPERIENCE","EDUCATION","SKILLS"].map((s)=>(
        <div key={s} className="mb-2">
          <div className="text-[5px] font-bold tracking-[0.2em] text-gray-400 mb-1">{s}</div>
          <div className="pl-0 space-y-0.5">
            {[100,85,65].map((w,i)=><div key={i} className="h-1 rounded-sm bg-gray-100" style={{width:`${w}%`}}/>)}
          </div>
        </div>
      ))}
    </div>
  );

  // creative_agency (default)
  return (
    <div className="w-full h-full p-2" style={{ background: "#fff0f9" }}>
      <div className="bg-white/90 rounded-2xl h-full p-2">
        <div className="border-b-2 border-gray-900 pb-2 mb-2 flex justify-between items-end">
          <div>
            <div className="h-4 w-16 rounded-sm bg-gray-900 mb-0.5"/>
            <div className="h-4 w-20 rounded-sm" style={{background:"#db2777"}}/>
          </div>
          <div className="space-y-0.5 text-right">
            {[45,40].map((w,i)=><div key={i} className="h-1 rounded-sm bg-gray-300" style={{width:`${w}px`}}/>)}
          </div>
        </div>
        <div className="grid grid-cols-5 gap-1.5 h-[calc(100%-52px)]">
          <div className="col-span-2 space-y-1.5">
            {["ABOUT","SKILLS"].map(s=>(
              <div key={s}>
                <div className="h-2 w-10 rounded-sm mb-0.5" style={{background:s==="ABOUT"?"#fce7f3":"#dbeafe"}}/>
                {[80,65,55].map((w,i)=><div key={i} className="h-1 rounded-sm bg-gray-100 mb-0.5" style={{width:`${w}%`}}/>)}
              </div>
            ))}
          </div>
          <div className="col-span-3 border-l border-dashed border-gray-200 pl-1.5 space-y-1.5">
            {["EXP","EDU"].map(s=>(
              <div key={s}>
                <div className="h-2 w-10 rounded-sm mb-0.5" style={{background:s==="EXP"?"#fef9c3":"#dcfce7"}}/>
                {[100,80,60].map((w,i)=><div key={i} className="h-1 rounded-sm bg-gray-100 mb-0.5" style={{width:`${w}%`}}/>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────
export default function TemplatesPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { updateData, resetResume } = useResume();
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (searchParams.get("new") === "1") resetResume();
  }, [searchParams, resetResume]);

  const handleSelect = (id) => {
    setSelectedId(id);
    updateData("config", "template", id);
    setTimeout(() => router.push("/create/personalInfo"), 280);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Fixed ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #667eea, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #f093fb, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-10">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={16} className="text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">ขั้นตอนที่ 1 จาก 2</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-2">
            เลือกเทมเพลต<span className="text-indigo-600">เรซูเม่</span>
          </h1>
          <p className="text-gray-500 text-base max-w-lg">
            เลือกสไตล์ที่เหมาะกับสายงานของคุณ — ทุกเทมเพลตสามารถดาวน์โหลดเป็น PDF พร้อมส่ง HR ได้ทันที
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {templates.map((tpl) => {
            const isSelected = selectedId === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => handleSelect(tpl.id)}
                className="group text-left rounded-2xl overflow-hidden border bg-white transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: isSelected ? tpl.accent : "#e5e7eb",
                  boxShadow: isSelected
                    ? `0 0 0 2px ${tpl.accent}, 0 8px 30px ${tpl.accent}22`
                    : "0 1px 4px rgba(0,0,0,0.06)",
                  transform: isSelected ? "translateY(-3px)" : "translateY(0)",
                }}
              >
                {/* ── Mini preview ── */}
                <div
                  className="relative h-52 overflow-hidden border-b"
                  style={{ background: tpl.bg, borderColor: "#f3f4f6" }}
                >
                  <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-[1.03] origin-top">
                    <MiniResume id={tpl.id} accent={tpl.accent} />
                  </div>

                  {/* Tag badge */}
                  {tpl.tag && (
                    <div
                      className="absolute top-2.5 right-2.5 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white shadow-sm"
                      style={{ background: tpl.tagColor || tpl.accent }}
                    >
                      {tpl.tag}
                    </div>
                  )}

                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                      <div className="bg-white rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg text-sm font-bold" style={{ color: tpl.accent }}>
                        <CheckCircle2 size={15} />
                        กำลังโหลด...
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Info card ── */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-black text-gray-900 text-sm leading-tight">{tpl.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{tpl.desc}</p>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">เหมาะกับ</p>
                    <div className="flex flex-wrap gap-1">
                      {tpl.suitable.map((s) => (
                        <span
                          key={s}
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${tpl.accent}12`, color: tpl.accent }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    className="mt-3 w-full py-2 rounded-xl text-xs font-bold text-center transition-all duration-200"
                    style={{
                      background: isSelected
                        ? tpl.accent
                        : `${tpl.accent}10`,
                      color: isSelected ? "#fff" : tpl.accent,
                    }}
                  >
                    {isSelected ? "✓ เลือกแล้ว" : "ใช้เทมเพลตนี้"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
