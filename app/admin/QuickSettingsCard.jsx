"use client";

import { useState, useTransition, useEffect } from "react";
import { ShieldCheck, UserPlus, FileWarning, Settings, Loader2 } from "lucide-react";
import { toggleQuickSetting, performLockdown } from "./actions/adminActions";
import { useRouter } from "next/navigation";

export default function QuickSettingsCard({ settings: initialSettings }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);
  
  // ใช้ Local State เพื่อให้ UI ตอบสนองทันที (Optimistic UI)
  const [localSettings, setLocalSettings] = useState(initialSettings || {});
  const [prevInitialSettings, setPrevInitialSettings] = useState(initialSettings);

  // อัปเดต Local State เมื่อ Props เปลี่ยน (หลัง Refresh) - ใช้วิธี Render-time sync แทน useEffect เพื่อเลี่ยง lint error
  if (initialSettings !== prevInitialSettings) {
    setLocalSettings(initialSettings || {});
    setPrevInitialSettings(initialSettings);
  }

  const handleToggle = (key, currentStrValue) => {
    const newValue = currentStrValue === "true" ? "false" : "true";
    
    // อัปเดตหน้าจอทันที
    setLocalSettings(prev => ({ ...prev, [key]: newValue }));
    
    startTransition(async () => {
      const res = await toggleQuickSetting(key, newValue);
      if (!res.success) {
        setLocalSettings(initialSettings || {});
        setError("ไม่สามารถเปลี่ยนค่าได้");
      }
      router.refresh();
    });
  };

  const handleExecuteLockdown = () => {
    // ดัน UI ให้เปลี่ยนสถานะ "ล็อคดาวน์" พร้อมกัน (ปิดสมัคร + เปิด maintenance)
    setLocalSettings(prev => ({
      ...prev,
      allow_registration: "false",
      maintenance_mode: "true"
    }));

    startTransition(async () => {
      const res = await performLockdown();
      if (res.success) {
        setShowConfirm(false);
        router.push("/admin?success=ระบบเข้าสู่โหมดล็อคดาวน์เรียบร้อยแล้ว");
        router.refresh();
      } else {
        setLocalSettings(initialSettings || {});
        setError(res.error || "เกิดข้อผิดพลาด");
        setShowConfirm(false);
      }
    });
  };

  // allow_registration = "true" หมายถึง "เปิดรับสมัคร" → ล็อค = เมื่อเป็น "false"
  const isRegistrationLocked = localSettings?.allow_registration !== "true";
  const maintenanceMode = localSettings?.maintenance_mode === "true";

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-800">แผงควบคุมระบบ (Quick Settings)</h3>
      
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 space-y-6">
         {error && (
           <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-medium animate-in fade-in">
             ❌ {error}
           </div>
         )}
         
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className={`p-2.5 rounded-xl transition-colors ${isRegistrationLocked ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                  <UserPlus size={20} />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-slate-800">ระงับการสมัครสมาชิก</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">ปิดการรับสมัครผู้ใช้ใหม่ทันที</p>
               </div>
            </div>
            <button 
               onClick={() => handleToggle("allow_registration", localSettings?.allow_registration)}
               disabled={isPending}
               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 cursor-pointer ${isRegistrationLocked ? 'bg-red-600' : 'bg-slate-300'}`}
            >
               <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isRegistrationLocked ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
         </div>

         <div className="flex items-center justify-between">
            {/* ... Maintenance ... */}
            <div className="flex items-center gap-4">
               <div className={`p-2.5 rounded-xl ${maintenanceMode ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                  <FileWarning size={20} />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-slate-800">โหมดปรับปรุง (Maintenance)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">บล็อกหน้าเว็บเพื่อซ่อมบำรุงฐานข้อมูล</p>
               </div>
            </div>
            <button 
               onClick={() => handleToggle("maintenance_mode", localSettings?.maintenance_mode)}
               disabled={isPending}
               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 cursor-pointer ${maintenanceMode ? 'bg-amber-500' : 'bg-slate-300'}`}
            >
               <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
         </div>

         {/* Emergency Actions */}
         <div className="pt-5 border-t border-slate-100">
            <div className="flex items-start gap-4 mb-4">
               <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <ShieldCheck size={20} />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-slate-800">โหมดป้องกันฉุกเฉิน</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                     ตัดการเชื่อมต่อและอายัดเซสชันของผู้ใช้งานที่กำลังออนไลน์ทั้งหมด
                  </p>
               </div>
            </div>
            
            {!showConfirm ? (
              <button 
                onClick={() => setShowConfirm(true)}
                disabled={isPending}
                className="w-full py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm flex justify-center items-center gap-2 cursor-pointer"
              >
                ดำเนินการล็อกดาวน์
              </button>
            ) : (
              <div className="space-y-3 animate-in zoom-in-95 duration-200">
                <p className="text-xs font-bold text-red-600 text-center bg-red-50 p-2 rounded-lg">
                  ⚠️ คุณแน่ใจหรือไม่? ระบบจะหยุดทำงานทันที!
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowConfirm(false)}
                    disabled={isPending}
                    className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button 
                    onClick={handleExecuteLockdown}
                    disabled={isPending}
                    className="flex-[2] py-2 bg-red-600 text-white rounded-lg font-bold text-xs hover:bg-red-700 transition-all shadow-md shadow-red-600/20 flex justify-center items-center gap-2 cursor-pointer"
                  >
                    {isPending && <Loader2 size={14} className="animate-spin" />}
                    {isPending ? "กำลังล็อคดาวน์..." : "ยืนยันการล็อคดาวน์"}
                  </button>
                </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
