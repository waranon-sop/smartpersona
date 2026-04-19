"use client";

import { useState, useTransition } from "react";
import { ShieldCheck, UserPlus, FileWarning, Settings, Loader2 } from "lucide-react";
import { toggleQuickSetting, performLockdown } from "./actions/adminActions";
import { useRouter } from "next/navigation";

export default function QuickSettingsCard({ settings }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = (key, currentStrValue) => {
    const newValue = currentStrValue === "true" ? "false" : "true";
    startTransition(async () => {
      await toggleQuickSetting(key, newValue);
      router.refresh();
    });
  };

  const handleLockdown = () => {
    if (confirm("ดำเนินการล็อกดาวน์? การกระทำนี้จะเปิดโหมดซ่อมบำรุงและปิดรับสมัครสมาชิกทันที!")) {
      startTransition(async () => {
        await performLockdown();
        router.refresh();
      });
    }
  };

  const allowRegistration = settings?.allow_registration === "true";
  const maintenanceMode = settings?.maintenance_mode === "true";

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-800">แผงควบคุมระบบ (Quick Settings)</h3>
      
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 space-y-6">
         
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className={`p-2.5 rounded-xl ${allowRegistration ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                  <UserPlus size={20} />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-slate-800">ระบบสมัครสมาชิก</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">เปิดรับสมัครผู้ใช้ใหม่ทั่วไป</p>
               </div>
            </div>
            <button 
               onClick={() => handleToggle("allow_registration", settings?.allow_registration)}
               disabled={isPending}
               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${allowRegistration ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
               <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${allowRegistration ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
         </div>

         <div className="flex items-center justify-between">
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
               onClick={() => handleToggle("maintenance_mode", settings?.maintenance_mode)}
               disabled={isPending}
               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${maintenanceMode ? 'bg-amber-500' : 'bg-slate-300'}`}
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
            <button 
               onClick={handleLockdown}
               disabled={isPending}
               className="w-full py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors shadow-sm flex justify-center items-center gap-2"
            >
               {isPending && <Loader2 size={16} className="animate-spin" />}
               ดำเนินการล็อกดาวน์
            </button>
         </div>
      </div>
    </div>
  );
}
