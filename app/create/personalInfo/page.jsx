"use client";
import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";
import { Save, Download, Share2, Check, ZoomIn, ZoomOut, Loader2 } from "lucide-react";

import { useResume } from "@/contexts/ResumeContext";
import ResumePreview from "@/components/create/ResumePreview";
import { incrementResumeDownload } from "@/app/actions/statsActions";

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

// ── Progress Calculator ──
function calcProgress(data) {
  let score = 0;
  const total = 100;
  if (data.personal?.firstName?.trim()) score += 10;
  if (data.personal?.email?.trim()) score += 10;
  if (data.personal?.phone?.trim()) score += 5;
  if (data.personal?.profilePic) score += 10;
  if (data.summary?.details?.trim()) score += 15;
  if (data.skills?.list?.trim()) score += 15;
  const hasExp = (data.experiences || []).some(e => e.position?.trim() || e.company?.trim());
  if (hasExp) score += 20;
  const hasEdu = (data.educations || []).some(e => e.degree?.trim() || e.institution?.trim());
  if (hasEdu) score += 15;
  return Math.min(score, total);
}

// ── Progress Bar Component ──
function ProgressBar({ data }) {
  const progress = calcProgress(data);
  const color = progress < 40 ? "#ef4444" : progress < 70 ? "#f59e0b" : "#22c55e";
  const label = progress < 40 ? "เริ่มต้น" : progress < 70 ? "กำลังดี" : progress >= 100 ? "สมบูรณ์ ✨" : "เกือบเสร็จ";
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/60 border border-white/40 shadow-sm"
      style={{ backdropFilter: "blur(10px)" }}>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%`, backgroundColor: color }} />
      </div>
      <span className="text-[11px] font-bold whitespace-nowrap" style={{ color }}>
        {progress}% — {label}
      </span>
    </div>
  );
}

export default function ResumeBuilder() {
  const {
    data, updateData, updateArrayItem, addArrayItem, removeArrayItem, reorderArrayItem,
    setInitialData, resumeId, setResumeId,
  } = useResume();

  const resumeRef                   = useRef(null);
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState("idle");   // idle | saving | saved | error
  const [uploadStatus, setUpload]   = useState("idle");   // idle | uploading | done | error
  const [copiedLink, setCopied]     = useState(false);
  const [lastSavedDataStr, setLastSavedDataStr] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [zoomLevel, setZoomLevel]   = useState(100);      // 75 | 100 | 125
  const [autoSaveStatus, setAutoSaveStatus] = useState("idle"); // idle | saving | saved
  const autoSaveTimerRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  const validateForm = () => {
    const errors = {};
    if (!data.personal?.firstName?.trim()) errors.firstName = "กรุณากรอกชื่อ (ภาษาอังกฤษ)";
    if (!data.personal?.email?.trim()) errors.email = "กรุณากรอกอีเมล";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Check if data has changed from last save ──
  const hasUnsavedChanges = useMemo(() => {
    if (!lastSavedDataStr) return false;
    return JSON.stringify(data) !== lastSavedDataStr;
  }, [data, lastSavedDataStr]);

  // ── beforeunload warning ──
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // ── Auto-Save: debounced 3 seconds after changes ──
  useEffect(() => {
    // Skip auto-save on initial load
    if (isInitialLoadRef.current) return;
    // Only auto-save if we have a resumeId (already saved once) and data changed
    if (!resumeId || !lastSavedDataStr) return;
    if (JSON.stringify(data) === lastSavedDataStr) return;
    // Don't auto-save while manual save is in progress
    if (saveStatus === "saving") return;

    // Clear previous timer
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    autoSaveTimerRef.current = setTimeout(async () => {
      setAutoSaveStatus("saving");
      try {
        const res = await fetch("/api/resume/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeId, data }),
        });
        if (res.ok) {
          setLastSavedDataStr(JSON.stringify(data));
          setAutoSaveStatus("saved");
          setTimeout(() => setAutoSaveStatus("idle"), 2000);
        }
      } catch {
        // Silent fail for auto-save - don't interrupt user
        setAutoSaveStatus("idle");
      }
    }, 3000);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [data, resumeId, lastSavedDataStr, saveStatus]);

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
      // Mark initial load complete after a brief delay
      setTimeout(() => { isInitialLoadRef.current = false; }, 500);
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
    if (!validateForm()) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }
    triggerPrint();
    if (resumeId) await incrementResumeDownload(resumeId);
  };

  // removed incrementResumeView when editing

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
    if (!validateForm()) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

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
        const errData = await res.json().catch(() => ({}));
        setSaveStatus("error"); 
        toast.error(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${errData.detail || errData.message || ""}`);
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
  const handleCopy = async () => {
    if (!validateForm()) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนก่อนสร้างลิงก์สำหรับแชร์");
      return;
    }

    let currentId = resumeId;

    if (!currentId) {
      if (!data.config?.template) {
        toast.error("กรุณาเลือกเทมเพลตก่อนทำการบันทึกและแชร์");
        return;
      }
      toast.loading("กำลังบันทึกข้อมูลเพื่อสร้างลิงก์...", { id: "share-save" });
      setSaveStatus("saving");
      try {
        const res = await fetch("/api/resume/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeId: null, data }),
        });
        if (!res.ok) throw new Error("Save failed");
        const result = await res.json();
        currentId = result.resumeId;
        setResumeId(currentId);
        setSaveStatus("saved");
        setLastSavedDataStr(JSON.stringify(data));
        setTimeout(() => setSaveStatus("idle"), 3000);
        toast.success("บันทึกข้อมูลสำเร็จ!", { id: "share-save" });
      } catch (err) {
        setSaveStatus("error");
        toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล", { id: "share-save" });
        setTimeout(() => setSaveStatus("idle"), 3000);
        return;
      }
    }

    try {
      const pubRes = await fetch("/api/resume/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: currentId }),
      });
      
      if (!pubRes.ok) {
        toast.error("ไม่สามารถตั้งค่าให้ลิงก์เป็นสาธารณะได้");
        return;
      }

      await navigator.clipboard.writeText(`${window.location.origin}/resume/${currentId}`);
      setCopied(true); setTimeout(() => setCopied(false), 3000);
      toast.success("เรซูเม่ถูกตั้งเป็นสาธารณะ และคัดลอกลิงก์เรียบร้อยแล้ว!");
    } catch (err) {
      toast.error("ไม่สามารถคัดลอกลิงก์ได้อัตโนมัติ (Clipboard API ถูกบล็อก)");
    }
  };

  // ── Navigate with unsaved changes warning ──
  const handleNavigate = (url) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm("คุณมีข้อมูลที่ยังไม่ได้บันทึก ต้องการออกจากหน้านี้หรือไม่?");
      if (!confirmed) return;
    }
    router.push(url);
  };

  // ── Zoom controls ──
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 150));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));

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
              errors={validationErrors}
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
              reorderArrayItem={reorderArrayItem}
            />

            <EducationSection 
              educations={data.educations} 
              updateArrayItem={updateArrayItem}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              reorderArrayItem={reorderArrayItem}
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
              reorderArrayItem={reorderArrayItem}
            />

            <CertificationSection 
              certifications={data.certifications} 
              updateArrayItem={updateArrayItem}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              reorderArrayItem={reorderArrayItem}
            />

            <ProjectSection 
              projects={data.projects} 
              updateArrayItem={updateArrayItem}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              reorderArrayItem={reorderArrayItem}
            />

            <div className="h-8" />
          </div>

          {/* ══════════════════ RIGHT: PREVIEW ══════════════════ */}
          <div className="sticky top-6 flex flex-col gap-3 h-[calc(100vh-5.5rem)]">

            {/* Progress Bar */}
            <ProgressBar data={data} />

            {/* Glassmorphic Action Bar */}
            <div className="flex flex-col xl:flex-row items-center justify-between gap-4 px-6 py-4 rounded-2xl shadow-sm border border-indigo-100 bg-white/90 backdrop-blur-xl">
              
              {/* Left: Document Actions */}
              <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto pb-2 xl:pb-0">
                <button onClick={() => handleNavigate(`/create/templates${resumeId ? `?resumeId=${resumeId}` : ''}`)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors">
                  <span className="text-lg">🎨</span> เปลี่ยนเทมเพลต
                </button>
                
                <button onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
                  style={copiedLink
                    ? { background: "#dcfce7", color: "#166534" }
                    : { background: "#f3f4f6", color: "#4b5563" }}>
                  {copiedLink ? <Check size={16} /> : <Share2 size={16} />}
                  {copiedLink ? "คัดลอกแล้ว!" : "แชร์ลิงก์"}
                </button>

                {/* Zoom Controls */}
                <div className="hidden xl:flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
                  <button onClick={handleZoomOut} title="Zoom Out"
                    className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-gray-500 transition-all">
                    <ZoomOut size={16} />
                  </button>
                  <span className="text-[10px] font-bold text-gray-500 min-w-[35px] text-center">
                    {zoomLevel}%
                  </span>
                  <button onClick={handleZoomIn} title="Zoom In"
                    className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-gray-500 transition-all">
                    <ZoomIn size={16} />
                  </button>
                </div>

                {/* Auto-save indicator */}
                <div className="flex items-center min-w-[100px]">
                  {autoSaveStatus !== "idle" && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                      {autoSaveStatus === "saving" && <><Loader2 size={14} className="animate-spin text-indigo-400" /> กำลังบันทึก...</>}
                      {autoSaveStatus === "saved" && <><Check size={14} className="text-green-500" /> บันทึกล่าสุด</>}
                      {autoSaveStatus === "error" && <span className="text-red-500 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> บันทึกไม่สำเร็จ</span>}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Primary Actions */}
              <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
                <button onClick={handleSave} disabled={saveStatus === "saving"}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 ${saveBtn.cls}`}>
                  {saveStatus === "saved" ? <Check size={16} /> : <Save size={16} />}
                  {saveBtn.label}
                </button>
                
                <button onClick={handlePrint}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all hover:-translate-y-0.5 active:scale-95">
                  <Download size={16} />
                  PDF
                </button>
              </div>
            </div>

            {/* Resume Preview */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto rounded-2xl shadow-inner border border-gray-200 custom-scrollbar bg-gray-100 flex justify-center py-8 px-4">
              <div ref={resumeRef} 
                className="bg-white shadow-xl ring-1 ring-black/5 shrink-0 transition-transform duration-300 ease-out origin-top print:!transform-none print:!shadow-none print:!ring-0 print:!m-0 print:!p-0 print:!w-[210mm] print:!min-h-[297mm]" 
                style={{ 
                  width: '210mm', 
                  minHeight: '297mm',
                  transform: `scale(${zoomLevel / 100})`,
                }}>
                <ResumePreview />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}