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
    <div className="lg:col-span-2 space-y-4">
      {/* Visual Preview Container */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col min-h-[800px]">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Visual Preview
            </h3>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={handlePrint}
               className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
             >
               <Download size={14} />
               Download PDF
             </button>
             <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold border border-blue-100 uppercase">A4 Format</span>
          </div>
        </div>
        
        {/* The Actual Resume */}
        <div className="p-8 bg-gray-200 overflow-auto flex justify-center">
          <div className="w-full max-w-[800px] origin-top scale-[0.85] sm:scale-100 transition-transform shadow-2xl">
            <div ref={resumeRef} className="bg-white">
              <ResumeRenderer data={resumeData} />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden/Subtle JSON section as requested (minimalistic) */}
      <div className="pt-4 border-t border-gray-100">
        <button 
          onClick={() => setShowJson(!showJson)}
          className="text-xs text-gray-400 hover:text-blue-500 flex items-center gap-1.5 transition-colors group px-2 py-1 rounded-md hover:bg-blue-50"
        >
          <Code size={12} className="group-hover:rotate-12 transition-transform" />
          {showJson ? "Hide Debug Data" : "Inspect Raw JSON Config"}
        </button>
        
        {showJson && (
          <div className="mt-4 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Configuration Data</span>
              <span className="text-[10px] text-slate-500 font-mono italic">read-only</span>
            </div>
            <div className="p-6 overflow-auto max-h-[400px] text-[11px] font-mono text-blue-300 leading-relaxed">
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
