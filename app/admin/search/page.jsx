import { query } from "@/lib/db";
import Link from "next/link";
import { Users, FileText, Search as SearchIcon, ArrowRight, User, Eye, Calendar, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UniversalSearchPage({ searchParams }) {
  const params = await searchParams;
  const queryParam = params?.q || "";
  const searchTerm = `%${queryParam}%`;

  let users = [];
  let resumes = [];
  let error = null;

  if (queryParam) {
    try {
      const [userResults, resumeResults] = await Promise.all([
        query(
          "SELECT id, name, email, role, status, created_at FROM users WHERE name LIKE ? OR email LIKE ? LIMIT 10",
          [searchTerm, searchTerm]
        ),
        query(
          `SELECT r.*, u.name as author_name 
           FROM resumes r 
           LEFT JOIN users u ON r.user_id = u.id 
           WHERE r.title LIKE ? OR r.template LIKE ? OR u.name LIKE ?
           ORDER BY r.created_at DESC LIMIT 10`,
          [searchTerm, searchTerm, searchTerm]
        )
      ]);
      users = userResults;
      resumes = resumeResults;
    } catch (err) {
      console.error("Search Page Error:", err);
      error = "เกิดข้อผิดพลาดในการเชื่อมต่อ: " + err.message;
    }
  }

  return (
    <div className="space-y-10 pb-20 max-w-7xl">
      {/* Header Section */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-slate-400 mb-1">
          <SearchIcon size={18} />
          <span className="text-sm font-medium uppercase tracking-wider">Universal Search</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">
          ผลการค้นหาสำหรับ <span className="text-blue-600">"{queryParam}"</span>
        </h1>
        <p className="text-slate-500">พบผู้ใช้ {users.length} ราย และเรซูเม่ {resumes.length} ชุดที่ตรงกับคำค้นหาของคุณ</p>
      </section>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3">
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* 1. User Results Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Users size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">ผู้ใช้งาน</h2>
            </div>
            {users.length > 0 && (
              <Link href={`/admin/users?search=${queryParam}`} className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
                ดูทั้งหมด <ArrowRight size={14} />
              </Link>
            )}
          </div>

          <div className="space-y-3">
            {users.map((user) => (
              <Link 
                key={user.id} 
                href={`/admin/users?search=${user.name}`}
                className="group block bg-white border border-slate-100 p-4 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                    user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </Link>
            ))}
            {users.length === 0 && !error && (
              <div className="py-12 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                <p className="text-slate-400 font-medium">ไม่พบผู้ใช้งานที่ตรงกับ "{queryParam}"</p>
              </div>
            )}
          </div>
        </section>

        {/* 2. Resume Results Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <FileText size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">เรซูเม่</h2>
            </div>
            {resumes.length > 0 && (
              <Link href={`/admin/resumes?search=${queryParam}`} className="text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                ดูทั้งหมด <ArrowRight size={14} />
              </Link>
            )}
          </div>

          <div className="space-y-3">
            {resumes.map((resume) => (
              <Link 
                key={resume.id} 
                href={`/admin/resumes/${resume.id}`}
                className="group block bg-white border border-slate-100 p-5 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-lg">
                        {resume.title || "Untitled Resume"}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><User size={14} /> {resume.author_name}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="flex items-center gap-1"><Tag size={14} /> {resume.template}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                      resume.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {resume.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                      <span className="flex items-center gap-1"><Eye size={14} /> {resume.views || 0} วิว</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> 
                        {new Date(resume.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <div className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {resumes.length === 0 && !error && (
              <div className="py-12 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                <p className="text-slate-400 font-medium">ไม่พบเรซูเม่ที่ตรงกับ "{queryParam}"</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
