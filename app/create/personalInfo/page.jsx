"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";
import { Save, Download, Share2, Check } from "lucide-react";

import { useResume } from "@/contexts/ResumeContext";
import ResumePreview from "@/components/create/ResumePreview";
import { incrementResumeView, incrementResumeDownload } from "@/app/actions/adminActions";

// Modular Sections
import PersonalInfoSection from "@/components/features/create/personalInfo/sections/PersonalInfoSection";
import ExperienceSection from "@/components/features/create/personalInfo/sections/ExperienceSection";
import EducationSection from "@/components/features/create/personalInfo/sections/EducationSection";
import SummarySection from "@/components/features/create/personalInfo/sections/SummarySection";
import SkillsSection from "@/components/features/create/personalInfo/sections/SkillsSection";
import { 
  LanguageSection, 
  CertificationSection, 
  ProjectSection 
} from "@/components/features/create/personalInfo/sections/MiscSections";

export default function ResumeBuilder() {
  const {
    data, updateData, updateArrayItem, addArrayItem, removeArrayItem,
    setInitialData, resumeId, setResumeId,
  } = useResume();

  const resumeRef                   = useRef(null);
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState("idle");   // idle | saving | saved | error
  const [uploadStatus, setUpload]   = useState("idle");   // idle | uploading | done | error
  const [copiedLink, setCopied]     = useState(false);
  const [lastSavedDataStr, setLastSavedDataStr] = useState("");

  // ── beforeunload warning ──
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (lastSavedDataStr && JSON.stringify(data) !== lastSavedDataStr) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [data, lastSavedDataStr]);

  // ── load resume from URL param ──
  useEffect(() => {
    (async () => {
      const id = new URLSearchParams(window.location.search).get("resumeId");
      if (id && id !== resumeId) {
        try {
          const res = await fetch(`/api/resume/load?id=${id}`);
          if (res.ok) {
            const { data: saved, resumeId: rid } = await res.json();
            setInitialData(saved);
            setResumeId(rid);
            setLastSavedDataStr(JSON.stringify(saved));
          }
        } catch (e) { console.error(e); }
      } else {
        setLastSavedDataStr(JSON.stringify(data));
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── print / PDF ──
  const triggerPrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: data.personal?.firstName
      ? `${data.personal.firstName}_Resume` : "My_Resume",
  });

  const handlePrint = async () => {
    triggerPrint();
    if (resumeId) await incrementResumeDownload(resumeId);
  };

  useEffect(() => {
    if (resumeId) incrementResumeView(resumeId);
  }, [resumeId]);

  // ── image upload ──
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUpload("uploading");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) { setUpload("error"); return; }
      const { url } = await res.json();
      updateData("personal", "profilePic", url);
      setUpload("done");
    } catch { setUpload("error"); }
  };

  const handleRemoveImage = () => {
    updateData("personal", "profilePic", "");
    setUpload("idle");
  };

  // ── save ──
  const handleSave = async () => {
    if (!data.config?.template) {
      toast.error("กรุณาเลือกเทมเพลตก่อนทำการบันทึก");
      return;
    }

    setSaveStatus("saving");
    try {
      const res = await fetch("/api/resume/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, data }),
      });
      if (!res.ok) { 
        setSaveStatus("error"); 
        toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        setTimeout(() => setSaveStatus("idle"), 3000); 
        return; 
      }
      const result = await res.json();
      if (!resumeId) setResumeId(result.resumeId);
      
      setSaveStatus("saved");
      setLastSavedDataStr(JSON.stringify(data));
      toast.success("บันทึกข้อมูลสำเร็จ!");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch { 
      setSaveStatus("error"); 
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
      setTimeout(() => setSaveStatus("idle"), 3000); 
    }
  };

  // ── copy link ──
  const handleCopy = () => {
    if (!resumeId) return;
    if (!data.personal?.firstName && !data.personal?.email) {
      toast.error("แนะนำให้กรอกชื่อหรืออีเมลย่างน้อย 1 อย่าง ก่อนสร้างลิงก์สำหรับแชร์");
    }
    navigator.clipboard.writeText(`${window.location.origin}/resume/${resumeId}`).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 3000);
    });
  };

  const saveBtn = {
    idle:   { label: "บันทึก",         cls: "bg-indigo-600 hover:bg-indigo-700 text-white" },
    saving: { label: "กำลังบันทึก...", cls: "bg-gray-400 cursor-not-allowed text-white" },
    saved:  { label: "บันทึกแล้ว!",   cls: "bg-green-500 text-white" },
    error:  { label: "ลองใหม่",        cls: "bg-red-500 hover:bg-red-600 text-white" },
  }[saveStatus];

  return (
    <div className="min-h-screen font-sans"
      style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#fafbff 60%,#f5f0ff 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* ══════════════════ LEFT: FORM ══════════════════ */}
          <div className="space-y-4 h-[calc(100vh-5.5rem)] overflow-y-auto pr-1 custom-scrollbar">

            {/* ── Step indicator ── */}
            <div className="flex items-center gap-2 text-xs text-indigo-500 font-bold pb-1">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
              ขั้นตอนที่ 2 จาก 2 — กรอกข้อมูล Resume
            </div>

            <PersonalInfoSection 
              data={data.personal} 
              updateData={updateData} 
              uploadStatus={uploadStatus}
              handleUpload={handleUpload}
              handleRemoveImage={handleRemoveImage}
            />

            <SummarySection 
              details={data.summary?.details} 
              updateData={updateData} 
            />

            <ExperienceSection 
              experiences={data.experiences} 
              updateArrayItem={updateArrayItem}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />

            <EducationSection 
              educations={data.educations} 
              updateArrayItem={updateArrayItem}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />

            <SkillsSection 
              list={data.skills?.list} 
              updateData={updateData} 
            />

            <LanguageSection 
              languages={data.languages} 
              updateArrayItem={updateArrayItem}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />

            <CertificationSection 
              certifications={data.certifications} 
              updateArrayItem={updateArrayItem}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />

            <ProjectSection 
              projects={data.projects} 
              updateArrayItem={updateArrayItem}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />

            <div className="h-8" />
          </div>

          {/* ══════════════════ RIGHT: PREVIEW ══════════════════ */}
          <div className="sticky top-6 flex flex-col gap-3 h-[calc(100vh-5.5rem)]">

            {/* Glassmorphic Action Bar */}
            <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-2xl shadow-md flex-wrap"
              style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.7)" }}>
              <div className="flex items-center gap-2">
                <button onClick={() => router.push(`/create/templates${resumeId ? `?resumeId=${resumeId}` : ''}`)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                  🎨 เปลี่ยนเทมเพลต
                </button>
                <button onClick={handleCopy} disabled={!resumeId}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
                style={copiedLink
                  ? { background: "#d1fae5", color: "#059669", border: "1px solid #6ee7b7" }
                  : { background: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb" }}>
                {copiedLink ? <Check size={12} /> : <span className="flex items-center gap-1.5"><Share2 size={12} />แชร์ลิงก์</span>}
                {copiedLink && "คัดลอกแล้ว!"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleSave} disabled={saveStatus === "saving"}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95 ${saveBtn.cls}`}>
                  {saveStatus === "saved" ? <Check size={12} /> : <Save size={12} />}
                  {saveBtn.label}
                </button>
                <button onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all hover:scale-105 active:scale-95">
                  <Download size={12} />
                  ดาวน์โหลด PDF
                </button>
              </div>
            </div>

            {/* Resume Preview */}
            <div className="flex-1 overflow-y-auto rounded-2xl shadow-xl border border-white/70 custom-scrollbar bg-white">
              <div ref={resumeRef} className="bg-white">
                <ResumePreview />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}