import { Users, FileText, Activity, TrendingUp, AlertCircle, ArrowUpRight, ShieldCheck, Database, LayoutGrid, Cpu, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import pool from '@/lib/db';
import LiveStats from '@/components/admin/LiveStats';
import { getSettings } from './actions/adminActions';
import QuickSettingsCard from './QuickSettingsCard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let dbConnected = false;
  let totalUsers = 0;
  let totalResumes = 0;
  let topTemplate = 'ไม่มีข้อมูล';
  let resumesToday = 0;
  let recentUsers = [];
  let dbError = null;
  let settings = {};

  try {
    const [
      [userRows],
      [resumeRows],
      [topTemplateRows],
      [todayRows],
      [recent],
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT COUNT(*) as count FROM resumes'),
      pool.query('SELECT template, COUNT(*) as count FROM resumes GROUP BY template ORDER BY count DESC LIMIT 1'),
      pool.query('SELECT COUNT(*) as count FROM resumes WHERE created_at >= CURDATE()'),
      pool.query('SELECT id, name, email, status, created_at as date FROM users ORDER BY created_at DESC LIMIT 5'),
    ]);

    totalUsers = userRows[0].count;
    totalResumes = resumeRows[0].count;
    topTemplate = topTemplateRows[0]?.template || "ไม่มีข้อมูล";
    resumesToday = todayRows[0]?.count || 0;
    recentUsers = recent.map((user) => ({
      ...user,
      // แปลงวันที่แบบไทย
      date: new Date(user.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
    }));
    dbConnected = true;

    // Fetch quick settings
    settings = await getSettings();
  } catch (err) {
    dbError = err.message;
  }

  const initialStats = {
    totalUsers,
    totalResumes,
    topTemplate,
    resumesToday
  };

  return (
    <div className="space-y-8 pb-10 max-w-7xl">
      {/* 1. Dashboard Header */}
      <section className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
         <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              ภาพรวมระบบ
            </h1>
            <p className="text-slate-500 font-medium max-w-lg">
              ยินดีต้อนรับกลับสู่ศูนย์ควบคุมส่วนกลาง ตรวจสอบความเคลื่อนไหวและภาพรวมของแพลตฟอร์มได้ที่นี่
            </p>
         </div>
         
         <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
               <div className={`w-3 h-3 rounded-full ${dbConnected ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`} />
               <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-700">สถานะฐานข้อมูล</span>
                  <span className={`text-[10px] font-medium uppercase ${dbConnected ? 'text-green-600' : 'text-red-500'}`}>
                     {dbConnected ? 'ออนไลน์ & เสถียร' : 'ขาดการเชื่อมต่อ'}
                  </span>
               </div>
            </div>
            <div className="w-[1px] h-8 bg-slate-100 mx-2" />
            <Link 
              href="/admin/users/new"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-blue-600/20"
            >
              เพิ่มผู้ใช้ใหม่
            </Link>
         </div>
      </section>

      {/* 2. Live Stats Grid */}
      <section>
         <LiveStats initialStats={initialStats} />
      </section>

      {/* 3. Main Workspace Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
         {/* Recent Users List */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-lg font-bold text-slate-800">ผู้ใช้งานล่าสุด</h3>
               <Link href="/admin/users" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">ดูผู้ใช้ทั้งหมด</Link>
            </div>
            
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">ผู้ใช้งาน</th>
                        <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">สถานะ</th>
                        <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">วันที่เข้าร่วม</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                                   {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                   <p className="font-semibold text-slate-800">{user.name}</p>
                                   <p className="text-sm text-slate-500">{user.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="py-4 px-6">
                             <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {user.status || 'ใช้งานอยู่'}
                             </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                             <p className="text-sm text-slate-600 font-medium">{user.date}</p>
                          </td>
                        </tr>
                      ))}
                      {recentUsers.length === 0 && (
                        <tr>
                          <td colSpan="3" className="py-12 text-center text-slate-500 text-sm">
                            ไม่พบรายชื่อผู้ใช้งานล่าสุด
                          </td>
                        </tr>
                      )}
                    </tbody>
                 </table>
               </div>
            </div>
         </div>

         {/* System Diagnostics */}
         <QuickSettingsCard settings={settings} />
      </div>
    </div>
  );
}
