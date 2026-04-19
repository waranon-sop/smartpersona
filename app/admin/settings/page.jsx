import { Save, Globe, Shield, Activity, Lock, Users, ShieldAlert } from "lucide-react";
import pool from "@/lib/db";
import { updateSettings } from "@/app/admin/actions/adminActions";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let config = {};
  let dbError = null;

  try {
    // Create table if not exists to avoid fatal errors if running for the first time
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value TEXT
      )
    `);

    const [rows] = await pool.query("SELECT * FROM settings");
    rows.forEach((row) => {
      config[row.setting_key] = row.setting_value;
    });
  } catch (err) {
    dbError = err.message;
  }

  return (
    <div className="space-y-8 pb-10 max-w-5xl">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            ตั้งค่าแพลตฟอร์ม
          </h1>
          <p className="text-slate-500 font-medium">
             จัดการการตั้งค่าหลักและการอนุญาตต่างๆของระบบ
          </p>
        </div>
      </section>

      {dbError && (
        <div className="p-4 mb-8 bg-red-50 border border-red-200 rounded-xl flex items-center gap-4 text-red-600 shadow-sm">
           <ShieldAlert size={24} />
           <div>
              <p className="text-sm font-bold">ข้อผิดพลาดฐานข้อมูล</p>
              <p className="text-sm">{dbError}</p>
           </div>
        </div>
      )}

      <form action={updateSettings} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* General Settings */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
           <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                 <Globe size={18} />
              </div>
              <h3 className="font-semibold text-slate-800">ข้อมูลทั่วไป</h3>
           </div>
           
           <div className="p-6 space-y-6">
              <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-700">ชื่อเว็บไซต์ (Site Name)</label>
                 <input
                   name="site_name"
                   type="text"
                   defaultValue={config.site_name || "SmartPersona"}
                   className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-700">อีเมลติดต่อซัพพอร์ต (Support Email)</label>
                 <input
                   name="contact_email"
                   type="email"
                   defaultValue={config.contact_email || "admin@smartpersona.com"}
                   className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-700">คำอธิบายเว็บ (SEO Meta Description)</label>
                 <textarea
                   name="site_description"
                   rows="4"
                   defaultValue={config.site_description || "AI Resume Generation Platform"}
                   className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all resize-none shadow-sm"
                 />
              </div>
           </div>
        </div>

        {/* Access & Security */}
        <div className="space-y-8">
           <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                 <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <Shield size={18} />
                 </div>
                 <h3 className="font-semibold text-slate-800">ระบบและความปลอดภัย</h3>
              </div>

              <div className="p-6 space-y-4">
                 <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white shadow-sm rounded-lg flex items-center justify-center text-slate-600">
                          <Users size={18} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-800">เปิดรับสมัครสมาชิก</p>
                          <p className="text-xs text-slate-500 font-medium">อนุญาตให้บุคคลทั่วไปสมัครเป็นผู้ใช้ใหม่ได้</p>
                       </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="allow_registration" 
                        defaultChecked={config.allow_registration === 'true'} 
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white shadow-sm rounded-lg flex items-center justify-center text-red-600">
                          <Activity size={18} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-800">โหมดปรับปรุงเว็บไซต์</p>
                          <p className="text-xs text-slate-500 font-medium">ปิดการเข้าถึงหน้าเว็บชั่วคราว (Maintenance Mode)</p>
                       </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="maintenance_mode" 
                        defaultChecked={config.maintenance_mode === 'true'} 
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                 </div>

              </div>
           </div>

           {/* Save Action */}
           <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden p-6 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                 <h3 className="font-bold text-lg mb-1">บันทึกการตั้งค่า</h3>
                 <p className="text-slate-400 text-sm">การเปลี่ยนแปลงจะมีผลทันทีที่ระบบดาวน์โหลดเสร็จสิ้น</p>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 group"
              >
                <Save size={18} className="group-hover:scale-110 transition-transform" />
                ยืนยันการตั้งค่า
              </button>
           </div>
        </div>
      </form>
    </div>
  );
}
