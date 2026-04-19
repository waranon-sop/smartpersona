"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Menu,
  X,
  Search,
  Bell,
  Hexagon,
  CheckCheck
} from 'lucide-react';
import { useState, useTransition } from 'react';
import { markAllAsRead } from './actions/notificationActions';

export default function AdminLayoutClient({ children, user, initialNotifications = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error", e);
    }
    router.push("/");
  };

  const navItems = [
    { name: 'ภาพรวม', href: '/admin', icon: LayoutDashboard },
    { name: 'ผู้ใช้งาน', href: '/admin/users', icon: Users },
    { name: 'เรซูเม่', href: '/admin/resumes', icon: FileText },
    { name: 'ตั้งค่าระบบ', href: '/admin/settings', icon: Settings },
  ];

  const adminName = user?.name || "แอดมิน";
  const avatarLetter = adminName.charAt(0).toUpperCase();

  const handleMarkAsRead = async () => {
    startTransition(async () => {
      await markAllAsRead();
      setIsNotifOpen(false);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-700">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen z-40">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <Hexagon size={24} fill="currentColor" className="text-white/20" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
              SmartPersona
            </h1>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              คอนโซลผู้ดูแลระบบ
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-2">เมนูหลัก</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <item.icon 
                  size={20} 
                  className={`${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors`} 
                />
                <span className="text-sm">{item.name}</span>
                {isActive && (
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-xl mb-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-semibold text-slate-600">ระบบทำงานปกติ</span>
            </div>
            <p className="text-xs text-slate-500">v4.1.0-stable</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all w-full"
          >
            <LogOut size={18} />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 md:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            >
              <Menu size={20} />
            </button>
            
            <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 bg-slate-100 rounded-xl focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white border border-transparent focus-within:border-blue-200 transition-all w-72">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="ค้นหาผู้ใช้ หรือเรซูเม่..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-transparent border-none outline-none text-sm font-medium text-slate-800 w-full placeholder:font-normal placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                onBlur={() => setTimeout(() => setIsNotifOpen(false), 200)}
                className="relative p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all focus:outline-none"
              >
                <Bell size={20} />
                {initialNotifications.length > 0 && (
                  <div className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                     <h3 className="font-bold text-slate-800">การแจ้งเตือน</h3>
                     <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-md font-bold">{initialNotifications.length} ใหม่</span>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                     {initialNotifications.length > 0 ? (
                        <div className="divide-y divide-slate-50">
                           {initialNotifications.map((notif) => (
                             <Link key={notif.id} href={notif.link} className="block p-4 hover:bg-slate-50 transition-colors">
                                <p className="text-sm text-slate-700">{notif.message}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                  {new Date(notif.created_at).toLocaleString('th-TH')}
                                </span>
                             </Link>
                           ))}
                        </div>
                     ) : (
                        <div className="p-8 flex flex-col items-center justify-center text-center">
                           <Bell size={32} className="text-slate-200 mb-3" />
                           <p className="text-sm font-bold text-slate-600">ไม่มีการแจ้งเตือนใหม่</p>
                           <p className="text-[11px] text-slate-400 mt-1">คุณตรวจสอบการแจ้งเตือนทั้งหมดแล้ว</p>
                        </div>
                     )}
                  </div>

                  {initialNotifications.length > 0 && (
                    <div className="p-3 bg-slate-50/50 border-t border-slate-50 text-center flex justify-between gap-2">
                       <button 
                         onClick={handleMarkAsRead}
                         disabled={isPending}
                         className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-xl transition-all"
                       >
                         <CheckCheck size={14} /> อ่านทั้งหมดแล้ว
                       </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200 cursor-pointer group">
              <div className="flex flex-col items-end hidden sm:block">
                <span className="text-sm font-semibold text-slate-800 tracking-tight block max-w-[120px] truncate" title={adminName}>{adminName}</span>
                <span className="text-xs text-slate-500">ผู้ดูแลระบบ</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-600/20 group-hover:ring-4 ring-blue-50 transition-all">
                {avatarLetter}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        <div className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 md:hidden transition-opacity ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)} />
        <aside className={`fixed inset-y-0 left-0 w-72 bg-white z-[60] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Hexagon size={18} fill="currentColor" className="text-white/20" />
              </div>
              <h1 className="text-lg font-bold tracking-tight">SmartPersona</h1>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  pathname === item.href 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon size={20} className={pathname === item.href ? 'text-blue-600' : 'text-slate-400'} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content Scroll Surface */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-10 scroll-smooth custom-scrollbar relative">
          <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
