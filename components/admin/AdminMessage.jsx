"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, X } from "lucide-react";

export default function AdminMessage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("success");

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success || error) {
      // Use a timeout to avoid synchronous state update in effect warning
      const timer = setTimeout(() => {
        setMessage(success || error);
        setType(success ? "success" : "error");
      }, 10);

      // Auto-clear after 5 seconds (relative to the show time)
      const clearTimer = setTimeout(() => setMessage(null), 5010);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [searchParams]);

  if (!message) return null;

  return (
    <div 
      className={`fixed top-24 right-6 z-[100] animate-in fade-in slide-in-from-right-4 duration-300`}
    >
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border ${
        type === "success" 
          ? "bg-white border-green-100 text-green-800" 
          : "bg-white border-red-100 text-red-800"
      }`}>
        <div className={`p-2 rounded-xl ${
          type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
        }`}>
          {type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-0.5">
            {type === "success" ? "ดำเนินการสำเร็จ" : "เกิดข้อผิดพลาด"}
          </p>
          <p className="text-sm font-semibold">{message}</p>
        </div>

        <button 
          onClick={() => setMessage(null)}
          className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
