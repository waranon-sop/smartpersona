"use client";

import React, { useState, useRef, useEffect } from 'react';
import ResumeRenderer from "@/components/features/resume/ResumeRenderer";
import { Eye, Code, Download } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useSearchParams } from 'next/navigation';

export default function ResumeDetailClient({ resumeData }) {
  const [showJson, setShowJson] = useState(false);
  const resumeRef = useRef(null);
  const searchParams = useSearchParams();

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: resumeData.personal?.firstName ? `${resumeData.personal.firstName}_Resume` : "Resume_Export",
  });

  // Auto-trigger print if redirected from list page
  useEffect(() => {
    if (searchParams.get('print') === 'true') {
      handlePrint();
    }
  }, [searchParams, handlePrint]);

  return (
    <div className="xl:col-span-2 space-y-4">
      {/* Visual Preview Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[800px]">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <h3 className="text-sm font-bold text-slate-700">
              ตัวอย่างฟอร์แมตเอกสาร
            </h3>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-bold border border-indigo-100">ขนาด A4</span>
             <button 
               onClick={handlePrint}
               className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:scale-105 cursor-pointer"
             >
               <Download size={14} />
               บันทึกเป็น PDF
             </button>
          </div>
        </div>
        
        {/* The Actual Resume Preview wrapper */}
        <div className="p-8 bg-slate-100 overflow-auto flex justify-center flex-1">
          <div className="w-full max-w-[800px] origin-top scale-[0.85] sm:scale-100 transition-transform shadow-xl hover:shadow-2xl duration-300">
            <div ref={resumeRef} className="bg-white rounded-sm">
              <ResumeRenderer data={resumeData} />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden/Subtle JSON section */}
      <div className="pt-2">
        <button 
          onClick={() => setShowJson(!showJson)}
          className="text-xs text-slate-400 hover:text-slate-600 font-medium flex items-center gap-1.5 transition-colors group px-3 py-2 rounded-lg hover:bg-slate-100 inline-flex"
        >
          <Code size={14} className="group-hover:text-blue-500 transition-colors" />
          {showJson ? "ซ่อนข้อมูล Debug JSON" : "แสดงข้อมูล Raw JSON"}
        </button>
        
        {showJson && (
          <div className="mt-2 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="px-4 py-2.5 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-300 tracking-wider">แพ็คข้อมูลโครงสร้างระบบ (System Configuration Data)</span>
              <span className="text-[10px] text-slate-500 font-mono italic">อ่านได้เท่านั้น (read-only)</span>
            </div>
            <div className="p-6 overflow-auto max-h-[400px] text-[12px] font-mono text-emerald-400 leading-relaxed CustomScrollbar">
              <pre className="whitespace-pre-wrap break-all">
                {JSON.stringify(resumeData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
