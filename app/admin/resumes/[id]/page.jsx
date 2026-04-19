import {
  ArrowLeft,
  FileText,
  User as UserIcon,
  Calendar,
  Activity,
  Trash2,
  Eye,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import pool from "@/lib/db";
import DeleteConfirmForm from "@/components/admin/DeleteConfirmForm";
import { deleteResume } from "@/app/admin/actions/adminActions";
import ResumeDetailClient from "./ResumeDetailClient";

import { Suspense } from "react";

export default async function ViewResumePage({ params }) {
  const { id } = await params;
  let resume = null;
  let content = null;
  let errorMsg = null;

  try {
    // Fetch Resume Metadata + Author
    const [resumeRows] = await pool.query(
      `SELECT r.*, u.name as author_name, u.email as author_email 
       FROM resumes r 
       LEFT JOIN users u ON r.user_id = u.id 
       WHERE r.id = ?`,
      [id],
    );

    if (resumeRows.length === 0) {
      errorMsg = "ไม่พบเรซูเม่นี้ในระบบ";
    } else {
      resume = resumeRows[0];
      // Fetch Resume Content (Raw JSON Config)
      const [contentRows] = await pool.query(
        "SELECT * FROM resume_content WHERE resume_id = ?",
        [id],
      );
      if (contentRows.length > 0) {
        content = contentRows[0];
      }
    }
  } catch (err) {
    errorMsg = "เกิดข้อผิดพลาดในการโหลดข้อมูล: " + err.message;
  }

  if (errorMsg && !resume) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-200 shadow-sm max-w-5xl">
        <AlertCircle size={20} />
        {errorMsg}
        <Link href="/admin/resumes" className="ml-auto flex items-center gap-2 bg-white px-4 py-2 border border-red-200 rounded-lg shadow-sm text-sm font-semibold hover:bg-red-50 transition-colors">
          <ArrowLeft size={16} /> กลับไปหน้าเรซูเม่
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 max-w-5xl">
      {/* Header section with refined modern aesthetic */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/resumes"
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 rounded-xl transition-all shadow-sm group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="text-blue-500" size={24} />
              เรซูเม่: {resume.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-medium border border-slate-200/60">
                {resume.id}
              </span>
              <span>&bull;</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ${
                  resume.status === "Published"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : resume.status === "Draft"
                      ? "bg-slate-100 text-slate-600 border border-slate-200"
                      : "bg-orange-50 text-orange-600 border border-orange-200"
                }`}
              >
                {resume.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Stats Toolbar */}
          <div className="flex bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden divide-x divide-slate-100">
            <div className="px-5 py-2.5 flex flex-col items-center justify-center">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">
                <Eye size={12} className="inline mr-1" />
                ยอดเข้าชม
              </span>
              <span className="text-lg font-bold text-slate-800 leading-none">
                {resume.views ?? 0}
              </span>
            </div>
          </div>

          <DeleteConfirmForm
            action={deleteResume.bind(null, resume.id)}
            itemName={`เรซูเม่ "${resume.title}"`}
          >
            <button
              type="submit"
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-2 ml-2"
            >
              <Trash2 size={16} />
              ลบเอกสาร
            </button>
          </DeleteConfirmForm>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* Author Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <UserIcon size={16} className="text-slate-500" />
                <h3 className="text-sm font-bold text-slate-700">ข้อมูลผู้จัดทำ</h3>
             </div>
             <div className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm">
                  {(resume.author_name || "?").charAt(0)}
                </div>
                <div className="overflow-hidden flex-1">
                  <p
                    className="font-bold text-slate-800 truncate"
                    title={resume.author_name}
                  >
                    {resume.author_name || "ไม่ระบุชื่อ"}
                  </p>
                  <p
                    className="text-sm text-slate-500 truncate"
                    title={resume.author_email}
                  >
                    {resume.author_email || "ไม่ระบุอีเมล"}
                  </p>
                  <Link
                    href={`/admin/users/${resume.user_id}`}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold mt-1.5 inline-flex items-center gap-1 group"
                  >
                    ดูโปรไฟล์ผู้ใช้ <ArrowLeft size={10} className="rotate-135 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Meta Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <Activity size={16} className="text-slate-500" />
                <h3 className="text-sm font-bold text-slate-700">รายละเอียดเอกสาร</h3>
             </div>
            <div className="p-5 space-y-4 text-sm">
              <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-medium flex items-center gap-2">
                  <FileText size={14} className="text-slate-400" /> รูปแบบ (Template)
                </span>
                <span className="font-semibold text-slate-800">
                  {resume.template}
                </span>
              </div>
              <div className="flex justify-between items-center px-3 py-1">
                <span className="text-slate-500 font-medium flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" /> วันที่สร้าง
                </span>
                <span className="font-bold text-slate-700">
                  {new Date(resume.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric'})}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="xl:col-span-2 bg-slate-50 flex flex-col items-center justify-center min-h-[500px] border border-slate-200 rounded-2xl animate-pulse text-slate-400 space-y-4">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="font-semibold text-sm">กำลังโหลดตัวอย่างเอกสาร...</span>
            </div>
          }
        >
          <ResumeDetailClient
            resumeData={(() => {
              const safeParse = (val) => {
                if (!val) return {};
                if (typeof val === "object") return val;
                try {
                  return JSON.parse(val);
                } catch {
                  return {};
                }
              };
              return {
                config: safeParse(content?.config),
                personal: safeParse(content?.personal),
                education: safeParse(content?.education),
                experience: safeParse(content?.experience),
                summary: safeParse(content?.summary),
                skills: safeParse(content?.skills),
              };
            })()}
          />
        </Suspense>
      </div>
    </div>
  );
}
