import { Search, FileText, Trash2, Eye, Download, ChevronLeft, ChevronRight, Database, ExternalLink, X } from "lucide-react";
import Link from "next/link";
import pool from "@/lib/db";
import { deleteResume } from "@/app/admin/actions/adminActions";
import DeleteConfirmForm from "@/components/admin/DeleteConfirmForm";

export const dynamic = "force-dynamic";

export default async function ResumesManagementPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";
  const template = params?.template || "";
  const status = params?.status || "";

  const page = parseInt(params?.page || "1", 10) || 1;
  const ITEMS_PER_PAGE = 10;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  let resumes = [];
  let dbError = null;
  let totalItems = 0;
  let totalPages = 1;

  try {
    let whereClause = "WHERE 1=1";
    const queryParams = [];

    if (search) {
      whereClause += " AND (r.title LIKE ? OR u.name LIKE ? OR r.id LIKE ?)";
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (template && template !== "ทุกรูปแบบ") {
      whereClause += " AND r.template = ?";
      // Because we map "All Templates" to "ทุกรูปแบบ" in UI, value in select should match.
      // Notice we keep the values in english to match DB easily, except we changed UI text value to "All Templates".
    }
    if (status && status !== "All Status") {
      whereClause += " AND r.status = ?";
      queryParams.push(status);
    }

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as count FROM resumes r LEFT JOIN users u ON r.user_id = u.id ${template && template !== "All Templates" ? " AND r.template = ?" : ""}`,
      template && template !== "All Templates" ? [...queryParams, template] : queryParams,
    );
    // Since I changed where logic above for template, I'll rewrite it cleanly without nested conditionals down below
  } catch(e) {}

  try {
    let whereClause = "WHERE 1=1";
    const queryParams = [];

    if (search) {
      whereClause += " AND (r.title LIKE ? OR u.name LIKE ? OR r.id LIKE ?)";
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (template && template !== "All Templates") {
      whereClause += " AND r.template = ?";
      queryParams.push(template);
    }
    if (status && status !== "All Status") {
      whereClause += " AND r.status = ?";
      queryParams.push(status);
    }

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as count FROM resumes r LEFT JOIN users u ON r.user_id = u.id ${whereClause}`,
      queryParams,
    );
    totalItems = countRows[0].count;
    totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

    const [rows] = await pool.query(
      `SELECT r.id, r.title, r.user_id, r.template, r.status, r.views, r.created_at, u.name as author_name
       FROM resumes r 
       LEFT JOIN users u ON r.user_id = u.id 
       ${whereClause}
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, ITEMS_PER_PAGE, offset],
    );

    resumes = rows.map((r) => ({
      ...r,
      date: new Date(r.created_at).toLocaleDateString("th-TH", { day: 'numeric', month: 'short', year: 'numeric' }),
    }));
  } catch (error) {
    dbError = error.message;
  }

  return (
    <div className="space-y-8 pb-10 max-w-7xl">
      {/* 1. Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            ฐานข้อมูลเรซูเม่
          </h1>
          <p className="text-slate-500 font-medium">
             เรียกดูข้อมูลเรซูเม่ทั้งหมด <span className="text-slate-800 font-bold">{totalItems}</span> ชุด ที่ถูกสร้างในแพลตฟอร์ม
          </p>
        </div>
        
        <a
          href="/api/admin/export-resumes"
          download
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-semibold shadow-sm transition-all"
        >
          <Download size={18} /> ส่งออกข้อมูล
        </a>
      </section>

      {/* 2. Filter & Search Board */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
         <form method="GET" className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-1.5 focus-within:text-indigo-600">
               <label className="text-xs font-semibold text-slate-600 ml-1">ค้นหาเรซูเม่</label>
               <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                     <Search size={18} />
                  </div>
                  <input
                    type="text"
                    name="search"
                    defaultValue={search}
                    placeholder="ค้นหาแบบเจาะจงด้วยชื่อเรื่อง, เจ้าของ, หรือ ID..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:bg-white transition-all placeholder:text-slate-400"
                  />
               </div>
            </div>
            
            <div className="flex flex-wrap sm:flex-nowrap items-end gap-3 w-full md:w-auto">
               <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 ml-1">รูปแบบ (Template)</label>
                  <select
                    name="template"
                    defaultValue={template || "All Templates"}
                    className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:bg-white transition-all"
                  >
                    <option value="All Templates">ทุกรูปแบบ</option>
                    <option value="modern">โมเดิร์น (Modern)</option>
                    <option value="classic">คลาสสิก (Classic)</option>
                    <option value="minimalist">มินิมอล (Minimalist)</option>
                    <option value="professional">มืออาชีพ (Professional)</option>
                  </select>
               </div>
               
               <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 ml-1">สถานะ</label>
                  <select
                    name="status"
                    defaultValue={status || "All Status"}
                    className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:bg-white transition-all"
                  >
                    <option value="All Status">ทุกสถานะ</option>
                    <option value="Draft">แบบร่าง (Draft)</option>
                    <option value="Published">เผยแพร่แล้ว</option>
                    <option value="Archived">จัดเก็บถาวร</option>
                  </select>
               </div>
               
               <button
                 type="submit"
                 className="px-6 py-3 bg-slate-800 text-white font-semibold text-sm rounded-xl hover:bg-slate-900 transition-all w-full md:w-auto shadow-sm"
               >
                 กรองข้อมูล
               </button>
               
               {(search || template || status) && (
                 <Link href="/admin/resumes" className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all" title="ล้างตัวกรอง">
                    <X size={20} />
                 </Link>
               )}
            </div>
         </form>
      </section>

      {/* 3. Resume Registry Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                 <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">รายละเอียดเอกสาร</th>
                 <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">เจ้าของ</th>
                 <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">สถานะ</th>
                 <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">สถิติ</th>
                 <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">วันที่สร้าง</th>
                 <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resumes.map((resume) => (
                <tr key={resume.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
                        <FileText size={22} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm mb-0.5">{resume.title || 'ไม่มีชื่อเอกสาร'}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">ID: {resume.id.substring(0, 8)}...</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 rounded uppercase tracking-wider">{resume.template}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-200 border border-white shadow-sm flex items-center justify-center text-xs font-bold text-slate-600">
                          {resume.author_name ? resume.author_name.charAt(0).toUpperCase() : '?'}
                       </div>
                       <span className="text-sm font-medium text-slate-700">{resume.author_name || "ไม่ทราบชื่อ"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      resume.status === 'Published' 
                        ? 'bg-green-100 text-green-800' 
                        : resume.status === 'Draft' 
                          ? 'bg-slate-100 text-slate-700' 
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {resume.status === 'Published' ? "เผยแพร่แล้ว" : resume.status === 'Draft' ? "แบบร่าง" : "จัดเก็บถาวร"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                     <div className="flex items-center justify-center">
                        <div className="flex flex-col items-center">
                           <span className="text-[10px] font-semibold text-slate-400 uppercase">ยอดเข้าชม</span>
                           <span className="text-sm font-bold text-slate-700">{resume.views || 0}</span>
                        </div>
                     </div>
                   </td>
                  <td className="py-4 px-6 text-right text-sm text-slate-600 font-medium" suppressHydrationWarning>
                    {resume.date}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/resumes/${resume.id}`}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="ดูเรซูเม่"
                      >
                        <Eye size={18} />
                      </Link>
                      <DeleteConfirmForm
                        action={deleteResume.bind(null, resume.id)}
                        itemName={`เรซูเม่ "${resume.title}"`}
                      >
                        <button
                          type="button"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="ลบเรซูเม่"
                        >
                          <Trash2 size={18} />
                        </button>
                      </DeleteConfirmForm>
                    </div>
                  </td>
                </tr>
              ))}
              {resumes.length === 0 && !dbError && (
                <tr>
                   <td colSpan="6" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                         <div className="p-4 bg-slate-50 rounded-full">
                            <Database size={32} className="text-slate-400" />
                         </div>
                         <p className="text-sm font-medium text-slate-500">ไม่พบข้อมูลเรซูเม่ที่ตรงกับเงื่อนไขการค้นหา</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-4 border border-slate-200 rounded-2xl shadow-sm">
           <div className="text-sm font-medium text-slate-500">
              หน้า <span className="font-bold text-slate-800">{page}</span> จาก <span className="font-bold text-slate-800">{totalPages}</span>
           </div>
           
           <div className="flex items-center gap-2">
              {page > 1 ? (
                <Link
                  href={`/admin/resumes?page=${page - 1}&search=${encodeURIComponent(search)}&template=${encodeURIComponent(template)}&status=${encodeURIComponent(status)}`}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft size={16} /> ก่อนหน้า
                </Link>
              ) : (
                <button className="flex items-center gap-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold text-slate-300 cursor-not-allowed" disabled>
                  <ChevronLeft size={16} /> ก่อนหน้า
                </button>
              )}
              
              {page < totalPages ? (
                <Link
                  href={`/admin/resumes?page=${page + 1}&search=${encodeURIComponent(search)}&template=${encodeURIComponent(template)}&status=${encodeURIComponent(status)}`}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  ถัดไป <ChevronRight size={16} />
                </Link>
              ) : (
                <button className="flex items-center gap-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold text-slate-300 cursor-not-allowed" disabled>
                  ถัดไป <ChevronRight size={16} />
                </button>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
