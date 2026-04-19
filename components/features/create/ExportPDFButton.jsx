"use client";

import { useReactToPrint } from "react-to-print";
import { Download, FileDown, Loader2 } from "lucide-react";
import { useState } from "react";

export default function ExportPDFButton({ contentRef, title = "resume" }) {
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: title,
    onBeforeGetContent: () => setIsExporting(true),
    onAfterPrint: () => setIsExporting(false),
  });

  return (
    <button
      onClick={handlePrint}
      disabled={isExporting}
      className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group w-full"
    >
      {isExporting ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <FileDown size={18} className="group-hover:-translate-y-0.5 transition-transform" />
      )}
      {isExporting ? "กำลังเตรียมไฟล์..." : "ดาวน์โหลดเรซูเม่ (PDF)"}
    </button>
  );
}
