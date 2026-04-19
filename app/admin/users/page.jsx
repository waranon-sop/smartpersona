import { Search, Plus, Edit2, Trash2, Users, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import pool from "@/lib/db";
import { deleteUser } from "@/app/admin/actions/adminActions";
import DeleteConfirmForm from "@/components/admin/DeleteConfirmForm";

export const dynamic = "force-dynamic";

export default async function UsersManagementPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";
  const role = params?.role || "";
  const status = params?.status || "";

  const page = parseInt(params?.page || "1", 10) || 1;
  const ITEMS_PER_PAGE = 10;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  let users = [];
  let dbError = null;
  let totalItems = 0;
  let totalPages = 1;

  try {
    let whereClause = "WHERE 1=1";
    const queryParams = [];

    if (search) {
      whereClause += " AND (u.name LIKE ? OR u.email LIKE ?)";
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    if (role && role !== "All Roles") {
      whereClause += " AND u.role = ?";
      queryParams.push(role);
    }
    if (status && status !== "All Status") {
      whereClause += " AND u.status = ?";
      queryParams.push(status);
    }

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as count FROM users u ${whereClause}`,
      queryParams,
    );
    totalItems = countRows[0].count;
    totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.status, u.created_at,
        (SELECT COUNT(*) FROM resumes r WHERE r.user_id = u.id) as resumes
       FROM users u ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, ITEMS_PER_PAGE, offset],
    );

    users = rows.map((user) => ({
      ...user,
      joined: new Date(user.created_at).toLocaleDateString("th-TH", { day: 'numeric', month: 'short', year: 'numeric' }),
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
            จัดการผู้ใช้งาน
          </h1>
          <p className="text-slate-500 font-medium">
             ตรวจสอบและจัดการผู้ใช้งานที่ลงทะเบียนแล้วในระบบ จำนวน <span className="text-slate-800 font-bold">{totalItems}</span> คน
          </p>
        </div>
        
        <Link
          href="/admin/users/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all"
        >
          <Plus size={18} /> เพิ่มผู้ใช้ใหม่
        </Link>
      </section>

      {/* 2. Filter & Search Board */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
         <form method="GET" className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-1.5 focus-within:text-blue-600">
               <label className="text-xs font-semibold text-slate-600 ml-1">ค้นหาผู้ใช้งาน</label>
               <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                     <Search size={18} />
                  </div>
                  <input
                    type="text"
                    name="search"
                    defaultValue={search}
                    placeholder="ค้นหาด้วยชื่อ หรืออีเมล..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-400"
                  />
               </div>
            </div>
            
            <div className="flex flex-wrap sm:flex-nowrap items-end gap-3 w-full md:w-auto">
               <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 ml-1">บทบาท</label>
                  <select
                    name="role"
                    defaultValue={role || "All Roles"}
                    className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all"
                  >
                    <option value="All Roles">ทุกบทบาท</option>
                    <option value="Admin">ผู้ดูแลระบบ</option>
                    <option value="User">ผู้ใช้ทั่วไป</option>
                  </select>
               </div>
               
               <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 ml-1">สถานะ</label>
                  <select
                    name="status"
                    defaultValue={status || "All Status"}
                    className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all"
                  >
                    <option value="All Status">ทุกสถานะ</option>
                    <option value="Active">ใช้งานอยู่</option>
                    <option value="Inactive">ไม่ได้ใช้งาน</option>
                    <option value="Suspended">ถูกระงับ</option>
                  </select>
               </div>
               
               <button
                 type="submit"
                 className="px-6 py-3 bg-slate-800 text-white font-semibold text-sm rounded-xl hover:bg-slate-900 transition-all w-full md:w-auto"
               >
                 กรองข้อมูล
               </button>
               
               {(search || role || status) && (
                 <Link href="/admin/users" className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all" title="ล้างตัวกรอง">
                    <X size={20} />
                 </Link>
               )}
            </div>
         </form>
      </section>

      {/* 3. Users Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                 <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">ข้อมูลผู้ใช้</th>
                 <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">บทบาท</th>
                 <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">สถานะ</th>
                 <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">เรซูเม่</th>
                 <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">วันที่เข้าร่วม</th>
                 <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm mb-0.5">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700"
                    }`}>
                      {user.role === "Admin" ? "แอดมิน" : "ผู้ใช้ทั่วไป"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${
                         user.status?.toLowerCase() === "active" ? "bg-green-500" : "bg-slate-300"
                       }`} />
                       <span className="text-sm font-medium text-slate-700">
                          {user.status === "Active" ? "ใช้งานอยู่" : user.status === "Inactive" ? "ไม่ได้ใช้งาน" : "ถูกระงับ"}
                       </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center justify-center min-w-[2rem] h-8 px-3 text-sm font-semibold text-slate-700 bg-slate-100 rounded-full">
                       {user.resumes}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-sm text-slate-600 font-medium" suppressHydrationWarning>
                    {user.joined}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="แก้ไขข้อมูล"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <DeleteConfirmForm
                        action={deleteUser.bind(null, user.id)}
                        itemName={`ผู้ใช้ "${user.name}"`}
                      >
                        <button
                          type="button"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="ลบผู้ใช้"
                        >
                          <Trash2 size={18} />
                        </button>
                      </DeleteConfirmForm>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !dbError && (
                <tr>
                   <td colSpan="6" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                         <div className="p-4 bg-slate-50 rounded-full">
                            <Users size={32} className="text-slate-400" />
                         </div>
                         <p className="text-sm font-medium text-slate-500">ไม่พบผู้ใช้ที่ตรงกับเงื่อนไขการค้นหา</p>
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
                  href={`/admin/users?page=${page - 1}&search=${encodeURIComponent(search)}&role=${encodeURIComponent(role)}&status=${encodeURIComponent(status)}`}
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
                  href={`/admin/users?page=${page + 1}&search=${encodeURIComponent(search)}&role=${encodeURIComponent(role)}&status=${encodeURIComponent(status)}`}
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
