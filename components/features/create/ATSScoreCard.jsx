"use client";

import { useEffect, useState } from "react";
import { checkATSScore } from "@/lib/ats-checker";
import { Gauge, Info, CheckCircle2, AlertCircle } from "lucide-react";

export default function ATSScoreCard({ resumeData }) {
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (resumeData) {
      setResults(checkATSScore(resumeData));
    }
  }, [resumeData]);

  if (!results) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-rose-500";
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]";
    if (score >= 50) return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]";
    return "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]";
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Gauge size={22} />
          </div>
          <h3 className="font-bold text-slate-800">ATS Score Checker</h3>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 cursor-help group relative">
          <Info size={16} />
          <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 leading-relaxed shadow-xl">
            คะแนน ATS ประเมินจากการมีอยู่ของคีย์เวิร์ดสำคัญที่ระบบคัดกรองส่วนใหญ่ค้นหา รวมถึงความสมบูรณ์ของข้อมูลในแต่ละส่วน
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative flex items-center justify-center mb-4">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-slate-100"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={364.4}
              strokeDashoffset={364.4 - (364.4 * results.score) / 100}
              className={`${getScoreColor(results.score)} transition-all duration-1000 ease-out`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-black ${getScoreColor(results.score)}`}>
              {results.score}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-700">ระดับความพร้อม: {results.score >= 80 ? 'ดีเยี่ยม' : results.score >= 50 ? 'ปานกลาง' : 'ควรปรับปรุง'}</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            คำแนะนำเพื่อเพิ่มคะแนน
          </h4>
          <ul className="space-y-2.5">
            {results.feedback.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs font-medium text-slate-600">
                <div className="mt-0.5">
                  <CheckCircle2 size={14} className="text-blue-500" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {results.matched_keywords.length > 0 && (
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
              คีย์เวิร์ดที่พบ ({results.matched_keywords.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {results.matched_keywords.slice(0, 8).map((kw, idx) => (
                <span key={idx} className="px-2 py-1 bg-white border border-slate-200 text-[10px] font-bold text-slate-500 rounded-md">
                  {kw}
                </span>
              ))}
              {results.matched_keywords.length > 8 && (
                <span className="text-[10px] font-bold text-slate-400 px-1 self-center">
                  +{results.matched_keywords.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
